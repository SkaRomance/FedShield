import { useEffect, useState } from "react";
import {
  Company,
  Employee,
  fetchEmployees,
  fetchTrainingCourses,
  TrainingCourse,
} from "../api";
import ScadenzeTab from "./training/ScadenzeTab";
import EmployeesTab from "./training/EmployeesTab";
import CoursesTab from "./training/CoursesTab";
import { TabButton } from "./training/_shared";

interface TrainingPageProps {
  token: string;
  companies: Company[];
}

type Tab = "expiry" | "employees" | "courses";

export default function TrainingPage({ token, companies }: TrainingPageProps) {
  const [tab, setTab] = useState<Tab>("expiry");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void reloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function reloadAll() {
    setLoading(true);
    setError(null);
    try {
      const [emps, crs] = await Promise.all([
        fetchEmployees(token, { isActive: true }),
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

  if (loading) return <div className="panel">Caricamento formazione...</div>;

  return (
    <div className="training-page">
      <header style={{ marginBottom: 12 }}>
        <h2>Gestione Formazione</h2>
        <p>Monitora corsi, scadenze, dipendenti e catalogo formativo.</p>
      </header>

      <div className="tab-bar" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TabButton active={tab === "expiry"} onClick={() => setTab("expiry")}>
          Scadenze
        </TabButton>
        <TabButton active={tab === "employees"} onClick={() => setTab("employees")}>
          Dipendenti
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
          companies={companies}
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
