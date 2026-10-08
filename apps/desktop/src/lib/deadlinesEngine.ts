/**
 * deadlinesEngine.ts
 *
 * Motore normativo di calcolo ed aggregazione delle scadenze per FedShield.
 *
 * Conforme alle normative italiane vigenti:
 * - Titoli autorizzativi & ambientali: A.U.A. (D.P.R. 59/2013, 15 anni)
 * - Prevenzione incendi: C.P.I. / Rinnovo conformità antincendio (D.P.R. 151/2011, 5 anni)
 * - Impianti elettrici: Verifica periodica messa a terra (D.P.R. 462/2001, 2 o 5 anni)
 * - Valutazione rischi D.Lgs. 81/2008:
 *     - DVR generale: riesame periodico / audit (3 anni)
 *     - VDR Rumore, Vibrazioni, CEM, ROA: art. 181 c. 2 (4 anni)
 *     - VDR Chimico: art. 223 c. 7 (3 anni)
 *     - Stress Lavoro-Correlato: art. 28 c. 1-bis (2 o 3 anni)
 *     - Riunione periodica sicurezza: art. 35 (1 anno per > 15 lavoratori)
 * - Igiene alimentare & Acque:
 *     - Manuale HACCP e riesame autocontrollo: Reg. CE 852/2004 (1 anno)
 *     - Rapporti di prova / Tamponi alimentari: Reg. CE 2073/2005 (1 anno)
 *     - Piano di Sicurezza delle Acque & Potabilità: D.Lgs. 18/2023 (1 anno)
 *     - Rischio Legionellosi: Linee Guida Nazionali 2015 & D.Lgs. 18/2023 (2 anni, 1 anno per strutture sanitarie)
 * - Attrezzature e macchine:
 *     - Manutenzione generale: D.Lgs. 81/2008 art. 71 c. 8 (1 anno)
 *     - Verifiche periodiche INAIL/ARPA sollevamento e pressione: art. 71 c. 11, All. VII e D.M. 11/04/2011 (1 o 2 anni)
 * - Antincendio e Primo Soccorso:
 *     - Estintori controllo semestrale: UNI 9994-1:2013 p. 4.4 e D.M. 01/09/2021 (6 mesi)
 *     - Estintori revisione programmata: UNI 9994-1:2013 p. 4.5 (Polvere 36 mesi, CO2 60 mesi, Schiuma 24-48 mesi)
 *     - Estintori collaudo periodico: UNI 9994-1:2013 p. 4.6 (CO2 120 mesi / 10 anni, Polvere PED 144 mesi / 12 anni)
 *     - Cassetta Primo Soccorso: D.M. 388/2003 art. 2 (6 mesi)
 * - Formazione e aggiornamento:
 *     - Preposti: D.Lgs. 81/2008 art. 37 c. 7-ter mod. L. 215/2021 (2 anni)
 *     - Lavoratori (generale + specifica): Accordo Stato-Regioni 21/12/2011 (5 anni)
 *     - RLS: D.Lgs. 81/2008 art. 37 c. 11 (1 anno)
 *     - RSPP Datore di Lavoro: Accordo Stato-Regioni 21/12/2011 (5 anni)
 *     - Dirigenti: Accordo Stato-Regioni 21/12/2011 (5 anni)
 *     - Addetti Primo Soccorso: D.M. 388/2003 art. 3 c. 5 (3 anni)
 *     - Addetti Antincendio: D.M. 02/09/2021 (5 anni, o 3 anni per rischio elevato)
 *     - Attrezzature patentino (carrelli, PLE, gru): Accordo Stato-Regioni 22/02/2012 (5 anni)
 *     - Alimentaristi HACCP: normative regionali (3 anni default)
 */

import { perCampoData } from "./oraItalia";
import {
  parseDocumentExtraMeta,
  DocumentExtraMeta,
  findCatalogDefinition,
} from "../pages/checklist/normativeDocumentCatalog";

// ============================================================================
// 1. COSTANTI E TIPI TYPESCRIPT
// ============================================================================

export type DeadlineUrgency =
  | "expired"       // Scaduta (< 0 giorni)
  | "critical"      // Critica (0 - 30 giorni)
  | "warning"       // In scadenza (31 - 90 giorni)
  | "ok"            // Regolare (> 90 giorni)
  | "to_schedule";  // Da programmare (nessuna data determinabile)

export type CalculationMethod =
  | "explicit"                    // Data scadenza indicata esplicitamente
  | "calculated_from_issue"       // Calcolata sommando mesi di validità alla data di rilascio
  | "calculated_from_inspection"  // Calcolata sommando mesi di validità alla data del sopralluogo
  | "unscheduled";                // Non determinabile / da programmare

export type DeadlineCategory =
  | "autorizzazioni"
  | "sicurezza"
  | "haccp_acque"
  | "attrezzature"
  | "antincendio_pronto_soccorso"
  | "formazione_sanitaria";

export type DeadlineSourceEntity =
  | "inspection_document"
  | "machine"
  | "equipment"
  | "fire_extinguisher"
  | "first_aid_kit"
  | "training_record"
  | "employee_course";

export interface AggregatedDeadline {
  id: string;
  companyId: string;
  companyName: string;
  companyAteco?: string;
  category: DeadlineCategory;
  categoryLabel: string;
  title: string;
  subTitle?: string;
  identifier?: string;
  normReference?: string;
  issueDate?: string | null;       // YYYY-MM-DD o null
  deadlineDate?: string | null;    // YYYY-MM-DD o null
  daysRemaining?: number | null;   // Giorni rimanenti (negativo se scaduto)
  urgency: DeadlineUrgency;
  calculationMethod: CalculationMethod;
  sourceEntity: DeadlineSourceEntity;
  sourceId: string;
  note?: string;
}

export interface DeadlineCategoryMeta {
  key: DeadlineCategory;
  title: string;
  subtitle: string;
  icon: string;
  badgeColor: string;
  normScope: string;
}

export const DEADLINE_CATEGORIES_INFO: Record<DeadlineCategory, DeadlineCategoryMeta> = {
  autorizzazioni: {
    key: "autorizzazioni",
    title: "Autorizzazioni & Titoli Abilitativi",
    subtitle: "A.U.A. ambientale, agibilità, SCIA, DICO impianti",
    icon: "🏛️",
    badgeColor: "#0284c7",
    normScope: "D.P.R. 59/2013 (A.U.A.) • D.P.R. 380/01 • D.M. 37/08",
  },
  sicurezza: {
    key: "sicurezza",
    title: "Sicurezza sul Lavoro & DVR",
    subtitle: "DVR generale, valutazioni rischi specifici (rumore, vibrazioni, chimico, MMC), riunioni periodiche",
    icon: "🦺",
    badgeColor: "#ea580c",
    normScope: "D.Lgs. 81/2008 e s.m.i. (artt. 17, 28, 29, 181, 223)",
  },
  haccp_acque: {
    key: "haccp_acque",
    title: "Igiene HACCP & Acque/Legionella",
    subtitle: "Manuale autocontrollo, tamponi e analisi alimenti, Water Safety Plan, legionella",
    icon: "💧",
    badgeColor: "#16a34a",
    normScope: "Reg. CE 852/2004 • Reg. CE 2073/2005 • D.Lgs. 18/2023 • Linee Guida Legionellosi 2015",
  },
  attrezzature: {
    key: "attrezzature",
    title: "Macchine, Attrezzature & Messa a Terra",
    subtitle: "Manutenzione periodica, verifiche INAIL/ARPA art. 71 c. 11, verifiche D.P.R. 462/01",
    icon: "⚙️",
    badgeColor: "#4f46e5",
    normScope: "D.Lgs. 81/2008 art. 71, All. VII • D.M. 11/04/2011 • D.P.R. 462/2001",
  },
  antincendio_pronto_soccorso: {
    key: "antincendio_pronto_soccorso",
    title: "Antincendio, Estintori & Primo Soccorso",
    subtitle: "C.P.I., controllo semestrale e revisione estintori, cassette e pacchetti medicazione",
    icon: "🧯",
    badgeColor: "#dc2626",
    normScope: "D.P.R. 151/2011 • D.M. 01/09/2021 • UNI 9994-1:2013 • D.M. 388/2003",
  },
  formazione_sanitaria: {
    key: "formazione_sanitaria",
    title: "Formazione & Sorveglianza Sanitaria",
    subtitle: "Aggiornamenti lavoratori, preposti, RLS, RSPP, antincendio, primo soccorso, patenti e visite mediche",
    icon: "🎓",
    badgeColor: "#8b5cf6",
    normScope: "D.Lgs. 81/2008 artt. 37, 41 • Accordi Stato-Regioni 2011/2012 • D.M. 388/03",
  },
};

// ============================================================================
// 2. FUNZIONI DI MANIPOLAZIONE DATE DETERMINISTICHE
// ============================================================================

/**
 * Normalizza qualsiasi rappresentazione di data in stringa 'YYYY-MM-DD'.
 * Supporta formati ISO (2026-10-08T00:00:00Z), YYYY-MM-DD, e formati italiani DD/MM/YYYY.
 */
