/**
 * deadlinesEngine.test.ts
 * Test unitari completi per il motore delle scadenze normative.
 */

import {
  normalizeDateToYmd,
  addMonthsToYmd,
  diffCalendarDays,
  computeDeadlineResult,
  DEADLINE_RULES,
  findMatchingDeadlineRule,
  aggregateAllDeadlines,
  filterDeadlines,
  sortDeadlines,
  getDeadlinesSummary,
  getUrgencyBadgeColor,
  getUrgencyLabel,
} from "./deadlinesEngine";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("=== INIZIO TEST deadlinesEngine ===");

// 1. Test normalizzazione date
console.log("Test 1: normalizeDateToYmd");
assert(normalizeDateToYmd("2026-10-08T18:00:00Z") === "2026-10-08", "ISO string");
assert(normalizeDateToYmd("2026-10-08") === "2026-10-08", "YYYY-MM-DD");
assert(normalizeDateToYmd("15/05/2025") === "2025-05-15", "DD/MM/YYYY");
assert(normalizeDateToYmd("01-01-2024") === "2024-01-01", "DD-MM-YYYY");
assert(normalizeDateToYmd(new Date("2026-06-15T00:00:00Z")) === "2026-06-15", "Date object");
assert(normalizeDateToYmd(null) === null, "null");
assert(normalizeDateToYmd("") === null, "empty string");

// 2. Test calcolo mesi e bisestili
console.log("Test 2: addMonthsToYmd");
assert(addMonthsToYmd("2024-01-31", 1) === "2024-02-29", "Bisestile 2024: 31 gen + 1 mese = 29 feb");
assert(addMonthsToYmd("2023-01-31", 1) === "2023-02-28", "Non bisestile 2023: 31 gen + 1 mese = 28 feb");
assert(addMonthsToYmd("2026-01-15", 6) === "2026-07-15", "6 mesi");
assert(addMonthsToYmd("2026-01-15", 12) === "2027-01-15", "1 anno (12 mesi)");
assert(addMonthsToYmd("2026-01-15", 60) === "2031-01-15", "5 anni (60 mesi)");
assert(addMonthsToYmd("2026-01-15", 180) === "2041-01-15", "15 anni AUA (180 mesi)");

// 3. Test differenza in giorni di calendario
console.log("Test 3: diffCalendarDays");
assert(diffCalendarDays("2026-10-08", "2026-10-08") === 0, "Stesso giorno = 0");
assert(diffCalendarDays("2026-10-09", "2026-10-08") === 1, "Domani = +1");
assert(diffCalendarDays("2026-10-07", "2026-10-08") === -1, "Ieri = -1");
assert(diffCalendarDays("2026-11-07", "2026-10-08") === 30, "+30 giorni");

// 4. Test computeDeadlineResult & priorità
console.log("Test 4: computeDeadlineResult");
// 4a: Priorità esplicita
const resExplicit = computeDeadlineResult({
  explicitExpiryDate: "2026-10-20",
  issueDate: "2026-01-01",
  validityMonths: 12,
  referenceDate: "2026-10-08",
});
assert(resExplicit.deadlineDate === "2026-10-20", "Data esplicita prioritaria");
assert(resExplicit.calculationMethod === "explicit", "Metodo explicit");
assert(resExplicit.daysRemaining === 12, "Giorni rimanenti = 12");
assert(resExplicit.urgency === "critical", "Urgenza critical (12 <= 30)");

// 4b: Calcolata da issueDate
const resIssue = computeDeadlineResult({
  issueDate: "2026-05-01",
  validityMonths: 6,
  referenceDate: "2026-10-08",
});
assert(resIssue.deadlineDate === "2026-11-01", "Calcolata da issueDate (01/05 + 6m = 01/11)");
assert(resIssue.calculationMethod === "calculated_from_issue", "Metodo calculated_from_issue");
assert(resIssue.daysRemaining === 24, "Giorni rimanenti = 24");
assert(resIssue.urgency === "critical", "Urgenza critical");

