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
  | "acque_legionella"
  | "matrici_ambientali";

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
  /** Prefissi di Codice ATECO a cui si applica (es. ["56.", "10."]). Se omesso o vuoto, segue le regole di categoria */
  applicableAtecoPrefixes?: string[];
  /** Prefissi di Codice ATECO espressamente esclusi */
  excludedAtecoPrefixes?: string[];
  /** Flag che indica se il documento è un Rapporto di Prova / Analisi di Laboratorio */
  isLaboratoryTestReport?: boolean;
  /** Se true, si applica prevalentemente al settore alimentare */
  isFoodSpecific?: boolean;
  /** Se true, si applica prevalentemente all'edilizia / cantieri */
  isConstructionSpecific?: boolean;
  /** Se true, si applica se ci sono impianti specifici o ricettività/apertura al pubblico */
  isPublicFacilitySpecific?: boolean;
  /** Contenuti minimi che devono essere presenti nel documento secondo la legge */
  minimumContents?: MinimumContentItem[];
  /** Se true, il documento ha una scadenza legale perentoria (es. CPI 5 anni, AUA 15 anni, DPR 462 2 o 5 anni, Scarichi 4 anni) */
  hasStatutoryExpiry?: boolean;
  /** Se true, il documento non ha scadenza formale ma è soggetto a riesame/aggiornamento periodico (di norma annuale +12 mesi) */
  isPeriodicReviewDocument?: boolean;
  /** Mesi di validità previsti dalla norma (es. 12 per riesame annuale, 60 per CPI 5 anni, 180 per AUA 15 anni, 48 per scarichi) */
  validityMonths?: number;
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
    subtitle: "Manuale HACCP con contenuti minimi, registri, allergeni e rapporti di prova alimentari",
    icon: "🍽️",
    badgeColor: "#16a34a",
    normScope: "Reg. CE 852/2004 • Reg. CE 178/2002 • Reg. CE 2073/2005 • Reg. UE 1169/2011",
  },
  sicurezza_81_08: {
    key: "sicurezza_81_08",
    title: "Sicurezza sul Lavoro D.Lgs. 81/2008",
    subtitle: "DVR con contenuti minimi art. 28, nomine, VDR rischi specifici, aerodispersi indoor e DPI",
    icon: "🦺",
    badgeColor: "#ea580c",
    normScope: "D.Lgs. 81/2008 e s.m.i. • D.M. 02/09/2021 • D.M. 01/09/2021 • UNI EN 689",
  },
  acque_legionella: {
    key: "acque_legionella",
    title: "Piano Sicurezza Acque & Rischio Legionella",
    subtitle: "Water Safety Plan, valutazione impianto idrico, campionamenti ufficiali e manutenzione",
    icon: "💧",
    badgeColor: "#2563eb",
    normScope: "D.Lgs. 18/2023 (Acque Potabili) • Linee Guida Legionellosi 2015",
  },
  matrici_ambientali: {
    key: "matrici_ambientali",
    title: "Matrici Ambientali: Emissioni Fumi, Scarichi Idrici e Suolo",
    subtitle: "Rapporti di prova analitici, AUA, emissioni in atmosfera, scarichi e terre da scavo",
    icon: "🌿",
    badgeColor: "#047857",
    normScope: "D.Lgs. 152/2006 (Testo Unico Ambientale) • D.P.R. 59/2013 (A.U.A.) • D.P.R. 120/2017",
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
    hasStatutoryExpiry: true,
    validityMonths: 6,
  },
  {
    id: "base-scia",
    name: "SCIA di Inizio Attività / Notifica Sanitaria / Titolo Abilitativo",
    category: "base_autorizzativa",
    normReference: "D.Lgs. 222/2016, art. 19 L. 241/90 e Reg. CE 852/04 art. 6",
    description: "Titolo autorizzativo per l'esercizio dell'attività d'impresa e registrazione sanitaria SUAP/ASL.",
    isRequiredDefault: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
  },
  {
    id: "base-planimetria",
    name: "Planimetria aggiornata dei locali con layout e destinazioni d'uso",
    category: "base_autorizzativa",
    normReference: "D.Lgs. 81/2008 Allegato IV punto 1.2 e Reg. CE 852/04 All. II",
    description: "Planimetria in scala con quote, destinazione funzionale degli ambienti, percorsi e uscite.",
    isRequiredDefault: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
  },
  {
    id: "base-agibilita",
    name: "Certificato di Agibilità / Destinazione d'Uso urbanistica",
    category: "base_autorizzativa",
    normReference: "D.P.R. 380/2001 (Testo Unico Edilizia), art. 24",
    description: "Attestazione delle condizioni di sicurezza, igiene, salubrità e conformità edilizio-urbanistica.",
    isRequiredDefault: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
  },
  {
    id: "base-dico-elettrico",
    name: "Dichiarazione di Conformità Impianto Elettrico (DICO D.M. 37/08)",
    category: "base_autorizzativa",
    normReference: "D.M. 37/2008, art. 7 e D.Lgs. 81/2008 art. 80",
    description: "Dichiarazione a regola d'arte dell'impianto elettrico con allegati obbligatori rilasciata dall'installatore.",
    isRequiredDefault: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
  },
  {
    id: "base-messa-a-terra",
    name: "Verbale Verifica Periodica Messa a Terra e Scariche Atmosferiche",
    category: "base_autorizzativa",
    normReference: "D.P.R. 462/2001, art. 4 e D.Lgs. 81/2008 art. 86",
    description: "Omologazione e verbale di verifica periodica biennale/quinquennale rilasciato da Organismo Abilitato o ASL/ARPA.",
    isRequiredDefault: true,
    hasStatutoryExpiry: true,
    validityMonths: 24,
  },
  {
    id: "base-cpi-antincendio",
    name: "Certificato di Prevenzione Incendi (CPI) o SCIA Antincendio",
    category: "base_autorizzativa",
    normReference: "D.P.R. 151/2011",
    description: "Titolo autorizzativo antincendio VVF per attività soggette (Attività riportate in Allegato I DPR 151/11).",
    isRequiredDefault: false,
    hasStatutoryExpiry: true,
    validityMonths: 60,
  },
  {
    id: "base-dico-gas",
    name: "Dichiarazione di Conformità Impianto Gas / Riscaldamento / Canne Fumarie",
    category: "base_autorizzativa",
    normReference: "D.M. 37/2008 e norme UNI CIG 8723 / UNI 7129",
    description: "DICO per apparecchiature di cottura industriali a gas, caldaie e impianti termici di aerazione.",
    isRequiredDefault: false,
    applicableAtecoPrefixes: ["56.", "10.", "11.", "45.2", "25.", "28.", "16.", "31."],
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
  },
  {
    id: "base-aua-ambientale",
    name: "Autorizzazione Unica Ambientale (AUA) / Scarichi idrici / Emissioni",
    category: "base_autorizzativa",
    normReference: "D.P.R. 59/2013 e D.Lgs. 152/2006 (Testo Unico Ambientale)",
    description: "Autorizzazione per scarichi reflui industriali/assimilati in fognatura, emissioni in atmosfera e impatto acustico.",
    isRequiredDefault: false,
    applicableAtecoPrefixes: [
      "45.2", "10.", "11.", "13.", "16.", "20.", "22.", "23.", "24.", "25.",
      "28.", "29.", "30.", "31.", "38.", "39.", "41.", "42.", "43.", "47.30", "96.01"
    ],
    hasStatutoryExpiry: true,
    validityMonths: 180,
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
    isPeriodicReviewDocument: true,
    validityMonths: 12,
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
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },
  {
    id: "haccp-registro-sanificazione",
    name: "Registro / Schede di avvenuta Sanificazione periodica",
    category: "haccp_alimentare",
    normReference: "Reg. CE 852/2004, All. II, Cap. V",
    description: "Tracciamento della pulizia e disinfezione ordinaria e straordinaria di superfici, cappe, filtri e locali.",
    isRequiredDefault: true,
    isFoodSpecific: true,
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },
  {
    id: "haccp-pest-control",
    name: "Verbali Interventi Ditta Esterna Pest Control & Planimetria Esche",
    category: "haccp_alimentare",
    normReference: "Reg. CE 852/2004, All. II, Cap. IX",
    description: "Verbali periodici della ditta specializzata di derattizzazione e disinfestazione con schede tossicologiche.",
    isRequiredDefault: true,
    isFoodSpecific: true,
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },
  {
    id: "haccp-analisi-alimenti",
    name: "Rapporti di Prova Analisi Microbiologiche Alimenti & Tamponi Superficiali (Reg. CE 2073/05)",
    category: "haccp_alimentare",
    normReference: "Reg. CE 2073/2005 sui criteri microbiologici e norma UNI EN ISO 18593",
    description: "Referti periodici di laboratorio accreditato su matrici alimentari lavorate (Listeria, Salmonella, E. Coli, Stafilococchi) e tamponi di superficie/attrezzature.",
    isRequiredDefault: true,
    isFoodSpecific: true,
    isLaboratoryTestReport: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
    applicableAtecoPrefixes: ["56.", "10.", "11.", "47.11", "47.2", "55.1", "93.29.2", "93.29.1"],
    minimumContents: [
      {
        id: "ana-al-1",
        label: "Ricerca di Listeria monocytogenes su alimenti pronti al consumo (RTE) e valutazione limiti di tolleranza",
        normArticle: "Reg. CE 2073/2005, Allegato I, Cap. 1 Criteri di sicurezza alimentare",
      },
      {
        id: "ana-al-2",
        label: "Ricerca di Salmonella spp. su preparati a base di carne, uova, dolci e matrici deperibili (assenza in 25g)",
        normArticle: "Reg. CE 2073/2005, Allegato I, Cap. 1",
      },
      {
        id: "ana-al-3",
        label: "Conta di Escherichia coli e Stafilococchi coagulasi-positivi come indicatori di igiene di processo",
        normArticle: "Reg. CE 2073/2005, Allegato I, Cap. 2 Criteri di igiene del processo",
      },
      {
        id: "ana-al-4",
        label: "Tamponi ambientali e di superficie su piani di lavoro, taglieri, affettatrici e coltelleria (metodo ISO 18593)",
        normArticle: "Reg. CE 2073/2005, art. 5 e norma UNI EN ISO 18593",
      },
      {
        id: "ana-al-5",
        label: "Verifica e validazione assenza di contaminazione crociata da allergeni (glutine, latte, soia) su linee dedicate",
        normArticle: "Reg. UE 1169/2011 e D.Lgs. 231/2017",
      },
      {
        id: "ana-al-6",
        label: "Rapporto di prova analitica rilasciato da laboratorio accreditato ACCREDIA (ISO/IEC 17025) con giudizio di conformità",
        normArticle: "Reg. CE 2073/2005, art. 5",
      },
    ],
  },
  {
    id: "haccp-conformita-moca",
    name: "Dichiarazioni di Conformità MOCA fornite dai produttori/fornitori",
    category: "haccp_alimentare",
    normReference: "Reg. CE 1935/2004, Reg. UE 10/2011 e D.Lgs. 29/2017",
    description: "Certificazioni di idoneità alimentare per carta forno, imballaggi, pellicole, contenitori take-away e stoviglie.",
    isRequiredDefault: true,
    isFoodSpecific: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
  },
  {
    id: "haccp-schede-tecniche-chimici",
    name: "Schede Tecniche e di Sicurezza (SDS) Prodotti Chimici di Pulizia",
    category: "haccp_alimentare",
    normReference: "Reg. CE 1907/2006 (REACH) e Reg. CE 1272/2008 (CLP)",
    description: "Schede a 16 punti dei detergenti, disincrostanti e disinfettanti impiegati con dosaggi e tempi di contatto.",
    isRequiredDefault: true,
    isFoodSpecific: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
  },
  {
    id: "haccp-attestati-formazione",
    name: "Attestati Formazione Alimentaristi (HACCP OSA e Addetti)",
    category: "haccp_alimentare",
    normReference: "Reg. CE 852/2004 All. II Cap. XII e Normative Regionali",
    description: "Attestati di formazione obbligatoria in corso di validità per tutti gli addetti che manipolano alimenti.",
    isRequiredDefault: true,
    isFoodSpecific: true,
    hasStatutoryExpiry: true,
    validityMonths: 36,
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
    isPeriodicReviewDocument: true,
    validityMonths: 12,
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
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },
  {
    id: "sec-verbale-rls",
    name: "Verbale di Elezione/Designazione RLS o comunicazione RLST",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, artt. 47 e 50",
    description: "Documentazione di nomina del Rappresentante dei Lavoratori per la Sicurezza aziendale o territoriale (comunicazione INAIL).",
    isRequiredDefault: true,
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },
  {
    id: "sec-nomina-medico",
    name: "Lettera di Nomina Medico Competente e Protocollo Sanitario",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, artt. 18, 25 e 41",
    description: "Incarico del Medico Competente iscritto all'Elenco Nazionale con piano di sorveglianza sanitaria correlato ai rischi.",
    isRequiredDefault: true,
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },
  {
    id: "sec-piano-emergenza",
    name: "Piano di Emergenza ed Evacuazione (PEE) & Planimetrie",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, art. 43 e D.M. 02/09/2021",
    description: "Procedure organizzative e operative per fronteggiare emergenze, incendi ed evacuazione rapida dei locali.",
    isRequiredDefault: true,
    isPeriodicReviewDocument: true,
    validityMonths: 12,
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
    hasStatutoryExpiry: true,
    validityMonths: 6,
  },
  {
    id: "sec-vdr-chimico",
    name: "Valutazione Specifica Rischio Chimico (art. 223 D.Lgs. 81/08)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, Titolo IX, Capo I, artt. 221-232",
    description: "Valutazione dei pericoli chimici legati a prodotti di pulizia, disinfezione o lavorazione con schede SDS a 16 punti.",
    isRequiredDefault: true,
    isPeriodicReviewDocument: true,
    validityMonths: 12,
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
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },
  {
    id: "sec-vdr-vibrazioni",
    name: "Valutazione Rischio Vibrazioni (Mano-Braccio e Corpo Intero)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, Titolo VIII, Capo III, artt. 199-205",
    description: "Valutazione delle vibrazioni trasmesse al sistema mano-braccio (HAV) o corpo intero (WBV).",
    isRequiredDefault: false,
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },
  {
    id: "sec-vdr-mmc",
    name: "Valutazione Rischio Movimentazione Manuale Carichi (MMC / NIOSH)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, Titolo VI, artt. 167-171 e ISO 11228",
    description: "Valutazione delle attività di sollevamento pesi, traino/spinta carrelli o movimenti ripetitivi arti superiori.",
    isRequiredDefault: true,
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },
  {
    id: "sec-verbali-dpi",
    name: "Verbali di Consegna dei DPI firmati dai lavoratori",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, artt. 76, 77 e 79",
    description: "Moduli firmati dai dipendenti per ricevuta dei Dispositivi di Protezione Individuale e relativo addestramento.",
    isRequiredDefault: true,
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },
  {
    id: "sec-giudizi-idoneita",
    name: "Cartelle e Giudizi di Idoneità alla Mansione rilasciati dal Medico",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, art. 41",
    description: "Certificati di idoneità lavorativa con eventuali prescrizioni/limitazioni per ciascun lavoratore soggetto a sorveglianza.",
    isRequiredDefault: true,
    hasStatutoryExpiry: true,
    validityMonths: 12,
  },
  {
    id: "sec-riunione-periodica",
    name: "Verbale della Riunione Periodica di Sicurezza (art. 35)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, art. 35",
    description: "Verbale dell'incontro annuale tra Datore di Lavoro, RSPP, Medico Competente e RLS (obbligatorio > 15 dipendenti).",
    isRequiredDefault: false,
    hasStatutoryExpiry: true,
    validityMonths: 12,
  },
  {
    id: "sec-duvri",
    name: "DUVRI - Valutazione Rischi Interferenti per Ditte Esterne / Appalti",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, art. 26",
    description: "Documento unico per eliminare i rischi di interferenza con imprese appaltatrici o lavoratori autonomi in sede.",
    isRequiredDefault: false,
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },
  {
    id: "sec-pos-cantieri",
    name: "POS - Piano Operativo di Sicurezza (per Edilizia / Cantieri)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008, Titolo IV, art. 89 e art. 96",
    description: "Documento di dettaglio della sicurezza per le lavorazioni di cantiere redatto dall'impresa esecutrice.",
    isRequiredDefault: false,
    isConstructionSpecific: true,
    applicableAtecoPrefixes: ["41.", "42.", "43."],
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },
  {
    id: "sec-monitoraggio-aerodispersi",
    name: "Rapporto di Prova Monitoraggio Agenti Chimici e Aerodispersi Indoor (Polveri legno, Silice, Fumi saldatura)",
    category: "sicurezza_81_08",
    normReference: "D.Lgs. 81/2008 Titolo IX, Allegati XXXVIII, XXXIX, XLI, XLII e norma UNI EN 689",
    description: "Campionamenti analitici dell'aria nei luoghi di lavoro per verifica del rispetto dei VLEP (Valori Limite di Esposizione Professionale).",
    isRequiredDefault: false,
    isLaboratoryTestReport: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
    applicableAtecoPrefixes: ["16.", "31.", "25.", "28.", "41.", "42.", "43.", "45.2", "23.", "20.", "22."],
    minimumContents: [
      {
        id: "aero-mc-1",
        label: "Strategia di campionamento secondo norma UNI EN 689 con definizione dei Gruppi di Esposizione Omogenea (SEG)",
        normArticle: "Norma UNI EN 689:2019 e D.Lgs. 81/2008 art. 225",
      },
      {
        id: "aero-mc-2",
        label: "Determinazione quantitativa delle polveri totali, frazione inalabile e frazione respirabile",
        normArticle: "D.Lgs. 81/2008, Allegato XXXVIII",
      },
      {
        id: "aero-mc-3",
        label: "Monitoraggio polveri di legno duro con confronto limite vincolante (VLEP 2 mg/m³ ex All. XLII)",
        normArticle: "D.Lgs. 81/2008, Allegato XLII (Agenti Cancerogeni)",
      },
      {
        id: "aero-mc-4",
        label: "Monitoraggio Silice Libera Cristallina frazione respirabile per edilizia, cave e inerti (VLEP 0.1 mg/m³)",
        normArticle: "D.Lgs. 81/2008, All. XLII e Direttiva UE 2017/2398",
      },
      {
        id: "aero-mc-5",
        label: "Campionamento e determinazione fumi di saldatura e metalli pesanti aerodispersi (Manganese, Nichel, Cromo VI)",
        normArticle: "D.Lgs. 81/2008, Allegato XXXVIII",
      },
      {
        id: "aero-mc-6",
        label: "Campionamento e gascromatografia solventi organici volatili (COV / BTEX) in cabine di verniciatura",
        normArticle: "D.Lgs. 81/2008, Allegato XXXVIII",
      },
      {
        id: "aero-mc-7",
        label: "Rapporto di prova firmato da Chimico / Igienista Industriale abilitato con esito del test di conformità UNI EN 689",
        normArticle: "Norma UNI EN 689:2019",
      },
    ],
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
    isPeriodicReviewDocument: true,
    validityMonths: 12,
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
    name: "Rapporti di Prova Ufficiali di Analisi delle Acque Potabili (D.Lgs. 18/2023)",
    category: "acque_legionella",
    normReference: "D.Lgs. 18/2023, Allegato I e Allegato II",
    description: "Certificati analitici periodici di laboratorio accreditato su parametri microbiologici e chimici dell'acqua destinata al consumo umano.",
    isRequiredDefault: true,
    isLaboratoryTestReport: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
    minimumContents: [
      {
        id: "acq-mc-1",
        label: "Parametri microbiologici di legge: Escherichia coli (0 UFC/100ml) ed Enterococchi (0 UFC/100ml)",
        normArticle: "D.Lgs. 18/2023, Allegato I, Parte A",
      },
      {
        id: "acq-mc-2",
        label: "Parametri chimici obbligatori: Piombo (max 5 µg/l), Rame (max 2 mg/l), Nichel (max 20 µg/l), Nitrati (max 50 mg/l) e PFAS",
        normArticle: "D.Lgs. 18/2023, Allegato I, Parte B",
      },
      {
        id: "acq-mc-3",
        label: "Parametri indicatori: Cloro residuo libero/totale, pH, Conducibilità elettrica, Torbidità e Conta colonie a 22°C/37°C",
        normArticle: "D.Lgs. 18/2023, Allegato I, Parte C",
      },
      {
        id: "acq-mc-4",
        label: "Verbale di campionamento al punto di consegna e ai rubinetti terminali d'uso più sfavorevoli con catena di custodia",
        normArticle: "D.Lgs. 18/2023, Allegato II",
      },
    ],
  },
  {
    id: "acque-analisi-legionella",
    name: "Registro Campionamenti e Rapporti di Prova Ricerca Legionella pneumophila",
    category: "acque_legionella",
    normReference: "Linee Guida Nazionali per la Prevenzione e il Controllo della Legionellosi (07/05/2015) e D.Lgs. 18/2023",
    description: "Campionamenti periodici nei punti terminali a maggior rischio con conteggio UFC/L effettuati da laboratorio qualificato.",
    isRequiredDefault: true,
    isLaboratoryTestReport: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
    minimumContents: [
      {
        id: "leg-mc-1",
        label: "Campionamento secondo norma ISO 11731 ai punti critici (soffioni docce, rompigetto, ricircolo ACS, serbatoi di accumulo)",
        normArticle: "Linee Guida Nazionali 2015, par. 3.2 e norma ISO 11731",
      },
      {
        id: "leg-mc-2",
        label: "Determinazione quantitativa Legionella pneumophila (sierogruppo 1 e altri sierogruppi 2-14) espressa in UFC/Litro",
        normArticle: "Linee Guida Nazionali 2015, par. 3.3",
      },
      {
        id: "leg-mc-3",
        label: "Confronto con le soglie di rischio Linee Guida (<100 UFC/L: idoneo; 101-1000 UFC/L: revisione WSP; >1000 UFC/L: bonifica immediata)",
        normArticle: "Linee Guida Nazionali 2015, Tabella 4",
      },
      {
        id: "leg-mc-4",
        label: "Rapporto di prova accreditato rilasciato da laboratorio iscritto al registro regionale / ACCREDIA",
        normArticle: "Linee Guida Nazionali 2015 e D.Lgs. 18/2023",
      },
    ],
  },
  {
    id: "acque-registro-manutenzione",
    name: "Registro Interventi Manutenzione e Bonifica Impianto Idrico",
    category: "acque_legionella",
    normReference: "D.Lgs. 18/2023 e Linee Guida Legionellosi 2015",
    description: "Tracciamento di lavaggi periodici, sostituzione filtri, decalcificazione rompigetto ed eventuali shock termici/chimici.",
    isRequiredDefault: true,
    isPeriodicReviewDocument: true,
    validityMonths: 12,
  },

  // =========================================================================
  // 5. MATRICI AMBIENTALI: EMISSIONI FUMI, SCARICHI IDRICI E SUOLO (D.LGS. 152/2006 / AUA)
  // =========================================================================
  {
    id: "env-rapporto-emissioni-fumi",
    name: "Rapporto di Prova Analisi Emissioni in Atmosfera ai Camini (D.Lgs. 152/2006 Parte V - AUA)",
    category: "matrici_ambientali",
    normReference: "D.Lgs. 152/2006, Parte V, D.P.R. 59/2013 (AUA) e norme UNI EN ISO di campionamento",
    description: "Certificati analitici periodici dei fumi convogliati emessi da cabine di verniciatura, forni, caldaie, saldature e lavorazioni meccaniche.",
    isRequiredDefault: true,
    isLaboratoryTestReport: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
    applicableAtecoPrefixes: [
      "45.2", "25.", "28.", "16.", "31.", "10.", "11.", "13.", "20.", "22.", "23.", "24.", "29.", "30.", "33.", "38."
    ],
    minimumContents: [
      {
        id: "env-fumi-1",
        label: "Verbale di prelievo con misurazione portata volumetrica, temperatura fumi, velocità ed umidità (UNI EN 15259)",
        normArticle: "Norma UNI EN 15259 e D.Lgs. 152/2006 Allegato VI Parte V",
      },
      {
        id: "env-fumi-2",
        label: "Determinazione analitica delle polveri totali ed inorganiche convogliate ai punti di emissione (E1, E2, ecc.)",
        normArticle: "D.Lgs. 152/2006 Parte V, All. I",
      },
      {
        id: "env-fumi-3",
        label: "Determinazione quantitativa dei Composti Organici Volatili (COV / COT) e confronto con soglie autorizzate AUA",
        normArticle: "D.Lgs. 152/2006 art. 275 e All. III",
      },
      {
        id: "env-fumi-4",
        label: "Analisi fumi di combustione (Monossido di Carbonio CO, Ossidi di Azoto NOx, Biossido di Zolfo SO2)",
        normArticle: "D.Lgs. 152/2006 Parte V, All. I",
      },
      {
        id: "env-fumi-5",
        label: "Confronto analitico con i Valori Limite di Emissione (VLE) prescritti nell'atto autorizzativo AUA o D.G.R.",
        normArticle: "D.P.R. 59/2013 e D.Lgs. 152/2006 art. 271",
      },
      {
        id: "env-fumi-6",
        label: "Certificato di taratura delle sonde e rapporto firmato da laboratorio accreditato / chimico abilitato",
        normArticle: "Norma UNI CEI EN ISO/IEC 17025",
      },
    ],
  },
  {
    id: "env-rapporto-scarichi-idrici",
    name: "Rapporto di Prova Analisi Scarichi Acque Reflue Industriali e Prima Pioggia (D.Lgs. 152/06 Parte III)",
    category: "matrici_ambientali",
    normReference: "D.Lgs. 152/2006, Parte III, Allegato 5 Tabella 3 e 4, e D.P.R. 59/2013 (AUA)",
    description: "Analisi periodiche delle acque reflue scaricate in pubblica fognatura o corpo idrico superficiale (compreso scarico da disoleatore).",
    isRequiredDefault: true,
    isLaboratoryTestReport: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
    applicableAtecoPrefixes: [
      "45.2", "25.", "28.", "10.", "11.", "13.", "20.", "22.", "23.", "24.", "38.", "41.", "42.", "43.", "47.30", "96.01"
    ],
    minimumContents: [
      {
        id: "env-idro-1",
        label: "Campionamento medio ponderato al pozzetto fiscale di ispezione a monte dell'immissione (UNI EN ISO 5667)",
        normArticle: "Norma UNI EN ISO 5667 e D.Lgs. 152/2006 art. 101",
      },
      {
        id: "env-idro-2",
        label: "Parametri chimico-fisici di base: pH, Conducibilità elettrica, Solidi Sospesi Totali (SST) e Temperatura",
        normArticle: "D.Lgs. 152/2006, All. 5 Tabella 3",
      },
      {
        id: "env-idro-3",
        label: "Carico inquinante organico: COD (Domanda Chimica di Ossigeno) e BOD5 (Domanda Biochimica di Ossigeno)",
        normArticle: "D.Lgs. 152/2006, All. 5 Tabella 3",
      },
      {
        id: "env-idro-4",
        label: "Determinazione Idrocarburi Totali (C>10) per verifica efficienza disoleatore / vasca di decantazione",
        normArticle: "D.Lgs. 152/2006, All. 5 Tabella 3 e 4",
      },
      {
        id: "env-idro-5",
        label: "Analisi Solventi organici clorurati, Tensioattivi totali e Metalli pesanti (Zinco, Ferro, Nichel, Rame, Cromo)",
        normArticle: "D.Lgs. 152/2006, All. 5 Tabella 3",
      },
      {
        id: "env-idro-6",
        label: "Attestazione di conformità ai limiti della Tabella 3 (fognatura) o Tabella 4 (acque superficiali) All. 5 Parte III",
        normArticle: "D.Lgs. 152/2006, art. 101 e art. 107",
      },
    ],
  },
  {
    id: "env-autorizzazione-scarichi",
    name: "Autorizzazione allo Scarico delle Acque Reflue (art. 124 D.Lgs. 152/2006)",
    category: "matrici_ambientali",
    normReference: "D.Lgs. 152/2006, art. 124 e s.m.i.",
    description: "Titolo autorizzativo quadriennale per lo scarico di acque reflue industriali o assimilate in pubblica fognatura/corpo idrico (validità 4 anni / 48 mesi).",
    isRequiredDefault: false,
    hasStatutoryExpiry: true,
    validityMonths: 48,
    applicableAtecoPrefixes: [
      "45.2", "25.", "28.", "10.", "11.", "13.", "20.", "22.", "23.", "24.", "38.", "41.", "42.", "43.", "47.30", "96.01"
    ],
  },
  {
    id: "env-rapporto-terre-scavo",
    name: "Rapporto di Prova Caratterizzazione Terre e Rocce da Scavo (D.P.R. 120/2017 & D.Lgs. 152/06)",
    category: "matrici_ambientali",
    normReference: "D.P.R. 120/2017 e D.Lgs. 152/2006, Parte IV, Titolo V, Allegato 5 Tabella 1",
    description: "Certificati analitici di campionamento del suolo e terre da scavo per qualifica come sottoprodotto o recupero ambientale.",
    isRequiredDefault: true,
    isLaboratoryTestReport: true,
    hasStatutoryExpiry: false,
    isPeriodicReviewDocument: false,
    isConstructionSpecific: true,
    applicableAtecoPrefixes: ["41.", "42.", "43.", "08.", "09.", "38.", "39."],
    minimumContents: [
      {
        id: "env-scav-1",
        label: "Piano di campionamento georiferito e relazione geologica/ambientale sul sito di scavo (D.P.R. 120/17)",
        normArticle: "D.P.R. 120/2017, Allegato 2",
      },
      {
        id: "env-scav-2",
        label: "Determinazione Metalli pesanti (Arsenico, Cadmio, Cobalto, Nichel, Piombo, Rame, Zinco, Cromo totale e VI)",
        normArticle: "D.Lgs. 152/2006, All. 5 Tabella 1 Colonna A/B",
      },
      {
        id: "env-scav-3",
        label: "Idrocarburi leggeri C<12, pesanti C>12, BTEX (Benzene, Toluene, Xileni) e IPA (Idrocarburi Policiclici)",
        normArticle: "D.Lgs. 152/2006, All. 5 Tabella 1",
      },
      {
        id: "env-scav-4",
        label: "Test di cessione su eluato (D.M. 05/02/1998 Allegato 3) per verifica compatibilità ambientale",
        normArticle: "D.M. 05/02/1998 e D.P.R. 120/2017",
      },
      {
        id: "env-scav-5",
        label: "Attestazione analitica di rispetto dei limiti di Concentrazione Soglia di Contaminazione (CSC) Colonna A o B",
        normArticle: "D.P.R. 120/2017, art. 4",
      },
      {
        id: "env-scav-6",
        label: "Dichiarazione di Utilizzo (D.U. / D.A.U.) con indicazione del sito di destinazione finale e tempi di riutilizzo",
        normArticle: "D.P.R. 120/2017, art. 21",
      },
    ],
  },
  {
    id: "env-mappatura-amianto",
    name: "Relazione Tecnica Censimento e Valutazione Stato Amianto (MCA) nei Fabbricati",
    category: "matrici_ambientali",
    normReference: "L. 257/1992, D.M. 06/09/1994 e D.Lgs. 81/2008 Titolo IX Capo III",
    description: "Mappatura dei materiali contenenti amianto (coperture in eternit, canne fumarie, coibentazioni) con indice di degrado.",
    isRequiredDefault: false,
    isLaboratoryTestReport: true,
    isPeriodicReviewDocument: true,
    validityMonths: 24,
    applicableAtecoPrefixes: ["41.", "42.", "43.", "68.", "38.", "39.", "45.2", "25.", "16.", "10."],
    minimumContents: [
      {
        id: "env-ami-1",
        label: "Censimento visivo dei manufatti sospetti (coperture, canne fumarie, controsoffitti, vinilamianto)",
        normArticle: "D.M. 06/09/1994, All. 1",
      },
      {
        id: "env-ami-2",
        label: "Rapporto di prova analitico su campioni massivi con microscopia ottica (MOCF) o elettronica (SEM/EDX)",
        normArticle: "D.M. 06/09/1994 e L. 257/1992",
      },
      {
        id: "env-ami-3",
        label: "Calcolo dell'Indice di Degrado (I.D.) della copertura secondo D.M. 06/09/1994 o algoritmi regionali",
        normArticle: "D.M. 06/09/1994, punto 2",
      },
      {
        id: "env-ami-4",
        label: "Nomina formale del Responsabile del Rischio Amianto con compiti di controllo e programma di custodia",
        normArticle: "D.M. 06/09/1994, punto 4",
      },
      {
        id: "env-ami-5",
        label: "Programma di monitoraggio periodico e valutazione delle azioni (bonifica, incapsulamento, rimozione)",
        normArticle: "D.Lgs. 81/2008, artt. 248-256",
      },
    ],
  },
  {
    id: "env-registro-rifiuti",
    name: "Registro di Carico e Scarico Rifiuti & Formulari FIR / RENTRI",
    category: "matrici_ambientali",
    normReference: "D.Lgs. 152/2006, art. 190 e D.M. 59/2023 (RENTRI)",
    description: "Tracciamento della produzione e smaltimento rifiuti speciali pericolosi e non pericolosi (oli esausti, batterie, filtri, imballaggi).",
    isRequiredDefault: true,
    isPeriodicReviewDocument: true,
    validityMonths: 12,
    applicableAtecoPrefixes: [
      "45.2", "25.", "28.", "16.", "31.", "10.", "11.", "13.", "20.", "22.", "23.", "24.", "38.", "39.", "41.", "42.", "43.", "47.30", "86.", "96.01", "96.02"
    ],
  },
];