export function normalizeDateToYmd(val?: string | Date | null): string | null {
  if (val === null || val === undefined) return null;
  if (val instanceof Date) {
    if (Number.isNaN(val.getTime())) return null;
    return val.toISOString().slice(0, 10);
  }
  const str = String(val).trim();
  if (!str) return null;

  // Formato YYYY-MM-DD (anche con orario dopo)
  const matchYmd = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (matchYmd) {
    const y = matchYmd[1];
    const m = matchYmd[2].padStart(2, "0");
    const d = matchYmd[3].padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // Formato DD/MM/YYYY o DD-MM-YYYY
  const matchDmy = str.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/);
  if (matchDmy) {
    const d = matchDmy[1].padStart(2, "0");
    const m = matchDmy[2].padStart(2, "0");
    const y = matchDmy[3];
    return `${y}-${m}-${d}`;
  }

  // Parse generico
  const parsed = new Date(str);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return null;
}

/**
 * Aggiunge un numero di mesi a una data in formato 'YYYY-MM-DD',
 * gestendo correttamente i giorni massimi del mese (es. 31 gennaio + 1 mese = 28/29 febbraio).
 */
export function addMonthsToYmd(ymd: string, months: number): string {
  const norm = normalizeDateToYmd(ymd);
  if (!norm) return "";
  const [yStr, mStr, dStr] = norm.split("-");
  const origYear = parseInt(yStr, 10);
  const origMonth = parseInt(mStr, 10); // 1 - 12
  const origDay = parseInt(dStr, 10);

  const totalMonths = origMonth - 1 + months;
  const targetYear = origYear + Math.floor(totalMonths / 12);
  const targetMonth0 = ((totalMonths % 12) + 12) % 12; // 0 - 11
  const targetMonth = targetMonth0 + 1;

  // Massimo dei giorni nel mese target (UTC evita problemi di ora legale)
  const maxDays = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();
  const targetDay = Math.min(origDay, maxDays);

  return `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(targetDay).padStart(2, "0")}`;
}

/**
 * Calcola i giorni di calendario di differenza tra targetYmd e referenceYmd.
 * Se target è successivo a reference, restituisce un numero positivo.
 * Se target è precedente a reference, restituisce un numero negativo (scaduto).
 */
export function diffCalendarDays(targetYmd: string, referenceYmd: string): number {
  const tNorm = normalizeDateToYmd(targetYmd);
  const refNorm = normalizeDateToYmd(referenceYmd);
  if (!tNorm || !refNorm) return 0;

  const tTime = Date.UTC(
    parseInt(tNorm.slice(0, 4), 10),
    parseInt(tNorm.slice(5, 7), 10) - 1,
    parseInt(tNorm.slice(8, 10), 10),
  );
  const refTime = Date.UTC(
    parseInt(refNorm.slice(0, 4), 10),
    parseInt(refNorm.slice(5, 7), 10) - 1,
    parseInt(refNorm.slice(8, 10), 10),
  );

  return Math.round((tTime - refTime) / (1000 * 60 * 60 * 24));
}

// ============================================================================
// 3. REGOLE NORMATIVE DI DECADENZA DI LEGGE (DEADLINE_RULES)
// ============================================================================

export interface RuleResolutionContext {
  atecoCode?: string;
  isHighRisk?: boolean;
  notes?: string;
}

export interface DeadlineRule {
  key: string;
  category: DeadlineCategory;
  categoryLabel: string;
  title: string;
  normReference: string;
  defaultValidityMonths: number;
  description: string;
  resolveValidityMonths?: (context: RuleResolutionContext) => number;
  matchers: {
    catalogIds?: string[];
    nameKeywords?: string[];
  };
}

/**
 * Libreria esaustiva delle regole di decadenza di legge secondo la normativa italiana.
 */
