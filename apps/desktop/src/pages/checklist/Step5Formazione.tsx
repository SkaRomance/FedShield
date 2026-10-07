// Step 5 "Formazione" — Integrazione Avanzata con Macchinari & Attrezzature Censite (Accordo Stato-Regioni 22/02/2012).
// Rileva automaticamente le macchine presenti in azienda (Step 4) e genera/propone i corsi di formazione
// specifica obbligatori (es. Carrelli Elevatori, PLE, Gru, Macchine alimentari, Saldatura).

import { useEffect, useMemo, useState } from "react";
import {
  Company,
  Employee,
  fetchEmployees,
  fetchTrainingCourses,
  fetchMachinesPaged,
  createTrainingCourse,
  createTrainingRecord,
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

export type TrainingSubTab = "equipmentCourses" | "expiry" | "employees" | "courses";

interface Step5FormazioneProps {
  token: string;
  companyId: string;
  companies: Company[];
  atecoCode?: string;
}

export default function Step5Formazione({ token, companyId, companies, atecoCode: _atecoCode }: Step5FormazioneProps) {
  const [tab, setTab] = useState<TrainingSubTab>("equipmentCourses");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [creatingCourseCode, setCreatingCourseCode] = useState<string | null>(null);

  // Modale per assegnare rapidamente abilitazione a un dipendente
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

  // Identifica l'elenco dei requisiti formativi specifici richiesti dalle macchine censite
  const equipmentTrainingRequirements = useMemo(() => {
    const map = new Map<string, { requirement: MachineTrainingRequirementDef; machineNames: string[] }>();

    for (const m of machines) {
      const meta = parseMachineMetadata(m.note);
      let courseCode = meta.requiredCourseCode;

      // Se non esplicito, deduciamo in base al nome
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

      // Trova la definizione del corso
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
        map.set(def.courseCode, { requirement: def, machineNames: [m.name] });
      } else {
        map.get(def.courseCode)!.machineNames.push(m.name);
      }
    }

    return Array.from(map.values());
  }, [machines]);

  // Seleziona la tab expiry di default solo se non ci sono macchine con corsi specifici
  useEffect(() => {
    if (machines.length === 0 && tab === "equipmentCourses") {
      setTab("expiry");
    }
  }, [machines.length, tab]);

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

  // Assegnazione abilitazione a un dipendente
  async function handleAssignCertificate(e: React.FormEvent) {
    e.preventDefault();
    if (!assignModalReq || !assignEmployeeId) return;

    // Trova o crea il courseId
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

      // Calcola scadenza
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
      <div className="panel section-panel">
        <h3>Formazione</h3>
        <p>Seleziona o crea prima un'azienda al passo &quot;Dati Azienda&quot; per procedere con la formazione.</p>
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
          Monitoraggio fabbisogni formativi D.Lgs. 81/08, abilitazioni macchinari (Accordo Stato-Regioni 22/02/2012) e catalogo corsi per il preventivo.
        </p>
      </header>

      {/* Barra di Navigazione Sottoschede */}
      <div className="tab-bar" style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", borderBottom: "2px solid #e2e8f0" }}>
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
        <div style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: "14px", fontWeight: 600 }}>
          {actionSuccess}
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: "14px" }}>
          {error}
        </div>
      )}

      {loading && <p style={{ color: "#64748b" }}>Caricamento dati formazione...</p>}

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
            {equipmentTrainingRequirements.map(({ requirement: req, machineNames }) => {
              // Verifica se il corso esiste già nel catalogo generale
              const matchedCourseInCatalog = courses.find(
                (c) =>
                  c.name.toLowerCase() === req.courseTitle.toLowerCase() ||
                  c.normReference.toLowerCase().includes(req.normReference.toLowerCase()),
              );

              // Conta quanti dipendenti hanno già questo corso
              const certifiedEmployees = matchedCourseInCatalog
                ? employees.filter((emp) =>
                    emp.trainingRecords?.some((r) => r.courseId === matchedCourseInCatalog.id),
                  )
                : [];

              const missingCount = Math.max(0, employees.length - certifiedEmployees.length);

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

                    {/* Stato presenza nel catalogo */}
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

                  {/* Riepilogo Abilitazione Dipendenti */}
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
                        Operatori abilitati in regola:{" "}
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

      {/* MODALE PER ASSEGNARE ABILITAZIONE / PATENTINO A DIPENDENTE */}
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
                      {emp.firstName} {emp.lastName} ({emp.jobTitle || "Lavoratore"})
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