/**
 * Funzione di classificazione automatica di un documento in una delle 5 macro-aree
 * in base al nome e alla norma.
 */
export function classifyDocumentCategory(docName: string): DocumentCategory {
  const lower = docName.toLowerCase();

  // 1. Matrici ambientali
  if (
    lower.includes("emission") ||
    lower.includes("camini") ||
    lower.includes("camin") ||
    lower.includes("fumi") ||
    lower.includes("scaric") ||
    lower.includes("reflu") ||
    lower.includes("fogna") ||
    lower.includes("disoleat") ||
    lower.includes("terre da scavo") ||
    lower.includes("rocce da scavo") ||
    lower.includes("suolo") ||
    lower.includes("sottosuolo") ||
    lower.includes("amianto") ||
    lower.includes("mca") ||
    lower.includes("rifiut") ||
    lower.includes("rentri") ||
    lower.includes("fir")
  ) {
    return "matrici_ambientali";
  }

  // 2. Acque e Legionella
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

  // 3. HACCP / Igiene alimentare
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

  // 4. Base autorizzativa / propedeutica
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
    lower.includes("canne fumarie")
  ) {
    return "base_autorizzativa";
  }

  // 5. Default: Sicurezza sul Lavoro D.Lgs. 81/2008
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
      (def.id === "acque-psa" && (lower.includes("acque") || lower.includes("legionell"))) ||
      (def.id === "env-rapporto-emissioni-fumi" && (lower.includes("emission") || lower.includes("camini"))) ||
      (def.id === "env-rapporto-scarichi-idrici" && lower.includes("scarich") && lower.includes("rapporto")) ||
      (def.id === "env-autorizzazione-scarichi" && lower.includes("scaric") && (lower.includes("autorizz") || lower.includes("titolo"))) ||
      (def.id === "env-rapporto-terre-scavo" && lower.includes("terre da scavo"))
    );
  });
}

