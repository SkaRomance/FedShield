import { useEffect, useMemo, useState } from "react";
import {
  Company,
  createEmployee,
  createTrainingCourse,
  createTrainingRecord,
  deleteEmployee,
  Employee,
  fetchEmployees,
  fetchTrainingCourses,
  TrainingCourse,
  updateEmployee,
} from "../api";

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

      {error ? <p className="status-message" style={{ color: "crimson" }}>{error}</p> : null}

      {tab === "expiry" ? (
        <ExpirySection employees={employees} />
      ) : tab === "employees" ? (
        <EmployeesSection
          token={token}
          companies={companies}
          employees={employees}
          courses={courses}
          onChanged={reloadAll}
          onError={setError}
        />
      ) : (
        <CoursesSection
          token={token}
          courses={courses}
          onChanged={reloadAll}
          onError={setError}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`tab-btn ${active ? "tab-btn-active" : ""}`}
      onClick={onClick}
      style={{
        padding: "8px 16px",
        background: active ? "#1f4ad6" : "#eee",
        color: active ? "white" : "#333",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        fontWeight: active ? "bold" : "normal",
      }}
    >
      {children}
    </button>
  );
}

// ─── EXPIRY SECTION ───────────────────────────────────────────────────────────

function ExpirySection({ employees }: { employees: Employee[] }) {
  function getStatusColor(expiresAt: string | null): string {
    if (!expiresAt) return "gray";
    const days = Math.ceil(
      (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (days < 0) return "crimson";
    if (days <= 30) return "orange";
    if (days <= 90) return "#caa800";
    return "green";
  }

  function getStatusText(expiresAt: string | null): string {
    if (!expiresAt) return "—";
    const days = Math.ceil(
      (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (days < 0) return `SCADUTO da ${Math.abs(days)}gg`;
    if (days <= 30) return `Scade tra ${days}gg`;
    if (days <= 90) return `${days}gg residui`;
    return "Valido";
  }

  return (
    <section className="panel">
      <h3>Scadenze formazione dipendenti</h3>
      <table>
        <thead>
          <tr>
            <th>Dipendente</th>
            <th>Ruolo</th>
            <th>Corso</th>
            <th>Ore</th>
            <th>Frequenza</th>
            <th>Scadenza</th>
            <th>Stato</th>
            <th>Attestato</th>
          </tr>
        </thead>
        <tbody>
          {employees.flatMap((emp) => {
            const records = emp.trainingRecords ?? [];
            if (records.length === 0) {
              return (
                <tr key={emp.id}>
                  <td>
                    {emp.lastName} {emp.firstName}
                  </td>
                  <td>{emp.role || "—"}</td>
                  <td colSpan={6} style={{ color: "gray" }}>
                    Nessun corso registrato
                  </td>
                </tr>
              );
            }
            return records.map((rec, idx) => (
              <tr key={`${emp.id}-${rec.id}`}>
                {idx === 0 ? (
                  <td rowSpan={records.length}>
                    <strong>
                      {emp.lastName} {emp.firstName}
                    </strong>
                    {emp.fiscalCode ? (
                      <>
                        <br />
                        <small>{emp.fiscalCode}</small>
                      </>
                    ) : null}
                  </td>
                ) : null}
                {idx === 0 ? (
                  <td rowSpan={records.length}>{emp.role || "—"}</td>
                ) : null}
                <td>{rec.course.name}</td>
                <td>
                  {rec.hoursDone || rec.course.minHours}h / {rec.course.minHours}h
                </td>
                <td>{rec.course.frequencyYears} anni</td>
                <td>
                  {rec.expiresAt
                    ? new Date(rec.expiresAt).toLocaleDateString("it-IT")
                    : "—"}
                </td>
                <td style={{ color: getStatusColor(rec.expiresAt) }}>
                  {getStatusText(rec.expiresAt)}
                </td>
                <td>{rec.certificateNumber || "—"}</td>
              </tr>
            ));
          })}
          {employees.length === 0 ? (
            <tr>
              <td colSpan={8}>Nessun dipendente attivo.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

// ─── EMPLOYEES SECTION ────────────────────────────────────────────────────────

function EmployeesSection({
  token,
  companies,
  employees,
  courses,
  onChanged,
  onError,
}: {
  token: string;
  companies: Company[];
  employees: Employee[];
  courses: TrainingCourse[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
}) {
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showRecordFor, setShowRecordFor] = useState<string | null>(null);

  const filtered = useMemo(
    () => (companyFilter ? employees.filter((e) => e.companyId === companyFilter) : employees),
    [employees, companyFilter],
  );

  async function handleDelete(id: string) {
    if (!window.confirm("Disattivare il dipendente? (soft delete, recuperabile dal backend)")) return;
    setBusy(true);
    onError(null);
    try {
      await deleteEmployee(token, id);
      await onChanged();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Errore eliminazione");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Dipendenti</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            aria-label="Filtra per azienda"
          >
            <option value="">— Tutte le aziende —</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            className="btn-primary"
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
          >
            + Nuovo dipendente
          </button>
        </div>
      </header>

      {showForm ? (
        <EmployeeForm
          token={token}
          companies={companies}
          editing={editingId ? employees.find((e) => e.id === editingId) ?? null : null}
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
          }}
          onSaved={async () => {
            setShowForm(false);
            setEditingId(null);
            await onChanged();
          }}
          onError={onError}
        />
      ) : null}

      {showRecordFor ? (
        <TrainingRecordForm
          token={token}
          employee={employees.find((e) => e.id === showRecordFor)!}
          courses={courses}
          onClose={() => setShowRecordFor(null)}
          onSaved={async () => {
            setShowRecordFor(null);
            await onChanged();
          }}
          onError={onError}
        />
      ) : null}

      <table>
        <thead>
          <tr>
            <th>Cognome Nome</th>
            <th>CF</th>
            <th>Ruolo</th>
            <th>Reparto</th>
            <th>Azienda</th>
            <th>Corsi</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((emp) => {
            const company = companies.find((c) => c.id === emp.companyId);
            const recordsCount = emp.trainingRecords?.length ?? 0;
            return (
              <tr key={emp.id}>
                <td>
                  <strong>{emp.lastName}</strong> {emp.firstName}
                </td>
                <td>{emp.fiscalCode || "—"}</td>
                <td>{emp.role || "—"}</td>
                <td>{emp.department || "—"}</td>
                <td>{company?.name || emp.companyId}</td>
                <td>{recordsCount}</td>
                <td>
                  <div className="row-actions">
                    <button
                      className="ghost-btn"
                      onClick={() => {
                        setEditingId(emp.id);
                        setShowForm(true);
                      }}
                      disabled={busy}
                    >
                      Modifica
                    </button>
                    <button
                      className="ghost-btn"
                      onClick={() => setShowRecordFor(emp.id)}
                      disabled={busy || courses.length === 0}
                      title={courses.length === 0 ? "Crea prima un corso" : "Aggiungi formazione"}
                    >
                      + Formazione
                    </button>
                    <button
                      className="ghost-btn"
                      onClick={() => handleDelete(emp.id)}
                      disabled={busy}
                      style={{ color: "crimson" }}
                    >
                      Disattiva
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7}>Nessun dipendente.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

function EmployeeForm({
  token,
  companies,
  editing,
  onClose,
  onSaved,
  onError,
}: {
  token: string;
  companies: Company[];
  editing: Employee | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (msg: string | null) => void;
}) {
  const [companyId, setCompanyId] = useState(editing?.companyId ?? companies[0]?.id ?? "");
  const [firstName, setFirstName] = useState(editing?.firstName ?? "");
  const [lastName, setLastName] = useState(editing?.lastName ?? "");
  const [fiscalCode, setFiscalCode] = useState(editing?.fiscalCode ?? "");
  const [role, setRole] = useState(editing?.role ?? "");
  const [department, setDepartment] = useState(editing?.department ?? "");
  const [hireDate, setHireDate] = useState(
    editing?.hireDate ? editing.hireDate.slice(0, 10) : "",
  );
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError(null);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fiscalCode: fiscalCode.trim() || undefined,
        role: role.trim() || undefined,
        department: department.trim() || undefined,
        hireDate: hireDate ? new Date(hireDate).toISOString() : undefined,
      };
      if (editing) {
        await updateEmployee(token, editing.id, payload);
      } else {
        if (!companyId) {
          onError("Seleziona un'azienda.");
          return;
        }
        await createEmployee(token, { companyId, ...payload });
      }
      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore salvataggio");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="inline-form" style={formStyle}>
      <h4>{editing ? "Modifica dipendente" : "Nuovo dipendente"}</h4>
      <div style={gridStyle}>
        {!editing ? (
          <Field label="Azienda *">
            <select
              required
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              aria-label="Azienda"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        ) : null}
        <Field label="Cognome *">
          <input required value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </Field>
        <Field label="Nome *">
          <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </Field>
        <Field label="Codice Fiscale">
          <input value={fiscalCode} onChange={(e) => setFiscalCode(e.target.value.toUpperCase())} maxLength={16} />
        </Field>
        <Field label="Ruolo">
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Cuoco, Operaio, ..." />
        </Field>
        <Field label="Reparto">
          <input value={department} onChange={(e) => setDepartment(e.target.value)} />
        </Field>
        <Field label="Data assunzione">
          <input type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} />
        </Field>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Salvataggio..." : editing ? "Salva modifiche" : "Crea dipendente"}
        </button>
        <button type="button" className="ghost-btn" onClick={onClose} disabled={busy}>
          Annulla
        </button>
      </div>
    </form>
  );
}

// ─── TRAINING RECORD FORM ─────────────────────────────────────────────────────

function TrainingRecordForm({
  token,
  employee,
  courses,
  onClose,
  onSaved,
  onError,
}: {
  token: string;
  employee: Employee;
  courses: TrainingCourse[];
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (msg: string | null) => void;
}) {
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [completedAt, setCompletedAt] = useState(new Date().toISOString().slice(0, 10));
  const [hoursDone, setHoursDone] = useState<string>("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [busy, setBusy] = useState(false);

  function computeExpiry(): string | undefined {
    if (!courseId || !completedAt) return undefined;
    const course = courses.find((c) => c.id === courseId);
    if (!course) return undefined;
    const d = new Date(completedAt);
    d.setFullYear(d.getFullYear() + course.frequencyYears);
    return d.toISOString();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError(null);
    try {
      await createTrainingRecord(token, {
        employeeId: employee.id,
        courseId,
        completedAt: new Date(completedAt).toISOString(),
        expiresAt: computeExpiry(),
        hoursDone: hoursDone ? Number(hoursDone) : undefined,
        certificateNumber: certificateNumber.trim() || undefined,
      });
      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore salvataggio");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="inline-form" style={formStyle}>
      <h4>
        Registra formazione: {employee.lastName} {employee.firstName}
      </h4>
      <div style={gridStyle}>
        <Field label="Corso *">
          <select required value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.minHours}h, ogni {c.frequencyYears}a)
              </option>
            ))}
          </select>
        </Field>
        <Field label="Data completamento *">
          <input type="date" required value={completedAt} onChange={(e) => setCompletedAt(e.target.value)} />
        </Field>
        <Field label="Ore svolte">
          <input
            type="number"
            min={1}
            value={hoursDone}
            onChange={(e) => setHoursDone(e.target.value)}
            placeholder="Default: minHours del corso"
          />
        </Field>
        <Field label="Numero attestato">
          <input
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
            placeholder="es. CERT-2026-001"
          />
        </Field>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Registrazione..." : "Registra formazione"}
        </button>
        <button type="button" className="ghost-btn" onClick={onClose} disabled={busy}>
          Annulla
        </button>
      </div>
    </form>
  );
}

// ─── COURSES SECTION ──────────────────────────────────────────────────────────

function CoursesSection({
  token,
  courses,
  onChanged,
  onError,
}: {
  token: string;
  courses: TrainingCourse[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="panel">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Catalogo corsi</h3>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Chiudi" : "+ Nuovo corso"}
        </button>
      </header>

      {showForm ? (
        <CourseForm
          token={token}
          onClose={() => setShowForm(false)}
          onSaved={async () => {
            setShowForm(false);
            await onChanged();
          }}
          onError={onError}
        />
      ) : null}

      <table>
        <thead>
          <tr>
            <th>Nome corso</th>
            <th>Audience</th>
            <th>Ore minime</th>
            <th>Frequenza</th>
            <th>Riferimento normativo</th>
            <th>Dominio</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td>
                <strong>{c.name}</strong>
                {c.description ? <small style={{ display: "block" }}>{c.description}</small> : null}
              </td>
              <td>{c.targetAudience}</td>
              <td>{c.minHours}h</td>
              <td>{c.frequencyYears} anni</td>
              <td>{c.normReference}</td>
              <td>{c.domain || "—"}</td>
            </tr>
          ))}
          {courses.length === 0 ? (
            <tr>
              <td colSpan={6}>Nessun corso in catalogo.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

function CourseForm({
  token,
  onClose,
  onSaved,
  onError,
}: {
  token: string;
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (msg: string | null) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("Lavoratori");
  const [minHours, setMinHours] = useState("4");
  const [frequencyYears, setFrequencyYears] = useState("5");
  const [normReference, setNormReference] = useState("D.Lgs. 81/2008, art. 36");
  const [domain, setDomain] = useState<"safety" | "haccp" | "both">("safety");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError(null);
    try {
      await createTrainingCourse(token, {
        name: name.trim(),
        description: description.trim() || undefined,
        targetAudience: targetAudience.trim(),
        minHours: Number(minHours),
        frequencyYears: Number(frequencyYears),
        normReference: normReference.trim(),
        domain,
      });
      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore salvataggio corso");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="inline-form" style={formStyle}>
      <h4>Nuovo corso</h4>
      <div style={gridStyle}>
        <Field label="Nome corso *">
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Audience *">
          <input
            required
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="Lavoratori, Preposti, RSPP, ..."
          />
        </Field>
        <Field label="Ore minime *">
          <input
            type="number"
            required
            min={1}
            value={minHours}
            onChange={(e) => setMinHours(e.target.value)}
          />
        </Field>
        <Field label="Frequenza (anni) *">
          <input
            type="number"
            required
            min={1}
            value={frequencyYears}
            onChange={(e) => setFrequencyYears(e.target.value)}
          />
        </Field>
        <Field label="Riferimento normativo *">
          <input
            required
            value={normReference}
            onChange={(e) => setNormReference(e.target.value)}
            placeholder="Es. D.Lgs. 81/2008, art. 36"
          />
        </Field>
        <Field label="Dominio">
          <select value={domain} onChange={(e) => setDomain(e.target.value as typeof domain)}>
            <option value="safety">Sicurezza</option>
            <option value="haccp">HACCP</option>
            <option value="both">Entrambi</option>
          </select>
        </Field>
        <Field label="Descrizione" full>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Salvataggio..." : "Crea corso"}
        </button>
        <button type="button" className="ghost-btn" onClick={onClose} disabled={busy}>
          Annulla
        </button>
      </div>
    </form>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const formStyle: React.CSSProperties = {
  marginBottom: 16,
  padding: 16,
  background: "#f8f9fb",
  border: "1px solid #d8dde6",
  borderRadius: 6,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        gridColumn: full ? "1 / -1" : undefined,
      }}
    >
      <span style={{ fontSize: 13, color: "#444" }}>{label}</span>
      {children}
    </label>
  );
}
