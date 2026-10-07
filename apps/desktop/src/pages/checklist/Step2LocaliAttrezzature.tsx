import { useState, useMemo, useEffect } from "react";
import { ChecklistItem } from "../../api";
import { LocalAnswer, AnswerValue } from "./_shared";
import {
  PREMISES_ENVIRONMENTS,
  PremisesAreaKey,
  categorizePremisesItem,
  PremisesEnvironmentMeasurements,
  defaultEnvironmentMeasurements,
} from "./normativePremisesCatalog";

interface Step2LocaliAttrezzatureProps {
  premisesItems: ChecklistItem[];
  answers?: Record<string, LocalAnswer>;
  updateAnswer?: (itemId: string, partial: Partial<LocalAnswer>) => void;
  renderAnswersTable?: (items: ChecklistItem[]) => React.ReactNode;
  onAddCustomItem?: (item: {
    section: "premises_equipment" | "machinery_safety";
    area: string;
    question: string;
    normReference?: string;
    defaultSeverity?: number;
    defaultSanctionable?: boolean;
    domain?: "safety" | "haccp" | "both";
  }) => Promise<unknown>;
  isInspectionValidated?: boolean;
  atecoCode?: string;
  checklistMode?: string;
}

export default function Step2LocaliAttrezzature({
  premisesItems,
  answers = {},
  updateAnswer,
  renderAnswersTable,
  onAddCustomItem,
  isInspectionValidated = false,
}: Step2LocaliAttrezzatureProps) {
  // Ambiente/Reparto fisico attualmente selezionato
  const [selectedEnvKey, setSelectedEnvKey] = useState<PremisesAreaKey>("uffici");
  
  // Vista a schede reparti vs vista tabella classica (fallback)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  
  // Filtro ricerca e filtro esito
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOutcome, setFilterOutcome] = useState<"all" | "yes" | "no" | "na">("all");
  
  // Pannello parametri dimensionali e strutturali aperto/chiuso
  const [showMeasurementsPanel, setShowMeasurementsPanel] = useState(false);
  
  // Misure e rilievi strutturali per ciascun reparto
  const [measurementsByEnv, setMeasurementsByEnv] = useState<Record<string, PremisesEnvironmentMeasurements>>({});

  // Modale per nuovo requisito personalizzato
  const [showAddModal, setShowAddModal] = useState(false);
  const [customArea, setCustomArea] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [customNormRef, setCustomNormRef] = useState("");
  const [customSeverity, setCustomSeverity] = useState(2);
  const [customSanctionable, setCustomSanctionable] = useState(true);
  const [customDomain, setCustomDomain] = useState<"safety" | "haccp" | "both">("safety");
  const [submittingCustom, setSubmittingCustom] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  // Mappatura degli items per ciascun ambiente
  const itemsByEnvironment = useMemo(() => {
    const map: Record<PremisesAreaKey, ChecklistItem[]> = {
      uffici: [],
      magazzino: [],
      laboratorio_cucina: [],
      vendita_pubblico: [],
      servizi_spogliatoi: [],
      tecnici_esterno: [],
      tutti: premisesItems,
    };

    for (const item of premisesItems) {
      const envKey = categorizePremisesItem(item);
      map[envKey].push(item);
    }

    return map;
  }, [premisesItems]);

  // Se l'ambiente selezionato è vuoto, proviamo a selezionare il primo ambiente popolato
  useEffect(() => {
    if (selectedEnvKey !== "tutti" && itemsByEnvironment[selectedEnvKey].length === 0) {
      const firstPopulated = (
        ["uffici", "magazzino", "laboratorio_cucina", "vendita_pubblico", "servizi_spogliatoi", "tecnici_esterno"] as PremisesAreaKey[]
      ).find((k) => itemsByEnvironment[k].length > 0);
      if (firstPopulated) {
        setSelectedEnvKey(firstPopulated);
      }
    }
  }, [itemsByEnvironment, selectedEnvKey]);

  // Helper per ottenere l'answer corrente
  const getAnswer = (item: ChecklistItem): LocalAnswer => {
    if (answers[item.id]) {
      return answers[item.id];
    }
    return {
      value: "na",
      note: "",
      severity: item.defaultSeverity,
      isSanctionable: item.defaultSanctionable,
    };
  };

  // Helper per aggiornare l'answer
  const handleUpdate = (itemId: string, partial: Partial<LocalAnswer>) => {
    if (isInspectionValidated || !updateAnswer) return;
    updateAnswer(itemId, partial);
  };

  // Statistiche globali e per reparto
  const stats = useMemo(() => {
    let total = premisesItems.length;
    let yes = 0;
    let no = 0;
    let na = 0;
    let sanctionableNo = 0;

    for (const item of premisesItems) {
      const ans = getAnswer(item);
      if (ans.value === "yes") yes++;
      else if (ans.value === "no") {
        no++;
        if (ans.isSanctionable) sanctionableNo++;
      } else na++;
    }

    return { total, yes, no, na, sanctionableNo };
  }, [premisesItems, answers]);

  // Statistiche per singolo ambiente (per badge su tab)
  const envStats = useMemo(() => {
    const res: Record<PremisesAreaKey, { total: number; no: number }> = {
      uffici: { total: 0, no: 0 },
      magazzino: { total: 0, no: 0 },
      laboratorio_cucina: { total: 0, no: 0 },
      vendita_pubblico: { total: 0, no: 0 },
      servizi_spogliatoi: { total: 0, no: 0 },
      tecnici_esterno: { total: 0, no: 0 },
      tutti: { total: premisesItems.length, no: stats.no },
    };

    (Object.keys(itemsByEnvironment) as PremisesAreaKey[]).forEach((env) => {
      const items = itemsByEnvironment[env];
      let noCount = 0;
      for (const it of items) {
        if (getAnswer(it).value === "no") noCount++;
      }
      res[env] = { total: items.length, no: noCount };
    });

    return res;
  }, [itemsByEnvironment, answers, stats.no, premisesItems.length]);

  // Lista di items visibili in base a reparto selezionato, ricerca e filtro esito
  const displayedItems = useMemo(() => {
    const baseItems = itemsByEnvironment[selectedEnvKey] || [];

    return baseItems.filter((item) => {
      const ans = getAnswer(item);

      // Filtro esito
      if (filterOutcome === "yes" && ans.value !== "yes") return false;
      if (filterOutcome === "no" && ans.value !== "no") return false;
      if (filterOutcome === "na" && ans.value !== "na") return false;

      // Filtro ricerca
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesArea = item.area.toLowerCase().includes(q);
        const matchesQuestion = item.question.toLowerCase().includes(q);
        const matchesNorm = (item.normReference ?? "").toLowerCase().includes(q);
        const matchesNote = (ans.note ?? "").toLowerCase().includes(q);
        if (!matchesArea && !matchesQuestion && !matchesNorm && !matchesNote) {
          return false;
        }
      }

      return true;
    });
  }, [itemsByEnvironment, selectedEnvKey, filterOutcome, searchQuery, answers]);

  // Gestione misure correnti del locale selezionato
  const currentMeasurements = measurementsByEnv[selectedEnvKey] || defaultEnvironmentMeasurements();

  const handleMeasurementChange = (field: keyof PremisesEnvironmentMeasurements, val: any) => {
    setMeasurementsByEnv((prev) => ({
      ...prev,
      [selectedEnvKey]: {
        ...(prev[selectedEnvKey] || defaultEnvironmentMeasurements()),
        [field]: val,
      },
    }));
  };

  // Sottomissione modale nuovo requisito personalizzato
  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customArea.trim() || !customQuestion.trim()) {
      setCustomError("Compila almeno il Nome Area/Locale e la Domanda di verifica.");
      return;
    }
    if (!onAddCustomItem) return;

    setSubmittingCustom(true);
    setCustomError(null);
    try {
      await onAddCustomItem({
        section: "premises_equipment",
        area: customArea.trim(),
        question: customQuestion.trim(),
        normReference: customNormRef.trim() || undefined,
        defaultSeverity: customSeverity,
        defaultSanctionable: customSanctionable,
        domain: customDomain,
      });

      setCustomArea("");
      setCustomQuestion("");
      setCustomNormRef("");
      setCustomSeverity(2);
      setCustomSanctionable(true);
      setShowAddModal(false);
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : "Errore durante il salvataggio del requisito.");
    } finally {
      setSubmittingCustom(false);
    }
  };

  const currentEnvDef = PREMISES_ENVIRONMENTS[selectedEnvKey];

  return (
    <div className="panel section-panel" style={{ padding: "20px" }}>
      {/* Header principale */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "22px", color: "var(--color-primary, #0f172a)" }}>
            Ispezione Locali e Ambienti di Lavoro
          </h3>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Verifica dei requisiti di sicurezza (D.Lgs. 81/2008 Allegato IV) e igienico-sanitari (Reg. CE 852/2004 All. II) organizzati per reparto reale.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {selectedEnvKey !== "tutti" && (
            <button
              type="button"
              className="button"
              style={{
                backgroundColor: showMeasurementsPanel ? "#e0e7ff" : "#f1f5f9",
                color: showMeasurementsPanel ? "#3730a3" : "#334155",
                border: "1px solid #cbd5e1",
                padding: "8px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => setShowMeasurementsPanel((p) => !p)}
            >
              📐 {showMeasurementsPanel ? "Chiudi Misure Locale" : "Misure & Dati Strutturali"}
            </button>
          )}

          {onAddCustomItem && !isInspectionValidated && (
            <button
              type="button"
              className="button"
              style={{
                backgroundColor: "var(--color-primary, #0f172a)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => {
                setCustomArea(currentEnvDef.shortLabel);
                setShowAddModal(true);
              }}
            >
              ➕ Aggiungi Controllo nel Reparto
            </button>
          )}

          {renderAnswersTable && (
            <button
              type="button"
              style={{
                backgroundColor: "transparent",
                color: "#64748b",
                border: "1px solid #cbd5e1",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}
              onClick={() => setViewMode((m) => (m === "cards" ? "table" : "cards"))}
            >
              {viewMode === "cards" ? "📋 Vista Tabella" : "🗂️ Vista Schede Reparto"}
            </button>
          )}
        </div>
      </div>

      {/* Cruscotto Statistiche Rapide */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px" }}>
          <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
            TOTALE CONTROLLI
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>{stats.total}</div>
        </div>
        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 16px" }}>
          <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700, textTransform: "uppercase" }}>
            ✅ CONFORMI (SÌ)
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#16a34a" }}>{stats.yes}</div>
        </div>
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px" }}>
          <div style={{ fontSize: "11px", color: "#dc2626", fontWeight: 700, textTransform: "uppercase" }}>
            ❌ NON CONFORMI (NO)
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#dc2626", display: "flex", alignItems: "baseline", gap: 6 }}>
            {stats.no}
            {stats.sanctionableNo > 0 && (
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#991b1b" }}>
                ({stats.sanctionableNo} sanzionabili)
              </span>
            )}
          </div>
        </div>
        <div style={{ backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 8, padding: "12px 16px" }}>
          <div style={{ fontSize: "11px", color: "#475569", fontWeight: 700, textTransform: "uppercase" }}>
            ⚪ NON APPLICABILI (N/A)
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#475569" }}>{stats.na}</div>
        </div>
      </div>

      {/* Navigatore Ambienti / Reparti Fisici */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 6,
            borderBottom: "2px solid #e2e8f0",
          }}
        >
          {(
            [
              "uffici",
              "magazzino",
              "laboratorio_cucina",
              "vendita_pubblico",
              "servizi_spogliatoi",
              "tecnici_esterno",
              "tutti",
            ] as PremisesAreaKey[]
          ).map((key) => {
            const def = PREMISES_ENVIRONMENTS[key];
            const isSelected = selectedEnvKey === key;
            const count = envStats[key].total;
            const ncCount = envStats[key].no;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedEnvKey(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  borderRadius: "8px 8px 0 0",
                  border: isSelected ? "2px solid var(--color-primary, #0f172a)" : "1px solid #e2e8f0",
                  borderBottom: isSelected ? "2px solid #fff" : "1px solid #e2e8f0",
                  backgroundColor: isSelected ? "#fff" : "#f8fafc",
                  color: isSelected ? "var(--color-primary, #0f172a)" : "#64748b",
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "13px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  marginBottom: isSelected ? "-2px" : "0",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{def.icon}</span>
                <span>{def.shortLabel}</span>
                <span
                  style={{
                    backgroundColor: isSelected ? "#e2e8f0" : "#cbd5e1",
                    color: "#334155",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
                {ncCount > 0 && (
                  <span
                    style={{
                      backgroundColor: "#fee2e2",
                      color: "#b91c1c",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                    title={`${ncCount} non conformità rilevate`}
                  >
                    ⚠️ {ncCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Box descrittivo dell'ambiente attivo */}
      {selectedEnvKey !== "tutti" && (
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: "16px" }}>{currentEnvDef.icon}</span>
              <strong style={{ fontSize: "15px", color: "#0f172a" }}>{currentEnvDef.label}</strong>
              <span style={{ fontSize: "12px", color: "#64748b", backgroundColor: "#e2e8f0", padding: "2px 8px", borderRadius: 4 }}>
                {currentEnvDef.normReference}
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>{currentEnvDef.description}</div>
          </div>
          <div style={{ fontSize: "12px", color: "#475569", fontWeight: 600 }}>
            📏 {currentEnvDef.minHeightLabel}
          </div>
        </div>
      )}

      {/* Pannello Dati Strutturali & Misure (richiudibile) */}
      {showMeasurementsPanel && selectedEnvKey !== "tutti" && (
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: "15px", color: "#166534", display: "flex", alignItems: "center", gap: 6 }}>
              📐 Rilievo Dimensionale & Parametri Strutturali: {currentEnvDef.shortLabel}
            </h4>
            <span style={{ fontSize: "12px", color: "#15803d" }}>D.Lgs. 81/2008 Allegato IV (punto 1.2)</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                Superficie Calpestabile (mq)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                placeholder="Es. 45.5"
                disabled={isInspectionValidated}
                value={currentMeasurements.surfaceSqM ?? ""}
                onChange={(e) => handleMeasurementChange("surfaceSqM", e.target.value ? Number(e.target.value) : undefined)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                Altezza Utile Media (m)
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="number"
                  min={0}
                  step={0.05}
                  placeholder={`Es. ${currentEnvDef.minHeightStandard.toFixed(2)}`}
                  disabled={isInspectionValidated}
                  value={currentMeasurements.heightM ?? ""}
                  onChange={(e) => handleMeasurementChange("heightM", e.target.value ? Number(e.target.value) : undefined)}
                  style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                />
                {currentMeasurements.heightM !== undefined && (
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      backgroundColor: currentMeasurements.heightM >= currentEnvDef.minHeightStandard ? "#dcfce7" : "#fee2e2",
                      color: currentMeasurements.heightM >= currentEnvDef.minHeightStandard ? "#15803d" : "#b91c1c",
                    }}
                  >
                    {currentMeasurements.heightM >= currentEnvDef.minHeightStandard
                      ? "✅ A norma"
                      : `⚠️ Sotto standard (${currentEnvDef.minHeightStandard}m)`}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                Aerazione Locale
              </label>
              <select
                disabled={isInspectionValidated}
                value={currentMeasurements.aerationType}
                onChange={(e) => handleMeasurementChange("aerationType", e.target.value)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}
              >
                <option value="natural">Naturale diretta (finestre ≥ 1/8 superficie)</option>
                <option value="mechanical">Meccanica controllata (VMC certificata)</option>
                <option value="mixed">Mista (Naturale + Meccanica)</option>
                <option value="insufficient">⚠️ Insufficiente o assente (Cieco senza VMC)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                Illuminazione
              </label>
              <select
                disabled={isInspectionValidated}
                value={currentMeasurements.lightingType}
                onChange={(e) => handleMeasurementChange("lightingType", e.target.value)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}
              >
                <option value="natural_artificial">Naturale + Artificiale adeguata</option>
                <option value="artificial_only">Artificiale con illuminazione emergenza</option>
                <option value="poor">⚠️ Scarsa / lampade fulminate o abbaglianti</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                Stato Pavimenti & Pareti
              </label>
              <select
                disabled={isInspectionValidated}
                value={currentMeasurements.flooringCondition}
                onChange={(e) => handleMeasurementChange("flooringCondition", e.target.value)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}
              >
                <option value="compliant">Continui, antisdrucciolo, regolari</option>
                <option value="minor_issues">Lievi imperfezioni non pericolose</option>
                <option value="slippery_damaged">⚠️ Scivolosi, sconnessi o con buche</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                Impianto Elettrico di Zona
              </label>
              <select
                disabled={isInspectionValidated}
                value={currentMeasurements.electricalSafety}
                onChange={(e) => handleMeasurementChange("electricalSafety", e.target.value)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}
              >
                <option value="compliant">Quadri chiusi, differenziali provati, DICO</option>
                <option value="needs_check">Prese multiple a cascata o cavi volanti</option>
                <option value="open_panels_wires">⚠️ Quadro scoperto o parti in tensione esposte</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Barra Filtri e Ricerca */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
          backgroundColor: "#f8fafc",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "1 1 280px" }}>
          <span style={{ fontSize: "16px" }}>🔍</span>
          <input
            type="text"
            placeholder="Cerca controllo nel reparto (es. uscita, cavo, scaffale, cappa, estintore)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "7px 12px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(
            [
              { id: "all", label: "Tutti" },
              { id: "no", label: "❌ Solo Non Conformi (NO)" },
              { id: "yes", label: "✅ Solo Conformi (Sì)" },
              { id: "na", label: "⚪ Solo N/A" },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterOutcome(f.id)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: filterOutcome === f.id ? "1px solid var(--color-primary, #0f172a)" : "1px solid #cbd5e1",
                backgroundColor: filterOutcome === f.id ? "var(--color-primary, #0f172a)" : "#fff",
                color: filterOutcome === f.id ? "#fff" : "#334155",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vista Tabella Classica Fallback */}
      {viewMode === "table" && renderAnswersTable ? (
        <div>{renderAnswersTable(displayedItems)}</div>
      ) : (
        /* Vista a Schede Reparto con Pulsanti Grandi Sì / No / N/A */
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {displayedItems.map((item) => {
            const answer = getAnswer(item);
            const isNo = answer.value === "no";
            const isYes = answer.value === "yes";
            const isNa = answer.value === "na";

            return (
              <div
                key={item.id}
                style={{
                  border: isNo
                    ? "2px solid #ef4444"
                    : isYes
                    ? "1px solid #86efac"
                    : "1px solid #e2e8f0",
                  backgroundColor: isNo ? "#fff5f5" : isYes ? "#fafffb" : "#fff",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "all 0.15s ease",
                }}
              >
                {/* Riga superiore: Metadati, Area e Riferimento Normativo */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span
                      style={{
                        backgroundColor: "#f1f5f9",
                        color: "#334155",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.area}
                    </span>
                    {item.normReference && (
                      <span
                        style={{
                          backgroundColor: "#eff6ff",
                          color: "#1d4ed8",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        ⚖️ {item.normReference}
                      </span>
                    )}
                    <span
                      style={{
                        backgroundColor: item.domain === "haccp" ? "#fef3c7" : "#e0e7ff",
                        color: item.domain === "haccp" ? "#92400e" : "#3730a3",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {item.domain === "haccp" ? "HACCP / Alimenti" : "Sicurezza D.Lgs. 81/08"}
                    </span>
                  </div>

                  {isNo && (
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span
                        style={{
                          backgroundColor: "#fee2e2",
                          color: "#b91c1c",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        🚨 NON CONFORME (Gravità {answer.severity ?? item.defaultSeverity})
                      </span>
                      {answer.isSanctionable && (
                        <span
                          style={{
                            backgroundColor: "#b91c1c",
                            color: "#fff",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          SANZIONABILE
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Domanda / Requisito di Verifica */}
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", marginBottom: 14 }}>
                  {item.question}
                </div>

                {/* Pulsanti Risposta Primari (SÌ / NO / N/A) */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: isNo || answer.note ? 14 : 0,
                  }}
                >
                  {/* SÌ (CONFORME) */}
                  <button
                    type="button"
                    disabled={isInspectionValidated}
                    onClick={() => handleUpdate(item.id, { value: "yes" })}
                    style={{
                      flex: "1 1 140px",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: isYes ? "2px solid #16a34a" : "1px solid #cbd5e1",
                      backgroundColor: isYes ? "#dcfce7" : "#fff",
                      color: isYes ? "#15803d" : "#334155",
                      fontWeight: isYes ? 700 : 500,
                      fontSize: "13px",
                      cursor: isInspectionValidated ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      boxShadow: isYes ? "0 1px 2px rgba(22,163,74,0.2)" : "none",
                    }}
                  >
                    <span>✅</span>
                    <span>SÌ (Conforme)</span>
                  </button>

                  {/* NO (NON CONFORME) */}
                  <button
                    type="button"
                    disabled={isInspectionValidated}
                    onClick={() =>
                      handleUpdate(item.id, {
                        value: "no",
                        severity: answer.severity ?? item.defaultSeverity,
                        isSanctionable:
                          typeof answer.isSanctionable === "boolean"
                            ? answer.isSanctionable
                            : item.defaultSanctionable,
                      })
                    }
                    style={{
                      flex: "1 1 140px",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: isNo ? "2px solid #dc2626" : "1px solid #cbd5e1",
                      backgroundColor: isNo ? "#fee2e2" : "#fff",
                      color: isNo ? "#b91c1c" : "#334155",
                      fontWeight: isNo ? 700 : 500,
                      fontSize: "13px",
                      cursor: isInspectionValidated ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      boxShadow: isNo ? "0 1px 2px rgba(220,38,38,0.2)" : "none",
                    }}
                  >
                    <span>❌</span>
                    <span>NO (Non Conforme)</span>
                  </button>

                  {/* NON APPLICABILE */}
                  <button
                    type="button"
                    disabled={isInspectionValidated}
                    onClick={() => handleUpdate(item.id, { value: "na" })}
                    style={{
                      flex: "1 1 140px",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: isNa ? "2px solid #475569" : "1px solid #cbd5e1",
                      backgroundColor: isNa ? "#f1f5f9" : "#fff",
                      color: isNa ? "#0f172a" : "#64748b",
                      fontWeight: isNa ? 700 : 500,
                      fontSize: "13px",
                      cursor: isInspectionValidated ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <span>⚪</span>
                    <span>Non Applicabile</span>
                  </button>
                </div>

                {/* Box Dettaglio Rilievo e Azione Correttiva quando è NO */}
                {isNo && (
                  <div
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                      padding: "14px",
                      marginTop: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 12,
                        marginBottom: 10,
                      }}
                    >
                      {/* Selettore Gravità */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Gravità Rischio:</span>
                        {(
                          [
                            { val: 1, label: "1 Lieve", color: "#16a34a" },
                            { val: 2, label: "2 Media", color: "#d97706" },
                            { val: 3, label: "3 Grave", color: "#dc2626" },
                            { val: 4, label: "4 Critica", color: "#7f1d1d" },
                          ] as const
                        ).map((lvl) => {
                          const isActive = (answer.severity ?? item.defaultSeverity) === lvl.val;
                          return (
                            <button
                              key={lvl.val}
                              type="button"
                              disabled={isInspectionValidated}
                              onClick={() => handleUpdate(item.id, { severity: lvl.val })}
                              style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                border: isActive ? `2px solid ${lvl.color}` : "1px solid #cbd5e1",
                                backgroundColor: isActive ? `${lvl.color}15` : "#fff",
                                color: isActive ? lvl.color : "#475569",
                                fontSize: "11px",
                                fontWeight: isActive ? 700 : 500,
                                cursor: "pointer",
                              }}
                            >
                              {lvl.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Sanzionabile Checkbox */}
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", fontWeight: 700, color: "#991b1b", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          disabled={isInspectionValidated}
                          checked={Boolean(answer.isSanctionable)}
                          onChange={(e) => handleUpdate(item.id, { isSanctionable: e.target.checked })}
                        />
                        <span>⚠️ Sanzione prevista da norma (ASL / VVF / NAS)</span>
                      </label>
                    </div>

                    {/* Area Note / Descrizione Non Conformità */}
                    <div style={{ marginBottom: 8 }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                        Descrizione del Rilievo / Azione Correttiva per il Verbale:
                      </label>
                      <textarea
                        rows={2}
                        disabled={isInspectionValidated}
                        placeholder="Descrivi l'anomalia riscontrata e l'azione correttiva richiesta..."
                        value={answer.note}
                        onChange={(e) => handleUpdate(item.id, { note: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "13px",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>

                    {/* Rilievi Tipici Rapidi con un Clic */}
                    {currentEnvDef.typicalNonConformities.length > 0 && !isInspectionValidated && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Suggerimenti rapidi:</span>
                        {currentEnvDef.typicalNonConformities.map((tnc, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              handleUpdate(item.id, {
                                note: answer.note ? `${answer.note}\n- ${tnc.noteText}` : tnc.noteText,
                                severity: tnc.severity,
                                isSanctionable: tnc.sanctionable,
                              })
                            }
                            style={{
                              backgroundColor: "#f1f5f9",
                              border: "1px solid #cbd5e1",
                              color: "#334155",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              cursor: "pointer",
                            }}
                          >
                            + {tnc.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Se Conforme o N/A, permette comunque di inserire una nota/osservazione */}
                {!isNo && (
                  <div style={{ marginTop: 8 }}>
                    <input
                      type="text"
                      disabled={isInspectionValidated}
                      placeholder="Note o osservazioni facoltative sul controllo..."
                      value={answer.note}
                      onChange={(e) => handleUpdate(item.id, { note: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                        backgroundColor: "#f8fafc",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {displayedItems.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "36px 16px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px dashed #cbd5e1",
                color: "#64748b",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: 6 }}>🔍</div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>Nessun controllo trovato in questa vista.</div>
              <div style={{ fontSize: "12px", marginTop: 4 }}>
                {searchQuery
                  ? "Prova a modificare i termini di ricerca o i filtri."
                  : "Usa il pulsante in alto '+ Aggiungi Controllo nel Reparto' per inserire un requisito specifico."}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modale per Aggiungere Nuovo Requisito Personalizzato nel Reparto */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "540px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>
                ➕ Nuovo Controllo Locale / Reparto
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            {customError && (
              <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "8px 12px", borderRadius: 6, fontSize: "13px", marginBottom: 14 }}>
                {customError}
              </div>
            )}

            <form onSubmit={handleCustomSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Reparto / Area del Controllo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Es. Uffici piano 1, Magazzino soppalco, Cappa cucina"
                  value={customArea}
                  onChange={(e) => setCustomArea(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Domanda / Verifica di Conformità *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Es. Le uscite di emergenza e i percorsi d'esodo sono sgombri e provvisti di maniglioni conformi?"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Riferimento Normativo
                  </label>
                  <input
                    type="text"
                    placeholder="Es. D.Lgs. 81/2008, Allegato IV"
                    value={customNormRef}
                    onChange={(e) => setCustomNormRef(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Ambito / Disciplina
                  </label>
                  <select
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value as any)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  >
                    <option value="safety">Sicurezza Lavoro (81/08)</option>
                    <option value="haccp">HACCP / Igiene Alimenti</option>
                    <option value="both">Entrambi</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Gravità default:</span>
                  <select
                    value={customSeverity}
                    onChange={(e) => setCustomSeverity(Number(e.target.value))}
                    style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "12px" }}
                  >
                    <option value={1}>1 - Bassa</option>
                    <option value={2}>2 - Media</option>
                    <option value={3}>3 - Alta</option>
                    <option value={4}>4 - Critica</option>
                  </select>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={customSanctionable}
                    onChange={(e) => setCustomSanctionable(e.target.checked)}
                  />
                  <span>Sanzionabile se non conforme</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#fff",
                    color: "#334155",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={submittingCustom}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "var(--color-primary, #0f172a)",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {submittingCustom ? "Salvataggio..." : "Salva Controllo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
