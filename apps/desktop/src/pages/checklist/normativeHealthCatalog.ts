/**
 * normativeHealthCatalog.ts
 *
 * Catalogo normativo esaustivo per la Sorveglianza Sanitaria aziendale in FedShield.
 * Conforme a:
 * - D.Lgs. 81/2008 (Testo Unico Sicurezza sul Lavoro) - Artt. 18, 25, 38, 39, 40, 41, 42
 * - D.Lgs. 151/2001 (Testo Unico Maternità e Paternità) & D.Lgs. 81/08 art. 28 c. 1-ter
 * - Legge 977/1967 (Tutela del lavoro dei fanciulli e degli adolescenti) mod. D.Lgs. 345/1999
 * - D.M. 05/09/2012 e Circolari INAIL (Allegato 3B - Trasmissione telematica dati aggregati entro il 31 marzo)
 * - Regolamento UE 2016/679 (GDPR) e D.Lgs. 196/2003 (Protezione dati sanitari e custodia cartelle)
 */

export interface MinimumContentItem {
  id: string;
  label: string;
  normArticle: string;
  description?: string;
}

export interface SanctionDetail {
  liableSubject: "Datore di Lavoro" | "Dirigente" | "Medico Competente";
  normArticle: string;
  sanctionType: "arresto_o_ammenda" | "ammenda" | "sanzione_amministrativa";
  minFineEuro?: number;
  maxFineEuro?: number;
  arrestMonths?: string;
  description: string;
}

export type StatutoryDeadlineFrequency =
  | "annual_fixed_31_march"  // Scadenza fissa perentoria INAIL al 31 marzo
  | "annual"                 // Scadenza annuale (12 mesi)
  | "per_mandate"            // Scadenza convenzione / nomina Medico Competente
  | "per_worker_frequency"   // In base alla mansione del dipendente (12, 24, 60 mesi)
  | "on_occurrence";         // A evento (es. ricorsi entro 30 giorni)

export interface HealthDocumentDefinition {
  id: string;
  name: string;
  normReference: string;
  description: string;
  isRequiredDefault: boolean;
  sanction: SanctionDetail;
  statutoryFrequency: StatutoryDeadlineFrequency;
  minimumContents: MinimumContentItem[];
}

export type SpecialProtectionGroup = "maternita_d_lgs_151_01" | "minori_l_977_67";

export interface SpecialProtectionRequirement {
  id: string;
  group: SpecialProtectionGroup;
  title: string;
  normReference: string;
  description: string;
  sanction: SanctionDetail;
  mandatoryMeasures: string[];
}

export interface MedicalExamProtocolItem {
  id: string;
  name: string;
  riskFactor: string;
  legalBasis: string;
  sanctionReference: string;
  isMandatoryByLaw: boolean;
  recommendedFrequencyMonths: number;
  typicalExams: string[];
  applicableAtecoPrefixes: string[];
  typicalJobRoles: string[];
  notes?: string;
}

export interface CustodyStorageConfig {
  location: "company_premises" | "doctor_office";
  storageType: "locked_cabinet" | "encrypted_digital";
  designatedResponsible: string;
  gdprCompliant: boolean;
  notes?: string;
}

export interface FitnessAppealRecord {
  id: string;
  employeeId?: string;
  workerFullName: string;
  appealDate: string;
  spresalAuthority: string;
  appealStatus: "submitted" | "in_review" | "confirmed" | "modified" | "revoked";
  notes?: string;
}

// ============================================================================
// 1. I 7 REQUISITI DOCUMENTALI BASE DELLA SORVEGLIANZA SANITARIA
// ============================================================================