export const DEADLINE_RULES: Record<string, DeadlineRule> = {
  // --- AUTORIZZAZIONI & TITOLI ABILITATIVI ---
  AUA_AMBIENTALE: {
    key: "AUA_AMBIENTALE",
    category: "autorizzazioni",
    categoryLabel: DEADLINE_CATEGORIES_INFO.autorizzazioni.title,
    title: "A.U.A. - Autorizzazione Unica Ambientale",
    normReference: "D.P.R. 59/2013, art. 3 c. 6",
    defaultValidityMonths: 180, // 15 anni
    description: "Validità quindicennale dell'Autorizzazione Unica Ambientale dalla data di rilascio da parte dell'Ente competente.",
    matchers: {
      catalogIds: ["base-aua-ambientale"],
      nameKeywords: ["aua", "autorizzazione unica ambientale"],
    },
  },

  // --- ANTINCENDIO & EMERGENZE ---
  CPI_ANTINCENDIO: {
    key: "CPI_ANTINCENDIO",
    category: "antincendio_pronto_soccorso",
    categoryLabel: DEADLINE_CATEGORIES_INFO.antincendio_pronto_soccorso.title,
    title: "C.P.I. / Rinnovo Periodico Conformità Antincendio",
    normReference: "D.P.R. 151/2011, art. 5 e D.M. 07/08/2012",
    defaultValidityMonths: 60, // 5 anni
    description: "Attestazione di rinnovo periodico di conformità antincendio ogni 5 anni (D.P.R. 151/2011 art. 5).",
    matchers: {
      catalogIds: ["base-cpi-antincendio"],
      nameKeywords: ["cpi", "prevenzione incendi", "certificato di prevenzione incendi", "rinnovo antincendio"],
    },
  },

  PROVA_EVACUAZIONE: {
    key: "PROVA_EVACUAZIONE",
    category: "antincendio_pronto_soccorso",
    categoryLabel: DEADLINE_CATEGORIES_INFO.antincendio_pronto_soccorso.title,
    title: "Verbale Prova Periodica di Evacuazione",
    normReference: "D.M. 02/09/2021, All. II p. 2.4",
    defaultValidityMonths: 12, // 1 anno
    description: "Effettuazione con cadenza almeno annuale della prova di evacuazione ed esercitazione antincendio.",
    matchers: {
      catalogIds: ["sec-piano-emergenza"],
      nameKeywords: ["prova di evacuazione", "esercitazione antincendio", "verbale evacuazione"],
    },
  },

  ESTINTORI_CONTROLLO_SEMESTRALE: {
    key: "ESTINTORI_CONTROLLO_SEMESTRALE",
    category: "antincendio_pronto_soccorso",
    categoryLabel: DEADLINE_CATEGORIES_INFO.antincendio_pronto_soccorso.title,
    title: "Controllo Periodico Semestrale Estintori",
    normReference: "UNI 9994-1:2013 p. 4.4 e D.M. 01/09/2021",
    defaultValidityMonths: 6, // 6 mesi
    description: "Controllo periodico con cadenza non superiore a 6 mesi effettuato da tecnico manutentore qualificato.",
    matchers: {
      catalogIds: ["sec-registro-antincendio"],
      nameKeywords: ["controllo estintori", "manutenzione estintori semestrale"],
    },
  },

  CASSETTA_PRONTO_SOCCORSO: {
    key: "CASSETTA_PRONTO_SOCCORSO",
    category: "antincendio_pronto_soccorso",
    categoryLabel: DEADLINE_CATEGORIES_INFO.antincendio_pronto_soccorso.title,
    title: "Verifica Presidi e Farmaci Cassetta Pronto Soccorso",
    normReference: "D.M. 388/2003, art. 2 e D.Lgs. 81/2008 art. 45",
    defaultValidityMonths: 6, // 6 mesi
    description: "Verifica semestrale della completezza e delle date di scadenza dei presidi sanitari della cassetta o pacchetto di medicazione.",
    matchers: {
      catalogIds: [],
      nameKeywords: ["cassetta pronto soccorso", "pacchetto di medicazione", "reintegro farmaci"],
    },
  },

  // --- ATTREZZATURE, MACCHINE & IMPIANTI ---
  MESSA_A_TERRA: {
    key: "MESSA_A_TERRA",
    category: "attrezzature",
    categoryLabel: DEADLINE_CATEGORIES_INFO.attrezzature.title,
    title: "Verifica Periodica Impianto Messa a Terra (D.P.R. 462/01)",
    normReference: "D.P.R. 462/2001, art. 4 e D.Lgs. 81/2008 art. 86",
    defaultValidityMonths: 60, // 5 anni ordinari, 2 anni per locali medici/cantieri/MARCIO
    resolveValidityMonths: (ctx) => {
      if (!ctx.atecoCode) return 60;
      const clean = ctx.atecoCode.replace(/[^0-9]/g, "");
      // Cantieri edili (41, 42, 43), Sanità/studi medici (86, 87), Ambienti a maggior rischio incendio
      if (
        clean.startsWith("41") ||
        clean.startsWith("42") ||
        clean.startsWith("43") ||
        clean.startsWith("86") ||
        clean.startsWith("87") ||
        ctx.isHighRisk
      ) {
        return 24; // 2 anni
      }
      return 60; // 5 anni
    },
    description: "Verifica biennale per locali medici, cantieri e luoghi a maggior rischio in caso d'incendio (MARCIO); quinquennale per tutti gli altri ambienti.",
    matchers: {
      catalogIds: ["base-messa-a-terra"],
      nameKeywords: ["messa a terra", "462/01", "d.p.r. 462", "scariche atmosferiche"],
    },
  },

  VERIFICA_INAIL_MACCHINE: {
    key: "VERIFICA_INAIL_MACCHINE",
    category: "attrezzature",
    categoryLabel: DEADLINE_CATEGORIES_INFO.attrezzature.title,
    title: "Verifica Periodica INAIL/ARPA Macchine e Sollevamento",
    normReference: "D.Lgs. 81/2008, art. 71 c. 11, All. VII e D.M. 11/04/2011",
    defaultValidityMonths: 12, // 1 anno o 2 anni a seconda dell'attrezzatura e vetustà
    description: "Verifica di sicurezza periodica annuale o biennale per apparecchi di sollevamento cose/persone e attrezzature a pressione.",
    matchers: {
      catalogIds: [],
      nameKeywords: ["inail macchine", "art. 71", "verifica sollevamento", "verifica periodica inail"],
    },
  },

  MANUTENZIONE_MACCHINE: {
    key: "MANUTENZIONE_MACCHINE",
    category: "attrezzature",
    categoryLabel: DEADLINE_CATEGORIES_INFO.attrezzature.title,
    title: "Manutenzione Programmata Macchine & Attrezzature",
    normReference: "D.Lgs. 81/2008, art. 71 c. 8",
    defaultValidityMonths: 12, // 1 anno
    description: "Manutenzione periodica e controllo di efficienza secondo il libretto d'uso e manutenzione del costruttore.",
    matchers: {
      catalogIds: [],
      nameKeywords: ["manutenzione macchin", "controllo attrezzatur"],
    },
  },

  // --- SICUREZZA SUL LAVORO D.LGS. 81/2008 ---
  DVR_GENERALE: {
    key: "DVR_GENERALE",
    category: "sicurezza",
    categoryLabel: DEADLINE_CATEGORIES_INFO.sicurezza.title,
    title: "DVR - Riesame Periodico Documento Valutazione Rischi",
    normReference: "D.Lgs. 81/2008, artt. 17, 28 e 29 c. 3",
    defaultValidityMonths: 36, // 3 anni di audit periodico
    description: "Riesame generale della valutazione dei rischi e rielaborazione programmata (art. 29 c. 3).",
    matchers: {
      catalogIds: ["sec-dvr"],
      nameKeywords: ["dvr", "documento di valutazione dei rischi", "valutazione dei rischi generale"],
    },
  },

  VDR_RUMORE: {
    key: "VDR_RUMORE",
    category: "sicurezza",
    categoryLabel: DEADLINE_CATEGORIES_INFO.sicurezza.title,
    title: "Valutazione Rischio Rumore (Relazione Fonometrica)",
    normReference: "D.Lgs. 81/2008, art. 181 c. 2 e art. 196",
    defaultValidityMonths: 48, // 4 anni
    description: "Aggiornamento quadriennale obbligatorio della valutazione del rischio rumore o prima se mutano le condizioni.",
    matchers: {
      catalogIds: ["sec-vdr-rumore"],
      nameKeywords: ["rumore", "fonometria", "relazione fonometrica", "vdr rumore"],
    },
  },

  VDR_VIBRAZIONI: {
    key: "VDR_VIBRAZIONI",
    category: "sicurezza",
    categoryLabel: DEADLINE_CATEGORIES_INFO.sicurezza.title,
    title: "Valutazione Rischio Vibrazioni Meccaniche (HAV / WBV)",
    normReference: "D.Lgs. 81/2008, art. 181 c. 2 e art. 202",
    defaultValidityMonths: 48, // 4 anni
    description: "Aggiornamento quadriennale della valutazione delle vibrazioni trasmesse al sistema mano-braccio o corpo intero.",
    matchers: {
      catalogIds: ["sec-vdr-vibrazioni"],
      nameKeywords: ["vibrazioni", "hav", "wbv", "vdr vibrazioni"],
    },
  },

  VDR_CEM: {
    key: "VDR_CEM",
    category: "sicurezza",
    categoryLabel: DEADLINE_CATEGORIES_INFO.sicurezza.title,
    title: "Valutazione Rischio Campi Elettromagnetici (CEM)",
    normReference: "D.Lgs. 81/2008, art. 181 c. 2 e art. 209",
    defaultValidityMonths: 48, // 4 anni
    description: "Aggiornamento quadriennale della valutazione dell'esposizione a campi elettromagnetici.",
    matchers: {
      catalogIds: [],
      nameKeywords: ["cem", "campi elettromagnetici", "elettromagnetico"],
    },
  },

  VDR_ROA: {
    key: "VDR_ROA",
    category: "sicurezza",
    categoryLabel: DEADLINE_CATEGORIES_INFO.sicurezza.title,
    title: "Valutazione Radiazioni Ottiche Artificiali (ROA)",
    normReference: "D.Lgs. 81/2008, art. 181 c. 2 e art. 216",
    defaultValidityMonths: 48, // 4 anni
    description: "Aggiornamento quadriennale della valutazione dell'esposizione a radiazioni ottiche artificiali (laser, saldatura, lampade).",
    matchers: {
      catalogIds: [],
      nameKeywords: ["roa", "radiazioni ottiche", "laser"],
    },
  },

  VDR_CHIMICO: {
    key: "VDR_CHIMICO",
    category: "sicurezza",
    categoryLabel: DEADLINE_CATEGORIES_INFO.sicurezza.title,
    title: "Valutazione Rischio Agenti Chimici Pericolosi",
    normReference: "D.Lgs. 81/2008, Titolo IX, art. 223 c. 7",
    defaultValidityMonths: 36, // 3 anni
    description: "Riesame triennale della valutazione del rischio chimico e aggiornamento del censimento schede di sicurezza SDS.",
    matchers: {
      catalogIds: ["sec-vdr-chimico"],
      nameKeywords: ["rischio chimico", "vdr chimico", "agenti chimici", "movarisch"],
    },
  },

  VDR_STRESS_LAVORO_CORRELATO: {
    key: "VDR_STRESS_LAVORO_CORRELATO",
    category: "sicurezza",
    categoryLabel: DEADLINE_CATEGORIES_INFO.sicurezza.title,
    title: "Valutazione Rischio Stress Lavoro-Correlato",
    normReference: "D.Lgs. 81/2008, art. 28 c. 1-bis e indicazioni Commissione Consultiva",
    defaultValidityMonths: 24, // 2 anni (o 3 anni per rischio basso)
    description: "Aggiornamento biennale della valutazione del rischio stress lavoro-correlato (metodo INAIL).",
    matchers: {
      catalogIds: [],
      nameKeywords: ["stress lavoro", "stress lavoro-correlato", "stress inail"],
    },
  },

  RIUNIONE_PERIODICA_SICUREZZA: {
    key: "RIUNIONE_PERIODICA_SICUREZZA",
    category: "sicurezza",
    categoryLabel: DEADLINE_CATEGORIES_INFO.sicurezza.title,
    title: "Riunione Periodica di Sicurezza (art. 35)",
    normReference: "D.Lgs. 81/2008, art. 35",
    defaultValidityMonths: 12, // 1 anno
    description: "Incontro annuale obbligatorio tra Datore di Lavoro, RSPP, Medico Competente e RLS per aziende con più di 15 dipendenti.",
    matchers: {
      catalogIds: ["sec-riunione-periodica"],
      nameKeywords: ["riunione periodica", "verbale art. 35"],
    },
  },

  MONITORAGGIO_AERODISPERSI: {
    key: "MONITORAGGIO_AERODISPERSI",
    category: "sicurezza",
    categoryLabel: DEADLINE_CATEGORIES_INFO.sicurezza.title,
    title: "Monitoraggio Aerodispersi Indoor & Polveri (UNI EN 689)",
    normReference: "D.Lgs. 81/2008 Titolo IX e Norma UNI EN 689:2019",
    defaultValidityMonths: 12, // 1 anno o 2 anni a seconda del rapporto espositivo
    description: "Campionamenti periodici dell'aria negli ambienti di lavoro per verifica del rispetto dei VLEP.",
    matchers: {
      catalogIds: ["sec-monitoraggio-aerodispersi"],
      nameKeywords: ["aerodispersi", "uni en 689", "polveri legno", "silice", "fumi saldatura"],
    },
  },

  // --- IGIENE ALIMENTARE HACCP & ACQUE ---
  HACCP_MANUALE_RIESAME: {
    key: "HACCP_MANUALE_RIESAME",
    category: "haccp_acque",
    categoryLabel: DEADLINE_CATEGORIES_INFO.haccp_acque.title,
    title: "Riesame Manuale Autocontrollo HACCP & Procedure",
    normReference: "Reg. CE 852/2004, All. II Cap. XII e D.G.R. regionali",
    defaultValidityMonths: 12, // 1 anno
    description: "Riesame e verifica annuale del piano di autocontrollo HACCP, diagrammi di flusso e limiti critici.",
    matchers: {
      catalogIds: ["haccp-manuale"],
      nameKeywords: ["manuale haccp", "manuale di autocontrollo", "piano haccp"],
    },
  },

  HACCP_TAMPONI_ANALISI: {
    key: "HACCP_TAMPONI_ANALISI",
    category: "haccp_acque",
    categoryLabel: DEADLINE_CATEGORIES_INFO.haccp_acque.title,
    title: "Rapporto di Prova Analisi Alimenti & Tamponi Superficie",
    normReference: "Reg. CE 2073/2005 e Reg. CE 852/2004",
    defaultValidityMonths: 12, // 1 anno (o semestrale da piano)
    description: "Campionamenti microbiologici ufficiali di alimenti e tamponi di superficie per verifica sanificazione.",
    matchers: {
      catalogIds: ["haccp-analisi-alimenti"],
      nameKeywords: ["tamponi", "analisi alimenti", "campionamento alimenti", "rapporto di prova alimenti"],
    },
  },

  ACQUE_POTABILITA: {
    key: "ACQUE_POTABILITA",
    category: "haccp_acque",
    categoryLabel: DEADLINE_CATEGORIES_INFO.haccp_acque.title,
    title: "Analisi di Potabilità Acque di Rete / Distribuzione Interna",
    normReference: "D.Lgs. 18/2023 (Direttiva UE 2020/2184)",
    defaultValidityMonths: 12, // 1 anno
    description: "Controllo analitico annuale della salubrità dell'acqua destinata al consumo umano al punto di erogazione.",
    matchers: {
      catalogIds: ["acque-rapporti-prova"],
      nameKeywords: ["potabilità", "analisi acque", "acqua potabile", "d.lgs. 18/2023"],
    },
  },

  ACQUE_LEGIONELLA: {
    key: "ACQUE_LEGIONELLA",
    category: "haccp_acque",
    categoryLabel: DEADLINE_CATEGORIES_INFO.haccp_acque.title,
    title: "Valutazione Rischio Legionella & Campionamento Impianto",
    normReference: "Linee Guida Nazionali Legionellosi 2015 e D.Lgs. 18/2023",
    defaultValidityMonths: 24, // 2 anni (1 anno per strutture sanitarie/ricettive)
    resolveValidityMonths: (ctx) => {
      if (!ctx.atecoCode) return 24;
      const clean = ctx.atecoCode.replace(/[^0-9]/g, "");
      if (clean.startsWith("55") || clean.startsWith("86") || clean.startsWith("87")) {
        return 12; // Hotel, cliniche, RSA -> annuale
      }
      return 24;
    },
    description: "Campionamento e valutazione del rischio Legionella pneumophila su accumuli e terminali idrici.",
    matchers: {
      catalogIds: ["acque-analisi-legionella", "acque-psa"],
      nameKeywords: ["legionella", "legionellosi", "water safety plan", "piano sicurezza acque"],
    },
  },

  EMISSIONI_ATMOSFERA: {
    key: "EMISSIONI_ATMOSFERA",
    category: "haccp_acque",
    categoryLabel: DEADLINE_CATEGORIES_INFO.haccp_acque.title,
    title: "Analisi Periodica Emissioni in Atmosfera ai Camini (A.U.A.)",
    normReference: "D.Lgs. 152/2006 Parte V e D.P.R. 59/2013",
    defaultValidityMonths: 12, // 1 anno o 2 anni a seconda dell'atto autorizzativo
    description: "Campionamento analitico fumi e conformità ai Valori Limite di Emissione (VLE).",
    matchers: {
      catalogIds: ["env-rapporto-fumi"],
      nameKeywords: ["emissioni in atmosfera", "analisi fumi", "camini", "cov"],
    },
  },

  SCARICHI_IDRICI: {
    key: "SCARICHI_IDRICI",
    category: "haccp_acque",
    categoryLabel: DEADLINE_CATEGORIES_INFO.haccp_acque.title,
    title: "Analisi Scarichi Acque Reflue Industriali / Prima Pioggia",
    normReference: "D.Lgs. 152/2006 Parte III e D.P.R. 59/2013",
    defaultValidityMonths: 12, // 1 anno
    description: "Campionamento analitico dello scarico idrico al pozzetto fiscale.",
    matchers: {
      catalogIds: ["env-rapporto-scarichi-idrici"],
      nameKeywords: ["scarichi idrici", "acque reflue", "disoleatore", "prima pioggia"],
    },
  },

  // --- FORMAZIONE & SORVEGLIANZA SANITARIA ---
  FORMAZIONE_PREPOSTI: {
    key: "FORMAZIONE_PREPOSTI",
    category: "formazione_sanitaria",
    categoryLabel: DEADLINE_CATEGORIES_INFO.formazione_sanitaria.title,
    title: "Aggiornamento Obbligatorio Preposti",
    normReference: "D.Lgs. 81/2008, art. 37 c. 7-ter mod. Legge 215/2021",
    defaultValidityMonths: 24, // 2 anni (biennale)
    description: "Aggiornamento periodico biennale obbligatorio per i preposti alla sicurezza introdotto dalla Legge 215/2021.",
    matchers: {
      catalogIds: [],
      nameKeywords: ["preposto", "aggiornamento preposti"],
    },
  },

  FORMAZIONE_LAVORATORI: {
    key: "FORMAZIONE_LAVORATORI",
    category: "formazione_sanitaria",
    categoryLabel: DEADLINE_CATEGORIES_INFO.formazione_sanitaria.title,
    title: "Aggiornamento Quinquennale Lavoratori",
    normReference: "D.Lgs. 81/2008 art. 37 e Accordo Stato-Regioni 21/12/2011",
    defaultValidityMonths: 60, // 5 anni
    description: "Aggiornamento quinquennale di 6 ore per tutti i lavoratori dipendenti ed equiparati.",
    matchers: {
      catalogIds: [],
      nameKeywords: ["formazione lavoratori", "aggiornamento lavoratori", "accordo stato-regioni 21/12/2011"],
    },
  },

  FORMAZIONE_RLS: {
    key: "FORMAZIONE_RLS",
    category: "formazione_sanitaria",
    categoryLabel: DEADLINE_CATEGORIES_INFO.formazione_sanitaria.title,
    title: "Aggiornamento Annuale RLS",
    normReference: "D.Lgs. 81/2008, art. 37 c. 11",
    defaultValidityMonths: 12, // 1 anno
    description: "Aggiornamento annuale obbligatorio di 4 ore (imprese da 15 a 50 dipendenti) o 8 ore (oltre 50 dipendenti).",
    matchers: {
      catalogIds: [],
      nameKeywords: ["rls", "rappresentante dei lavoratori", "aggiornamento rls"],
    },
  },

  FORMAZIONE_RSPP_DL: {
    key: "FORMAZIONE_RSPP_DL",
    category: "formazione_sanitaria",
    categoryLabel: DEADLINE_CATEGORIES_INFO.formazione_sanitaria.title,
    title: "Aggiornamento RSPP Datore di Lavoro",
    normReference: "D.Lgs. 81/2008 art. 34 e Accordo Stato-Regioni 21/12/2011",
    defaultValidityMonths: 60, // 5 anni
    description: "Aggiornamento quinquennale per il Datore di Lavoro che svolge direttamente i compiti di RSPP.",
    matchers: {
      catalogIds: [],
      nameKeywords: ["rspp datore di lavoro", "rspp dl", "aggiornamento rspp"],
    },
  },

  FORMAZIONE_PRIMO_SOCCORSO: {
    key: "FORMAZIONE_PRIMO_SOCCORSO",
    category: "formazione_sanitaria",
    categoryLabel: DEADLINE_CATEGORIES_INFO.formazione_sanitaria.title,
    title: "Aggiornamento Addetti Primo Soccorso",
    normReference: "D.M. 388/2003, art. 3 c. 5 e D.Lgs. 81/2008 art. 45",
    defaultValidityMonths: 36, // 3 anni
    description: "Aggiornamento triennale pratico di 4 o 6 ore per gli addetti designati al primo soccorso aziendale.",
    matchers: {
      catalogIds: [],
      nameKeywords: ["primo soccorso", "addetto primo soccorso", "d.m. 388"],
    },
  },

  FORMAZIONE_ANTINCENDIO: {
    key: "FORMAZIONE_ANTINCENDIO",
    category: "formazione_sanitaria",
    categoryLabel: DEADLINE_CATEGORIES_INFO.formazione_sanitaria.title,
    title: "Aggiornamento Addetti Antincendio",
    normReference: "D.M. 02/09/2021 e D.Lgs. 81/2008 art. 46",
    defaultValidityMonths: 60, // 5 anni (D.M. 02/09/2021 prevede almeno quinquennale)
    description: "Aggiornamento periodico per addetti antincendio livello 1, 2 o 3 (D.M. 02/09/2021).",
    matchers: {
      catalogIds: [],
      nameKeywords: ["antincendio", "addetto antincendio", "d.m. 02/09/2021"],
    },
  },

  FORMAZIONE_PATENTINO_ATTREZZATURE: {
    key: "FORMAZIONE_PATENTINO_ATTREZZATURE",
    category: "formazione_sanitaria",
    categoryLabel: DEADLINE_CATEGORIES_INFO.formazione_sanitaria.title,
    title: "Aggiornamento Abilitazione Attrezzature (Patentino)",
    normReference: "Accordo Stato-Regioni 22/02/2012 e D.Lgs. 81/2008 art. 73 c. 5",
    defaultValidityMonths: 60, // 5 anni
    description: "Aggiornamento quinquennale di 4 ore per conduttori di carrelli elevatori, gru, PLE, trattori.",
    matchers: {
      catalogIds: [],
      nameKeywords: ["carrell", "muletto", "ple", "piattaforma aerea", "patentino", "gru"],
    },
  },

  FORMAZIONE_HACCP_ALIMENTARISTI: {
    key: "FORMAZIONE_HACCP_ALIMENTARISTI",
    category: "formazione_sanitaria",
    categoryLabel: DEADLINE_CATEGORIES_INFO.formazione_sanitaria.title,
    title: "Aggiornamento Formazione Alimentaristi (HACCP)",
    normReference: "Reg. CE 852/2004 All. II Cap. XII e Leggi Regionali",
    defaultValidityMonths: 36, // 3 anni (variabile per regione: 2, 3 o 5 anni)
    description: "Aggiornamento periodico obbligatorio per personale che manipola alimenti (personale OSA).",
    matchers: {
      catalogIds: ["haccp-attestati-formazione"],
      nameKeywords: ["formazione alimentaristi", "attestato haccp", "corso haccp"],
    },
  },

  SORVEGLIANZA_SANITARIA_VISITA: {
    key: "SORVEGLIANZA_SANITARIA_VISITA",
    category: "formazione_sanitaria",
    categoryLabel: DEADLINE_CATEGORIES_INFO.formazione_sanitaria.title,
    title: "Visita Medica Periodica del Medico Competente",
    normReference: "D.Lgs. 81/2008, art. 41 c. 2 lett. b",
    defaultValidityMonths: 12, // 1 anno di norma
    description: "Visita medica periodica per sorveglianza sanitaria preventiva e periodica dei lavoratori esposti a rischio.",
    matchers: {
      catalogIds: ["sec-giudizi-idoneita"],
      nameKeywords: ["visita medica", "idoneità", "giudizio di idoneità", "sorveglianza sanitaria"],
    },
  },
};

