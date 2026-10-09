import { useEffect, useState } from "react";
import {
  Company,
  Employee,
  fetchEmployees,
  fetchMachines,
  fetchTrainingCourses,
  Machine,
  TrainingCourse,
} from "../api";
import ScadenzeTab from "./training/ScadenzeTab";
import EmployeesTab from "./training/EmployeesTab";
import CoursesTab from "./training/CoursesTab";
import { TabButton } from "./training/_shared";

interface TrainingPageProps {
  token: string;
  companies: Company[];
  userRole?: "junior" | "senior" | "admin";
}

type Tab = "employees" | "expiry" | "courses";

export default function TrainingPage({ token, companies, userRole: _userRole }: TrainingPageProps) {
  const [tab, setTab] = useState<Tab>("employees");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
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
      const [emps, crs, machs] = await Promise.all([
        fetchEmployees(token, { isActive: true }),
        fetchTrainingCourses(token),
        fetchMachines(token).catch(() => []),
      ]);
      setEmployees(emps);
      setCourses(crs);
      setMachines(machs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore caricamento formazione");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="panel" style={{ padding: 20 }}>Caricamento formazione e personale...</div>;

  return (
    <div className="training-page">
      <header style={{ marginBottom: 16 }}>
        <h2 style={{ margin: "0 0 6px 0", fontSize: "22px", color: "var(--navy-900, #17203c)" }}>
          Personale & Formazione di Legge
        </h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
          Monitora anagrafiche, piani formativi individuali D.Lgs. 81/08, abilitazioni macchinari, scadenze e catalogo corsi.
        </p>
      </header>

      <div className="tab-bar" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TabButton active={tab === "employees"} onClick={() => setTab("employees")}>
          Lavoratori & Piani Individuali ({employees.length})
        </TabButton>
        <TabButton active={tab === "expiry"} onClick={() => setTab("expiry")}>
          Scadenze & Stato
        </TabButton>
        <TabButton active={tab === "courses"} onClick={() => setTab("courses")}>
          Catalogo Corsi ({courses.length})
        </TabButton>
      </div>

      {error ? <p className="status-message" style={{ color: "var(--color-error)" }}>{error}</p> : null}

      {tab === "employees" ? (
        <EmployeesTab
          token={token}
          companies={companies}
          employees={employees}
          courses={courses}
          machines={machines}
          onChanged={reloadAll}
          onError={setError}
        />
      ) : tab === "expiry" ? (
        <ScadenzeTab employees={employees} />
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
