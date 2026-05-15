// Shared helpers/components extracted from TrainingPage.tsx during S12-C1 refactor.
// Pure extraction: nessun cambio di logica rispetto al monolite originale.

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

export function TabButton({
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
    >
      {children}
    </button>
  );
}
