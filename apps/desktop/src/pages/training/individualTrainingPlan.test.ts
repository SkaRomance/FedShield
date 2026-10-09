/**
 * individualTrainingPlan.test.ts
 *
 * Test di conformità normativa rigorosa per la Progettazione Formativa Individuale (PFI).
 */

import {
  computeIndividualTrainingPlan,
  inferRiskLevel,
  getRiskLevelDetails,
  detectContractAndHours,
  detectSafetyRoles,
  detectSpecificRisks,
  detectAssignedEquipmentCourses,
  matchTrainingRecord,
  CONTRACT_TYPES,
  SAFETY_ROLES,
  SPECIFIC_RISKS,
  EQUIPMENT_TRAINING_CONFIGS,
} from "./individualTrainingPlan";
import { Employee, Machine } from "../../api";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED]: ${message}`);
  }
}

console.log("=== INIZIO TEST NORMATIVI: individualTrainingPlan ===");

// ----------------------------------------------------------------------------
// TEST 1: Classificazione Rischio ATECO e Ore Base
// ----------------------------------------------------------------------------
console.log("Test 1: inferRiskLevel & getRiskLevelDetails");

assert(inferRiskLevel("56.10", undefined) === "low", "Ristorazione 56.10 = Rischio Basso");
assert(inferRiskLevel("47.11", undefined) === "low", "Commercio 47.11 = Rischio Basso");
assert(inferRiskLevel("01.11", undefined) === "medium", "Agricoltura 01.11 = Rischio Medio");
assert(inferRiskLevel("49.41", undefined) === "medium", "Trasporto merci 49.41 = Rischio Medio");
assert(inferRiskLevel("41.20", undefined) === "high", "Costruzioni 41.20 = Rischio Alto");
assert(inferRiskLevel("25.11", undefined) === "high", "Metalmeccanica 25.11 = Rischio Alto");
assert(inferRiskLevel("86.10", undefined) === "high", "Ospedali/Sanità 86.10 = Rischio Alto");

// Override esplicito companyRiskLevel
assert(inferRiskLevel("56.10", "high") === "high", "Override esplicito high");
assert(inferRiskLevel(undefined, "medio") === "medium", "Override medio in italiano");

const lowDetails = getRiskLevelDetails("low");
assert(lowDetails.specificHours === 4 && lowDetails.totalBaseHours === 8, "Basso: 4h Gen + 4h Spec = 8h");

const medDetails = getRiskLevelDetails("medium");
assert(medDetails.specificHours === 8 && medDetails.totalBaseHours === 12, "Medio: 4h Gen + 8h Spec = 12h");

const highDetails = getRiskLevelDetails("high");
assert(highDetails.specificHours === 12 && highDetails.totalBaseHours === 16, "Alto: 4h Gen + 12h Spec = 16h");

// ----------------------------------------------------------------------------
// TEST 2: Contratti di lavoro e orario settimanale
// ----------------------------------------------------------------------------
console.log("Test 2: detectContractAndHours");

const empFullTime: Employee = {
  id: "e1",
  companyId: "c1",
  firstName: "Mario",
  lastName: "Rossi",
  isActive: true,
  role: "Operaio Specializzato",
};
const resFT = detectContractAndHours(empFullTime);
assert(resFT.contractType === "full_time" && resFT.weeklyHours === 40, "Default full time 40h");

const empPartTime: Employee = {
  id: "e2",
  companyId: "c1",
  firstName: "Anna",
  lastName: "Bianchi",
  isActive: true,
  role: "Addetta mensa part-time 20h",
};
const resPT = detectContractAndHours(empPartTime);
assert(resPT.contractType === "part_time" && resPT.weeklyHours === 20, "Rilevamento part-time 20h");

const empApprendista: Employee = {
  id: "e3",
  companyId: "c1",
  firstName: "Luca",
  lastName: "Verdi",
  isActive: true,
  role: "Apprendista cuoco",
};
const resApp = detectContractAndHours(empApprendista);
assert(resApp.contractType === "apprendistato", "Rilevamento apprendista");

// ----------------------------------------------------------------------------
// TEST 3: Riconoscimento Ruoli di Sicurezza e L. 215/2021
// ----------------------------------------------------------------------------
console.log("Test 3: detectSafetyRoles & normative safety roles");

const empPreposto: Employee = {
  id: "e4",
  companyId: "c1",
  firstName: "Giuseppe",
  lastName: "Ferrari",
  isActive: true,
  role: "Caposquadra cantiere e Preposto alla sicurezza",
};
const rolesPreposto = detectSafetyRoles(empPreposto);
assert(rolesPreposto.includes("preposto"), "Rilevato ruolo Preposto");

assert(SAFETY_ROLES.preposto.minHours === 8, "Preposto: 8h corso aggiuntivo");
assert(SAFETY_ROLES.preposto.frequencyYears === 2, "Preposto: aggiornamento biennale ex L. 215/2021");
assert(SAFETY_ROLES.preposto.refresherHours === 6, "Preposto: aggiornamento 6h");

assert(SAFETY_ROLES.dirigente.minHours === 16, "Dirigente: 16h corso base");
assert(SAFETY_ROLES.dirigente.frequencyYears === 5, "Dirigente: aggiornamento 5 anni");

assert(SAFETY_ROLES.rls.minHours === 32, "RLS: 32h corso base");
assert(SAFETY_ROLES.rls.frequencyYears === 1, "RLS: aggiornamento annuale");

assert(SAFETY_ROLES.antincendio_l1.minHours === 4 && SAFETY_ROLES.antincendio_l1.refresherHours === 2, "Antincendio L1: 4h / 2h");
assert(SAFETY_ROLES.antincendio_l2.minHours === 8 && SAFETY_ROLES.antincendio_l2.refresherHours === 5, "Antincendio L2: 8h / 5h");
assert(SAFETY_ROLES.antincendio_l3.minHours === 16 && SAFETY_ROLES.antincendio_l3.refresherHours === 8, "Antincendio L3: 16h / 8h");
assert(SAFETY_ROLES.antincendio_l1.frequencyYears === 3, "Antincendio: periodicità triennale DM 02/09/2021");

assert(SAFETY_ROLES.primo_soccorso_a.minHours === 16 && SAFETY_ROLES.primo_soccorso_a.refresherHours === 6, "Primo Soccorso Gruppo A: 16h / 6h");
assert(SAFETY_ROLES.primo_soccorso_bc.minHours === 12 && SAFETY_ROLES.primo_soccorso_bc.refresherHours === 4, "Primo Soccorso Gruppo B/C: 12h / 4h");
assert(SAFETY_ROLES.primo_soccorso_a.frequencyYears === 3, "Primo Soccorso: periodicità triennale DM 388/2003");

// ----------------------------------------------------------------------------
// TEST 4: Attrezzature e Accordo Stato-Regioni 22/02/2012
// ----------------------------------------------------------------------------
console.log("Test 4: detectAssignedEquipmentCourses");

assert(EQUIPMENT_TRAINING_CONFIGS.FORMAZ_CARRELLI.minHours === 12, "Carrelli: 12h patentino");
assert(EQUIPMENT_TRAINING_CONFIGS.FORMAZ_CARRELLI.refresherHours === 4, "Carrelli: 4h aggiornamento");
assert(EQUIPMENT_TRAINING_CONFIGS.FORMAZ_CARRELLI.frequencyYears === 5, "Carrelli: periodicità 5 anni");

assert(EQUIPMENT_TRAINING_CONFIGS.FORMAZ_PLE.minHours === 10, "PLE: 10h");
assert(EQUIPMENT_TRAINING_CONFIGS.FORMAZ_GRU_AUTOCARRO.minHours === 12, "Gru autocarro: 12h");
assert(EQUIPMENT_TRAINING_CONFIGS.FORMAZ_MACCHINE_ALIMENTARI.minHours === 4, "Macchine alimentari: 4h art. 73");

const empCarrellista: Employee = {
  id: "e5",
  companyId: "c1",
  firstName: "Marco",
  lastName: "Neri",
  isActive: true,
  role: "Magazziniere Carrellista",
};
const eqCarrellista = detectAssignedEquipmentCourses(empCarrellista);
assert(eqCarrellista.some((c) => c.code === "FORMAZ_CARRELLI"), "Rilevato corso carrelli per carrellista");

// Verifica con macchine assegnate direttamente via metadata Step 4
const mockMachine: Machine = {
  id: "m1",
  companyId: "c1",
  name: "Carrello elevatore Linde E16",
  type: "carrello_elevatore",
  note: JSON.stringify({ authorizedWorkerIds: ["e6"] }),
};
const empFromMachine: Employee = {
  id: "e6",
  companyId: "c1",
  firstName: "Paolo",
  lastName: "Bruni",
  isActive: true,
  role: "Operaio generico",
};
const eqFromMachine = detectAssignedEquipmentCourses(empFromMachine, [mockMachine]);
assert(eqFromMachine.some((c) => c.code === "FORMAZ_CARRELLI"), "Rilevato corso carrello da assegnazione macchina Step 4");

// ----------------------------------------------------------------------------
// TEST 5: Mansioni con Rischi Particolari (VDT >20h, HACCP, MMC)
// ----------------------------------------------------------------------------
console.log("Test 5: detectSpecificRisks");

const empUfficioFT: Employee = {
  id: "e7",
  companyId: "c1",
  firstName: "Sara",
  lastName: "Galli",
  isActive: true,
  role: "Impiegata Amministrativa Contabile",
};
const risksUfficio = detectSpecificRisks(empUfficioFT, 40);
assert(risksUfficio.includes("videoterminali_20h"), "Impiegata 40h = Videoterminalista >20h");

// Impiegata part-time 15h -> NON supera la soglia di 20h per videoterminalisti
const risksUfficioPartTime15h = detectSpecificRisks(empUfficioFT, 15);
assert(!risksUfficioPartTime15h.includes("videoterminali_20h"), "Impiegata 15h = NON videoterminalista sistematico ex art. 173");

const empCuoco: Employee = {
  id: "e8",
  companyId: "c1",
  firstName: "Luigi",
  lastName: "Esposito",
  isActive: true,
  role: "Chef de Partie / Cuoco",
};
const risksCuoco = detectSpecificRisks(empCuoco, 40);
assert(risksCuoco.includes("haccp_manipolatore"), "Cuoco = HACCP Manipolatore");

const empCameriere: Employee = {
  id: "e9",
  companyId: "c1",
  firstName: "Francesca",
  lastName: "Romano",
  isActive: true,
  role: "Cameriera di sala",
};
const risksCameriere = detectSpecificRisks(empCameriere, 30);
assert(risksCameriere.includes("haccp_non_manipolatore"), "Cameriera = HACCP Non Manipolatore");

// ----------------------------------------------------------------------------
// TEST 6: Calcolo Stato Conformità (valid, expiring, expired, missing)
// ----------------------------------------------------------------------------
console.log("Test 6: matchTrainingRecord");

const refToday = new Date("2026-10-09T12:00:00Z");

// Corso valido (scadenza tra 180 giorni)
const matchValid = matchTrainingRecord(
  {
    courseCode: "SIC_LAV_SPECIFICA_BASSO",
    title: "Formazione Specifica Basso Rischio",
    minHours: 4,
    frequencyYears: 5,
  },
  [
    {
      id: "tr1",
      course: { id: "c1", name: "Formazione Specifica Rischio Basso", minHours: 4, frequencyYears: 5 },
      completedAt: "2024-04-01",
      expiresAt: "2029-04-01",
      hoursDone: 4,
      certificateNumber: "CERT-1234",
    },
  ],
  refToday,
);
assert(matchValid.status === "valid", "Corso valido con scadenza 2029");

// Corso in scadenza (scadenza tra 30 giorni)
const matchExpiring = matchTrainingRecord(
  {
    courseCode: "RUOLO_PREPOSTO",
    title: "Corso Preposti",
    minHours: 8,
    frequencyYears: 2,
  },
  [
    {
      id: "tr2",
      course: { id: "c2", name: "Corso per Preposti L. 215", minHours: 8, frequencyYears: 2 },
      completedAt: "2024-11-05",
      expiresAt: "2026-11-05", // tra 27 giorni rispetto a 2026-10-09
      hoursDone: 8,
      certificateNumber: "CERT-PREP-55",
    },
  ],
  refToday,
  60, // soglia 60 giorni
);
assert(matchExpiring.status === "expiring", "Corso in scadenza (entro 60 giorni)");

// Corso scaduto
const matchExpired = matchTrainingRecord(
  {
    courseCode: "FORMAZ_CARRELLI",
    title: "Carrelli Elevatori",
    minHours: 12,
    frequencyYears: 5,
  },
  [
    {
      id: "tr3",
      course: { id: "c3", name: "Patentino Muletto Carrelli", minHours: 12, frequencyYears: 5 },
      completedAt: "2020-01-01",
      expiresAt: "2025-01-01", // Scaduto nel 2025
      hoursDone: 12,
      certificateNumber: "CERT-CAR-01",
    },
  ],
  refToday,
);
assert(matchExpired.status === "expired", "Corso scaduto");

// Corso mancante
const matchMissing = matchTrainingRecord(
  {
    courseCode: "RUOLO_RLS",
    title: "Formazione RLS 32h",
    minHours: 32,
    frequencyYears: 1,
  },
  [],
  refToday,
);
assert(matchMissing.status === "missing", "Corso mancante");

// Credito Permanente (Formazione Generale) non scade MAI
const matchPermanent = matchTrainingRecord(
  {
    courseCode: "SIC_LAV_GENERALE",
    title: "Formazione Generale Lavoratori",
    minHours: 4,
    frequencyYears: 0,
    isPermanentCredit: true,
  },
  [
    {
      id: "tr4",
      course: { id: "c4", name: "Formazione Generale Lavoratori", minHours: 4, frequencyYears: 0 },
      completedAt: "2015-05-10",
      expiresAt: null,
      hoursDone: 4,
      certificateNumber: "PERM-001",
    },
  ],
  refToday,
);
assert(matchPermanent.status === "valid", "Credito permanente valido a vita anche se svolto 10 anni fa");

// ----------------------------------------------------------------------------
// TEST 7: Test Integrato computeIndividualTrainingPlan
// ----------------------------------------------------------------------------
console.log("Test 7: computeIndividualTrainingPlan (Scenario Complesso)");

// Scenario: Dipendente Cuoco e Preposto in Ristorante (Ateco 56.10, Rischio Basso), Part-time 20h
const employeeCuocoPreposto: Employee = {
  id: "emp-test-100",
  companyId: "comp-ristorante",
  firstName: "Antonio",
  lastName: "Cannavacciuolo",
  fiscalCode: "CNNNTN75P16F839K",
  role: "Cuoco Capo Partita - Preposto di Cucina (Part-time 20h)",
  department: "Cucina e Preparazioni",
  isActive: true,
  trainingRecords: [
    {
      id: "tr-gen",
      course: { id: "c-gen", name: "Formazione Generale Lavoratori 4h", minHours: 4, frequencyYears: 0 },
      completedAt: "2022-01-15",
      expiresAt: null,
      hoursDone: 4,
      certificateNumber: "GEN-999",
    },
    {
      id: "tr-spec",
      course: { id: "c-spec", name: "Formazione Specifica Rischio Basso", minHours: 4, frequencyYears: 5 },
      completedAt: "2022-01-15",
      expiresAt: "2027-01-15",
      hoursDone: 4,
      certificateNumber: "SPEC-999",
    },
    {
      id: "tr-haccp",
      course: { id: "c-haccp", name: "Igiene Alimenti HACCP Alimentarista Manipolatore", minHours: 8, frequencyYears: 3 },
      completedAt: "2024-03-10",
      expiresAt: "2027-03-10",
      hoursDone: 8,
      certificateNumber: "HACCP-444",
    },
    // Preposto mancante!
    // Macchine alimentari mancante!
  ],
};

const plan = computeIndividualTrainingPlan(
  employeeCuocoPreposto,
  "56.10",
  "low",
  undefined,
  { referenceDate: refToday },
);

console.log("Piano formativo generato:");
console.log(`- Dipendente: ${plan.employeeFullName} (${plan.mansione})`);
console.log(`- Contratto: ${plan.contractLabel} (${plan.weeklyHours}h/sett)`);
console.log(`- Rischio ATECO: ${plan.companyRiskLabel}`);
console.log(`- Ruoli rilevati: ${plan.detectedSafetyRoles.join(", ")}`);
console.log(`- Rischi rilevati: ${plan.detectedSpecificRisks.join(", ")}`);
console.log(`- Corsi obbligatori totali: ${plan.mandatoryCourses.length}`);
console.log(`- Ore richieste: ${plan.totalHoursRequired}h | Ore svolte: ${plan.totalHoursDone}h`);
console.log(`- Adempimento: ${plan.compliancePercentage}%`);
console.log(`- Note normative: ${plan.normativeNotes.length}`);

assert(plan.isPartTime === true, "Identificato come Part-Time");
assert(plan.companyRiskLevel === "low", "Rischio Basso");
assert(plan.detectedSafetyRoles.includes("preposto"), "Ruolo Preposto rilevato");
assert(plan.detectedSpecificRisks.includes("haccp_manipolatore"), "HACCP Manipolatore rilevato");
assert(plan.assignedMachineNames.some((n) => n.includes("Alimentari")), "Addestramento macchine alimentari incluso per cuoco");

// Verifica singoli corsi
const cGen = plan.mandatoryCourses.find((c) => c.category === "generale");
assert(cGen !== undefined && cGen.status === "valid", "Formazione Generale presente e valida");

const cSpec = plan.mandatoryCourses.find((c) => c.category === "specifica");
assert(cSpec !== undefined && cSpec.status === "valid", "Formazione Specifica presente e valida");

const cPrep = plan.mandatoryCourses.find((c) => c.courseCode.includes("PREPOSTO"));
assert(cPrep !== undefined && cPrep.status === "missing", "Corso Preposto mancante");
assert(cPrep?.minHours === 8, "Corso Preposto 8h");
assert(cPrep?.frequencyYears === 2, "Corso Preposto aggiornamento biennale");

const cHaccp = plan.mandatoryCourses.find((c) => c.category === "haccp");
assert(cHaccp !== undefined && cHaccp.status === "valid", "HACCP presente e valido");

assert(plan.compliancePercentage < 100 && plan.compliancePercentage > 0, "Compliance parziale calcolata correttamente");
assert(plan.normativeNotes.some((n) => n.includes("part-time")), "Nota su part-time presente");
assert(plan.normativeNotes.some((n) => n.includes("Preposto")), "Nota su Preposto presente");
assert(plan.normativeNotes.some((n) => n.includes("HACCP")), "Nota su HACCP presente");

console.log("=== TUTTI I TEST HANNO AVUTO SUCCESSO CON SUCCESSO! ===");
