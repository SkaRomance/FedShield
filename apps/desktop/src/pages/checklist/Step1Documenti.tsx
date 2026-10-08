// Step 1 "Documenti" — Riprogettazione approfondita e conforme alle richieste del consulente HSE.
// Supporta:
// 1. Risposta primaria a selezione rapida: Sì (Presente) / No (Assente) / Non Applicabile (N/A)
// 2. Dettaglio secondario (Visionato in sede / Richiesto in differita / Non disponibile)
// 3. Struttura in 4 macro-sezioni Accordion riducibili/espandibili:
//    - Base & Autorizzativa (visura, SCIA, agibilità, planimetrie, DICO, messa a terra, CPI, AUA)
//    - Igiene Alimentare & HACCP (con verifica approfondita dei CONTENUTI MINIMI del manuale, registri, allergeni, MOCA)
//    - Sicurezza sul Lavoro D.Lgs. 81/08 (con verifica dei CONTENUTI MINIMI del DVR art. 28, PEE, VDR chimico e rischi specifici)
//    - Piano Sicurezza Acque & Legionella (D.Lgs. 18/2023 & Linee Guida 2015 con verifica contenuti minimi)
// 4. Date di emissione e scadenza con controllo scadenze
// 5. Adattamento intelligente in base al Codice ATECO aziendale

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { InspectionDocumentRequirement, InspectionDocumentStatus } from "../../api";
import {
  classifyDocumentCategory,
  DocumentCategory,
  DOCUMENT_CATEGORIES_INFO,
  filterDocumentsForAteco,
  findCatalogDefinition,
  isCategoryApplicableForAteco,
  MinimumContentItem,
  NORMATIVE_DOCUMENTS_CATALOG,
  NormativeDocumentDefinition,
  parseDocumentExtraMeta,
  serializeDocumentExtraMeta,
  formatDocumentValidity,
  getDocumentExpiryType,
} from "./normativeDocumentCatalog";
import { addMonthsToYmd } from "../../lib/deadlinesEngine";
import { formattaData, perCampoData } from "../../lib/oraItalia";

interface Step1DocumentiProps {
  documents: InspectionDocumentRequirement[];
  setDocuments: Dispatch<SetStateAction<InspectionDocumentRequirement[]>>;
  isInspectionValidated: boolean;
  atecoCode?: string;
  checklistMode?: string;
  isAutoSaving?: boolean;
  lastAutoSavedAt?: string | null;
}

type FilterStatus = "all" | "pending" | "missing" | "present" | "na" | "expired";