/**
 * Cerca la regola normativa più pertinente per un documento, basandosi su templateId o testo.
 */
export function findMatchingDeadlineRule(
  identifierOrName: string,
  categoryHint?: string,
  context?: RuleResolutionContext,
): DeadlineRule | undefined {
  const lower = identifierOrName.toLowerCase().trim();

  // 1. Corrispondenza per catalogId esatto
  for (const rule of Object.values(DEADLINE_RULES)) {
    if (rule.matchers.catalogIds && rule.matchers.catalogIds.includes(lower)) {
      return rule;
    }
  }

  // 2. Corrispondenza per parole chiave nel nome
  for (const rule of Object.values(DEADLINE_RULES)) {
    if (
      rule.matchers.nameKeywords &&
      rule.matchers.nameKeywords.some((kw) => lower.includes(kw.toLowerCase()))
    ) {
      return rule;
    }
  }

  // 3. Fallback per categoria hint
  if (categoryHint) {
    if (categoryHint === "base_autorizzativa" && lower.includes("aua")) {
      return DEADLINE_RULES.AUA_AMBIENTALE;
    }
    if (categoryHint === "base_autorizzativa" && lower.includes("incendi")) {
      return DEADLINE_RULES.CPI_ANTINCENDIO;
    }
    if (categoryHint === "base_autorizzativa" && lower.includes("terra")) {
      return DEADLINE_RULES.MESSA_A_TERRA;
    }
    if (categoryHint === "sicurezza_81_08" && lower.includes("dvr")) {
      return DEADLINE_RULES.DVR_GENERALE;
    }
    if (categoryHint === "haccp_alimentare") {
      return DEADLINE_RULES.HACCP_MANUALE_RIESAME;
    }
    if (categoryHint === "acque_legionella") {
      return DEADLINE_RULES.ACQUE_LEGIONELLA;
    }
  }

  return undefined;
}

