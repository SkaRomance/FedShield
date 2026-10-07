/**
 * normativeDocumentCatalog.ts
 *
 * Catalogo normativo esaustivo dei documenti obbligatori e propedeutici per le aziende italiane.
 * Organizzato nelle 4 macro-aree richieste:
 * 1. BASE_AUTORIZZATIVA: Documenti propedeutici e autorizzativi all'apertura
 * 2. HACCP_ALIMENTARE: Igiene alimentare, autocontrollo e registri (Reg. CE 852/04, 178/02, 1169/11)
 * 3. SICUREZZA_81_08: Sicurezza sul lavoro, DVR, VDR specifiche e nomine (D.Lgs. 81/08)
 * 4. ACQUE_LEGIONELLA: Piano di Sicurezza delle Acque e rischio Legionellosi (D.Lgs. 18/2023 e L.G. 2015)
 */

export type DocumentCategory =
  | "base_autorizzativa"
  | "haccp_alimentare"
  | "sicurezza_81_08"
  | "acque_legionella";

export interface MinimumContentItem {
  id: string;
  label: string;
  normArticle: string;
  description?: string;
}

export interface NormativeDocumentDefinition {
  id: string;
  name: string;
  category: DocumentCategory;
  normReference: string;
  description: string;
  isRequiredDefault: boolean;
  /** Se true, si applica prevalentemente al settore alimentare */
  isFoodSpecific?: boolean;
  /** Se true, si applica prevalentemente all'edilizia / cantieri */
  isConstructionSpecific?: boolean;
  /** Se true, si applica se ci sono impianti specifici o ricettività/apertura al pubblico */
  isPublicFacilitySpecific?: boolean;
  /** Contenuti minimi che devono essere presenti nel documento secondo la legge */
  minimumContents?: MinimumContentItem[];
}

export const DOCUMENT_CATEGORIES_INFO: Record<
  DocumentCategory,
  {
    key: DocumentCategory;
    title: string;
    subtitle: string;
    icon: string;
    badgeColor: string;
    normScope: string;
  }
> = {
  base_autorizzativa: {
    key: "base_autorizzativa",
    title: "Documentazione Base & Autorizzativa",
    subtitle: "Titoli abilitativi, agibilità, planimetrie e conformità impianti per l'apertura",
    icon: "🏛️",
    badgeColor: "#0284c7",
    normScope: "D.Lgs. 222/2016 • D.P.R. 380/01 • D.M. 37/08 • D.P.R. 462/01",
  },
  haccp_alimentare: {
    key: "haccp_alimentare",
    title: "Igiene Alimentare & Autocontrollo HACCP",
    subtitle: "Manuale HACCP con contenuti minimi, registri, allergeni e tracciabilità",
    icon: "🍽️",
    badgeColor: "#16a34a",
    normScope: "Reg. CE 852/2004 • Reg. CE 178/2002 • Reg. UE 1169/2011 • Reg. CE 1935/04",
  },
  sicurezza_81_08: {
    key: "sicurezza_81_08",
    title: "Sicurezza sul Lavoro D.Lgs. 81/2008",
    subtitle: "DVR con contenuti minimi art. 28, nomine, VDR rischi specifici, emergenze e DPI",
    icon: "🦺",
    badgeColor: "#ea580c",
    normScope: "D.Lgs. 81/2008 e s.m.i. • D.M. 02/09/2021 • D.M. 01/09/2021",
  },
  acque_legionella: {
    key: "acque_legionella",
    title: "Piano Sicurezza Acque & Rischio Legionella",
    subtitle: "Water Safety Plan, valutazione impianto idrico, campionamenti e manutenzione",
    icon: "💧",
    badgeColor: "#2563eb",
    normScope: "D.Lgs. 18/2023 (Acque Potabili) • Linee Guida Legionellosi 2015",
  },
};

