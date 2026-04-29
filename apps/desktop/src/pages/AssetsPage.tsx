import { useEffect, useState } from "react";
import {
  Company,
  Equipment,
  fetchEquipmentPaged,
  fetchFireExtinguishersPaged,
  fetchFirstAidKitsPaged,
  fetchMachinesPaged,
  FireExtinguisher,
  FirstAidKit,
  Machine,
} from "../api";
import EquipmentTab from "./assets/EquipmentTab";
import MachinesTab from "./assets/MachinesTab";
import ExtinguishersTab from "./assets/ExtinguishersTab";
import FirstAidTab from "./assets/FirstAidTab";

export type AssetKind = "equipment" | "machine" | "extinguisher" | "firstAid";

interface AssetsPageProps {
  token: string;
  companies: Company[];
  onOpenQr: (assetId: string, kind: AssetKind) => void;
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
            onOpenQr={onOpenQr}
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
            onOpenQr={onOpenQr}
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
            onOpenQr={onOpenQr}
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