// ============================================================================
// 4. COMPUTEDEADLINERESULT
// ============================================================================

export interface ComputeDeadlineOptions {
  explicitExpiryDate?: string | null;
  issueDate?: string | null;
  validityMonths?: number | null;
  fallbackInspectionDate?: string | null;
  referenceDate?: string | Date;
}

export interface DeadlineComputationResult {
  deadlineDate: string | null;
  issueDate: string | null;
  daysRemaining: number | null;
  urgency: DeadlineUrgency;
  calculationMethod: CalculationMethod;
}

/**
 * Calcola la data di scadenza e il livello di urgenza secondo l'ordine di precedenza:
 * 1. explicitExpiryDate >
 * 2. issueDate + validityMonths >
 * 3. fallbackInspectionDate + validityMonths >
 * 4. unscheduled (to_schedule)
 *
 * Calcola i giorni rimanenti rispetto alla data odierna (o referenceDate).
 * Soglie di urgenza:
 * - "expired": < 0 giorni
 * - "critical": 0 - 30 giorni
 * - "warning": 31 - 90 giorni
 * - "ok": > 90 giorni
 * - "to_schedule": nessuna data determinabile
 */
export function computeDeadlineResult(options: ComputeDeadlineOptions): DeadlineComputationResult {
  const todayYmd =
    (options.referenceDate ? normalizeDateToYmd(options.referenceDate) : null) ||
    perCampoData(new Date());

  const normExplicit = normalizeDateToYmd(options.explicitExpiryDate);
  const normIssue = normalizeDateToYmd(options.issueDate);
  const normFallback = normalizeDateToYmd(options.fallbackInspectionDate);
  const validity =
    typeof options.validityMonths === "number" && options.validityMonths > 0
      ? options.validityMonths
      : null;

  let deadlineDate: string | null = null;
  let calculationMethod: CalculationMethod = "unscheduled";
  let resolvedIssueDate: string | null = normIssue;

  if (normExplicit) {
    deadlineDate = normExplicit;
    calculationMethod = "explicit";
  } else if (normIssue && validity) {
    deadlineDate = addMonthsToYmd(normIssue, validity);
    calculationMethod = "calculated_from_issue";
  } else if (normFallback && validity) {
    deadlineDate = addMonthsToYmd(normFallback, validity);
    calculationMethod = "calculated_from_inspection";
    if (!resolvedIssueDate) {
      resolvedIssueDate = normFallback;
    }
  } else {
    deadlineDate = null;
    calculationMethod = "unscheduled";
  }

  if (!deadlineDate) {
    return {
      deadlineDate: null,
      issueDate: resolvedIssueDate,
      daysRemaining: null,
      urgency: "to_schedule",
      calculationMethod: "unscheduled",
    };
  }

  const daysRemaining = diffCalendarDays(deadlineDate, todayYmd);
  let urgency: DeadlineUrgency;

  if (daysRemaining < 0) {
    urgency = "expired";
  } else if (daysRemaining <= 30) {
    urgency = "critical";
  } else if (daysRemaining <= 90) {
    urgency = "warning";
  } else {
    urgency = "ok";
  }

  return {
    deadlineDate,
    issueDate: resolvedIssueDate,
    daysRemaining,
    urgency,
    calculationMethod,
  };
}

// ============================================================================
// 5. AGGREGAZIONE GLOBALE DELLE SCADENZE (aggregateAllDeadlines)
// ============================================================================

export interface CompanyInfoLike {
  id: string;
  name: string;
  atecoCode?: string | null;
}

export interface InspectionDocumentLike {
  id?: string;
  documentTemplateId?: string | null;
  name: string;
  status?: string;
  note?: string | null;
  isRequired?: boolean;
}

export interface InspectionLike {
  id: string;
  title?: string;
  happenedAt?: string | null;
  status?: string;
  checklistMode?: string;
  companyId?: string;
  company?: {
    id?: string;
    name?: string;
    atecoCode?: string | null;
  } | null;
  documents?: InspectionDocumentLike[] | null;
}

export interface MachineLike {
  id: string;
  companyId: string;
  name: string;
  type: string;
  model?: string | null;
  serialNumber?: string | null;
  manufacturer?: string | null;
  location?: string | null;
  riskLevel?: string | null;
  status?: string;
  lastMaintenanceAt?: string | null;
  nextMaintenanceAt?: string | null;
  lastSafetyCheckAt?: string | null;
  nextSafetyCheckAt?: string | null;
  note?: string | null;
}

export interface EquipmentLike {
  id: string;
  companyId: string;
  name: string;
  type: string;
  model?: string | null;
  serialNumber?: string | null;
  location?: string | null;
  status?: string;
  lastCheckAt?: string | null;
  nextCheckAt?: string | null;
  note?: string | null;
}

