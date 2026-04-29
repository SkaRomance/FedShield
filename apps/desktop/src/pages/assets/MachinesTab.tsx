import { useState } from "react";
import {
  createMachine,
  deleteMachine,
  Machine,
  updateMachine,
} from "../../api";
import {
  Field,
  FormActions,
  FormCommon,
  RowActions,
  formStyle,
  formatDate,
  gridStyle,
  soonest,
  statusRowStyle,
  toDateInput,
} from "./_shared";

export interface MachinesTabProps {
  token: string;
  companyId: string;
  items: Machine[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
  onOpenQr: (assetId: string, kind: "equipment" | "machine" | "extinguisher" | "firstAid") => void;
}

export default function MachinesTab({
  token,
  companyId,
  items,
  onChanged,
  onError,
  onOpenQr,
}: MachinesTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Machine | null>(null);

  function startEdit(item: Machine) {
    setEditing(item);
    setShowForm(true);
  }

  function startCreate() {
    setEditing(null);
    setShowForm((s) => !s);
  }

  async function handleDelete(item: Machine) {
    if (!window.confirm(`Eliminare la macchina "${item.name}"?`)) return;
    onError(null);
    try {
      await deleteMachine(token, item.id);
      await onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore eliminazione");
    }
  }

  return (
    <section className="panel">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Macchine (manutenzione + sicurezza)</h3>
        <button className="btn-primary" onClick={startCreate}>
          {showForm && !editing ? "Chiudi" : "+ Nuova macchina"}
        </button>
      </header>

      {showForm ? (
        <MachineForm
          token={token}
          companyId={companyId}
          existing={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={async () => {
            setShowForm(false);
            setEditing(null);
            await onChanged();
          }}
          onError={onError}
        />
      ) : null}

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Costruttore</th>
            <th>Rischio</th>
            <th>Ubicazione</th>
            <th>Prossima manutenzione</th>
            <th>Prossimo controllo sicurezza</th>
            <th>Stato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {items.map((m) => {
            const nextDate = soonest(m.nextMaintenanceAt, m.nextSafetyCheckAt);
            return (
              <tr key={m.id} style={statusRowStyle(nextDate)}>
                <td>
                  <strong>{m.name}</strong>
                </td>
                <td>{m.type}</td>
                <td>{m.manufacturer || "—"}</td>
                <td>{m.riskLevel || "—"}</td>
                <td>{m.location || "—"}</td>
                <td>{formatDate(m.nextMaintenanceAt)}</td>
                <td>{formatDate(m.nextSafetyCheckAt)}</td>
                <td>{m.status}</td>
                <td>
                  <RowActions
                    onQr={m.status !== "decommissioned" ? () => onOpenQr(m.id, "machine") : undefined}
                    onEdit={() => startEdit(m)}
                    onDelete={() => handleDelete(m)}
                  />
                </td>
              </tr>
            );
          })}
          {items.length === 0 ? (
            <tr>
              <td colSpan={9}>Nessuna macchina registrata.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

function MachineForm({
  token,
  companyId,
  existing,
  onClose,
  onSaved,
  onError,
}: FormCommon & { existing?: Machine | null }) {
  const [name, setName] = useState(existing?.name ?? "");
  const [type, setType] = useState(existing?.type ?? "");
  const [manufacturer, setManufacturer] = useState(existing?.manufacturer ?? "");
  const [riskLevel, setRiskLevel] = useState(existing?.riskLevel ?? "");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [nextMaintenanceAt, setNextMaintenanceAt] = useState(toDateInput(existing?.nextMaintenanceAt));
  const [nextSafetyCheckAt, setNextSafetyCheckAt] = useState(toDateInput(existing?.nextSafetyCheckAt));
  const [busy, setBusy] = useState(false);
  const isEdit = Boolean(existing);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError(null);
    try {
      const payload = {
        name: name.trim(),
        type: type.trim(),
        manufacturer: manufacturer.trim() || undefined,
        riskLevel: riskLevel.trim() || undefined,
        location: location.trim() || undefined,
        nextMaintenanceAt: nextMaintenanceAt ? new Date(nextMaintenanceAt).toISOString() : undefined,
        nextSafetyCheckAt: nextSafetyCheckAt ? new Date(nextSafetyCheckAt).toISOString() : undefined,
      };
      if (existing) {
        await updateMachine(token, existing.id, payload);
      } else {
        await createMachine(token, { companyId, ...payload });
      }
      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore salvataggio");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={formStyle}>
      <h4>{isEdit ? `Modifica: ${existing?.name}` : "Nuova macchina"}</h4>
      <div style={gridStyle}>
        <Field label="Nome *">
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Tipo *">
          <input required value={type} onChange={(e) => setType(e.target.value)} placeholder="es. Tornio, Forno" />
        </Field>
        <Field label="Costruttore">
          <input value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
        </Field>
        <Field label="Livello di rischio">
          <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
            <option value="">— Seleziona —</option>
            <option value="basso">Basso</option>
            <option value="medio">Medio</option>
            <option value="alto">Alto</option>
          </select>
        </Field>
        <Field label="Ubicazione">
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </Field>
        <Field label="Prossima manutenzione">
          <input
            type="date"
            value={nextMaintenanceAt}
            onChange={(e) => setNextMaintenanceAt(e.target.value)}
          />
        </Field>
        <Field label="Prossimo controllo sicurezza">
          <input
            type="date"
            value={nextSafetyCheckAt}
            onChange={(e) => setNextSafetyCheckAt(e.target.value)}
          />
        </Field>
      </div>
      <FormActions busy={busy} onClose={onClose} editing={isEdit} />
    </form>
  );
}