export const HEALTH_DOCUMENTS_CATALOG: HealthDocumentDefinition[] = [
  {
    id: "doc-hlt-01",
    name: "Nomina Medico Competente con Accettazione Firmata",
    normReference: "D.Lgs. 81/2008, art. 18 c. 1 lett. a, artt. 38-39",
    description:
      "Atto formale di nomina del Medico Competente con indicazione del titolo professionale, verifica iscrizione all'Elenco Nazionale del Ministero della Salute e formale firma di accettazione dell'incarico.",
    isRequiredDefault: true,
    statutoryFrequency: "per_mandate",
    sanction: {
      liableSubject: "Datore di Lavoro",
      normArticle: "D.Lgs. 81/2008, art. 55 c. 5 lett. d",
      sanctionType: "arresto_o_ammenda",
      minFineEuro: 1842.78,
      maxFineEuro: 7371.13,
      arrestMonths: "da 2 a 4 mesi",
      description: "Arresto da 2 a 4 mesi o ammenda da 1.842,78 € a 7.371,13 € per omessa nomina del Medico Competente nei casi previsti.",
    },
    minimumContents: [
      {
        id: "mc-h01-1",
        label: "Lettera di incarico formale sottoscritta dal Datore di Lavoro",
        normArticle: "D.Lgs. 81/2008 art. 18 c. 1 lett. a",
      },
      {
        id: "mc-h01-2",
        label: "Accettazione formale sottoscritta dal Medico Competente",
        normArticle: "D.Lgs. 81/2008 art. 39",
      },
      {
        id: "mc-h01-3",
        label: "Verifica iscrizione all'Elenco Nazionale dei Medici Competenti (Min. Salute)",
        normArticle: "D.Lgs. 81/2008 art. 38 c. 3",
      },
      {
        id: "mc-h01-4",
        label: "Indicazione data decorrenza e durata del mandato / convenzione",
        normArticle: "D.Lgs. 81/2008 art. 39",
      },
    ],
  },
  {
    id: "doc-hlt-02",
    name: "Protocollo Sanitario Aziendale / Piano di Sorveglianza Sanitaria",
    normReference: "D.Lgs. 81/2008, art. 25 c. 1 lett. b e art. 41",
    description:
      "Piano di sorveglianza sanitaria definito dal Medico Competente in funzione dei rischi specifici censiti nel DVR, con indicazione degli accertamenti preventivi, periodici e della loro periodicità.",
    isRequiredDefault: true,
    statutoryFrequency: "annual",
    sanction: {
      liableSubject: "Medico Competente",
      normArticle: "D.Lgs. 81/2008, art. 58 c. 1 lett. c",
      sanctionType: "arresto_o_ammenda",
      minFineEuro: 460.7,
      maxFineEuro: 1842.78,
      arrestMonths: "fino a 2 mesi",
      description: "Arresto fino a 2 mesi o ammenda da 460,70 € a 1.842,78 € per mancata o carente predisposizione del protocollo sanitario.",
    },
    minimumContents: [
      {
        id: "mc-h02-1",
        label: "Mappatura specifica dei fattori di rischio per ogni singola mansione (dal DVR)",
        normArticle: "D.Lgs. 81/2008 art. 25 c. 1 lett. b",
      },
      {
        id: "mc-h02-2",
        label: "Elenco accertamenti clinici e strumentali preventivi e periodici",
        normArticle: "D.Lgs. 81/2008 art. 41 c. 2",
      },
      {
        id: "mc-h02-3",
        label: "Indicazione esplicita della periodicità (annuale, biennale, quinquennale) per rischio",
        normArticle: "D.Lgs. 81/2008 art. 41 c. 2 lett. b",
      },
      {
        id: "mc-h02-4",
        label: "Previsione accertamenti tossicologici alcol e stupefacenti per mansioni a rischio terzi",
        normArticle: "Intesa Stato-Regioni 30/10/2007 e D.Lgs. 81/08 art. 41 c. 4",
      },
    ],
  },
  {
    id: "doc-hlt-03",
    name: "Relazione Sanitaria Annuale & Allegato 3B INAIL",
    normReference: "D.Lgs. 81/2008, art. 40 c. 1, art. 25 c. 1 lett. i, D.M. 05/09/2012",
    description:
      "Elaborazione e trasmissione telematica all'INAIL delle informazioni aggregate sanitarie e di rischio (Allegato 3B) entro la data perentoria del 31 marzo di ciascun anno.",
    isRequiredDefault: true,
    statutoryFrequency: "annual_fixed_31_march",
    sanction: {
      liableSubject: "Medico Competente",
      normArticle: "D.Lgs. 81/2008, art. 58 c. 1 lett. e",
      sanctionType: "sanzione_amministrativa",
      minFineEuro: 1228.52,
      maxFineEuro: 4914.08,
      description: "Sanzione amministrativa pecuniaria da 1.228,52 € a 4.914,08 € per omessa o tardiva trasmissione dell'Allegato 3B all'INAIL.",
    },
    minimumContents: [
      {
        id: "mc-h03-1",
        label: "Elaborazione dei dati aggregati e anonimi dei lavoratori sottoposti a visita",
        normArticle: "D.Lgs. 81/2008 art. 40 c. 1",
      },
      {
        id: "mc-h03-2",
        label: "Ricevuta telematica di avvenuta trasmissione sulla piattaforma web INAIL",
        normArticle: "D.M. 05/09/2012",
      },
      {
        id: "mc-h03-3",
        label: "Verifica rispetto del termine perentorio di trasmissione (entro il 31 marzo)",
        normArticle: "D.Lgs. 81/2008 art. 40 c. 1",
      },
      {
        id: "mc-h03-4",
        label: "Presentazione e discussione dei risultati in riunione periodica di sicurezza (art. 35)",
        normArticle: "D.Lgs. 81/2008 art. 25 c. 1 lett. i e art. 35",
      },
    ],
  },
  {
    id: "doc-hlt-04",
    name: "Verbale di Sopralluogo Annuale dei Luoghi di Lavoro del MC",
    normReference: "D.Lgs. 81/2008, art. 25 c. 1 lett. l",
    description:
      "Verbale del sopralluogo congiunto effettuato dal Medico Competente con cadenza almeno annuale presso i luoghi e le postazioni di lavoro aziendali.",
    isRequiredDefault: true,
    statutoryFrequency: "annual",
    sanction: {
      liableSubject: "Medico Competente",
      normArticle: "D.Lgs. 81/2008, art. 58 c. 1 lett. a",
      sanctionType: "arresto_o_ammenda",
      minFineEuro: 491.41,
      maxFineEuro: 1965.63,
      arrestMonths: "fino a 3 mesi",
      description: "Arresto fino a 3 mesi o ammenda da 491,41 € a 1.965,63 € per omesso sopralluogo annuale dei luoghi di lavoro.",
    },
    minimumContents: [
      {
        id: "mc-h04-1",
        label: "Data, orario e reparti/locali ispezionati dal Medico Competente",
        normArticle: "D.Lgs. 81/2008 art. 25 c. 1 lett. l",
      },
      {
        id: "mc-h04-2",
        label: "Rilievi su ergonomia delle postazioni, microclima, illuminazione e igiene",
        normArticle: "D.Lgs. 81/2008 art. 25 c. 1 lett. l",
      },
      {
        id: "mc-h04-3",
        label: "Prescrizioni igienico-sanitarie e raccomandazioni del Medico",
        normArticle: "D.Lgs. 81/2008 art. 25 c. 1 lett. l",
      },
      {
        id: "mc-h04-4",
        label: "Firme congiunte del Medico Competente, RSPP e RLS (se presente)",
        normArticle: "D.Lgs. 81/2008 art. 25 c. 1 lett. l",
      },
    ],
  },
  {
    id: "doc-hlt-05",
    name: "Registro dei Giudizi di Idoneità alla Mansione Specifica",
    normReference: "D.Lgs. 81/2008, art. 41 c. 2, c. 6, c. 6-bis",
    description:
      "Registro e archivio delle copie dei certificati di idoneità rilasciati dal Medico Competente al Datore di Lavoro e ai singoli lavoratori con tracciamento date e scadenze.",
    isRequiredDefault: true,
    statutoryFrequency: "per_worker_frequency",
    sanction: {
      liableSubject: "Datore di Lavoro",
      normArticle: "D.Lgs. 81/2008, art. 55 c. 5 lett. e",
      sanctionType: "ammenda",
      minFineEuro: 1228.52,
      maxFineEuro: 5528.35,
      description: "Ammenda da 1.228,52 € a 5.528,35 € per adibizione di lavoratori a mansioni senza prescritta visita medica e giudizio di idoneità.",
    },
    minimumContents: [
      {
        id: "mc-h05-1",
        label: "Copia formale del giudizio di idoneità per ciascun lavoratore esposto",
        normArticle: "D.Lgs. 81/2008 art. 41 c. 6-bis",
      },
      {
        id: "mc-h05-2",
        label: "Dicitura formale dell'esito (idoneo, idoneo parziale, inidoneo temporaneo/permanente)",
        normArticle: "D.Lgs. 81/2008 art. 41 c. 6",
      },
      {
        id: "mc-h05-3",
        label: "Data di rilascio e indicazione della data della successiva visita periodica",
        normArticle: "D.Lgs. 81/2008 art. 41 c. 6",
      },
      {
        id: "mc-h05-4",
        label: "Indicazione espressa della facoltà di ricorso entro 30 giorni ex art. 41 c. 9",
        normArticle: "D.Lgs. 81/2008 art. 41 c. 9",
      },
    ],
  },
  {
    id: "doc-hlt-06",
    name: "Cartelle Sanitarie e di Rischio: Custodia e Segreto Professionale",
    normReference: "D.Lgs. 81/2008, art. 25 c. 1 lett. c, art. 53 e Reg. UE 2016/679 (GDPR)",
    description:
      "Disciplinare e accertamento della custodia delle cartelle sanitarie e di rischio sotto la responsabilità del Medico Competente con salvaguardia del segreto professionale.",
    isRequiredDefault: true,
    statutoryFrequency: "per_mandate",
    sanction: {
      liableSubject: "Medico Competente",
      normArticle: "D.Lgs. 81/2008, art. 58 c. 1 lett. b",
      sanctionType: "arresto_o_ammenda",
      minFineEuro: 368.56,
      maxFineEuro: 1474.23,
      arrestMonths: "fino a 2 mesi",
      description: "Arresto fino a 2 mesi o ammenda da 368,56 € a 1.474,23 € per violazione delle modalità di custodia e tenuta delle cartelle sanitarie.",
    },
    minimumContents: [
      {
        id: "mc-h06-1",
        label: "Accordo formale sul luogo di custodia (sede aziendale o studio privato del MC)",
        normArticle: "D.Lgs. 81/2008 art. 25 c. 1 lett. c",
      },
      {
        id: "mc-h06-2",
        label: "Custodia cartacea in armadio chiuso a chiave ad accesso esclusivo del Medico",
        normArticle: "D.Lgs. 81/2008 art. 25 c. 1 lett. c",
      },
      {
        id: "mc-h06-3",
        label: "Se digitale: conformità art. 53 D.Lgs. 81/08 (cifratura, credenziali univoche e backup)",
        normArticle: "D.Lgs. 81/2008 art. 53",
      },
      {
        id: "mc-h06-4",
        label: "Informativa privacy e consenso al trattamento dati particolari (GDPR)",
        normArticle: "Regolamento UE 2016/679 artt. 9 e 13",
      },
    ],
  },
  {
    id: "doc-hlt-07",
    name: "Procedura e Fascicolo Ricorsi Avversi ai Giudizi di Idoneità (ASL/SPRESAL)",
    normReference: "D.Lgs. 81/2008, art. 41 c. 9",
    description:
      "Procedura aziendale e registro degli eventuali ricorsi inoltrati dal lavoratore o dal datore di lavoro all'organo di vigilanza (ASL/SPRESAL) entro 30 giorni dalla notifica del giudizio di idoneità.",
    isRequiredDefault: true,
    statutoryFrequency: "on_occurrence",
    sanction: {
      liableSubject: "Datore di Lavoro",
      normArticle: "D.Lgs. 81/2008, art. 55 c. 5 lett. e",
      sanctionType: "ammenda",
      minFineEuro: 1228.52,
      maxFineEuro: 5528.35,
      description: "Ammenda fino a 5.528,35 € se il datore non ottempera tempestivamente alle prescrizioni/modifiche dell'organo di vigilanza.",
    },
    minimumContents: [
      {
        id: "mc-h07-1",
        label: "Informativa scritta consegnata al lavoratore sul diritto di ricorso entro 30 giorni",
        normArticle: "D.Lgs. 81/2008 art. 41 c. 9",
      },
      {
        id: "mc-h07-2",
        label: "Tracciamento data notifica del giudizio e calcolo del termine perentorio di 30 giorni",
        normArticle: "D.Lgs. 81/2008 art. 41 c. 9",
      },
      {
        id: "mc-h07-3",
        label: "Fascicolo ricorsi attivi o archiviati con ricevuta PEC/protocollo ASL",
        normArticle: "D.Lgs. 81/2008 art. 41 c. 9",
      },
      {
        id: "mc-h07-4",
        label: "Acquisizione formale del provvedimento finale della Commissione Medica ASL",
        normArticle: "D.Lgs. 81/2008 art. 41 c. 9",
      },
    ],
  },
];

