/**
 * individualTrainingPlan.ts
 *
 * Motore normativo di calcolo e Progettazione Formativa Individuale (PFI) per FedShield.
 * Conforme alle normative italiane vigenti in materia di salute e sicurezza sul lavoro (HSE)
 * e igiene alimentare (HACCP):
 *
 * 1. Accordo Stato-Regioni 21/12/2011 (Formazione Generale 4h e Specifica 4/8/12h ex D.Lgs. 81/08 art. 37):
 *    - Rischio Basso: Generale 4h + Specifica 4h = 8h (Aggiornamento quinquennale 6h)
 *    - Rischio Medio: Generale 4h + Specifica 8h = 12h (Aggiornamento quinquennale 6h)
 *    - Rischio Alto:  Generale 4h + Specifica 12h = 16h (Aggiornamento quinquennale 6h)
 *    - Formazione Generale: credito formativo permanente a vita (frequenza 0, non scade mai).
 *
 * 2. Figure della Prevenzione:
 *    - Preposto: D.Lgs. 81/2008 art. 37 c. 7 e L. 215/2021 (8h aggiuntive, aggiornamento BIENNALE 6h in presenza).
 *    - Dirigente: D.Lgs. 81/2008 art. 37 c. 7 e Accordo SR 21/12/2011 (16h, aggiornamento quinquennale 6h).
 *    - RLS (Rappresentante Lavoratori Sicurezza): D.Lgs. 81/2008 art. 37 c. 10-11 (32h base, aggiornamento ANNUALE 4h o 8h).
 *    - Addetto Antincendio: D.M. 02/09/2021 (Livello 1: 4h/agg. 2h/3anni; Livello 2: 8h/agg. 5h/3anni; Livello 3: 16h/agg. 8h/3anni).
 *    - Addetto Primo Soccorso: D.M. 388/2003 (Gruppo A: 16h/agg. 6h/3anni; Gruppo B/C: 12h/agg. 4h/3anni).
 *
 * 3. Abilitazione Attrezzature di Lavoro:
 *    - Accordo Stato-Regioni 22/02/2012 e D.Lgs. 81/2008 art. 73 c. 5:
 *      * Carrelli elevatori semoventi (muletti): 12h, aggiornamento quinquennale 4h.
 *      * Piattaforme di lavoro elevabili (PLE): 10h, aggiornamento quinquennale 4h.
 *      * Gru su autocarro: 12h, aggiornamento quinquennale 4h.
 *      * Trattori agricoli o forestali: 8h, aggiornamento quinquennale 4h.
 *    - D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4 (Addestramento specifico qualificato):
 *      * Macchine alimentari (affettatrici, impastatrici, forni): 4h, aggiornamento 5 anni.
 *      * Macchine utensili metallo (torni, frese, presse): 8h, aggiornamento 5 anni.
 *      * Saldatura ad arco / filo / gas: 6h, aggiornamento 5 anni.
 *      * Ponti sollevatori veicoli: 4h, aggiornamento 5 anni.
 *
 * 4. Settore Alimentare & HACCP (Reg. CE 852/2004 All. II Cap. XII):
 *    - Alimentaristi Manipolatori (cuochi, pizzaioli, baristi, pasticceri): 8h, aggiornamento periodico (3 anni).
 *    - Alimentaristi Non Manipolatori (camerieri bevande sigillate, magazzinieri confezionati): 4h, aggiornamento periodico (3 anni).
 *
 * 5. Mansioni con Rischi Particolari:
 *    - Videoterminalisti (>20h settimanali sistematiche ex art. 173 D.Lgs. 81/08): 4h postura ed ergonomia.
 *    - Movimentazione Manuale Carichi (MMC, D.Lgs. 81/08 Titolo VI): 4h ergonomia sollevamento.
 *    - Lavori in quota e uso DPI di III Categoria (D.Lgs. 81/08 art. 77 c. 5): 8h addestramento pratico salvavita.
 */

import { Employee, Machine, TrainingRecord } from "../../api";
import { parseMachineMetadata } from "../checklist/normativeMachineCatalog";

// ============================================================================
// 1. TIPI E COSTANTI: CONTRATTI DI LAVORO
// ============================================================================

export type ContractTypeCode =
  | "full_time"
  | "part_time"
  | "apprendistato"
  | "determinato"
  | "indeterminato"
  | "somministrazione"
  | "stage_tirocinio"
  | "intermittente";

export interface ContractTypeDefinition {
  code: ContractTypeCode;
  label: string;
  shortLabel: string;
  defaultWeeklyHours: number;
  normativeDescription: string;
}

export const CONTRACT_TYPES: Record<ContractTypeCode, ContractTypeDefinition> = {
  full_time: {
    code: "full_time",
    label: "Tempo Pieno (Full-Time, 40h/sett)",
    shortLabel: "Full-Time (40h)",
    defaultWeeklyHours: 40,
    normativeDescription:
      "Contratto standard a orario pieno. Formazione generale e specifica obbligatoria integrale ex D.Lgs. 81/08 art. 37.",
  },
  part_time: {
    code: "part_time",
    label: "Tempo Parziale (Part-Time)",
    shortLabel: "Part-Time",
    defaultWeeklyHours: 20,
    normativeDescription:
      "Contratto a orario ridotto. La formazione sicurezza è un obbligo inderogabile e integrale: nessuna riduzione di ore rispetto al full-time (art. 37 D.Lgs. 81/08). L'orario settimanale incide sul superamento della soglia di 20h per i videoterminalisti (art. 173).",
  },
  apprendistato: {
    code: "apprendistato",
    label: "Apprendistato Professionalizzante (PFI obbligatorio)",
    shortLabel: "Apprendistato",
    defaultWeeklyHours: 40,
    normativeDescription:
      "Lavoratore equiparato a tempo pieno ex art. 2 c. 1 lett. a) D.Lgs. 81/08. La formazione sicurezza deve essere completata inderogabilmente entro 60 giorni dall'assunzione e registrata nel Piano Formativo Individuale (PFI) contrattuale.",
  },
  determinato: {
    code: "determinato",
    label: "Tempo Determinato",
    shortLabel: "Tempo Determinato",
    defaultWeeklyHours: 40,
    normativeDescription:
      "Lavoratore a termine. Ha diritto alla medesima formazione dei lavoratori a tempo indeterminato prima o contestualmente all'adibizione alla mansione (art. 37 c. 4).",
  },
  indeterminato: {
    code: "indeterminato",
    label: "Tempo Indeterminato",
    shortLabel: "Tempo Indeterminato",
    defaultWeeklyHours: 40,
    normativeDescription: "Rapporto di lavoro subordinato ordinario.",
  },
  somministrazione: {
    code: "somministrazione",
    label: "Lavoro in Somministrazione (Interinale)",
    shortLabel: "Somministrazione",
    defaultWeeklyHours: 40,
    normativeDescription:
      "Ex art. 35 D.Lgs. 81/2015 l'utilizzatore osserva nei confronti dei lavoratori somministrati tutti gli obblighi di protezione e formazione specifica legata ai rischi dell'ambiente di lavoro.",
  },
  stage_tirocinio: {
    code: "stage_tirocinio",
    label: "Stage Curriculare / Tirocinio Extracurriculare",
    shortLabel: "Stage/Tirocinio",
    defaultWeeklyHours: 35,
    normativeDescription:
      "Il tirocinante è equiparato a lavoratore ai sensi dell'art. 2 c. 1 lett. a) del D.Lgs. 81/08 ed è soggetto all'obbligo integrale di formazione generale e specifica prima dell'inizio delle attività.",
  },
  intermittente: {
    code: "intermittente",
    label: "Lavoro Intermittente / A Chiamata",
    shortLabel: "A Chiamata",
    defaultWeeklyHours: 15,
    normativeDescription:
      "Formazione obbligatoria prima dell'effettivo impiego nelle mansioni aziendali.",
  },
};

export const CONTRACT_TYPE_OPTIONS: Array<{ value: ContractTypeCode; label: string }> =
  Object.values(CONTRACT_TYPES).map((c) => ({
    value: c.code,
    label: c.label,
  }));

// ============================================================================
// 2. TIPI E COSTANTI: RUOLI DI SICUREZZA SELEZIONABILI
// ============================================================================

export type SafetyRoleCode =
  | "lavoratore"
  | "preposto"
  | "dirigente"
  | "rls"
  | "antincendio_l1"
  | "antincendio_l2"
  | "antincendio_l3"
  | "primo_soccorso_a"
  | "primo_soccorso_bc";

export interface SafetyRoleDefinition {
  code: SafetyRoleCode;
  label: string;
  courseTitle: string;
  minHours: number;
  frequencyYears: number;
  refresherHours: number;
  normReference: string;
  description: string;
}

