import { useMemo, useState } from "react";
import {
  Company,
  deleteEmployee,
  Employee,
  Machine,
  TrainingCourse,
} from "../../api";
import {
  computeIndividualTrainingPlan,
  getCleanDepartmentDisplay,
  PlannedCourseItem,
} from "../../lib/individualTrainingPlan";
import IndividualPlanCard from "./IndividualPlanCard";
import EmployeeFullModal from "./EmployeeFullModal";
import TrainingRecordModal from "./TrainingRecordModal";
import { GraduationCap, LayoutGrid, List, Plus, Search, UserPlus } from "lucide-react";

interface EmployeesTabProps {
  token: string;
  companies: Company[];
  employees: Employee[];
  courses: TrainingCourse[];
  machines?: Machine[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
}

export default function EmployeesTab({
  token,
  companies,
  employees,
  courses,
  machines = [],
  onChanged,
  onError,
}: EmployeesTabProps) {
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [recordTarget, setRecordTarget] = useState<{
    employee: Employee;
    course?: PlannedCourseItem;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  // Filtra per azienda e testo di ricerca
  const filtered = useMemo(() => {
    return employees.filter((e) => {
      if (companyFilter && e.companyId !== companyFilter) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const fullName = `${e.lastName} ${e.firstName}`.toLowerCase();
        const role = (e.role || "").toLowerCase();
        const cf = (e.fiscalCode || "").toLowerCase();
        if (!fullName.includes(query) && !role.includes(query) && !cf.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [employees, companyFilter, searchTerm]);

  // Calcola piani formativi individuali per i dipendenti filtrati
  const plansWithEmployees = useMemo(() => {
    return filtered.map((emp) => {
      const company = companies.find((c) => c.id === emp.companyId);
      const companyMachines = machines.filter((m) => m.companyId === emp.companyId);
      const plan = computeIndividualTrainingPlan(emp, {
        company,
        atecoCode: company?.atecoCode || undefined,
        companyMachines,
        availableCourses: courses,
      });
      return { emp, plan };
    });
  }, [filtered, companies, machines, courses]);

  async function handleDelete(id: string) {
    if (
      !window.confirm(
        "Disattivare il lavoratore? L'operazione è reversibile e i dati di formazione rimangono conservati a norma di legge.",
      )
    ) {
      return;
    }
    setBusy(true);
    onError(null);
    try {
      await deleteEmployee(token, id);
      await onChanged();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Errore eliminazione lavoratore");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel" style={{ padding: "20px" }}>
      {/* Testata della Scheda Dipendenti */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", color: "var(--navy-900, #17203c)" }}>
            Anagrafica Lavoratori & Progettazione Formativa
          </h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
            Gestione anagrafiche complete, mansioni specifiche, ruoli di sicurezza, attrezzature e piani formativi individuali.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Switch modalità vista: schede vs tabella */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#f1f5f9",
              padding: "2px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 10px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: viewMode === "cards" ? "#ffffff" : "transparent",
                color: viewMode === "cards" ? "#0284c7" : "#64748b",
                fontWeight: viewMode === "cards" ? 700 : 500,
                fontSize: "12px",
                cursor: "pointer",
                boxShadow: viewMode === "cards" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <LayoutGrid size={14} />
              Schede Piani
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 10px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: viewMode === "table" ? "#ffffff" : "transparent",
                color: viewMode === "table" ? "#0284c7" : "#64748b",
                fontWeight: viewMode === "table" ? 700 : 500,
                fontSize: "12px",
                cursor: "pointer",
                boxShadow: viewMode === "table" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <List size={14} />
              Tabella
            </button>
          </div>

          <button
            className="btn-primary"
            onClick={() => {
              setEditingEmployee(null);
              setShowModal(true);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <UserPlus size={15} />
            + Nuovo Dipendente
          </button>
        </div>
      </header>

      {/* Barra Filtri: Azienda e Ricerca */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "18px",
          flexWrap: "wrap",
          alignItems: "center",
          backgroundColor: "#f8fafc",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ flex: "1 1 240px", minWidth: "200px" }}>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            aria-label="Filtra per azienda"
          >
            <option value="">— Tutte le aziende ({employees.length} lavoratori) —</option>
            {companies.map((c) => {
              const count = employees.filter((e) => e.companyId === c.id).length;
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({count})
                </option>
              );
            })}
          </select>
        </div>

        <div style={{ flex: "2 1 280px", position: "relative" }}>
          <Search
            size={14}
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
          />
          <input
            type="text"
            placeholder="Cerca lavoratore per cognome, nome, mansione o codice fiscale..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 10px 7px 32px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
            }}
          />
        </div>

        <div style={{ fontSize: "12.5px", color: "#64748b", fontWeight: 600 }}>
          Visualizzati: <strong>{filtered.length}</strong> su {employees.length}
        </div>
      </div>

      {/* Modale Inserimento / Modifica Dipendente */}
      {showModal && (
        <EmployeeFullModal
          token={token}
          companies={companies}
          companyId={companyFilter || undefined}
          editing={editingEmployee}
          machines={machines}
          onClose={() => {
            setShowModal(false);
            setEditingEmployee(null);
          }}
          onSaved={async () => {
            setShowModal(false);
            setEditingEmployee(null);
            await onChanged();
          }}
          onError={onError}
        />
      )}

      {/* Modale Registrazione Attestato */}
      {recordTarget && (
        <TrainingRecordModal
          token={token}
          employee={recordTarget.employee}
          courses={courses}
          preselectedCourse={recordTarget.course}
          onClose={() => setRecordTarget(null)}
          onSaved={async () => {
            setRecordTarget(null);
            await onChanged();
          }}
          onError={onError}
        />
      )}

      {/* VISTA A SCHEDE INDIVIDUALI (Default) */}
      {viewMode === "cards" ? (
        <div>
          {plansWithEmployees.map(({ emp, plan }) => (
            <IndividualPlanCard
              key={emp.id}
              employee={emp}
              plan={plan}
              courses={courses}
              onEdit={(target) => {
                setEditingEmployee(target);
                setShowModal(true);
              }}
              onDelete={handleDelete}
              onAddTrainingRecord={(target, course) => {
                setRecordTarget({ employee: target, course });
              }}
            />
          ))}

          {plansWithEmployees.length === 0 && (
            <div
              style={{
                padding: "36px 20px",
                textAlign: "center",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px dashed #cbd5e1",
              }}
            >
              <GraduationCap size={40} color="#94a3b8" style={{ marginBottom: "10px" }} />
              <h4 style={{ margin: "0 0 6px 0", color: "#334155" }}>Nessun lavoratore trovato</h4>
              <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "13px" }}>
                {searchTerm || companyFilter
                  ? "Nessun lavoratore corrisponde ai filtri di ricerca selezionati."
                  : "Nessun lavoratore registrato. Crea la prima anagrafica per attivare la progettazione formativa."}
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setEditingEmployee(null);
                  setShowModal(true);
                }}
              >
                + Aggiungi Primo Lavoratore
              </button>
            </div>
          )}
        </div>
      ) : (
        /* VISTA TABELLARE TRADIZIONALE ARRICCHITA */
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Cognome Nome</th>
                <th>CF</th>
                <th>Mansione</th>
                <th>Reparto</th>
                <th>Azienda</th>
                <th>Stato Formazione</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {plansWithEmployees.map(({ emp, plan }) => {
                const company = companies.find((c) => c.id === emp.companyId);
                return (
                  <tr key={emp.id}>
                    <td>
                      <strong>{emp.lastName}</strong> {emp.firstName}
                    </td>
                    <td style={{ fontFamily: "monospace" }}>{emp.fiscalCode || "—"}</td>
                    <td>{emp.role || "—"}</td>
                    <td>{getCleanDepartmentDisplay(emp)}</td>
                    <td>{company?.name || emp.companyId}</td>
                    <td>
                      <span
                        style={{
                          backgroundColor:
                            plan.overallStatus === "conforme"
                              ? "#dcfce7"
                              : plan.overallStatus === "attenzione"
                              ? "#fef3c7"
                              : "#fee2e2",
                          color:
                            plan.overallStatus === "conforme"
                              ? "#15803d"
                              : plan.overallStatus === "attenzione"
                              ? "#b45309"
                              : "#b91c1c",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          display: "inline-block",
                        }}
                      >
                        {plan.compliancePercentage}% ({plan.completedCoursesCount}/{plan.totalRequiredCourses} corsi)
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="ghost-btn"
                          onClick={() => {
                            setEditingEmployee(emp);
                            setShowModal(true);
                          }}
                          disabled={busy}
                        >
                          Modifica
                        </button>
                        <button
                          className="ghost-btn"
                          onClick={() => setRecordTarget({ employee: emp })}
                          disabled={busy}
                        >
                          + Formazione
                        </button>
                        <button
                          className="ghost-btn"
                          onClick={() => handleDelete(emp.id)}
                          disabled={busy}
                          style={{ color: "var(--color-error)" }}
                        >
                          Disattiva
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {plansWithEmployees.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                    Nessun lavoratore trovato.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
