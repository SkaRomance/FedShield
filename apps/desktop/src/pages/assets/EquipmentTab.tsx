import { useState } from "react";
import {
  createEquipment,
  deleteEquipment,
  Equipment,
  updateEquipment,
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

export interface EquipmentTabProps {
  token: string;
  companyId: string;
  items: Equipment[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
  onOpenQr: (assetId: string, kind: "equipment" | "machine" | "extinguisher" | "firstAid") => void;
}

export default function EquipmentTab({
  token,
  companyId,
  items,
  onChanged,
  onError,
  onOpenQr,
}: EquipmentTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);

  function startEdit(item: Equipment) {
    setEditing(item);
    setShowForm(true);
  }

  function startCreate() {
    setEditing(null);
    setShowForm((s) => !s);
  }

  async function handleDelete(item: Equipment) {
    if (!window.confirm(`Eliminare l'attrezzatura "${item.name}"?`)) return;
    onError(null);
    try {
      await deleteEquipment(token, item.id);
      await onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore eliminazione");
    }
  }

  return (
    <section className="panel">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Attrezzature generiche</h3>
        <button className="btn-primary" onClick={startCreate}>
          {showForm && !editing ? "Chiudi" : "+ Nuova attrezzatura"}
        </button>
      </header>

      {showForm ? (
        <EquipmentForm
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
            <th>Modello</th>
            <th>S/N</th>
            <th>Ubicazione</th>
            <th>Prossimo controllo</th>
            <th>Stato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {items.map((eq) => (
            <tr key={eq.id} style={statusRowStyle(eq.nextCheckAt)}>
              <td>
                <strong>{eq.name}</strong>
              </td>
              <td>{eq.type}</td>
              <td>{eq.model || "—"}</td>
              <td>{eq.serialNumber || "—"}</td>
              <td>{eq.location || "—"}</td>
              <td>{formatDate(eq.nextCheckAt)}</td>
              <td>{eq.status}</td>
              <td>
                <RowActions
                  onQr={eq.status !== "decommissioned" ? () => onOpenQr(eq.id, "equipment") : undefined}
                  onEdit={() => startEdit(eq)}
                  onDelete={() => handleDelete(eq)}
                />
              </td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={8}>Nessuna attrezzatura registrata.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

function EquipmentForm({
  token,
  companyId,
  existing,
  onClose,
  onSaved,
  onError,
}: FormCommon & { existing?: Equipment | null }) {
  const [name, setName] = useState(existing?.name ?? "");
  const [type, setType] = useState(existing?.type ?? "");
  const [model, setModel] = useState(existing?.model ?? "");
  const [serialNumber, setSerialNumber] = useState(existing?.serialNumber ?? "");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [nextCheckAt, setNextCheckAt] = useState(toDateInput(existing?.nextCheckAt));
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
        model: model.trim() || undefined,
        serialNumber: serialNumber.trim() || undefined,
        location: location.trim() || undefined,
        nextCheckAt: nextCheckAt ? new Date(nextCheckAt).toISOString() : undefined,
      };
      if (existing) {
        await updateEquipment(token, existing.id, payload);
      } else {
        await createEquipment(token, { companyId, ...payload });
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
      <h4>{isEdit ? `Modifica: ${existing?.name}` : "Nuova attrezzatura"}</h4>
      <div style={gridStyle}>
        <Field label="Nome *">
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Tipo *">
          <input required value={type} onChange={(e) => setType(e.target.value)} placeholder="es. Trapano, Bilancia" />
        </Field>
        <Field label="Modello">
          <input value={model} onChange={(e) => setModel(e.target.value)} />
        </Field>
        <Field label="N. serie">
          <input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
        </Field>
        <Field label="Ubicazione">
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </Field>
        <Field label="Prossimo controllo">
          <input type="date" value={nextCheckAt} onChange={(e) => setNextCheckAt(e.target.value)} />
        </Field>
      </div>
      <FormActions busy={busy} onClose={onClose} editing={isEdit} />
    </form>
  );
}