export const SAFETY_ROLES: Record<SafetyRoleCode, SafetyRoleDefinition> = {
  lavoratore: {
    code: "lavoratore",
    label: "Lavoratore (Dipendente base)",
    courseTitle: "Formazione Lavoratori (Generale + Specifica)",
    minHours: 8,
    frequencyYears: 5,
    refresherHours: 6,
    normReference: "D.Lgs. 81/2008, art. 37; Accordo Stato-Regioni 21/12/2011",
    description: "Formazione base per tutti i lavoratori dipendenti o equiparati.",
  },
  preposto: {
    code: "preposto",
    label: "Preposto alla Sicurezza (ex L. 215/2021)",
    courseTitle: "Formazione Particolare Aggiuntiva per Preposti",
    minHours: 8,
    frequencyYears: 2,
    refresherHours: 6,
    normReference: "D.Lgs. 81/2008, art. 37 c. 7 e 7-ter mod. L. 215/2021; Accordo SR 21/12/2011 p. 5",
    description:
      "Corso aggiuntivo obbligatorio di 8 ore per i preposti. Aggiornamento con frequenza BIENNALE di almeno 6 ore (in precedenza quinquennale).",
  },
  dirigente: {
    code: "dirigente",
    label: "Dirigente per la Sicurezza",
    courseTitle: "Formazione per Dirigenti con Delega di Sicurezza",
    minHours: 16,
    frequencyYears: 5,
    refresherHours: 6,
    normReference: "D.Lgs. 81/2008, art. 37 c. 7; Accordo Stato-Regioni 21/12/2011 p. 6",
    description:
      "Corso di 16 ore che sostituisce integralmente la formazione per lavoratori. Aggiornamento quinquennale di 6 ore.",
  },
  rls: {
    code: "rls",
    label: "RLS (Rappresentante dei Lavoratori per la Sicurezza)",
    courseTitle: "Formazione Iniziale RLS",
    minHours: 32,
    frequencyYears: 1,
    refresherHours: 4, // 4h fino a 50 dip, 8h oltre 50 dip
    normReference: "D.Lgs. 81/2008, art. 37 commi 10 e 11",
    description:
      "Corso base iniziale di 32 ore (di cui 12 sui rischi specifici). Aggiornamento obbligatorio ANNUALE di 4 ore (<=50 lavoratori) o 8 ore (>50 lavoratori).",
  },
  antincendio_l1: {
    code: "antincendio_l1",
    label: "Addetto Antincendio Livello 1 (Rischio Basso - 4h)",
    courseTitle: "Addetto Antincendio in Attività di Livello 1 (ex Rischio Basso)",
    minHours: 4,
    frequencyYears: 3,
    refresherHours: 2,
    normReference: "D.M. 02/09/2021, All. III; D.Lgs. 81/2008 art. 37 c. 9 e art. 43",
    description: "Attività a basso rischio di incendio. Corso base 4h; aggiornamento triennale di 2h.",
  },
  antincendio_l2: {
    code: "antincendio_l2",
    label: "Addetto Antincendio Livello 2 (Rischio Medio - 8h)",
    courseTitle: "Addetto Antincendio in Attività di Livello 2 (ex Rischio Medio)",
    minHours: 8,
    frequencyYears: 3,
    refresherHours: 5,
    normReference: "D.M. 02/09/2021, All. III; D.Lgs. 81/2008 art. 37 c. 9 e art. 43",
    description: "Attività a medio rischio di incendio. Corso base 8h; aggiornamento triennale di 5h.",
  },
  antincendio_l3: {
    code: "antincendio_l3",
    label: "Addetto Antincendio Livello 3 (Rischio Alto - 16h)",
    courseTitle: "Addetto Antincendio in Attività di Livello 3 (ex Rischio Elevato)",
    minHours: 16,
    frequencyYears: 3,
    refresherHours: 8,
    normReference: "D.M. 02/09/2021, All. III; D.Lgs. 81/2008 art. 37 c. 9 e art. 43; L. 609/1996 art. 6",
    description:
      "Attività a rischio elevato con obbligo di attestato di idoneità tecnica VV.F. Corso base 16h; aggiornamento triennale di 8h.",
  },
  primo_soccorso_a: {
    code: "primo_soccorso_a",
    label: "Addetto Primo Soccorso Gruppo A (Aziende ad alto rischio - 16h)",
    courseTitle: "Addetto Primo Soccorso Aziendale - Aziende Gruppo A",
    minHours: 16,
    frequencyYears: 3,
    refresherHours: 6,
    normReference: "D.M. 388/2003, art. 3; D.Lgs. 81/2008 art. 37 c. 9 e art. 45",
    description:
      "Aziende rientranti nel Gruppo A (attività a rischio rilevante, oltre 5 lavoratori con indice infortunistico INAIL > 4). Corso 16h; aggiornamento triennale 6h.",
  },
  primo_soccorso_bc: {
    code: "primo_soccorso_bc",
    label: "Addetto Primo Soccorso Gruppo B/C (Standard - 12h)",
    courseTitle: "Addetto Primo Soccorso Aziendale - Aziende Gruppi B e C",
    minHours: 12,
    frequencyYears: 3,
    refresherHours: 4,
    normReference: "D.M. 388/2003, art. 3; D.Lgs. 81/2008 art. 37 c. 9 e art. 45",
    description:
      "Aziende ordinarie Gruppi B e C. Corso base 12h; aggiornamento pratico triennale di 4h.",
  },
};

export const SAFETY_ROLE_OPTIONS: Array<{ value: SafetyRoleCode; label: string }> =
  Object.values(SAFETY_ROLES).map((r) => ({
    value: r.code,
    label: r.label,
  }));

// ============================================================================
// 3. TIPI E COSTANTI: RISCHI PARTICOLARI E MANSIONI SPECIFICHE
// ============================================================================

export type SpecificRiskCode =
  | "videoterminali_20h"
  | "movimentazione_manuale_carichi"
  | "dpi_terza_categoria"
  | "haccp_manipolatore"
  | "haccp_non_manipolatore"
  | "lavori_in_quota"
  | "rischio_chimico"
  | "rumore_vibrazioni";

export interface SpecificRiskDefinition {
  code: SpecificRiskCode;
  label: string;
  courseTitle: string;
  minHours: number;
  frequencyYears: number;
  refresherHours: number;
  normReference: string;
  description: string;
}

export const SPECIFIC_RISKS: Record<SpecificRiskCode, SpecificRiskDefinition> = {
  videoterminali_20h: {
    code: "videoterminali_20h",
    label: "Videoterminalista (>20 ore settimanali)",
    courseTitle: "Formazione Ergonomia e Postura per Lavoratori Videoterminalisti",
    minHours: 4,
    frequencyYears: 5,
    refresherHours: 2,
    normReference: "D.Lgs. 81/2008, Titolo VII, artt. 173-177 e Allegato XXXIV",
    description:
      "Lavoratore che utilizza un'attrezzatura munita di videoterminale in modo sistematico o abituale per almeno venti ore settimanali. Obbligo di informazione e formazione su ergonomia, salute degli occhi e postura.",
  },
  movimentazione_manuale_carichi: {
    code: "movimentazione_manuale_carichi",
    label: "Movimentazione Manuale Carichi (MMC / Traino / Spinta)",
    courseTitle: "Formazione e Addestramento Movimentazione Manuale dei Carichi",
    minHours: 4,
    frequencyYears: 5,
    refresherHours: 2,
    normReference: "D.Lgs. 81/2008, Titolo VI, artt. 167-170 e Allegato XXXIII; Norme ISO 11228",
    description:
      "Attività che comportano rischi di lesioni dorso-lombari. Obbligo di formazione sulle tecniche corrette di sollevamento e uso degli ausili.",
  },
  dpi_terza_categoria: {
    code: "dpi_terza_categoria",
    label: "Uso DPI di III Categoria (Anticaduta / Salvavita / Vie Respiratorie)",
    courseTitle: "Formazione e Addestramento Pratico all'Uso di DPI di III Categoria",
    minHours: 8,
    frequencyYears: 5,
    refresherHours: 4,
    normReference: "D.Lgs. 81/2008, art. 77 commi 4 e 5",
    description:
      "Per i dispositivi di protezione individuale di terza categoria (salvavita e anticaduta) è prescritto per legge l'ADDESTRAMENTO pratico obbligatorio oltre alla formazione teorica.",
  },
  haccp_manipolatore: {
    code: "haccp_manipolatore",
    label: "Personale Alimentarista Manipolatore Alimenti",
    courseTitle: "Formazione Igiene Alimentare e HACCP per Personale Alimentarista Manipolatore",
    minHours: 8,
    frequencyYears: 3,
    refresherHours: 4,
    normReference: "Reg. CE 852/2004, All. II, Cap. XII; Linee guida e regolamenti regionali HACCP",
    description:
      "Cuochi, pizzaioli, baristi, camerieri addetti al porzionamento, pasticceri, gastronomi e banchisti. Formazione obbligatoria sui principi di corretta prassi igienica (GHP) e autocontrollo.",
  },
  haccp_non_manipolatore: {
    code: "haccp_non_manipolatore",
    label: "Personale Alimentarista Non Manipolatore",
    courseTitle: "Formazione Igiene Alimentare e HACCP per Personale Non Manipolatore",
    minHours: 4,
    frequencyYears: 3,
    refresherHours: 2,
    normReference: "Reg. CE 852/2004, All. II, Cap. XII; Regolamenti regionali HACCP",
    description:
      "Personale che non tocca alimenti sfusi (camerieri bevande confezionate, magazzinieri merci imballate, lavapiatti con lavastoviglie a ciclo chiuso).",
  },
  lavori_in_quota: {
    code: "lavori_in_quota",
    label: "Lavori in Quota (> 2 metri)",
    courseTitle: "Formazione e Addestramento Lavori in Quota e Sistemi Anticaduta",
    minHours: 8,
    frequencyYears: 5,
    refresherHours: 4,
    normReference: "D.Lgs. 81/2008, Titolo IV, Capo II, artt. 107 e 115",
    description:
      "Attività lavorative svolte ad altezza superiore a 2 metri rispetto a un piano stabile.",
  },
  rischio_chimico: {
    code: "rischio_chimico",
    label: "Esposizione ad Agenti Chimici Pericolosi",
    courseTitle: "Formazione Rischi da Agenti Chimici ed Esposizione Professionale",
    minHours: 4,
    frequencyYears: 5,
    refresherHours: 2,
    normReference: "D.Lgs. 81/2008, Titolo IX, Capo I, artt. 223 e 227",
    description:
      "Uso professionale di detergenti sgrassanti caustici, solventi, acidi o reagenti chimici con schede SDS.",
  },
  rumore_vibrazioni: {
    code: "rumore_vibrazioni",
    label: "Esposizione a Rumore e Vibrazioni Meccaniche",
    courseTitle: "Formazione Rischi Rumore e Vibrazioni (Agenti Fisici)",
    minHours: 4,
    frequencyYears: 5,
    refresherHours: 2,
    normReference: "D.Lgs. 81/2008, Titolo VIII, Capi II e III, artt. 195 e 203",
    description:
      "Lavoratori esposti a livelli sonori Lex > 80 dB(A) o ad apparecchiature vibranti (motoseghe, martelli demolitori).",
  },
};