// ============================================================================
// 2. SEZIONI CONDIZIONALI: TUTELE SPECIALI MADRI & MINORI
// ============================================================================

export const SPECIAL_PROTECTIONS_CATALOG: SpecialProtectionRequirement[] = [
  {
    id: "spec-madri-01",
    group: "maternita_d_lgs_151_01",
    title: "Tutela Lavoratrici Madri & Puerpere (D.Lgs. 151/2001)",
    normReference: "D.Lgs. 151/2001 artt. 7, 11, 53 e D.Lgs. 81/2008 art. 28 c. 1-ter",
    description:
      "Obbligo di valutazione preventiva dei rischi specifici per la salute e sicurezza delle lavoratrici gestanti, puerpere o in periodo di allattamento fino a 7 mesi dopo il parto.",
    sanction: {
      liableSubject: "Datore di Lavoro",
      normArticle: "D.Lgs. 151/2001 art. 11 e D.Lgs. 81/2008 art. 55",
      sanctionType: "arresto_o_ammenda",
      minFineEuro: 1474.23,
      maxFineEuro: 5896.9,
      arrestMonths: "da 3 a 6 mesi",
      description: "Arresto da 3 a 6 mesi o ammenda per mancata valutazione dei rischi da maternità o mancato cambio di mansione.",
    },
    mandatoryMeasures: [
      "Valutazione del rischio per gestanti/allattamento inserita esplicitamente nel DVR aziendale",
      "Divieto assoluto di movimentazione manuale dei carichi e di lavori faticosi o pericolosi (All. A e B D.Lgs. 151/01)",
      "Divieto assoluto di adibizione al lavoro notturno (dalle 24:00 alle 06:00) dall'accertamento fino a 1 anno di età del bambino",
      "Procedura formale per modifica condizioni di lavoro, cambio temporaneo di mansione o richiesta di interdizione anticipata all'ITL",
    ],
  },
  {
    id: "spec-minori-01",
    group: "minori_l_977_67",
    title: "Tutela Lavoratori Minori e Apprendisti < 18 anni (Legge 977/1967)",
    normReference: "Legge 17/10/1967 n. 977, D.Lgs. 345/1999 e D.Lgs. 81/2008",
    description:
      "Tutele speciali inderogabili per i lavoratori adolescenti (tra 15 e 18 anni) e minori di età regolarmente ammessi al lavoro.",
    sanction: {
      liableSubject: "Datore di Lavoro",
      normArticle: "Legge 977/1967 art. 26",
      sanctionType: "arresto_o_ammenda",
      minFineEuro: 1032.91,
      maxFineEuro: 5164.57,
      arrestMonths: "fino a 6 mesi",
      description: "Arresto fino a 6 mesi per adibizione di minori a lavorazioni vietate o senza visita medica preventiva di idoneità.",
    },
    mandatoryMeasures: [
      "Visita medica preventiva di ammissibilità al lavoro eseguita prima dell'assunzione dal Medico Competente o ASL",
      "Visita medica periodica ad intervalli non superiori a un anno (12 mesi inderogabili)",
      "Divieto assoluto di adibizione alle lavorazioni pesanti, pericolose o insalubri elencate nell'Allegato I della L. 977/67",
      "Divieto generale di lavoro notturno tra le ore 22:00 e le 06:00 (o 23:00 e 07:00)",
      "Riposo settimanale di almeno due giorni consecutivi, possibilmente comprendenti la domenica",
    ],
  },
];

