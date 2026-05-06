// Step 4 "Asset & Attrezzature" — Sprint 18 Wave B.
// Embedded reuse of asset tab components (Sprint 12 split): Equipment / Machines /
// Extinguishers / FirstAid. Il companyId e' fissato dall'inspection corrente: niente
// company picker locale, niente possibilita di cambiare azienda nel wizard.

import { useEffect, useState } from "react";
import {
  Equipment,
  fetchEquipmentPaged,
  fetchFireExtinguishersPaged,
  fetchFirstAidKitsPaged,
  fetchMachinesPaged,
  FireExtinguisher,
  FirstAidKit,
  Machine,
} from "../../api";
import EquipmentTab from "../assets/EquipmentTab";
import MachinesTab from "../assets/MachinesTab";
import ExtinguishersTab from "../assets/ExtinguishersTab";
import FirstAidTab from "../assets/FirstAidTab";

export type AssetSubTab = "equipment" | "machines" | "extinguishers" | "firstAid";

interface Step4AssetAttrezzatureProps {
  token: string;
  companyId: string;
  onOpenQr: (assetId: string, kind: "equipment" | "machine" | "extinguisher" | "firstAid") => void;
}

export default function Step4AssetAttrezzature({
  token,
  companyId,
  onOpenQr,
}: Step4AssetAttrezzatureProps) {
  const [tab, setTab] = useState<AssetSubTab>("equipment");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [extinguishers, setExtinguishers] = useState<FireExtinguisher[]>([]);
  const [firstAidKits, setFirstAidKits] = useState<FirstAidKit[]>([]);
  const [meta, setMeta] = useState<{
    equipment?: { total: number | null; truncated: boolean };
    machines?: { total: number | null; truncated: boolean };
    extinguishers?: { total: number | null; truncated: boolean };
    firstAidKits?: { total: number | null; truncated: boolean };
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (companyId) void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, token]);

  async function reload() {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const [eq, ma, ex, kits] = await Promise.all([
        fetchEquipmentPaged(token, { companyId }),
        fetchMachinesPaged(token, { companyId }),
        fetchFireExtinguishersPaged(token, { companyId }),
        fetchFirstAidKitsPaged(token, { companyId }),
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
        Visualizzati i primi <strong>{shown}</strong>
        {total != null ? <> di <strong>{total}</strong></> : null} {label}.
        Affina i criteri lato backend per vederne di piu.
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="panel section-panel">
        <h3>Asset & Attrezzature</h3>
        <p>
          Seleziona/crea prima un'azienda al passo &quot;Dati Azienda&quot; per registrare asset
          collegati al sopralluogo.
        </p>
      </div>
    );
  }

  return (
    <div className="panel section-panel">
      <header style={{ marginBottom: 12 }}>
        <h3>Asset & Attrezzature dell'azienda</h3>
        <p>
          Registra macchine, attrezzature, estintori e cassette di primo soccorso collegate
          al sopralluogo. L'azienda e' fissata dal passo &quot;Dati Azienda&quot;.
        </p>
      </header>

      <div className="tab-bar" style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <SubTabButton active={tab === "equipment"} onClick={() => setTab("equipment")}>
          Attrezzature ({equipment.length})
        </SubTabButton>
        <SubTabButton active={tab === "machines"} onClick={() => setTab("machines")}>
          Macchine ({machines.length})
        </SubTabButton>
        <SubTabButton active={tab === "extinguishers"} onClick={() => setTab("extinguishers")}>
          Estintori ({extinguishers.length})
        </SubTabButton>
        <SubTabButton active={tab === "firstAid"} onClick={() => setTab("firstAid")}>
          Cassette PS ({firstAidKits.length})
        </SubTabButton>
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
            companyId={companyId}
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
            companyId={companyId}
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
            companyId={companyId}
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
            companyId={companyId}
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

function SubTabButton({
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