export const SPECIFIC_RISK_OPTIONS: Array<{ value: SpecificRiskCode; label: string }> =
  Object.values(SPECIFIC_RISKS).map((r) => ({
    value: r.code,
    label: r.label,
  }));

// ============================================================================
// 4. TIPI E COSTANTI: ABILITAZIONE ATTREZZATURE (Accordo SR 22/02/2012 & Art. 73)
// ============================================================================

export interface MachineTrainingRequirementConfig {
  code: string;
  title: string;
  minHours: number;
  frequencyYears: number;
  refresherHours: number;
  normReference: string;
  description: string;
  requiresPatentinoAccordoSR: boolean;
}

export const EQUIPMENT_TRAINING_CONFIGS: Record<string, MachineTrainingRequirementConfig> = {
  FORMAZ_CARRELLI: {
    code: "FORMAZ_CARRELLI",
    title: "Abilitazione Conduzione Carrelli Elevatori Semoventi (Patentino Muletto)",
    minHours: 12,
    frequencyYears: 5,
    refresherHours: 4,
    normReference: "Accordo Stato-Regioni 22/02/2012, All. VI; D.Lgs. 81/2008 art. 73 c. 5",
    description:
      "Abilitazione teorico-pratica per la conduzione in sicurezza di carrelli industriali semoventi. Aggiornamento quinquennale di 4 ore.",
    requiresPatentinoAccordoSR: true,
  },
  FORMAZ_PLE: {
    code: "FORMAZ_PLE",
    title: "Abilitazione Conduzione Piattaforme di Lavoro Elevabili (PLE)",
    minHours: 10,
    frequencyYears: 5,
    refresherHours: 4,
    normReference: "Accordo Stato-Regioni 22/02/2012, All. III; D.Lgs. 81/2008 art. 73 c. 5",
    description:
      "Abilitazione per l'uso di PLE con e senza stabilizzatori. Aggiornamento quinquennale di 4 ore.",
    requiresPatentinoAccordoSR: true,
  },
  FORMAZ_GRU_AUTOCARRO: {
    code: "FORMAZ_GRU_AUTOCARRO",
    title: "Abilitazione Conduzione Gru per Autocarro",
    minHours: 12,
    frequencyYears: 5,
    refresherHours: 4,
    normReference: "Accordo Stato-Regioni 22/02/2012, All. IV; D.Lgs. 81/2008 art. 73 c. 5",
    description:
      "Abilitazione per operatori di gru idrauliche montate su veicolo da carico. Aggiornamento quinquennale di 4 ore.",
    requiresPatentinoAccordoSR: true,
  },
  FORMAZ_TRATTORI: {
    code: "FORMAZ_TRATTORI",
    title: "Abilitazione Conduzione Trattori Agricoli o Forestali",
    minHours: 8,
    frequencyYears: 5,
    refresherHours: 4,
    normReference: "Accordo Stato-Regioni 22/02/2012, All. VIII; D.Lgs. 81/2008 art. 73 c. 5",
    description:
      "Abilitazione per trattrici agricole o forestali gommate o cingolate. Aggiornamento quinquennale di 4 ore.",
    requiresPatentinoAccordoSR: true,
  },
  FORMAZ_MACCHINE_ALIMENTARI: {
    code: "FORMAZ_MACCHINE_ALIMENTARI",
    title: "Addestramento all'Uso Sicuro di Macchine Alimentari (Affettatrici, Impastatrici, Forni)",
    minHours: 4,
    frequencyYears: 5,
    refresherHours: 2,
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4",
    description:
      "Addestramento pratico mirato all'uso in sicurezza di attrezzature con rischio di taglio, trascinamento o ustione nei laboratori alimentari.",
    requiresPatentinoAccordoSR: false,
  },
  FORMAZ_MACCHINE_METALLO: {
    code: "FORMAZ_MACCHINE_METALLO",
    title: "Addestramento all'Uso Sicuro di Macchine Utensili (Torni, Frese, Presse, Mole)",
    minHours: 8,
    frequencyYears: 5,
    refresherHours: 4,
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4",
    description:
      "Addestramento per lavorazione dei metalli e organi in rotazione meccanica con rischio proiezioni e intrappolamento.",
    requiresPatentinoAccordoSR: false,
  },
  FORMAZ_SALDATURA: {
    code: "FORMAZ_SALDATURA",
    title: "Formazione e Addestramento Operatori di Saldatura (Fumi, ROA e DPI III Cat.)",
    minHours: 6,
    frequencyYears: 5,
    refresherHours: 3,
    normReference: "D.Lgs. 81/2008 art. 37, 73 e 77",
    description:
      "Formazione specifica sui rischi di inalazione fumi, radiazioni ottiche artificiali e uso schermature/DPI specifici.",
    requiresPatentinoAccordoSR: false,
  },
  FORMAZ_PONTI_SOLLEVATORI: {
    code: "FORMAZ_PONTI_SOLLEVATORI",
    title: "Addestramento all'Uso in Sicurezza di Ponti Sollevatori per Autoveicoli",
    minHours: 4,
    frequencyYears: 5,
    refresherHours: 2,
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4",
    description:
      "Addestramento sul posizionamento sicuro veicoli su ponte sollevatore, controllo bracci e dispositivi di arresto anticaduta.",
    requiresPatentinoAccordoSR: false,
  },
  FORMAZ_ATTREZZATURE_BASE: {
    code: "FORMAZ_ATTREZZATURE_BASE",
    title: "Addestramento Specifico sull'Attrezzatura di Lavoro",
    minHours: 4,
    frequencyYears: 5,
    refresherHours: 2,
    normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4",
    description: "Addestramento all'uso in sicurezza ai sensi dell'art. 73 del D.Lgs. 81/2008.",
    requiresPatentinoAccordoSR: false,
  },
};

// ============================================================================
// 5. INTERFACCE STRUTTURALI DEL PIANO FORMATIVO INDIVIDUALE (PFI)
// ============================================================================

export type CourseComplianceStatus = "valid" | "expiring" | "expired" | "missing";

export interface IndividualCourseRequirement {
  courseCode: string;
  title: string;
  category:
    | "generale"
    | "specifica"
    | "aggiornamento"
    | "ruolo_sicurezza"
    | "attrezzature"
    | "haccp"
    | "rischio_particolare";
  categoryLabel: string;
  normReference: string;
  minHours: number;
  frequencyYears: number; // 0 per credito permanente a vita (Formazione Generale)
  refresherHours: number;
  description: string;
  status: CourseComplianceStatus;
  statusLabel: string;
  statusColor: string; // "green" | "orange" | "crimson" | "gray"
  daysRemaining: number | null;
  expiresAt: string | null;
  completedAt: string | null;
  certificateNumber: string | null;
  hoursDone: number | null;
  trainingRecordId: string | null;
  isPermanentCredit: boolean;
  priority: "obbligatorio" | "raccomandato" | "integrativo";
}

export interface IndividualTrainingPlan {
  employeeId: string;
  employeeFullName: string;
  fiscalCode: string;
  mansione: string;
  department: string;
  contractType: ContractTypeCode;
  contractLabel: string;
  weeklyHours: number;
  isPartTime: boolean;
  isApprendista: boolean;
  companyAteco?: string;
  companyRiskLevel: "low" | "medium" | "high";
  companyRiskLabel: string;
  detectedSafetyRoles: SafetyRoleCode[];
  detectedSpecificRisks: SpecificRiskCode[];
  assignedMachineNames: string[];
  mandatoryCourses: IndividualCourseRequirement[];
  compliancePercentage: number; // 0 - 100
  totalHoursRequired: number;
  totalHoursDone: number;
  validCoursesCount: number;
  expiringCoursesCount: number;
  expiredCoursesCount: number;
  missingCoursesCount: number;
  normativeNotes: string[];
  planGeneratedAt: string;
  nextRenewalDeadline: string | null;
}