// ============================================================================
// 3. LIBRERIA PROTOCOLLI SANITARI SUGGERITI PER CODICE ATECO
// ============================================================================

export const PROTOCOLLI_SANITARI_ATECO: MedicalExamProtocolItem[] = [
  // Settore Ristorazione, Somministrazione, Bar, Alimentare (ATECO 56., 10.)
  {
    id: "proto-mmc-alimentare",
    name: "Sorveglianza MMC (Movimentazione Carichi, Fusti, Casse)",
    riskFactor: "Movimentazione Manuale Carichi (art. 168 D.Lgs. 81/08)",
    legalBasis: "D.Lgs. 81/2008 Titolo VI, Allegato XXXIII e Norme ISO 11228",
    sanctionReference: "D.Lgs. 81/08 art. 170 (Arresto 3-6 mesi o ammenda 1.474-5.896 €)",
    isMandatoryByLaw: true,
    recommendedFrequencyMonths: 12,
    typicalExams: ["Visita clinica mirata", "Valutazione rachide e articolazioni arti superiori"],
    applicableAtecoPrefixes: ["56.", "10."],
    typicalJobRoles: ["Cuoco", "Aiuto Cuoco", "Magazziniere", "Barista scarico fusti", "Lavapiatti"],
    notes: "Obbligatorio per personale che movimenta carichi superiori a 3 kg con frequenza o con indice NIOSH/MAPO > 0.85.",
  },
  {
    id: "proto-notturno-ristorazione",
    name: "Sorveglianza Lavoro Notturno (> 80 notti/anno)",
    riskFactor: "Lavoro Notturno continuativo ex D.Lgs. 66/2003",
    legalBasis: "D.Lgs. 66/2003 art. 15 e D.Lgs. 81/2008 art. 41",
    sanctionReference: "D.Lgs. 66/03 art. 18-bis (Arresto 3-6 mesi o ammenda)",
    isMandatoryByLaw: true,
    recommendedFrequencyMonths: 24,
    typicalExams: ["Visita clinica generale", "Controllo apparato digerente e cardiovascolare", "Screening ritmo sonno-veglia"],
    applicableAtecoPrefixes: ["56.", "93.29.10", "55."],
    typicalJobRoles: ["Personale serale/notturno", "Pizzaiolo serale", "Cameriere serale", "Barman discoteca"],
    notes: "Obbligatorio per tutti i lavoratori che prestano servizio almeno 3 ore nel periodo notturno (tra le 24:00 e le 05:00) per oltre 80 giorni l'anno.",
  },
  {
    id: "proto-cute-chimico-cucina",
    name: "Rischio Cutaneo e Chimico Detergenti Concentrati",
    riskFactor: "Agenti chimici irritanti (sgrassatori alcalini, disinfettanti)",
    legalBasis: "D.Lgs. 81/2008 art. 229",
    sanctionReference: "D.Lgs. 81/08 art. 262",
    isMandatoryByLaw: false,
    recommendedFrequencyMonths: 24,
    typicalExams: ["Visita dermatologica mirata", "Ispezione integrità cutanea mani e avambracci"],
    applicableAtecoPrefixes: ["56.", "10.", "81.21"],
    typicalJobRoles: ["Lavapiatti", "Addetto pulizie cucine", "Addetto sanificazione"],
    notes: "Consigliato da DVR se si utilizzano detergenti con frasi di rischio H314/H318/H317.",
  },

  // Settore Uffici, IT, Terziario, Studi Professionali (ATECO 62., 69., 70., 58., 63.)
  {
    id: "proto-vdt-ufficio",
    name: "Sorveglianza Videoterminalisti (> 20 ore settimanali)",
    riskFactor: "Attrezzature munite di videoterminali (art. 176)",
    legalBasis: "D.Lgs. 81/2008 Titolo VII, art. 176",
    sanctionReference: "D.Lgs. 81/08 art. 178 (Arresto 2-4 mesi o ammenda 921-4.422 €)",
    isMandatoryByLaw: true,
    recommendedFrequencyMonths: 24,
    typicalExams: ["Visita medica generale", "Esame della funzione visiva (ergovisio / screening ortottico)"],
    applicableAtecoPrefixes: ["62.", "69.", "70.", "58.", "63.", "85."],
    typicalJobRoles: ["Impiegato amministrativo", "Sviluppatore software", "Contabile", "Operatore call center"],
    notes: "Periodicità: quinquennale per lavoratori di età inferiore a 50 anni; biennale per idonei con prescrizione lenti e over 50.",
  },

  // Logistica, Magazzini, Trasporto Merci (ATECO 52., 49.4, 53.)
  {
    id: "proto-mulettisti-alcol-droga",
    name: "Conduzione Carrelli Elevatori & Test Tossicologici",
    riskFactor: "Mansioni con rischio incolumità a terzi (Carrelli elevatori semoventi)",
    legalBasis: "Intesa Stato-Regioni 30/10/2007 e Accordo 16/03/2006",
    sanctionReference: "D.Lgs. 81/08 art. 41 c. 4 (Ammenda fino a 5.528 € al Datore di Lavoro)",
    isMandatoryByLaw: true,
    recommendedFrequencyMonths: 12,
    typicalExams: ["Drug test urinario 1° livello", "Etilometria", "Controllo visivo e dei riflessi", "Visita clinica generale"],
    applicableAtecoPrefixes: ["52.", "49.4", "47.11"],
    typicalJobRoles: ["Carrellista", "Mulettista", "Magazziniere preparatore", "Movimentatore merci"],
    notes: "Obbligatorio per legge: accertamento preventivo e periodico con cadenza annuale.",
  },
  {
    id: "proto-mmc-logistica",
    name: "Sorveglianza MMC Logistica & Movimentazione Pacchi",
    riskFactor: "Sollevamento e trasporto ripetitivo carichi pesanti",
    legalBasis: "D.Lgs. 81/2008 Titolo VI, art. 168",
    sanctionReference: "D.Lgs. 81/08 art. 170",
    isMandatoryByLaw: true,
    recommendedFrequencyMonths: 12,
    typicalExams: ["Visita medica con esame colonna vertebrale", "Valutazione articolazioni"],
    applicableAtecoPrefixes: ["52.", "49.4"],
    typicalJobRoles: ["Facchino", "Magazziniere", "Scaricatore"],
    notes: "Indice di esposizione sollevamento frequente.",
  },

  // Sanità, RSA, Studi Medici, Odontoiatrici, Laboratori (ATECO 86., 87., 88.)
  {
    id: "proto-biologico-sanita",
    name: "Sorveglianza Agenti Biologici e Titolazione Anticorpale",
    riskFactor: "Agenti Biologici potenzialmente patogeni (HBV, HCV, HIV, TBC)",
    legalBasis: "D.Lgs. 81/2008 Titolo X, art. 279 e Allegato XLVI",
    sanctionReference: "D.Lgs. 81/08 art. 282 (Arresto da 3 a 6 mesi)",
    isMandatoryByLaw: true,
    recommendedFrequencyMonths: 12,
    typicalExams: ["Titolazione anticorpi anti-HBs (Epatite B)", "Screening TBC (Quantiferon o Mantoux)", "Antitetanica", "Visita medica completa"],
    applicableAtecoPrefixes: ["86.", "87."],
    typicalJobRoles: ["Infermiera", "OSS", "Medico", "Fisioterapista", "Assistente studio odontoiatrico"],
    notes: "Obbligo di verifica stato immunitario e offerta vaccinale attiva.",
  },
  {
    id: "proto-mmc-pazienti",
    name: "Movimentazione Manuale Pazienti / Persone non autosufficienti",
    riskFactor: "Movimentazione carichi viventi (metodo MAPO)",
    legalBasis: "D.Lgs. 81/2008 art. 168 e Linee Guida MAPO",
    sanctionReference: "D.Lgs. 81/08 art. 170",
    isMandatoryByLaw: true,
    recommendedFrequencyMonths: 12,
    typicalExams: ["Visita rachide lombare", "Valutazione osteo-articolare"],
    applicableAtecoPrefixes: ["86.", "87.", "88."],
    typicalJobRoles: ["OSS", "Infermiera", "Fisioterapista"],
    notes: "Per RSA e cliniche con ricoveri a degenza.",
  },

  // Edilizia, Cantieri, Movimento Terra (ATECO 41., 42., 43.)
  {
    id: "proto-quota-edilizia",
    name: "Accertamento Idoneità Lavori in Quota e Caduta dall'Alto",
    riskFactor: "Lavori su ponteggi, scale e tetti (> 2 metri)",
    legalBasis: "D.Lgs. 81/2008 Titolo IV e Allegato IV",
    sanctionReference: "D.Lgs. 81/08 art. 159 (Arresto fino a 6 mesi)",
    isMandatoryByLaw: true,
    recommendedFrequencyMonths: 12,
    typicalExams: ["ECG a riposo", "Screening vertigini/equilibrio", "Acuità visiva e uditiva", "Visita clinica mirata"],
    applicableAtecoPrefixes: ["41.", "42.", "43."],
    typicalJobRoles: ["Muratore", "Ponteggiatore", "Carpentiere", "Gruista edile"],
    notes: "Indispensabile per verificare assenza di patologie che provocano improvvisa perdita di coscienza o equilibrio.",
  },
  {
    id: "proto-rumore-edilizia",
    name: "Sorveglianza Rischio Rumore Cantieri (> 85 dBA)",
    riskFactor: "Rumore impulsivo e continuo da macchinari edili",
    legalBasis: "D.Lgs. 81/2008 Titolo VIII Capo II, art. 189",
    sanctionReference: "D.Lgs. 81/08 art. 219 (Arresto 3-6 mesi)",
    isMandatoryByLaw: true,
    recommendedFrequencyMonths: 12,
    typicalExams: ["Esame audiometrico tonale liminare", "Otoscopia"],
    applicableAtecoPrefixes: ["41.", "42.", "43.", "25."],
    typicalJobRoles: ["Operaio edile", "Demolitore", "Operatore martello pneumatico"],
    notes: "Annuale per Lex > 85 dBA, biennale per Lex tra 80 e 85 dBA.",
  },

  // Metalmeccanica, Officine Meccaniche, Saldatura (ATECO 25., 28., 45.20)
  {
    id: "proto-fumi-saldatura",
    name: "Sorveglianza Chimica Fumi di Saldatura e Polveri Metalliche",
    riskFactor: "Fumi di saldatura contenenti metalli pesanti (Cromo VI, Nichel, Manganese)",
    legalBasis: "D.Lgs. 81/2008 Titolo IX Capo I, art. 229",
    sanctionReference: "D.Lgs. 81/08 art. 262",
    isMandatoryByLaw: true,
    recommendedFrequencyMonths: 12,
    typicalExams: ["Spirometria semplice", "Visita pneumologica / toracica", "Monitoraggio biologico urinario metalli (se indicato da DVR)"],
    applicableAtecoPrefixes: ["25.", "28.", "45.20"],
    typicalJobRoles: ["Saldatore", "Carpentiere metallico", "Meccanico d'officina"],
    notes: "Obbligatorio per saldatura ad arco, MIG/MAG, TIG.",
  },
  {
    id: "proto-roa-saldatura",
    name: "Radiazioni Ottiche Artificiali (ROA) da Arco Elettrico",
    riskFactor: "Radiazioni UV e visibili emesse durante la saldatura (art. 216)",
    legalBasis: "D.Lgs. 81/2008 Titolo VIII Capo V, art. 218",
    sanctionReference: "D.Lgs. 81/08 art. 219",
    isMandatoryByLaw: true,
    recommendedFrequencyMonths: 24,
    typicalExams: ["Visita oculistica con fondo oculare", "Valutazione cristallino (screening cataratta precoce)"],
    applicableAtecoPrefixes: ["25.", "28."],
    typicalJobRoles: ["Saldatore"],
    notes: "Specifico per prevenzione fotocheratiti e lesioni retiniche.",
  },

  // Pulizie, Sanificazione e Disinfestazione (ATECO 81.21, 81.22, 81.29)
  {
    id: "proto-chimico-pulizie",
    name: "Sorveglianza Agenti Chimici Sanificazione & Cute",
    riskFactor: "Uso quotidiano detergenti disinfettanti e composti clorati",
    legalBasis: "D.Lgs. 81/2008 Titolo IX art. 229",
    sanctionReference: "D.Lgs. 81/08 art. 262",
    isMandatoryByLaw: true,
    recommendedFrequencyMonths: 24,
    typicalExams: ["Visita medica generale", "Spirometria per asma professionale", "Controllo dermatologico"],
    applicableAtecoPrefixes: ["81.2"],
    typicalJobRoles: ["Addetta alle pulizie", "Sanificatore industriale"],
    notes: "In presenza di prodotti caustici o nebulizzati.",
  },
];