export interface FireExtinguisherLike {
  id: string;
  companyId: string;
  code: string;
  type: string;
  location: string;
  capacity?: string | null;
  manufactureDate?: string | null;
  lastCheckAt?: string | null;
  nextCheckAt?: string | null;
  lastRechargeAt?: string | null;
  status?: string;
  note?: string | null;
}

export interface FirstAidKitLike {
  id: string;
  companyId: string;
  location: string;
  contents?: string | null;
  lastCheckAt?: string | null;
  nextCheckAt?: string | null;
  replenishedAt?: string | null;
  status?: string;
  note?: string | null;
}

export interface TrainingRecordLike {
  id: string;
  course: {
    id?: string;
    name: string;
    minHours?: number;
    frequencyYears: number;
    normReference?: string;
  };
  completedAt?: string | null;
  expiresAt?: string | null;
  hoursDone?: number | null;
  certificateNumber?: string | null;
  note?: string | null;
}

export interface EmployeeLike {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  fiscalCode?: string | null;
  role?: string | null;
  department?: string | null;
  isActive: boolean;
  trainingRecords?: TrainingRecordLike[] | null;
}

export interface TrainingCourseLike {
  id: string;
  name: string;
  description?: string | null;
  targetAudience?: string;
  minHours?: number;
  frequencyYears: number;
  normReference: string;
  domain?: "safety" | "haccp" | "both" | null;
}

export interface AggregateDeadlinesInput {
  company?: CompanyInfoLike | null;
  companies?: CompanyInfoLike[];
  inspections?: InspectionLike[];
  machines?: MachineLike[];
  equipment?: EquipmentLike[];
  fireExtinguishers?: FireExtinguisherLike[];
  firstAidKits?: FirstAidKitLike[];
  employees?: EmployeeLike[];
  trainingCourses?: TrainingCourseLike[];
  referenceDate?: string | Date;
}

/**
 * Funzione ausiliaria interna per mappare la categoria di catalogo alla categoria di scadenza.
 */
function mapCatalogCategoryToDeadlineCategory(catKey?: string): DeadlineCategory {
  if (catKey === "base_autorizzativa") return "autorizzazioni";
  if (catKey === "sicurezza_81_08") return "sicurezza";
  if (catKey === "haccp_alimentare" || catKey === "acque_legionella" || catKey === "matrici_ambientali")
    return "haccp_acque";
  return "sicurezza";
}

/**
 * Aggrega tutte le scadenze legali ed operative da tutte le sorgenti informative:
 * - Documenti dei sopralluoghi
 * - Macchine (manutenzioni e verifiche INAIL)
 * - Attrezzature di lavoro
 * - Estintori (controllo semestrale, revisioni e collaudi)
 * - Cassette e pacchetti di primo soccorso
 * - Dipendenti e corsi di formazione
 */
