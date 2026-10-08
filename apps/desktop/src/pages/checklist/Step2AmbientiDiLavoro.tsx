import { useState, useMemo, useEffect } from "react";
import { ChecklistItem } from "../../api";
import { LocalAnswer, AnswerValue } from "./_shared";
import {
  WorkEnvironmentInstance,
  WorkEnvironmentCategory,
  defaultEnvironmentFeatures,
  getStandardEnvironmentsForAteco,
  evaluateEnvironmentCompliance,
  generateEnvironmentChecklistItems,
  EnvironmentCheckItem,
  workEnvironmentsStorageKey,
} from "./normativePremisesCatalog";

interface Step2AmbientiDiLavoroProps {
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
  inspectionId?: string;
}

export default function Step2AmbientiDiLavoro({
  premisesItems,
  answers = {},
  updateAnswer,
  onAddCustomItem,
  isInspectionValidated = false,
  atecoCode,
  inspectionId = "current",
}: Step2AmbientiDiLavoroProps) {
  // Lista ambienti di lavoro (inizializzata dinamicamente in base al codice ATECO)
  const [environments, setEnvironments] = useState<WorkEnvironmentInstance[]>(() => {
    // Prova a recuperare dallo storage locale di sessione per questo sopralluogo
    try {
      const saved = localStorage.getItem(workEnvironmentsStorageKey(inspectionId));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return getStandardEnvironmentsForAteco(atecoCode);
  });

  // Salva gli ambienti nello storage locale ad ogni modifica
  useEffect(() => {
    try {
      localStorage.setItem(workEnvironmentsStorageKey(inspectionId), JSON.stringify(environments));
    } catch {
      // ignore
    }
  }, [environments, inspectionId]);

  // ID ambiente attualmente selezionato
  const [selectedEnvId, setSelectedEnvId] = useState<string>(() => {
    return environments[0]?.id ?? "env-cucina";
  });

  // Assicura che l'ambiente selezionato sia valido se la lista cambia
  useEffect(() => {
    if (!environments.some((e) => e.id === selectedEnvId) && environments.length > 0) {
      setSelectedEnvId(environments[0].id);
    }
  }, [environments, selectedEnvId]);

  // Ambiente correntemente selezionato
  const currentEnv = useMemo(() => {
    return environments.find((e) => e.id === selectedEnvId) ?? environments[0];
  }, [environments, selectedEnvId]);

  // Filtro ricerca e filtro esito risposte
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOutcome, setFilterOutcome] = useState<"all" | "yes" | "no" | "na">("all");

  // Stato modale per aggiungere un nuovo ambiente
  const [showAddEnvModal, setShowAddEnvModal] = useState(false);
  const [newEnvName, setNewEnvName] = useState("");
  const [newEnvCategory, setNewEnvCategory] = useState<WorkEnvironmentCategory>("production");
  const [newEnvIcon, setNewEnvIcon] = useState("🏢");

  // Modale per nuovo requisito personalizzato
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customNormRef, setCustomNormRef] = useState("");
  const [customSeverity, setCustomSeverity] = useState(2);
  const [customSanctionable, setCustomSanctionable] = useState(true);
  const [customDomain, setCustomDomain] = useState<"safety" | "haccp" | "both">("safety");
  const [submittingCustom, setSubmittingCustom] = useState(false);

  // Drawer Non Conformità aperto per un dato itemId
  const [openNcDrawerItemId, setOpenNcDrawerItemId] = useState<string | null>(null);

  // Helper per aggiornare l'ambiente corrente
  function updateCurrentEnv(updater: (prev: WorkEnvironmentInstance) => WorkEnvironmentInstance) {
    if (!currentEnv) return;
    setEnvironments((prev) =>
      prev.map((e) => (e.id === currentEnv.id ? updater(e) : e)),
    );
  }

  // Azione: Conferma Dati & Genera Checklist Locale
  function handleConfirmEnvironmentData() {
    updateCurrentEnv((prev) => ({
      ...prev,
      isConfirmed: true,
    }));
  }

  // Azione: Reimposta / Modifica Dati Dimensionali
  function handleEditEnvironmentData() {
    updateCurrentEnv((prev) => ({
      ...prev,
      isConfirmed: false,
    }));
  }

  // Azione: Aggiungi nuovo ambiente
  function handleAddNewEnvironment(e: React.FormEvent) {
    e.preventDefault();
    if (!newEnvName.trim()) return;

    const newId = `env-custom-${Date.now()}`;
    const newEnv: WorkEnvironmentInstance = {
      id: newId,
      key: `custom_${newEnvName.toLowerCase().replace(/\s+/g, "_")}`,
      name: newEnvName.trim(),
      icon: newEnvIcon,
      category: newEnvCategory,
      isDefault: false,
      heightM: newEnvCategory === "production" ? 3.0 : 2.7,
      surfaceSqM: 30.0,
      volumeCuM: newEnvCategory === "production" ? 90.0 : 81.0,
      occupantsCount: 2,
      windowSurfaceSqM: 3.5,
      isConfirmed: false,
      features: defaultEnvironmentFeatures(newEnvCategory),
    };

    setEnvironments((prev) => [...prev, newEnv]);
    setSelectedEnvId(newId);
    setShowAddEnvModal(false);
    setNewEnvName("");
  }

  // Azione: Elimina ambiente
  function handleDeleteEnvironment(idToDelete: string) {
    if (environments.length <= 1) {
      alert("È necessario mantenere almeno un ambiente di lavoro attivo.");
      return;
    }
    const envToDelete = environments.find((e) => e.id === idToDelete);
    const confirmed = window.confirm(
      `Confermi l'eliminazione dell'ambiente "${envToDelete?.name ?? "selezionato"}" dalla checklist di questo sopralluogo?`,
    );
    if (!confirmed) return;

    setEnvironments((prev) => prev.filter((e) => e.id !== idToDelete));
  }

  // Azione: Reimposta ambienti da ATECO
  function handleResetEnvironmentsToAteco() {
    const confirmed = window.confirm(
      `Reimpostare gli ambienti standard predefiniti per il codice ATECO ${atecoCode ?? "generale"}? Le personalizzazioni verranno ripristinate.`,
    );
    if (!confirmed) return;
    const standard = getStandardEnvironmentsForAteco(atecoCode);
    setEnvironments(standard);
    if (standard[0]) {
      setSelectedEnvId(standard[0].id);
    }
  }

  // Valutazione conformità geometrica, dimensionale e CPI dell'ambiente corrente
  const complianceResult = useMemo(() => {
    if (!currentEnv) {
      return {
        isHeightCompliant: true,
        minHeightRequired: 2.7,
        cubaturePerWorker: null,
        isCubatureCompliant: true,
        surfacePerWorker: null,
        isSurfacePerWorkerCompliant: true,
        aeroilluminantRatio: null,
        isAeroilluminantCompliant: true,
        cpiActivityAlert: null,
        summaryBadges: [],
      };
    }
    return evaluateEnvironmentCompliance(currentEnv, atecoCode);
  }, [currentEnv, atecoCode]);

  // Requisiti generati dinamicamente per l'ambiente corrente
  const generatedItems = useMemo(() => {
    if (!currentEnv) return [];
    return generateEnvironmentChecklistItems(currentEnv, atecoCode);
  }, [currentEnv, atecoCode]);

  // Combina i requisiti generati e quelli già presenti in premisesItems che matchano quest'area
  const allCurrentItems = useMemo(() => {
    if (!currentEnv) return [];
    const list: Array<{
      id: string;
      title: string;
      question: string;
      normReference: string;
      defaultSeverity: number;
      defaultSanctionable: boolean;
      domain: "safety" | "haccp" | "both";
      categoryTag?: string;
      suggestedNonConformity?: string;
      isFromDb?: boolean;
    }> = [];

    const seenIds = new Set<string>();

    // 1. Requisiti specialistici generati dalle regole
    for (const g of generatedItems) {
      seenIds.add(g.id);
      list.push(g);
    }

    // 2. Requisiti da database pertinenti per questo ambiente
    const envKeywords = [
      currentEnv.key.toLowerCase(),
      currentEnv.name.toLowerCase(),
      currentEnv.category.toLowerCase(),
    ];

    for (const dbItem of premisesItems) {
      const dbArea = dbItem.area.toLowerCase();
      const isMatch = envKeywords.some((kw) => dbArea.includes(kw) || kw.includes(dbArea));
      if (isMatch && !seenIds.has(dbItem.id)) {
        seenIds.add(dbItem.id);
        list.push({
          id: dbItem.id,
          title: dbItem.area,
          question: dbItem.question,
          normReference: dbItem.normReference ?? "D.Lgs. 81/2008 Allegato IV",
          defaultSeverity: dbItem.defaultSeverity ?? 2,
          defaultSanctionable: dbItem.defaultSanctionable ?? true,
          domain: dbItem.domain as "safety" | "haccp" | "both",
          categoryTag: "dimensionale",
          suggestedNonConformity: `Riscontrata non conformità nei locali: ${dbItem.question}`,
          isFromDb: true,
        });
      }
    }

    return list;
  }, [currentEnv, generatedItems, premisesItems]);

  // Requisiti filtrati per ricerca ed esito
  const filteredItems = useMemo(() => {
    return allCurrentItems.filter((item) => {
      // Filtro testo
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${item.title} ${item.question} ${item.normReference}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      // Filtro esito
      const currentAns = answers[item.id]?.value ?? "pending";
      if (filterOutcome === "yes" && currentAns !== "yes") return false;
      if (filterOutcome === "no" && currentAns !== "no") return false;
      if (filterOutcome === "na" && currentAns !== "na") return false;

      return true;
    });
  }, [allCurrentItems, searchQuery, filterOutcome, answers]);

  // Statistiche risposte per l'ambiente corrente
  const stats = useMemo(() => {
    let yes = 0;
    let no = 0;
    let na = 0;
    for (const item of allCurrentItems) {
      const val = answers[item.id]?.value;
      if (val === "yes") yes++;
      else if (val === "no") no++;
      else if (val === "na") na++;
    }
    const answered = yes + no + na;
    const total = allCurrentItems.length;
    const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
    return { yes, no, na, answered, total, percent };
  }, [allCurrentItems, answers]);

  // Handler cambio risposta primaria
  function handleAnswer(itemId: string, value: AnswerValue, defaultItem: (typeof allCurrentItems)[0]) {
    if (isInspectionValidated || !updateAnswer) return;

    if (value === "no") {
      updateAnswer(itemId, {
        value: "no",
        severity: answers[itemId]?.severity ?? defaultItem.defaultSeverity,
        isSanctionable: answers[itemId]?.isSanctionable ?? defaultItem.defaultSanctionable,
        note: answers[itemId]?.note?.trim() ? answers[itemId]?.note : defaultItem.suggestedNonConformity ?? "",
      });
      setOpenNcDrawerItemId(itemId);
    } else {
      updateAnswer(itemId, {
        value,
        severity: undefined,
        isSanctionable: undefined,
      });
      if (openNcDrawerItemId === itemId) {
        setOpenNcDrawerItemId(null);
      }
    }
  }

  // Handler aggiunta requisito personalizzato
  async function handleAddCustomCheckItem(e: React.FormEvent) {
    e.preventDefault();
    if (!customQuestion.trim() || !onAddCustomItem || !currentEnv) return;
    setSubmittingCustom(true);
    try {
      await onAddCustomItem({
        section: "premises_equipment",
        area: currentEnv.name,
        question: customQuestion.trim(),
        normReference: customNormRef.trim() || "D.Lgs. 81/2008 Allegato IV",
        defaultSeverity: customSeverity,
        defaultSanctionable: customSanctionable,
        domain: customDomain,
      });
      setShowAddCustomModal(false);
      setCustomQuestion("");
      setCustomNormRef("");
    } finally {
      setSubmittingCustom(false);
    }
  }

  return (
    <div className="panel section-panel" style={{ padding: "20px" }}>
      {/* Header principale */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "22px", color: "var(--color-primary, #0f172a)" }}>
              Ambienti di Lavoro & Locali
            </h3>
            <span
              style={{
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: 12,
                backgroundColor: "#e0f2fe",
                color: "#0369a1",
                fontWeight: 600,
                border: "1px solid #bae6fd",
              }}
            >
              🏷️ {atecoCode ? `ATECO ${atecoCode}` : "Standard Nazionale"}
            </span>
          </div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Rilievi dimensionali (h, mq, mc), verifica cubatura pro capite (All. IV D.Lgs. 81/08), soglie CPI (D.P.R. 151/11) e checklist analitica per singolo ambiente.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {!isInspectionValidated && (
            <>
              <button
                type="button"
                className="button"
                onClick={() => setShowAddEnvModal(true)}
                style={{
                  backgroundColor: "var(--color-primary, #0f172a)",
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: 6,
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ➕ Aggiungi Ambiente
              </button>
              <button
                type="button"
                onClick={handleResetEnvironmentsToAteco}
                style={{
                  backgroundColor: "#f1f5f9",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  padding: "8px 12px",
                  borderRadius: 6,
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                title="Ripristina gli ambienti standard associati al codice ATECO"
              >
                🔄 Reimposta da ATECO
              </button>
            </>
          )}
        </div>
      </div>

      {/* Barra di Navigazione Ambienti (Tabs Orizzontali con Icone e Badge) */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 8,
          marginBottom: 20,
          borderBottom: "2px solid #e2e8f0",
        }}
      >
        {environments.map((env) => {
          const isSelected = env.id === selectedEnvId;
          const envEval = evaluateEnvironmentCompliance(env, atecoCode);

          return (
            <button
              key={env.id}
              type="button"
              onClick={() => setSelectedEnvId(env.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: "8px 8px 0 0",
                border: "none",
                borderBottom: isSelected ? "3px solid var(--color-primary, #0f172a)" : "3px solid transparent",
                backgroundColor: isSelected ? "#f8fafc" : "#fff",
                color: isSelected ? "var(--color-primary, #0f172a)" : "#64748b",
                fontWeight: isSelected ? 700 : 500,
                fontSize: "14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: "18px" }}>{env.icon}</span>
              <span>{env.name}</span>

              {/* Badge indicatore di stato */}
              {envEval.cpiActivityAlert && (
                <span title="Locale soggetto a CPI D.P.R. 151/11" style={{ fontSize: "13px" }}>
                  🔥
                </span>
              )}
              {env.isConfirmed ? (
                <span
                  style={{
                    fontSize: "11px",
                    padding: "2px 6px",
                    borderRadius: 10,
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                    fontWeight: 700,
                  }}
                >
                  ✓ Confermato
                </span>
              ) : (
                <span
                  style={{
                    fontSize: "11px",
                    padding: "2px 6px",
                    borderRadius: 10,
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                    fontWeight: 600,
                  }}
                >
                  Misure da confermare
                </span>
              )}
            </button>
          );
        })}
      </div>

      {currentEnv && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Card Rilievi Dimensionali e Caratteristiche Locale */}
          <div
            style={{
              border: "1px solid #cbd5e1",
              borderRadius: 10,
              backgroundColor: "#fff",
              padding: "18px 20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "28px" }}>{currentEnv.icon}</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>{currentEnv.name}</h4>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Destinazione: <strong>{currentEnv.category.toUpperCase()}</strong> • Standard h minima:{" "}
                    <strong>{complianceResult.minHeightRequired.toFixed(2)} m</strong>
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {!isInspectionValidated && (
                  <>
                    {currentEnv.isConfirmed ? (
                      <button
                        type="button"
                        onClick={handleEditEnvironmentData}
                        style={{
                          fontSize: "12px",
                          padding: "5px 12px",
                          borderRadius: 6,
                          border: "1px solid #cbd5e1",
                          backgroundColor: "#f8fafc",
                          color: "#334155",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        ✏️ Modifica Misure
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConfirmEnvironmentData}
                        style={{
                          fontSize: "13px",
                          padding: "6px 14px",
                          borderRadius: 6,
                          border: "none",
                          backgroundColor: "#16a34a",
                          color: "#fff",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        ✅ Conferma Dati & Genera Checklist Locale
                      </button>
                    )}

                    {!currentEnv.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleDeleteEnvironment(currentEnv.id)}
                        style={{
                          fontSize: "12px",
                          padding: "5px 10px",
                          borderRadius: 6,
                          border: "1px solid #fca5a5",
                          backgroundColor: "#fee2e2",
                          color: "#dc2626",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        title="Rimuovi questo ambiente personalizzato"
                      >
                        🗑️ Elimina Locale
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Ingressi Dimensionali a Compilazione Libera */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
                marginBottom: 16,
                backgroundColor: currentEnv.isConfirmed ? "#f8fafc" : "#fff",
                padding: "14px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            >
              {/* Altezza media */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Altezza Utile Media (m) *
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    disabled={isInspectionValidated || currentEnv.isConfirmed}
                    value={currentEnv.heightM ?? ""}
                    onChange={(e) => {
                      const h = e.target.value ? parseFloat(e.target.value) : undefined;
                      updateCurrentEnv((prev) => {
                        const s = prev.surfaceSqM ?? 0;
                        return {
                          ...prev,
                          heightM: h,
                          volumeCuM: h && s ? Math.round(h * s * 10) / 10 : prev.volumeCuM,
                        };
                      });
                    }}
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid",
                      borderColor: complianceResult.isHeightCompliant ? "#cbd5e1" : "#fca5a5",
                      fontSize: "14px",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "#64748b" }}>m</span>
                </div>
              </div>

              {/* Superficie mq */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Superficie Calpestabile (mq) *
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    disabled={isInspectionValidated || currentEnv.isConfirmed}
                    value={currentEnv.surfaceSqM ?? ""}
                    onChange={(e) => {
                      const s = e.target.value ? parseFloat(e.target.value) : undefined;
                      updateCurrentEnv((prev) => {
                        const h = prev.heightM ?? 0;
                        return {
                          ...prev,
                          surfaceSqM: s,
                          volumeCuM: s && h ? Math.round(s * h * 10) / 10 : prev.volumeCuM,
                        };
                      });
                    }}
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "#64748b" }}>m²</span>
                </div>
              </div>

              {/* Volume / Cubatura mc (calcolato automaticamente) */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Cubatura Totale (mc)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    disabled={isInspectionValidated || currentEnv.isConfirmed}
                    value={currentEnv.volumeCuM ?? ""}
                    onChange={(e) => {
                      const v = e.target.value ? parseFloat(e.target.value) : undefined;
                      updateCurrentEnv((prev) => ({ ...prev, volumeCuM: v }));
                    }}
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid #cbd5e1",
                      backgroundColor: currentEnv.isConfirmed ? "#f1f5f9" : "#fff",
                      fontSize: "14px",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "#64748b" }}>m³</span>
                </div>
              </div>

              {/* Operatori contemporanei */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Operatori Contemporanei (N) *
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    disabled={isInspectionValidated || currentEnv.isConfirmed}
                    value={currentEnv.occupantsCount ?? 1}
                    onChange={(e) => {
                      const occ = e.target.value ? parseInt(e.target.value, 10) : 1;
                      updateCurrentEnv((prev) => ({ ...prev, occupantsCount: occ }));
                    }}
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid",
                      borderColor: complianceResult.isCubatureCompliant ? "#cbd5e1" : "#fca5a5",
                      fontSize: "14px",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "#64748b" }}>lav.</span>
                </div>
              </div>

              {/* Superficie apribile finestre (RAI) */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Finestre / Superficie Apribile (mq)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    disabled={isInspectionValidated || currentEnv.isConfirmed}
                    value={currentEnv.windowSurfaceSqM ?? ""}
                    onChange={(e) => {
                      const w = e.target.value ? parseFloat(e.target.value) : undefined;
                      updateCurrentEnv((prev) => ({ ...prev, windowSurfaceSqM: w }));
                    }}
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "#64748b" }}>m²</span>
                </div>
              </div>
            </div>

            {/* Selettori Caratteristiche Impiantistiche e Dotazioni */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
                fontSize: "13px",
                marginBottom: 14,
              }}
            >
              {/* Aspirazione forzata */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 3 }}>
                  Sistemi di Aspirazione Forzata
                </label>
                <select
                  disabled={isInspectionValidated || currentEnv.isConfirmed}
                  value={currentEnv.features.forcedExhaustType}
                  onChange={(e) => {
                    const val = e.target.value as WorkEnvironmentInstance["features"]["forcedExhaustType"];
                    updateCurrentEnv((prev) => ({
                      ...prev,
                      features: {
                        ...prev.features,
                        forcedExhaustType: val,
                        forcedExhaustPresent: val !== "none",
                      },
                    }));
                  }}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                >
                  <option value="none">Nessun impianto di aspirazione forzata</option>
                  <option value="kitchen_hood">Cappa aspirante cucina con canna fumaria</option>
                  <option value="welding_arm">Bracci aspiranti localizzati fumi di saldatura</option>
                  <option value="spray_booth">Cabina verniciatura con filtri a carboni attivi</option>
                  <option value="wood_dust_atex">Impianto centralizzato polveri legno ATEX</option>
                  <option value="blind_toilet_fan">Aspiratore temporizzato per servizio cieco</option>
                </select>
              </div>

              {/* Pavimentazione */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 3 }}>
                  Pavimentazione
                </label>
                <select
                  disabled={isInspectionValidated || currentEnv.isConfirmed}
                  value={currentEnv.features.flooringCondition}
                  onChange={(e) => {
                    const val = e.target.value as WorkEnvironmentInstance["features"]["flooringCondition"];
                    updateCurrentEnv((prev) => ({
                      ...prev,
                      features: { ...prev.features, flooringCondition: val },
                    }));
                  }}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                >
                  <option value="compliant_anti_slip">Continui, antisdrucciolo e regolari</option>
                  <option value="regular_smooth">Lisci senza dislivelli</option>
                  <option value="damaged_slippery">⚠️ Danneggiati, con buche o scivolosi</option>
                </select>
              </div>

              {/* Pareti */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 3 }}>
                  Pareti & Rivestimento
                </label>
                <select
                  disabled={isInspectionValidated || currentEnv.isConfirmed}
                  value={currentEnv.features.wallsCondition}
                  onChange={(e) => {
                    const val = e.target.value as WorkEnvironmentInstance["features"]["wallsCondition"];
                    updateCurrentEnv((prev) => ({
                      ...prev,
                      features: { ...prev.features, wallsCondition: val },
                    }));
                  }}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                >
                  <option value="washable_sanitizable_2m">Lavabili e disinfettabili fino a 2m (Reg. 852/04)</option>
                  <option value="plaster_dry">Intonaco civile asciutto e regolare</option>
                  <option value="damaged_mold">⚠️ Con muffe, umidità o crepe</option>
                </select>
              </div>

              {/* Illuminazione */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 3 }}>
                  Illuminazione di Emergenza
                </label>
                <select
                  disabled={isInspectionValidated || currentEnv.isConfirmed}
                  value={currentEnv.features.emergencyLighting ? "present" : "missing"}
                  onChange={(e) => {
                    const val = e.target.value === "present";
                    updateCurrentEnv((prev) => ({
                      ...prev,
                      features: { ...prev.features, emergencyLighting: val },
                    }));
                  }}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                >
                  <option value="present">Presente e autonoma su vie d'esodo</option>
                  <option value="missing">⚠️ Assente o non funzionante</option>
                </select>
              </div>
            </div>

            {/* Badge Riepilogo Normativo & Alert Dimensionali */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {complianceResult.summaryBadges.map((b, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 12,
                    backgroundColor:
                      b.status === "success"
                        ? "#dcfce7"
                        : b.status === "danger"
                        ? "#fee2e2"
                        : b.status === "warning"
                        ? "#fef3c7"
                        : "#f1f5f9",
                    color:
                      b.status === "success"
                        ? "#166534"
                        : b.status === "danger"
                        ? "#991b1b"
                        : b.status === "warning"
                        ? "#92400e"
                        : "#334155",
                    border: "1px solid",
                    borderColor:
                      b.status === "success"
                        ? "#bbf7d0"
                        : b.status === "danger"
                        ? "#fca5a5"
                        : b.status === "warning"
                        ? "#fde68a"
                        : "#cbd5e1",
                  }}
                >
                  {b.text}
                </span>
              ))}
            </div>

            {/* Alert Specifico Assoggettabilità CPI */}
            {complianceResult.cpiActivityAlert && (
              <div
                style={{
                  marginTop: 12,
                  padding: "10px 14px",
                  borderRadius: 6,
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: "20px" }}>🚨</span>
                <div>
                  <strong>{complianceResult.cpiActivityAlert.title}</strong>
                  <div style={{ fontSize: "12px", marginTop: 2 }}>{complianceResult.cpiActivityAlert.description}</div>
                </div>
              </div>
            )}
          </div>

          {/* Sezione Checklist del Singolo Locale */}
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              backgroundColor: "#fff",
              padding: "18px 20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            {/* Header Checklist Locale */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "17px", color: "#0f172a" }}>
                  Checklist di Verifica: {currentEnv.name}
                </h4>
                <div style={{ fontSize: "13px", color: "#64748b" }}>
                  Avanzamento controlli: <strong>{stats.answered} di {stats.total}</strong> ({stats.percent}%)
                </div>
              </div>

              {/* Contatori rapidi */}
              <div style={{ display: "flex", gap: 6, fontSize: "12px", fontWeight: 600 }}>
                <span style={{ padding: "4px 8px", borderRadius: 4, backgroundColor: "#dcfce7", color: "#166534" }}>
                  ✅ {stats.yes} Conforme
                </span>
                <span style={{ padding: "4px 8px", borderRadius: 4, backgroundColor: "#fee2e2", color: "#991b1b" }}>
                  ❌ {stats.no} Non Conforme
                </span>
                <span style={{ padding: "4px 8px", borderRadius: 4, backgroundColor: "#f1f5f9", color: "#475569" }}>
                  ⚪ {stats.na} N/A
                </span>
              </div>
            </div>

            {/* Barra Filtri Checklist */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 16,
                backgroundColor: "#f8fafc",
                padding: "10px",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center", flex: "1 1 240px" }}>
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Cerca requisito (es. aspirazione, pavimenti, finestre, CPI)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Mostra:</span>
                {(
                  [
                    { id: "all", label: "Tutti" },
                    { id: "no", label: "❌ Solo No" },
                    { id: "yes", label: "✅ Solo Sì" },
                    { id: "na", label: "⚪ N/A" },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setFilterOutcome(b.id)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 14,
                      fontSize: "12px",
                      border: "1px solid",
                      borderColor: filterOutcome === b.id ? "var(--color-primary, #0f172a)" : "#cbd5e1",
                      backgroundColor: filterOutcome === b.id ? "var(--color-primary, #0f172a)" : "#fff",
                      color: filterOutcome === b.id ? "#fff" : "#334155",
                      cursor: "pointer",
                    }}
                  >
                    {b.label}
                  </button>
                ))}

                {!isInspectionValidated && (
                  <button
                    type="button"
                    onClick={() => setShowAddCustomModal(true)}
                    style={{
                      marginLeft: 8,
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: "12px",
                      backgroundColor: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      color: "#334155",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    ➕ Aggiungi Requisito
                  </button>
                )}
              </div>
            </div>

            {/* Elenco Requisiti del Locale */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredItems.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>
                  Nessun requisito corrisponde ai filtri impostati per questo locale.
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const currentAns = answers[item.id];
                  const val = currentAns?.value;
                  const isYes = val === "yes";
                  const isNo = val === "no";
                  const isNa = val === "na";
                  const isDrawerOpen = openNcDrawerItemId === item.id;

                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      style={{
                        border: "1px solid",
                        borderColor: isYes ? "#bbf7d0" : isNo ? "#fecaca" : "#e2e8f0",
                        backgroundColor: isYes ? "#fafffa" : isNo ? "#fffbfb" : "#fff",
                        borderRadius: 8,
                        padding: "14px 16px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: 12,
                        }}
                      >
                        {/* Testo Requisito */}
                        <div style={{ flex: "1 1 400px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                            <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{item.title}</span>
                            {item.categoryTag && (
                              <span
                                style={{
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  backgroundColor:
                                    item.categoryTag === "cpi"
                                      ? "#fee2e2"
                                      : item.categoryTag === "aspirazione"
                                      ? "#e0e7ff"
                                      : "#f1f5f9",
                                  color:
                                    item.categoryTag === "cpi"
                                      ? "#b91c1c"
                                      : item.categoryTag === "aspirazione"
                                      ? "#3730a3"
                                      : "#475569",
                                }}
                              >
                                {item.categoryTag.toUpperCase()}
                              </span>
                            )}
                            <span style={{ fontSize: "11px", color: "#64748b" }}>📜 {item.normReference}</span>
                          </div>
                          <div style={{ fontSize: "13px", color: "#334155", lineHeight: 1.4 }}>{item.question}</div>

                          {/* Se c'è una nota o non conformità salvata */}
                          {isNo && currentAns?.note && (
                            <div
                              style={{
                                marginTop: 8,
                                padding: "6px 10px",
                                borderRadius: 4,
                                backgroundColor: "#fef2f2",
                                border: "1px solid #fee2e2",
                                fontSize: "12px",
                                color: "#991b1b",
                              }}
                            >
                              <strong>Rilievo / NC:</strong> {currentAns.note}
                              {currentAns.isSanctionable && <span style={{ marginLeft: 6, fontWeight: 700 }}>⚖️ Sanzionabile</span>}
                            </div>
                          )}
                        </div>

                        {/* Selettore Primario: SÌ / NO / N/A */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div
                            style={{
                              display: "inline-flex",
                              borderRadius: 6,
                              border: "1px solid #cbd5e1",
                              overflow: "hidden",
                              backgroundColor: "#f8fafc",
                            }}
                          >
                            <button
                              type="button"
                              disabled={isInspectionValidated}
                              onClick={() => handleAnswer(item.id, "yes", item)}
                              style={{
                                padding: "6px 14px",
                                fontSize: "13px",
                                fontWeight: 700,
                                border: "none",
                                borderRight: "1px solid #cbd5e1",
                                cursor: isInspectionValidated ? "not-allowed" : "pointer",
                                backgroundColor: isYes ? "#16a34a" : "transparent",
                                color: isYes ? "#fff" : "#166534",
                              }}
                            >
                              Sì
                            </button>
                            <button
                              type="button"
                              disabled={isInspectionValidated}
                              onClick={() => handleAnswer(item.id, "no", item)}
                              style={{
                                padding: "6px 14px",
                                fontSize: "13px",
                                fontWeight: 700,
                                border: "none",
                                borderRight: "1px solid #cbd5e1",
                                cursor: isInspectionValidated ? "not-allowed" : "pointer",
                                backgroundColor: isNo ? "#dc2626" : "transparent",
                                color: isNo ? "#fff" : "#991b1b",
                              }}
                            >
                              No
                            </button>
                            <button
                              type="button"
                              disabled={isInspectionValidated}
                              onClick={() => handleAnswer(item.id, "na", item)}
                              style={{
                                padding: "6px 14px",
                                fontSize: "13px",
                                fontWeight: 600,
                                border: "none",
                                cursor: isInspectionValidated ? "not-allowed" : "pointer",
                                backgroundColor: isNa ? "#64748b" : "transparent",
                                color: isNa ? "#fff" : "#475569",
                              }}
                            >
                              N/A
                            </button>
                          </div>

                          {isNo && (
                            <button
                              type="button"
                              onClick={() => setOpenNcDrawerItemId(isDrawerOpen ? null : item.id)}
                              style={{
                                padding: "6px 8px",
                                borderRadius: 6,
                                border: "1px solid #fca5a5",
                                backgroundColor: "#fee2e2",
                                color: "#b91c1c",
                                fontSize: "12px",
                                cursor: "pointer",
                              }}
                              title="Dettaglio Non Conformità"
                            >
                              {isDrawerOpen ? "Chiudi NC ▲" : "Modifica NC ▼"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Drawer di Dettaglio Non Conformità (quando esito è No) */}
                      {isNo && isDrawerOpen && (
                        <div
                          style={{
                            marginTop: 12,
                            padding: "12px",
                            borderRadius: 6,
                            backgroundColor: "#fff",
                            border: "1px solid #fecaca",
                          }}
                        >
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 10 }}>
                            {/* Livello di Gravità 1-4 */}
                            <div>
                              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#991b1b", marginBottom: 3 }}>
                                Gravità Rischio (1-4)
                              </label>
                              <select
                                disabled={isInspectionValidated}
                                value={currentAns?.severity ?? item.defaultSeverity}
                                onChange={(e) => {
                                  updateAnswer?.(item.id, { severity: parseInt(e.target.value, 10) });
                                }}
                                style={{ width: "100%", padding: "5px 8px", borderRadius: 4, border: "1px solid #cbd5e1", fontSize: "12px" }}
                              >
                                <option value="1">1 - Lieve (formale)</option>
                                <option value="2">2 - Medio (prescrizione ordinaria)</option>
                                <option value="3">3 - Grave (rischio rilevante)</option>
                                <option value="4">4 - Critico / Stop attività (immediato)</option>
                              </select>
                            </div>

                            {/* Flag Sanzionabile */}
                            <div>
                              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#991b1b", marginBottom: 3 }}>
                                Rilevanza Sanzionatoria
                              </label>
                              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", cursor: "pointer", marginTop: 4 }}>
                                <input
                                  type="checkbox"
                                  disabled={isInspectionValidated}
                                  checked={currentAns?.isSanctionable ?? item.defaultSanctionable}
                                  onChange={(e) => {
                                    updateAnswer?.(item.id, { isSanctionable: e.target.checked });
                                  }}
                                />
                                <span>⚖️ Violazione sanzionabile (D.Lgs. 81/08 o Reg. 852/04)</span>
                              </label>
                            </div>
                          </div>

                          {/* Nota descrittiva e rilievo */}
                          <div>
                            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#991b1b", marginBottom: 3 }}>
                              Descrizione della Non Conformità e Azione Correttiva Necessaria
                            </label>
                            <textarea
                              rows={2}
                              disabled={isInspectionValidated}
                              value={currentAns?.note ?? ""}
                              onChange={(e) => {
                                updateAnswer?.(item.id, { note: e.target.value });
                              }}
                              placeholder="Descrivi il rilievo riscontrato sul locale..."
                              style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid #cbd5e1", fontSize: "12px" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modale Aggiungi Nuovo Ambiente */}
      {showAddEnvModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 24,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <h4 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#0f172a" }}>
              ➕ Aggiungi Nuovo Ambiente di Lavoro
            </h4>
            <form onSubmit={handleAddNewEnvironment}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: 4 }}>
                  Nome dell'Ambiente / Reparto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Es. Cella Frigo 2, Soppalco Magazzino, Laboratorio Chimico..."
                  value={newEnvName}
                  onChange={(e) => setNewEnvName(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: 4 }}>
                  Tipologia / Destinazione d'Uso
                </label>
                <select
                  value={newEnvCategory}
                  onChange={(e) => setNewEnvCategory(e.target.value as WorkEnvironmentCategory)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                >
                  <option value="production">🏭 Produzione / Cucina / Lavorazioni</option>
                  <option value="warehouse">📦 Magazzino / Stoccaggio Merci</option>
                  <option value="office">💻 Ufficio / Amministrazione</option>
                  <option value="services">🚻 Servizi Igienici / Spogliatoio</option>
                  <option value="public">🛍️ Area Aperta al Pubblico / Vendita</option>
                  <option value="technical">⚡ Locale Tecnico / Impianti</option>
                  <option value="outdoor">🚗 Area Esterna / Piazzale</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: 4 }}>
                  Icona Rappresentativa
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["🍳", "🍽️", "📦", "❄️", "🧼", "🚻", "🔧", "🎨", "🛢️", "☣️", "🏢", "🏗️", "🪵", "🛍️", "💻", "🩺", "⚡"].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewEnvIcon(ic)}
                      style={{
                        fontSize: "20px",
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: "1px solid",
                        borderColor: newEnvIcon === ic ? "var(--color-primary, #0f172a)" : "#cbd5e1",
                        backgroundColor: newEnvIcon === ic ? "#e2e8f0" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddEnvModal(false)}
                  style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #cbd5e1", backgroundColor: "#fff", cursor: "pointer" }}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "var(--color-primary, #0f172a)",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Aggiungi Ambiente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale Aggiungi Requisito Personalizzato al Locale */}
      {showAddCustomModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 24,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <h4 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#0f172a" }}>
              ➕ Nuovo Requisito per: {currentEnv?.name}
            </h4>
            <form onSubmit={handleAddCustomCheckItem}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: 4 }}>
                  Testo della Domanda / Requisito *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Es. È presente dispositivo di sgancio rapido per l'impianto gas?"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: 4 }}>
                  Riferimento Normativo (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es. D.Lgs. 81/2008 Allegato IV, UNI 7129..."
                  value={customNormRef}
                  onChange={(e) => setCustomNormRef(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: 4 }}>
                    Gravità Predefinita (1-4)
                  </label>
                  <select
                    value={customSeverity}
                    onChange={(e) => setCustomSeverity(parseInt(e.target.value, 10))}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                  >
                    <option value="1">1 - Lieve</option>
                    <option value="2">2 - Medio</option>
                    <option value="3">3 - Grave</option>
                    <option value="4">4 - Critico</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: 4 }}>
                    Ambito
                  </label>
                  <select
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value as "safety" | "haccp" | "both")}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                  >
                    <option value="safety">🦺 Sicurezza</option>
                    <option value="haccp">🍽️ HACCP</option>
                    <option value="both">Entrambi</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #cbd5e1", backgroundColor: "#fff", cursor: "pointer" }}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={submittingCustom}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "var(--color-primary, #0f172a)",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {submittingCustom ? "Salvataggio..." : "Salva Requisito"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