export const NORMATIVE_DOCUMENTS_CATALOG: NormativeDocumentDefinition[] = [
  // =========================================================================
  // 1. BASE AUTORIZZATIVA
  // =========================================================================
  {
    id: "base-visura",
    name: "Visura Camerale aggiornata",
    category: "base_autorizzativa",
    normReference: "L. 580/1993 e R.D. 2011/1934",
    description: "Verifica oggetto sociale, sede legale/operative, compagine societaria e poteri del legale rappresentante.",
    isRequiredDefault: true,
  },
  {
    id: "base-scia",
    name: "SCIA di Inizio Attività / Notifica Sanitaria / Titolo Abilitativo",
    category: "base_autorizzativa",
    normReference: "D.Lgs. 222/2016, art. 19 L. 241/90 e Reg. CE 852/04 art. 6",
    description: "Titolo autorizzativo per l'esercizio dell'attività d'impresa e registrazione sanitaria SUAP/ASL.",
    isRequiredDefault: true,
  },
  {
    id: "base-planimetria",
    name: "Planimetria aggiornata dei locali con layout e destinazioni d'uso",
    category: "base_autorizzativa",
    normReference: "D.Lgs. 81/2008 Allegato IV punto 1.2 e Reg. CE 852/04 All. II",
    description: "Planimetria in scala con quote, destinazione funzionale degli ambienti, percorsi e uscite.",
    isRequiredDefault: true,
  },
  {
    id: "base-agibilita",
    name: "Certificato di Agibilità / Destinazione d'Uso urbanistica",
    category: "base_autorizzativa",
    normReference: "D.P.R. 380/2001 (Testo Unico Edilizia), art. 24",
    description: "Attestazione delle condizioni di sicurezza, igiene, salubrità e conformità edilizio-urbanistica.",
    isRequiredDefault: true,
  },
  {
    id: "base-dico-elettrico",
    name: "Dichiarazione di Conformità Impianto Elettrico (DICO D.M. 37/08)",
    category: "base_autorizzativa",
    normReference: "D.M. 37/2008, art. 7 e D.Lgs. 81/2008 art. 80",
    description: "Dichiarazione a regola d'arte dell'impianto elettrico con allegati obbligatori rilasciata dall'installatore.",
    isRequiredDefault: true,
  },
  {
    id: "base-messa-a-terra",
    name: "Verbale Verifica Periodica Messa a Terra e Scariche Atmosferiche",
    category: "base_autorizzativa",
    normReference: "D.P.R. 462/2001, art. 4 e D.Lgs. 81/2008 art. 86",
    description: "Omologazione e verbale di verifica periodica biennale/quinquennale rilasciato da Organismo Abilitato o ASL/ARPA.",
    isRequiredDefault: true,
  },
  {
    id: "base-cpi-antincendio",
    name: "Certificato di Prevenzione Incendi (CPI) o SCIA Antincendio",
    category: "base_autorizzativa",
    normReference: "D.P.R. 151/2011",
    description: "Titolo autorizzativo antincendio VVF per attività soggette (Attività riportate in Allegato I DPR 151/11).",
    isRequiredDefault: false,
  },
  {
    id: "base-dico-gas",
    name: "Dichiarazione di Conformità Impianto Gas / Riscaldamento / Canne Fumarie",
    category: "base_autorizzativa",
    normReference: "D.M. 37/2008 e norme UNI CIG 8723 / UNI 7129",
    description: "DICO per apparecchiature di cottura industriali a gas, caldaie e impianti termici di aerazione.",
    isRequiredDefault: false,
  },
  {
    id: "base-aua-ambientale",
    name: "Autorizzazione Unica Ambientale (AUA) / Scarichi idrici / Emissioni",
    category: "base_autorizzativa",
    normReference: "D.P.R. 59/2013 e D.Lgs. 152/2006 (Testo Unico Ambientale)",
    description: "Autorizzazione per scarichi reflui industriali/assimilati in fognatura, emissioni in atmosfera e impatto acustico.",
    isRequiredDefault: false,
  },

  // =========================================================================
  // 2. IGIENE ALIMENTARE E HACCP
  // =========================================================================
  {
    id: "haccp-manuale",
    name: "Manuale di Autocontrollo Aziendale HACCP",
    category: "haccp_alimentare",
    normReference: "Reg. CE 852/2004, art. 5 e Codex Alimentarius",
    description: "Piano aziendale di autocontrollo basato sui 7 principi del sistema HACCP con analisi pericoli e CCP.",
    isRequiredDefault: true,
    isFoodSpecific: true,
    minimumContents: [
      {
        id: "h-mc-1",
        label: "Descrizione azienda, elenco locali, planimetria e attrezzature impiegate",
        normArticle: "Reg. CE 852/2004, All. II, Cap. I-II",
      },
      {
        id: "h-mc-2",
        label: "Diagrammi di flusso per ogni tipologia di processo (ricevimento, stoccaggio, cottura, somministrazione)",
        normArticle: "Reg. CE 852/2004, art. 5 c. 2 lett. a",
      },
      {
        id: "h-mc-3",
        label: "Analisi di tutti i pericoli (biologici, chimici, fisici e allergenici) e valutazione gravità/probabilità",
        normArticle: "Reg. CE 852/2004, art. 5 c. 2 lett. a",
      },
      {
        id: "h-mc-4",
        label: "Identificazione dei Punti Critici di Controllo (CCP) e Limiti Critici misurabili",
        normArticle: "Reg. CE 852/2004, art. 5 c. 2 lett. b-c",
      },
      {
        id: "h-mc-5",
        label: "Procedure di monitoraggio costante dei CCP e Azioni Correttive predeterminate",
        normArticle: "Reg. CE 852/2004, art. 5 c. 2 lett. d-e",
      },
      {
        id: "h-mc-6",
        label: "Piano e procedura di sanificazione (prodotti, diluizioni, tempi di contatto e frequenze)",
        normArticle: "Reg. CE 852/2004, All. II, Cap. V",
      },
      {
        id: "h-mc-7",
        label: "Piano di monitoraggio e lotta agli infestanti (Pest Control) con mappa trappole ed esche",
        normArticle: "Reg. CE 852/2004, All. II, Cap. IX",
      },
      {
        id: "h-mc-8",
        label: "Gestione allergeni (Reg. UE 1169/11): cartello/menù esposto e matrice ingredienti con contaminazioni crociate",
        normArticle: "Reg. UE 1169/2011, art. 44 e D.Lgs. 231/2017",
      },
      {
        id: "h-mc-9",
        label: "Gestione MOCA: dichiarazioni di conformità per imballaggi, pellicole, piatti e contenitori",
        normArticle: "Reg. CE 1935/2004 e D.Lgs. 29/2017",
      },
      {
        id: "h-mc-10",
        label: "Procedura di Rintracciabilità a monte/valle (Reg. CE 178/02) e gestione Ritiro/Richiamo prodotto",
        normArticle: "Reg. CE 178/2002, artt. 18-19",
      },
      {
        id: "h-mc-11",
        label: "Gestione scarti alimentari, oli esausti e sottoprodotti di origine animale (SOA)",
        normArticle: "Reg. CE 852/2004 All. II Cap. VI e Reg. CE 1069/2009",
      },
      {
        id: "h-mc-12",
        label: "Programma di formazione continua del personale alimentare (OSA e addetti)",
        normArticle: "Reg. CE 852/2004, All. II, Cap. XII",
      },
    ],
  },
  {
    id: "haccp-registro-temp",
    name: "Registro Monitoraggio Temperature (Frigoriferi, Congelatori, Abbattitore)",
    category: "haccp_alimentare",
    normReference: "Reg. CE 852/2004, All. II, Cap. IX",
    description: "Schede di registrazione quotidiana delle temperature degli impianti di conservazione positiva e negativa.",
    isRequiredDefault: true,
    isFoodSpecific: true,
  },
  {
    id: "haccp-registro-sanificazione",
    name: "Registro / Schede di avvenuta Sanificazione periodica",
    category: "haccp_alimentare",
    normReference: "Reg. CE 852/2004, All. II, Cap. V",
    description: "Tracciamento della pulizia e disinfezione ordinaria e straordinaria di superfici, cappe, filtri e locali.",
    isRequiredDefault: true,
    isFoodSpecific: true,
  },
  {
    id: "haccp-pest-control",
    name: "Verbali Interventi Ditta Esterna Pest Control & Planimetria Esche",
    category: "haccp_alimentare",
    normReference: "Reg. CE 852/2004, All. II, Cap. IX",
    description: "Verbali periodici della ditta specializzata di derattizzazione e disinfestazione con schede tossicologiche.",
    isRequiredDefault: true,
    isFoodSpecific: true,
  },
  {
    id: "haccp-analisi-alimenti",
    name: "Rapporti di Prova Analisi Microbiologiche Alimenti & Tamponi Superficiali",
    category: "haccp_alimentare",
    normReference: "Reg. CE 2073/2005 sui criteri microbiologici",
    description: "Referti periodici di laboratorio accreditato su matrici alimentari lavorate e tamponi ambientali.",
    isRequiredDefault: true,
    isFoodSpecific: true,
  },
  {
    id: "haccp-conformita-moca",
    name: "Dichiarazioni di Conformità MOCA fornite dai produttori/fornitori",
    category: "haccp_alimentare",
    normReference: "Reg. CE 1935/2004, Reg. UE 10/2011 e D.Lgs. 29/2017",
    description: "Certificazioni di idoneità alimentare per carta forno, imballaggi, pellicole, contenitori take-away e stoviglie.",
    isRequiredDefault: true,
    isFoodSpecific: true,
  },
  {
    id: "haccp-schede-tecniche-chimici",
    name: "Schede Tecniche e di Sicurezza (SDS) Prodotti Chimici di Pulizia",
    category: "haccp_alimentare",
    normReference: "Reg. CE 1907/2006 (REACH) e Reg. CE 1272/2008 (CLP)",
    description: "Schede a 16 punti dei detergenti, disincrostanti e disinfettanti impiegati con dosaggi e tempi di contatto.",
    isRequiredDefault: true,
    isFoodSpecific: true,
  },
  {
    id: "haccp-attestati-formazione",
    name: "Attestati Formazione Alimentaristi (HACCP OSA e Addetti)",
    category: "haccp_alimentare",
    normReference: "Reg. CE 852/2004 All. II Cap. XII e Normative Regionali",
    description: "Attestati di formazione obbligatoria in corso di validità per tutti gli addetti che manipolano alimenti.",
    isRequiredDefault: true,
    isFoodSpecific: true,
  },

  // =========================================================================
  // 3. SICUREZZA SUL LAVORO (D.LGS. 81/2008)
  // =========================================================================
  {
    id: "sec-dvr",
    name: "DVR - Documento di Valutazione dei Rischi",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, artt. 17 e 28",
    description: "Documento fondamentale per la valutazione di tutti i rischi presenti in azienda e piano delle misure di tutela.",
    isRequiredDefault: true,
    minimumContents: [
      {
        id: "dvr-mc-1",
        label: "Relazione esaustiva su tutti i rischi per la sicurezza e la salute presenti in azienda, con data certa",
        normArticle: "D.Lgs. 81/2008, art. 28 c. 2 lett. a",
      },
      {
        id: "dvr-mc-2",
        label: "Indicazione puntuale delle misure di prevenzione e protezione attuate e dei DPI individuali adottati",
        normArticle: "D.Lgs. 81/2008, art. 28 c. 2 lett. b",
      },
      {
        id: "dvr-mc-3",
        label: "Programma dinamico delle misure per il miglioramento nel tempo dei livelli di sicurezza aziendali",
        normArticle: "D.Lgs. 81/2008, art. 28 c. 2 lett. c",
      },
      {
        id: "dvr-mc-4",
        label: "Individuazione delle procedure per l'attuazione delle misure e ruoli dell'organizzazione aziendale",
        normArticle: "D.Lgs. 81/2008, art. 28 c. 2 lett. d",
      },
      {
        id: "dvr-mc-5",
        label: "Nominativi formalizzati di RSPP, RLS o RLST, Medico Competente e Addetti alle Emergenze",
        normArticle: "D.Lgs. 81/2008, art. 28 c. 2 lett. e",
      },
      {
        id: "dvr-mc-6",
        label: "Valutazione del rischio Stress Lavoro-Correlato secondo la metodologia approvata dalla Commissione Consultiva",
        normArticle: "D.Lgs. 81/2008, art. 28 c. 1 e indicazioni ministeriali",
      },
      {
        id: "dvr-mc-7",
        label: "Valutazione lavoratrici madri, gestanti e puerpere (D.Lgs. 151/01) e minori (L. 977/67)",
        normArticle: "D.Lgs. 81/2008 art. 28 c. 1 e D.Lgs. 151/2001",
      },
      {
        id: "dvr-mc-8",
        label: "Valutazione delle differenze di genere, età, provenienza da altri paesi e tipologia contrattuale",
        normArticle: "D.Lgs. 81/2008, art. 28 c. 1",
      },
    ],
  },
  {
    id: "sec-nomina-rspp",
    name: "Lettera di Nomina RSPP (Interno / Esterno / Datore di Lavoro)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, artt. 17, 31, 32 e 34",
    description: "Nomina formale del Responsabile del Servizio di Prevenzione e Protezione con attestati di formazione/aggiornamento.",
    isRequiredDefault: true,
  },
  {
    id: "sec-verbale-rls",
    name: "Verbale di Elezione/Designazione RLS o comunicazione RLST",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, artt. 47 e 50",
    description: "Documentazione di nomina del Rappresentante dei Lavoratori per la Sicurezza aziendale o territoriale (comunicazione INAIL).",
    isRequiredDefault: true,
  },
  {
    id: "sec-nomina-medico",
    name: "Lettera di Nomina Medico Competente e Protocollo Sanitario",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, artt. 18, 25 e 41",
    description: "Incarico del Medico Competente iscritto all'Elenco Nazionale con piano di sorveglianza sanitaria correlato ai rischi.",
    isRequiredDefault: true,
  },
  {
    id: "sec-piano-emergenza",
    name: "Piano di Emergenza ed Evacuazione (PEE) & Planimetrie",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, art. 43 e D.M. 02/09/2021",
    description: "Procedure organizzative e operative per fronteggiare emergenze, incendi ed evacuazione rapida dei locali.",
    isRequiredDefault: true,
    minimumContents: [
      {
        id: "pee-mc-1",
        label: "Azioni che i lavoratori e il personale addetto devono compiere in caso di allarme ed emergenza",
        normArticle: "D.M. 02/09/2021, Allegato II",
      },
      {
        id: "pee-mc-2",
        label: "Provvedimenti specifici per l'esodo e l'assistenza alle persone con ridotta mobilità o disabilità",
        normArticle: "D.M. 02/09/2021, Allegato II punto 2.3",
      },
      {
        id: "pee-mc-3",
        label: "Planimetrie di evacuazione esposte con indicazione percorsi, uscite di sicurezza e presidi antincendio",
        normArticle: "D.M. 02/09/2021, Allegato II",
      },
      {
        id: "pee-mc-4",
        label: "Disposizioni per la chiamata dei servizi di soccorso esterni (112) e fornitura informazioni necessarie",
        normArticle: "D.M. 02/09/2021",
      },
      {
        id: "pee-mc-5",
        label: "Verbale di effettuazione della prova periodica di evacuazione (almeno una volta all'anno)",
        normArticle: "D.M. 02/09/2021, Allegato II punto 2.4",
      },
    ],
  },
  {
    id: "sec-registro-antincendio",
    name: "Registro dei Controlli Antincendio (Decreto Controlli)",
    category: "sicurezza_81_08",
    normReference: "D.M. 01/09/2021 (Decreto Controlli) e D.P.R. 151/2011",
    description: "Tracciamento della sorveglianza e dei controlli semestrali su estintori, idranti, porte REI e luci di emergenza.",
    isRequiredDefault: true,
  },
  {
    id: "sec-vdr-chimico",
    name: "Valutazione Specifica Rischio Chimico (art. 223 D.Lgs. 81/08)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, Titolo IX, Capo I, artt. 221-232",
    description: "Valutazione dei pericoli chimici legati a prodotti di pulizia, disinfezione o lavorazione con schede SDS a 16 punti.",
    isRequiredDefault: true,
    minimumContents: [
      {
        id: "vdr-c-1",
        label: "Censimento completo di tutti gli agenti chimici pericolosi detenuti e utilizzati nei vari reparti",
        normArticle: "D.Lgs. 81/2008, art. 223 c. 1 lett. a",
      },
      {
        id: "vdr-c-2",
        label: "Raccolta e disponibilità delle Schede Dati di Sicurezza (SDS) aggiornate a 16 punti (Reg. REACH/CLP)",
        normArticle: "D.Lgs. 81/2008, art. 223 c. 1 lett. b",
      },
      {
        id: "vdr-c-3",
        label: "Calcolo e qualificazione del livello di rischio per la salute e sicurezza (Metodo MoVaRisCh o analogo)",
        normArticle: "D.Lgs. 81/2008, art. 223 c. 1",
      },
      {
        id: "vdr-c-4",
        label: "Individuazione delle misure di prevenzione, stoccaggio in sicurezza (armadi areati/bacini) e DPI adeguati",
        normArticle: "D.Lgs. 81/2008, artt. 224-225",
      },
    ],
  },
  {
    id: "sec-vdr-rumore",
    name: "Valutazione Rischio Rumore (Relazione Fonometrica)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, Titolo VIII, Capo II, artt. 187-198",
    description: "Relazione tecnica con misurazioni del livello di esposizione quotidiana personale (Lex,8h) e picco.",
    isRequiredDefault: false,
  },
  {
    id: "sec-vdr-vibrazioni",
    name: "Valutazione Rischio Vibrazioni (Mano-Braccio e Corpo Intero)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, Titolo VIII, Capo III, artt. 199-205",
    description: "Valutazione delle vibrazioni trasmesse al sistema mano-braccio (HAV) o corpo intero (WBV).",
    isRequiredDefault: false,
  },
  {
    id: "sec-vdr-mmc",
    name: "Valutazione Rischio Movimentazione Manuale Carichi (MMC / NIOSH)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, Titolo VI, artt. 167-171 e ISO 11228",
    description: "Valutazione delle attività di sollevamento pesi, traino/spinta carrelli o movimenti ripetitivi arti superiori.",
    isRequiredDefault: true,
  },
  {
    id: "sec-verbali-dpi",
    name: "Verbali di Consegna dei DPI firmati dai lavoratori",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, artt. 76, 77 e 79",
    description: "Moduli firmati dai dipendenti per ricevuta dei Dispositivi di Protezione Individuale e relativo addestramento.",
    isRequiredDefault: true,
  },
  {
    id: "sec-giudizi-idoneita",
    name: "Cartelle e Giudizi di Idoneità alla Mansione rilasciati dal Medico",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, art. 41",
    description: "Certificati di idoneità lavorativa con eventuali prescrizioni/limitazioni per ciascun lavoratore soggetto a sorveglianza.",
    isRequiredDefault: true,
  },
  {
    id: "sec-riunione-periodica",
    name: "Verbale della Riunione Periodica di Sicurezza (art. 35)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, art. 35",
    description: "Verbale dell'incontro annuale tra Datore di Lavoro, RSPP, Medico Competente e RLS (obbligatorio > 15 dipendenti).",
    isRequiredDefault: false,
  },
  {
    id: "sec-duvri",
    name: "DUVRI - Valutazione Rischi Interferenti per Ditte Esterne / Appalti",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, art. 26",
    description: "Documento unico per eliminare i rischi di interferenza con imprese appaltatrici o lavoratori autonomi in sede.",
    isRequiredDefault: false,
  },
  {
    id: "sec-pos-cantieri",
    name: "POS - Piano Operativo di Sicurezza (per Edilizia / Cantieri)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, Titolo IV, art. 89 e art. 96",
    description: "Documento di dettaglio della sicurezza per le lavorazioni di cantiere redatto dall'impresa esecutrice.",
    isRequiredDefault: false,
    isConstructionSpecific: true,
  },

  // =========================================================================
  // 4. PIANO SICUREZZA ACQUE & LEGIONELLA
  // =========================================================================
  {
    id: "acque-psa",
    name: "Piano di Sicurezza delle Acque (Water Safety Plan - D.Lgs. 18/2023)",
    category: "acque_legionella",
    normReference: "D.Lgs. 18/2023, art. 9 e Linee Guida Ministero della Salute 2015",
    description: "Valutazione e gestione del rischio del sistema idrico di distribuzione interna per garantire salubrità e prevenire Legionella.",
    isRequiredDefault: true,
    isPublicFacilitySpecific: true,
    minimumContents: [
      {
        id: "wsp-mc-1",
        label: "Descrizione dettagliata dell'impianto idrico interno (reti di adduzione fredda e produzione acqua calda)",
        normArticle: "D.Lgs. 18/2023, Allegato II punto 1",
      },
      {
        id: "wsp-mc-2",
        label: "Mappatura dello schema idrico e censimento dei punti critici (terminali docce, rubinetti, rompigetto, boiler, accumuli)",
        normArticle: "D.Lgs. 18/2023, Allegato II e Linee Guida 2015",
      },
      {
        id: "wsp-mc-3",
        label: "Nomina formale del Responsabile del sistema idrico di distribuzione interna (GIDI / Responsabile Autocontrollo)",
        normArticle: "D.Lgs. 18/2023, art. 9",
      },
      {
        id: "wsp-mc-4",
        label: "Valutazione specifica del rischio di proliferazione di Legionella pneumophila (temperature, ristagni, rami morti)",
        normArticle: "Linee Guida Nazionali Legionellosi 2015, par. 2-3",
      },
      {
        id: "wsp-mc-5",
        label: "Registro degli interventi di manutenzione programmata (decalcificazione periodica, spurghi, pulizia boiler)",
        normArticle: "D.Lgs. 18/2023 e Linee Guida 2015, par. 5",
      },
      {
        id: "wsp-mc-6",
        label: "Procedure di disinfezione ordinarie e straordinarie (shock termico o trattamenti chimici con biossido/cloro)",
        normArticle: "Linee Guida Nazionali Legionellosi 2015, par. 4",
      },
      {
        id: "wsp-mc-7",
        label: "Piano di campionamento e monitoraggio periodico delle acque (analisi chimico-fisiche e microbiologiche ufficiali)",
        normArticle: "D.Lgs. 18/2023, Allegato I e Allegato II",
      },
      {
        id: "wsp-mc-8",
        label: "Protocollo di gestione delle non conformità e misure correttive immediate in caso di superamento dei limiti di parametro",
        normArticle: "D.Lgs. 18/2023, art. 13",
      },
    ],
  },
  {
    id: "acque-rapporti-prova",
    name: "Rapporti di Prova Ufficiali di Analisi delle Acque Potabili",
    category: "acque_legionella",
    normReference: "D.Lgs. 18/2023, Allegato I",
    description: "Certificati analitici di laboratorio accreditato su parametri microbiologici e chimici (Piombo, Rame, Cloro, Nitrati).",
    isRequiredDefault: true,
  },
  {
    id: "acque-analisi-legionella",
    name: "Registro Campionamenti e Rapporti di Prova Ricerca Legionella",
    category: "acque_legionella",
    normReference: "Linee Guida Nazionali per la Prevenzione e il Controllo della Legionellosi (07/05/2015)",
    description: "Campionamenti periodici nei punti terminali più a rischio con conteggio UFC/L effettuati da laboratorio qualificato.",
    isRequiredDefault: true,
  },
  {
    id: "acque-registro-manutenzione",
    name: "Registro Interventi Manutenzione e Bonifica Impianto Idrico",
    category: "acque_legionella",
    normReference: "D.Lgs. 18/2023 e Linee Guida Legionellosi 2015",
    description: "Tracciamento di lavaggi periodici, sostituzione filtri, decalcificazione rompigetto ed eventuali shock termici/chimici.",
    isRequiredDefault: true,
  },
];

