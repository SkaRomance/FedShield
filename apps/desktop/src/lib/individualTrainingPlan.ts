// Modulo di Progettazione Formativa Individuale e Fabbisogno Aziendale
// Conforme a D.Lgs. 81/2008 (art. 34, 37, 43, 45, 71, 73),
// Accordi Stato-Regioni (21/12/2011 formazione lavoratori, 22/02/2012 attrezzature, 07/07/2016 RSPP),
// Legge 215/2021 (obbligo preposti), D.M. 02/09/2021 (antincendio), D.M. 388/2003 (primo soccorso),
// e Regolamento CE 852/2004 (igiene alimentare / HACCP).

import { Company, Employee, Machine, TrainingCourse, TrainingRecord } from "../api";
import { TRAINING_REQUIREMENTS_LIBRARY } from "../pages/checklist/normativeMachineCatalog";

export interface EmployeeMetadata {
  birthDate?: string;
  birthPlace?: string;
  contractType?: string;
  weeklyHours?: number | string;
  safetyRoles?: string[];
  assignedMachineIds?: string[];
  department?: string;
}

export const SUGGESTED_JOB_ROLES: string[] = [
  "Cuoco / Capo Partita",
  "Aiuto Cuoco",
  "Pizzaiolo",
  "Pasticcere",
  "Cameriere di Sala",
  "Barista",
  "Banconista Alimentare",
  "Lavapiatti / Addetto Plonge",
  "Magazziniere",
  "Carrellista / Mulettista",
  "Operaio di Produzione",
  "Operaio Edile",
  "Addetto Pulizie e Sanificazione",
  "Impiegato VDT / Amministrativo",
  "Responsabile di Punto Vendita",
  "Manutentore Meccanico",
  "Saldatore",
  "Elettricista",
  "Autista / Conducente Mezzi",
];

export const CONTRACT_TYPES: string[] = [
  "Tempo Indeterminato",
  "Tempo Determinato",
  "Apprendistato Professionalizzante",
  "Part-Time Orizzontale",
  "Part-Time Verticale",
  "Somministrazione / Interinale",
  "Lavoro Stagionale",
  "Tirocinio / Stage Formativo",
  "Collaborazione Coordinata e Continuativa",
];

export const WEEKLY_HOURS_PRESETS = [
  { label: "40h (Full-time standard)", value: "40" },
  { label: "30h (Part-time 75%)", value: "30" },
  { label: "24h (Part-time 60%)", value: "24" },
  { label: "20h (Part-time 50%)", value: "20" },
  { label: "15h (Part-time ridotto)", value: "15" },
];

export interface SafetyRoleOption {
  code: string;
  label: string;
  category: "coordinamento" | "emergenza";
  normReference: string;
  courseHours: number;
  frequencyYears: number;
  description: string;
}

