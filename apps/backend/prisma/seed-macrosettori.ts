import { ChecklistSection, ComplianceDomain } from "@prisma/client";
import { prisma } from "./_client.js";

const SEED_SOURCE = "macrosettori";

type SectorItem = {
  section: ChecklistSection;
  domain: ComplianceDomain;
  area: string;
  question: string;
  defaultSeverity: number;
  defaultSanctionable: boolean;
  normReference?: string;
};

type SectorDocument = {
  name: string;
  domain: ComplianceDomain;
  isRequired?: boolean;
};

type SectorDefinition = {
  id: string;
  name: string;
  description: string;
  macroGroup: string;
  items: SectorItem[];
  documents: SectorDocument[];
};

function item(
  section: ChecklistSection,
  domain: ComplianceDomain,
  area: string,
  question: string,
  defaultSeverity = 3,
  defaultSanctionable = false,
  normReference?: string,
): SectorItem {
  return { section, domain, area, question, defaultSeverity, defaultSanctionable, normReference };
}

const sectors: SectorDefinition[] = [
  {
    id: "commerce-non-food",
    name: "Checklist Commercio Non Food - Generale",
    description: "Controlli macro ATECO 47 non alimentare: negozi, showroom, retail specializzato e piccoli magazzini.",
    macroGroup: "COMMERCIO_NON_FOOD",
    items: [
      item(ChecklistSection.premises_equipment, ComplianceDomain.safety, "Layout vendita", "Corsie, uscite e zone cassa sono libere da ostacoli, con larghezze coerenti al flusso clienti?", 3, true, "D.Lgs. 81/2008, Allegato IV"),
      item(ChecklistSection.fire_prevention, ComplianceDomain.safety, "Antincendio", "Estintori, segnaletica e illuminazione di emergenza sono presenti, visibili e mantenuti entro scadenza?", 4, true, "D.Lgs. 81/2008, art. 46"),
      item(ChecklistSection.premises_equipment, ComplianceDomain.safety, "Scaffalature", "Scaffali, espositori e gondole sono stabili, non sovraccarichi e con portata rispettata?", 3, true, "D.Lgs. 81/2008, art. 71"),
      item(ChecklistSection.ergonomics, ComplianceDomain.safety, "Movimentazione", "Le merci pesanti vengono movimentate con carrelli, transpallet o procedure che riducono il rischio da sollevamento?", 3, false, "D.Lgs. 81/2008, Titolo VI"),
      item(ChecklistSection.electrical, ComplianceDomain.safety, "Impianti elettrici", "Prese, ciabatte, insegne luminose e sistemi POS sono integri, senza sovraccarichi o cavi esposti?", 3, true, "D.Lgs. 81/2008, art. 80"),
      item(ChecklistSection.workstations, ComplianceDomain.safety, "Cassa e VDT", "Postazioni cassa e videoterminali sono ergonomiche, illuminate e organizzate per evitare posture incongrue?", 2, false, "D.Lgs. 81/2008, Titolo VII"),
      item(ChecklistSection.access_security, ComplianceDomain.safety, "Accessi", "Ingressi, rampe e soglie sono sicuri per clienti e lavoratori, senza inciampo o superfici scivolose?", 3, true, "D.Lgs. 81/2008, Allegato IV"),
      item(ChecklistSection.gdpr_privacy, ComplianceDomain.safety, "Privacy", "Videosorveglianza, fidelity card e raccolta dati clienti hanno informative e autorizzazioni coerenti al GDPR?", 3, true, "Reg. UE 2016/679"),
      item(ChecklistSection.first_aid, ComplianceDomain.safety, "Primo soccorso", "Cassetta di pronto soccorso e addetti designati sono disponibili durante l'orario di apertura?", 3, true, "DM 388/2003"),
      item(ChecklistSection.documentation, ComplianceDomain.safety, "Documentazione", "DVR, nomine, verbali e manutenzioni sono aggiornati rispetto a negozio, magazzino e personale impiegato?", 3, true, "D.Lgs. 81/2008, art. 17 e 28"),
    ],
    documents: [
      { name: "DVR commercio non food aggiornato", domain: ComplianceDomain.safety },
      { name: "Piano emergenza ed evacuazione punto vendita", domain: ComplianceDomain.safety },
      { name: "Registro controlli antincendio e illuminazione emergenza", domain: ComplianceDomain.safety },
      { name: "Dichiarazione conformita impianto elettrico e verifiche", domain: ComplianceDomain.safety },
      { name: "Schede portata/manutenzione scaffalature e attrezzature", domain: ComplianceDomain.safety },
      { name: "Informativa videosorveglianza e trattamento dati clienti", domain: ComplianceDomain.safety, isRequired: false },
    ],
  },
  {
    id: "logistics-warehouse",
    name: "Checklist Logistica e Magazzino - Generale",
    description: "Controlli macro ATECO 49.4, 52 e 53: trasporto merci, depositi, picking, baie e corrieri.",
    macroGroup: "LOGISTICA_MAGAZZINO",
    items: [
      item(ChecklistSection.premises_equipment, ComplianceDomain.safety, "Scaffalature", "Scaffalature industriali e soppalchi riportano portata visibile, protezioni antiurto e verifiche periodiche?", 4, true, "D.Lgs. 81/2008, art. 71"),
      item(ChecklistSection.machinery_safety, ComplianceDomain.safety, "Carrelli elevatori", "Carrelli elevatori, transpallet elettrici e commissionatori hanno manutenzione, libretto e operatori abilitati?", 4, true, "Accordo Stato-Regioni 22/02/2012"),
      item(ChecklistSection.access_security, ComplianceDomain.safety, "Viabilita interna", "Percorsi pedonali e mezzi sono separati con segnaletica, specchi e attraversamenti chiari?", 4, true, "D.Lgs. 81/2008, Allegato IV"),
      item(ChecklistSection.premises_equipment, ComplianceDomain.safety, "Baie di carico", "Rampe, portoni sezionali e baie hanno blocchi, parapetti e procedure anti-caduta durante carico/scarico?", 4, true, "D.Lgs. 81/2008, Titolo III"),
      item(ChecklistSection.ergonomics, ComplianceDomain.safety, "Picking", "Attivita di picking e imballaggio sono organizzate per ridurre torsioni, carichi ripetuti e lavoro sopra spalla?", 3, false, "D.Lgs. 81/2008, Titolo VI"),
      item(ChecklistSection.fire_prevention, ComplianceDomain.safety, "Antincendio", "Materiali combustibili, packaging e pallet sono gestiti con compartimentazione, estintori e vie di esodo libere?", 4, true, "D.Lgs. 81/2008, art. 46"),
      item(ChecklistSection.chemical_fitosanitary, ComplianceDomain.safety, "Merci pericolose", "Merci ADR, batterie, aerosol o chimici sono segregati, etichettati e accompagnati da SDS/documentazione?", 4, true, "ADR; Reg. CLP 1272/2008"),
      item(ChecklistSection.electrical, ComplianceDomain.safety, "Ricarica batterie", "Area ricarica batterie e muletti e' ventilata, segnalata e separata da fonti di innesco?", 4, true, "D.Lgs. 81/2008, art. 80 e 224"),
      item(ChecklistSection.training_emergency, ComplianceDomain.safety, "Appalti", "Corrieri, facchini e cooperative esterne sono gestiti con DUVRI, accessi registrati e briefing sicurezza?", 4, true, "D.Lgs. 81/2008, art. 26"),
      item(ChecklistSection.documentation, ComplianceDomain.safety, "Documentazione", "DVR e procedure coprono viabilita, scaffalature, carrelli, movimentazione, appalti e merci pericolose?", 3, true, "D.Lgs. 81/2008, art. 17 e 28"),
    ],
    documents: [
      { name: "DVR logistica e magazzino aggiornato", domain: ComplianceDomain.safety },
      { name: "Registro verifiche scaffalature e soppalchi", domain: ComplianceDomain.safety },
      { name: "Elenco abilitazioni carrellisti e mezzi di sollevamento", domain: ComplianceDomain.safety },
      { name: "Piano viabilita interna magazzino", domain: ComplianceDomain.safety },
      { name: "DUVRI facchinaggio/corrieri/cooperative", domain: ComplianceDomain.safety },
      { name: "SDS e istruzioni deposito merci pericolose", domain: ComplianceDomain.safety, isRequired: false },
    ],
  },
  {
    id: "cleaning-services",
    name: "Checklist Pulizie e Sanificazione - Generale",
    description: "Controlli macro ATECO 81.2: imprese di pulizia, sanificazione, disinfestazione e servizi esterni.",
    macroGroup: "PULIZIE_SANIFICAZIONE",
    items: [
      item(ChecklistSection.chemical_fitosanitary, ComplianceDomain.safety, "Prodotti chimici", "Detergenti, disinfettanti e biocidi sono etichettati CLP, con SDS disponibili e diluizioni controllate?", 4, true, "Reg. CLP 1272/2008; D.Lgs. 81/2008, art. 223"),
      item(ChecklistSection.ppe, ComplianceDomain.safety, "DPI", "Guanti, occhiali, mascherine e calzature antiscivolo sono forniti in base a chimici, biologico e superfici bagnate?", 4, true, "D.Lgs. 81/2008, Titolo III"),
      item(ChecklistSection.procedures_hygiene, ComplianceDomain.both, "Procedure", "Sono presenti procedure di sanificazione per superfici, servizi igienici, spogliatoi, uffici e aree alimentari se servite?", 3, false, "D.Lgs. 81/2008, art. 15"),
      item(ChecklistSection.access_security, ComplianceDomain.safety, "Lavori presso terzi", "Accessi presso clienti, rischi interferenziali e permessi di lavoro sono gestiti prima dell'avvio servizio?", 4, true, "D.Lgs. 81/2008, art. 26"),
      item(ChecklistSection.ergonomics, ComplianceDomain.safety, "Movimentazione", "Carrelli, secchi, macchine lavasciuga e sacchi rifiuti sono gestiti per ridurre sovraccarico e posture incongrue?", 3, false, "D.Lgs. 81/2008, Titolo VI"),
      item(ChecklistSection.machinery_safety, ComplianceDomain.safety, "Attrezzature", "Lavasciuga, aspiratori, monospazzole e scale portatili sono integre, manutenute e usate da personale formato?", 3, true, "D.Lgs. 81/2008, art. 71"),
      item(ChecklistSection.first_aid, ComplianceDomain.safety, "Emergenze chimiche", "Sono definite procedure per schizzi oculari, inalazione vapori, sversamenti e miscelazioni accidentali?", 4, true, "D.Lgs. 81/2008, art. 45"),
      item(ChecklistSection.environmental, ComplianceDomain.safety, "Rifiuti", "Rifiuti raccolti, assorbenti contaminati e contenitori chimici sono conferiti secondo contratto e classificazione?", 3, true, "D.Lgs. 152/2006"),
      item(ChecklistSection.training_emergency, ComplianceDomain.safety, "Formazione", "Gli addetti hanno formazione su rischio chimico, biologico, uso DPI, etichette CLP e procedure del cliente?", 4, true, "D.Lgs. 81/2008, art. 37"),
      item(ChecklistSection.documentation, ComplianceDomain.safety, "Documentazione", "DVR, DUVRI, SDS, mansionari e schede tecniche sono aggiornati per cantieri e clienti serviti?", 3, true, "D.Lgs. 81/2008, art. 17, 26 e 28"),
    ],
    documents: [
      { name: "DVR impresa pulizie e sanificazione", domain: ComplianceDomain.safety },
      { name: "DUVRI o schede rischio interferenziale clienti", domain: ComplianceDomain.safety },
      { name: "SDS detergenti, disinfettanti e biocidi", domain: ComplianceDomain.safety },
      { name: "Procedure operative sanificazione e diluizione prodotti", domain: ComplianceDomain.both },
      { name: "Registro consegna DPI e formazione rischio chimico", domain: ComplianceDomain.safety },
      { name: "Contratti/istruzioni per gestione rifiuti speciali", domain: ComplianceDomain.safety, isRequired: false },
    ],
  },
  {
    id: "personal-services",
    name: "Checklist Servizi alla Persona - Generale",
    description: "Controlli macro ATECO 96.02 e 96.04: parrucchieri, estetica, barber shop, tatuaggi base e benessere.",
    macroGroup: "SERVIZI_PERSONA",
    items: [
      item(ChecklistSection.procedures_hygiene, ComplianceDomain.both, "Igiene strumenti", "Forbici, lame, manipoli e strumenti riutilizzabili sono puliti, disinfettati o sterilizzati tra un cliente e l'altro?", 4, true, "Linee guida igiene servizi alla persona; D.Lgs. 81/2008"),
      item(ChecklistSection.chemical_fitosanitary, ComplianceDomain.safety, "Cosmetici e chimici", "Tinture, solventi, colle, monomeri e cosmetici sono conservati in contenitori originali con SDS ove prevista?", 3, true, "Reg. CE 1223/2009; Reg. CLP 1272/2008"),
      item(ChecklistSection.ppe, ComplianceDomain.safety, "DPI", "Guanti, mascherine, occhiali e protezioni monouso sono disponibili per trattamenti chimici, polveri e rischio biologico?", 3, true, "D.Lgs. 81/2008, Titolo III"),
      item(ChecklistSection.premises_equipment, ComplianceDomain.safety, "Locali", "Lavabi, superfici lavabili, aerazione e separazione pulito/sporco sono adeguati all'attivita svolta?", 3, true, "Regolamenti igienico-sanitari locali"),
      item(ChecklistSection.machinery_safety, ComplianceDomain.safety, "Attrezzature", "Lampade UV, apparecchi estetici, phon, piastre e manipoli sono manutenuti e marcati CE?", 3, true, "D.Lgs. 81/2008, art. 71"),
      item(ChecklistSection.environmental, ComplianceDomain.safety, "Rifiuti", "Lame, aghi, cerette e materiali contaminati sono raccolti in contenitori idonei e smaltiti correttamente?", 4, true, "D.Lgs. 152/2006; regolamenti sanitari locali"),
      item(ChecklistSection.ergonomics, ComplianceDomain.safety, "Posture", "Le postazioni evitano posture prolungate incongrue, con sedute/regolazioni e pause per addetti?", 2, false, "D.Lgs. 81/2008, Titolo VI"),
      item(ChecklistSection.fire_prevention, ComplianceDomain.safety, "Antincendio", "Prodotti infiammabili e apparecchi elettrici sono gestiti lontano da fonti di calore, con estintori mantenuti?", 3, true, "D.Lgs. 81/2008, art. 46"),
      item(ChecklistSection.gdpr_privacy, ComplianceDomain.safety, "Privacy", "Schede cliente, immagini, anamnesi trattamenti e consensi sono gestiti secondo informativa privacy?", 3, true, "Reg. UE 2016/679"),
      item(ChecklistSection.documentation, ComplianceDomain.both, "Documentazione", "Autorizzazioni sanitarie/comunali, DVR, schede prodotti e protocolli igiene sono disponibili e aggiornati?", 3, true, "D.Lgs. 81/2008, art. 17 e 28"),
    ],
    documents: [
      { name: "DVR servizi alla persona aggiornato", domain: ComplianceDomain.safety },
      { name: "Autorizzazione sanitaria/comunale attivita", domain: ComplianceDomain.both },
      { name: "Protocollo pulizia, disinfezione e sterilizzazione strumenti", domain: ComplianceDomain.both },
      { name: "Schede tecniche/SDS prodotti chimici e cosmetici", domain: ComplianceDomain.safety },
      { name: "Registro manutenzione apparecchi estetici/elettrici", domain: ComplianceDomain.safety },
      { name: "Informativa e consenso trattamento dati clienti", domain: ComplianceDomain.safety },
    ],
  },
  {
    id: "education-training",
    name: "Checklist Istruzione e Formazione - Generale",
    description: "Controlli macro ATECO 85: scuole private, corsi, asili, doposcuola e centri formativi.",
    macroGroup: "ISTRUZIONE_FORMAZIONE",
    items: [
      item(ChecklistSection.premises_equipment, ComplianceDomain.safety, "Aule", "Aule, corridoi e spazi comuni hanno capienza, illuminazione, aerazione e arredi coerenti con gli utenti presenti?", 3, true, "D.Lgs. 81/2008, Allegato IV"),
      item(ChecklistSection.fire_prevention, ComplianceDomain.safety, "Emergenza", "Piano di emergenza, prove evacuazione e gestione persone fragili/minori sono documentati e aggiornati?", 4, true, "D.Lgs. 81/2008, art. 43 e 46"),
      item(ChecklistSection.first_aid, ComplianceDomain.safety, "Primo soccorso", "Addetti primo soccorso, cassetta e procedure per infortuni di studenti/utenti sono disponibili?", 3, true, "DM 388/2003"),
      item(ChecklistSection.electrical, ComplianceDomain.safety, "Impianti", "Impianti elettrici, LIM, PC, proiettori e multiprese sono integri e verificati?", 3, true, "D.Lgs. 81/2008, art. 80"),
      item(ChecklistSection.access_security, ComplianceDomain.safety, "Accessi", "Ingressi, uscita minori, visitatori e registro presenze sono controllati in base al tipo di struttura?", 3, true, "D.Lgs. 81/2008, art. 18"),
      item(ChecklistSection.premises_equipment, ComplianceDomain.safety, "Laboratori", "Laboratori tecnici, artistici, informatici o scientifici hanno procedure, DPI e sorveglianza docente adeguata?", 4, true, "D.Lgs. 81/2008, art. 71"),
      item(ChecklistSection.procedures_hygiene, ComplianceDomain.both, "Igiene", "Servizi igienici, giochi, materiali didattici e superfici sono puliti con frequenza definita?", 2, false, "D.Lgs. 81/2008, Allegato IV"),
      item(ChecklistSection.gdpr_privacy, ComplianceDomain.safety, "Privacy minori", "Foto, video, registri presenze e dati sanitari/minori hanno informative e consensi coerenti?", 4, true, "Reg. UE 2016/679"),
      item(ChecklistSection.training_emergency, ComplianceDomain.safety, "Formazione", "Docenti, tutor e personale ausiliario sono formati su sicurezza, emergenza, privacy e gestione utenti fragili?", 3, true, "D.Lgs. 81/2008, art. 37"),
      item(ChecklistSection.documentation, ComplianceDomain.safety, "Documentazione", "DVR, nomine, planimetrie, autorizzazioni e registro manutenzioni sono aggiornati?", 3, true, "D.Lgs. 81/2008, art. 17 e 28"),
    ],
    documents: [
      { name: "DVR scuola/centro formazione aggiornato", domain: ComplianceDomain.safety },
      { name: "Piano emergenza e verbali prove evacuazione", domain: ComplianceDomain.safety },
      { name: "Registro presenze e procedura uscita minori/visitatori", domain: ComplianceDomain.safety, isRequired: false },
      { name: "Registro manutenzione impianti, arredi e attrezzature", domain: ComplianceDomain.safety },
      { name: "Informative privacy e consensi immagini/minori", domain: ComplianceDomain.safety },
      { name: "Procedure laboratori e consegna DPI", domain: ComplianceDomain.safety, isRequired: false },
    ],
  },
  {
    id: "auto-repair",
    name: "Checklist Autoriparazioni - Generale",
    description: "Controlli macro ATECO 45.2: officine auto, gommisti, carrozzerie e manutenzione veicoli.",
    macroGroup: "AUTORIPARAZIONE",
    items: [
      item(ChecklistSection.machinery_safety, ComplianceDomain.safety, "Ponti sollevatori", "Ponti sollevatori e cric hanno verifiche, portata visibile, sicurezze funzionanti e manutenzione registrata?", 4, true, "D.Lgs. 81/2008, art. 71"),
      item(ChecklistSection.chemical_fitosanitary, ComplianceDomain.safety, "Chimici", "Oli, solventi, vernici, liquidi freni e batterie sono etichettati, segregati e accompagnati da SDS?", 4, true, "Reg. CLP 1272/2008"),
      item(ChecklistSection.environmental, ComplianceDomain.safety, "Rifiuti", "Oli esausti, filtri, batterie, pneumatici e solventi sono gestiti con FIR e depositi temporanei corretti?", 4, true, "D.Lgs. 152/2006"),
      item(ChecklistSection.welding_thermal, ComplianceDomain.safety, "Lavori a caldo", "Saldatura, smerigliatura e taglio sono eseguiti con aspirazione, schermi e procedura lavori a caldo?", 4, true, "D.Lgs. 81/2008, Titolo VIII"),
      item(ChecklistSection.ppe, ComplianceDomain.safety, "DPI", "Occhiali, guanti anti-taglio/chimici, scarpe S3, otoprotettori e maschere sono disponibili e usati?", 4, true, "D.Lgs. 81/2008, Titolo III"),
      item(ChecklistSection.fire_prevention, ComplianceDomain.safety, "Antincendio", "Estintori, ventilazione, divieto fumo e gestione liquidi infiammabili sono coerenti col rischio officina?", 4, true, "D.Lgs. 81/2008, art. 46"),
      item(ChecklistSection.environment, ComplianceDomain.safety, "Gas di scarico", "Prove motore al chiuso avvengono con aspirazione gas di scarico o ventilazione adeguata?", 4, true, "D.Lgs. 81/2008, art. 63 e 224"),
      item(ChecklistSection.machinery_safety, ComplianceDomain.safety, "Compressori", "Compressori e serbatoi aria hanno verifiche, valvole di sicurezza e manutenzione registrata?", 3, true, "D.Lgs. 81/2008, art. 71"),
      item(ChecklistSection.electrical, ComplianceDomain.safety, "Elettrico", "Prolunghe, caricabatterie, utensili elettrici e quadro officina sono integri e protetti?", 3, true, "D.Lgs. 81/2008, art. 80"),
      item(ChecklistSection.documentation, ComplianceDomain.safety, "Documentazione", "DVR, registro rifiuti, verifiche attrezzature, SDS e formazione addetti sono aggiornati?", 3, true, "D.Lgs. 81/2008, art. 17 e 28"),
    ],
    documents: [
      { name: "DVR autoriparazione/officina aggiornato", domain: ComplianceDomain.safety },
      { name: "Registro manutenzione ponti sollevatori e compressori", domain: ComplianceDomain.safety },
      { name: "SDS oli, solventi, vernici, batterie e liquidi tecnici", domain: ComplianceDomain.safety },
      { name: "Registro rifiuti/FIR oli, batterie, filtri e pneumatici", domain: ComplianceDomain.safety },
      { name: "Piano emergenza e registro antincendio officina", domain: ComplianceDomain.safety },
      { name: "Registro consegna DPI e formazione addetti officina", domain: ComplianceDomain.safety },
    ],
  },
  {
    id: "food-industry",
    name: "Checklist Industria Alimentare - Generale",
    description: "Controlli macro ATECO 10: produzione, trasformazione e confezionamento alimentare non gia coperti da HoReCa.",
    macroGroup: "INDUSTRIA_ALIMENTARE",
    items: [
      item(ChecklistSection.premises_equipment, ComplianceDomain.haccp, "Layout produttivo", "Flussi materie prime, semilavorati, prodotto finito, scarti e personale evitano incroci sporco/pulito?", 4, true, "Reg. CE 852/2004"),
      item(ChecklistSection.procedures_hygiene, ComplianceDomain.haccp, "HACCP", "Piano HACCP, analisi pericoli, CCP/CP e limiti critici sono aggiornati per linee e prodotti lavorati?", 4, true, "Reg. CE 852/2004"),
      item(ChecklistSection.procedures_hygiene, ComplianceDomain.haccp, "Rintracciabilita", "Lotti, fornitori, clienti, ritiri e richiami sono tracciabili con prova simulata documentata?", 4, true, "Reg. CE 178/2002"),
      item(ChecklistSection.procedures_hygiene, ComplianceDomain.haccp, "Allergeni", "Allergeni, cross-contamination, etichette e cambio produzione sono gestiti con procedure verificate?", 4, true, "Reg. UE 1169/2011"),
      item(ChecklistSection.premises_equipment, ComplianceDomain.haccp, "Catena freddo", "Celle, abbattitori e trasporto refrigerato hanno temperature monitorate, allarmi e registrazioni?", 4, true, "Reg. CE 852/2004"),
      item(ChecklistSection.procedures_hygiene, ComplianceDomain.haccp, "Sanificazione", "Piano sanificazione copre impianti, nastri, utensili, drenaggi, CIP/COP e verifica efficacia?", 4, true, "Reg. CE 852/2004"),
      item(ChecklistSection.premises_equipment, ComplianceDomain.haccp, "Infestanti", "Pest management, planimetrie esche, trend catture e azioni correttive sono aggiornati?", 3, true, "Reg. CE 852/2004"),
      item(ChecklistSection.machinery_safety, ComplianceDomain.safety, "Macchine", "Linee, impastatrici, cutter, confezionatrici e nastri hanno carter, interblocchi e arresti emergenza funzionanti?", 4, true, "D.Lgs. 81/2008, art. 71"),
      item(ChecklistSection.ppe, ComplianceDomain.both, "DPI e igiene personale", "DPI, indumenti, cuffie, lavamani e procedure ingresso reparto sono applicati da lavoratori e visitatori?", 3, true, "Reg. CE 852/2004; D.Lgs. 81/2008"),
      item(ChecklistSection.documentation, ComplianceDomain.both, "Documentazione", "DVR, HACCP, analisi laboratorio, MOCA, manutenzioni e formazione sono disponibili e aggiornati?", 4, true, "D.Lgs. 81/2008; Reg. CE 852/2004"),
    ],
    documents: [
      { name: "Manuale HACCP industria alimentare", domain: ComplianceDomain.haccp },
      { name: "Piano rintracciabilita e procedura ritiro/richiamo", domain: ComplianceDomain.haccp },
      { name: "Registro temperature celle e trasporto refrigerato", domain: ComplianceDomain.haccp },
      { name: "Piano sanificazione e verifiche efficacia", domain: ComplianceDomain.haccp },
      { name: "Piano controllo infestanti e trend catture", domain: ComplianceDomain.haccp },
      { name: "Schede allergeni, etichette e gestione cross-contamination", domain: ComplianceDomain.haccp },
      { name: "DVR reparto produttivo e macchine alimentari", domain: ComplianceDomain.safety },
      { name: "Dichiarazioni MOCA e materiali a contatto alimentare", domain: ComplianceDomain.haccp, isRequired: false },
    ],
  },
  {
    id: "sport-fitness",
    name: "Checklist Sport, Fitness e Piscine - Generale",
    description: "Controlli macro ATECO 93.1: palestre, centri fitness, piscine, circoli sportivi e impianti polivalenti.",
    macroGroup: "SPORT_FITNESS",
    items: [
      item(ChecklistSection.first_aid, ComplianceDomain.safety, "Defibrillatore (DAE)", "E' presente un defibrillatore semiautomatico (DAE) funzionante, segnalato, con verifiche/batterie/piastre entro scadenza e personale formato BLSD?", 4, true, "L. 120/2001; DM 24/04/2013; L. 116/2021"),
      item(ChecklistSection.procedures_hygiene, ComplianceDomain.both, "Legionellosi e docce", "E' redatto il piano di prevenzione del rischio Legionellosi con campionamenti periodici dell'impianto idrico di docce e spogliatoi?", 4, true, "Linee Guida Legionellosi 07/05/2015; D.Lgs. 81/2008 art. 268"),
      item(ChecklistSection.machinery_safety, ComplianceDomain.safety, "Macchine fitness", "Attrezzature isotoniche, cardio e pesi sono certificate CE/UNI EN ISO 20957 con cavi, perni e fermi integri e manutenzione programmata?", 4, true, "D.Lgs. 81/2008, art. 71; UNI EN ISO 20957"),
      item(ChecklistSection.access_security, ComplianceDomain.safety, "Pavimenti e spogliatoi", "I pavimenti di docce, spogliatoi e bordo vasca sono antiscivolo (R11+ / classe C), senza ristagni idrici persistenti ne pericolo inciampo?", 3, true, "D.Lgs. 81/2008, Allegato IV"),
      item(ChecklistSection.fire_prevention, ComplianceDomain.safety, "Vie di esodo e capienza", "Uscite di sicurezza e maniglioni antipanico sono liberi, dimensionati per il massimo affollamento, con illuminazione emergenza verificata?", 4, true, "D.Lgs. 81/2008, art. 46; DM 03/09/2021; DPR 151/2011"),
      item(ChecklistSection.environment, ComplianceDomain.safety, "Aerazione e VMC", "I locali di allenamento e gli spogliatoi garantiscono ricambi d'aria adeguati (VMC con filtri regolarmente puliti) e microclima idoneo?", 3, false, "D.Lgs. 81/2008, Allegato IV"),
      item(ChecklistSection.chemical_fitosanitary, ComplianceDomain.safety, "Prodotti chimici", "I prodotti disinfettanti e per trattamento acqua (cloro, correttori pH per piscine) hanno SDS e stoccaggio con bacino di contenimento?", 4, true, "Reg. CLP 1272/2008; D.Lgs. 81/2008, art. 223"),
      item(ChecklistSection.electrical, ComplianceDomain.safety, "Impianti elettrici locali umidi", "Gli impianti elettrici in zone docce, saune e vasche rispettano le norme CEI 64-8 per ambienti a maggior rischio elettrico con differenziali 30mA?", 4, true, "CEI 64-8; DPR 462/01; D.Lgs. 81/2008 art. 80"),
      item(ChecklistSection.procedures_hygiene, ComplianceDomain.both, "Idoneita sportiva", "E' definita e applicata la procedura per la verifica e archiviazione dei certificati medici sportivi in corso di validita per tutti gli iscritti?", 3, false, "DM 24/04/2013; DM 08/08/2014"),
      item(ChecklistSection.documentation, ComplianceDomain.safety, "Documentazione", "DVR, nomine addetti emergenza/BLSD, registro manutenzioni e procedure per infortuni sono aggiornati per la struttura?", 3, true, "D.Lgs. 81/2008, art. 17 e 28"),
    ],
    documents: [
      { name: "DVR centro sportivo e fitness aggiornato", domain: ComplianceDomain.safety },
      { name: "Registro verifiche DAE e attestati BLSD addetti", domain: ComplianceDomain.safety },
      { name: "Piano prevenzione e registro campionamenti Legionella", domain: ComplianceDomain.safety },
      { name: "Registro verifiche e manutenzione attrezzature fitness", domain: ComplianceDomain.safety },
      { name: "Piano emergenza, evacuazione e registro antincendio", domain: ComplianceDomain.safety },
      { name: "Dichiarazione conformita impianti elettrici e verifiche DPR 462/01", domain: ComplianceDomain.safety },
      { name: "Piano autocontrollo vasca e registro parametri piscina (se presente)", domain: ComplianceDomain.safety, isRequired: false },
    ],
  },
  {
    id: "passenger-transport",
    name: "Checklist Trasporto Persone - NCC, Taxi e Bus",
    description: "Controlli macro ATECO 49.3: autonoleggio con conducente (NCC), taxi, servizi di linea e autobus turistici.",
    macroGroup: "TRASPORTO_PERSONE",
    items: [
      item(ChecklistSection.health_surveillance, ComplianceDomain.safety, "Alcol e tossicodipendenza", "I conducenti sono sottoposti a sorveglianza sanitaria preventiva e periodica con test per assenza di tossicodipendenza e alcol-dipendenza?", 4, true, "D.Lgs. 81/2008, art. 41 c. 4; Intesa Stato-Regioni 30/10/2007"),
      item(ChecklistSection.machinery_safety, ComplianceDomain.safety, "Manutenzione veicoli", "Tutti i veicoli adibiti a servizio passeggeri hanno revisione periodica regolare (annuale), tagliandi eseguiti e pneumatici conformi?", 4, true, "D.Lgs. 81/2008, art. 71; Codice della Strada art. 80"),
      item(ChecklistSection.ergonomics, ComplianceDomain.safety, "Tempi guida e riposo", "E' monitorato e documentato il rispetto dei tempi massimi di guida e dei riposi obbligatori dei conducenti (tramite cronotachigrafo ove previsto)?", 4, true, "Reg. CE 561/2006; D.Lgs. 234/2007"),
      item(ChecklistSection.first_aid, ComplianceDomain.safety, "Primo soccorso di bordo", "Ciascun mezzo e' dotato di pacchetto di medicazione / cassetta primo soccorso a bordo, integro, con presidi entro la data di scadenza?", 3, true, "DM 388/2003, Allegato 2; D.Lgs. 81/2008 art. 45"),
      item(ChecklistSection.fire_prevention, ComplianceDomain.safety, "Estintori di bordo", "Gli estintori a bordo veicolo sono presenti, saldamente staffati con supporto a sgancio rapido e revisionati semestralmente?", 4, true, "DM 18/04/1977; UNI 9994-1; D.Lgs. 81/2008 art. 46"),
      item(ChecklistSection.safety_training, ComplianceDomain.safety, "Abilitazioni alla guida", "I conducenti sono in possesso di patenti superiori valide, CQC persone (ove richiesta), CAP KB o iscrizione al ruolo conducenti?", 4, true, "D.Lgs. 285/1992; D.Lgs. 395/2000; D.Lgs. 81/2008 art. 36-37"),
      item(ChecklistSection.ppe, ComplianceDomain.safety, "DPI e sicurezza stradale", "I veicoli dispongono di giubbotti ad alta visibilita certificati CE, triangolo di emergenza e torcia per fermate accidentali su strada?", 3, true, "Codice della Strada art. 162; Reg. UE 2016/425"),
      item(ChecklistSection.procedures_hygiene, ComplianceDomain.both, "Igiene dell'abitacolo", "E' attuata una procedura di pulizia, disinfezione dell'abitacolo e manutenzione periodica dei filtri clima del veicolo?", 2, false, "D.Lgs. 81/2008, Allegato IV"),
      item(ChecklistSection.procedures_hygiene, ComplianceDomain.safety, "Gestione avarie e sinistri", "I conducenti dispongono di istruzioni operative scritte su procedure di sicurezza in caso di guasto, sinistro stradale o malore a bordo?", 3, false, "D.Lgs. 81/2008, art. 43"),
      item(ChecklistSection.documentation, ComplianceDomain.safety, "Documentazione e DVR", "Il DVR aziendale comprende la valutazione del rischio stradale, stress lavoro-correlato da traffico, lavoro notturno e aggressioni terzi?", 3, true, "D.Lgs. 81/2008, art. 17 e 28"),
    ],
    documents: [
      { name: "DVR trasporto persone con valutazione rischio stradale", domain: ComplianceDomain.safety },
      { name: "Idoneita sanitaria e accertamenti tossicologici/alcol dei conducenti", domain: ComplianceDomain.safety },
      { name: "Registro manutenzione e revisioni periodiche parco veicoli", domain: ComplianceDomain.safety },
      { name: "Elenco patenti, CQC persone e titoli abilitativi conducenti con scadenze", domain: ComplianceDomain.safety },
      { name: "Registro controlli estintori e cassette pronto soccorso di bordo", domain: ComplianceDomain.safety },
      { name: "Report scarico dati cronotachigrafo (carte e veicoli)", domain: ComplianceDomain.safety, isRequired: false },
    ],
  },
  {
    id: "woodworking",
    name: "Checklist Falegnameria e Lavorazione Legno - Generale",
    description: "Controlli macro ATECO 16 e 31: falegnamerie, fabbricazione mobili, taglio, fresatura e finitura del legno.",
    macroGroup: "FALEGNAMERIA_LEGNO",
    items: [
      item(ChecklistSection.chemical_fitosanitary, ComplianceDomain.safety, "Polveri di legno duro", "E' presente la valutazione del rischio cancerogeno per polveri di legno duro con registro esposti, misure di aspirazione e rispetto VLEP?", 4, true, "D.Lgs. 81/2008, Titolo IX, Capo II, Allegato XLII"),
      item(ChecklistSection.premises_equipment, ComplianceDomain.safety, "Aspirazione localizzata", "Tutte le macchine per la lavorazione del legno sono collegate ad impianto di aspirazione localizzata efficiente con manutenzione filtri?", 4, true, "D.Lgs. 81/2008, art. 71 e Allegato IV punto 2"),
      item(ChecklistSection.fire_prevention, ComplianceDomain.safety, "Rischio esplosione (ATEX)", "Silos segatura, tubazioni e filtri a maniche sono classificati ATEX con pannelli antiscoppio e apparecchiature elettriche antideflagranti?", 4, true, "D.Lgs. 81/2008, Titolo XI, Allegato XLIX"),
      item(ChecklistSection.machinery_safety, ComplianceDomain.safety, "Seghe circolari e troncatrici", "Le seghe circolari dispongono di cuneo fenditore, cuffia di protezione della lama, spingitoi per pezzi piccoli e arresti di emergenza?", 4, true, "D.Lgs. 81/2008, art. 71 e Allegato V, Parte II"),
      item(ChecklistSection.machinery_safety, ComplianceDomain.safety, "Pialle e toupie", "Le pialle hanno protezione a ponte o ventaglio sull'albero e le toupie montano guidapezzo e pressori antiritorno del pezzo in lavorazione?", 4, true, "D.Lgs. 81/2008, art. 71 e Allegato V; UNI EN 848-1"),
      item(ChecklistSection.environment, ComplianceDomain.safety, "Rumore e vibrazioni", "E' presente la valutazione del rischio rumore (con marcatura aree oltre gli 85 dB) e fornitura di DPI otoprotettori specifici?", 3, true, "D.Lgs. 81/2008, Titolo VIII, Capo II"),
      item(ChecklistSection.chemical_fitosanitary, ComplianceDomain.safety, "Vernici e solventi", "Colle, vernici, solventi e impregnanti sono stoccati in armadi ventilati di sicurezza, con SDS disponibili e applicazione con aspirazione?", 4, true, "D.Lgs. 81/2008, art. 223, 224; Reg. CLP 1272/2008"),
      item(ChecklistSection.ppe, ComplianceDomain.safety, "DPI falegnameria", "Gli addetti utilizzano occhiali/visiere paraschegge, maschere FFP3 per polveri di legno duro, calzature di sicurezza e cuffie antirumore?", 4, true, "D.Lgs. 81/2008, Titolo III, Capo II; Reg. UE 2016/425"),
      item(ChecklistSection.fire_prevention, ComplianceDomain.safety, "Antincendio falegnameria", "Deposito legname e officina hanno presidi antincendio adeguati, divieto fumo rigoroso, pulizia quotidiana trucioli e vie di fuga libere?", 4, true, "D.Lgs. 81/2008, art. 46; DM 03/09/2021"),
      item(ChecklistSection.documentation, ComplianceDomain.safety, "Documentazione", "DVR aggiornato con protocollo sanitario specifico per polveri cancerogene e rumore, nomine sicurezza e formazione addetti attestata?", 4, true, "D.Lgs. 81/2008, art. 17, 28, 41"),
    ],
    documents: [
      { name: "DVR falegnameria con valutazione rischio cancerogeno polveri legno e rumore", domain: ComplianceDomain.safety },
      { name: "Documento di protezione contro le esplosioni (DVR ATEX silos/polveri)", domain: ComplianceDomain.safety },
      { name: "Registro degli esposti ad agenti cancerogeni (polveri di legno duro)", domain: ComplianceDomain.safety },
      { name: "Registro manutenzione impianto aspirazione e macchine per legno", domain: ComplianceDomain.safety },
      { name: "Schede di sicurezza (SDS) colle, vernici, impregnanti e solventi", domain: ComplianceDomain.safety },
      { name: "Verbali idoneita sanitaria ed esami audiometrici dei lavoratori", domain: ComplianceDomain.safety },
    ],
  },
];

