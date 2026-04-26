import { FastifyPluginAsync, FastifyBaseLogger } from "fastify";
import { z } from "zod";
import { writeAudit } from "../../plugins/audit.js";

// H1 (review): allowlist hosts per il webhook n8n. Evita SSRF se mai la
// URL diventa configurabile da utente o se NODE_ENV=development consente
// http://. In production esige https:// e (se settata) FEDSHIELD_N8N_ALLOWED_HOSTS.
function isSafeOutboundUrl(rawUrl: string, log: FastifyBaseLogger): boolean {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    log.warn({ rawUrl }, "n8n webhook URL malformata");
    return false;
  }

  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    log.warn({ rawUrl }, "n8n webhook in produzione deve essere HTTPS");
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    log.warn({ rawUrl, protocol: url.protocol }, "n8n webhook protocollo non ammesso");
    return false;
  }

  const allowed = (process.env.FEDSHIELD_N8N_ALLOWED_HOSTS || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length > 0 && !allowed.includes(url.hostname.toLowerCase())) {
    log.warn(
      { host: url.hostname, allowed },
      "n8n webhook host non in FEDSHIELD_N8N_ALLOWED_HOSTS",
    );
    return false;
  }
  return true;
}

const createProposalSchema = z.object({
  sourceId: z.string().optional(),
  normTitle: z.string().min(1),
  normReference: z.string().min(1),
  normText: z.string().optional(),
  changeSummary: z.string().min(1),
  proposedChanges: z.any().optional(),
});

const reviewSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  note: z.string().optional(),
});

// Schema risposta n8n AuditBot: validiamo prima di inoltrare al client
// per non propagare payload inattesi (XSS riflessi, prompt injection, etc.)
const n8nChatbotResponseSchema = z.object({
  answer: z.string().min(1).max(20000),
  source: z.string().max(64).optional(),
  citations: z
    .array(
      z.object({
        title: z.string().max(500).optional(),
        url: z.string().url().max(2000).optional(),
        snippet: z.string().max(2000).optional(),
      }),
    )
    .max(20)
    .optional(),
  // M2: validato come ISO 8601 stretto. Il client fa new Date(timestamp)
  // e mostrerebbe "Invalid Date" se il backend accettasse stringhe libere.
  timestamp: z.string().datetime().optional(),
});

