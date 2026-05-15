// Step 5 "Formazione" — Sprint 18 Wave B.
// Embedded reuse of training tab components (Sprint 12 split): Scadenze /
// Employees / Courses. Il companyId e' fissato dall'inspection: i dipendenti
// vengono pre-filtrati lato API; alle EmployeesTab passiamo la lista companies
// limitata alla sola azienda corrente per mantenere coerente il selettore.

import { useEffect, useMemo, useState } from "react";
import {
  Company,
  Employee,
  fetchEmployees,
  fetchTrainingCourses,
  TrainingCourse,
} from "../../api";
import ScadenzeTab from "../training/ScadenzeTab";
import EmployeesTab from "../training/EmployeesTab";
import CoursesTab from "../training/CoursesTab";
import { TabButton } from "../training/_shared";

export type TrainingSubTab = "expiry" | "employees" | "courses";

interface Step5FormazioneProps {
  token: string;
  companyId: string;
  companies: Company[];
}

export default function Step5Formazione({ token, companyId, companies }: Step5FormazioneProps) {
  const [tab, setTab] = useState<TrainingSubTab>("expiry");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const [emps, crs] = await Promise.all([
        fetchEmployees(token, { companyId, isActive: true }),
        fetchTrainingCourses(token),
      ]);
      setEmployees(emps);
      setCourses(crs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore caricamento");
    } finally {
      setLoading(false);
    }
  }

  if (!companyId) {
    return (
      <div className="panel section-panel">
        <h3>Formazione</h3>
        <p>
          Seleziona/crea prima un'azienda al passo &quot;Dati Azienda&quot; per registrare
          dipendenti e corsi formativi collegati al sopralluogo.
        </p>
      </div>
    );
  }

  return (
    <div className="panel section-panel">
      <header style={{ marginBottom: 12 }}>
        <h3>Formazione dell'azienda</h3>
        <p>
          Monitora scadenze formative, dipendenti e catalogo corsi dell'azienda
          oggetto del sopralluogo.
        </p>
      </header>

      {loading ? <p>Caricamento formazione...</p> : null}

      <div className="tab-bar" style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <TabButton active={tab === "expiry"} onClick={() => setTab("expiry")}>
          Scadenze
        </TabButton>
        <TabButton active={tab === "employees"} onClick={() => setTab("employees")}>
          Dipendenti ({employees.length})
        </TabButton>
        <TabButton active={tab === "courses"} onClick={() => setTab("courses")}>
          Catalogo corsi
        </TabButton>
      </div>

      {error ? <p className="status-message" style={{ color: "var(--color-error)" }}>{error}</p> : null}

      {tab === "expiry" ? (
        <ScadenzeTab employees={employees} />
      ) : tab === "employees" ? (
        <EmployeesTab
          token={token}
          companies={scopedCompanies}
          employees={employees}
          courses={courses}
          onChanged={reloadAll}
          onError={setError}
        />
      ) : (
        <CoursesTab
          token={token}
          courses={courses}
          onChanged={reloadAll}
          onError={setError}
        />
      )}
    </div>
  );
}