const additionalSectorDocuments: Array<{
  macroGroup: string;
  sectorName: string;
  documents: SectorDocument[];
}> = [
  {
    macroGroup: "EDILIZIA",
    sectorName: "Edilizia e Cantieri",
    documents: [
      { name: "PSC (Piano di Sicurezza e Coordinamento) o POS (Piano Operativo di Sicurezza)", domain: ComplianceDomain.safety },
      { name: "Notifica preliminare cantiere ASL e Ispettorato del Lavoro", domain: ComplianceDomain.safety },
      { name: "Pi.M.U.S. (Piano di Montaggio, Uso e Smontaggio ponteggi)", domain: ComplianceDomain.safety },
      { name: "Registro verifiche periodiche ponteggi, gru e apparecchi sollevamento", domain: ComplianceDomain.safety },
      { name: "DURC regolare e verifica idoneita tecnico-professionale imprese", domain: ComplianceDomain.safety },
      { name: "Libretti di circolazione e verifiche macchine movimento terra e PEMP", domain: ComplianceDomain.safety },
      { name: "DUVRI cantiere per ditte esterne e subappalti", domain: ComplianceDomain.safety, isRequired: false },
    ],
  },
  {
    macroGroup: "metalmechanics",
    sectorName: "Metalmeccanica",
    documents: [
      { name: "DVR officina metalmeccanica e valutazione rumore/vibrazioni", domain: ComplianceDomain.safety },
      { name: "Libretti uso, manutenzione e marcatura CE macchine utensili", domain: ComplianceDomain.safety },
      { name: "Registro verifiche periodiche attrezzature di lavoro (art. 71 D.Lgs. 81/08)", domain: ComplianceDomain.safety },
      { name: "Permessi di lavoro a caldo e procedure sicurezza saldatura/taglio", domain: ComplianceDomain.safety },
      { name: "Schede di sicurezza (SDS) gas tecnici, lubrorefrigeranti, oli e vernici", domain: ComplianceDomain.safety },
      { name: "Registro carico/scarico rifiuti speciali (FIR) fanghi e oli esausti", domain: ComplianceDomain.safety },
      { name: "Attestati abilitazione carrellisti, saldatori e conduttori gru/carroponte", domain: ComplianceDomain.safety },
    ],
  },
  {
    macroGroup: "healthcare",
    sectorName: "Sanita e Studi Medici",
    documents: [
      { name: "Autorizzazione all'esercizio / Accreditamento sanitario regionale", domain: ComplianceDomain.both },
      { name: "DVR rischio biologico, agenti chimici e radioprotezione", domain: ComplianceDomain.safety },
      { name: "Registro sterilizzazione e verifiche autoclavi (test Bowie-Dick/spore)", domain: ComplianceDomain.both },
      { name: "Protocollo e registro rifiuti speciali a rischio infettivo (CER 180103) e FIR", domain: ComplianceDomain.safety },
      { name: "Piano prevenzione e campionamento Legionellosi rete idrica", domain: ComplianceDomain.safety },
      { name: "Registro dosimetria e relazione Esperto di Radioprotezione", domain: ComplianceDomain.safety, isRequired: false },
      { name: "Protocolli igienico-sanitari e procedure disinfezione ambulatoriale", domain: ComplianceDomain.both },
    ],
  },
  {
    macroGroup: "office-it",
    sectorName: "Uffici e Servizi IT",
    documents: [
      { name: "DVR uffici e valutazione ergonomica videoterminali (VDT)", domain: ComplianceDomain.safety },
      { name: "Valutazione rischio stress lavoro-correlato", domain: ComplianceDomain.safety },
      { name: "Piano di emergenza, evacuazione e planimetrie di esodo", domain: ComplianceDomain.safety },
      { name: "Verbale prova di evacuazione annuale", domain: ComplianceDomain.safety },
      { name: "Dichiarazione conformita impianto elettrico e verifiche DPR 462/01", domain: ComplianceDomain.safety },
      { name: "Registro manutenzione presidi antincendio e illuminazione emergenza", domain: ComplianceDomain.safety },
      { name: "Registro dei trattamenti GDPR e nomine incaricati trattamento dati", domain: ComplianceDomain.safety, isRequired: false },
    ],
  },
  {
    macroGroup: "agriculture",
    sectorName: "Agricoltura e Cantine",
    documents: [
      { name: "DVR azienda agricola e valutazione rischi specifici", domain: ComplianceDomain.safety },
      { name: "Registro dei trattamenti fitosanitari (Quaderno di Campagna)", domain: ComplianceDomain.safety },
      { name: "Abilitazione all'acquisto e utilizzo prodotti fitosanitari (Patentino PAN)", domain: ComplianceDomain.safety },
      { name: "Schede di sicurezza (SDS) prodotti fitosanitari e fertilizzanti", domain: ComplianceDomain.safety },
      { name: "Libretti di circolazione e verifiche ROPS/cardani macchine agricole", domain: ComplianceDomain.safety },
      { name: "Attestati abilitazione alla conduzione trattori agricoli o forestali", domain: ComplianceDomain.safety },
      { name: "Protocollo stoccaggio carburanti agricoli e vasche contenimento", domain: ComplianceDomain.safety, isRequired: false },
    ],
  },
];