/**
 * Funzione di classificazione automatica di un documento in una delle 4 macro-aree
 * in base al nome e alla norma.
 */
export function classifyDocumentCategory(docName: string): DocumentCategory {
  const lower = docName.toLowerCase();

  // 1. Acque e Legionella
  if (
    lower.includes("acqua") ||
    lower.includes("acque") ||
    lower.includes("legionell") ||
    lower.includes("water") ||
    lower.includes("18/23") ||
    lower.includes("18/2023") ||
    lower.includes("potabil") ||
    lower.includes("idric")
  ) {
    return "acque_legionella";
  }

  // 2. HACCP / Igiene alimentare
  if (
    lower.includes("haccp") ||
    lower.includes("aliment") ||
    lower.includes("moca") ||
    lower.includes("allergen") ||
    lower.includes("rintracciabilit") ||
    lower.includes("tracciabilit") ||
    lower.includes("pest control") ||
    lower.includes("infestant") ||
    lower.includes("temperature") ||
    lower.includes("sanificazion") ||
    lower.includes("852/04") ||
    lower.includes("852/2004") ||
    lower.includes("178/02") ||
    lower.includes("178/2002") ||
    lower.includes("menù") ||
    lower.includes("menu")
  ) {
    return "haccp_alimentare";
  }

  // 3. Base autorizzativa / propedeutica
  if (
    lower.includes("visura") ||
    lower.includes("scia") ||
    lower.includes("licenza") ||
    lower.includes("planimetri") ||
    lower.includes("agibilit") ||
    lower.includes("dico") ||
    lower.includes("conformità impianto elettrico") ||
    lower.includes("conformita impianto elettrico") ||
    lower.includes("messa a terra") ||
    lower.includes("462/01") ||
    lower.includes("37/08") ||
    lower.includes("cpi") ||
    lower.includes("prevenzione incendi") ||
    lower.includes("aua") ||
    lower.includes("via") ||
    lower.includes("vas") ||
    lower.includes("scarich") ||
    lower.includes("ambientale") ||
    lower.includes("canne fumarie")
  ) {
    return "base_autorizzativa";
  }

  // 4. Default: Sicurezza sul Lavoro D.Lgs. 81/2008
  return "sicurezza_81_08";
}