export const SAFETY_ROLE_OPTIONS: SafetyRoleOption[] = [
  {
    code: "preposto",
    label: "Preposto alla Sicurezza",
    category: "coordinamento",
    normReference: "D.Lgs. 81/2008 art. 37 c. 7 e L. 215/2021",
    courseHours: 8,
    frequencyYears: 2,
    description: "Obbligo di formazione specifica e aggiornamento biennale di 6 ore",
  },
  {
    code: "dirigente",
    label: "Dirigente con Delega Sicurezza",
    category: "coordinamento",
    normReference: "D.Lgs. 81/2008 art. 37 c. 7",
    courseHours: 16,
    frequencyYears: 5,
    description: "Formazione 16 ore con aggiornamento quinquennale di 6 ore",
  },
  {
    code: "rls",
    label: "RLS (Rappresentante Lavoratori)",
    category: "coordinamento",
    normReference: "D.Lgs. 81/2008 art. 37 c. 10-11",
    courseHours: 32,
    frequencyYears: 1,
    description: "Corso base 32 ore con aggiornamento annuale obbligatorio (4h o 8h)",
  },
  {
    code: "rspp_dl",
    label: "RSPP Datore di Lavoro",
    category: "coordinamento",
    normReference: "D.Lgs. 81/2008 art. 34 e Accordo S-R 21/12/2011",
    courseHours: 32,
    frequencyYears: 5,
    description: "Svolgimento diretto compiti RSPP da parte del datore di lavoro",
  },
  {
    code: "antincendio_l1",
    label: "Addetto Antincendio Livello 1 (ex Basso)",
    category: "emergenza",
    normReference: "D.M. 02/09/2021 All. III",
    courseHours: 4,
    frequencyYears: 5,
    description: "4 ore base, aggiornamento quinquennale di 2 ore",
  },
  {
    code: "antincendio_l2",
    label: "Addetto Antincendio Livello 2 (ex Medio)",
    category: "emergenza",
    normReference: "D.M. 02/09/2021 All. III",
    courseHours: 8,
    frequencyYears: 5,
    description: "8 ore base con prova pratica, aggiornamento quinquennale di 5 ore",
  },
  {
    code: "antincendio_l3",
    label: "Addetto Antincendio Livello 3 (ex Elevato)",
    category: "emergenza",
    normReference: "D.M. 02/09/2021 All. III",
    courseHours: 16,
    frequencyYears: 5,
    description: "16 ore base con idoneità tecnica VV.F., aggiornamento quinquennale di 8 ore",
  },
  {
    code: "primo_soccorso_bc",
    label: "Addetto Primo Soccorso (Gruppo B / C)",
    category: "emergenza",
    normReference: "D.M. 388/2003 art. 3",
    courseHours: 12,
    frequencyYears: 3,
    description: "12 ore base per aziende Gruppo B/C, aggiornamento triennale di 4 ore",
  },
  {
    code: "primo_soccorso_a",
    label: "Addetto Primo Soccorso (Gruppo A)",
    category: "emergenza",
    normReference: "D.M. 388/2003 art. 3",
    courseHours: 16,
    frequencyYears: 3,
    description: "16 ore base per aziende Gruppo A, aggiornamento triennale di 6 ore",
  },
];

export function extractEmployeeMetadata(emp: Employee): EmployeeMetadata {
  let safetyRolesList: string[] = [];
  if (Array.isArray((emp as any).safetyRoles)) {
    safetyRolesList = (emp as any).safetyRoles;
  } else if (typeof emp.safetyRoles === "string" && emp.safetyRoles.trim()) {
    try {
      const p = JSON.parse(emp.safetyRoles);
      if (Array.isArray(p)) safetyRolesList = p;
    } catch {
      safetyRolesList = emp.safetyRoles.split(",").map((s) => s.trim());
    }
  }

  let assignedMachinesList: string[] = [];
  const rawEquip = (emp as any).assignedEquipment ?? (emp as any).assignedMachineIds;
  if (Array.isArray(rawEquip)) {
    assignedMachinesList = rawEquip;
  } else if (typeof rawEquip === "string" && rawEquip.trim()) {
    try {
      const p = JSON.parse(rawEquip);
      if (Array.isArray(p)) assignedMachinesList = p;
    } catch {
      assignedMachinesList = rawEquip.split(",").map((s) => s.trim());
    }
  }

  let deptVal = emp.department || "";
  let bDate = emp.birthDate ? String(emp.birthDate).slice(0, 10) : "";
  let bPlace = emp.birthPlace || "";
  let cType = emp.contractType || "";
  let wHours =
    emp.weeklyHours !== null && emp.weeklyHours !== undefined
      ? String(emp.weeklyHours)
      : "";

  if (deptVal.trim().startsWith("{") && deptVal.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(deptVal);
      deptVal = parsed.dept ?? parsed.department ?? "";
      if (!bDate && parsed.birthDate) bDate = String(parsed.birthDate).slice(0, 10);
      if (!bPlace && parsed.birthPlace) bPlace = parsed.birthPlace;
      if (!cType && parsed.contractType) cType = parsed.contractType;
      if (!wHours && parsed.weeklyHours) wHours = String(parsed.weeklyHours);
      if (safetyRolesList.length === 0 && Array.isArray(parsed.safetyRoles))
        safetyRolesList = parsed.safetyRoles;
      if (assignedMachinesList.length === 0 && Array.isArray(parsed.assignedMachineIds))
        assignedMachinesList = parsed.assignedMachineIds;
    } catch {
      // JSON non valido, mantieni fallback
    }
  }

  return {
    department: deptVal,
    birthDate: bDate || undefined,
    birthPlace: bPlace || undefined,
    contractType: cType || undefined,
    weeklyHours: wHours || undefined,
    safetyRoles: safetyRolesList,
    assignedMachineIds: assignedMachinesList,
  };
}

