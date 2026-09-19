// Step 4 "Asset & Attrezzature" — Sprint 18 Wave B.
// Embedded reuse of asset tab components (Sprint 12 split): Equipment / Machines /
// Extinguishers / FirstAid. Il companyId e' fissato dall'inspection corrente: niente
// company picker locale, niente possibilita di cambiare azienda nel wizard.

import { useEffect, useState } from "react";
import {
  ChecklistItem,
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
import { getMachineSpecificRequirements } from "./machineRequirements";

export type AssetSubTab = "equipment" | "machines" | "extinguishers" | "firstAid";

interface Step4AssetAttrezzatureProps {
  token: string;
  companyId: string;
  onOpenQr: (assetId: string, kind: "equipment" | "machine" | "extinguisher" | "firstAid") => void;
  onAddCustomItems?: (
    items: Array<{
      section?: string;
      area: string;
      question: string;
      normReference?: string;
      defaultSeverity?: number;
      defaultSanctionable?: boolean;
      domain?: "safety" | "haccp" | "both";
    }>,
  ) => Promise<unknown>;
  existingChecklistItems?: ChecklistItem[];
}

export default function Step4AssetAttrezzature({
  token,
  companyId,
  onOpenQr,
  onAddCustomItems,
  existingChecklistItems = [],
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
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [integratingMachineId, setIntegratingMachineId] = useState<string | null>(null);

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
      <div role="status" className="status-banner status-banner-warning" style={{ marginBottom: 12 }}>
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
      {error ? <p style={{ color: "var(--color-error)" }}>{error}</p> : null}

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

          {machines.length > 0 ? (
            <div
              className="machine-compliance-section"
              style={{
                marginTop: 24,
                padding: "16px 20px",
                borderRadius: 8,
                backgroundColor: "var(--card-bg, #ffffff)",
                border: "1px solid var(--border-color, #e2e8f0)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.1rem" }}>
                    📋 Requisiti Specifici di Sicurezza Generati per le Macchine Registrate
                  </h4>
                  <p style={{ margin: "4px 0 0", color: "var(--text-muted, #64748b)", fontSize: "0.88rem" }}>
                    In base alle macchine registrate in azienda, il sistema genera automaticamente i controlli di sicurezza
                    obbligatori ai sensi del D.Lgs. 81/2008 (Titolo III, All. V e VI / Direttiva Macchine).
                  </p>
                </div>
              </div>

              {actionMessage ? (
                <div role="status" className="status-banner status-banner-info" style={{ marginBottom: 14 }}>
                  {actionMessage}
                </div>
              ) : null}

              <div style={{ display: "grid", gap: 14 }}>
                {machines.map((m) => {
                  const reqs = getMachineSpecificRequirements(m.name, m.model);
                  const isAlreadyIncluded = existingChecklistItems.some(
                    (it) => it.area.toLowerCase() === reqs[0].area.toLowerCase(),
                  );

                  return (
                    <div
                      key={m.id}
                      style={{
                        border: "1px solid var(--border-color, #e2e8f0)",
                        borderRadius: 6,
                        padding: 14,
                        backgroundColor: "var(--bg-subtle, #f8fafc)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 8,
                          marginBottom: 10,
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: "1rem" }}>{m.name}</strong>
                          {m.model ? <span style={{ color: "var(--text-muted, #64748b)", marginLeft: 8 }}>Mod. {m.model}</span> : null}
                          {m.serialNumber ? (
                            <span style={{ color: "var(--text-muted, #64748b)", marginLeft: 8, fontSize: "0.85rem" }}>
                              (Matricola: {m.serialNumber})
                            </span>
                          ) : null}
                        </div>

                        {onAddCustomItems ? (
                          isAlreadyIncluded ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "4px 10px",
                                borderRadius: 4,
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                                color: "#059669",
                                fontWeight: 600,
                                fontSize: "0.85rem",
                              }}
                            >
                              ✓ 6 Requisiti inclusi nella Checklist
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ fontSize: "0.85rem", padding: "6px 12px" }}
                              disabled={integratingMachineId === m.id}
                              onClick={async () => {
                                setIntegratingMachineId(m.id);
                                setActionMessage(null);
                                try {
                                  await onAddCustomItems(
                                    reqs.map((r) => ({
                                      section: "premises_equipment",
                                      domain: "safety",
                                      area: r.area,
                                      question: r.question,
                                      normReference: r.normReference,
                                      defaultSeverity: r.defaultSeverity,
                                      defaultSanctionable: r.defaultSanctionable,
                                    })),
                                  );
                                  setActionMessage(
                                    `✓ 6 Requisiti specifici di sicurezza per "${m.name}" integrati nella checklist del sopralluogo!`,
                                  );
                                } catch (e) {
                                  setError(
                                    e instanceof Error ? e.message : "Errore integrazione requisiti macchina.",
                                  );
                                } finally {
                                  setIntegratingMachineId(null);
                                }
                              }}
                            >
                              {integratingMachineId === m.id ? "Integrazione in corso..." : "⚡ Includi 6 Requisiti nella Checklist"}
                            </button>
                          )
                        ) : null}
                      </div>

                      <div style={{ fontSize: "0.84rem", color: "var(--text-muted, #475569)", display: "grid", gap: 6 }}>
                        {reqs.map((r) => (
                          <div
                            key={r.code}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 12,
                              padding: "4px 8px",
                              backgroundColor: "var(--card-bg, #ffffff)",
                              borderRadius: 4,
                              border: "1px solid var(--border-color, #f1f5f9)",
                            }}
                          >
                            <span>
                              <strong>{r.title}</strong>: {r.question}
                            </span>
                            <span style={{ whiteSpace: "nowrap", color: "#64748b", fontStyle: "italic", fontSize: "0.8rem" }}>
                              {r.normReference}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
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