/**
 * Trova la definizione di catalogo per un dato nome di documento
 */
export function findCatalogDefinition(docName: string): NormativeDocumentDefinition | undefined {
  const lower = docName.toLowerCase().trim();
  return NORMATIVE_DOCUMENTS_CATALOG.find((def) => {
    const defLower = def.name.toLowerCase();
    return (
      defLower === lower ||
      lower.includes(defLower) ||
      defLower.includes(lower) ||
      (def.id === "sec-dvr" && lower.startsWith("dvr")) ||
      (def.id === "haccp-manuale" && lower.includes("haccp")) ||
      (def.id === "acque-psa" && (lower.includes("acque") || lower.includes("legionell")))
    );
  });
}

/**
 * Verifica l'applicabilità di una categoria in base al Codice ATECO
 */
export function isCategoryApplicableForAteco(
  category: DocumentCategory,
  atecoCode?: string,
  checklistMode?: string,
): { applicable: boolean; reason: string } {
  const ateco = (atecoCode ?? "").trim();

  // Modalità checklist forzate
  if (checklistMode === "haccp_only" && category === "sicurezza_81_08") {
    return { applicable: false, reason: "Sopralluogo impostato in modalità Solo HACCP." };
  }
  if (checklistMode === "safety_only" && category === "haccp_alimentare") {
    return { applicable: false, reason: "Sopralluogo impostato in modalità Solo Sicurezza." };
  }

  // Sezione Base Autorizzativa: sempre applicabile a tutti
  if (category === "base_autorizzativa") {
    return { applicable: true, reason: "Documentazione propedeutica obbligatoria per qualsiasi attività." };
  }

  // Sezione Sicurezza 81/08: sempre applicabile a tutte le aziende con lavoratori
  if (category === "sicurezza_81_08") {
    return { applicable: true, reason: "Obblighi generali di tutela della salute e sicurezza dei lavoratori (D.Lgs. 81/08)." };
  }

  // Sezione HACCP: applicabile se ATECO alimentare / HoReCa
  if (category === "haccp_alimentare") {
    const isFood =
      /^56\./.test(ateco) || // Ristoranti, bar, catering, mense
      /^47\.11/.test(ateco) || // Supermercati, ipermercati
      /^47\.2/.test(ateco) || // Negozi alimentari
      /^10\./.test(ateco) || // Industrie alimentari
      /^11\./.test(ateco) || // Industria bevande
      /^55\.1/.test(ateco) || // Hotel con somministrazione
      /^93\.29\.2/.test(ateco) || // Stabilimenti balneari
      /^93\.29\.1/.test(ateco); // Discoteche con somministrazione

    if (!ateco) {
      return { applicable: true, reason: "Settore ATECO non specificato: sezione attiva per verifica." };
    }

    if (isFood) {
      return { applicable: true, reason: `Settore alimentare / HoReCa (ATECO ${ateco}): HACCP pienamente obbligatorio.` };
    } else {
      return {
        applicable: false,
        reason: `L'attività (ATECO ${ateco}) non manipola o somministra alimenti (attivare solo se è presente mensa interna o distribuzione cibo).`,
      };
    }
  }

  // Sezione Acque & Legionella: particolarmente rilevante per strutture con impianti complessi / aperte al pubblico
  if (category === "acque_legionella") {
    const isHighPriority =
      /^55\./.test(ateco) || // Hotel, B&B, strutture ricettive
      /^56\./.test(ateco) || // Ristorazione
      /^86\./.test(ateco) || // Sanità, cliniche, RSA
      /^93\.1/.test(ateco) || // Centri sportivi, piscine, palestre
      /^96\.02/.test(ateco) || // Centri estetici, parrucchieri
      /^96\.04/.test(ateco); // Centri benessere, spa

    if (isHighPriority) {
      return {
        applicable: true,
        reason: `Attività prioritaria per il Piano Sicurezza Acque e monitoraggio Legionella (D.Lgs. 18/2023).`,
      };
    }
    return {
      applicable: true,
      reason: `Applicabile a tutte le reti idriche interne destinate al consumo dei lavoratori e utenti (D.Lgs. 18/2023).`,
    };
  }

  return { applicable: true, reason: "Applicabile" };
}

