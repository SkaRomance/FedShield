import { useMemo, useState } from "react";
import {
  Company,
  createEmployee,
  createTrainingRecord,
  deleteEmployee,
  Employee,
  TrainingCourse,
  updateEmployee,
} from "../../api";
import { Field, formStyle, gridStyle } from "./_shared";

interface EmployeesTabProps {
  token: string;
  companies: Company[];
  employees: Employee[];
  courses: TrainingCourse[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
}

export default function EmployeesTab({
  token,
  companies,
  employees,
  courses,
  onChanged,
  onError,
}: EmployeesTabProps) {
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