export async function seedMacroSettori() {
  console.log("Seeding checklist macrosettori...");

  await prisma.documentTemplate.deleteMany({ where: { seedSource: SEED_SOURCE } });

  for (const sector of sectors) {
    const template = await prisma.checklistTemplate.upsert({
      where: { id: `tmpl-${sector.id}-generic-v1` },
      update: {
        name: sector.name,
        description: sector.description,
        macroGroup: sector.macroGroup,
        isActive: true,
      },
      create: {
        id: `tmpl-${sector.id}-generic-v1`,
        name: sector.name,
        description: sector.description,
        macroGroup: sector.macroGroup,
        isGeneral: false,
        isActive: true,
      },
    });

    await prisma.checklistItem.deleteMany({ where: { templateId: template.id } });
    await prisma.checklistItem.createMany({
      data: sector.items.map((entry, index) => ({
        ...entry,
        templateId: template.id,
        orderIndex: index + 1,
        isRequired: true,
      })),
    });
  }

  const allDocumentsData = [
    ...sectors.flatMap((sector) =>
      sector.documents.map((document, index) => ({
        id: `doc-${sector.id}-${String(index + 1).padStart(2, "0")}`,
        name: document.name,
        description: `Documento richiesto per ${sector.name}`,
        domain: document.domain,
        macroGroup: sector.macroGroup,
        isGeneral: false,
        isRequired: document.isRequired ?? true,
        isActive: true,
        seedSource: SEED_SOURCE,
      })),
    ),
    ...additionalSectorDocuments.flatMap((sector) =>
      sector.documents.map((document, index) => ({
        id: `doc-${sector.macroGroup.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${String(index + 1).padStart(2, "0")}`,
        name: document.name,
        description: `Documento richiesto per ${sector.sectorName}`,
        domain: document.domain,
        macroGroup: sector.macroGroup,
        isGeneral: false,
        isRequired: document.isRequired ?? true,
        isActive: true,
        seedSource: SEED_SOURCE,
      })),
    ),
  ];

  await prisma.documentTemplate.createMany({
    data: allDocumentsData,
  });

  console.log(
    `Seed macrosettori completato: ${sectors.length} settori (+ ${additionalSectorDocuments.length} settori verticali documentati), ${sectors.reduce(
      (total, sector) => total + sector.items.length,
      0,
    )} item, ${allDocumentsData.length} documenti.`,
  );
}