// 4c: Calcolata da fallback inspectionDate
const resFallback = computeDeadlineResult({
  validityMonths: 12,
  fallbackInspectionDate: "2025-12-01",
  referenceDate: "2026-10-08",
});
assert(resFallback.deadlineDate === "2026-12-01", "Calcolata da fallbackInspectionDate");
assert(resFallback.calculationMethod === "calculated_from_inspection", "Metodo calculated_from_inspection");
assert(resFallback.daysRemaining === 54, "Giorni rimanenti = 54");
assert(resFallback.urgency === "warning", "Urgenza warning (54 <= 90)");

// 4d: Scaduta (< 0 giorni)
const resExpired = computeDeadlineResult({
  explicitExpiryDate: "2026-10-01",
  referenceDate: "2026-10-08",
});
assert(resExpired.daysRemaining === -7, "Scaduta da 7 giorni");
assert(resExpired.urgency === "expired", "Urgenza expired");

// 4e: Valida a lungo (> 90 giorni)
const resOk = computeDeadlineResult({
  explicitExpiryDate: "2027-05-01",
  referenceDate: "2026-10-08",
});
assert(resOk.urgency === "ok", "Urgenza ok (> 90 gg)");

// 4f: Unscheduled / to_schedule
const resUnscheduled = computeDeadlineResult({
  referenceDate: "2026-10-08",
});
assert(resUnscheduled.deadlineDate === null, "Nessuna data determinabile");
assert(resUnscheduled.urgency === "to_schedule", "Urgenza to_schedule");
assert(resUnscheduled.calculationMethod === "unscheduled", "Metodo unscheduled");

// 5. Test regole legali DEADLINE_RULES
console.log("Test 5: DEADLINE_RULES");
assert(DEADLINE_RULES.AUA_AMBIENTALE.defaultValidityMonths === 180, "AUA 15 anni = 180 mesi");
assert(DEADLINE_RULES.CPI_ANTINCENDIO.defaultValidityMonths === 60, "CPI 5 anni = 60 mesi");
assert(DEADLINE_RULES.VDR_RUMORE.defaultValidityMonths === 48, "Rumore 4 anni = 48 mesi");
assert(DEADLINE_RULES.VDR_VIBRAZIONI.defaultValidityMonths === 48, "Vibrazioni 4 anni = 48 mesi");
assert(DEADLINE_RULES.VDR_CHIMICO.defaultValidityMonths === 36, "Chimico 3 anni = 36 mesi");
assert(DEADLINE_RULES.DVR_GENERALE.defaultValidityMonths === 36, "DVR 3 anni = 36 mesi");
assert(DEADLINE_RULES.HACCP_MANUALE_RIESAME.defaultValidityMonths === 12, "HACCP 1 anno = 12 mesi");
assert(DEADLINE_RULES.ACQUE_LEGIONELLA.defaultValidityMonths === 24, "Legionella 2 anni = 24 mesi");
assert(DEADLINE_RULES.ESTINTORI_CONTROLLO_SEMESTRALE.defaultValidityMonths === 6, "Estintori 6 mesi");
assert(DEADLINE_RULES.CASSETTA_PRONTO_SOCCORSO.defaultValidityMonths === 6, "Cassetta PS 6 mesi");
assert(DEADLINE_RULES.FORMAZIONE_PREPOSTI.defaultValidityMonths === 24, "Preposti 2 anni = 24 mesi");
assert(DEADLINE_RULES.FORMAZIONE_LAVORATORI.defaultValidityMonths === 60, "Lavoratori 5 anni = 60 mesi");
assert(DEADLINE_RULES.FORMAZIONE_RLS.defaultValidityMonths === 12, "RLS 1 anno = 12 mesi");

// Messa a terra condizionale
const messaATerraOrd = DEADLINE_RULES.MESSA_A_TERRA.resolveValidityMonths!({ atecoCode: "56.10" });
assert(messaATerraOrd === 60, "Messa a terra ordinaria = 60 mesi (5 anni)");
const messaATerraCantiere = DEADLINE_RULES.MESSA_A_TERRA.resolveValidityMonths!({ atecoCode: "41.20" });
assert(messaATerraCantiere === 24, "Messa a terra cantieri = 24 mesi (2 anni)");
const messaATerraSanita = DEADLINE_RULES.MESSA_A_TERRA.resolveValidityMonths!({ atecoCode: "86.21" });
assert(messaATerraSanita === 24, "Messa a terra studi medici/sanità = 24 mesi (2 anni)");