/**
 * Determina se un documento ha una scadenza legale perentoria, un riesame periodico obbligatorio,
 * o se è un atto permanente / rapporto di prova senza scadenza.
 */
export function getDocumentExpiryType(
  def?: NormativeDocumentDefinition,
): "statutory" | "periodic_review" | "permanent" {
  if (!def) return "permanent";
  if (def.hasStatutoryExpiry) return "statutory";
  if (def.isPeriodicReviewDocument) return "periodic_review";
  return "permanent";
}

/**
 * Formatta in italiano la durata di validità di un documento (es. "5 anni (60 mesi)", "12 mesi")
 */
export function formatDocumentValidity(target?: NormativeDocumentDefinition | number): string {
  const months = typeof target === "number" ? target : target?.validityMonths;
  if (!months) return "Nessuna scadenza";
  if (months % 12 === 0) {
    const years = months / 12;
    return years === 1 ? "1 anno (12 mesi)" : `${years} anni (${months} mesi)`;
  }
  return `${months} mesi`;
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

  // Sezione Matrici Ambientali:
  if (category === "matrici_ambientali") {
    if (checklistMode === "haccp_only") {
      return { applicable: false, reason: "Sopralluogo impostato in modalità Solo HACCP." };
    }
    const isEnvSector =
      /^45\.2/.test(ateco) || // Officine, carrozzerie, gommisti, riparazioni auto
      /^[1-3][0-9]\./.test(ateco) || // Industria manifatturiera (10-33: legno, metallo, alimentare industriale, plastica, chimica)
      /^41\./.test(ateco) || // Costruzione di edifici (terre da scavo, amianto)
      /^42\./.test(ateco) || // Ingegneria civile
      /^43\./.test(ateco) || // Lavori di costruzione specializzati
      /^38\./.test(ateco) || // Raccolta e trattamento rifiuti
      /^39\./.test(ateco) || // Bonifica e servizi di gestione rifiuti
      /^0[89]\./.test(ateco) || // Cave ed estrazione
      /^47\.30/.test(ateco) || // Commercio carburanti / stazioni di servizio
      /^96\.01/.test(ateco); // Lavanderie e tintorie (scarichi chimici)

    if (!ateco) {
      return {
        applicable: false,
        reason: "Settore ATECO non specificato: sezione attivabile per attività con emissioni in atmosfera, scarichi o terre da scavo.",
      };
    }
    if (isEnvSector) {
      return {
        applicable: true,
        reason: `Settore a impatto ambientale (ATECO ${ateco}): obblighi analitici e di controllo AUA / D.Lgs. 152/2006.`,
      };
    }
    return {
      applicable: false,
      reason: `Attività (ATECO ${ateco}) a basso impatto ambientale senza scarichi industriali, camini o movimentazione terre.`,
    };
  }

  return { applicable: true, reason: "Applicabile" };
}