export interface TrainingPlanCalculationOptions {
  referenceDate?: string | Date; // Data di riferimento (default: oggi)
  companyEmployeesCount?: number; // Per calcolo ore aggiornamento RLS (<=50 vs >50 dipendenti)
  explicitContractType?: ContractTypeCode;
  explicitWeeklyHours?: number;
  explicitSafetyRoles?: SafetyRoleCode[];
  explicitSpecificRisks?: SpecificRiskCode[];
  explicitMachineNames?: string[];
  expiringThresholdDays?: number; // Giorni entro cui un corso è "in scadenza" (default: 60)
}

// ============================================================================
// 6. HELPER LOGICI: RISCHIO ATECO, RUOLI, ATTREZZATURE, RISCHI
// ============================================================================

/**
 * Deduce il livello di rischio aziendale in base al codice ATECO 2007 (Accordo Stato-Regioni 21/12/2011)
 * oppure dal parametro companyRiskLevel ("low", "medium", "high", "basso", "medio", "alto").
 */
export function inferRiskLevel(
  companyAteco?: string | null,
  companyRiskLevel?: string | null,
): "low" | "medium" | "high" {
  if (companyRiskLevel) {
    const raw = companyRiskLevel.toLowerCase().trim();
    if (raw === "high" || raw === "alto" || raw === "elevato") return "high";
    if (raw === "medium" || raw === "medio") return "medium";
    if (raw === "low" || raw === "basso") return "low";
  }

  if (companyAteco) {
    const cleaned = companyAteco.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const twoDigits = cleaned.length >= 2 ? parseInt(cleaned.slice(0, 2), 10) : NaN;
    const letter = cleaned.length > 0 && isNaN(parseInt(cleaned[0], 10)) ? cleaned[0] : null;

    // Rischio Alto (16h): Costruzioni (F/41-43), Manifatturiero/Metalm/Chimica (C/10-33), Sanità (Q/86-88), Rifiuti (E/38-39), Energia (D/35), Miniere (B/05-09)
    if (letter && ["B", "C", "D", "E", "F", "Q"].includes(letter)) return "high";
    if (!isNaN(twoDigits)) {
      if (
        (twoDigits >= 5 && twoDigits <= 35) || // B, C, D
        (twoDigits >= 38 && twoDigits <= 39) || // E gestione rifiuti
        (twoDigits >= 41 && twoDigits <= 43) || // F costruzioni
        (twoDigits >= 86 && twoDigits <= 88) // Q sanità
      ) {
        return "high";
      }
      // Rischio Medio (12h): Agricoltura/Pesca (A/01-03), Trasporti/Magazzini (H/49-53), PA (O/84), Istruzione (P/85)
      if (
        (twoDigits >= 1 && twoDigits <= 3) || // A agricoltura
        (twoDigits >= 49 && twoDigits <= 53) || // H trasporti e magazzinaggio
        twoDigits === 84 || // O pubblica amministrazione
        twoDigits === 85 // P istruzione
      ) {
        return "medium";
      }
      // Rischio Basso (8h): Commercio (45-47), Ristorazione/Alloggio (55-56), Servizi, Uffici
      return "low";
    }
  }

  return "low"; // Fallback prudenziale standard
}

/**
 * Traduce il livello di rischio in etichetta descrittiva con ore minime
 */
export function getRiskLevelDetails(risk: "low" | "medium" | "high"): {
  code: "low" | "medium" | "high";
  label: string;
  specificHours: number;
  totalBaseHours: number;
} {
  switch (risk) {
    case "high":
      return {
        code: "high",
        label: "Rischio Alto (Gen 4h + Spec 12h = 16h)",
        specificHours: 12,
        totalBaseHours: 16,
      };
    case "medium":
      return {
        code: "medium",
        label: "Rischio Medio (Gen 4h + Spec 8h = 12h)",
        specificHours: 8,
        totalBaseHours: 12,
      };
    case "low":
    default:
      return {
        code: "low",
        label: "Rischio Basso (Gen 4h + Spec 4h = 8h)",
        specificHours: 4,
        totalBaseHours: 8,
      };
  }
}

/**
 * Rileva la tipologia contrattuale e le ore settimanali a partire dall'anagrafica
 */
export function detectContractAndHours(
  employee: Employee,
  explicitType?: ContractTypeCode,
  explicitHours?: number,
): { contractType: ContractTypeCode; weeklyHours: number } {
  if (explicitType) {
    const hours =
      explicitHours ?? CONTRACT_TYPES[explicitType]?.defaultWeeklyHours ?? 40;
    return { contractType: explicitType, weeklyHours: hours };
  }

  // Verifica proprietà estese sull'oggetto employee
  const ext = employee as unknown as Record<string, unknown>;
  if (typeof ext.contractType === "string" && ext.contractType in CONTRACT_TYPES) {
    const code = ext.contractType as ContractTypeCode;
    const hours =
      typeof ext.weeklyHours === "number" && ext.weeklyHours > 0
        ? ext.weeklyHours
        : CONTRACT_TYPES[code].defaultWeeklyHours;
    return { contractType: code, weeklyHours: hours };
  }

  // Rilevamento tramite analisi testuale di mansione, reparto o note
  const text = `${employee.role || ""} ${employee.department || ""}`.toLowerCase();

  // Ore settimanali esplicite (es. "part-time 20h", "24 ore", "30 h")
  const hourMatch = text.match(/(\d{1,2})\s*(?:h|ore|ore\/sett|h\/sett)/);
  const parsedHours = hourMatch ? parseInt(hourMatch[1], 10) : null;

  if (text.includes("apprendist") || text.includes("pfi")) {
    return { contractType: "apprendistato", weeklyHours: parsedHours || 40 };
  }
  if (text.includes("part-time") || text.includes("part time") || text.includes(" pt ") || text.startsWith("pt ")) {
    return { contractType: "part_time", weeklyHours: parsedHours || 20 };
  }
  if (text.includes("stage") || text.includes("tirocin")) {
    return { contractType: "stage_tirocinio", weeklyHours: parsedHours || 35 };
  }
  if (text.includes("somministra") || text.includes("interinal")) {
    return { contractType: "somministrazione", weeklyHours: parsedHours || 40 };
  }
  if (text.includes("determinato") || text.includes(" t.d.") || text.includes("td")) {
    return { contractType: "determinato", weeklyHours: parsedHours || 40 };
  }
  if (text.includes("chiamata") || text.includes("intermittent")) {
    return { contractType: "intermittente", weeklyHours: parsedHours || 15 };
  }

  if (parsedHours && parsedHours < 36) {
    return { contractType: "part_time", weeklyHours: parsedHours };
  }

  return { contractType: "full_time", weeklyHours: 40 };
}

/**
 * Rileva i ruoli di sicurezza ricoperti dal lavoratore
 */
export function detectSafetyRoles(
  employee: Employee,
  explicitRoles?: SafetyRoleCode[],
  companyRisk?: "low" | "medium" | "high",
): SafetyRoleCode[] {
  const rolesSet = new Set<SafetyRoleCode>();

  if (explicitRoles && explicitRoles.length > 0) {
    explicitRoles.forEach((r) => rolesSet.add(r));
  }

  // Proprietà estese
  const ext = employee as unknown as Record<string, unknown>;
  if (Array.isArray(ext.safetyRoles)) {
    ext.safetyRoles.forEach((r) => {
      if (typeof r === "string" && r in SAFETY_ROLES) {
        rolesSet.add(r as SafetyRoleCode);
      }
    });
  }

  const text = `${employee.role || ""} ${employee.department || ""}`.toLowerCase();

  // Preposto
  if (
    text.includes("prepost") ||
    text.includes("caposquadra") ||
    text.includes("capo squadra") ||
    text.includes("caporeparto") ||
    text.includes("capo reparto") ||
    text.includes("responsabile turno") ||
    text.includes("store manager")
  ) {
    rolesSet.add("preposto");
  }

  // Dirigente
  if (
    text.includes("dirigent") ||
    text.includes("direttore") ||
    text.includes("amministratore delegato") ||
    text.includes("general manager")
  ) {
    rolesSet.add("dirigente");
  }

  // RLS
  if (
    text.includes("rls") ||
    text.includes("rappresentante dei lavoratori") ||
    text.includes("rappresentante lavoratori")
  ) {
    rolesSet.add("rls");
  }

  // Antincendio
  if (text.includes("antincend") || text.includes("vigile del fuoco") || text.includes("emergenza incendi")) {
    if (text.includes("l3") || text.includes("livello 3") || text.includes("rischio alto")) {
      rolesSet.add("antincendio_l3");
    } else if (text.includes("l1") || text.includes("livello 1") || text.includes("rischio basso")) {
      rolesSet.add("antincendio_l1");
    } else if (text.includes("l2") || text.includes("livello 2") || text.includes("rischio medio")) {
      rolesSet.add("antincendio_l2");
    } else {
      // Default coerente con il rischio aziendale
      if (companyRisk === "high") rolesSet.add("antincendio_l3");
      else if (companyRisk === "medium") rolesSet.add("antincendio_l2");
      else rolesSet.add("antincendio_l1");
    }
  }

  // Primo Soccorso
  if (
    text.includes("primo soccorso") ||
    text.includes("addetto ps") ||
    text.includes("soccorritor") ||
    text.includes("pronto soccorso")
  ) {
    if (text.includes("gruppo a") || text.includes("gr. a") || companyRisk === "high") {
      rolesSet.add("primo_soccorso_a");
    } else {
      rolesSet.add("primo_soccorso_bc");
    }
  }

  return Array.from(rolesSet);
}

