// Step 5 "Formazione" — Integrazione Avanzata con Macchinari & Attrezzature Censite (Accordo Stato-Regioni 22/02/2012)
// e Progettazione Formativa Individuale (D.Lgs. 81/2008 art. 37, Legge 215/2021).

import { useEffect, useMemo, useState } from "react";
import {
  Company,
  Employee,
  fetchEmployees,
  fetchTrainingCourses,
  fetchMachinesPaged,
  createTrainingCourse,
  createTrainingRecord,
  deleteEmployee,
  TrainingCourse,
  Machine,
} from "../../api";
import ScadenzeTab from "../training/ScadenzeTab";
import EmployeesTab from "../training/EmployeesTab";
import CoursesTab from "../training/CoursesTab";
import { TabButton } from "../training/_shared";
import {
  TRAINING_REQUIREMENTS_LIBRARY,
  parseMachineMetadata,
  MachineTrainingRequirementDef,
} from "./normativeMachineCatalog";
import {
  computeCompanyTrainingNeed,
  computeIndividualTrainingPlan,
  PlannedCourseItem,
} from "../../lib/individualTrainingPlan";
import IndividualPlanCard from "../training/IndividualPlanCard";
import EmployeeFullModal from "../training/EmployeeFullModal";
import TrainingRecordModal from "../training/TrainingRecordModal";
import {
  GraduationCap,
  UserPlus,
  ShieldCheck,
  Award,
  Wrench,
  Search,
  Users,
} from "lucide-react";

export type TrainingSubTab =
  | "individualPlans"
  | "equipmentCourses"
  | "expiry"
  | "employees"
  | "courses";

interface Step5FormazioneProps {
  token: string;
  companyId: string;
  companies: Company[];
  atecoCode?: string;
}

