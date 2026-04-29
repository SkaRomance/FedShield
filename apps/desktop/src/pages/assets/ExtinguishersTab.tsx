import { useState } from "react";
import {
  createFireExtinguisher,
  deleteFireExtinguisher,
  FireExtinguisher,
  updateFireExtinguisher,
} from "../../api";
import {
  Field,
  FormActions,
  FormCommon,
  RowActions,
  formStyle,
  formatDate,
  gridStyle,
  statusRowStyle,
  toDateInput,
} from "./_shared";

export interface ExtinguishersTabProps {
  token: string;
  companyId: string;
  items: FireExtinguisher[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
  onOpenQr: (assetId: string, kind: "equipment" | "machine" | "extinguisher" | "firstAid") => void;
}

export default function ExtinguishersTab({
  token,
  companyId,
  items,
  onChanged,
  onError,
  onOpenQr,
}: ExtinguishersTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FireExtinguisher | null>(null);

  function startEdit(item: FireExtinguisher) {
    setEditing(item);
    setShowForm(true);
  }

  function startCreate() {
    setEditing(null);
    setShowForm((s) => !s);
  }

  async function handleDelete(item: FireExtinguisher) {
    if (!window.confirm(`Eliminare l'estintore "${item.code}"?`)) return;
    onError(null);
    try {
      await deleteFireExtinguisher(token, item.id);
      await onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore eliminazione");
    }
  }

  return (
    <section className="panel">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Estintori</h3>
        <button className="btn-primary" onClick={startCreate}>
          {showForm && !editing ? "Chiudi" : "+ Nuovo estintore"}
        </button>
      </header>

      {showForm ? (
        <ExtinguisherForm
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
            <th>Codice</th>
            <th>Tipo</th>
            <th>Capacità</th>
            <th>Ubicazione</th>
            <th>Prossimo controllo</th>
            <th>Ultima ricarica</th>
            <th>Stato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {items.map((ex) => (
            <tr key={ex.id} style={statusRowStyle(ex.nextCheckAt)}>
              <td>
                <strong>{ex.code}</strong>
              </td>
              <td>{ex.type}</td>
              <td>{ex.capacity || "—"}</td>
              <td>{ex.location}</td>
              <td>{formatDate(ex.nextCheckAt)}</td>
              <td>{formatDate(ex.lastRechargeAt)}</td>
              <td>{ex.status}</td>
              <td>
                <RowActions
                  onQr={ex.status !== "decommissioned" ? () => onOpenQr(ex.id, "extinguisher") : undefined}
                  onEdit={() => startEdit(ex)}
                  onDelete={() => handleDelete(ex)}
                />
              </td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={8}>Nessun estintore registrato.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

function ExtinguisherForm({
  token,
  companyId,
  existing,
  onClose,
  onSaved,
  onError,
}: FormCommon & { existing?: FireExtinguisher | null }) {
  const [code, setCode] = useState(existing?.code ?? "");
  const [type, setType] = useState(existing?.type ?? "polvere ABC");
  const [capacity, setCapacity] = useState(existing?.capacity ?? "");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [manufactureDate, setManufactureDate] = useState(toDateInput(existing?.manufactureDate));
  const [nextCheckAt, setNextCheckAt] = useState(toDateInput(existing?.nextCheckAt));
  const [lastRechargeAt, setLastRechargeAt] = useState(toDateInput(existing?.lastRechargeAt));
  const [busy, setBusy] = useState(false);
  const isEdit = Boolean(existing);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError(null);
    try {
      const payload = {
        code: code.trim(),
        type: type.trim(),
        location: location.trim(),
        capacity: capacity.trim() || undefined,
        manufactureDate: manufactureDate ? new Date(manufactureDate).toISOString() : undefined,
        nextCheckAt: nextCheckAt ? new Date(nextCheckAt).toISOString() : undefined,
        lastRechargeAt: lastRechargeAt ? new Date(lastRechargeAt).toISOString() : undefined,
      };
      if (existing) {
        await updateFireExtinguisher(token, existing.id, payload);
      } else {
        await createFireExtinguisher(token, { companyId, ...payload });
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
      <h4>{isEdit ? `Modifica: ${existing?.code}` : "Nuovo estintore"}</h4>
      <div style={gridStyle}>
        <Field label="Codice / matricola *">
          <input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="EST-001" />
        </Field>
        <Field label="Tipo *">
          <select required value={type} onChange={(e) => setType(e.target.value)}>
            <option value="polvere ABC">Polvere ABC</option>
            <option value="CO2">CO2</option>
            <option value="schiuma">Schiuma</option>
            <option value="acqua">Acqua</option>
            <option value="idrico nebulizzato">Idrico nebulizzato</option>
          </select>
        </Field>
        <Field label="Capacità">
          <input value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="es. 6kg, 5L" />
        </Field>
        <Field label="Ubicazione *">
          <input required value={location} onChange={(e) => setLocation(e.target.value)} />
        </Field>
        <Field label="Data costruzione">
          <input type="date" value={manufactureDate} onChange={(e) => setManufactureDate(e.target.value)} />
        </Field>
        <Field label="Prossimo controllo (semestrale)">
          <input type="date" value={nextCheckAt} onChange={(e) => setNextCheckAt(e.target.value)} />
        </Field>
        <Field label="Ultima ricarica">
          <input type="date" value={lastRechargeAt} onChange={(e) => setLastRechargeAt(e.target.value)} />
        </Field>
      </div>
      <FormActions busy={busy} onClose={onClose} editing={isEdit} />
    </form>
  );
}
