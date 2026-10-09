import assert from "node:assert/strict";
import {
  computeCompanyTrainingNeed,
  computeIndividualTrainingPlan,
  extractEmployeeMetadata,
  determineRiskLevel,
  isFoodDomainApplicable,
  serializeEmployeeMetadata,
} from "./individualTrainingPlan";
import { Employee, Machine, TrainingCourse } from "../api";

console.log("=== INIZIO TEST individualTrainingPlan ===");

// Test 1: extract and serialize metadata
const meta1 = {
  department: "Cucina Calda",
  birthDate: "1985-04-12",
  birthPlace: "Napoli (NA)",
  contractType: "Tempo Indeterminato",
  weeklyHours: "40",
  safetyRoles: ["preposto", "antincendio_l2", "primo_soccorso_bc"],
  assignedMachineIds: ["mach-1", "mach-2"],
};
const serialized = serializeEmployeeMetadata(meta1);
assert.ok(serialized.startsWith("{") && serialized.endsWith("}"));

const dummyEmp: Employee = {
  id: "emp-1",
  companyId: "comp-1",
  firstName: "Mario",
  lastName: "Rossi",
  fiscalCode: "RSSMRA85D12F839X",
  role: "Cuoco",
  department: serialized,
  isActive: true,
  trainingRecords: [],
};

const extracted = extractEmployeeMetadata(dummyEmp);
assert.equal(extracted.department, "Cucina Calda");
assert.equal(extracted.birthDate, "1985-04-12");
assert.equal(extracted.contractType, "Tempo Indeterminato");
assert.equal(extracted.weeklyHours, "40");
assert.deepEqual(extracted.safetyRoles, ["preposto", "antincendio_l2", "primo_soccorso_bc"]);
assert.deepEqual(extracted.assignedMachineIds, ["mach-1", "mach-2"]);
console.log("✓ Test 1: extractEmployeeMetadata e serializeEmployeeMetadata superato");

// Test 2: determineRiskLevel
assert.equal(determineRiskLevel("56.10", "Cuoco").level, "medio");
assert.equal(determineRiskLevel("41.20", "Muratore").level, "alto");
assert.equal(determineRiskLevel("62.01", "Impiegato").level, "basso");
assert.equal(determineRiskLevel(undefined, "Operaio Edile").level, "alto");
console.log("✓ Test 2: determineRiskLevel superato");

// Test 3: isFoodDomainApplicable
assert.equal(isFoodDomainApplicable("56.10", "Cuoco"), true);
assert.equal(isFoodDomainApplicable("41.20", "Muratore"), false);
assert.equal(isFoodDomainApplicable("00.00", "Pizzaiolo"), true);
console.log("✓ Test 3: isFoodDomainApplicable superato");

// Test 4: computeIndividualTrainingPlan
const dummyMachines: Machine[] = [
  {
    id: "mach-1",
    companyId: "comp-1",
    name: "Carrello Elevatore Elettrico",
    brand: "Toyota",
    status: "active",
  } as Machine,
  {
    id: "mach-2",
    companyId: "comp-1",
    name: "Affettatrice Professionale",
    brand: "Berkel",
    status: "active",
  } as Machine,
];

const dummyCourses: TrainingCourse[] = [
  {
    id: "crs-gen",
    name: "Formazione Generale Lavoratori (Credito Permanente)",
    targetAudience: "Tutti i lavoratori",
    minHours: 4,
    frequencyYears: 0,
    normReference: "D.Lgs. 81/08 art. 37",
    domain: "safety",
    isActive: true,
  },
  {
    id: "crs-spec",
    name: "Formazione Specifica Lavoratori - Rischio Medio (8h)",
    targetAudience: "Lavoratori rischio medio",
    minHours: 8,
    frequencyYears: 5,
    normReference: "Accordo S-R 21/12/2011",
    domain: "safety",
    isActive: true,
  },
];

const plan = computeIndividualTrainingPlan(dummyEmp, {
  company: { id: "comp-1", name: "Ristorante Da Mario", atecoCode: "56.10" } as any,
  companyMachines: dummyMachines,
  availableCourses: dummyCourses,
});

assert.equal(plan.employeeFullName, "Rossi Mario");
assert.equal(plan.role, "Cuoco");
assert.equal(plan.cleanDepartment, "Cucina Calda");
// Corsi attesi:
// 1. Formazione Generale (4h)
// 2. Formazione Specifica Rischio Medio (8h)
// 3. Formazione HACCP (8h)
// 4. Preposto (8h)
// 5. Antincendio L2 (8h)
// 6. Primo Soccorso B/C (12h)
// 7. Carrello Elevatore (12h)
// 8. Macchine alimentari (4h)
assert.equal(plan.courses.length, 8);
assert.equal(plan.missingCoursesCount, 8);
assert.equal(plan.compliancePercentage, 0);
assert.equal(plan.overallStatus, "critico");
console.log("✓ Test 4: computeIndividualTrainingPlan calcola correttamente tutti i corsi di legge per mansione, ruoli e macchine");

// Test 5: computeIndividualTrainingPlan con attestati registrati
const empWithRecords: Employee = {
  ...dummyEmp,
  trainingRecords: [
    {
      id: "rec-1",
      course: { id: "crs-gen", name: "Formazione Generale Lavoratori", minHours: 4, frequencyYears: 0 },
      completedAt: "2024-01-15T00:00:00.000Z",
      expiresAt: null, // permanente
      hoursDone: 4,
      certificateNumber: "CERT-001",
    },
    {
      id: "rec-2",
      course: { id: "crs-spec", name: "Formazione Specifica Lavoratori", minHours: 8, frequencyYears: 5 },
      completedAt: "2024-01-20T00:00:00.000Z",
      expiresAt: "2029-01-20T00:00:00.000Z", // valido fino al 2029
      hoursDone: 8,
      certificateNumber: "CERT-002",
    },
  ],
};

const planWithRecords = computeIndividualTrainingPlan(empWithRecords, {
  company: { id: "comp-1", name: "Ristorante Da Mario", atecoCode: "56.10" } as any,
  companyMachines: dummyMachines,
  availableCourses: dummyCourses,
});

assert.equal(planWithRecords.completedCoursesCount, 2);
assert.equal(planWithRecords.missingCoursesCount, 6);
assert.ok(planWithRecords.compliancePercentage > 0);
console.log("✓ Test 5: computeIndividualTrainingPlan riconosce attestati validi ed aggiorna % conformità");

// Test 6: computeCompanyTrainingNeed
const companyNeed = computeCompanyTrainingNeed(
  { id: "comp-1", name: "Ristorante Da Mario", atecoCode: "56.10" } as any,
  [empWithRecords],
  dummyMachines,
  dummyCourses,
);

assert.equal(companyNeed.totalEmployees, 1);
assert.equal(companyNeed.riskLevel, "medio");
assert.equal(companyNeed.safetyRolesCoverage.prepostiCount, 1);
assert.equal(companyNeed.safetyRolesCoverage.antincendioCount, 1);
assert.equal(companyNeed.safetyRolesCoverage.primoSoccorsoCount, 1);
assert.ok(companyNeed.mandatoryEquipmentCourses.length >= 1);
console.log("✓ Test 6: computeCompanyTrainingNeed genera correttamente la sintesi aziendale");

console.log("=== TUTTI I TEST individualTrainingPlan SUPERATI CON SUCCESSO! ===");