/**
 * Rileva i rischi particolari della mansione
 */
export function detectSpecificRisks(
  employee: Employee,
  weeklyHours: number,
  explicitRisks?: SpecificRiskCode[],
): SpecificRiskCode[] {
  const risksSet = new Set<SpecificRiskCode>();

  if (explicitRisks && explicitRisks.length > 0) {
    explicitRisks.forEach((r) => risksSet.add(r));
  }

  const ext = employee as unknown as Record<string, unknown>;
  if (Array.isArray(ext.specificRisks)) {
    ext.specificRisks.forEach((r) => {
      if (typeof r === "string" && r in SPECIFIC_RISKS) {
        risksSet.add(r as SpecificRiskCode);
      }
    });
  }

  const text = `${employee.role || ""} ${employee.department || ""}`.toLowerCase();

  // Videoterminalista (>20h settimanali sistematiche ex art. 173 D.Lgs. 81/08)
  const isVdtRole =
    text.includes("ufficio") ||
    text.includes("impiegat") ||
    text.includes("amministrat") ||
    text.includes("contabil") ||
    text.includes("segretar") ||
    text.includes("data entry") ||
    text.includes("sviluppator") ||
    text.includes("programmator") ||
    text.includes("grafic") ||
    text.includes("call center") ||
    text.includes("it specialist") ||
    text.includes("front desk");

  if (isVdtRole && weeklyHours >= 20) {
    risksSet.add("videoterminali_20h");
  }

  // Movimentazione Manuale Carichi (MMC)
  if (
    text.includes("magazzin") ||
    text.includes("facchin") ||
    text.includes("operai") ||
    text.includes("logistic") ||
    text.includes("manoval") ||
    text.includes("scaffalist") ||
    text.includes("carico/scarico") ||
    text.includes("spedizion")
  ) {
    risksSet.add("movimentazione_manuale_carichi");
  }

  // HACCP Manipolatore
  if (
    text.includes("cuoc") ||
    text.includes("cucina") ||
    text.includes("chef") ||
    text.includes("pizzaiol") ||
    text.includes("pasticcer") ||
    text.includes("macellai") ||
    text.includes("gastronom") ||
    text.includes("barist") ||
    text.includes("gelatier") ||
    text.includes("panettiere") ||
    text.includes("rosticcier") ||
    text.includes("banchista")
  ) {
    risksSet.add("haccp_manipolatore");
  }

  // HACCP Non manipolatore
  if (
    text.includes("camerier") ||
    text.includes("sala") ||
    text.includes("lavapiatti") ||
    text.includes("runner")
  ) {
    if (!risksSet.has("haccp_manipolatore")) {
      risksSet.add("haccp_non_manipolatore");
    }
  }

  // DPI 3a categoria / Lavori in quota
  if (
    text.includes("quota") ||
    text.includes("pontegg") ||
    text.includes("lattonier") ||
    text.includes("carpenter") ||
    text.includes("copertur") ||
    text.includes("tetti") ||
    text.includes("rocciatore") ||
    text.includes("spazi confinati")
  ) {
    risksSet.add("dpi_terza_categoria");
    risksSet.add("lavori_in_quota");
  }

  // Rischio chimico
  if (
    text.includes("chimic") ||
    text.includes("verniciator") ||
    text.includes("lavaggio industriale") ||
    text.includes("laboratorio analisi")
  ) {
    risksSet.add("rischio_chimico");
  }

  // Rumore / vibrazioni
  if (
    text.includes("motoseg") ||
    text.includes("martell") ||
    text.includes("carpenteria metallica") ||
    text.includes("demolizion")
  ) {
    risksSet.add("rumore_vibrazioni");
  }

  return Array.from(risksSet);
}

/**
 * Identifica le macchine e attrezzature assegnate al lavoratore
 */
export function detectAssignedEquipmentCourses(
  employee: Employee,
  assignedMachines?: Machine[],
  explicitMachineNames?: string[],
): MachineTrainingRequirementConfig[] {
  const resultConfigs = new Map<string, MachineTrainingRequirementConfig>();
  const roleText = (employee.role || "").toLowerCase();
  const workerFullName = `${employee.lastName} ${employee.firstName}`.toLowerCase().trim();
  const workerReversed = `${employee.firstName} ${employee.lastName}`.toLowerCase().trim();

  // 1. Dalle macchine censite nell'archivio macchine / Step 4
  if (assignedMachines && assignedMachines.length > 0) {
    for (const machine of assignedMachines) {
      const meta = parseMachineMetadata(machine.note);
      const machineName = machine.name.toLowerCase();

      // Verifica se il dipendente è specificamente autorizzato su questa macchina
      const authorizedIds = meta.authorizedWorkerIds || [];
      const authorizedNames = (meta.authorizedWorkerNames || []).map((n) => n.toLowerCase().trim());

      const isDirectlyAuthorized =
        authorizedIds.includes(employee.id) ||
        authorizedNames.some(
          (n) =>
            n.includes(workerFullName) ||
            n.includes(workerReversed) ||
            n.includes(employee.lastName.toLowerCase()),
        );

      // Se non ci sono autorizzati specifici definiti nella macchina, verifichiamo se la mansione corrisponde
      const roleMatchesMachine =
        (machineName.includes("carrell") || machineName.includes("mulett")) &&
        (roleText.includes("carrell") || roleText.includes("mulett") || roleText.includes("magazzin")) ||
        (machineName.includes("ple") || machineName.includes("piattaform")) &&
        (roleText.includes("ple") || roleText.includes("quota") || roleText.includes("elettric")) ||
        machineName.includes("gru") && roleText.includes("gru") ||
        (machineName.includes("affettat") || machineName.includes("impastat") || machineName.includes("tritacarn")) &&
        (roleText.includes("cuoc") || roleText.includes("pizzaiol") || roleText.includes("cucina") || roleText.includes("pasticcer"));

      if (isDirectlyAuthorized || roleMatchesMachine) {
        let code = meta.requiredCourseCode;
        if (!code) {
          if (machineName.includes("carrell") || machineName.includes("mulett")) code = "FORMAZ_CARRELLI";
          else if (machineName.includes("ple") || machineName.includes("piattaform")) code = "FORMAZ_PLE";
          else if (machineName.includes("gru")) code = "FORMAZ_GRU_AUTOCARRO";
          else if (machineName.includes("trattor")) code = "FORMAZ_TRATTORI";
          else if (machineName.includes("sollevator") || machineName.includes("ponte")) code = "FORMAZ_PONTI_SOLLEVATORI";
          else if (
            machineName.includes("affettat") ||
            machineName.includes("impastat") ||
            machineName.includes("tritacarn") ||
            machineName.includes("forno")
          ) {
            code = "FORMAZ_MACCHINE_ALIMENTARI";
          } else if (machineName.includes("saldat")) code = "FORMAZ_SALDATURA";
          else if (machineName.includes("tornio") || machineName.includes("fresa") || machineName.includes("mola") || machineName.includes("pressa")) {
            code = "FORMAZ_MACCHINE_METALLO";
          } else {
            code = "FORMAZ_ATTREZZATURE_BASE";
          }
        }

        const config = EQUIPMENT_TRAINING_CONFIGS[code] || {
          code,
          title: meta.requiredCourseTitle || `Formazione Specifica Uso ${machine.name}`,
          minHours: 4,
          frequencyYears: 5,
          refresherHours: 2,
          normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4",
          description: `Addestramento all'uso in sicurezza di ${machine.name}`,
          requiresPatentinoAccordoSR: false,
        };

        resultConfigs.set(config.code, config);
      }
    }
  }

  // 2. Dalla mansione esplicita del lavoratore se non già aggiunta
  if (roleText.includes("carrellista") || roleText.includes("mulettista")) {
    resultConfigs.set("FORMAZ_CARRELLI", EQUIPMENT_TRAINING_CONFIGS.FORMAZ_CARRELLI);
  }
  if (roleText.includes("piattaformista") || roleText.includes("operatore ple")) {
    resultConfigs.set("FORMAZ_PLE", EQUIPMENT_TRAINING_CONFIGS.FORMAZ_PLE);
  }
  if (roleText.includes("gruista")) {
    resultConfigs.set("FORMAZ_GRU_AUTOCARRO", EQUIPMENT_TRAINING_CONFIGS.FORMAZ_GRU_AUTOCARRO);
  }
  if (roleText.includes("trattorista")) {
    resultConfigs.set("FORMAZ_TRATTORI", EQUIPMENT_TRAINING_CONFIGS.FORMAZ_TRATTORI);
  }
  if (roleText.includes("saldatore")) {
    resultConfigs.set("FORMAZ_SALDATURA", EQUIPMENT_TRAINING_CONFIGS.FORMAZ_SALDATURA);
  }
  if (
    roleText.includes("cuoco") ||
    roleText.includes("pizzaiolo") ||
    roleText.includes("pasticcere") ||
    roleText.includes("macellaio")
  ) {
    resultConfigs.set("FORMAZ_MACCHINE_ALIMENTARI", EQUIPMENT_TRAINING_CONFIGS.FORMAZ_MACCHINE_ALIMENTARI);
  }

  // 3. Da nomi macchine forniti esplicitamente
  if (explicitMachineNames && explicitMachineNames.length > 0) {
    for (const name of explicitMachineNames) {
      const lower = name.toLowerCase();
      if (lower.includes("carrell") || lower.includes("mulett")) {
        resultConfigs.set("FORMAZ_CARRELLI", EQUIPMENT_TRAINING_CONFIGS.FORMAZ_CARRELLI);
      } else if (lower.includes("ple") || lower.includes("piattaform")) {
        resultConfigs.set("FORMAZ_PLE", EQUIPMENT_TRAINING_CONFIGS.FORMAZ_PLE);
      } else if (lower.includes("gru")) {
        resultConfigs.set("FORMAZ_GRU_AUTOCARRO", EQUIPMENT_TRAINING_CONFIGS.FORMAZ_GRU_AUTOCARRO);
      } else if (lower.includes("trattor")) {
        resultConfigs.set("FORMAZ_TRATTORI", EQUIPMENT_TRAINING_CONFIGS.FORMAZ_TRATTORI);
      } else if (lower.includes("affettat") || lower.includes("impastat")) {
        resultConfigs.set("FORMAZ_MACCHINE_ALIMENTARI", EQUIPMENT_TRAINING_CONFIGS.FORMAZ_MACCHINE_ALIMENTARI);
      }
    }
  }

  return Array.from(resultConfigs.values());
}