const normSyncRoutes: FastifyPluginAsync = async (fastify) => {
  // Middleware: solo admin puo gestire proposte
  async function requireAdmin(request: any, reply: any) {
    const user = request.user;
    if (user?.role !== "admin") {
      return reply.forbidden("Solo admin possono gestire aggiornamenti normativi.");
    }
  }

  fastify.get(
    "/norm-sync/proposals",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request) => {
      const { status } = request.query as { status?: string };
      return fastify.prisma.normativePatchProposal.findMany({
        where: status ? { status: status as "pending" | "approved" | "rejected" } : {},
        orderBy: { createdAt: "desc" },
        include: { source: true },
      });
    },
  );

  fastify.get(
    "/norm-sync/proposals/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const proposal = await fastify.prisma.normativePatchProposal.findUnique({
        where: { id },
        include: { source: true },
      });
      if (!proposal) return reply.notFound("Proposta non trovata.");
      return proposal;
    },
  );

  fastify.post(
    "/norm-sync/proposals",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      // Verifica API key per n8n (o admin)
      const apiKey = request.headers["x-api-key"] as string;
      const expectedKey = process.env.FEDSHIELD_N8N_API_KEY;
      const user = request.user;

      if (apiKey !== expectedKey && user?.role !== "admin") {
        return reply.unauthorized("API key non valida.");
      }

      const parsed = createProposalSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Dati proposta non validi.");
      }

      const created = await fastify.prisma.normativePatchProposal.create({
        data: parsed.data,
      });
      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth.sub,
        action: "normProposal.create",
        entityType: "normativePatchProposal",
        entityId: created.id,
        data: { source: apiKey === expectedKey ? "n8n" : "admin", ...parsed.data },
      });
      return reply.code(201).send(created);
    },
  );

  fastify.patch(
    "/norm-sync/proposals/:id/approve",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = reviewSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Dati revisione non validi.");
      }

      const proposal = await fastify.prisma.normativePatchProposal.findUnique({ where: { id } });
      if (!proposal) return reply.notFound("Proposta non trovata.");
      if (proposal.status !== "pending") {
        return reply.badRequest("La proposta e gia stata gestita.");
      }

      if (parsed.data.status === "approved") {
        // Applica patch: aggiungi item alle checklist
        try {
          // M5 (review): proposedChanges è già un valore JSON deserializzato
          // da Prisma, no deep-clone necessario. Se non è un array salta:
          // un oggetto/null porterebbe a iterare le chiavi e creare record garbage.
          const rawChanges = proposal.proposedChanges;
          const changes: Array<Record<string, any>> = Array.isArray(rawChanges)
            ? (rawChanges as Array<Record<string, any>>)
            : [];
          for (const change of changes) {
            if (change.checklistType === "training") {
              await fastify.prisma.trainingChecklistItem.create({
                data: {
                  templateId: change.templateId,
                  section: change.section || "safety_training",
                  domain: change.domain || "safety",
                  area: change.area,
                  question: change.question,
                  orderIndex: change.orderIndex || 999,
                  defaultSeverity: change.severity || 1,
                  defaultSanctionable: change.sanctionable || false,
                  normReference: proposal.normReference,
                },
              });
            } else {
              // Trova template esistente per ATECO
              const templates = await fastify.prisma.checklistTemplate.findMany({
                where: {
                  isActive: true,
                  macroGroup: change.macroGroup ?? null,
                },
                take: 1,
              });
              if (templates[0]) {
                await fastify.prisma.checklistItem.create({
                  data: {
                    templateId: templates[0].id,
                    section: change.section || "procedures_hygiene",
                    domain: change.domain || "both",
                    area: change.area,
                    question: change.question,
                    orderIndex: change.orderIndex || 999,
                    defaultSeverity: change.severity || 1,
                    defaultSanctionable: change.sanctionable || false,
                  },
                });
              }
            }
          }
        } catch (err) {
          fastify.log.error({ err, proposalId: proposal.id }, "Errore applicazione patch normativa");
          return reply.internalServerError("Errore nell'applicare la patch.");
        }
      }

      const auth = request.user;
      const updated = await fastify.prisma.normativePatchProposal.update({
        where: { id },
        data: {
          status: parsed.data.status,
          reviewedAt: new Date(),
          reviewedById: auth.sub ?? null,
        },
      });

      await writeAudit(fastify, {
        userId: auth.sub,
        action: parsed.data.status === "approved" ? "normProposal.approve" : "normProposal.reject",
        entityType: "normativePatchProposal",
        entityId: updated.id,
        data: { status: parsed.data.status, note: parsed.data.note },
      });

      return updated;
    },
  );

  fastify.patch(
    "/norm-sync/proposals/:id/reject",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const note = (request.body as { note?: string })?.note;
      const auth = request.user;
      const updated = await fastify.prisma.normativePatchProposal.update({
        where: { id },
        data: {
          status: "rejected",
          reviewedAt: new Date(),
          reviewedById: auth.sub ?? null,
        },
      });
      await writeAudit(fastify, {
        userId: auth.sub,
        action: "normProposal.reject",
        entityType: "normativePatchProposal",
        entityId: updated.id,
        data: { note },
      });
      return updated;
    },
  );

  // === CHATBOT PROXY ===
  fastify.post(
    "/chatbot/query",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { companyId, question, inspectionId, history } = request.body as {
        companyId?: string;
        question: string;
        inspectionId?: string;
        history?: { role: string; content: string }[];
      };

      if (!question || typeof question !== "string" || question.trim().length === 0) {
        return reply.badRequest("question obbligatoria.");
      }

      // H2 (review): length cap per evitare DoS lato CPU su marked.parse
      // (sia backend nel ramo fallback offline, sia desktop renderer).
      if (question.length > 4000) {
        return reply.badRequest("Domanda troppo lunga (max 4000 caratteri).");
      }

      const q = question.toLowerCase();

      // ── FALLBACK INTELLIGENTE OFFLINE ──
      // Risponde a dubbi comuni del consulente HSE senza bisogno di n8n/Ollama.
      const knowledge: Record<string, string> = {
        dpi: `Secondo il D.Lgs. 81/2008, art. 74, il datore di lavoro deve fornire i DPI gratuitamente. I lavoratori devono usarli obbligatoriamente; la mancata utilizzazione e sanzionabile (art. 55, comma 5-bis: arresto fino a 2 mesi o ammenda 300-1.500 €). Verifica sempre: idoneita, certificazione CE, libretto uso, formazione e stato di conservazione.`,
        "d.lgs. 81": `Il D.Lgs. 81/2008 e il Testo Unico sulla Sicurezza. Articoli chiave per il sopralluogo:
- art. 17: obblighi del datore di lavoro (nomina RSPP, DVR, formazione)
- art. 18: obblighi del preposto
- art. 36: formazione obbligatoria (4h generica + specifica)
- art. 45: sorveglianza sanitaria
- art. 55: sanzioni penali/amministrative
Mancanza DVR = reato (art. 55, c. 5-bis).`,
        dvr: `Il Documento di Valutazione dei Rischi (DVR) e obbligatorio per tutti i datori (art. 17). Deve essere:
1. Redatto prima dell'avvio dell'attivita
2. Revisionato in caso di infortuni, nuovi rischi, cambiamento processi
3. Consultabile dai lavoratori
Mancanza = reato (art. 55, c. 5-bis): arresto fino a 2 mesi o ammenda 300-1.500 €.`,
        formazione: `La formazione e obbligatoria per legge (D.Lgs. 81/08, art. 36):
- Generale: minimo 4 ore per tutti
- Specifica: varia in base al rischio (basso 4h, medio 8h, alto 12h)
- Aggiornamento: ogni 5 anni (rischio alto) o su richiesta RLS
Mancanza = sanzione amministrativa da 2.500 a 10.000 € (art. 55, c. 2).`,
        estintore: `Gli estintori devono essere:
- Collocati in posizioni visibili e accessibili (DM 10/03/1998)
- Controllati ogni 6 mesi (manutenzione ordinaria)
- Ricaricati ogni 5 anni (o dopo uso)
- Con cartello indicante il tipo e la classe di fuoco
Mancanza estintore idoneo = NC sanzionabile (art. 46 D.Lgs. 81/08).`,
        antincendio: `Gli addetti antincendio sono obbligatori in base al rischio incendio (D.Lgs. 81/08, art. 43):
- Rischio basso: formazione informale
- Rischio medio: 8 ore formazione pratica
- Rischio alto: 16 ore + esercitazioni periodiche
Verifica: piano emergenza, vie di esodo libere, segnaletica, estintori.`,
        haccp: `Per l'HACCP (Reg. CE 852/2004 + D.Lgs. 193/2007):
- Piano di autocontrollo con CCP identificati
- Registri temperature, pulizia, manutenzione
- Formazione specifica per manipolatori alimenti
- Allergeni: dichiarazione obbligatoria in etichetta e in loco
Sanzioni: da 3.000 a 24.000 € (art. 7 D.Lgs. 193/07).`,
        allergeni: `Gli allergeni alimentari (Reg. UE 1169/2011) devono essere:
- Dichiarati in etichetta (14 allergeni principali)
- Comunicati al consumatore anche senza confezione (ristoranti, bar)
- Gestiti in procedure HACCP per evitare contaminazioni incrociate
Mancanza = sanzione da 3.000 a 24.000 € (D.Lgs. 193/07, art. 7).`,
        sanzionabile: `Una NC e sanzionabile quando viola una norma cogente (D.Lgs. 81/08, Reg. CE 852/04, D.Lgs. 231/07, privacy, etc.).
Elementi che rendono sanzionabile:
1. Mancanza totale del documento/adempimento
2. Rischio concreto per la salute/sicurezza
3. Violazione di obblighi precisi per legge
4. Mancanza di formazione/documentazione/verifiche
In dubbio: segnala NC ma dai "mildness credit" se l'azienda ha iniziato correttive.`,
        "primo soccorso": `Il primo soccorso e regolato dal D.Lgs. 81/08, art. 43:
- Cassette pronto soccorso obbligatorie (contenuto DM 388/2000)
- Addetti nominati in numero adeguato
- Deve essere visibile la lista contenuti e la scadenza dei farmaci
Verifica presenza, completezza e accessibilita.`,
        preposto: `Il preposto (D.Lgs. 81/08, art. 19) deve:
- Sovrintendere all'osservanza delle norme
- Vigilare sull'uso corretto dei DPI
- Segnalare i pericoli al datore
- Non avere obbligo di formazione specifica (ma e consigliata)
Verifica: nomina scritta, comunicazione ai lavoratori, conoscenza dei rischi specifici.`,
        rspp: `L'RSPP (Responsabile Servizio Prevenzione e Protezione, D.Lgs. 81/08 art. 32-34) puo essere:
- Interno (dipendente con competenze)
- Esterno (consulente con attestato)
Deve redigere/aggiornare il DVR e coordinare la sorveglianza sanitaria.`,
        "sorveglianza sanitaria": `La sorveglianza sanitaria (D.Lgs. 81/08, art. 41) e obbligatoria per:
- Lavoratori esposti a rischi specifici (rumore, vibrazioni, amianto, lavoro notturno)
- Medico competente nominato dal datore
- Visite di idoneita prima dell'assunzione e periodiche
Mancanza = sanzione amministrativa.`,
        rumore: `Il rumore e regolato dal D.Lgs. 81/08, Titolo VIII, Capo I:
- Valutazione del rischio rumore obbligatoria se esposizione > 80 dB(A)
- DPI acustici se livello > 85 dB(A)
- Sorveglianza sanitaria se > 85 dB(A)
- Azioni riduttive tecniche/organizzative prioritarie rispetto ai DPI`,
        "lavoro in quota": `Il lavoro in quota (D.Lgs. 81/08, Titolo IV, Capo II):
- Obbligo di pianificazione sicurezza
- DPI anticaduta CE, verificati periodicamente
- Ponteggi/piattaforme conformi UNI EN
- Addetti formati specificamente
- Documento di valutazione rischi specifico
Rischio caduta = reato se manca DVR/prevenzione.`,
        "movimentazione manuale": `La movimentazione manuale dei carichi (D.Lgs. 81/08, Titolo VIII, Capo III):
- Valutazione rischio se carichi > 25 kg (uomini) o > 20 kg (donne)
- Formazione/informazione obbligatoria
- Mezzi di sollevamento se possibile
- Misure ergonomiche (altezza, distanza, ripetitivita)`,
        "documento unico": `Il Documento Unico di Valutazione dei Rischi Interferenze (DUVRI, D.Lgs. 81/08, art. 26) e obbligatorio quando piu imprese operano nello stesso luogo:
- Deve essere redatto dal committente/coordinatore
- Contiene interferenze rischi e misure di prevenzione
- Aggiornato in caso di variazioni
Mancanza = sanzione amministrativa e responsabilita penale in caso di infortuni.`,
        "sicurezza macchine": `Le macchine devono rispettare il D.Lgs. 17/2010 (attuazione Direttiva Macchine 2006/42/CE):
- CE e dichiarazione di conformita
- Libretto istruzioni in italiano
- Marcatura CE visibile
- Verifica periodica (manutenzione/sicurezza)
Mancanza marcia CE/protezioni = NC sanzionabile e rischio sequestro.`,
        elettrico: `Gli impianti elettrici (D.Lgs. 81/08, Titolo VIII, Capo IV + CEI 64-8):
- Verifica periodica (ogni 5 anni per BT, piu frequente se usura)
- Messa a terra e protezione contro contatti diretti/indiretti
- Quadri elettrici accessibili solo a personale autorizzato (PES/PAV)
- Presenza schemi elettrici aggiornati
Mancanza verifica/manutenzione = NC sanzionabile.`,
        privacy: `Privacy/GDPR (D.Lgs. 196/2003 + D.Lgs. 101/2018):
- Registro attivita trattamento (art. 30 GDPR)
- DPO obbligatorio solo per PA, grandi scale, monitoraggio sistematico
- Informativa ai dipendenti/clienti
- Misure tecniche/organizzative (art. 32)
- Violazione dati = notifica Garante entro 72h
Sanzioni: fino a 20M € o 4% fatturato mondiale.`,
        "231/2001": `Il D.Lgs. 231/2001 (responsabilita amministrativa enti) e applicabile se l'azienda ha piu di dipendenti/supera certi parametri (dipende dal reato). Richiede:
- Modello organizzativo 231
- Organismo di Vigilanza (ODV)
- Codice etico/disciplinare
- Formazione sensibilizzazione
Reati presupposto: frode fiscale, sicurezza lavoro, corruzione, etc.
In caso di ispezione, la mancata adozione del modello non e sanzionabile di per se, ma aumenta la responsabilita dell'ente.`,
        idoneita: `L'idoneita sanitaria (D.Lgs. 81/08, art. 41) deve essere:
- Accertata prima dell'assunzione
- Rinnovata periodicamente (frequenza decisa dal medico competente)
- Annotata sul libretto sanitario
- Specifica per rischi (lavoro notturno, amianto, DPI acustici, etc.)
Mancanza = sanzione amministrativa e rischio di infortunio.`,
        "libretto sanitario": `Il libretto sanitario e obbligatorio per:
- Lavoratori esposti ad agenti chimici, fisici, biologici (D.Lgs. 81/08)
- Deve essere conservato dal datore per 10 anni dopo fine rapporto
- Contiene visite di idoneita, vaccinazioni, esami
- Deve essere aggiornato dal medico competente`,
        emergenza: `Il Piano di Emergenza e di Evacuazione (D.Lgs. 81/08, art. 43):
- Deve essere redatto in base al rischio incendio/esplosione
- Affisso in luoghi visibili
- Esercitazioni periodiche (semestrali per rischio medio/alto)
- Vie di esodo libere, illuminate, segnalate
- Addetti primo soccorso/antincendio/evacuazione nominati`,
        estintori: `Gli estintori (DM 10/03/1998 e D.Lgs. 81/08, art. 46):
- Collocati a max 25m di distanza tra loro (a seconda del rischio)
- Verifica periodica ogni 6 mesi
- Ricarica ogni 5 anni
- Cartello con classe fuoco e istruzioni
- Accessibili, visibili, non ostruiti
Mancanza estintore funzionante = NC sanzionabile.`,
        "rischio chimico": `Il rischio chimico (D.Lgs. 81/08, Titolo IX):
- Valutazione per tutte le sostanze pericolose presenti
- Schede di sicurezza (SDS) disponibili
- DPI specifici (guanti, maschere, occhiali)
- Etichette e pittogrammi GHS
- Formazione specifica addetti
- Sorveglianza sanitaria se limite superato`,
        "rischio biologico": `Il rischio biologico (D.Lgs. 81/08, Titolo X):
- Valutazione specifica per settori sanitario, agroalimentare, laboratori
- Procedure disinfezione/stoccaggio
- Vaccinazioni obbligatorie (es. epatite B per sanita)
- DPI (guanti, camici, occhiali, maschere FFP2/3)
- Smaltimento rifiuti pericolosi (codici CER)`,
        "rischio vibrazioni": `Le vibrazioni (D.Lgs. 81/08, Titolo VIII, Capo II):
- Valutazione se esposizione supera i valori limite di azione
- Mani-braccia: 2,5 m/s2 (azione), 5 m/s2 (limite)
- Corpo intero: 0,5 m/s2 (azione), 1,15 m/s2 (limite)
- Misure tecniche/organizzative prioritarie
- Sorveglianza sanitarza obbligatoria se superato valore di azione`,
        attrezzi: `Gli attrezzi di lavoro (D.Lgs. 81/08, Titolo III, Capo II):
- Deve essere idoneo all'uso previsto
- Controlli periodici di manutenzione
- Istruzioni d'uso in italiano
- Operatori formati
- Protezioni originali funzionanti
Mancanza protezioni/originali = NC sanzionabile e rischio sequestro.`,
        "messa a terra": `La messa a terra (CEI 64-8, D.Lgs. 81/08):
- Obbligatoria per tutti gli impianti elettrici BT
- Resistenza di terra < 100 Ohm (uso medico) o < 300 Ohm (ordinario)
- Verificata con periodiche misurazioni
- Collegamento efficace a dispersore
- Conduttore di protezione verde-giallo visibile e continuo
Mancanza = NC sanzionabile (rischio shock elettrico).`,
        "lavoratori autonomi": `I lavoratori autonomi (D.Lgs. 81/08, art. 49):
- Valutazione rischi specifica (autocertificazione)
- Formazione adeguata
- DPI a proprio carico
- Ispezione INAIL/INL possibile
- Se lavorano in appalto: applicabile DUVRI/PSC`,
        "contratto d'appalto": `Per contratti d'appalto (D.Lgs. 81/08, art. 26 + D.Lgs. 231/2001 art. 25-septies/dies):
- DUVRI obbligatorio se interferenze
- PSC (Coordinatore sicurezza in fase progettazione/ed esecuzione)
- Verifica DURC/INAIL appaltatore
- Responsabilita solidale committente/appaltatore per infortuni
- Subappalto solo se previsto in contratto`,
        "dichiarazione conformita": `Per redigere una dichiarazione di conformita:
1. Identifica lo specifico requisito normativo (D.Lgs. 81/08, GDPR, HACCP, etc.)
2. Verifica presenza documentazione (DVR, registri, verbali, certificati)
3. Controlla stato effettivo (non solo sulla carta)
4. Evidenzia eventuali gap residui
5. Attribuisci una data di scadenza per eventuali azioni correttive
6. Firma con data, allega eventuali documenti
Ricorda: una dichiarazione di conformita NON esonera da responsabilita in caso di infortunio, ma dimostra buona fede e diligenza.`,
        giardinaggio: `Per il settore giardinaggio/agricoltura (D.Lgs. 81/08 + D.Lgs. 81/2008 specifiche per agricoltura):
- Trattori: patentino, ispezione periodica (art. 228)
- Fitofarmaci: patentino, DPI specifici (art. 240), stoccaggio
- Sollevamento carichi: verifica attrezzature
- Mietitrebbiatrici/trapani: protezioni originali
- Rischio biologico (zoonosi)
- Sorveglianza sanitaria per lavoratori stagionali`,
        catering: `Per il catering/banqueting:
- HACCP obbligatorio (Reg. CE 852/2004)
- Trasporto alimenti: temperatura controllata (catena del freddo)
- DPI per personale (guanti, copricapi, camici)
- Allergeni: comunicazione obbligatoria
- Registri autocontrollo (arrivi, temperature, pulizia/sanificazione)
- Formazione manipolatori obbligatoria
- Mancanza = sanzione da 3.000 a 24.000 €`,
        laboratorio: `Per laboratori (D.Lgs. 81/08 + D.Lgs. 193/2007 + CLP/REACH):
- Schede di sicurezza (SDS) per tutti i reagenti
- Cappe chimiche con verifica flusso annuale
- DPI specifici (guanti lab, occhiali, camici, maschere)
- Sostanze cancerogene/mutagene: autorizzazione, sorveglianza sanitaria
- Smaltimento rifiuti chimici/biologici (codici CER)
- Piano emergenza perversamenti/sversamenti
- Formazione specifica aggiornata annuale`,
        soppalco: `Il soppalco/camminamento deve rispettare (D.Lgs. 81/08, Titolo IV):
- Resistenza strutturale verificata
- Parapetti a 110 cm con soglia e corrimano
- Passerelle antisdrucciolo
- Segnalazione zona pericolosa
- Accesso limitato a personale autorizzato
- Ispezione periodica strutturale
Mancanza parapetti/robustezza = NC sanzionabile pericolo caduta.`,
      };

      function findAnswer(query: string): string | null {
        const clean = query.toLowerCase();
        // Cerca match esatto keyword
        for (const [key, text] of Object.entries(knowledge)) {
          if (clean.includes(key)) return text;
        }
        // Sinonimi/match parziali
        if (/\bdpi\b|\bcasco\b|\bocchiali\b|guanti|imbracatura/.test(clean)) return knowledge.dpi;
        if (/\bestintor/i.test(clean)) return knowledge.estintore;
        if (/\bsanzion|multa|penale|reato|arresto/i.test(clean)) return knowledge.sanzionabile;
        if (/\bdocumento unico\b|\bappalto\b|\bduvri\b|\bpsc\b/i.test(clean)) return knowledge["contratto d'appalto"];
        if (/\bconform|\bdichiaraz|\battestato/i.test(clean)) return knowledge["dichiarazione conformita"];
        if (/\brumore|decibel|db|acustic/i.test(clean)) return knowledge.rumore;
        if (/\belettric|impianto elettric|quadro elettric|cavo/i.test(clean)) return knowledge.elettrico;
        if (/\bvibrazion|martello pneumatic/i.test(clean)) return knowledge["rischio vibrazioni"];
        if (/\bchimic|sostanza|reagent|solvent|sd?s/i.test(clean)) return knowledge["rischio chimico"];
        if (/\bbiologic|batteri|virus|zoonos/i.test(clean)) return knowledge["rischio biologico"];
        if (/\bmacchin|utensil|segatrice|trapan|tornio/i.test(clean)) return knowledge["sicurezza macchine"];
        if (/\bmovimentaz|caric|sollevament|sollevare/i.test(clean)) return knowledge["movimentazione manuale"];
        if (/\bquota|alto|pontegg|pontile|gru|altezza/i.test(clean)) return knowledge["lavoro in quota"];
        if (/\bprimo soccor|ferita|cassett|medicazione/i.test(clean)) return knowledge["primo soccorso"];
        if (/\bmessa a terra|terra|impedenza|differenziale/i.test(clean)) return knowledge["messa a terra"];
        if (/\bprivacy|gdpr|dati personal|trattament/i.test(clean)) return knowledge.privacy;
        if (/\bsoppalco|camminament|passerell|parapett/i.test(clean)) return knowledge.soppalco;
        if (/\bhaccp|aliment|igiene|cucina|manipolator/i.test(clean)) return knowledge.haccp;
        if (/\bpesi|attrezz|attrezzo|martello|scal/i.test(clean)) return knowledge.attrezzi;
        if (/\bformazion|corso|aggiornament|attestato/i.test(clean)) return knowledge.formazione;
        if (/\bemergenz|evacuazion|incendio|esodo|uscita/i.test(clean)) return knowledge.emergenza;
        if (/\blibretto|sanitario|medico/i.test(clean)) return knowledge["libretto sanitario"];
        if (/\bidoneita|idoneo|visita|medico/i.test(clean)) return knowledge.idoneita;
        if (/\b231|modello organizzativo|odv|reato presuppost/i.test(clean)) return knowledge["231/2001"];
        if (/\bpreposto|sovrintend/i.test(clean)) return knowledge.preposto;
        if (/\brspp|responsabile.*serviz|coordinat/i.test(clean)) return knowledge.rspp;
        if (/\bsorveglianza|sanitaria|medico competen/i.test(clean)) return knowledge["sorveglianza sanitaria"];
        if (/\bdvr|valutazione.*rischi|documento.*valutazione/i.test(clean)) return knowledge.dvr;
        if (/\bd.lgs.*81|testo unico|sicurezza.*lavor|81.2008/i.test(clean)) return knowledge["d.lgs. 81"];
        if (/\bgardin|agricolt|trattor|fitofarmaco/i.test(clean)) return knowledge.giardinaggio;
        if (/\blaborator|laboratorio|reagent|chimic/i.test(clean)) return knowledge.laboratorio;
        if (/\bcaterin|banquet|ristor|bar|panett/i.test(clean)) return knowledge.catering;
        if (/\ballergen|intolleran|glutin|lattos/i.test(clean)) return knowledge.allergeni;
        if (/\bautonom|partita iva|libero professionist/i.test(clean)) return knowledge["lavoratori autonomi"];

        return null;
      }

      const answer = findAnswer(question);
      if (answer) {
        return reply.send({
          answer,
          source: "knowledge-base",
          timestamp: new Date().toISOString(),
        });
      }

      // Se nessun match ma c'e n8n configurato → prova n8n
      // Sicurezza: NON propagare il JWT del client. Backend → n8n autentica
      // server-side con FEDSHIELD_N8N_API_KEY (header X-API-KEY); il consulente
      // utente è già stato autenticato da fastify.authenticate sopra.
      const n8nWebhook = process.env.N8N_AUDITBOT_WEBHOOK;
      if (n8nWebhook && isSafeOutboundUrl(n8nWebhook, fastify.log)) {
        try {
          const n8nApiKey = process.env.FEDSHIELD_N8N_API_KEY;
          const headers: Record<string, string> = { "Content-Type": "application/json" };
          if (n8nApiKey) headers["X-API-KEY"] = n8nApiKey;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);
          let res: Response;
          try {
            res = await fetch(n8nWebhook, {
              method: "POST",
              headers,
              body: JSON.stringify({
                companyId,
                question,
                inspectionId,
                history: history || [],
              }),
              signal: controller.signal,
            });
          } finally {
            clearTimeout(timeoutId);
          }
          if (!res.ok) {
            throw new Error(`n8n responded with ${res.status}`);
          }
          const rawData = await res.json();
          const validated = n8nChatbotResponseSchema.safeParse(rawData);
          if (!validated.success) {
            fastify.log.warn(
              { issues: validated.error.issues, source: "n8n-auditbot" },
              "n8n chatbot response failed validation",
            );
            return reply.send({
              answer: `Il servizio AI remoto ha risposto con un formato inatteso.\n\nNon ho trovato una risposta specifica per "${question}" nella knowledge base locale.\nProva a riformulare con termini piu tecnici (es. "DPI", "DVR", "estintore", "formazione").`,
              source: "offline",
              timestamp: new Date().toISOString(),
            });
          }
          // Garantisce sempre un timestamp ISO valido al client (M2),
          // anche se n8n l'ha omesso.
          return reply.send({
            ...validated.data,
            timestamp: validated.data.timestamp ?? new Date().toISOString(),
          });
        } catch (e) {
          fastify.log.error({ err: e }, "Errore chiamata n8n AuditBot");
          return reply.send({
            answer: `Il servizio AI remoto non e al momento disponibile.\n\nNon ho trovato una risposta specifica per "${question}" nella knowledge base locale.\nProva a riformulare con termini piu tecnici (es. "DPI", "DVR", "estintore", "formazione") o annota il dubbio nelle note del sopralluogo per approfondimento successivo.`,
            source: "offline",
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Nessun match e nessun n8n → risposta generica ma utile
      return reply.send({
        answer: `Non ho trovato una risposta specifica per "${question}" nella knowledge base locale.\n\nProva a riformulare con termini piu specifici, oppure:\n• Cerca per argomento (es. "DPI", "estintore", "DVR", "formazione")\n• Durante il sopralluogo, se hai un dubbio su una NC, usa il campo note dell'ispezione per annotarlo e rivederlo dopo con documentazione specifica.`,
        source: "fallback",
        timestamp: new Date().toISOString(),
      });
    },
  );
};

export default normSyncRoutes;