/**
 * Normalizza il codice ATECO rimuovendo caratteri non numerici
 */
export function normalizeAteco(ateco?: string): string {
  if (!ateco) return "";
  return ateco.replace(/[^0-9]/g, "");
}

/**
 * Verifica se un codice ATECO corrisponde al prefisso specificato
 */
export function matchAtecoPrefix(atecoCode: string | undefined, prefixPattern: string): boolean {
  if (!atecoCode) return false;
  const cleanAteco = normalizeAteco(atecoCode);
  const cleanPrefix = normalizeAteco(prefixPattern);
  if (!cleanPrefix) return false;
  return cleanAteco.startsWith(cleanPrefix);
}

/**
 * Verifica se un documento del catalogo è applicabile al codice ATECO specificato
 */
export function isDocumentApplicableToAteco(
  docDef: NormativeDocumentDefinition,
  atecoCode?: string,
  checklistMode?: string,
): boolean {
  const ateco = (atecoCode ?? "").trim();

  // 1. ChecklistMode filter
  if (checklistMode === "haccp_only" && docDef.category !== "haccp_alimentare" && docDef.category !== "base_autorizzativa") {
    return false;
  }
  if (checklistMode === "safety_only" && docDef.category === "haccp_alimentare") {
    return false;
  }

  // 2. Prefissi esclusi
  if (docDef.excludedAtecoPrefixes && docDef.excludedAtecoPrefixes.length > 0 && ateco) {
    const isExcluded = docDef.excludedAtecoPrefixes.some((p) => matchAtecoPrefix(ateco, p));
    if (isExcluded) return false;
  }

  // 3. Regole per categoria HACCP
  if (docDef.category === "haccp_alimentare") {
    const catCheck = isCategoryApplicableForAteco("haccp_alimentare", ateco, checklistMode);
    if (!catCheck.applicable && ateco) {
      return false;
    }
  }

  // 4. Regole per categoria Matrici Ambientali
  if (docDef.category === "matrici_ambientali") {
    const catCheck = isCategoryApplicableForAteco("matrici_ambientali", ateco, checklistMode);
    if (!catCheck.applicable && ateco) {
      return false;
    }
  }

  // 5. Prefissi applicabili espliciti sul documento
  if (docDef.applicableAtecoPrefixes && docDef.applicableAtecoPrefixes.length > 0) {
    if (!ateco) {
      // Se nessun ATECO è specificato, includi solo se è richiesto di base e non specialistico
      return docDef.isRequiredDefault && !docDef.isConstructionSpecific && !docDef.isFoodSpecific;
    }
    return docDef.applicableAtecoPrefixes.some((p) => matchAtecoPrefix(ateco, p));
  }

  // 6. Specifico per l'edilizia / cantieri
  if (docDef.isConstructionSpecific) {
    if (!ateco) return false;
    const isConstruction = matchAtecoPrefix(ateco, "41") || matchAtecoPrefix(ateco, "42") || matchAtecoPrefix(ateco, "43");
    return isConstruction;
  }

  // 7. Specifico per il settore alimentare
  if (docDef.isFoodSpecific) {
    if (!ateco) return true;
    const isFood =
      matchAtecoPrefix(ateco, "56") ||
      matchAtecoPrefix(ateco, "4711") ||
      matchAtecoPrefix(ateco, "472") ||
      matchAtecoPrefix(ateco, "10") ||
      matchAtecoPrefix(ateco, "11") ||
      matchAtecoPrefix(ateco, "551") ||
      matchAtecoPrefix(ateco, "93292") ||
      matchAtecoPrefix(ateco, "93291");
    return isFood;
  }

  return true;
}

/**
 * Filtra il catalogo normativo restituendo solo i documenti applicabili per l'ATECO e modalità
 */
export function filterDocumentsForAteco(
  catalog: NormativeDocumentDefinition[],
  atecoCode?: string,
  checklistMode?: string,
): NormativeDocumentDefinition[] {
  return catalog.filter((docDef) => isDocumentApplicableToAteco(docDef, atecoCode, checklistMode));
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