/**
 * Calcola la conformità di un singolo corso rispetto ai record svolti dal dipendente.
 */
export function matchTrainingRecord(
  req: {
    courseCode: string;
    title: string;
    minHours: number;
    frequencyYears: number;
    isPermanentCredit?: boolean;
  },
  records: TrainingRecord[] = [],
  referenceDate: Date = new Date(),
  expiringThresholdDays: number = 60,
): {
  status: CourseComplianceStatus;
  statusLabel: string;
  statusColor: string;
  daysRemaining: number | null;
  expiresAt: string | null;
  completedAt: string | null;
  certificateNumber: string | null;
  hoursDone: number | null;
  trainingRecordId: string | null;
} {
  // Cerca un record corrispondente nel curriculum del dipendente
  // Corrispondenza semantica o tramite nome del corso
  const lowerReqTitle = req.title.toLowerCase();
  const lowerReqCode = req.courseCode.toLowerCase();

  const matchingRecord = records.find((rec) => {
    const courseName = rec.course?.name?.toLowerCase() || "";
    // Corrispondenza su codice o parole chiave significative
    if (courseName.includes(lowerReqCode)) return true;
    if (lowerReqCode.includes("generale") && courseName.includes("generale")) return true;
    if (lowerReqCode.includes("specifica") && courseName.includes("specifica")) return true;
    if (lowerReqCode.includes("prepost") && courseName.includes("prepost")) return true;
    if (lowerReqCode.includes("dirigent") && courseName.includes("dirigent")) return true;
    if (lowerReqCode.includes("rls") && courseName.includes("rls")) return true;
    if (lowerReqCode.includes("antincend") && courseName.includes("antincend")) return true;
    if (lowerReqCode.includes("primo_soccorso") && (courseName.includes("primo soccorso") || courseName.includes("ps"))) return true;
    if (lowerReqCode.includes("carrelli") && (courseName.includes("carrell") || courseName.includes("mulett"))) return true;
    if (lowerReqCode.includes("ple") && (courseName.includes("ple") || courseName.includes("piattaform"))) return true;
    if (lowerReqCode.includes("gru") && courseName.includes("gru")) return true;
    if (lowerReqCode.includes("macchine_alimentari") && (courseName.includes("macchine alimentari") || courseName.includes("affettat"))) return true;
    if (lowerReqCode.includes("haccp_manipolatore") && (courseName.includes("manipolator") || (courseName.includes("haccp") && !courseName.includes("non manipolator")))) return true;
    if (lowerReqCode.includes("haccp_non_manipolatore") && courseName.includes("non manipolator")) return true;
    if (lowerReqCode.includes("videoterminali") && (courseName.includes("vdt") || courseName.includes("videoterminal"))) return true;
    if (lowerReqCode.includes("movimentazione") && (courseName.includes("movimentazione") || courseName.includes("carichi") || courseName.includes("mmc"))) return true;
    if (lowerReqCode.includes("dpi_terza") && (courseName.includes("iii") || courseName.includes("terza cat") || courseName.includes("anticaduta"))) return true;

    // Confronto diretto di testo
    return courseName.includes(lowerReqTitle) || lowerReqTitle.includes(courseName);
  });

  if (!matchingRecord) {
    return {
      status: "missing",
      statusLabel: "Mancante / Non svolto",
      statusColor: "crimson",
      daysRemaining: null,
      expiresAt: null,
      completedAt: null,
      certificateNumber: null,
      hoursDone: null,
      trainingRecordId: null,
    };
  }

  // Record presente: verifichiamo la data di scadenza
  const completedAt = matchingRecord.completedAt;
  let expiresAt = matchingRecord.expiresAt;
  const hoursDone = matchingRecord.hoursDone ?? matchingRecord.course?.minHours ?? req.minHours;
  const certificateNumber = matchingRecord.certificateNumber;

  // Se è un credito formativo permanente a vita (Formazione Generale 4h)
  if (req.isPermanentCredit || req.frequencyYears === 0) {
    return {
      status: "valid",
      statusLabel: "Valido (Credito permanente)",
      statusColor: "green",
      daysRemaining: null,
      expiresAt: null,
      completedAt,
      certificateNumber,
      hoursDone,
      trainingRecordId: matchingRecord.id,
    };
  }

  // Se expiresAt non è esplicito ma c'è completedAt, calcoliamo completedAt + frequencyYears
  if (!expiresAt && completedAt && req.frequencyYears > 0) {
    const compDate = new Date(completedAt);
    if (!isNaN(compDate.getTime())) {
      compDate.setFullYear(compDate.getFullYear() + req.frequencyYears);
      expiresAt = compDate.toISOString().split("T")[0];
    }
  }

  if (!expiresAt) {
    // Record senza scadenza né data completamento valida
    return {
      status: "expired",
      statusLabel: "Scaduto / Da rinnovare",
      statusColor: "crimson",
      daysRemaining: -1,
      expiresAt: null,
      completedAt,
      certificateNumber,
      hoursDone,
      trainingRecordId: matchingRecord.id,
    };
  }

  // Calcolo differenza giorni tra data scadenza e data di riferimento
  const expTime = new Date(expiresAt).getTime();
  const refTime = referenceDate.getTime();
  const daysRemaining = Math.ceil((expTime - refTime) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      status: "expired",
      statusLabel: `Scaduto da ${Math.abs(daysRemaining)} giorni`,
      statusColor: "crimson",
      daysRemaining,
      expiresAt,
      completedAt,
      certificateNumber,
      hoursDone,
      trainingRecordId: matchingRecord.id,
    };
  }

  if (daysRemaining <= expiringThresholdDays) {
    return {
      status: "expiring",
      statusLabel: `In scadenza (${daysRemaining} giorni)`,
      statusColor: "orange",
      daysRemaining,
      expiresAt,
      completedAt,
      certificateNumber,
      hoursDone,
      trainingRecordId: matchingRecord.id,
    };
  }

  return {
    status: "valid",
    statusLabel: `Valido (${daysRemaining} giorni residui)`,
    statusColor: "green",
    daysRemaining,
    expiresAt,
    completedAt,
    certificateNumber,
    hoursDone,
    trainingRecordId: matchingRecord.id,
  };
}

// ============================================================================
// 7. FUNZIONE PRINCIPALE: computeIndividualTrainingPlan
// ============================================================================

/**
 * Calcola la Progettazione Formativa Individuale (PFI) per un dipendente aziendale
 * applicando l'intero impianto normativo di sicurezza (D.Lgs. 81/08, Accordi Stato-Regioni,
 * D.M. Antincendio, D.M. Primo Soccorso) e igiene alimentare (Reg. CE 852/2004 HACCP).
 *
 * @param employee Dipendente registrato in anagrafica
 * @param companyAteco Codice ATECO azienda (opzionale, es. "56.10", "41.20", "47.11")
 * @param companyRiskLevel Livello di rischio azienda ("low" | "medium" | "high" o "basso" | "medio" | "alto")
 * @param assignedMachines Macchinari censiti nello Step 4 o assegnati all'operatore
 * @param options Opzioni di calcolo addizionali (data riferimento, soglie, ruoli espliciti)
 */
