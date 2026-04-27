import { useEffect, useMemo, useState } from "react";
import {
  Company,
  createEquipment,
  createFireExtinguisher,
  createFirstAidKit,
  createMachine,
  deleteEquipment,
  deleteFireExtinguisher,
  deleteFirstAidKit,
  deleteMachine,
  Equipment,
  fetchEquipmentPaged,
  fetchFireExtinguishersPaged,
  fetchFirstAidKitsPaged,
  fetchMachinesPaged,
  FireExtinguisher,
  FirstAidKit,
  Machine,
  updateEquipment,
  updateFireExtinguisher,
  updateFirstAidKit,
  updateMachine,
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
  // S11: meta paginazione per ogni tab — { total, truncated } per warning UI
  // quando il backend cappa take:200 (vedi MEDIUM-02 review).
  const [meta, setMeta] = useState<{
    equipment?: { total: number | null; truncated: boolean };
    machines?: { total: number | null; truncated: boolean };
    extinguishers?: { total: number | null; truncated: boolean };
    firstAidKits?: { total: number | null; truncated: boolean };
  }>({});
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
        fetchEquipmentPaged(token, { companyId: companyFilter }),
        fetchMachinesPaged(token, { companyId: companyFilter }),
        fetchFireExtinguishersPaged(token, { companyId: companyFilter }),
        fetchFirstAidKitsPaged(token, { companyId: companyFilter }),
      ]);
      setEquipment(eq.items);
      setMachines(ma.items);
      setExtinguishers(ex.items);
      setFirstAidKits(kits.items);
      setMeta({
        equipment: { total: eq.total, truncated: eq.truncated },
        machines: { total: ma.total, truncated: ma.truncated },
        extinguishers: { total: ex.total, truncated: ex.truncated },
        firstAidKits: { total: kits.total, truncated: kits.truncated },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore caricamento asset");
    } finally {
      setLoading(false);
    }
  }

  // S11: helper UI per warning truncated.
  function TruncatedBanner({ shown, total, label }: { shown: number; total: number | null; label: string }) {
    return (
      <div
        role="status"
        style={{
          background: "#fef3c7",
          border: "1px solid #fbbf24",
          color: "#92400e",
          padding: "8px 12px",
          borderRadius: 6,
          marginBottom: 12,
          fontSize: 14,
        }}
      >
        ⚠️ Visualizzati i primi <strong>{shown}</strong>{total != null ? <> di <strong>{total}</strong></> : null} {label}.
        Affina il filtro per azienda o aggiungi <code>?limit=500</code> alla URL backend per vederne di più.
      </div>
    );
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
        <>
          {meta.equipment?.truncated ? (
            <TruncatedBanner shown={equipment.length} total={meta.equipment.total} label="attrezzature" />
          ) : null}
          <EquipmentTab
            token={token}
            companyId={companyFilter}
            items={equipment}
            onChanged={reload}
            onError={setError}
            onOpenQr={onOpenQr}
          />
        </>
      ) : tab === "machines" ? (
        <>
          {meta.machines?.truncated ? (
            <TruncatedBanner shown={machines.length} total={meta.machines.total} label="macchine" />
          ) : null}
          <MachinesTab
            token={token}
            companyId={companyFilter}
            items={machines}
            onChanged={reload}
            onError={setError}
          />
        </>
      ) : tab === "extinguishers" ? (
        <>
          {meta.extinguishers?.truncated ? (
            <TruncatedBanner shown={extinguishers.length} total={meta.extinguishers.total} label="estintori" />
          ) : null}
          <ExtinguishersTab
            token={token}
            companyId={companyFilter}
            items={extinguishers}
            onChanged={reload}
            onError={setError}
          />
        </>
      ) : (
        <>
          {meta.firstAidKits?.truncated ? (
            <TruncatedBanner shown={firstAidKits.length} total={meta.firstAidKits.total} label="cassette PS" />
          ) : null}
          <FirstAidTab
            token={token}
            companyId={companyFilter}
            items={firstAidKits}
            onChanged={reload}
            onError={setError}
          />
        </>
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
      className={`tab-btn ${active ? "tab-btn-active" : ""}`}
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
                  onQr={() => onOpenQr(eq.id)}
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
                  <RowActions onEdit={() => startEdit(m)} onDelete={() => handleDelete(m)} />
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
                <RowActions onEdit={() => startEdit(ex)} onDelete={() => handleDelete(ex)} />
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

function toDateInput(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function RowActions({
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
        style={{ color: "crimson" }}
      >
        Elimina
      </button>
    </div>
  );
}