// 6. Test aggregateAllDeadlines con tutte le 6 fonti
console.log("Test 6: aggregateAllDeadlines");
const sampleInput = {
  referenceDate: "2026-10-08",
  company: {
    id: "comp-1",
    name: "Ristorante Bella Italia SRL",
    atecoCode: "56.10.11",
  },
  inspections: [
    {
      id: "insp-1",
      title: "Sopralluogo Periodico Annuale",
      happenedAt: "2026-09-01",
      companyId: "comp-1",
      documents: [
        {
          name: "AUA - Autorizzazione Unica Ambientale",
          documentTemplateId: "base-aua-ambientale",
          status: "viewed_on_site",
          note: JSON.stringify({ issueDate: "2020-05-15", noteText: "Rilasciata dalla Provincia" }),
        },
        {
          name: "DVR - Documento di Valutazione dei Rischi",
          documentTemplateId: "sec-dvr",
          status: "viewed_on_site",
          note: JSON.stringify({ issueDate: "2024-01-10" }),
        },
      ],
    },
  ],
  machines: [
    {
      id: "m-1",
      companyId: "comp-1",
      name: "Impastatrice a spirale 50kg",
      type: "Attrezzatura per panificazione",
      lastMaintenanceAt: "2025-10-15",
      status: "active",
    },
  ],
  equipment: [
    {
      id: "eq-1",
      companyId: "comp-1",
      name: "Scala doppia in alluminio",
      type: "Scala portatile",
      lastCheckAt: "2026-04-01",
      status: "active",
    },
  ],
  fireExtinguishers: [
    {
      id: "ext-1",
      companyId: "comp-1",
      code: "EST-01",
      type: "Polvere 6kg",
      location: "Sala ristorante",
      lastCheckAt: "2026-05-10",
      manufactureDate: "2020-01-01",
      status: "active",
    },
  ],
  firstAidKits: [
    {
      id: "kit-1",
      companyId: "comp-1",
      location: "Cucina",
      lastCheckAt: "2026-08-01",
      status: "active",
    },
  ],
  employees: [
    {
      id: "emp-1",
      companyId: "comp-1",
      firstName: "Mario",
      lastName: "Rossi",
      role: "Preposto di sala",
      isActive: true,
      trainingRecords: [
        {
          id: "rec-1",
          course: {
            id: "c-preposti",
            name: "Aggiornamento Preposti",
            frequencyYears: 2,
          },
          completedAt: "2024-11-01",
          certificateNumber: "ATT-2024-998",
        },
      ],
    },
  ],
};

const aggregated = aggregateAllDeadlines(sampleInput);
console.log(`Aggregate generato: ${aggregated.length} scadenze.`);
assert(aggregated.length >= 7, "Almeno 7 scadenze aggregate previste");

// Verifica AUA (15 anni da 2020-05-15 = 2035-05-15)
const auaItem = aggregated.find((d) => d.title.includes("AUA"));
assert(Boolean(auaItem), "AUA trovato");
assert(auaItem?.deadlineDate === "2035-05-15", `Scadenza AUA attesa 2035-05-15, trovata ${auaItem?.deadlineDate}`);
assert(auaItem?.urgency === "ok", "AUA è ok");

// Verifica Estintore semestrale (6 mesi da 2026-05-10 = 2026-11-10)
const extCheckItem = aggregated.find((d) => d.id === "extinguisher-check-ext-1");
assert(Boolean(extCheckItem), "Controllo semestrale estintore trovato");
assert(extCheckItem?.deadlineDate === "2026-11-10", `Scadenza semestrale estintore: ${extCheckItem?.deadlineDate}`);
assert(extCheckItem?.daysRemaining === 33, `Giorni rimanenti estintore: ${extCheckItem?.daysRemaining}`);
assert(extCheckItem?.urgency === "warning", "Urgenza warning (33 gg)");

