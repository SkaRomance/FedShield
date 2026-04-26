import { useEffect, useMemo, useState } from "react";
import {
  Company,
  createEquipment,
  createFireExtinguisher,
  createFirstAidKit,
  createMachine,
  Equipment,
  fetchEquipment,
  fetchFireExtinguishers,
  fetchFirstAidKits,
  fetchMachines,
  FireExtinguisher,
  FirstAidKit,
  Machine,
} from "../api";

interface AssetsPageProps {
  token: string;
  companies: Company[];
  onOpenQr: (assetId: string) => void;
}

type Tab = "equipment" | "machines" | "extinguishers" | "firstAid";

export default function AssetsPage({ token, companies, onOpenQr }: AssetsPageProps) {
  const [tab, setTab] = useState<Tab>("equipment");
  const [companyFilter, setCompanyFilter] = useState<string>(companies[0]?.id ?? "");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [extinguishers, setExtinguishers] = useState<FireExtinguisher[]>([]);
  const [firstAidKits, setFirstAidKits] = useState<FirstAidKit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyFilter && companies[0]) setCompanyFilter(companies[0].id);
  }, [companies, companyFilter]);

  useEffect(() => {
    if (companyFilter) void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyFilter, token]);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const [eq, ma, ex, kits] = await Promise.all([
        fetchEquipment(token, { companyId: companyFilter }),
        fetchMachines(token, { companyId: companyFilter }),
        fetchFireExtinguishers(token, { companyId: companyFilter }),
        fetchFirstAidKits(token, { companyId: companyFilter }),
      ]);
      setEquipment(eq);
      setMachines(ma);
      setExtinguishers(ex);
      setFirstAidKits(kits);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore caricamento asset");
    } finally {
      setLoading(false);
    }
  }

  if (companies.length === 0) {
    return (
      <div className="panel">
        <h2>Asset & Attrezzature</h2>
        <p>Nessuna azienda registrata. Crea un'azienda dall'Anagrafica Clienti per iniziare a registrare asset.</p>
      </div>
    );
  }

  return (
    <div className="assets-page">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <h2>Asset & Attrezzature</h2>
          <p>Registra macchine, estintori e cassette PS con scadenze controllo.</p>
        </div>
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          aria-label="Azienda"
          style={{ minWidth: 220 }}
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </header>

      <div className="tab-bar" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TabButton active={tab === "equipment"} onClick={() => setTab("equipment")}>
          Attrezzature ({equipment.length})
        </TabButton>
        <TabButton active={tab === "machines"} onClick={() => setTab("machines")}>
          Macchine ({machines.length})
        </TabButton>
        <TabButton active={tab === "extinguishers"} onClick={() => setTab("extinguishers")}>
          Estintori ({extinguishers.length})
        </TabButton>
        <TabButton active={tab === "firstAid"} onClick={() => setTab("firstAid")}>
          Cassette PS ({firstAidKits.length})
        </TabButton>
      </div>

      {loading ? <p>Caricamento asset...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      {tab === "equipment" ? (
        <EquipmentTab
          token={token}
          companyId={companyFilter}
          items={equipment}
          onChanged={reload}
          onError={setError}
          onOpenQr={onOpenQr}
        />
      ) : tab === "machines" ? (
        <MachinesTab
          token={token}
          companyId={companyFilter}
          items={machines}
          onChanged={reload}
          onError={setError}
        />
      ) : tab === "extinguishers" ? (
        <ExtinguishersTab
          token={token}
          companyId={companyFilter}
          items={extinguishers}
          onChanged={reload}
          onError={setError}
        />
      ) : (
        <FirstAidTab
          token={token}
          companyId={companyFilter}
          items={firstAidKits}
          onChanged={reload}
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

// ─── EQUIPMENT TAB ────────────────────────────────────────────────────────────

function EquipmentTab({
  token,
  companyId,
  items,
  onChanged,
  onError,
  onOpenQr,
}: {
  token: string;
  companyId: string;
  items: Equipment[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
  onOpenQr: (assetId: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="panel">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Attrezzature generiche</h3>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Chiudi" : "+ Nuova attrezzatura"}
        </button>
      </header>

      {showForm ? (
        <EquipmentForm
          token={token}
          companyId={companyId}
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
                <button className="ghost-btn" onClick={() => onOpenQr(eq.id)}>
                  QR
                </button>
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
  onClose,
  onSaved,
  onError,
}: FormCommon) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [location, setLocation] = useState("");
  const [nextCheckAt, setNextCheckAt] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError(null);
    try {
      await createEquipment(token, {
        companyId,
        name: name.trim(),
        type: type.trim(),
        model: model.trim() || undefined,
        serialNumber: serialNumber.trim() || undefined,
        location: location.trim() || undefined,
        nextCheckAt: nextCheckAt ? new Date(nextCheckAt).toISOString() : undefined,
      });
      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore salvataggio");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={formStyle}>
      <h4>Nuova attrezzatura</h4>
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
      <FormActions busy={busy} onClose={onClose} editing={false} />
    </form>
  );
}

// ─── MACHINES TAB ─────────────────────────────────────────────────────────────

function MachinesTab({
  token,
  companyId,
  items,
  onChanged,
  onError,
}: {
  token: string;
  companyId: string;
  items: Machine[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="panel">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Macchine (manutenzione + sicurezza)</h3>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Chiudi" : "+ Nuova macchina"}
        </button>
      </header>

      {showForm ? (
        <MachineForm
          token={token}
          companyId={companyId}
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
            <th>Nome</th>
            <th>Tipo</th>
            <th>Costruttore</th>
            <th>Rischio</th>
            <th>Ubicazione</th>
            <th>Prossima manutenzione</th>
            <th>Prossimo controllo sicurezza</th>
            <th>Stato</th>
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
              </tr>
            );
          })}
          {items.length === 0 ? (
            <tr>
              <td colSpan={8}>Nessuna macchina registrata.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

function MachineForm({ token, companyId, onClose, onSaved, onError }: FormCommon) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [location, setLocation] = useState("");
  const [nextMaintenanceAt, setNextMaintenanceAt] = useState("");
  const [nextSafetyCheckAt, setNextSafetyCheckAt] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError(null);
    try {
      await createMachine(token, {
        companyId,
        name: name.trim(),
        type: type.trim(),
        manufacturer: manufacturer.trim() || undefined,
        riskLevel: riskLevel.trim() || undefined,
        location: location.trim() || undefined,
        nextMaintenanceAt: nextMaintenanceAt ? new Date(nextMaintenanceAt).toISOString() : undefined,
        nextSafetyCheckAt: nextSafetyCheckAt ? new Date(nextSafetyCheckAt).toISOString() : undefined,
      });
      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore salvataggio");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={formStyle}>
      <h4>Nuova macchina</h4>
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
      <FormActions busy={busy} onClose={onClose} editing={false} />
    </form>
  );
}

// ─── EXTINGUISHERS TAB ────────────────────────────────────────────────────────

function ExtinguishersTab({
  token,
  companyId,
  items,
  onChanged,
  onError,
}: {
  token: string;
  companyId: string;
  items: FireExtinguisher[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="panel">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Estintori</h3>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Chiudi" : "+ Nuovo estintore"}
        </button>
      </header>

      {showForm ? (
        <ExtinguisherForm
          token={token}
          companyId={companyId}
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
            <th>Codice</th>
            <th>Tipo</th>
            <th>Capacità</th>
            <th>Ubicazione</th>
            <th>Prossimo controllo</th>
            <th>Ultima ricarica</th>
            <th>Stato</th>
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
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={7}>Nessun estintore registrato.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

function ExtinguisherForm({ token, companyId, onClose, onSaved, onError }: FormCommon) {
  const [code, setCode] = useState("");
  const [type, setType] = useState("polvere ABC");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [nextCheckAt, setNextCheckAt] = useState("");
  const [lastRechargeAt, setLastRechargeAt] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError(null);
    try {
      await createFireExtinguisher(token, {
        companyId,
        code: code.trim(),
        type: type.trim(),
        location: location.trim(),
        capacity: capacity.trim() || undefined,
        manufactureDate: manufactureDate ? new Date(manufactureDate).toISOString() : undefined,
        nextCheckAt: nextCheckAt ? new Date(nextCheckAt).toISOString() : undefined,
        lastRechargeAt: lastRechargeAt ? new Date(lastRechargeAt).toISOString() : undefined,
      });
      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore salvataggio");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={formStyle}>
      <h4>Nuovo estintore</h4>
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
      <FormActions busy={busy} onClose={onClose} editing={false} />
    </form>
  );
}

// ─── FIRST AID TAB ────────────────────────────────────────────────────────────

function FirstAidTab({
  token,
  companyId,
  items,
  onChanged,
  onError,
}: {
  token: string;
  companyId: string;
  items: FirstAidKit[];
  onChanged: () => Promise<void>;
  onError: (msg: string | null) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="panel">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Cassette pronto soccorso</h3>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Chiudi" : "+ Nuova cassetta PS"}
        </button>
      </header>

      {showForm ? (
        <FirstAidForm
          token={token}
          companyId={companyId}
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
            <th>Ubicazione</th>
            <th>Contenuto</th>
            <th>Prossimo controllo</th>
            <th>Ultimo riassortimento</th>
            <th>Stato</th>
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
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={5}>Nessuna cassetta PS registrata.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

function FirstAidForm({ token, companyId, onClose, onSaved, onError }: FormCommon) {
  const [location, setLocation] = useState("");
  const [contents, setContents] = useState("");
  const [nextCheckAt, setNextCheckAt] = useState("");
  const [replenishedAt, setReplenishedAt] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError(null);
    try {
      await createFirstAidKit(token, {
        companyId,
        location: location.trim(),
        contents: contents.trim() || undefined,
        nextCheckAt: nextCheckAt ? new Date(nextCheckAt).toISOString() : undefined,
        replenishedAt: replenishedAt ? new Date(replenishedAt).toISOString() : undefined,
      });
      await onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Errore salvataggio");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={formStyle}>
      <h4>Nuova cassetta PS</h4>
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
      <FormActions busy={busy} onClose={onClose} editing={false} />
    </form>
  );
}

// ─── HELPERS / STYLE ──────────────────────────────────────────────────────────

interface FormCommon {
  token: string;
  companyId: string;
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (msg: string | null) => void;
}

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

function FormActions({
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

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("it-IT");
}

function soonest(...dates: Array<string | null | undefined>): string | null {
  const valid = dates.filter((d): d is string => Boolean(d));
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => (new Date(a).getTime() < new Date(b).getTime() ? a : b));
}

function statusRowStyle(nextDate?: string | null): React.CSSProperties {
  if (!nextDate) return {};
  const days = Math.ceil((new Date(nextDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { background: "#fde4e4" };
  if (days <= 30) return { background: "#fff3d6" };
  if (days <= 90) return { background: "#fffbe1" };
  return {};
}