export function serializeEmployeeMetadata(meta: EmployeeMetadata): string {
  return JSON.stringify({
    dept: meta.department || "",
    birthDate: meta.birthDate || "",
    birthPlace: meta.birthPlace || "",
    contractType: meta.contractType || "",
    weeklyHours: meta.weeklyHours || "",
    safetyRoles: meta.safetyRoles || [],
    assignedMachineIds: meta.assignedMachineIds || [],
  });
}

export function getCleanDepartmentDisplay(emp: Employee): string {
  const meta = extractEmployeeMetadata(emp);
  return meta.department || "—";
}

export type PlannedCourseCategory =
  | "generale"
  | "specifica"
  | "ruolo_sicurezza"
  | "attrezzatura"
  | "haccp"
  | "altro";

export type CourseComplianceStatus = "valido" | "in_scadenza" | "scaduto" | "da_svolgere";

export interface PlannedCourseItem {
  id: string; // identificativo logico univoco
  code?: string;
  name: string;
  category: PlannedCourseCategory;
  categoryLabel: string;
  normReference: string;
  minHours: number;
  frequencyYears: number;
  isMandatory: boolean;
  reason: string;
  status: CourseComplianceStatus;
  statusLabel: string;
  statusColor: string;
  statusBg: string;
  record?: TrainingRecord;
  completedAt?: string;
  expiresAt?: string;
  hoursDone?: number;
  certificateNumber?: string;
  daysRemaining?: number;
  matchedCatalogCourseId?: string;
}

export interface IndividualTrainingPlan {
  employeeId: string;
  employeeFullName: string;
  fiscalCode?: string;
  role: string;
  cleanDepartment: string;
  contractType?: string;
  weeklyHours?: number | string;
  birthDate?: string;
  birthPlace?: string;
  hireDate?: string;
  safetyRoles: string[];
  assignedMachines: Array<{ id: string; name: string }>;
  totalRequiredCourses: number;
  completedCoursesCount: number;
  expiringCoursesCount: number;
  expiredCoursesCount: number;
  missingCoursesCount: number;
  totalRequiredHours: number;
  totalCompletedHours: number;
  compliancePercentage: number;
  overallStatus: "conforme" | "attenzione" | "critico";
  courses: PlannedCourseItem[];
}

export interface TrainingPlanOptions {
  company?: Company;
  atecoCode?: string;
  companyMachines?: Machine[];
  availableCourses?: TrainingCourse[];
}

function normalizeStr(s?: string | null): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Valuta il livello di rischio ATECO / Mansione (Basso 4h, Medio 8h, Alto 12h)
 * ex Accordo Stato-Regioni 21/12/2011 All. 2
 */
export function determineRiskLevel(
  atecoCode?: string,
  role?: string,
): { level: "basso" | "medio" | "alto"; hours: number; label: string } {
  const normRole = normalizeStr(role);
  const code = (atecoCode || "").replace(/\./g, "").trim();

  // Ruoli ad alto rischio esplicito
  if (
    normRole.includes("operaio") ||
    normRole.includes("edile") ||
    normRole.includes("saldat") ||
    normRole.includes("carrell") ||
    normRole.includes("mulett") ||
    normRole.includes("gru") ||
    normRole.includes("manutentor") ||
    normRole.includes("meccanic") ||
    normRole.includes("elettric")
  ) {
    return { level: "alto", hours: 12, label: "Rischio Alto (12h)" };
  }

  // ATECO Edilizia (41, 42, 43), Manifattura (10-33 tranne alimentari se artigianali), Chimica, Sanità
  if (code.startsWith("41") || code.startsWith("42") || code.startsWith("43") || code.startsWith("86")) {
    return { level: "alto", hours: 12, label: "Rischio Alto (12h)" };
  }

  // HoReCa / Ristorazione (56.*, 55.*), Commercio ingrosso alimentare, Trasporti (49-53), Agricoltura (01-03)
  if (
    code.startsWith("56") ||
    code.startsWith("55") ||
    code.startsWith("01") ||
    code.startsWith("02") ||
    code.startsWith("03") ||
    code.startsWith("49") ||
    code.startsWith("52") ||
    normRole.includes("cuoc") ||
    normRole.includes("camerier") ||
    normRole.includes("magazzin") ||
    normRole.includes("pasticc") ||
    normRole.includes("pizzaiol") ||
    normRole.includes("plonge") ||
    normRole.includes("barista") ||
    normRole.includes("banconist")
  ) {
    return { level: "medio", hours: 8, label: "Rischio Medio (8h)" };
  }

  // Ruoli a basso rischio (ufficio, VDT, amministrazione, commerciale)
  return { level: "basso", hours: 4, label: "Rischio Basso (4h)" };
}