export function aggregateAllDeadlines(input: AggregateDeadlinesInput): AggregatedDeadline[] {
  const result: AggregatedDeadline[] = [];
  const referenceDate = input.referenceDate || perCampoData(new Date());

  // Mappa delle aziende per arricchire i dati
  const companyMap = new Map<string, CompanyInfoLike>();
  if (input.company) {
    companyMap.set(input.company.id, input.company);
  }
  if (input.companies) {
    for (const c of input.companies) {
      companyMap.set(c.id, c);
    }
  }
  if (input.inspections) {
    for (const insp of input.inspections) {
      if (insp.companyId && insp.company?.name && !companyMap.has(insp.companyId)) {
        companyMap.set(insp.companyId, {
          id: insp.companyId,
          name: insp.company.name,
          atecoCode: insp.company.atecoCode,
        });
      }
    }
  }

  function resolveCompany(companyId?: string): { id: string; name: string; atecoCode?: string } {
    if (companyId && companyMap.has(companyId)) {
      const c = companyMap.get(companyId)!;
      return { id: c.id, name: c.name, atecoCode: c.atecoCode ?? undefined };
    }
    if (input.company) {
      return {
        id: input.company.id,
        name: input.company.name,
        atecoCode: input.company.atecoCode ?? undefined,
      };
    }
    return { id: companyId || "default", name: "Azienda", atecoCode: undefined };
  }

  // --------------------------------------------------------------------------
  // a) INSPECTIONS & RELATIVI INSPECTION DOCUMENTS
  // --------------------------------------------------------------------------
  if (input.inspections) {
    for (const insp of input.inspections) {
      const comp = resolveCompany(insp.companyId);
      const docs = insp.documents || [];
      const fallbackInspectionDate = insp.happenedAt || undefined;

      for (const doc of docs) {
        // Se non applicabile, non c'è una scadenza da monitorare
        if (doc.status === "not_applicable") continue;

        const extraMeta: DocumentExtraMeta = parseDocumentExtraMeta(doc.note);
        const catalogDef = findCatalogDefinition(doc.name);

        const ruleContext: RuleResolutionContext = {
          atecoCode: comp.atecoCode,
          notes: extraMeta.noteText,
        };

        const rule = findMatchingDeadlineRule(
          doc.documentTemplateId || doc.name,
          catalogDef?.category,
          ruleContext,
        );

        let validityMonths: number | null = null;
        let category: DeadlineCategory = "sicurezza";
        let normReference = catalogDef?.normReference || "D.Lgs. 81/2008";

        if (rule) {
          category = rule.category;
          normReference = rule.normReference;
          validityMonths = rule.resolveValidityMonths
            ? rule.resolveValidityMonths(ruleContext)
            : rule.defaultValidityMonths;
        } else if (catalogDef) {
          category = mapCatalogCategoryToDeadlineCategory(catalogDef.category);
          // Default prudenziali se non mappato da una regola specifica
          if (catalogDef.category === "haccp_alimentare") validityMonths = 12;
          else if (catalogDef.category === "acque_legionella") validityMonths = 24;
          else if (catalogDef.category === "base_autorizzativa") validityMonths = 60;
          else validityMonths = 36;
        }

        const compResult = computeDeadlineResult({
          explicitExpiryDate: extraMeta.expiryDate,
          issueDate: extraMeta.issueDate,
          validityMonths,
          fallbackInspectionDate,
          referenceDate,
        });

        // Se non è richiesta e non ha date definite, possiamo tralasciare o mostrare come to_schedule
        const docIdClean = (doc.documentTemplateId || doc.name).replace(/[^a-zA-Z0-9_-]/g, "_");
        const deadlineId = `doc-${insp.id}-${docIdClean}`;

        result.push({
          id: deadlineId,
          companyId: comp.id,
          companyName: comp.name,
          companyAteco: comp.atecoCode,
          category,
          categoryLabel: DEADLINE_CATEGORIES_INFO[category].title,
          title: doc.name,
          subTitle: insp.title ? `Sopralluogo: ${insp.title}` : "Documento di conformità",
          identifier: doc.documentTemplateId || doc.name,
          normReference,
          issueDate: compResult.issueDate,
          deadlineDate: compResult.deadlineDate,
          daysRemaining: compResult.daysRemaining,
          urgency: compResult.urgency,
          calculationMethod: compResult.calculationMethod,
          sourceEntity: "inspection_document",
          sourceId: `${insp.id}:${doc.name}`,
          note: extraMeta.noteText || doc.note || undefined,
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // b) MACHINES (Manutenzioni & Verifiche di Sicurezza INAIL)
  // --------------------------------------------------------------------------
  if (input.machines) {
    for (const machine of input.machines) {
      if (machine.status === "decommissioned") continue;
      const comp = resolveCompany(machine.companyId);

      const subTitleDesc = [
        machine.type,
        machine.model ? `Mod. ${machine.model}` : null,
        machine.serialNumber ? `Matr. ${machine.serialNumber}` : null,
        machine.location ? `Loc. ${machine.location}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      // 1. Manutenzione ordinaria / programmata (art. 71 c. 8)
      const maintResult = computeDeadlineResult({
        explicitExpiryDate: machine.nextMaintenanceAt,
        issueDate: machine.lastMaintenanceAt,
        validityMonths: 12, // 1 anno standard
        referenceDate,
      });

      result.push({
        id: `machine-maint-${machine.id}`,
        companyId: comp.id,
        companyName: comp.name,
        companyAteco: comp.atecoCode,
        category: "attrezzature",
        categoryLabel: DEADLINE_CATEGORIES_INFO.attrezzature.title,
        title: `Manutenzione: ${machine.name}`,
        subTitle: subTitleDesc || "Manutenzione periodica macchinario",
        identifier: machine.serialNumber || machine.name,
        normReference: "D.Lgs. 81/2008, art. 71 c. 8",
        issueDate: maintResult.issueDate,
        deadlineDate: maintResult.deadlineDate,
        daysRemaining: maintResult.daysRemaining,
        urgency: maintResult.urgency,
        calculationMethod: maintResult.calculationMethod,
        sourceEntity: "machine",
        sourceId: machine.id,
        note: machine.note || undefined,
      });

      // 2. Verifica di sicurezza / INAIL (art. 71 c. 11 e All. VII)
      if (
        machine.nextSafetyCheckAt ||
        machine.lastSafetyCheckAt ||
        machine.riskLevel ||
        machine.type.toLowerCase().includes("sollev") ||
        machine.type.toLowerCase().includes("carrell") ||
        machine.type.toLowerCase().includes("gru")
      ) {
        const safetyResult = computeDeadlineResult({
          explicitExpiryDate: machine.nextSafetyCheckAt,
          issueDate: machine.lastSafetyCheckAt,
          validityMonths: 12, // 1 anno per sollevamento
          referenceDate,
        });

        result.push({
          id: `machine-safety-${machine.id}`,
          companyId: comp.id,
          companyName: comp.name,
          companyAteco: comp.atecoCode,
          category: "attrezzature",
          categoryLabel: DEADLINE_CATEGORIES_INFO.attrezzature.title,
          title: `Verifica Sicurezza / INAIL: ${machine.name}`,
          subTitle: `Verifica periodica art. 71 c. 11${machine.manufacturer ? ` | Costruttore: ${machine.manufacturer}` : ""}`,
          identifier: machine.serialNumber || machine.name,
          normReference: "D.Lgs. 81/2008, art. 71 c. 11 e D.M. 11/04/2011",
          issueDate: safetyResult.issueDate,
          deadlineDate: safetyResult.deadlineDate,
          daysRemaining: safetyResult.daysRemaining,
          urgency: safetyResult.urgency,
          calculationMethod: safetyResult.calculationMethod,
          sourceEntity: "machine",
          sourceId: machine.id,
          note: machine.note || undefined,
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // c) EQUIPMENT (Attrezzature generiche)
  // --------------------------------------------------------------------------
  if (input.equipment) {
    for (const eq of input.equipment) {
      if (eq.status === "decommissioned") continue;
      const comp = resolveCompany(eq.companyId);

      const subTitleDesc = [
        eq.type,
        eq.model ? `Mod. ${eq.model}` : null,
        eq.serialNumber ? `Matr. ${eq.serialNumber}` : null,
        eq.location ? `Loc. ${eq.location}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      const checkResult = computeDeadlineResult({
        explicitExpiryDate: eq.nextCheckAt,
        issueDate: eq.lastCheckAt,
        validityMonths: 12, // 1 anno standard
        referenceDate,
      });

      result.push({
        id: `equipment-check-${eq.id}`,
        companyId: comp.id,
        companyName: comp.name,
        companyAteco: comp.atecoCode,
        category: "attrezzature",
        categoryLabel: DEADLINE_CATEGORIES_INFO.attrezzature.title,
        title: `Controllo Attrezzatura: ${eq.name}`,
        subTitle: subTitleDesc || "Verifica periodica attrezzatura",
        identifier: eq.serialNumber || eq.name,
        normReference: "D.Lgs. 81/2008, art. 71 c. 8",
        issueDate: checkResult.issueDate,
        deadlineDate: checkResult.deadlineDate,
        daysRemaining: checkResult.daysRemaining,
        urgency: checkResult.urgency,
        calculationMethod: checkResult.calculationMethod,
        sourceEntity: "equipment",
        sourceId: eq.id,
        note: eq.note || undefined,
      });
    }
  }

  // --------------------------------------------------------------------------
  // d) FIRE EXTINGUISHERS (Controllo semestrale, revisioni e collaudi)
  // --------------------------------------------------------------------------
  if (input.fireExtinguishers) {
    for (const ext of input.fireExtinguishers) {
      if (ext.status === "decommissioned") continue;
      const comp = resolveCompany(ext.companyId);
      const isCo2 = ext.type.toLowerCase().includes("co2") || ext.type.toLowerCase().includes("anidride");
      const isPolvere = ext.type.toLowerCase().includes("polvere");

      // 1. Controllo periodico semestrale (6 mesi)
      const semestraleResult = computeDeadlineResult({
        explicitExpiryDate: ext.nextCheckAt,
        issueDate: ext.lastCheckAt,
        validityMonths: 6, // 6 mesi
        referenceDate,
      });

      result.push({
        id: `extinguisher-check-${ext.id}`,
        companyId: comp.id,
        companyName: comp.name,
        companyAteco: comp.atecoCode,
        category: "antincendio_pronto_soccorso",
        categoryLabel: DEADLINE_CATEGORIES_INFO.antincendio_pronto_soccorso.title,
        title: `Controllo Semestrale Estintore ${ext.code}`,
        subTitle: `${ext.type}${ext.capacity ? ` (${ext.capacity})` : ""} | Posizione: ${ext.location}`,
        identifier: ext.code,
        normReference: "UNI 9994-1:2013 p. 4.4 e D.M. 01/09/2021",
        issueDate: semestraleResult.issueDate,
        deadlineDate: semestraleResult.deadlineDate,
        daysRemaining: semestraleResult.daysRemaining,
        urgency: semestraleResult.urgency,
        calculationMethod: semestraleResult.calculationMethod,
        sourceEntity: "fire_extinguisher",
        sourceId: ext.id,
        note: ext.note || undefined,
      });

      // 2. Revisione programmata (UNI 9994-1:2013 p. 4.5):
      //    Polvere: 36 mesi | CO2: 60 mesi | Schiuma/Idrico: 24-48 mesi (default 36 mesi)
      const revisionMonths = isCo2 ? 60 : isPolvere ? 36 : 48;
      const revisionIssueDate = ext.lastRechargeAt || ext.manufactureDate || ext.lastCheckAt;

      const revisionResult = computeDeadlineResult({
        issueDate: revisionIssueDate,
        validityMonths: revisionMonths,
        referenceDate,
      });

      result.push({
        id: `extinguisher-rev-${ext.id}`,
        companyId: comp.id,
        companyName: comp.name,
        companyAteco: comp.atecoCode,
        category: "antincendio_pronto_soccorso",
        categoryLabel: DEADLINE_CATEGORIES_INFO.antincendio_pronto_soccorso.title,
        title: `Revisione Programmata Estintore ${ext.code}`,
        subTitle: `Revisione periodica ${revisionMonths} mesi (${ext.type}) | Ubicazione: ${ext.location}`,
        identifier: ext.code,
        normReference: "UNI 9994-1:2013 p. 4.5",
        issueDate: revisionResult.issueDate,
        deadlineDate: revisionResult.deadlineDate,
        daysRemaining: revisionResult.daysRemaining,
        urgency: revisionResult.urgency,
        calculationMethod: revisionResult.calculationMethod,
        sourceEntity: "fire_extinguisher",
        sourceId: ext.id,
        note: ext.note || undefined,
      });

      // 3. Collaudo periodico (UNI 9994-1:2013 p. 4.6):
      //    CO2: 120 mesi (10 anni) | Altri (serbatoi acciaio carbonio PED): 144 mesi (12 anni)
      if (ext.manufactureDate) {
        const collaudoMonths = isCo2 ? 120 : 144;
        const collaudoResult = computeDeadlineResult({
          issueDate: ext.manufactureDate,
          validityMonths: collaudoMonths,
          referenceDate,
        });

        result.push({
          id: `extinguisher-collaudo-${ext.id}`,
          companyId: comp.id,
          companyName: comp.name,
          companyAteco: comp.atecoCode,
          category: "antincendio_pronto_soccorso",
          categoryLabel: DEADLINE_CATEGORIES_INFO.antincendio_pronto_soccorso.title,
          title: `Collaudo Serbatoio Estintore ${ext.code}`,
          subTitle: `Collaudo ${collaudoMonths / 12} anni (${ext.type}) | Costruzione: ${ext.manufactureDate}`,
          identifier: ext.code,
          normReference: "UNI 9994-1:2013 p. 4.6 e D.Lgs. 93/2000",
          issueDate: collaudoResult.issueDate,
          deadlineDate: collaudoResult.deadlineDate,
          daysRemaining: collaudoResult.daysRemaining,
          urgency: collaudoResult.urgency,
          calculationMethod: collaudoResult.calculationMethod,
          sourceEntity: "fire_extinguisher",
          sourceId: ext.id,
          note: ext.note || undefined,
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // e) FIRST AID KITS (Cassette e pacchetti medicazione)
  // --------------------------------------------------------------------------
  if (input.firstAidKits) {
    for (const kit of input.firstAidKits) {
      if (kit.status === "decommissioned") continue;
      const comp = resolveCompany(kit.companyId);

      const checkResult = computeDeadlineResult({
        explicitExpiryDate: kit.nextCheckAt,
        issueDate: kit.lastCheckAt || kit.replenishedAt,
        validityMonths: 6, // 6 mesi standard di controllo presidi e scadenza farmaci
        referenceDate,
      });

      result.push({
        id: `firstaid-check-${kit.id}`,
        companyId: comp.id,
        companyName: comp.name,
        companyAteco: comp.atecoCode,
        category: "antincendio_pronto_soccorso",
        categoryLabel: DEADLINE_CATEGORIES_INFO.antincendio_pronto_soccorso.title,
        title: `Controllo Presidi Cassetta PS: ${kit.location}`,
        subTitle: kit.contents ? `Contenuto: ${kit.contents}` : "Verifica semestrale scadenza farmaci",
        identifier: kit.location,
        normReference: "D.M. 388/2003, art. 2 e D.Lgs. 81/2008 art. 45",
        issueDate: checkResult.issueDate,
        deadlineDate: checkResult.deadlineDate,
        daysRemaining: checkResult.daysRemaining,
        urgency: checkResult.urgency,
        calculationMethod: checkResult.calculationMethod,
        sourceEntity: "first_aid_kit",
        sourceId: kit.id,
        note: kit.note || undefined,
      });
    }
  }

  // --------------------------------------------------------------------------
  // f) EMPLOYEES & TRAINING RECORDS (Formazione e scadenze attestati)
  // --------------------------------------------------------------------------
  if (input.employees) {
    for (const emp of input.employees) {
      if (emp.isActive === false) continue;
      const comp = resolveCompany(emp.companyId);
      const records = emp.trainingRecords || [];

      for (const rec of records) {
        const validityMonths =
          rec.course && rec.course.frequencyYears > 0 ? rec.course.frequencyYears * 12 : 60;

        const trainingResult = computeDeadlineResult({
          explicitExpiryDate: rec.expiresAt,
          issueDate: rec.completedAt,
          validityMonths,
          referenceDate,
        });

        // Risolvi la norma specifica per il corso se possibile
        const rule = findMatchingDeadlineRule(rec.course.name);
        const normReference =
          rec.course.normReference ||
          rule?.normReference ||
          "D.Lgs. 81/2008 art. 37 e Accordi Stato-Regioni";

        const empFullName = `${emp.lastName} ${emp.firstName}`.trim();
        const roleDesc = emp.role ? ` (${emp.role})` : "";

        result.push({
          id: `training-${emp.id}-${rec.id}`,
          companyId: comp.id,
          companyName: comp.name,
          companyAteco: comp.atecoCode,
          category: "formazione_sanitaria",
          categoryLabel: DEADLINE_CATEGORIES_INFO.formazione_sanitaria.title,
          title: `Aggiornamento: ${rec.course.name}`,
          subTitle: `Dipendente: ${empFullName}${roleDesc}`,
          identifier: rec.certificateNumber ? `Attestato n. ${rec.certificateNumber}` : empFullName,
          normReference,
          issueDate: trainingResult.issueDate,
          deadlineDate: trainingResult.deadlineDate,
          daysRemaining: trainingResult.daysRemaining,
          urgency: trainingResult.urgency,
          calculationMethod: trainingResult.calculationMethod,
          sourceEntity: "training_record",
          sourceId: rec.id,
          note: rec.note || undefined,
        });
      }
    }
  }

  return result;
}

// ============================================================================
// 6. FUNZIONI DI UTILITÀ PER FILTRAGGIO, ORDINAMENTO E STATISTICHE UI
// ============================================================================

export interface DeadlinesFilterOptions {
  companyId?: string;
  category?: DeadlineCategory | "all";
  urgency?: DeadlineUrgency | "all";
  searchQuery?: string;
  maxDaysRemaining?: number;
  sourceEntity?: DeadlineSourceEntity | "all";
}

/**
 * Filtra una lista di scadenze aggregate in base a criteri multipli.
 */
export function filterDeadlines(
  deadlines: AggregatedDeadline[],
  filters: DeadlinesFilterOptions,
): AggregatedDeadline[] {
  return deadlines.filter((d) => {
    if (filters.companyId && d.companyId !== filters.companyId) {
      return false;
    }
    if (filters.category && filters.category !== "all" && d.category !== filters.category) {
      return false;
    }
    if (filters.urgency && filters.urgency !== "all" && d.urgency !== filters.urgency) {
      return false;
    }
    if (filters.sourceEntity && filters.sourceEntity !== "all" && d.sourceEntity !== filters.sourceEntity) {
      return false;
    }
    if (typeof filters.maxDaysRemaining === "number") {
      if (d.daysRemaining === null || d.daysRemaining === undefined) return false;
      if (d.daysRemaining > filters.maxDaysRemaining) return false;
    }
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      const match =
        d.title.toLowerCase().includes(q) ||
        (d.subTitle && d.subTitle.toLowerCase().includes(q)) ||
        (d.identifier && d.identifier.toLowerCase().includes(q)) ||
        (d.companyName && d.companyName.toLowerCase().includes(q)) ||
        (d.normReference && d.normReference.toLowerCase().includes(q)) ||
        (d.note && d.note.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

export type DeadlinesSortBy = "urgency" | "deadlineDate" | "company" | "category" | "title";
export type SortDirection = "asc" | "desc";

const URGENCY_PRIORITY_ORDER: Record<DeadlineUrgency, number> = {
  expired: 0,
  critical: 1,
  warning: 2,
  ok: 3,
  to_schedule: 4,
};

/**
 * Ordina una lista di scadenze aggregate.
 */
export function sortDeadlines(
  deadlines: AggregatedDeadline[],
  sortBy: DeadlinesSortBy = "urgency",
  direction: SortDirection = "asc",
): AggregatedDeadline[] {
  const dir = direction === "desc" ? -1 : 1;
  return [...deadlines].sort((a, b) => {
    if (sortBy === "urgency") {
      const pA = URGENCY_PRIORITY_ORDER[a.urgency];
      const pB = URGENCY_PRIORITY_ORDER[b.urgency];
      if (pA !== pB) return (pA - pB) * dir;
      // Parità: ordina per giorni rimanenti
      const daysA = a.daysRemaining ?? 999999;
      const daysB = b.daysRemaining ?? 999999;
      return (daysA - daysB) * dir;
    }

    if (sortBy === "deadlineDate") {
      if (!a.deadlineDate && !b.deadlineDate) return 0;
      if (!a.deadlineDate) return 1 * dir;
      if (!b.deadlineDate) return -1 * dir;
      return a.deadlineDate.localeCompare(b.deadlineDate) * dir;
    }

    if (sortBy === "company") {
      return a.companyName.localeCompare(b.companyName) * dir;
    }

    if (sortBy === "category") {
      return a.category.localeCompare(b.category) * dir;
    }

    if (sortBy === "title") {
      return a.title.localeCompare(b.title) * dir;
    }

    return 0;
  });
}

export interface DeadlinesSummary {
  total: number;
  expired: number;
  critical: number;
  warning: number;
  ok: number;
  toSchedule: number;
  upcoming30Days: number;
  upcoming90Days: number;
}

/**
 * Calcola statistiche di sintesi sulle scadenze aggregate per cruscotti e widget.
 */
export function getDeadlinesSummary(deadlines: AggregatedDeadline[]): DeadlinesSummary {
  let expired = 0;
  let critical = 0;
  let warning = 0;
  let ok = 0;
  let toSchedule = 0;
  let upcoming30Days = 0;
  let upcoming90Days = 0;

  for (const d of deadlines) {
    if (d.urgency === "expired") expired++;
    else if (d.urgency === "critical") {
      critical++;
      upcoming30Days++;
      upcoming90Days++;
    } else if (d.urgency === "warning") {
      warning++;
      upcoming90Days++;
    } else if (d.urgency === "ok") {
      ok++;
    } else if (d.urgency === "to_schedule") {
      toSchedule++;
    }
  }

  return {
    total: deadlines.length,
    expired,
    critical,
    warning,
    ok,
    toSchedule,
    upcoming30Days,
    upcoming90Days,
  };
}

/**
 * Restituisce colori e stili per l'urgenza da applicare nei componenti React.
 */
export function getUrgencyBadgeColor(urgency: DeadlineUrgency): {
  color: string;
  background: string;
  borderColor: string;
} {
  switch (urgency) {
    case "expired":
      return {
        color: "#b91c1c",
        background: "#fee2e2",
        borderColor: "#f87171",
      };
    case "critical":
      return {
        color: "#c2410c",
        background: "#ffedd5",
        borderColor: "#fb923c",
      };
    case "warning":
      return {
        color: "#854d0e",
        background: "#fef9c3",
        borderColor: "#facc15",
      };
    case "ok":
      return {
        color: "#15803d",
        background: "#dcfce7",
        borderColor: "#86efac",
      };
    case "to_schedule":
    default:
      return {
        color: "#475569",
        background: "#f1f5f9",
        borderColor: "#cbd5e1",
      };
  }
}

/**
 * Restituisce l'etichetta leggibile per l'utente/consulente.
 */
export function getUrgencyLabel(urgency: DeadlineUrgency, daysRemaining?: number | null): string {
  switch (urgency) {
    case "expired":
      return typeof daysRemaining === "number"
        ? `SCADUTO da ${Math.abs(daysRemaining)} gg`
        : "SCADUTO";
    case "critical":
      return typeof daysRemaining === "number"
        ? `CRITICO (${daysRemaining} gg)`
        : "CRITICO (<=30 gg)";
    case "warning":
      return typeof daysRemaining === "number"
        ? `IN SCADENZA (${daysRemaining} gg)`
        : "IN SCADENZA (31-90 gg)";
    case "ok":
      return typeof daysRemaining === "number"
        ? `REGOLARE (${daysRemaining} gg)`
        : "REGOLARE (>90 gg)";
    case "to_schedule":
    default:
      return "DA PROGRAMMARE";
  }
}