/**
 * Struttura dei metadati extra codificati nelle note
 */
export interface DocumentExtraMeta {
  noteText?: string;
  issueDate?: string;
  expiryDate?: string;
  checkedContents?: string[];
  subStatus?: "viewed_on_site" | "requested_later" | "not_available" | "not_applicable";
}

/**
 * Estrae i metadati extra (date, contenuti minimi spuntati, sub-stato) dal campo note
 */
export function parseDocumentExtraMeta(noteRaw?: string | null): DocumentExtraMeta {
  if (!noteRaw) return {};
  const trimmed = noteRaw.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed as DocumentExtraMeta;
      }
    } catch {
      // ignore
    }
  }

  // Formato leggibile con prefisso data: "[Rilascio: YYYY-MM-DD] [Scadenza: YYYY-MM-DD] Note..."
  const issueMatch = trimmed.match(/\[Rilascio:\s*([^\]]+)\]/i);
  const expiryMatch = trimmed.match(/\[Scadenza:\s*([^\]]+)\]/i);
  const cleanNote = trimmed
    .replace(/\[Rilascio:\s*[^\]]+\]/gi, "")
    .replace(/\[Scadenza:\s*[^\]]+\]/gi, "")
    .trim();

  return {
    noteText: cleanNote,
    issueDate: issueMatch ? issueMatch[1].trim() : undefined,
    expiryDate: expiryMatch ? expiryMatch[1].trim() : undefined,
  };
}

/**
 * Serializza i metadati extra nel campo note
 */
export function serializeDocumentExtraMeta(meta: DocumentExtraMeta): string {
  const hasExtra =
    (meta.issueDate && meta.issueDate.trim().length > 0) ||
    (meta.expiryDate && meta.expiryDate.trim().length > 0) ||
    (meta.checkedContents && meta.checkedContents.length > 0) ||
    meta.subStatus;

  if (hasExtra) {
    return JSON.stringify({
      noteText: meta.noteText ?? "",
      issueDate: meta.issueDate ?? "",
      expiryDate: meta.expiryDate ?? "",
      checkedContents: meta.checkedContents ?? [],
      subStatus: meta.subStatus,
    });
  }

  return meta.noteText ?? "";
}