/**
 * Verifica se la mansione o l'azienda richiedono formazione HACCP alimentare
 */
export function isFoodDomainApplicable(atecoCode?: string, role?: string): boolean {
  const code = (atecoCode || "").replace(/\./g, "").trim();
  const normRole = normalizeStr(role);

  if (
    code.startsWith("56") || // Ristorazione
    code.startsWith("55") || // Alberghi con ristorazione
    code.startsWith("10") || // Industrie alimentari
    code.startsWith("11") || // Bevande
    code.startsWith("4711") || // Supermercati alimentari
    code.startsWith("472") // Commercio dettaglio alimenti
  ) {
    return true;
  }

  const foodKeywords = [
    "cuoc",
    "cucin",
    "camerier",
    "bar",
    "sala",
    "pizz",
    "pasticc",
    "aliment",
    "banconist",
    "lavapiatt",
    "plonge",
    "mensa",
    "gastronom",
  ];
  return foodKeywords.some((kw) => normRole.includes(kw));
}

/**
 * Calcola la Progettazione Formativa Individuale per un singolo lavoratore
 */
export function computeIndividualTrainingPlan(
  employee: Employee,
  options: TrainingPlanOptions = {},
): IndividualTrainingPlan {
  const meta = extractEmployeeMetadata(employee);
  const companyAteco = options.atecoCode || options.company?.atecoCode || "";
  const roleName = employee.role || "Lavoratore";
  const records = employee.trainingRecords || [];
  const machines = options.companyMachines || [];
  const catalogCourses = options.availableCourses || [];

  const plannedItems: PlannedCourseItem[] = [];

  // -------------------------------------------------------------------------
  // 1. FORMAZIONE GENERALE LAVORATORI (4 ORE) — Accordo S-R 21/12/2011
  // -------------------------------------------------------------------------
  plannedItems.push({
    id: "FORMAZ_GENERALE",
    code: "FORMAZ_GENERALE",
    name: "Formazione Generale Lavoratori (Credito Permanente)",
    category: "generale",
    categoryLabel: "Formazione Base",
    normReference: "D.Lgs. 81/2008 art. 37 c. 1-2; Accordo Stato-Regioni 21/12/2011",
    minHours: 4,
    frequencyYears: 0, // permanente
    isMandatory: true,
    reason: "Obbligo di legge per tutti i lavoratori subordinati ed equiparati",
    status: "da_svolgere",
    statusLabel: "Da Svolgere",
    statusColor: "#dc2626",
    statusBg: "#fee2e2",
  });

  // -------------------------------------------------------------------------
  // 2. FORMAZIONE SPECIFICA LAVORATORI — Accordo S-R 21/12/2011
  // -------------------------------------------------------------------------
  const risk = determineRiskLevel(companyAteco, roleName);
  plannedItems.push({
    id: `FORMAZ_SPECIFICA_${risk.level.toUpperCase()}`,
    code: `FORMAZ_SPECIFICA_${risk.level.toUpperCase()}`,
    name: `Formazione Specifica Lavoratori - ${risk.label}`,
    category: "specifica",
    categoryLabel: "Formazione Specifica Mansione",
    normReference: "D.Lgs. 81/2008 art. 37 c. 1-3; Accordo Stato-Regioni 21/12/2011",
    minHours: risk.hours,
    frequencyYears: 5,
    isMandatory: true,
    reason: `Rischio ${risk.level} dedotto da ATECO ${companyAteco || "generico"} e mansione "${roleName}". Aggiornamento quinquennale (6h).`,
    status: "da_svolgere",
    statusLabel: "Da Svolgere",
    statusColor: "#dc2626",
    statusBg: "#fee2e2",
  });

  // -------------------------------------------------------------------------
  // 3. FORMAZIONE HACCP (IGIENE ALIMENTARE) — Reg. CE 852/2004
  // -------------------------------------------------------------------------
  if (isFoodDomainApplicable(companyAteco, roleName)) {
    plannedItems.push({
      id: "FORMAZ_HACCP_ALIMENTARISTA",
      code: "FORMAZ_HACCP",
      name: "Formazione Igiene Alimentare & HACCP (Personale Alimentarista)",
      category: "haccp",
      categoryLabel: "Igiene Alimenti (HACCP)",
      normReference: "Regolamento CE 852/2004 All. II Cap. XII; L.R. applicabili",
      minHours: 8,
      frequencyYears: 3,
      isMandatory: true,
      reason: `Attività a contatto con preparazione, somministrazione o manipolazione alimenti per la mansione "${roleName}"`,
      status: "da_svolgere",
      statusLabel: "Da Svolgere",
      statusColor: "#dc2626",
      statusBg: "#fee2e2",
    });
  }

  // -------------------------------------------------------------------------
  // 4. RUOLI DI SICUREZZA ASSEGNATI (Preposto, Dirigente, RLS, Antincendio, Primo Soccorso)
  // -------------------------------------------------------------------------
  const assignedSafetyRoles = meta.safetyRoles || [];
  for (const roleCode of assignedSafetyRoles) {
    const roleDef = SAFETY_ROLE_OPTIONS.find((r) => r.code === roleCode);
    if (!roleDef) continue;

    plannedItems.push({
      id: `FORMAZ_RUOLO_${roleDef.code.toUpperCase()}`,
      code: `FORMAZ_${roleDef.code.toUpperCase()}`,
      name: `Corso ${roleDef.label}`,
      category: "ruolo_sicurezza",
      categoryLabel: "Incarico di Sicurezza",
      normReference: roleDef.normReference,
      minHours: roleDef.courseHours,
      frequencyYears: roleDef.frequencyYears,
      isMandatory: true,
      reason: `Nomina e designazione aziendale: ${roleDef.description}`,
      status: "da_svolgere",
      statusLabel: "Da Svolgere",
      statusColor: "#dc2626",
      statusBg: "#fee2e2",
    });
  }

  // -------------------------------------------------------------------------
  // 5. ABILITAZIONE ATTREZZATURE & MACCHINARI ASSEGNATI — Accordo S-R 22/02/2012
  // -------------------------------------------------------------------------
  const assignedMachineIds = meta.assignedMachineIds || [];
  const assignedMachines: Array<{ id: string; name: string }> = [];

  for (const machId of assignedMachineIds) {
    const machine = machines.find((m) => m.id === machId);
    if (!machine) continue;
    assignedMachines.push({ id: machine.id, name: machine.name });

    // Determina il requisito formativo per la macchina
    const lower = machine.name.toLowerCase();
    let reqDef = Object.values(TRAINING_REQUIREMENTS_LIBRARY).find((r) => {
      if (lower.includes("carrell") || lower.includes("mulett")) return r.courseCode === "FORMAZ_CARRELLI";
      if (lower.includes("ple") || lower.includes("piattaform")) return r.courseCode === "FORMAZ_PLE";
      if (lower.includes("gru")) return r.courseCode === "FORMAZ_GRU_AUTOCARRO";
      if (lower.includes("trattor")) return r.courseCode === "FORMAZ_TRATTORI";
      if (lower.includes("ponte") || lower.includes("sollevat")) return r.courseCode === "FORMAZ_PONTI_SOLLEVATORI";
      if (lower.includes("affettat") || lower.includes("impastat") || lower.includes("tritacarn"))
        return r.courseCode === "FORMAZ_MACCHINE_ALIMENTARI";
      if (lower.includes("saldat")) return r.courseCode === "FORMAZ_SALDATURA";
      return false;
    });

    if (!reqDef) {
      reqDef = {
        courseCode: `FORMAZ_SPECIFICA_${machine.id.slice(-6).toUpperCase()}`,
        courseTitle: `Addestramento Uso Sicuro ${machine.name}`,
        normReference: "D.Lgs. 81/2008 art. 71 c. 7 e art. 73 c. 4",
        minHours: 4,
        frequencyYears: 5,
        requiresPatentinoAccordoSR: false,
        targetRoleDescription: `Operatore autorizzato all'uso di ${machine.name}`,
      };
    }

    // Evita duplicazione se assegnate 2 macchine simili (es. 2 muletti)
    if (!plannedItems.some((item) => item.id === reqDef!.courseCode)) {
      plannedItems.push({
        id: reqDef.courseCode,
        code: reqDef.courseCode,
        name: reqDef.courseTitle,
        category: "attrezzatura",
        categoryLabel: reqDef.requiresPatentinoAccordoSR
          ? "Abilitazione Patentino Accordo S-R"
          : "Addestramento Attrezzature Art. 73",
        normReference: reqDef.normReference,
        minHours: reqDef.minHours,
        frequencyYears: reqDef.frequencyYears,
        isMandatory: true,
        reason: `Operatore assegnato a: ${machine.name} (${machine.brand || ""} ${machine.model || ""})`,
        status: "da_svolgere",
        statusLabel: "Da Svolgere",
        statusColor: "#dc2626",
        statusBg: "#fee2e2",
      });
    }
  }

  // -------------------------------------------------------------------------
  // 6. INCROCIO CON I TRAINING RECORDS DEL LAVORATORE
  // -------------------------------------------------------------------------
  const now = Date.now();

  for (const item of plannedItems) {
    // Cerca nei corsi del catalogo aziendale se c'è corrispondenza per facilitare registrazione
    const matchedCatalog = catalogCourses.find(
      (c) =>
        normalizeStr(c.name).includes(normalizeStr(item.name)) ||
        normalizeStr(item.name).includes(normalizeStr(c.name)) ||
        (item.code && normalizeStr(c.name).includes(normalizeStr(item.code))),
    );
    if (matchedCatalog) {
      item.matchedCatalogCourseId = matchedCatalog.id;
    }

    // Trova il record dell'impiegato corrispondente
    const matchingRecord = records.find((rec) => {
      const recCourseName = normalizeStr(rec.course?.name);
      const targetName = normalizeStr(item.name);
      if (item.matchedCatalogCourseId && rec.course?.id === item.matchedCatalogCourseId) return true;
      if (recCourseName && (recCourseName.includes(targetName) || targetName.includes(recCourseName))) return true;

      // Match euristico speciale per categorie note
      if (item.category === "generale" && recCourseName.includes("generale")) return true;
      if (item.category === "specifica" && recCourseName.includes("specifica")) return true;
      if (item.category === "haccp" && (recCourseName.includes("haccp") || recCourseName.includes("alimentarista")))
        return true;
      if (item.id === "FORMAZ_CARRELLI" && (recCourseName.includes("carrell") || recCourseName.includes("mulett")))
        return true;
      if (item.id === "FORMAZ_PLE" && (recCourseName.includes("ple") || recCourseName.includes("piattaform")))
        return true;
      if (item.id === "FORMAZ_RUOLO_PREPOSTO" && recCourseName.includes("prepost")) return true;
      if (item.id === "FORMAZ_RUOLO_RLS" && recCourseName.includes("rls")) return true;
      if (
        item.id.includes("ANTINCENDIO") &&
        recCourseName.includes("antincendio")
      ) {
        return true;
      }
      if (
        item.id.includes("PRIMO_SOCCORSO") &&
        (recCourseName.includes("primo soccorso") || recCourseName.includes("soccorso"))
      ) {
        return true;
      }

      return false;
    });

    if (matchingRecord) {
      item.record = matchingRecord;
      item.completedAt = matchingRecord.completedAt || undefined;
      item.expiresAt = matchingRecord.expiresAt || undefined;
      item.hoursDone = matchingRecord.hoursDone ?? matchingRecord.course?.minHours ?? item.minHours;
      item.certificateNumber = matchingRecord.certificateNumber || undefined;

      if (!matchingRecord.expiresAt) {
        // Formazione permanente (es. Generale) o senza scadenza impostata
        item.status = "valido";
        item.statusLabel = "Conforme / Valido";
        item.statusColor = "#16a34a";
        item.statusBg = "#dcfce7";
      } else {
        const expiresTime = new Date(matchingRecord.expiresAt).getTime();
        const daysRemaining = Math.ceil((expiresTime - now) / (1000 * 60 * 60 * 24));
        item.daysRemaining = daysRemaining;

        if (daysRemaining < 0) {
          item.status = "scaduto";
          item.statusLabel = `SCADUTO da ${Math.abs(daysRemaining)}gg`;
          item.statusColor = "#dc2626";
          item.statusBg = "#fee2e2";
        } else if (daysRemaining <= 60) {
          item.status = "in_scadenza";
          item.statusLabel = `In scadenza (${daysRemaining}gg)`;
          item.statusColor = "#d97706";
          item.statusBg = "#fef3c7";
        } else {
          item.status = "valido";
          item.statusLabel = `Valido (${daysRemaining}gg)`;
          item.statusColor = "#16a34a";
          item.statusBg = "#dcfce7";
        }
      }
    }
  }

  // Conteggi e percentuali
  const totalRequiredCourses = plannedItems.length;
  const completedCoursesCount = plannedItems.filter((i) => i.status === "valido").length;
  const expiringCoursesCount = plannedItems.filter((i) => i.status === "in_scadenza").length;
  const expiredCoursesCount = plannedItems.filter((i) => i.status === "scaduto").length;
  const missingCoursesCount = plannedItems.filter((i) => i.status === "da_svolgere").length;

  const totalRequiredHours = plannedItems.reduce((acc, curr) => acc + curr.minHours, 0);
  const totalCompletedHours = plannedItems.reduce(
    (acc, curr) => acc + (curr.status === "valido" ? (curr.hoursDone || curr.minHours) : 0),
    0,
  );

  const compliancePercentage =
    totalRequiredCourses > 0
      ? Math.round((completedCoursesCount / totalRequiredCourses) * 100)
      : 100;

  let overallStatus: "conforme" | "attenzione" | "critico" = "conforme";
  if (expiredCoursesCount > 0 || missingCoursesCount > 0) {
    overallStatus = expiredCoursesCount > 0 || missingCoursesCount >= 2 ? "critico" : "attenzione";
  } else if (expiringCoursesCount > 0) {
    overallStatus = "attenzione";
  }

  return {
    employeeId: employee.id,
    employeeFullName: `${employee.lastName} ${employee.firstName}`,
    fiscalCode: employee.fiscalCode || undefined,
    role: roleName,
    cleanDepartment: meta.department || "—",
    contractType: meta.contractType || undefined,
    weeklyHours: meta.weeklyHours || undefined,
    birthDate: meta.birthDate || undefined,
    birthPlace: meta.birthPlace || undefined,
    hireDate: employee.hireDate || undefined,
    safetyRoles: assignedSafetyRoles,
    assignedMachines,
    totalRequiredCourses,
    completedCoursesCount,
    expiringCoursesCount,
    expiredCoursesCount,
    missingCoursesCount,
    totalRequiredHours,
    totalCompletedHours,
    compliancePercentage,
    overallStatus,
    courses: plannedItems,
  };
}