export default function Step5Formazione({
  token,
  companyId,
  companies,
  atecoCode,
}: Step5FormazioneProps) {
  const [tab, setTab] = useState<TrainingSubTab>("individualPlans");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [creatingCourseCode, setCreatingCourseCode] = useState<string | null>(null);

  // Modali per anagrafica e attestati
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [recordTarget, setRecordTarget] = useState<{
    employee: Employee;
    course?: PlannedCourseItem;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modale per assegnare rapidamente abilitazione da macchine censite
  const [assignModalReq, setAssignModalReq] = useState<MachineTrainingRequirementDef | null>(null);
  const [assignEmployeeId, setAssignEmployeeId] = useState("");
  const [assignCertNumber, setAssignCertNumber] = useState("");
  const [assignHours, setAssignHours] = useState(12);
  const [assignCompletedAt, setAssignCompletedAt] = useState(new Date().toISOString().split("T")[0]);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  const scopedCompanies = useMemo(
    () => companies.filter((c) => c.id === companyId),
    [companies, companyId],
  );

  const currentCompany = useMemo(
    () => companies.find((c) => c.id === companyId),
    [companies, companyId],
  );

  useEffect(() => {
    if (companyId) void reloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, companyId]);

  async function reloadAll() {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const [emps, crs, machRes] = await Promise.all([
        fetchEmployees(token, { companyId, isActive: true }),
        fetchTrainingCourses(token),
        fetchMachinesPaged(token, { companyId }),
      ]);
      setEmployees(emps);
      setCourses(crs);
      setMachines(machRes.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore caricamento formazione");
    } finally {
      setLoading(false);
    }
  }

  // Fabbisogno Formativo Aziendale
  const companyNeed = useMemo(() => {
    return computeCompanyTrainingNeed(currentCompany, employees, machines, courses);
  }, [currentCompany, employees, machines, courses]);

  // Piani formativi individuali filtrati per ricerca
  const filteredEmployeesWithPlans = useMemo(() => {
    return employees
      .filter((emp) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
          `${emp.lastName} ${emp.firstName}`.toLowerCase().includes(q) ||
          (emp.role || "").toLowerCase().includes(q) ||
          (emp.fiscalCode || "").toLowerCase().includes(q)
        );
      })
      .map((emp) => {
        const plan = computeIndividualTrainingPlan(emp, {
          company: currentCompany,
          atecoCode: atecoCode || currentCompany?.atecoCode || undefined,
          companyMachines: machines,
          availableCourses: courses,
        });
        return { emp, plan };
      });
  }, [employees, searchTerm, currentCompany, atecoCode, machines, courses]);

  // Identifica l'elenco dei requisiti formativi specifici richiesti dalle macchine censite
  const equipmentTrainingRequirements = useMemo(() => {
    const map = new Map<
      string,
      {
        requirement: MachineTrainingRequirementDef;
        machineNames: string[];
        authorizedWorkerIds: Set<string>;
        authorizedCustomNames: Set<string>;
      }
    >();

    for (const m of machines) {
      const meta = parseMachineMetadata(m.note);
      let courseCode = meta.requiredCourseCode;

      if (!courseCode) {
        const lower = m.name.toLowerCase();
        if (lower.includes("carrell") || lower.includes("mulett")) courseCode = "FORMAZ_CARRELLI";
        else if (lower.includes("ple") || lower.includes("piattaform")) courseCode = "FORMAZ_PLE";
        else if (lower.includes("gru")) courseCode = "FORMAZ_GRU_AUTOCARRO";
        else if (lower.includes("trattor")) courseCode = "FORMAZ_TRATTORI";
        else if (lower.includes("sollevator") || lower.includes("ponte")) courseCode = "FORMAZ_PONTI_SOLLEVATORI";
        else if (lower.includes("affettat") || lower.includes("impastat") || lower.includes("tritacarn")) courseCode = "FORMAZ_MACCHINE_ALIMENTARI";
        else if (lower.includes("saldat")) courseCode = "FORMAZ_SALDATURA";
        else if (lower.includes("tornio") || lower.includes("fresa") || lower.includes("mola")) courseCode = "FORMAZ_MACCHINE_METALLO";
        else if (lower.includes("sega") || lower.includes("pialla") || lower.includes("toupie")) courseCode = "FORMAZ_MACCHINE_LEGNO";
        else if (lower.includes("transpallet")) courseCode = "FORMAZ_TRANSPALLET";
        else courseCode = "FORMAZ_ATTREZZATURE_BASE";
      }

      const def =
        Object.values(TRAINING_REQUIREMENTS_LIBRARY).find((r) => r.courseCode === courseCode) || {
          courseCode,
          courseTitle: meta.requiredCourseTitle || `Formazione Specifica Uso ${m.name}`,
          normReference: "D.Lgs. 81/2008 art. 73 c. 4",
          minHours: 4,
          frequencyYears: 5,
          requiresPatentinoAccordoSR: false,
          targetRoleDescription: `Operatori addetti all'uso di ${m.name}`,
        };

      if (!map.has(def.courseCode)) {
        map.set(def.courseCode, {
          requirement: def,
          machineNames: [m.name],
          authorizedWorkerIds: new Set(meta.authorizedWorkerIds || []),
          authorizedCustomNames: new Set(meta.authorizedWorkerNames || []),
        });
      } else {
        const existing = map.get(def.courseCode)!;
        existing.machineNames.push(m.name);
        (meta.authorizedWorkerIds || []).forEach((id) => existing.authorizedWorkerIds.add(id));
        (meta.authorizedCustomNames || []).forEach((name) => existing.authorizedCustomNames.add(name));
      }
    }

    return Array.from(map.values()).map((item) => ({
      requirement: item.requirement,
      machineNames: item.machineNames,
      authorizedWorkerIds: Array.from(item.authorizedWorkerIds),
      authorizedCustomNames: Array.from(item.authorizedCustomNames),
    }));
  }, [machines]);

  async function handleDeleteEmployee(empId: string) {
    if (!window.confirm("Disattivare il lavoratore selezionato? I dati rimarranno conservati a norma di legge.")) {
      return;
    }
    setError(null);
    try {
      await deleteEmployee(token, empId);
      setActionSuccess("✓ Lavoratore disattivato con successo.");
      await reloadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore eliminazione lavoratore");
    }
  }

  // Creazione corso attrezzature nel catalogo generale se non presente
  async function handleCreateCourseInCatalog(req: MachineTrainingRequirementDef) {
    setCreatingCourseCode(req.courseCode);
    setError(null);
    setActionSuccess(null);
    try {
      await createTrainingCourse(token, {
        name: req.courseTitle,
        description: `${req.targetRoleDescription}. Riferimento normativo: ${req.normReference}`,
        targetAudience: req.targetRoleDescription,
        minHours: req.minHours,
        frequencyYears: req.frequencyYears,
        normReference: req.normReference,
        domain: "safety",
        isActive: true,
      });

      setActionSuccess(`✓ Corso "${req.courseTitle}" creato e registrato nel catalogo aziendale con successo!`);
      await reloadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore creazione corso");
    } finally {
      setCreatingCourseCode(null);
    }
  }

  // Assegnazione abilitazione a un dipendente da macchine censite
  async function handleAssignCertificate(e: React.FormEvent) {
    e.preventDefault();
    if (!assignModalReq || !assignEmployeeId) return;

    const existingCourse = courses.find(
      (c) =>
        c.name.toLowerCase() === assignModalReq.courseTitle.toLowerCase() ||
        c.normReference.toLowerCase().includes(assignModalReq.normReference.toLowerCase()),
    );

    let targetCourseId = existingCourse?.id;

    setAssignSubmitting(true);
    setError(null);
    try {
      if (!targetCourseId) {
        const created = await createTrainingCourse(token, {
          name: assignModalReq.courseTitle,
          description: assignModalReq.targetRoleDescription,
          targetAudience: assignModalReq.targetRoleDescription,
          minHours: assignHours || assignModalReq.minHours,
          frequencyYears: assignModalReq.frequencyYears,
          normReference: assignModalReq.normReference,
          domain: "safety",
          isActive: true,
        });
        targetCourseId = created.id;
      }

      const completedDate = new Date(assignCompletedAt);
      const expiresDate = new Date(completedDate);
      expiresDate.setFullYear(expiresDate.getFullYear() + assignModalReq.frequencyYears);

      await createTrainingRecord(token, {
        employeeId: assignEmployeeId,
        courseId: targetCourseId,
        completedAt: completedDate.toISOString(),
        expiresAt: expiresDate.toISOString(),
        hoursDone: assignHours,
        certificateNumber: assignCertNumber.trim() || undefined,
        note: `Abilitazione specifica per attrezzature di lavoro ex ${assignModalReq.normReference}`,
      });

      setActionSuccess(`✓ Attestato/Abilitazione registrato per il dipendente selezionato!`);
      setAssignModalReq(null);
      setAssignEmployeeId("");
      setAssignCertNumber("");
      await reloadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore assegnazione abilitazione");
    } finally {
      setAssignSubmitting(false);
    }
  }

  if (!companyId) {
    return (
      <div className="panel section-panel" style={{ padding: 20 }}>
        <h3>Formazione</h3>
        <p>Seleziona o crea prima un&apos;azienda al passo &quot;Dati Azienda&quot; per procedere con la formazione.</p>
      </div>
    );
  }

  return (
    <div className="panel section-panel" style={{ padding: "20px" }}>
      <header style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 6px 0", fontSize: "22px", color: "var(--color-primary, #0f172a)" }}>
          Formazione Lavoratori e Abilitazioni di Legge
        </h3>
        <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
          Monitoraggio fabbisogni formativi D.Lgs. 81/08, abilitazioni macchinari (Accordo Stato-Regioni 22/02/2012) e progettazione formativa individuale dei dipendenti.
        </p>
      </header>

      {/* Barra di Navigazione Sottoschede */}
      <div
        className="tab-bar"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
          borderBottom: "2px solid #e2e8f0",
        }}
      >
        <button
          type="button"
          onClick={() => setTab("individualPlans")}
          style={{
            padding: "10px 16px",
            border: "none",
            borderBottom: tab === "individualPlans" ? "3px solid #0284c7" : "3px solid transparent",
            backgroundColor: "transparent",
            color: tab === "individualPlans" ? "#0284c7" : "#64748b",
            fontWeight: tab === "individualPlans" ? 700 : 500,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>🎓 Progettazione Formativa Individuale ({employees.length})</span>
        </button>

        {equipmentTrainingRequirements.length > 0 && (
          <button
            type="button"
            onClick={() => setTab("equipmentCourses")}
            style={{
              padding: "10px 16px",
              border: "none",
              borderBottom: tab === "equipmentCourses" ? "3px solid #0284c7" : "3px solid transparent",
              backgroundColor: "transparent",
              color: tab === "equipmentCourses" ? "#0284c7" : "#64748b",
              fontWeight: tab === "equipmentCourses" ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>🚜 Abilitazione Macchine Censite ({equipmentTrainingRequirements.length})</span>
          </button>
        )}

        <TabButton active={tab === "expiry"} onClick={() => setTab("expiry")}>
          Scadenze & Stato
        </TabButton>
        <TabButton active={tab === "employees"} onClick={() => setTab("employees")}>
          Dipendenti ({employees.length})
        </TabButton>
        <TabButton active={tab === "courses"} onClick={() => setTab("courses")}>
          Catalogo Corsi ({courses.length})
        </TabButton>
      </div>

      {actionSuccess && (
        <div
          style={{
            backgroundColor: "#dcfce7",
            color: "#166534",
            padding: "10px 16px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {actionSuccess}
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            padding: "10px 16px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {loading && <p style={{ color: "#64748b" }}>Caricamento dati formazione...</p>}

      {/* ========================================================================= */}
      {/* SOTTOSCHEDA 1: PROGETTAZIONE FORMATIVA INDIVIDUALE (PRINCIPALE)            */}
      {/* ========================================================================= */}
      {tab === "individualPlans" && (
        <div>
          {/* BOX SINTESI FABBISOGNO FORMATIVO AZIENDALE */}
          <div
            style={{
              backgroundColor: "#0f172c",
              color: "#ffffff",
              borderRadius: "12px",
              padding: "20px 24px",
              marginBottom: "24px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "16px",
                borderBottom: "1px solid #334155",
                paddingBottom: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "22px" }}>🏛️</span>
                  <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#f8fafc" }}>
                    Fabbisogno Formativo Aziendale D.Lgs. 81/08 & CCNL
                  </h4>
                  <span
                    style={{
                      backgroundColor:
                        companyNeed.riskLevel === "alto"
                          ? "#ef4444"
                          : companyNeed.riskLevel === "medio"
                          ? "#f59e0b"
                          : "#10b981",
                      color: "#ffffff",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {companyNeed.riskLabel}
                  </span>
                </div>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#94a3b8" }}>
                  Azienda: <strong style={{ color: "#e2e8f0" }}>{companyNeed.companyName}</strong>
                  {companyNeed.atecoCode && (
                    <> · Codice ATECO: <strong style={{ color: "#e2e8f0" }}>{companyNeed.atecoCode}</strong></>
                  )}
                </p>
              </div>

              {/* Tasto ben visibile: + Aggiungi Lavoratore / Dipendente */}
              <button
                type="button"
                onClick={() => {
                  setEditingEmployee(null);
                  setShowEmployeeModal(true);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 18px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
                title="Inserisci un nuovo lavoratore con mansione e ruoli"
              >
                <UserPlus size={17} />
                + Aggiungi Lavoratore / Dipendente
              </button>
            </div>

            {/* Grid 4 Indicatori Fabbisogno */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "14px",
              }}
            >
              {/* Card 1: Organico Censito */}
              <div
                style={{
                  backgroundColor: "#1e293b",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                }}
              >
                <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Users size={14} color="#38bdf8" />
                  <span>Organico Censito</span>
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", marginTop: "4px" }}>
                  {companyNeed.totalEmployees}{" "}
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#94a3b8" }}>
                    {companyNeed.totalEmployees === 1 ? "lavoratore" : "lavoratori"}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "11.5px",
                    color: companyNeed.totalEmployees === 0 ? "#f87171" : "#4ade80",
                    marginTop: "4px",
                  }}
                >
                  {companyNeed.totalEmployees === 0
                    ? "⚠️ Nessun dipendente registrato"
                    : `✓ ${companyNeed.totalRequiredCoursesCount} corsi di legge previsti`}
                </div>
              </div>

              {/* Card 2: Conformità Globale */}
              <div
                style={{
                  backgroundColor: "#1e293b",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                }}
              >
                <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Award size={14} color="#38bdf8" />
                  <span>Conformità Formativa</span>
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", marginTop: "4px" }}>
                  {companyNeed.overallComplianceScore}%
                </div>
                <div
                  style={{
                    marginTop: "4px",
                    height: "6px",
                    backgroundColor: "#334155",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${companyNeed.overallComplianceScore}%`,
                      height: "100%",
                      backgroundColor:
                        companyNeed.overallComplianceScore >= 80
                          ? "#22c55e"
                          : companyNeed.overallComplianceScore >= 50
                          ? "#f59e0b"
                          : "#ef4444",
                    }}
                  />
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                  {companyNeed.totalValidCoursesCount} validi · {companyNeed.totalMissingCoursesCount} da svolgere
                </div>
              </div>

              {/* Card 3: Corsi Attrezzature & Macchine */}
              <div
                style={{
                  backgroundColor: "#1e293b",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                }}
              >
                <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Wrench size={14} color="#38bdf8" />
                  <span>Macchine & Patentini</span>
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", marginTop: "4px" }}>
                  {companyNeed.mandatoryEquipmentCourses.length}{" "}
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#94a3b8" }}>abilitazioni</span>
                </div>
                <div style={{ fontSize: "11.5px", color: "#cbd5e1", marginTop: "4px" }}>
                  {machines.length} macchine censite ex Step 4
                </div>
              </div>

              {/* Card 4: Presidio Ruoli di Sicurezza */}
              <div
                style={{
                  backgroundColor: "#1e293b",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                }}
              >
                <div style={{ fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={14} color="#38bdf8" />
                  <span>Ruoli di Sicurezza</span>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: companyNeed.safetyRolesCoverage.hasRspp ? "#065f46" : "#7f1d1d",
                      color: "#ffffff",
                      fontWeight: 600,
                    }}
                  >
                    RSPP {companyNeed.safetyRolesCoverage.hasRspp ? "✓" : "✗"}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: companyNeed.safetyRolesCoverage.hasRls ? "#065f46" : "#475569",
                      color: "#ffffff",
                      fontWeight: 600,
                    }}
                  >
                    RLS {companyNeed.safetyRolesCoverage.hasRls ? "✓" : "—"}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: companyNeed.safetyRolesCoverage.antincendioCount > 0 ? "#065f46" : "#7f1d1d",
                      color: "#ffffff",
                      fontWeight: 600,
                    }}
                  >
                    Antincendio ({companyNeed.safetyRolesCoverage.antincendioCount})
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: companyNeed.safetyRolesCoverage.primoSoccorsoCount > 0 ? "#065f46" : "#7f1d1d",
                      color: "#ffffff",
                      fontWeight: 600,
                    }}
                  >
                    Primo Soccorso ({companyNeed.safetyRolesCoverage.primoSoccorsoCount})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ELENCO DELLE SCHEDE INDIVIDUALI DEI LAVORATORI CENSITI */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <GraduationCap size={20} color="#0284c7" />
                <h4 style={{ margin: 0, fontSize: "16px", color: "var(--navy-900, #17203c)", fontWeight: 700 }}>
                  Schede Lavoratori & Piani Formativi Individuali ({employees.length})
                </h4>
              </div>

              {employees.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ position: "relative", minWidth: "260px" }}>
                    <Search
                      size={14}
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#94a3b8",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Cerca lavoratore per nome, mansione o CF..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 10px 6px 30px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12.5px",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setEditingEmployee(null);
                      setShowEmployeeModal(true);
                    }}
                    style={{ fontSize: "12.5px", padding: "6px 12px" }}
                  >
                    + Aggiungi Lavoratore
                  </button>
                </div>
              )}
            </div>

            {employees.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "10px",
                  padding: "36px 24px",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundColor: "#e0f2fe",
                    color: "#0284c7",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto",
                  }}
                >
                  <UserPlus size={28} />
                </div>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "17px", color: "#0f172a" }}>
                  Nessun Lavoratore Ancora Censito per questa Azienda
                </h4>
                <p
                  style={{
                    margin: "0 auto 20px auto",
                    maxWidth: "560px",
                    color: "#64748b",
                    fontSize: "13.5px",
                    lineHeight: 1.5,
                  }}
                >
                  La sezione Formazione è pienamente operativa: durante il sopralluogo puoi inserire all&apos;istante
                  i lavoratori sul posto con mansione, contratto, ore lavorative, ruoli di sicurezza e macchinari assegnati.
                  Il sistema genererà immediatamente la loro <strong>Progettazione Formativa Individuale di legge</strong>.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setEditingEmployee(null);
                    setShowEmployeeModal(true);
                  }}
                  style={{ padding: "10px 20px", fontSize: "14px", fontWeight: 700 }}
                >
                  + Aggiungi Lavoratore / Dipendente
                </button>
              </div>
            ) : (
              <div>
                {filteredEmployeesWithPlans.map(({ emp, plan }) => (
                  <IndividualPlanCard
                    key={emp.id}
                    employee={emp}
                    plan={plan}
                    courses={courses}
                    onEdit={(target) => {
                      setEditingEmployee(target);
                      setShowEmployeeModal(true);
                    }}
                    onDelete={handleDeleteEmployee}
                    onAddTrainingRecord={(target, course) => {
                      setRecordTarget({ employee: target, course });
                    }}
                  />
                ))}

                {filteredEmployeesWithPlans.length === 0 && (
                  <div
                    style={{
                      padding: "24px",
                      textAlign: "center",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px dashed #cbd5e1",
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    Nessun lavoratore corrisponde alla ricerca &quot;{searchTerm}&quot;.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE: CORSI SPECIFICI PER MACCHINE CENSITE (COLLEGAMENTO CON STEP 4)   */}
      {/* ========================================================================= */}
      {tab === "equipmentCourses" && (
        <div>
          <div
            style={{
              backgroundColor: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "8px",
              padding: "14px 18px",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: "20px" }}>⚡</span>
              <h4 style={{ margin: 0, fontSize: "16px", color: "#0369a1" }}>
                Sincronizzazione Automatica con i Macchinari Censiti nello Step 4
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "#0284c7" }}>
              In base alle attrezzature e macchine registrate per questa azienda, la legge (D.Lgs. 81/2008 e Accordo Stato-Regioni)
              impone i seguenti corsi di abilitazione e addestramento specifico per i relativi operatori:
            </p>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {equipmentTrainingRequirements.map(({ requirement: req, machineNames, authorizedWorkerIds, authorizedCustomNames }) => {
              const matchedCourseInCatalog = courses.find(
                (c) =>
                  c.name.toLowerCase() === req.courseTitle.toLowerCase() ||
                  c.normReference.toLowerCase().includes(req.normReference.toLowerCase()),
              );

              const certifiedEmployees = matchedCourseInCatalog
                ? employees.filter((emp) =>
                    emp.trainingRecords?.some((r) => r.courseId === matchedCourseInCatalog.id),
                  )
                : [];

              const missingCount = Math.max(0, employees.length - certifiedEmployees.length);
              const designatedEmployees = employees.filter((emp) => authorizedWorkerIds.includes(emp.id));
              const designatedCustomList = authorizedCustomNames || [];

              return (
                <div
                  key={req.courseCode}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    padding: "18px 20px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <h4 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>
                          {req.courseTitle}
                        </h4>
                        {req.requiresPatentinoAccordoSR ? (
                          <span
                            style={{
                              backgroundColor: "#fee2e2",
                              color: "#dc2626",
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 700,
                              border: "1px solid #fca5a5",
                            }}
                          >
                            PATENTINO OBBLIGATORIO ACCORDO S-R
                          </span>
                        ) : (
                          <span
                            style={{
                              backgroundColor: "#e0e7ff",
                              color: "#3730a3",
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 600,
                            }}
                          >
                            ADDESTRAMENTO SPECIFICO ART. 73 C. 4
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: "13px", color: "#475569", marginTop: 4 }}>
                        ⚖️ <strong>Norma:</strong> {req.normReference} | ⏱️ <strong>Durata:</strong> {req.minHours} ore | 🔄 <strong>Aggiornamento:</strong> ogni {req.frequencyYears} anni
                      </div>

                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: 4 }}>
                        Macchinari collegati in azienda:{" "}
                        <strong style={{ color: "#334155" }}>{machineNames.join(", ")}</strong>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {matchedCourseInCatalog ? (
                        <span
                          style={{
                            backgroundColor: "#dcfce7",
                            color: "#15803d",
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          ✓ Presente nel Catalogo Corsi
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={creatingCourseCode === req.courseCode}
                          onClick={() => handleCreateCourseInCatalog(req)}
                          style={{
                            backgroundColor: "#0284c7",
                            color: "#fff",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: 6,
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {creatingCourseCode === req.courseCode
                            ? "Registrazione..."
                            : "⚡ Registra Corso nel Catalogo Aziendale"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 12,
                      marginTop: 12,
                      padding: "10px 14px",
                      backgroundColor: "#f8fafc",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: "13px" }}>
                      <div>
                        Operatori aziendali abilitati:{" "}
                        <strong style={{ color: "#16a34a" }}>{certifiedEmployees.length}</strong>
                      </div>
                      <div>
                        Operatori da abilitare / senza patentino:{" "}
                        <strong style={{ color: missingCount > 0 ? "#dc2626" : "#475569" }}>
                          {missingCount}
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAssignModalReq(req);
                        setAssignEmployeeId("");
                        setAssignHours(req.minHours);
                      }}
                      style={{
                        backgroundColor: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        color: "#334155",
                        padding: "5px 12px",
                        borderRadius: 6,
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      ➕ Assegna Patentino a Dipendente
                    </button>
                  </div>

                  {designatedEmployees.length > 0 || designatedCustomList.length > 0 ? (
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed #cbd5e1" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#1e293b",
                          marginBottom: 8,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span>👥</span>
                        <span>
                          Lavoratori Addetti alle Macchine Selezionati nello Step 4 (
                          {designatedEmployees.length + designatedCustomList.length}):
                        </span>
                      </div>

                      <div style={{ display: "grid", gap: 8 }}>
                        {designatedEmployees.map((emp) => {
                          const rec = matchedCourseInCatalog
                            ? emp.trainingRecords?.find((r) => r.courseId === matchedCourseInCatalog.id)
                            : undefined;
                          const isCompliant = rec && (!rec.expiresAt || new Date(rec.expiresAt) > new Date());
                          const isExpired = rec && rec.expiresAt && new Date(rec.expiresAt) <= new Date();
                          const isMissing = !rec;

                          return (
                            <div
                              key={emp.id}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 8,
                                padding: "8px 12px",
                                borderRadius: 6,
                                backgroundColor: isCompliant ? "#f0fdf4" : isExpired ? "#fef2f2" : "#fffbeb",
                                border: `1px solid ${isCompliant ? "#bbf7d0" : isExpired ? "#fecaca" : "#fde68a"}`,
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                                  {emp.firstName} {emp.lastName}
                                </strong>
                                {emp.role && (
                                  <span style={{ fontSize: "11px", color: "#64748b" }}>({emp.role})</span>
                                )}
                                {isCompliant && (
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      color: "#16a34a",
                                      backgroundColor: "#dcfce7",
                                      padding: "2px 6px",
                                      borderRadius: 4,
                                    }}
                                  >
                                    ✅ In Regola{" "}
                                    {rec?.expiresAt
                                      ? `(Scad. ${new Date(rec.expiresAt).toLocaleDateString("it-IT")})`
                                      : ""}
                                    {rec?.certificateNumber ? ` - N. ${rec.certificateNumber}` : ""}
                                  </span>
                                )}
                                {isExpired && (
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      color: "#dc2626",
                                      backgroundColor: "#fee2e2",
                                      padding: "2px 6px",
                                      borderRadius: 4,
                                    }}
                                  >
                                    🔴 Scaduto il {new Date(rec!.expiresAt!).toLocaleDateString("it-IT")}
                                  </span>
                                )}
                                {isMissing && (
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      color: "#d97706",
                                      backgroundColor: "#fef3c7",
                                      padding: "2px 6px",
                                      borderRadius: 4,
                                    }}
                                  >
                                    ⚠️ Patentino / Attestato Mancante
                                  </span>
                                )}
                              </div>

                              <div>
                                {!isCompliant && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAssignModalReq(req);
                                      setAssignEmployeeId(emp.id);
                                      setAssignHours(req.minHours);
                                    }}
                                    style={{
                                      padding: "4px 10px",
                                      borderRadius: 5,
                                      border: "1px solid #d97706",
                                      backgroundColor: "#fff",
                                      color: "#b45309",
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                  >
                                    {isExpired ? "🔄 Registra Rinnovo" : "➕ Assegna Attestato"}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {designatedCustomList.map((customName, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "6px 12px",
                              borderRadius: 6,
                              backgroundColor: "#f8fafc",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12px", color: "#334155" }}>
                              <span>👤</span>
                              <strong>{customName}</strong>
                              <span style={{ fontSize: "11px", color: "#64748b" }}>
                                (Operatore esterno/autonomo designato sulla macchina nello Step 4)
                              </span>
                            </div>
                            <span style={{ fontSize: "11px", color: "#0284c7", fontWeight: 600 }}>
                              Verifica conformità documentale esterna
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: 10,
                        padding: "8px 12px",
                        backgroundColor: "#f8fafc",
                        borderRadius: 6,
                        border: "1px dashed #cbd5e1",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      ℹ️ Nessun operatore designato nello Step 4 per:{" "}
                      <strong style={{ color: "#334155" }}>{machineNames.join(", ")}</strong>. Puoi selezionare i
                      lavoratori autorizzati direttamente nella scheda di ciascun macchinario nello Step 4 oppure
                      registrare l&apos;abilitazione con il pulsante &quot;➕ Assegna Patentino&quot;.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SOTTOSCHEDE STANDARD: SCADENZE, DIPENDENTI, CATALOGO CORSI                */}
      {/* ========================================================================= */}
      {tab === "expiry" && <ScadenzeTab employees={employees} />}

      {tab === "employees" && (
        <EmployeesTab
          token={token}
          companies={scopedCompanies}
          employees={employees}
          courses={courses}
          machines={machines}
          onChanged={reloadAll}
          onError={setError}
        />
      )}

      {tab === "courses" && (
        <CoursesTab
          token={token}
          courses={courses}
          onChanged={reloadAll}
          onError={setError}
        />
      )}

      {/* MODALE INSERIMENTO / MODIFICA DIPENDENTE */}
      {showEmployeeModal && (
        <EmployeeFullModal
          token={token}
          companies={scopedCompanies}
          companyId={companyId}
          editing={editingEmployee}
          machines={machines}
          onClose={() => {
            setShowEmployeeModal(false);
            setEditingEmployee(null);
          }}
          onSaved={async () => {
            setShowEmployeeModal(false);
            setEditingEmployee(null);
            setActionSuccess("✓ Scheda lavoratore salvata con successo!");
            await reloadAll();
          }}
          onError={setError}
        />
      )}

      {/* MODALE REGISTRAZIONE ATTESTATO / FORMAZIONE */}
      {recordTarget && (
        <TrainingRecordModal
          token={token}
          employee={recordTarget.employee}
          courses={courses}
          preselectedCourse={recordTarget.course}
          onClose={() => setRecordTarget(null)}
          onSaved={async () => {
            setRecordTarget(null);
            setActionSuccess("✓ Attestato di formazione registrato con successo!");
            await reloadAll();
          }}
          onError={setError}
        />
      )}

      {/* MODALE PER ASSEGNARE ABILITAZIONE / PATENTINO A DIPENDENTE (DA MACCHINE) */}
      {assignModalReq && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>
                🎓 Assegna Abilitazione: {assignModalReq.courseTitle}
              </h3>
              <button
                type="button"
                onClick={() => setAssignModalReq(null)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignCertificate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Dipendente Incaricato *
                </label>
                <select
                  required
                  value={assignEmployeeId}
                  onChange={(e) => setAssignEmployeeId(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                >
                  <option value="">— Seleziona dipendente —</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.role || "Lavoratore"})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Data Conseguimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={assignCompletedAt}
                    onChange={(e) => setAssignCompletedAt(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Ore Svolte
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={assignHours}
                    onChange={(e) => setAssignHours(Number(e.target.value))}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Numero Attestato / Protocollo Patentino
                </label>
                <input
                  type="text"
                  placeholder="Es. ATT-2024-00492"
                  value={assignCertNumber}
                  onChange={(e) => setAssignCertNumber(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setAssignModalReq(null)}
                  style={{ padding: "7px 14px", borderRadius: 6, border: "1px solid #cbd5e1", backgroundColor: "#fff", cursor: "pointer", fontSize: "13px" }}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={assignSubmitting}
                  style={{ padding: "7px 16px", borderRadius: 6, border: "none", backgroundColor: "var(--color-primary, #0f172a)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
                >
                  {assignSubmitting ? "Salvataggio..." : "Salva Attestato"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