// ============================================================================
// 4. FUNZIONI DI SUPPORTO & RILEVAMENTO AUTOMATICO
// ============================================================================

export interface ProtectedCategoriesDetectionResult {
  hasFemaleWorkers: boolean;
  hasMinorWorkers: boolean;
  femaleWorkerNames: string[];
  minorWorkerNames: string[];
  totalWorkersAnalyzed: number;
}

/**
 * Analizza i codici fiscali e le date di nascita dei lavoratori per rilevare
 * la presenza di lavoratrici donne (D.Lgs. 151/01) e minori di 18 anni (L. 977/67).
 */
export function detectProtectedCategories(
  employees: Array<{
    firstName?: string;
    lastName?: string;
    fiscalCode?: string | null;
  }>,
  referenceDate: string = new Date().toISOString().split("T")[0],
): ProtectedCategoriesDetectionResult {
  const result: ProtectedCategoriesDetectionResult = {
    hasFemaleWorkers: false,
    hasMinorWorkers: false,
    femaleWorkerNames: [],
    minorWorkerNames: [],
    totalWorkersAnalyzed: employees.length,
  };

  const refYear = parseInt(referenceDate.substring(0, 4), 10);
  const refMonth = parseInt(referenceDate.substring(5, 7), 10);
  const refDay = parseInt(referenceDate.substring(8, 10), 10);

  for (const emp of employees) {
    const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Lavoratore";
    const cf = (emp.fiscalCode || "").trim().toUpperCase();

    if (cf.length === 16) {
      // Caratteri 9 e 10 (0-based: pos 9 e 10) rappresentano il giorno di nascita
      // Per le donne viene aggiunto 40 (41..71)
      const dayDigits = parseInt(cf.substring(9, 11), 10);
      if (!isNaN(dayDigits) && dayDigits >= 41 && dayDigits <= 71) {
        result.hasFemaleWorkers = true;
        result.femaleWorkerNames.push(fullName);
      }

      // Caratteri 6 e 7 rappresentano l'anno di nascita
      const yearDigits = parseInt(cf.substring(6, 8), 10);
      if (!isNaN(yearDigits)) {
        // Se l'anno è <= anno attuale in 2 cifre (es. 26 per 2026), si assume 2000+, altrimenti 1900+
        const currentYear2Digits = refYear % 100;
        const birthYear = yearDigits <= currentYear2Digits ? 2000 + yearDigits : 1900 + yearDigits;

        // Mese da codice fiscale: A=1, B=2, C=3, D=4, E=5, H=6, L=7, M=8, P=9, R=10, S=11, T=12
        const monthChar = cf.charAt(8);
        const monthMap: Record<string, number> = {
          A: 1, B: 2, C: 3, D: 4, E: 5, H: 6,
          L: 7, M: 8, P: 9, R: 10, S: 11, T: 12,
        };
        const birthMonth = monthMap[monthChar] || 1;
        const actualBirthDay = dayDigits > 40 ? dayDigits - 40 : dayDigits;

        // Calcolo età esatta
        let age = refYear - birthYear;
        if (refMonth < birthMonth || (refMonth === birthMonth && refDay < actualBirthDay)) {
          age--;
        }

        if (age < 18 && age >= 14) {
          result.hasMinorWorkers = true;
          result.minorWorkerNames.push(`${fullName} (${age} anni)`);
        }
      }
    }
  }

  return result;
}

/**
 * Restituisce i protocolli sanitari raccomandati e obbligatori per un codice ATECO.
 */
export function getSuggestedProtocolsForAteco(atecoCode?: string | null): MedicalExamProtocolItem[] {
  if (!atecoCode) {
    return PROTOCOLLI_SANITARI_ATECO;
  }
  const normalized = atecoCode.trim();

  return PROTOCOLLI_SANITARI_ATECO.filter((item) => {
    return item.applicableAtecoPrefixes.some((prefix) => normalized.startsWith(prefix));
  });
}

/**
 * Cerca un requisito sanitario nel catalogo base per ID o nome.
 */
export function findHealthCatalogDefinition(identifier: string): HealthDocumentDefinition | undefined {
  const lower = identifier.toLowerCase().trim();
  return HEALTH_DOCUMENTS_CATALOG.find(
    (item) => item.id.toLowerCase() === lower || item.name.toLowerCase() === lower,
  );
}
