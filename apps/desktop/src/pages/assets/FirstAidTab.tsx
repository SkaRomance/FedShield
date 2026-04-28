import { useState } from "react";
import {
  createFirstAidKit,
  deleteFirstAidKit,
  FirstAidKit,
  updateFirstAidKit,
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

export interface FirstAidTabProps {
  token: string;
  companyId: string;
  items: FirstAidKit[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
}

export default function FirstAidTab({
  token,
  companyId,
  items,
  onChanged,
  onError,
}: FirstAidTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FirstAidKit | null>(null);

  function startEdit(item: FirstAidKit) {
    setEditing(item);
    setShowForm(true);
  }

  function startCreate() {
    setEditing(null);
    setShowForm((s) => !s);
  }

  async function handleDelete(item: FirstAidKit) {
    if (!window.confirm(`Eliminare la cassetta PS in "${item.location}"?`)) return;
    onError(null);
    try {
      await deleteFirstAidKit(token, item.id);
      await onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore eliminazione");
    }
  }

  return (
    <section className="panel">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Cassette pronto soccorso</h3>
        <button className="btn-primary" onClick={startCreate}>
          {showForm && !editing ? "Chiudi" : "+ Nuova cassetta PS"}
        </button>
      </header>

      {showForm ? (
        <FirstAidForm
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
            <th>Ubicazione</th>
            <th>Contenuto</th>
            <th>Prossimo controllo</th>
            <th>Ultimo riassortimento</th>
            <th>Stato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {items.map((k) => (
            <tr key={k.id} style={statusRowStyle(k.nextCheckAt)}>
              <td>
                <strong>{k.location}</strong>
              </td>
              <td>{k.contents || "—"}</td>
              <td>{formatDate(k.nextCheckAt)}</td>
              <td>{formatDate(k.replenishedAt)}</td>
              <td>{k.status}</td>
              <td>
                <RowActions onEdit={() => startEdit(k)} onDelete={() => handleDelete(k)} />
              </td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={6}>Nessuna cassetta PS registrata.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

function FirstAidForm({
  token,
  companyId,
  existing,
  onClose,
  onSaved,
  onError,
}: FormCommon & { existing?: FirstAidKit | null }) {
  const [location, setLocation] = useState(existing?.location ?? "");
  const [contents, setContents] = useState(existing?.contents ?? "");
  const [nextCheckAt, setNextCheckAt] = useState(toDateInput(existing?.nextCheckAt));
  const [replenishedAt, setReplenishedAt] = useState(toDateInput(existing?.replenishedAt));
  const [busy, setBusy] = useState(false);
  const isEdit = Boolean(existing);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError(null);
    try {
      const payload = {
        location: location.trim(),
        contents: contents.trim() || undefined,
        nextCheckAt: nextCheckAt ? new Date(nextCheckAt).toISOString() : undefined,
        replenishedAt: replenishedAt ? new Date(replenishedAt).toISOString() : undefined,
      };
      if (existing) {
        await updateFirstAidKit(token, existing.id, payload);
      } else {
        await createFirstAidKit(token, { companyId, ...payload });
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
      <h4>{isEdit ? `Modifica: ${existing?.location}` : "Nuova cassetta PS"}</h4>
      <div style={gridStyle}>
        <Field label="Ubicazione *">
          <input required value={location} onChange={(e) => setLocation(e.target.value)} />
        </Field>
        <Field label="Contenuto" full>
          <textarea
            rows={2}
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            placeholder="es. DM 388/03 allegato 1: bende, garze, disinfettanti, ..."
          />
        </Field>
        <Field label="Prossimo controllo">
          <input type="date" value={nextCheckAt} onChange={(e) => setNextCheckAt(e.target.value)} />
        </Field>
        <Field label="Ultimo riassortimento">
          <input type="date" value={replenishedAt} onChange={(e) => setReplenishedAt(e.target.value)} />
        </Field>
      </div>
      <FormActions busy={busy} onClose={onClose} editing={isEdit} />
    </form>
  );
}