// Verifica Preposto (2 anni da 2024-11-01 = 2026-11-01)
const prepItem = aggregated.find((d) => d.id === "training-emp-1-rec-1");
assert(Boolean(prepItem), "Corso preposto trovato");
assert(prepItem?.deadlineDate === "2026-11-01", `Scadenza preposto: ${prepItem?.deadlineDate}`);
assert(prepItem?.daysRemaining === 24, `Giorni rimanenti preposto: ${prepItem?.daysRemaining}`);
assert(prepItem?.urgency === "critical", "Urgenza preposto è critical (24 gg <= 30)");

// 7. Test summary e sorting
console.log("Test 7: getDeadlinesSummary e sortDeadlines");
const summary = getDeadlinesSummary(aggregated);
assert(summary.total === aggregated.length, "Summary total corrisponde");
assert(summary.critical > 0, "Almeno un critico presente");

const sorted = sortDeadlines(aggregated, "urgency", "asc");
assert(
  sorted[0].urgency === "critical" || sorted[0].urgency === "expired",
  "Il primo ordinato per urgenza deve essere critical o expired",
);

console.log("Test 8: getUrgencyBadgeColor e getUrgencyLabel");
const badge = getUrgencyBadgeColor("critical");
assert(Boolean(badge.color && badge.background), "Badge color ok");
const label = getUrgencyLabel("critical", 15);
assert(label.includes("15 gg"), "Label contiene 15 gg");

// 9. Test Scadenza Allegato 3B INAIL (31 Marzo)
console.log("Test 9: computeAllegato3BDeadline e regole Sorveglianza Sanitaria");
import { computeAllegato3BDeadline } from "./deadlinesEngine";
assert(computeAllegato3BDeadline("2026-10-08") === "2027-03-31", "Data autunno 2026 -> 31/03/2027");
assert(computeAllegato3BDeadline("2026-02-15") === "2026-03-31", "Data inizio 2026 prima del 31 marzo -> 31/03/2026");

// 10. Test matching regole sanitarie
assert(DEADLINE_RULES.NOMINA_MEDICO_COMPETENTE.category === "formazione_sanitaria", "Nomina MC categoria ok");
assert(DEADLINE_RULES.RELAZIONE_ANNUALE_ALLEGATO_3B.defaultValidityMonths === 12, "Allegato 3B 12 mesi");
assert(DEADLINE_RULES.SOPRALLUOGO_ANNUALE_MEDICO_COMPETENTE.defaultValidityMonths === 12, "Sopralluogo MC 12 mesi");

// 11. Test aggregazione automatica Allegato 3B
const testHealthInspection = aggregateAllDeadlines({
  referenceDate: "2026-10-08",
  company: { id: "comp-hlt-1", name: "Ristorante Salute Srl", atecoCode: "56.10.11" },
  inspections: [
    {
      id: "insp-hlt-1",
      companyId: "comp-hlt-1",
      happenedAt: "2026-10-08",
      documents: [
        {
          name: "Relazione Sanitaria Annuale & Allegato 3B INAIL",
          documentTemplateId: "doc-hlt-03",
          status: "viewed_on_site",
          note: JSON.stringify({ issueDate: "2026-10-08" }),
        },
        {
          name: "Verbale di Sopralluogo Annuale dei Luoghi di Lavoro del MC",
          documentTemplateId: "doc-hlt-04",
          status: "viewed_on_site",
          note: JSON.stringify({ issueDate: "2026-10-08" }),
        },
      ],
    },
  ],
});
const item3b = testHealthInspection.find((d) => d.id.includes("doc-hlt-03"));
assert(Boolean(item3b), "Allegato 3B aggregato con successo");
assert(item3b?.deadlineDate === "2027-03-31", `Scadenza Allegato 3B calcolata a 2027-03-31, trovata: ${item3b?.deadlineDate}`);

const itemSopralluogo = testHealthInspection.find((d) => d.id.includes("doc-hlt-04"));
assert(Boolean(itemSopralluogo), "Sopralluogo MC aggregato con successo");
assert(itemSopralluogo?.deadlineDate === "2027-10-08", `Scadenza sopralluogo attesa 2027-10-08, trovata: ${itemSopralluogo?.deadlineDate}`);

console.log("=== TUTTI I TEST SUPERATI CON SUCCESSO! ===");