export function computeIndividualTrainingPlan(
  employee: Employee,
  companyAteco?: string,
  companyRiskLevel?: string,
  assignedMachines?: Machine[],
  options?: TrainingPlanCalculationOptions,
): IndividualTrainingPlan {
  const refDate = options?.referenceDate ? new Date(options.referenceDate) : new Date();
  const expiringDays = options?.expiringThresholdDays ?? 60;

  // 1. Riconoscimento livello di rischio aziendale
  const riskLevel = inferRiskLevel(companyAteco, companyRiskLevel);
  const riskDetails = getRiskLevelDetails(riskLevel);

  // 2. Riconoscimento contratto e orario
  const { contractType, weeklyHours } = detectContractAndHours(
    employee,
    options?.explicitContractType,
    options?.explicitWeeklyHours,
  );
  const isPartTime = contractType === "part_time" || weeklyHours < 36;
  const isApprendista = contractType === "apprendistato";

  // 3. Riconoscimento ruoli di sicurezza
  const detectedSafetyRoles = detectSafetyRoles(
    employee,
    options?.explicitSafetyRoles,
    riskLevel,
  );

  // 4. Riconoscimento rischi specifici mansione
  const detectedSpecificRisks = detectSpecificRisks(
    employee,
    weeklyHours,
    options?.explicitSpecificRisks,
  );

  // 5. Riconoscimento macchine e corsi attrezzature
  const assignedEquipment = detectAssignedEquipmentCourses(
    employee,
    assignedMachines,
    options?.explicitMachineNames,
  );

  // 6. Generazione lista corsi obbligatori
  const mandatoryCourses: IndividualCourseRequirement[] = [];
  const records = employee.trainingRecords || [];
  const isDirigente = detectedSafetyRoles.includes("dirigente");

  // A) Formazione Lavoratori (Generale + Specifica) O Corso Dirigenti
  if (isDirigente) {
    // Il Dirigente segue il corso di 16h in sostituzione di quello lavoratori
    const match = matchTrainingRecord(
      {
        courseCode: "DIRIGENTI_16H",
        title: SAFETY_ROLES.dirigente.courseTitle,
        minHours: 16,
        frequencyYears: 5,
      },
      records,
      refDate,
      expiringDays,
    );

    mandatoryCourses.push({
      courseCode: "DIRIGENTI_16H",
      title: SAFETY_ROLES.dirigente.courseTitle,
      category: "ruolo_sicurezza",
      categoryLabel: "Ruolo Dirigente",
      normReference: SAFETY_ROLES.dirigente.normReference,
      minHours: 16,
      frequencyYears: 5,
      refresherHours: 6,
      description: SAFETY_ROLES.dirigente.description,
      priority: "obbligatorio",
      isPermanentCredit: false,
      ...match,
    });
  } else {
    // 1. Formazione Generale Lavoratori (4h, credito permanente non soggetto a scadenza)
    const matchGen = matchTrainingRecord(
      {
        courseCode: "SIC_LAV_GENERALE",
        title: "Formazione Generale Lavoratori (Credito Permanente)",
        minHours: 4,
        frequencyYears: 0,
        isPermanentCredit: true,
      },
      records,
      refDate,
      expiringDays,
    );

    mandatoryCourses.push({
      courseCode: "SIC_LAV_GENERALE",
      title: "Formazione Generale Lavoratori (4 ore)",
      category: "generale",
      categoryLabel: "Formazione Generale",
      normReference: "D.Lgs. 81/2008, art. 37 c. 1; Accordo Stato-Regioni 21/12/2011, p. 4",
      minHours: 4,
      frequencyYears: 0,
      refresherHours: 0,
      description:
        "Concetti generali di rischio, danno, prevenzione, protezione e organizzazione della sicurezza aziendale. Credito formativo permanente a vita.",
      priority: "obbligatorio",
      isPermanentCredit: true,
      ...matchGen,
    });

    // 2. Formazione Specifica Lavoratori (4h Basso, 8h Medio, 12h Alto)
    const specCode =
      riskLevel === "high"
        ? "SIC_LAV_SPECIFICA_ALTO"
        : riskLevel === "medium"
        ? "SIC_LAV_SPECIFICA_MEDIO"
        : "SIC_LAV_SPECIFICA_BASSO";

    const matchSpec = matchTrainingRecord(
      {
        courseCode: specCode,
        title: `Formazione Specifica Lavoratori - ${riskDetails.label}`,
        minHours: riskDetails.specificHours,
        frequencyYears: 5,
        isPermanentCredit: false,
      },
      records,
      refDate,
      expiringDays,
    );

    mandatoryCourses.push({
      courseCode: specCode,
      title: `Formazione Specifica Lavoratori (${riskDetails.specificHours} ore - ${riskDetails.label.split(" ")[1]})`,
      category: "specifica",
      categoryLabel: "Formazione Specifica",
      normReference: "D.Lgs. 81/2008, art. 37 c. 1 e 3; Accordo Stato-Regioni 21/12/2011, p. 4",
      minHours: riskDetails.specificHours,
      frequencyYears: 5,
      refresherHours: 6,
      description: `Formazione specifica sui rischi legati alla mansione e al settore ATECO aziendale. Aggiornamento obbligatorio quinquennale di 6 ore.`,
      priority: "obbligatorio",
      isPermanentCredit: false,
      ...matchSpec,
    });
  }

  // B) Ruoli di Sicurezza Specifici
  for (const roleCode of detectedSafetyRoles) {
    if (roleCode === "lavoratore" || roleCode === "dirigente") continue;

    const roleDef = SAFETY_ROLES[roleCode];
    if (!roleDef) continue;

    let minHours = roleDef.minHours;
    let refresherHours = roleDef.refresherHours;

    // Gestione differenziata RLS per aziende oltre 50 dipendenti (8h annue invece di 4h)
    if (roleCode === "rls" && (options?.companyEmployeesCount ?? 0) > 50) {
      refresherHours = 8;
    }

    const match = matchTrainingRecord(
      {
        courseCode: `RUOLO_${roleCode.toUpperCase()}`,
        title: roleDef.courseTitle,
        minHours,
        frequencyYears: roleDef.frequencyYears,
      },
      records,
      refDate,
      expiringDays,
    );

    mandatoryCourses.push({
      courseCode: `RUOLO_${roleCode.toUpperCase()}`,
      title: roleDef.courseTitle,
      category: "ruolo_sicurezza",
      categoryLabel: "Ruolo di Sicurezza",
      normReference: roleDef.normReference,
      minHours,
      frequencyYears: roleDef.frequencyYears,
      refresherHours,
      description: roleDef.description,
      priority: "obbligatorio",
      isPermanentCredit: false,
      ...match,
    });
  }

  // C) Corsi per Macchine e Attrezzature Censite
  for (const eq of assignedEquipment) {
    const match = matchTrainingRecord(
      {
        courseCode: eq.code,
        title: eq.title,
        minHours: eq.minHours,
        frequencyYears: eq.frequencyYears,
      },
      records,
      refDate,
      expiringDays,
    );

    mandatoryCourses.push({
      courseCode: eq.code,
      title: eq.title,
      category: "attrezzature",
      categoryLabel: eq.requiresPatentinoAccordoSR ? "Abilitazione Patentino" : "Addestramento Attrezzature",
      normReference: eq.normReference,
      minHours: eq.minHours,
      frequencyYears: eq.frequencyYears,
      refresherHours: eq.refresherHours,
      description: eq.description,
      priority: "obbligatorio",
      isPermanentCredit: false,
      ...match,
    });
  }

  // D) Igiene Alimentare / HACCP (se rilevato)
  for (const riskCode of detectedSpecificRisks) {
    if (riskCode === "haccp_manipolatore" || riskCode === "haccp_non_manipolatore") {
      const riskDef = SPECIFIC_RISKS[riskCode];
      const match = matchTrainingRecord(
        {
          courseCode: riskCode.toUpperCase(),
          title: riskDef.courseTitle,
          minHours: riskDef.minHours,
          frequencyYears: riskDef.frequencyYears,
        },
        records,
        refDate,
        expiringDays,
      );

      mandatoryCourses.push({
        courseCode: riskCode.toUpperCase(),
        title: riskDef.courseTitle,
        category: "haccp",
        categoryLabel: "Igiene Alimentare (HACCP)",
        normReference: riskDef.normReference,
        minHours: riskDef.minHours,
        frequencyYears: riskDef.frequencyYears,
        refresherHours: riskDef.refresherHours,
        description: riskDef.description,
        priority: "obbligatorio",
        isPermanentCredit: false,
        ...match,
      });
    } else {
      // Altri rischi particolari (VDT >20h, MMC, DPI III Cat, ecc.)
      const riskDef = SPECIFIC_RISKS[riskCode];
      if (riskDef) {
        const match = matchTrainingRecord(
          {
            courseCode: riskCode.toUpperCase(),
            title: riskDef.courseTitle,
            minHours: riskDef.minHours,
            frequencyYears: riskDef.frequencyYears,
          },
          records,
          refDate,
          expiringDays,
        );

        mandatoryCourses.push({
          courseCode: riskCode.toUpperCase(),
          title: riskDef.courseTitle,
          category: "rischio_particolare",
          categoryLabel: "Rischio Specifico Mansione",
          normReference: riskDef.normReference,
          minHours: riskDef.minHours,
          frequencyYears: riskDef.frequencyYears,
          refresherHours: riskDef.refresherHours,
          description: riskDef.description,
          priority: "obbligatorio",
          isPermanentCredit: false,
          ...match,
        });
      }
    }
  }

  // 7. Statistiche, Totali Ore e Conformità
  const totalHoursRequired = mandatoryCourses.reduce((acc, c) => acc + c.minHours, 0);
  const totalHoursDone = mandatoryCourses.reduce((acc, c) => {
    if (c.status === "valid" || c.status === "expiring") {
      return acc + (c.hoursDone ?? c.minHours);
    }
    return acc;
  }, 0);

  const validCoursesCount = mandatoryCourses.filter((c) => c.status === "valid").length;
  const expiringCoursesCount = mandatoryCourses.filter((c) => c.status === "expiring").length;
  const expiredCoursesCount = mandatoryCourses.filter((c) => c.status === "expired").length;
  const missingCoursesCount = mandatoryCourses.filter((c) => c.status === "missing").length;

  const totalCourses = mandatoryCourses.length;
  // Un corso è adempiuto se è valido o in scadenza (non ancora scaduto)
  const fulfilledCourses = validCoursesCount + expiringCoursesCount;
  const compliancePercentage =
    totalCourses > 0 ? Math.round((fulfilledCourses / totalCourses) * 100) : 100;

  // Prossima scadenza formativa
  const expiringDeadlines = mandatoryCourses
    .map((c) => c.expiresAt)
    .filter((d): d is string => Boolean(d))
    .sort();
  const nextRenewalDeadline = expiringDeadlines.length > 0 ? expiringDeadlines[0] : null;

  // 8. Generazione Note Normative Specifiche per il lavoratore
  const normativeNotes: string[] = [];

  // Nota Contratto & Orario
  const contractDef = CONTRACT_TYPES[contractType];
  if (isApprendista) {
    normativeNotes.push(
      `Tipologia contrattuale: ${contractDef.label}. Ai sensi dell'art. 2 c. 1 lett. a) del D.Lgs. 81/2008 il lavoratore in apprendistato è equiparato a lavoratore dipendente. La formazione generale e specifica deve essere erogata prima o entro 60 giorni dall'assunzione e debitamente registrata nel Piano Formativo Individuale (PFI).`,
    );
  } else if (isPartTime) {
    normativeNotes.push(
      `Tipologia contrattuale: ${contractDef.label} (${weeklyHours}h settimanali). Nota normativa: ex art. 37 del D.Lgs. 81/2008 la formazione di sicurezza per lavoratori part-time NON subisce riduzioni proporzionali di orario ed è interamente a carico del datore di lavoro.`,
    );
  } else {
    normativeNotes.push(
      `Tipologia contrattuale: ${contractDef.label} (${weeklyHours}h settimanali). Applicazione ordinaria del regime di formazione e aggiornamento periodico.`,
    );
  }

  // Nota Rischio ATECO
  normativeNotes.push(
    `Inquadramento di Rischio Aziendale: ${riskDetails.label}. Settore ATECO: ${companyAteco || "Generale"}. Prevista Formazione Generale di 4 ore (credito permanente non soggetto a scadenza) e Formazione Specifica di ${riskDetails.specificHours} ore con aggiornamento quinquennale di 6 ore ex Accordo Stato-Regioni 21/12/2011.`,
  );

  // Note Ruoli di Sicurezza
  if (detectedSafetyRoles.includes("preposto")) {
    normativeNotes.push(
      `Ruolo Preposto alla Sicurezza: Ai sensi dell'art. 37 comma 7 e 7-ter del D.Lgs. 81/2008 novellato dalla Legge 215/2021, è prescritto corso integrativo di 8 ore con obbligo di aggiornamento BIENNALE (ogni 2 anni) di almeno 6 ore da svolgersi in presenza.`,
    );
  }
  if (detectedSafetyRoles.includes("dirigente")) {
    normativeNotes.push(
      `Ruolo Dirigente: Ai sensi dell'Accordo Stato-Regioni 21/12/2011 punto 6, il corso dirigenti di 16 ore sostituisce integralmente la formazione base lavoratori. Aggiornamento quinquennale di 6 ore.`,
    );
  }
  if (detectedSafetyRoles.includes("rls")) {
    const rlsAggHours = (options?.companyEmployeesCount ?? 0) > 50 ? 8 : 4;
    normativeNotes.push(
      `Ruolo RLS (Rappresentante Lavoratori Sicurezza): Ai sensi dell'art. 37 c. 11 del D.Lgs. 81/2008 è prescritto corso iniziale di 32 ore con obbligo di aggiornamento ANNUALE di ${rlsAggHours} ore.`,
    );
  }
  if (detectedSafetyRoles.some((r) => r.startsWith("antincendio"))) {
    normativeNotes.push(
      `Addetto Squadra Emergenza Antincendio: Designato ai sensi del D.M. 02/09/2021. Obbligo di aggiornamento periodico TRIENNALE con esercitazione pratica di spegnimento ed estintori.`,
    );
  }
  if (detectedSafetyRoles.some((r) => r.startsWith("primo_soccorso"))) {
    normativeNotes.push(
      `Addetto Squadra Primo Soccorso: Designato ai sensi del D.M. 388/2003 e art. 45 D.Lgs. 81/2008. Obbligo di aggiornamento pratico TRIENNALE di 4 o 6 ore.`,
    );
  }

  // Note Macchine & Attrezzature
  if (assignedEquipment.length > 0) {
    const eqList = assignedEquipment.map((e) => e.title).join(", ");
    normativeNotes.push(
      `Attrezzature di lavoro assegnate: ${eqList}. Ai sensi dell'Accordo Stato-Regioni 22/02/2012 e dell'art. 73 commi 4 e 5 del D.Lgs. 81/2008, è fatto divieto di adibire l'operatore alla conduzione delle attrezzature in assenza di patentino/addestramento in corso di validità.`,
    );
  }

  // Note HACCP
  if (detectedSpecificRisks.includes("haccp_manipolatore")) {
    normativeNotes.push(
      `Settore Alimentare / Igiene (HACCP): Mansione con manipolazione diretta di alimenti sfusi. Ai sensi del Reg. CE 852/2004 All. II Cap. XII è obbligatorio l'attestato di formazione alimentarista (8h) con rinnovo periodico.`,
    );
  } else if (detectedSpecificRisks.includes("haccp_non_manipolatore")) {
    normativeNotes.push(
      `Settore Alimentare / Igiene (HACCP): Mansione di non manipolatore alimenti (4h).`,
    );
  }

  // Note Videoterminalisti
  if (detectedSpecificRisks.includes("videoterminali_20h")) {
    normativeNotes.push(
      `Rischio Videoterminale: Lavoratore che supera la soglia di 20 ore settimanali a schermo (art. 173 D.Lgs. 81/08). Obbligo di modulo informativo/formativo su postura ed ergonomia della postazione, oltre all'attivazione della sorveglianza sanitaria periodica da parte del Medico Competente.`,
    );
  }

  // Note DPI III categoria
  if (detectedSpecificRisks.includes("dpi_terza_categoria")) {
    normativeNotes.push(
      `Uso DPI di III Categoria (Anticaduta/Salvavita): Ex art. 77 comma 5 del D.Lgs. 81/2008 è obbligatorio l'addestramento pratico documentato all'uso e al corretto posizionamento prima dell'impiego operativo.`,
    );
  }

  return {
    employeeId: employee.id,
    employeeFullName: `${employee.lastName} ${employee.firstName}`.trim(),
    fiscalCode: employee.fiscalCode || "—",
    mansione: employee.role || "Non specificata",
    department: employee.department || "Generale",
    contractType,
    contractLabel: contractDef.label,
    weeklyHours,
    isPartTime,
    isApprendista,
    companyAteco,
    companyRiskLevel: riskLevel,
    companyRiskLabel: riskDetails.label,
    detectedSafetyRoles,
    detectedSpecificRisks,
    assignedMachineNames: assignedEquipment.map((e) => e.title),
    mandatoryCourses,
    compliancePercentage,
    totalHoursRequired,
    totalHoursDone,
    validCoursesCount,
    expiringCoursesCount,
    expiredCoursesCount,
    missingCoursesCount,
    normativeNotes,
    planGeneratedAt: refDate.toISOString(),
    nextRenewalDeadline,
  };
}

// ============================================================================
// 8. HELPER DI PRESENTAZIONE UI PER I BADGE DI CONFORMITÀ
// ============================================================================

export function getStatusBadgeDetails(status: CourseComplianceStatus): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  switch (status) {
    case "valid":
      return {
        label: "Valido",
        color: "#166534",
        bgColor: "#dcfce7",
        borderColor: "#86efac",
      };
    case "expiring":
      return {
        label: "In Scadenza",
        color: "#9a3412",
        bgColor: "#ffedd5",
        borderColor: "#fdba74",
      };
    case "expired":
      return {
        label: "Scaduto",
        color: "#991b1b",
        bgColor: "#fee2e2",
        borderColor: "#fca5a5",
      };
    case "missing":
    default:
      return {
        label: "Mancante",
        color: "#475569",
        bgColor: "#f1f5f9",
        borderColor: "#cbd5e1",
      };
  }
}