export default function Step1Documenti({
  documents,
  setDocuments,
  isInspectionValidated,
  atecoCode,
  checklistMode,
  isAutoSaving,
  lastAutoSavedAt,
}: Step1DocumentiProps) {
  // Stato espansione sezioni accordion: CHIUSE DI DEFAULT come richiesto per evitare disordine visivo
  const [openSections, setOpenSections] = useState<Record<DocumentCategory, boolean>>({
    base_autorizzativa: false,
    haccp_alimentare: false,
    sicurezza_81_08: false,
    acque_legionella: false,
    matrici_ambientali: false,
  });

  // Filtro ATECO: di default attivo (mostra solo documenti pertinenti), con interruttore per visualizzare tutto il catalogo
  const [showAllDocuments, setShowAllDocuments] = useState(false);

  // Ricerca e filtro rapido
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // Sezione contenuti minimi espansa per documento (id documento)
  const [expandedMinContents, setExpandedMinContents] = useState<Record<string, boolean>>({});

  // Modale per aggiunta documento personalizzato
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customDocName, setCustomDocName] = useState("");
  const [customDocCategory, setCustomDocCategory] = useState<DocumentCategory>("base_autorizzativa");
  const [customDocRequired, setCustomDocRequired] = useState(true);
  const [customDocNorm, setCustomDocNorm] = useState("");

  // Toggle singola sezione accordion
  function toggleSection(cat: DocumentCategory) {
    setOpenSections((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  function expandAllSections() {
    setOpenSections({
      base_autorizzativa: true,
      haccp_alimentare: true,
      sicurezza_81_08: true,
      acque_legionella: true,
      matrici_ambientali: true,
    });
  }

  function collapseAllSections() {
    setOpenSections({
      base_autorizzativa: false,
      haccp_alimentare: false,
      sicurezza_81_08: false,
      acque_legionella: false,
      matrici_ambientali: false,
    });
  }

  // Mappa dei documenti esistenti per nome normalizzato
  const existingDocsMap = useMemo(() => {
    const map = new Map<string, InspectionDocumentRequirement>();
    for (const doc of documents) {
      map.set(doc.name.toLowerCase().trim(), doc);
    }
    return map;
  }, [documents]);

  // Lista unificata completa (catalogo normativo filtrato per ATECO + eventuali custom dell'ispezione)
  const unifiedDocumentList = useMemo(() => {
    const list: Array<{
      definition?: NormativeDocumentDefinition;
      name: string;
      category: DocumentCategory;
      normReference: string;
      description: string;
      isRequired: boolean;
      status: InspectionDocumentStatus;
      note: string;
      rawDoc?: InspectionDocumentRequirement;
    }> = [];

    const seenNames = new Set<string>();

    // 1. Catalogo normativo (filtrato dinamicamente per Codice ATECO o catalogo completo se toggled)
    const catalogSource = showAllDocuments
      ? NORMATIVE_DOCUMENTS_CATALOG
      : filterDocumentsForAteco(NORMATIVE_DOCUMENTS_CATALOG, atecoCode, checklistMode);

    for (const def of catalogSource) {
      const lower = def.name.toLowerCase().trim();
      seenNames.add(lower);
      const existing = existingDocsMap.get(lower);

      list.push({
        definition: def,
        name: def.name,
        category: def.category,
        normReference: def.normReference,
        description: def.description,
        isRequired: def.isRequiredDefault,
        status: existing?.status ?? "not_available",
        note: existing?.note ?? "",
        rawDoc: existing,
      });
    }

    // 2. Documenti presenti nell'ispezione:
    // Se un documento fa parte del catalogo generale ma è escluso dal filtro ATECO,
    // viene mostrato SOLO se il consulente lo ha già compilato (status !== not_available && status !== not_applicable)
    // Se è un documento personalizzato inserito manualmente (!catalogDef), viene sempre mostrato.
    for (const doc of documents) {
      const lower = doc.name.toLowerCase().trim();
      if (!seenNames.has(lower)) {
        const catalogDef = findCatalogDefinition(doc.name);
        const hasBeenAnswered = doc.status !== "not_available" && doc.status !== "not_applicable";
        const isCustomDoc = !catalogDef;

        if (isCustomDoc || hasBeenAnswered || showAllDocuments) {
          seenNames.add(lower);
          const cat = catalogDef ? catalogDef.category : classifyDocumentCategory(doc.name);
          list.push({
            definition: catalogDef,
            name: doc.name,
            category: cat,
            normReference: catalogDef?.normReference ?? "Specifica aziendale",
            description: catalogDef?.description ?? "Documento rilevato in sede di sopralluogo",
            isRequired: doc.isRequired,
            status: doc.status,
            note: doc.note ?? "",
            rawDoc: doc,
          });
        }
      }
    }

    return list;
  }, [existingDocsMap, documents, atecoCode, checklistMode, showAllDocuments]);

  // Aggiorna o inserisce un documento nello stato documents
  function updateDocumentItem(
    name: string,
    updates: {
      status?: InspectionDocumentStatus;
      note?: string;
      isRequired?: boolean;
    },
  ) {
    if (isInspectionValidated) return;

    setDocuments((current) => {
      const lower = name.toLowerCase().trim();
      const index = current.findIndex((d) => d.name.toLowerCase().trim() === lower);

      if (index >= 0) {
        return current.map((item, idx) =>
          idx === index
            ? {
                ...item,
                status: updates.status !== undefined ? updates.status : item.status,
                note: updates.note !== undefined ? updates.note : item.note,
                isRequired: updates.isRequired !== undefined ? updates.isRequired : item.isRequired,
              }
            : item,
        );
      } else {
        // Nuovo inserimento
        const def = findCatalogDefinition(name);
        const newReq: InspectionDocumentRequirement = {
          name,
          isRequired: updates.isRequired !== undefined ? updates.isRequired : (def?.isRequiredDefault ?? true),
          status: updates.status ?? "not_available",
          note: updates.note ?? "",
        };
        return [...current, newReq];
      }
    });
  }

  // Helper per impostare la risposta primaria (Sì / No / NA)
  function handlePrimaryStatusChange(name: string, primaryValue: "yes" | "no" | "na") {
    let newStatus: InspectionDocumentStatus = "not_available";
    if (primaryValue === "yes") {
      newStatus = "viewed_on_site";
    } else if (primaryValue === "no") {
      newStatus = "not_available";
    } else {
      newStatus = "not_applicable";
    }
    updateDocumentItem(name, { status: newStatus });
  }

  // Helper per il cambio del dettaglio secondario (se No -> "not_available" o "requested_later")
  function handleSubStatusChange(name: string, subStatus: InspectionDocumentStatus) {
    updateDocumentItem(name, { status: subStatus });
  }

  // Gestione specifica per cambio Data di Rilascio / Ultimo Riesame:
  // Calcola AUTOMATICAMENTE la Data di Scadenza di legge o prossimo riesame (+validityMonths)
  function handleIssueDateChange(
    name: string,
    currentNote: string,
    newIssueDate: string,
    docDef?: NormativeDocumentDefinition,
  ) {
    const meta = parseDocumentExtraMeta(currentNote);
    meta.issueDate = newIssueDate;

    const def = docDef ?? findCatalogDefinition(name);
    const validityMonths = def?.validityMonths ?? (def?.isPeriodicReviewDocument ? 12 : undefined);

    if (validityMonths && newIssueDate && newIssueDate.trim().length > 0) {
      // Calcolo automatico della data di scadenza o prossimo riesame
      meta.expiryDate = addMonthsToYmd(newIssueDate, validityMonths);
    } else if (!def?.hasStatutoryExpiry && !def?.isPeriodicReviewDocument && def) {
      // Documento permanente o rapporto di prova: non ha scadenza
      meta.expiryDate = "";
    }

    const serialized = serializeDocumentExtraMeta(meta);
    updateDocumentItem(name, { note: serialized });
  }

  // Modifica manuale della data di scadenza / riesame
  function handleExpiryDateChange(name: string, currentNote: string, newExpiryDate: string) {
    const meta = parseDocumentExtraMeta(currentNote);
    meta.expiryDate = newExpiryDate;
    const serialized = serializeDocumentExtraMeta(meta);
    updateDocumentItem(name, { note: serialized });
  }

  // Gestione note e metadati generici
  function handleMetadataChange(
    name: string,
    currentNote: string,
    field: "noteText" | "issueDate" | "expiryDate" | "checkedContents",
    value: string | string[],
  ) {
    const meta = parseDocumentExtraMeta(currentNote);
    if (field === "noteText") meta.noteText = value as string;
    if (field === "issueDate") meta.issueDate = value as string;
    if (field === "expiryDate") meta.expiryDate = value as string;
    if (field === "checkedContents") meta.checkedContents = value as string[];

    const serialized = serializeDocumentExtraMeta(meta);
    updateDocumentItem(name, { note: serialized });
  }

  // Toggle checkbox per singolo contenuto minimo
  function handleToggleMinimumContent(name: string, currentNote: string, contentId: string) {
    const meta = parseDocumentExtraMeta(currentNote);
    const set = new Set(meta.checkedContents ?? []);
    if (set.has(contentId)) {
      set.delete(contentId);
    } else {
      set.add(contentId);
    }
    handleMetadataChange(name, currentNote, "checkedContents", Array.from(set));
  }

  // Inserisci automaticamente il testo delle carenze nelle note
  function handleAutoFillDeficiencies(
    name: string,
    currentNote: string,
    allMinItems: MinimumContentItem[],
  ) {
    const meta = parseDocumentExtraMeta(currentNote);
    const checked = new Set(meta.checkedContents ?? []);
    const missing = allMinItems.filter((item) => !checked.has(item.id));

    if (missing.length === 0) return;

    const deficiencyText = `Carenze rilevate rispetto ai contenuti minimi obbligatori: ${missing.map((m) => `[${m.normArticle}] ${m.label}`).join("; ")}.`;
    const newNoteText = meta.noteText ? `${meta.noteText}. ${deficiencyText}` : deficiencyText;
    handleMetadataChange(name, currentNote, "noteText", newNoteText);
  }

  // Aggiunta documento personalizzato
  function handleAddCustomDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!customDocName.trim()) return;

    const trimmed = customDocName.trim();
    const metaNote = customDocNorm.trim() ? `Rif. normativo: ${customDocNorm.trim()}` : "";

    updateDocumentItem(trimmed, {
      status: "not_available",
      isRequired: customDocRequired,
      note: metaNote,
    });

    setCustomDocName("");
    setCustomDocNorm("");
    setShowAddCustomModal(false);
  }

  // Filtro globale sui documenti
  const filteredDocuments = useMemo(() => {
    let result = unifiedDocumentList;

    // Filtro testo
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.normReference.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.note.toLowerCase().includes(q),
      );
    }

    // Filtro stato
    if (filterStatus === "present") {
      result = result.filter((d) => d.status === "viewed_on_site");
    } else if (filterStatus === "missing") {
      result = result.filter((d) => d.status === "not_available" || d.status === "requested_later");
    } else if (filterStatus === "na") {
      result = result.filter((d) => d.status === "not_applicable");
    } else if (filterStatus === "expired") {
      const today = perCampoData(new Date());
      result = result.filter((d) => {
        if (d.status === "not_applicable") return false;
        const meta = parseDocumentExtraMeta(d.note);
        const def = d.definition ?? findCatalogDefinition(d.name);
        const validity = def?.validityMonths ?? (def?.isPeriodicReviewDocument ? 12 : undefined);
        const effExpiry = meta.expiryDate || (validity && meta.issueDate ? addMonthsToYmd(meta.issueDate, validity) : undefined);
        return Boolean(effExpiry && effExpiry < today);
      });
    }

    return result;
  }, [unifiedDocumentList, searchQuery, filterStatus]);

  const todayYmd = useMemo(() => perCampoData(new Date()), []);

  // Statistiche globali con conteggio documenti scaduti (Non Conformità)
  const stats = useMemo(() => {
    let present = 0;
    let missing = 0;
    let na = 0;
    let expired = 0;
    for (const d of unifiedDocumentList) {
      const meta = parseDocumentExtraMeta(d.note);
      const def = d.definition ?? findCatalogDefinition(d.name);
      const validity = def?.validityMonths ?? (def?.isPeriodicReviewDocument ? 12 : undefined);
      const effExpiry = meta.expiryDate || (validity && meta.issueDate ? addMonthsToYmd(meta.issueDate, validity) : undefined);
      const isExp = Boolean(effExpiry && effExpiry < todayYmd && d.status !== "not_applicable");
      if (isExp) expired++;

      if (d.status === "viewed_on_site") present++;
      else if (d.status === "not_applicable") na++;
      else missing++;
    }
    return {
      total: unifiedDocumentList.length,
      present,
      missing,
      na,
      expired,
    };
  }, [unifiedDocumentList, todayYmd]);

  // Raggruppamento documenti per categoria
  const groupedDocuments = useMemo(() => {
    const groups: Record<DocumentCategory, typeof filteredDocuments> = {
      base_autorizzativa: [],
      haccp_alimentare: [],
      sicurezza_81_08: [],
      acque_legionella: [],
      matrici_ambientali: [],
    };

    for (const doc of filteredDocuments) {
      groups[doc.category].push(doc);
    }

    return groups;
  }, [filteredDocuments]);

  const categoriesOrder: DocumentCategory[] = [
    "base_autorizzativa",
    "haccp_alimentare",
    "sicurezza_81_08",
    "acque_legionella",
    "matrici_ambientali",
  ];

  return (
    <div className="panel section-panel" style={{ padding: "20px" }}>
      {/* Header principale */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
            <h3 style={{ margin: 0, fontSize: "22px", color: "var(--color-primary, #0f172a)" }}>
              Checklist Documentale Completa
            </h3>
            {isAutoSaving ? (
              <span
                style={{
                  fontSize: "12px",
                  color: "#b45309",
                  backgroundColor: "#fef3c7",
                  border: "1px solid #fde68a",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontWeight: 500,
                }}
              >
                <span className="autosave-spinner" />
                Salvataggio...
              </span>
            ) : lastAutoSavedAt ? (
              <span
                style={{
                  fontSize: "12px",
                  color: "#15803d",
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontWeight: 500,
                }}
              >
                Salvato alle {lastAutoSavedAt} ✓
              </span>
            ) : null}
          </div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Verifica puntuale dei titoli autorizzativi, igiene alimentare HACCP, sicurezza sul lavoro (D.Lgs. 81/08), piano acque e matrici ambientali.
          </p>

          {/* Barra info dinamica ATECO e toggle catalogo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "12px",
                padding: "3px 10px",
                borderRadius: "16px",
                backgroundColor: atecoCode ? "#eff6ff" : "#f1f5f9",
                color: atecoCode ? "#1e40af" : "#475569",
                border: "1px solid",
                borderColor: atecoCode ? "#bfdbfe" : "#cbd5e1",
                fontWeight: 600,
              }}
            >
              🏷️ {atecoCode ? `ATECO Azienda: ${atecoCode}` : "ATECO: Non specificato"}
            </span>

            <button
              type="button"
              onClick={() => setShowAllDocuments((prev) => !prev)}
              style={{
                fontSize: "12px",
                padding: "3px 10px",
                borderRadius: "16px",
                border: "1px solid",
                borderColor: showAllDocuments ? "#f59e0b" : "#cbd5e1",
                backgroundColor: showAllDocuments ? "#fffbeb" : "#fff",
                color: showAllDocuments ? "#b45309" : "#334155",
                cursor: "pointer",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
              title="Alterna tra i soli documenti pertinenti per questo codice ATECO e l'intero catalogo normativo"
            >
              {showAllDocuments ? "📂 Mostra solo applicabili per ATECO" : "🌐 Mostra catalogo completo (tutti i settori)"}
            </button>
          </div>
        </div>

        {/* Pulsante aggiunta documento custom */}
        {!isInspectionValidated && (
          <button
            type="button"
            className="button"
            style={{
              backgroundColor: "var(--color-primary, #0f172a)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={() => setShowAddCustomModal(true)}
          >
            ➕ Aggiungi Documento Personalizzato
          </button>
        )}
      </div>

      {/* Barra Statistiche e Stato Rapido */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>TOTALE DOCUMENTI</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a" }}>{stats.total}</div>
        </div>
        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 16px" }}>
          <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>✅ PRESENTI / CONFORMI (SÌ)</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#16a34a" }}>{stats.present}</div>
        </div>
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px" }}>
          <div style={{ fontSize: "12px", color: "#dc2626", fontWeight: 600 }}>❌ ASSENTI / DA ACQUISIRE (NO)</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#dc2626" }}>{stats.missing}</div>
        </div>
        <div
          style={{
            backgroundColor: stats.expired > 0 ? "#fff1f2" : "#f8fafc",
            border: `1px solid ${stats.expired > 0 ? "#fca5a5" : "#e2e8f0"}`,
            borderRadius: 8,
            padding: "12px 16px",
          }}
        >
          <div style={{ fontSize: "12px", color: stats.expired > 0 ? "#e11d48" : "#64748b", fontWeight: 700 }}>
            {stats.expired > 0 ? "⚠️ SCADUTI / NON CONFORMI" : "SCADUTI / NC"}
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: stats.expired > 0 ? "#e11d48" : "#0f172a" }}>
            {stats.expired}
          </div>
        </div>
        <div style={{ backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 8, padding: "12px 16px" }}>
          <div style={{ fontSize: "12px", color: "#475569", fontWeight: 600 }}>⚪ NON APPLICABILI (N/A)</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#475569" }}>{stats.na}</div>
        </div>
      </div>

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
        <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "1 1 300px" }}>
          <span style={{ fontSize: "18px" }}>🔍</span>
          <input
            type="text"
            placeholder="Cerca documento per nome, legge (es. DVR, 81/08, HACCP, Legionella)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>Filtro:</span>
          {(
            [
              { id: "all", label: "Tutti" },
              { id: "missing", label: "❌ Solo No" },
              { id: "present", label: "✅ Solo Sì" },
              { id: "expired", label: "⚠️ Solo Scaduti (NC)" },
              { id: "na", label: "⚪ Solo N/A" },
            ] as const
          ).map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setFilterStatus(btn.id)}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                border: "1px solid",
                borderColor: filterStatus === btn.id ? "var(--color-primary, #0f172a)" : "#cbd5e1",
                backgroundColor: filterStatus === btn.id ? "var(--color-primary, #0f172a)" : "#fff",
                color: filterStatus === btn.id ? "#fff" : "#334155",
                cursor: "pointer",
              }}
            >
              {btn.label}
            </button>
          ))}

          <div style={{ marginLeft: 8, display: "flex", gap: 6 }}>
            <button
              type="button"
              onClick={expandAllSections}
              style={{ fontSize: "12px", padding: "4px 8px", background: "#e2e8f0", border: "none", borderRadius: 4, cursor: "pointer" }}
            >
              Espandi tutte
            </button>
            <button
              type="button"
              onClick={collapseAllSections}
              style={{ fontSize: "12px", padding: "4px 8px", background: "#e2e8f0", border: "none", borderRadius: 4, cursor: "pointer" }}
            >
              Comprimi tutte
            </button>
          </div>
        </div>
      </div>

      {/* Le 5 Sezioni Accordion */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {categoriesOrder.map((catKey) => {
          const catInfo = DOCUMENT_CATEGORIES_INFO[catKey];
          const items = groupedDocuments[catKey];
          const isOpen = openSections[catKey];
          const applicability = isCategoryApplicableForAteco(catKey, atecoCode, checklistMode);

          // Calcolo statistiche della sezione (inclusi scaduti / non conformi)
          const catExpired = items.filter((i) => {
            if (i.status === "not_applicable") return false;
            const meta = parseDocumentExtraMeta(i.note);
            const def = i.definition ?? findCatalogDefinition(i.name);
            const validity = def?.validityMonths ?? (def?.isPeriodicReviewDocument ? 12 : undefined);
            const effExpiry = meta.expiryDate || (validity && meta.issueDate ? addMonthsToYmd(meta.issueDate, validity) : undefined);
            return Boolean(effExpiry && effExpiry < todayYmd);
          }).length;
          const catPresent = items.filter((i) => i.status === "viewed_on_site").length;
          const catMissing = items.filter((i) => i.status === "not_available" || i.status === "requested_later").length;
          const catNa = items.filter((i) => i.status === "not_applicable").length;

          return (
            <div
              key={catKey}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {/* Header Sezione Accordion */}
              <button
                type="button"
                onClick={() => toggleSection(catKey)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  backgroundColor: isOpen ? "#f8fafc" : "#fff",
                  border: "none",
                  borderBottom: isOpen ? "1px solid #e2e8f0" : "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: "24px" }}>{catInfo.icon}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: "17px", fontWeight: 700, color: "var(--color-primary, #0f172a)" }}>
                        {catInfo.title}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          backgroundColor: `${catInfo.badgeColor}15`,
                          color: catInfo.badgeColor,
                          fontWeight: 600,
                          border: `1px solid ${catInfo.badgeColor}40`,
                        }}
                      >
                        {catInfo.normScope}
                      </span>
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b", marginTop: 2 }}>{catInfo.subtitle}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Badge contatori sezione */}
                  <div style={{ display: "flex", gap: 6, fontSize: "12px", fontWeight: 600 }}>
                    {catExpired > 0 && (
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: 4,
                          backgroundColor: "#fee2e2",
                          color: "#b91c1c",
                          border: "1px solid #f87171",
                          fontWeight: 700,
                        }}
                      >
                        ⚠️ {catExpired} Scaduti (NC)
                      </span>
                    )}
                    <span style={{ padding: "3px 8px", borderRadius: 4, backgroundColor: "#dcfce7", color: "#166534" }}>
                      ✅ {catPresent} Sì
                    </span>
                    <span style={{ padding: "3px 8px", borderRadius: 4, backgroundColor: "#fee2e2", color: "#991b1b" }}>
                      ❌ {catMissing} No
                    </span>
                    <span style={{ padding: "3px 8px", borderRadius: 4, backgroundColor: "#f1f5f9", color: "#475569" }}>
                      ⚪ {catNa} N/A
                    </span>
                  </div>

                  <span style={{ fontSize: "18px", color: "#64748b" }}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* Corpo Sezione */}
              {isOpen && (
                <div style={{ padding: "16px 20px" }}>
                  {/* Avviso di applicabilità ATECO */}
                  {!applicability.applicable && (
                    <div
                      style={{
                        padding: "10px 14px",
                        backgroundColor: "#fef3c7",
                        border: "1px solid #fde68a",
                        borderRadius: 6,
                        color: "#92400e",
                        fontSize: "13px",
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span>ℹ️</span>
                      <span>
                        <strong>Nota settoriale:</strong> {applicability.reason}
                      </span>
                    </div>
                  )}

                  {/* Tabella o lista documenti della sezione */}
                  {items.length === 0 ? (
                    <p style={{ color: "#94a3b8", fontStyle: "italic", margin: "10px 0" }}>
                      Nessun documento corrisponde ai filtri di ricerca impostati in questa sezione.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {items.map((docItem, idx) => {
                        const meta = parseDocumentExtraMeta(docItem.note);
                        const def = docItem.definition ?? findCatalogDefinition(docItem.name);
                        const isLabReport = Boolean(def?.isLaboratoryTestReport);
                        const hasStatutory = Boolean(def?.hasStatutoryExpiry);
                        const isPeriodic = Boolean(def?.isPeriodicReviewDocument);
                        const hasExpiryField = Boolean(hasStatutory || isPeriodic || !def);
                        const validityMonths = def?.validityMonths ?? (isPeriodic ? 12 : undefined);

                        // Determina lo stato primario
                        const isYes = docItem.status === "viewed_on_site";
                        const isNo = docItem.status === "not_available" || docItem.status === "requested_later";
                        const isNa = docItem.status === "not_applicable";

                        // Calcolo scadenza effettiva e controllo se SCADUTO (Non Conformità)
                        const effectiveExpiry = meta.expiryDate || (validityMonths && meta.issueDate ? addMonthsToYmd(meta.issueDate, validityMonths) : undefined);
                        const isExpired = Boolean(effectiveExpiry && effectiveExpiry < todayYmd && !isNa);

                        const hasMinContents = def?.minimumContents && def.minimumContents.length > 0;
                        const isMinContentsOpen = !!expandedMinContents[docItem.name];
                        const checkedCount = (meta.checkedContents ?? []).length;
                        const totalMinCount = def?.minimumContents?.length ?? 0;

                        return (
                          <div
                            key={`${docItem.name}-${idx}`}
                            style={{
                              border: isExpired ? "2px solid #ef4444" : "1px solid",
                              borderColor: isExpired ? "#ef4444" : isYes ? "#bbf7d0" : isNo ? "#fecaca" : "#e2e8f0",
                              backgroundColor: isExpired ? "#fff8f8" : isYes ? "#fafffa" : isNo ? "#fffbfb" : "#fff",
                              borderRadius: 8,
                              padding: "14px 16px",
                              boxShadow: isExpired ? "0 0 0 1px #ef4444, 0 2px 4px rgba(239, 68, 68, 0.12)" : "none",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {/* Riga principale documento */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                flexWrap: "wrap",
                                gap: 12,
                              }}
                            >
                              {/* Dati Documento */}
                              <div style={{ flex: "1 1 350px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                                    {docItem.name}
                                  </span>
                                  {isExpired && (
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        fontWeight: 800,
                                        padding: "2px 8px",
                                        borderRadius: 4,
                                        backgroundColor: "#fee2e2",
                                        color: "#b91c1c",
                                        border: "1px solid #ef4444",
                                        letterSpacing: "0.5px",
                                      }}
                                    >
                                      ⚠️ {isPeriodic ? "NC - RIESAME PERIODICO SCADUTO" : "NC - DOCUMENTO SCADUTO"}
                                    </span>
                                  )}
                                  {docItem.isRequired && (
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        padding: "2px 6px",
                                        borderRadius: 4,
                                        backgroundColor: "#fee2e2",
                                        color: "#dc2626",
                                        border: "1px solid #fca5a5",
                                      }}
                                    >
                                      OBBLIGATORIO
                                    </span>
                                  )}
                                  {isLabReport && (
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        padding: "2px 6px",
                                        borderRadius: 4,
                                        backgroundColor: "#e0f2fe",
                                        color: "#0369a1",
                                        border: "1px solid #bae6fd",
                                      }}
                                    >
                                      🧪 RAPPORTO DI PROVA
                                    </span>
                                  )}
                                  {hasStatutory && (
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        padding: "2px 6px",
                                        borderRadius: 4,
                                        backgroundColor: "#fef3c7",
                                        color: "#b45309",
                                        border: "1px solid #fde68a",
                                      }}
                                    >
                                      ⏳ VALIDITÀ {formatDocumentValidity(def)}
                                    </span>
                                  )}
                                  {isPeriodic && (
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        padding: "2px 6px",
                                        borderRadius: 4,
                                        backgroundColor: "#f3e8ff",
                                        color: "#7e22ce",
                                        border: "1px solid #e9d5ff",
                                      }}
                                    >
                                      🔄 RIESAME ANNUALE
                                    </span>
                                  )}
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      padding: "2px 6px",
                                      borderRadius: 4,
                                      backgroundColor: "#f1f5f9",
                                      color: "#475569",
                                      fontWeight: 500,
                                    }}
                                  >
                                    📜 {docItem.normReference}
                                  </span>
                                </div>
                                <div style={{ fontSize: "12px", color: "#64748b", marginTop: 4 }}>
                                  {docItem.description}
                                </div>
                              </div>

                              {/* Selettore Primario Grande: SÌ / NO / NON APPLICABILE */}
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                                <div
                                  style={{
                                    display: "inline-flex",
                                    borderRadius: 8,
                                    border: "1px solid #cbd5e1",
                                    overflow: "hidden",
                                    backgroundColor: "#f8fafc",
                                  }}
                                >
                                  {/* Pulsante SÌ */}
                                  <button
                                    type="button"
                                    disabled={isInspectionValidated}
                                    onClick={() => handlePrimaryStatusChange(docItem.name, "yes")}
                                    style={{
                                      padding: "8px 16px",
                                      fontSize: "14px",
                                      fontWeight: 700,
                                      border: "none",
                                      cursor: isInspectionValidated ? "not-allowed" : "pointer",
                                      backgroundColor: isYes ? "#16a34a" : "transparent",
                                      color: isYes ? "#fff" : "#166534",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 4,
                                      transition: "background-color 0.1s ease",
                                    }}
                                  >
                                    <span>✅</span> SÌ (Presente)
                                  </button>

                                  {/* Pulsante NO */}
                                  <button
                                    type="button"
                                    disabled={isInspectionValidated}
                                    onClick={() => handlePrimaryStatusChange(docItem.name, "no")}
                                    style={{
                                      padding: "8px 16px",
                                      fontSize: "14px",
                                      fontWeight: 700,
                                      border: "none",
                                      borderLeft: "1px solid #cbd5e1",
                                      borderRight: "1px solid #cbd5e1",
                                      cursor: isInspectionValidated ? "not-allowed" : "pointer",
                                      backgroundColor: isNo ? "#dc2626" : "transparent",
                                      color: isNo ? "#fff" : "#991b1b",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 4,
                                      transition: "background-color 0.1s ease",
                                    }}
                                  >
                                    <span>❌</span> NO (Assente)
                                  </button>

                                  {/* Pulsante NON APPLICABILE */}
                                  <button
                                    type="button"
                                    disabled={isInspectionValidated}
                                    onClick={() => handlePrimaryStatusChange(docItem.name, "na")}
                                    style={{
                                      padding: "8px 14px",
                                      fontSize: "13px",
                                      fontWeight: 600,
                                      border: "none",
                                      cursor: isInspectionValidated ? "not-allowed" : "pointer",
                                      backgroundColor: isNa ? "#475569" : "transparent",
                                      color: isNa ? "#fff" : "#475569",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 4,
                                      transition: "background-color 0.1s ease",
                                    }}
                                  >
                                    <span>⚪</span> N/A
                                  </button>
                                </div>

                                {/* Scelta Aggiuntiva Secondaria (Dettaglio visivo / differita) */}
                                {isNo && (
                                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px" }}>
                                    <span style={{ color: "#64748b" }}>Dettaglio:</span>
                                    <select
                                      disabled={isInspectionValidated}
                                      value={docItem.status === "requested_later" ? "requested_later" : "not_available"}
                                      onChange={(e) => handleSubStatusChange(docItem.name, e.target.value as InspectionDocumentStatus)}
                                      style={{
                                        fontSize: "12px",
                                        padding: "2px 8px",
                                        borderRadius: 4,
                                        border: "1px solid #fca5a5",
                                        backgroundColor: "#fff",
                                        color: "#991b1b",
                                        fontWeight: 500,
                                      }}
                                    >
                                      <option value="not_available">⚠️ Non disponibile in sede</option>
                                      <option value="requested_later">⏳ Richiesto in differita al cliente</option>
                                    </select>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Banner di Allerta Scaduto / Non Conformità Rilevata */}
                            {isExpired && (
                              <div
                                style={{
                                  marginTop: 10,
                                  padding: "9px 12px",
                                  backgroundColor: "#fee2e2",
                                  border: "1px solid #f87171",
                                  borderRadius: 6,
                                  color: "#991b1b",
                                  fontSize: "12px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 8,
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontSize: "16px" }}>🚨</span>
                                  <span>
                                    {isPeriodic ? (
                                      <>
                                        <strong>NON CONFORMITÀ RILEVATA:</strong> Il termine per il riesame periodico obbligatorio è scaduto il{" "}
                                        <u>{formattaData(effectiveExpiry)}</u> (intervallo normativo di 12 mesi superato).
                                        È necessario effettuare una revisione formale del documento ai sensi di legge.
                                      </>
                                    ) : (
                                      <>
                                        <strong>NON CONFORMITÀ RILEVATA:</strong> Il documento è scaduto di validità legale il{" "}
                                        <u>{formattaData(effectiveExpiry)}</u>. È richiesto il rinnovo o nuova istanza/collaudo ai sensi della normativa vigente.
                                      </>
                                    )}
                                  </span>
                                </div>
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    backgroundColor: "#dc2626",
                                    color: "#fff",
                                    padding: "2px 8px",
                                    borderRadius: 4,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  NC ATTIVA
                                </span>
                              </div>
                            )}

                            {/* Riga Opzioni Aggiuntive: Date e Note in base al regime normativo */}
                            {!hasExpiryField ? (
                              /* REGIME 1: Documenti Permanenti & Rapporti di Prova (SENZA Data Scadenza) */
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "minmax(240px, 320px) 1fr",
                                  gap: 12,
                                  marginTop: 12,
                                  paddingTop: 10,
                                  borderTop: "1px dashed #e2e8f0",
                                }}
                              >
                                {/* Data Emissione / Prelievo */}
                                <div>
                                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 3 }}>
                                    {isLabReport ? "📅 Data Prelievo / Esecuzione Analisi:" : "📅 Data Rilascio / Emissione:"}
                                  </label>
                                  <input
                                    type="date"
                                    disabled={isInspectionValidated}
                                    value={meta.issueDate ?? ""}
                                    onChange={(e) => handleIssueDateChange(docItem.name, docItem.note, e.target.value, def)}
                                    style={{
                                      width: "100%",
                                      padding: "6px 10px",
                                      borderRadius: 4,
                                      border: "1px solid #cbd5e1",
                                      fontSize: "13px",
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                  <div style={{ fontSize: "11px", color: isLabReport ? "#0369a1" : "#64748b", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                    <span>{isLabReport ? "🧪" : "♾️"}</span>
                                    <span>
                                      {isLabReport
                                        ? "Rapporto analitico puntuale (fa fede la data del prelievo). Nessuna scadenza di legge."
                                        : "Atto permanente a validità continuativa (nessuna scadenza periodica)."}
                                    </span>
                                  </div>
                                </div>

                                {/* Note del consulente / Rilievi */}
                                <div>
                                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 3 }}>
                                    Note del consulente / Rilievi:
                                  </label>
                                  <input
                                    type="text"
                                    placeholder={
                                      isLabReport
                                        ? "Es. Esito conforme ai limiti di legge, laboratorio accreditato..."
                                        : "Es. Numero protocollo SUAP, conformità edilizia, DICO completa di allegati obbligatori..."
                                    }
                                    disabled={isInspectionValidated}
                                    value={meta.noteText ?? ""}
                                    onChange={(e) => handleMetadataChange(docItem.name, docItem.note, "noteText", e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "6px 10px",
                                      borderRadius: 4,
                                      border: "1px solid #cbd5e1",
                                      fontSize: "13px",
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                </div>
                              </div>
                            ) : hasStatutory ? (
                              /* REGIME 2: Documenti con Scadenza di Legge (AUA, CPI, DPR 462, Scarichi, ecc.) */
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                  gap: 12,
                                  marginTop: 12,
                                  paddingTop: 10,
                                  borderTop: "1px dashed #e2e8f0",
                                }}
                              >
                                {/* Data Rilascio / Emissione */}
                                <div>
                                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 3 }}>
                                    📅 Data di Rilascio / Emissione:
                                  </label>
                                  <input
                                    type="date"
                                    disabled={isInspectionValidated}
                                    value={meta.issueDate ?? ""}
                                    onChange={(e) => handleIssueDateChange(docItem.name, docItem.note, e.target.value, def)}
                                    style={{
                                      width: "100%",
                                      padding: "6px 10px",
                                      borderRadius: 4,
                                      border: "1px solid #cbd5e1",
                                      fontSize: "13px",
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: 4 }}>
                                    Validità di legge: {formatDocumentValidity(def)}
                                  </div>
                                </div>

                                {/* Data Scadenza di Legge */}
                                <div>
                                  <label style={{ fontSize: "12px", fontWeight: 600, color: isExpired ? "#b91c1c" : "#475569", display: "block", marginBottom: 3 }}>
                                    ⏳ Data Scadenza di Legge:
                                  </label>
                                  <input
                                    type="date"
                                    disabled={isInspectionValidated}
                                    value={effectiveExpiry ?? ""}
                                    onChange={(e) => handleExpiryDateChange(docItem.name, docItem.note, e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "6px 10px",
                                      borderRadius: 4,
                                      border: isExpired ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                      fontSize: "13px",
                                      backgroundColor: isExpired ? "#fee2e2" : "#fff",
                                      color: isExpired ? "#991b1b" : "#0f172a",
                                      fontWeight: isExpired ? 600 : 400,
                                    }}
                                  />
                                  <div style={{ fontSize: "11px", marginTop: 4 }}>
                                    {isExpired ? (
                                      <span style={{ color: "#b91c1c", fontWeight: 700 }}>
                                        ⚠️ Scaduto il {formattaData(effectiveExpiry)} (NC)
                                      </span>
                                    ) : effectiveExpiry ? (
                                      <span style={{ color: "#166534", fontWeight: 500 }}>
                                        ✅ Valido fino al {formattaData(effectiveExpiry)}
                                      </span>
                                    ) : (
                                      <span style={{ color: "#94a3b8" }}>
                                        Calcolata in automatico (+{validityMonths} mesi)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Note / Prescrizioni */}
                                <div style={{ gridColumn: "span 2" }}>
                                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 3 }}>
                                    Note del consulente / Rilievi:
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Es. Pratica di rinnovo avviata, CPI in deroga, prescrizioni VVF..."
                                    disabled={isInspectionValidated}
                                    value={meta.noteText ?? ""}
                                    onChange={(e) => handleMetadataChange(docItem.name, docItem.note, "noteText", e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "6px 10px",
                                      borderRadius: 4,
                                      border: "1px solid #cbd5e1",
                                      fontSize: "13px",
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                </div>
                              </div>
                            ) : isPeriodic ? (
                              /* REGIME 3: Documenti con Riesame Periodico (DVR, HACCP, Legionella, VDR) */
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                  gap: 12,
                                  marginTop: 12,
                                  paddingTop: 10,
                                  borderTop: "1px dashed #e2e8f0",
                                }}
                              >
                                {/* Data Emissione / Ultimo Riesame */}
                                <div>
                                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 3 }}>
                                    📅 Data Emissione / Ultimo Riesame:
                                  </label>
                                  <input
                                    type="date"
                                    disabled={isInspectionValidated}
                                    value={meta.issueDate ?? ""}
                                    onChange={(e) => handleIssueDateChange(docItem.name, docItem.note, e.target.value, def)}
                                    style={{
                                      width: "100%",
                                      padding: "6px 10px",
                                      borderRadius: 4,
                                      border: "1px solid #cbd5e1",
                                      fontSize: "13px",
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: 4 }}>
                                    Cadenza riesame: annuale (12 mesi)
                                  </div>
                                </div>

                                {/* Prossimo Riesame Entro */}
                                <div>
                                  <label style={{ fontSize: "12px", fontWeight: 600, color: isExpired ? "#b91c1c" : "#475569", display: "block", marginBottom: 3 }}>
                                    🔄 Prossimo Riesame Entro:
                                  </label>
                                  <input
                                    type="date"
                                    disabled={isInspectionValidated}
                                    value={effectiveExpiry ?? ""}
                                    onChange={(e) => handleExpiryDateChange(docItem.name, docItem.note, e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "6px 10px",
                                      borderRadius: 4,
                                      border: isExpired ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                      fontSize: "13px",
                                      backgroundColor: isExpired ? "#fee2e2" : "#fff",
                                      color: isExpired ? "#991b1b" : "#0f172a",
                                      fontWeight: isExpired ? 600 : 400,
                                    }}
                                  />
                                  <div style={{ fontSize: "11px", marginTop: 4 }}>
                                    {isExpired ? (
                                      <span style={{ color: "#b91c1c", fontWeight: 700 }}>
                                        ⚠️ Riesame scaduto il {formattaData(effectiveExpiry)} (NC)
                                      </span>
                                    ) : effectiveExpiry ? (
                                      <span style={{ color: "#166534", fontWeight: 500 }}>
                                        ✅ Riesame valido fino al {formattaData(effectiveExpiry)}
                                      </span>
                                    ) : (
                                      <span style={{ color: "#94a3b8" }}>
                                        Calcolato in automatico (+12 mesi)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Note / Prescrizioni */}
                                <div style={{ gridColumn: "span 2" }}>
                                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 3 }}>
                                    Note del consulente / Rilievi:
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Es. Da aggiornare per nuove attrezzature o modifiche al ciclo produttivo..."
                                    disabled={isInspectionValidated}
                                    value={meta.noteText ?? ""}
                                    onChange={(e) => handleMetadataChange(docItem.name, docItem.note, "noteText", e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "6px 10px",
                                      borderRadius: 4,
                                      border: "1px solid #cbd5e1",
                                      fontSize: "13px",
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              /* REGIME 4: Documenti Personalizzati Fuori Catalogo */
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                  gap: 12,
                                  marginTop: 12,
                                  paddingTop: 10,
                                  borderTop: "1px dashed #e2e8f0",
                                }}
                              >
                                {/* Data Emissione */}
                                <div>
                                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 3 }}>
                                    📅 Data Emissione / Redazione:
                                  </label>
                                  <input
                                    type="date"
                                    disabled={isInspectionValidated}
                                    value={meta.issueDate ?? ""}
                                    onChange={(e) => handleIssueDateChange(docItem.name, docItem.note, e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "6px 10px",
                                      borderRadius: 4,
                                      border: "1px solid #cbd5e1",
                                      fontSize: "13px",
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                </div>

                                {/* Data Scadenza (opzionale) */}
                                <div>
                                  <label style={{ fontSize: "12px", fontWeight: 600, color: isExpired ? "#b91c1c" : "#475569", display: "block", marginBottom: 3 }}>
                                    ⏳ Data Scadenza (se applicabile):
                                  </label>
                                  <input
                                    type="date"
                                    disabled={isInspectionValidated}
                                    value={meta.expiryDate ?? ""}
                                    onChange={(e) => handleExpiryDateChange(docItem.name, docItem.note, e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "6px 10px",
                                      borderRadius: 4,
                                      border: isExpired ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                      fontSize: "13px",
                                      backgroundColor: isExpired ? "#fee2e2" : "#fff",
                                      color: isExpired ? "#991b1b" : "#0f172a",
                                    }}
                                  />
                                  {isExpired && (
                                    <div style={{ fontSize: "11px", color: "#b91c1c", fontWeight: 700, marginTop: 4 }}>
                                      ⚠️ Scaduto il {formattaData(meta.expiryDate)} (NC)
                                    </div>
                                  )}
                                </div>

                                {/* Note / Prescrizioni */}
                                <div style={{ gridColumn: "span 2" }}>
                                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: 3 }}>
                                    Note del consulente / Rilievi:
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Annotazioni del consulente..."
                                    disabled={isInspectionValidated}
                                    value={meta.noteText ?? ""}
                                    onChange={(e) => handleMetadataChange(docItem.name, docItem.note, "noteText", e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "6px 10px",
                                      borderRadius: 4,
                                      border: "1px solid #cbd5e1",
                                      fontSize: "13px",
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Sezione Contenuti Minimi Obbligatori (se previsti dalla norma per questo documento) */}
                            {hasMinContents && docItem.definition?.minimumContents && (
                              <div style={{ marginTop: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedMinContents((prev) => ({
                                        ...prev,
                                        [docItem.name]: !prev[docItem.name],
                                      }))
                                    }
                                    style={{
                                      background: "none",
                                      border: "none",
                                      color: "#2563eb",
                                      fontSize: "13px",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      padding: "4px 0",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 6,
                                    }}
                                  >
                                    <span>{isMinContentsOpen ? "▼" : "▶"}</span>
                                    <span>
                                      🔍 Verifica Contenuti Minimi Obbligatori di Legge ({checkedCount}/{totalMinCount})
                                    </span>
                                  </button>

                                  {checkedCount < totalMinCount && isMinContentsOpen && !isInspectionValidated && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAutoFillDeficiencies(
                                          docItem.name,
                                          docItem.note,
                                          docItem.definition!.minimumContents!,
                                        )
                                      }
                                      style={{
                                        fontSize: "11px",
                                        padding: "3px 8px",
                                        borderRadius: 4,
                                        border: "1px solid #fca5a5",
                                        backgroundColor: "#fef2f2",
                                        color: "#991b1b",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                      }}
                                    >
                                      ⚠️ Inserisci rilievo carenze nelle note
                                    </button>
                                  )}
                                </div>

                                {isMinContentsOpen && (
                                  <div
                                    style={{
                                      marginTop: 8,
                                      padding: "12px",
                                      backgroundColor: "#f8fafc",
                                      borderRadius: 6,
                                      border: "1px solid #e2e8f0",
                                    }}
                                  >
                                    <div style={{ fontSize: "12px", color: "#475569", marginBottom: 8 }}>
                                      Spunta ciascun elemento per verificare che il documento contenga tutti i requisiti di legge prescritti:
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                      {docItem.definition.minimumContents.map((minItem) => {
                                        const isChecked = (meta.checkedContents ?? []).includes(minItem.id);
                                        return (
                                          <label
                                            key={minItem.id}
                                            style={{
                                              display: "flex",
                                              alignItems: "flex-start",
                                              gap: 8,
                                              fontSize: "13px",
                                              color: isChecked ? "#166534" : "#334155",
                                              cursor: isInspectionValidated ? "default" : "pointer",
                                            }}
                                          >
                                            <input
                                              type="checkbox"
                                              disabled={isInspectionValidated}
                                              checked={isChecked}
                                              onChange={() =>
                                                handleToggleMinimumContent(docItem.name, docItem.note, minItem.id)
                                              }
                                              style={{ marginTop: 2 }}
                                            />
                                            <div>
                                              <span>{minItem.label}</span>
                                              <span
                                                style={{
                                                  marginLeft: 6,
                                                  fontSize: "11px",
                                                  color: "#64748b",
                                                  fontWeight: 500,
                                                }}
                                              >
                                                ({minItem.normArticle})
                                              </span>
                                            </div>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modale Aggiunta Documento Personalizzato */}
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
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: "24px",
              width: "100%",
              maxWidth: "520px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "var(--color-primary, #0f172a)" }}>
              ➕ Aggiungi Documento Personalizzato
            </h3>

            <form onSubmit={handleAddCustomDocument}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: 4 }}>
                  Nome Documento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Es. Autorizzazione Passo Carrabile, Certificato Scarichi..."
                  value={customDocName}
                  onChange={(e) => setCustomDocName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: 4 }}>
                  Macro-Sezione di appartenenza
                </label>
                <select
                  value={customDocCategory}
                  onChange={(e) => setCustomDocCategory(e.target.value as DocumentCategory)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                >
                  <option value="base_autorizzativa">🏛️ 1. Base & Autorizzativa</option>
                  <option value="haccp_alimentare">🍽️ 2. Igiene Alimentare & HACCP</option>
                  <option value="sicurezza_81_08">🦺 3. Sicurezza sul Lavoro D.Lgs. 81/08</option>
                  <option value="acque_legionella">💧 4. Piano Sicurezza Acque & Legionella</option>
                  <option value="matrici_ambientali">🌿 5. Matrici Ambientali: Fumi, Scarichi e Suolo</option>
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: 4 }}>
                  Riferimento Normativo (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es. D.Lgs. 152/2006, Regolamento Comunale..."
                  value={customDocNorm}
                  onChange={(e) => setCustomDocNorm(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={customDocRequired}
                    onChange={(e) => setCustomDocRequired(e.target.checked)}
                  />
                  <span>Contrassegna come documento obbligatorio per l'attività</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
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
                  Aggiungi Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
