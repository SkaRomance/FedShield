// Shared helpers/components extracted from AssetsPage.tsx during S12-C2 refactor.
// Pure extraction: nessun cambio di logica rispetto al monolite originale.

export interface FormCommon {
  token: string;
  companyId: string;
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (msg: string | null) => void;
}

export const formStyle: React.CSSProperties = {
  marginBottom: 16,
  padding: 16,
  background: "#f8f9fb",
  border: "1px solid #d8dde6",
  borderRadius: 6,
};

export const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

export function Field({
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
      <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{label}</span>
      {children}
    </label>
  );
}

export function FormActions({
  busy,
  onClose,
  editing,
}: {
  busy: boolean;
  onClose: () => void;
  editing: boolean;
}) {
  return (
    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
      <button type="submit" className="btn-primary" disabled={busy}>
        {busy ? "Salvataggio..." : editing ? "Salva modifiche" : "Crea"}
      </button>
      <button type="button" className="ghost-btn" onClick={onClose} disabled={busy}>
        Annulla
      </button>
    </div>
  );
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("it-IT");
}

export function soonest(...dates: Array<string | null | undefined>): string | null {
  const valid = dates.filter((d): d is string => Boolean(d));
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => (new Date(a).getTime() < new Date(b).getTime() ? a : b));
}

export function statusRowStyle(nextDate?: string | null): React.CSSProperties {
  if (!nextDate) return {};
  const days = Math.ceil((new Date(nextDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { background: "var(--color-error-soft)" };
  if (days <= 30) return { background: "var(--color-warning-soft)" };
  if (days <= 90) return { background: "var(--color-pending-soft)" };
  return {};
}

export function toDateInput(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function RowActions({
  onQr,
  onEdit,
  onDelete,
}: {
  onQr?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {onQr ? (
        <button type="button" className="ghost-btn" onClick={onQr}>
          QR
        </button>
      ) : null}
      <button type="button" className="ghost-btn" onClick={onEdit}>
        Modifica
      </button>
      <button
        type="button"
        className="ghost-btn"
        onClick={onDelete}
        style={{ color: "var(--color-error)" }}
      >
        Elimina
      </button>
    </div>
  );
}