// -----------------------------------------------------------------------------
// SINTESI FABBISOGNO FORMATIVO AZIENDALE
// -----------------------------------------------------------------------------
export interface CompanyTrainingNeedSynthesis {
  companyName: string;
  atecoCode: string;
  riskLevel: "basso" | "medio" | "alto";
  riskLabel: string;
  totalEmployees: number;
  individualPlans: IndividualTrainingPlan[];
  overallComplianceScore: number;
  totalRequiredCoursesCount: number;
  totalValidCoursesCount: number;
  totalExpiringCoursesCount: number;
  totalExpiredCoursesCount: number;
  totalMissingCoursesCount: number;
  mandatoryEquipmentCourses: Array<{ code: string; title: string; machineCount: number; hours: number }>;
  safetyRolesCoverage: {
    hasRspp: boolean;
    hasRls: boolean;
    prepostiCount: number;
    antincendioCount: number;
    primoSoccorsoCount: number;
  };
}

export function computeCompanyTrainingNeed(
  company: Company | undefined,
  employees: Employee[],
  machines: Machine[],
  courses: TrainingCourse[],
): CompanyTrainingNeedSynthesis {
  const atecoCode = company?.atecoCode || "";
  const risk = determineRiskLevel(atecoCode);

  const individualPlans = employees.map((emp) =>
    computeIndividualTrainingPlan(emp, {
      company,
      atecoCode,
      companyMachines: machines,
      availableCourses: courses,
    }),
  );

  let totalRequired = 0;
  let totalValid = 0;
  let totalExpiring = 0;
  let totalExpired = 0;
  let totalMissing = 0;

  for (const plan of individualPlans) {
    totalRequired += plan.totalRequiredCourses;
    totalValid += plan.completedCoursesCount;
    totalExpiring += plan.expiringCoursesCount;
    totalExpired += plan.expiredCoursesCount;
    totalMissing += plan.missingCoursesCount;
  }

  const overallComplianceScore =
    totalRequired > 0 ? Math.round((totalValid / totalRequired) * 100) : employees.length === 0 ? 0 : 100;

  // Analisi macchine aziendali che impongono patentino o corsi
  const equipMap = new Map<string, { code: string; title: string; count: number; hours: number }>();
  for (const m of machines) {
    const lower = m.name.toLowerCase();
    let courseCode = "FORMAZ_ATTREZZATURA";
    let title = `Abilitazione Uso ${m.name}`;
    let hours = 4;

    if (lower.includes("carrell") || lower.includes("mulett")) {
      courseCode = "FORMAZ_CARRELLI";
      title = "Carrelli Elevatori Semoventi (Patentino Muletto)";
      hours = 12;
    } else if (lower.includes("ple") || lower.includes("piattaform")) {
      courseCode = "FORMAZ_PLE";
      title = "Piattaforme di Lavoro Elevabili (PLE)";
      hours = 10;
    } else if (lower.includes("gru")) {
      courseCode = "FORMAZ_GRU_AUTOCARRO";
      title = "Gru per Autocarro";
      hours = 12;
    } else if (lower.includes("trattor")) {
      courseCode = "FORMAZ_TRATTORI";
      title = "Trattori Agricoli o Forestali";
      hours = 8;
    } else if (lower.includes("affettat") || lower.includes("impastat") || lower.includes("tritacarn")) {
      courseCode = "FORMAZ_MACCHINE_ALIMENTARI";
      title = "Macchine Alimentari (Affettatrici, Impastatrici)";
      hours = 4;
    }

    if (!equipMap.has(courseCode)) {
      equipMap.set(courseCode, { code: courseCode, title, count: 1, hours });
    } else {
      equipMap.get(courseCode)!.count += 1;
    }
  }

  const mandatoryEquipmentCourses = Array.from(equipMap.values()).map((item) => ({
    code: item.code,
    title: item.title,
    machineCount: item.count,
    hours: item.hours,
  }));

  // Copertura ruoli di sicurezza
  let hasRspp = false;
  let hasRls = false;
  let prepostiCount = 0;
  let antincendioCount = 0;
  let primoSoccorsoCount = 0;

  for (const emp of employees) {
    const meta = extractEmployeeMetadata(emp);
    const roles = meta.safetyRoles || [];
    if (roles.includes("rspp_dl")) hasRspp = true;
    if (roles.includes("rls")) hasRls = true;
    if (roles.includes("preposto")) prepostiCount++;
    if (roles.some((r) => r.startsWith("antincendio"))) antincendioCount++;
    if (roles.some((r) => r.startsWith("primo_soccorso"))) primoSoccorsoCount++;
  }

  return {
    companyName: company?.name || "Azienda Selezionata",
    atecoCode,
    riskLevel: risk.level,
    riskLabel: risk.label,
    totalEmployees: employees.length,
    individualPlans,
    overallComplianceScore,
    totalRequiredCoursesCount: totalRequired,
    totalValidCoursesCount: totalValid,
    totalExpiringCoursesCount: totalExpiring,
    totalExpiredCoursesCount: totalExpired,
    totalMissingCoursesCount: totalMissing,
    mandatoryEquipmentCourses,
    safetyRolesCoverage: {
      hasRspp,
      hasRls,
      prepostiCount,
      antincendioCount,
      primoSoccorsoCount,
    },
  };
}
