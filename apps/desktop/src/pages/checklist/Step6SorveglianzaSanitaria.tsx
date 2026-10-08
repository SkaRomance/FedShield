// Step 6 "Sorveglianza Sanitaria" — Architettura tecnica e interfaccia conforme a D.Lgs. 81/2008.
//
// Regole UX fondamentali:
// 1. Tutti gli accordion principali ed elenchi espandibili sono CHIUSI DI DEFAULT.
// 2. 4 Macro-sezioni:
//    - 1) Documentazione Base e Nomina MC (con anagrafica MC, date conferimento/scadenza, tabella 7 requisiti con sanzioni)
//    - 2) Protocollo Sanitario Aziendale (filtrato per ATECO, badge "Obbligatorio per Legge", toggle Sì/No/N.A., esami custom)
//    - 3) Cartelle Sanitarie & Giudizi di Idoneità (scadenze idoneità lavoratori, custodia protetta cartacea/digitale, ricorsi SPRESAL)
//    - 4) Tutele Speciali: Lavoratrici Madri & Minori (badge dinamico con rilevamento automatico e checklist operative)

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  Company,
  Employee,
  fetchEmployees,
  InspectionDocumentRequirement,
  InspectionDocumentStatus,
} from "../../api";
import {
  CustodyStorageConfig,
  detectProtectedCategories,
  FitnessAppealRecord,
  getSuggestedProtocolsForAteco,
  HEALTH_DOCUMENTS_CATALOG,
  HealthDocumentDefinition,
  MedicalExamProtocolItem,
  SPECIAL_PROTECTIONS_CATALOG,
} from "./normativeHealthCatalog";
import { parseDocumentExtraMeta, serializeDocumentExtraMeta } from "./normativeDocumentCatalog";
import { addMonthsToYmd } from "../../lib/deadlinesEngine";

interface Step6SorveglianzaSanitariaProps {
  token?: string;
  companyId?: string;
  company?: Company;
  employees?: Employee[];
  documents: InspectionDocumentRequirement[];
  setDocuments: Dispatch<SetStateAction<InspectionDocumentRequirement[]>>;
  isInspectionValidated: boolean;
  atecoCode?: string;
  checklistMode?: string;
  inspectionId?: string;
}

export default function Step6SorveglianzaSanitaria({
  token,
  companyId,
  company,
  employees = [],
  documents,
  setDocuments,
  isInspectionValidated,
  atecoCode,
  checklistMode: _checklistMode,
}: Step6SorveglianzaSanitariaProps) {
  // Caricamento autonomo dei dipendenti se non forniti da props
  const [internalEmployees, setInternalEmployees] = useState<Employee[]>(employees);

  useEffect(() => {
    if (employees && employees.length > 0) {
      setInternalEmployees(employees);
      return;
    }
    const targetCompId = companyId || company?.id;
    if (token && targetCompId) {
      fetchEmployees(token, { companyId: targetCompId, isActive: true })
        .then((res) => setInternalEmployees(res))
        .catch(() => undefined);
    }
  }, [token, companyId, company?.id, employees]);

  // REGOLA UX ESSENZIALE: TUTTI GLI ACCORDION CHIUSI DI DEFAULT
  const [openSections, setOpenSections] = useState({
    docNomina: false,
    protocol: false,
    fitnessRecords: false,
    specialProtections: false,
  });

  // Espansione contenuti minimi per singoli documenti base (id documento -> booleano, chiusi di default)
  const [expandedMinContents, setExpandedMinContents] = useState<Record<string, boolean>>({});

  // Ricerca rapida esami
  const [examSearchQuery, setExamSearchQuery] = useState("");

  // Rilevamento automatico categorie protette
  const protectedDetection = useMemo(() => {
    return detectProtectedCategories(internalEmployees);
  }, [internalEmployees]);

  // Lista protocolli sanitari filtrati per il codice ATECO
  const suggestedProtocols = useMemo(() => {
    return getSuggestedProtocolsForAteco(atecoCode || company?.atecoCode);
  }, [atecoCode, company?.atecoCode]);

  // Modale per aggiunta esame personalizzato
  const [showAddCustomExamModal, setShowAddCustomExamModal] = useState(false);
  const [customExamName, setCustomExamName] = useState("");
  const [customExamRisk, setCustomExamRisk] = useState("");
  const [customExamFrequency, setCustomExamFrequency] = useState(12);
  const [customExamJobRole, setCustomExamJobRole] = useState("");
  const [customExamLegalBasis, setCustomExamLegalBasis] = useState("D.Lgs. 81/2008 art. 41");
  const [customExamIsMandatory, setCustomExamIsMandatory] = useState(false);
  const [customProtocols, setCustomProtocols] = useState<MedicalExamProtocolItem[]>([]);

  // Protocolli complessivi attivi
  const allProtocolItems = useMemo(() => {
    return [...suggestedProtocols, ...customProtocols];
  }, [suggestedProtocols, customProtocols]);

  // Stato toggle degli esami (id -> { isEnabled: boolean, status: "yes" | "no" | "na", reason?: string })
  const [protocolAnswers, setProtocolAnswers] = useState<
    Record<string, { status: "yes" | "no" | "na"; reason?: string }>
  >({});

  // Configurazione custodia cartelle sanitarie
  const [custodyConfig, setCustodyConfig] = useState<CustodyStorageConfig>({
    location: "company_premises",
    storageType: "locked_cabinet",
    designatedResponsible: company?.employerRsppPreposto || "",
    gdprCompliant: true,
    notes: "",
  });

  // Ricorsi SPRESAL/ASL ex art. 41 c. 9
  const [appealsList, setAppealsList] = useState<FitnessAppealRecord[]>([]);
  const [showAddAppealModal, setShowAddAppealModal] = useState(false);
  const [appealWorkerName, setAppealWorkerName] = useState("");
  const [appealDate, setAppealDate] = useState(new Date().toISOString().split("T")[0]);
  const [appealSpresal, setAppealSpresal] = useState("");
  const [appealStatus, setAppealStatus] = useState<FitnessAppealRecord["appealStatus"]>("submitted");
  const [appealNotes, setAppealNotes] = useState("");

  const todayYmd = useMemo(() => new Date().toISOString().split("T")[0], []);
  const fitnessStorageKey = `fedshield_fitness_records_${companyId || company?.id || "current"}`;

  // Stato idoneità per singolo dipendente
  const [employeeFitnessState, setEmployeeFitnessState] = useState<
    Record<
      string,
      {
        examDate?: string;
        periodicityMonths?: number;
        expiryDate?: string;
        status?: "idoneo" | "idoneo_parziale" | "inidoneo_temporaneo" | "inidoneo_permanente" | "da_visitare";
        notes?: string;
      }
    >
  >(() => {
    try {
      const saved = localStorage.getItem(fitnessStorageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(fitnessStorageKey, JSON.stringify(employeeFitnessState));
    } catch {
      // ignore
    }
  }, [employeeFitnessState, fitnessStorageKey]);

  // Conteggio lavoratori con idoneità scaduta
  const expiredWorkersCount = useMemo(() => {
    return internalEmployees.filter((emp) => {
      const state = employeeFitnessState[emp.id];
      if (!state || !state.expiryDate) return false;
      return state.expiryDate < todayYmd && state.status !== "da_visitare";
    }).length;
  }, [internalEmployees, employeeFitnessState, todayYmd]);

  // Toggle singola sezione accordion
  function toggleSection(key: keyof typeof openSections) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Helper per trovare un documento esistente nella lista ispezione
  function getExistingDoc(templateId: string, name: string): InspectionDocumentRequirement | undefined {
    return documents.find(
      (d) =>
        (d.documentTemplateId && d.documentTemplateId.toLowerCase() === templateId.toLowerCase()) ||
        d.name.toLowerCase().trim() === name.toLowerCase().trim(),
    );
  }

  // Aggiornamento stato di un documento base della sorveglianza sanitaria
  function handleUpdateHealthDocStatus(
    def: HealthDocumentDefinition,
    status: InspectionDocumentStatus,
    issueDate?: string,
    expiryDate?: string,
  ) {
    if (isInspectionValidated) return;

    setDocuments((prev) => {
      const existingIndex = prev.findIndex(
        (d) =>
          (d.documentTemplateId && d.documentTemplateId.toLowerCase() === def.id.toLowerCase()) ||
          d.name.toLowerCase().trim() === def.name.toLowerCase().trim(),
      );

      const oldDoc = existingIndex >= 0 ? prev[existingIndex] : undefined;
      const currentMeta = parseDocumentExtraMeta(oldDoc?.note);

      const effectiveIssue = issueDate !== undefined ? issueDate : currentMeta.issueDate;
      let effectiveExpiry = expiryDate !== undefined ? expiryDate : currentMeta.expiryDate;

      // Logica normativa scadenze:
      // doc-hlt-01 (Nomina MC) e doc-hlt-06 (Custodia cartelle) sono adempimenti formali permanenti senza scadenza
      if (def.id === "doc-hlt-01" || def.id === "doc-hlt-06") {
        effectiveExpiry = undefined;
      } else if ((def.id === "doc-hlt-02" || def.id === "doc-hlt-04") && effectiveIssue && expiryDate === undefined) {
        // Riesame annuale automatico (+12 mesi)
        effectiveExpiry = addMonthsToYmd(effectiveIssue, 12);
      }

      const nextMeta = {
        ...currentMeta,
        issueDate: effectiveIssue,
        expiryDate: effectiveExpiry,
        subStatus: status,
      };

      const serializedNote = serializeDocumentExtraMeta(nextMeta);

      const updatedDoc: InspectionDocumentRequirement = {
        documentTemplateId: def.id,
        name: def.name,
        isRequired: def.isRequiredDefault,
        status,
        note: serializedNote,
      };

      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = updatedDoc;
        return copy;
      } else {
        return [...prev, updatedDoc];
      }
    });
  }

  // Gestione aggiunta esame personalizzato
  function handleCreateCustomExam() {
    if (!customExamName.trim()) return;

    const newItem: MedicalExamProtocolItem = {
      id: `custom-proto-${Date.now()}`,
      name: customExamName.trim(),
      riskFactor: customExamRisk.trim() || "Rischio specifico DVR",
      legalBasis: customExamLegalBasis.trim() || "D.Lgs. 81/2008 art. 41",
      sanctionReference: "D.Lgs. 81/2008 art. 58",
      isMandatoryByLaw: customExamIsMandatory,
      recommendedFrequencyMonths: customExamFrequency,
      typicalExams: ["Visita mirata"],
      applicableAtecoPrefixes: [],
      typicalJobRoles: customExamJobRole ? [customExamJobRole] : ["Mansione specifica"],
    };

    setCustomProtocols((prev) => [...prev, newItem]);
    setProtocolAnswers((prev) => ({
      ...prev,
      [newItem.id]: { status: "yes" },
    }));

    setCustomExamName("");
    setCustomExamRisk("");
    setCustomExamJobRole("");
    setShowAddCustomExamModal(false);
  }

  // Gestione aggiunta ricorso SPRESAL
  function handleCreateAppeal() {
    if (!appealWorkerName.trim()) return;

    const newAppeal: FitnessAppealRecord = {
      id: `appeal-${Date.now()}`,
      workerFullName: appealWorkerName.trim(),
      appealDate,
      spresalAuthority: appealSpresal.trim() || "SPRESAL competente per territorio",
      appealStatus,
      notes: appealNotes.trim(),
    };

    setAppealsList((prev) => [...prev, newAppeal]);
    setAppealWorkerName("");
    setAppealSpresal("");
    setAppealNotes("");
    setShowAddAppealModal(false);
  }

  // Conteggio requisiti completati su 7
  const baseCompletedCount = useMemo(() => {
    return HEALTH_DOCUMENTS_CATALOG.filter((def) => {
      const doc = getExistingDoc(def.id, def.name);
      return doc && (doc.status === "viewed_on_site" || doc.status === "not_applicable");
    }).length;
  }, [documents]);

  return (
    <div className="sorveglianza-sanitaria-container" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* -------------------------------------------------------------------- */}
      {/* HEADER RIASSUNTIVO STATO MEDICO COMPETENTE & CATEGORIE PROTETTE       */}
      {/* -------------------------------------------------------------------- */}
      <div
        className="card"
        style={{
          padding: 16,
          background: "var(--color-surface, #ffffff)",
          border: "1px solid var(--color-border, #e2e8f0)",
          borderRadius: 8,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 24 }}>🩺</span>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Stato Sorveglianza Sanitaria</h3>
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-muted, #64748b)" }}>
            Conformità D.Lgs. 81/2008 Artt. 18, 25, 38-42 • ATECO: <strong>{atecoCode || company?.atecoCode || "N.D."}</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {/* Badge Avanzamento 7 Requisiti Base */}
          <div
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              background: baseCompletedCount === 7 ? "#dcfce7" : "#fef3c7",
              border: `1px solid ${baseCompletedCount === 7 ? "#86efac" : "#fde68a"}`,
              color: baseCompletedCount === 7 ? "#166534" : "#92400e",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            📋 Requisiti Base: {baseCompletedCount} / 7
          </div>

          {/* Badge Lavoratrici Madri */}
          {protectedDetection.hasFemaleWorkers && (
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                background: "#fdf2f8",
                border: "1px solid #fbcfe8",
                color: "#9d174d",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
              title={`Rilevate ${protectedDetection.femaleWorkerNames.length} lavoratrici in anagrafica: applicare tutele D.Lgs. 151/01`}
            >
              🤰 Maternità Attiva ({protectedDetection.femaleWorkerNames.length})
            </div>
          )}

          {/* Badge Minori */}
          {protectedDetection.hasMinorWorkers && (
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                background: "#fef9c3",
                border: "1px solid #fde047",
                color: "#854d0e",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
              title={`Rilevati ${protectedDetection.minorWorkerNames.length} minori in anagrafica: applicare tutele L. 977/67`}
            >
              ⚠️ Minori &lt; 18 anni ({protectedDetection.minorWorkerNames.length})
            </div>
          )}

          {/* Badge Idoneità Sanitarie Lavoratori */}
          {expiredWorkersCount > 0 ? (
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                background: "#fee2e2",
                border: "1px solid #ef4444",
                color: "#991b1b",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            >
              🚨 {expiredWorkersCount} Idoneità Scadute
            </div>
          ) : (
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                background: "#dcfce7",
                border: "1px solid #86efac",
                color: "#166534",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              ✅ Idoneità Regolari
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 1) ACCORDION: DOCUMENTAZIONE BASE E NOMINA MEDICO COMPETENTE          */}
      {/* -------------------------------------------------------------------- */}
      <div
        className="card accordion-section"
        style={{
          border: "1px solid var(--color-border, #e2e8f0)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => toggleSection("docNomina")}
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "var(--color-surface, #f8fafc)",
            border: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "1rem",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>📄</span>
            <span>1. Documentazione Base e Nomina Medico Competente (MC)</span>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: 4,
                background: "#e0f2fe",
                color: "#0369a1",
              }}
            >
              7 Requisiti di Legge
            </span>
          </div>
          <span>{openSections.docNomina ? "▲ Chiudi" : "▼ Espandi"}</span>
        </button>

        {openSections.docNomina && (
          <div style={{ padding: 18, borderTop: "1px solid var(--color-border, #e2e8f0)" }}>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.9rem", color: "var(--color-text-muted, #64748b)" }}>
              Verifica obbligatoria dei 7 adempimenti essenziali previsti dal D.Lgs. 81/2008. L&apos;assenza della nomina comporta l&apos;arresto
              fino a 4 mesi per il Datore di Lavoro (art. 55 c. 5 lett. d).
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {HEALTH_DOCUMENTS_CATALOG.map((def) => {
                const doc = getExistingDoc(def.id, def.name);
                const currentStatus: InspectionDocumentStatus = doc?.status || "not_available";
                const meta = parseDocumentExtraMeta(doc?.note);
                const isMinExpanded = Boolean(expandedMinContents[def.id]);

                return (
                  <div
                    key={def.id}
                    style={{
                      border: "1px solid #cbd5e1",
                      borderRadius: 6,
                      padding: 14,
                      background: currentStatus === "viewed_on_site" ? "#f0fdf4" : "#ffffff",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <strong style={{ fontSize: "0.95rem" }}>{def.name}</strong>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              background: "#fee2e2",
                              color: "#991b1b",
                              padding: "2px 6px",
                              borderRadius: 4,
                              fontWeight: 600,
                            }}
                          >
                            {def.sanction.liableSubject}: {def.sanction.sanctionType.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: 4 }}>
                          Rif. Normativo: <strong>{def.normReference}</strong>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 2 }}>
                          {def.description}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#b91c1c", marginTop: 4, fontWeight: 500 }}>
                          ⚠️ Sanzione: {def.sanction.description}
                        </div>
                      </div>

                      {/* Selettore Stato Documento */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 190 }}>
                        <select
                          value={currentStatus}
                          disabled={isInspectionValidated}
                          onChange={(e) =>
                            handleUpdateHealthDocStatus(
                              def,
                              e.target.value as InspectionDocumentStatus,
                              meta.issueDate,
                              meta.expiryDate,
                            )
                          }
                          style={{
                            padding: "6px 8px",
                            borderRadius: 4,
                            border: "1px solid #94a3b8",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                          }}
                        >
                          <option value="viewed_on_site">✅ Visionato in sede</option>
                          <option value="requested_later">⏳ Richiesto in differita</option>
                          <option value="not_available">❌ Non disponibile</option>
                          <option value="not_applicable">⚪ Non applicabile</option>
                        </select>

                        {/* Date Rilascio / Scadenza / Conformità Formale */}
                        {def.id === "doc-hlt-01" || def.id === "doc-hlt-06" ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <input
                              type="date"
                              title="Data Nomina / Verbale"
                              value={meta.issueDate || ""}
                              disabled={isInspectionValidated}
                              onChange={(e) =>
                                handleUpdateHealthDocStatus(def, currentStatus, e.target.value, undefined)
                              }
                              style={{ padding: "3px 4px", fontSize: "0.75rem", border: "1px solid #cbd5e1", borderRadius: 4, width: "100%" }}
                            />
                            <span style={{ fontSize: "10px", color: "#166534", backgroundColor: "#dcfce7", padding: "1px 5px", borderRadius: 3, fontWeight: 600 }}>
                              🛡️ Conformità formale permanente (senza scadenza)
                            </span>
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <div style={{ display: "flex", gap: 6, fontSize: "0.75rem" }}>
                              <input
                                type="date"
                                title="Data Rilascio / Stipula / Riesame"
                                value={meta.issueDate || ""}
                                disabled={isInspectionValidated}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const exp = (def.id === "doc-hlt-02" || def.id === "doc-hlt-04")
                                    ? (val ? addMonthsToYmd(val, 12) : meta.expiryDate)
                                    : meta.expiryDate;
                                  handleUpdateHealthDocStatus(def, currentStatus, val, exp);
                                }}
                                style={{ padding: "3px 4px", fontSize: "0.75rem", border: "1px solid #cbd5e1", borderRadius: 4, width: "50%" }}
                              />
                              <input
                                type="date"
                                title={def.id === "doc-hlt-02" ? "Data Scadenza (Riesame Annuale +12m)" : "Data Scadenza / Prossimo Rinnovo"}
                                value={meta.expiryDate || ""}
                                disabled={isInspectionValidated}
                                onChange={(e) =>
                                  handleUpdateHealthDocStatus(def, currentStatus, meta.issueDate, e.target.value)
                                }
                                style={{
                                  padding: "3px 4px",
                                  fontSize: "0.75rem",
                                  border: meta.expiryDate && meta.expiryDate < todayYmd ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                  backgroundColor: meta.expiryDate && meta.expiryDate < todayYmd ? "#fef2f2" : "#fff",
                                  color: meta.expiryDate && meta.expiryDate < todayYmd ? "#dc2626" : undefined,
                                  fontWeight: meta.expiryDate && meta.expiryDate < todayYmd ? 600 : undefined,
                                  borderRadius: 4,
                                  width: "50%",
                                }}
                              />
                            </div>
                            {def.id === "doc-hlt-02" && (
                              <span style={{ fontSize: "10px", color: "#475569" }}>
                                Riesame annuale automatico (+12 mesi)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Banner Sanzionabile Protocollo Sanitario Scaduto */}
                    {def.id === "doc-hlt-02" && meta.expiryDate && meta.expiryDate < todayYmd && (
                      <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, backgroundColor: "#fee2e2", border: "1px solid #f87171", color: "#991b1b", fontSize: "11px", fontWeight: 700 }}>
                        🚨 NON CONFORMITÀ SANZIONABILE: Protocollo Sanitario scaduto per mancato riesame annuale (art. 25 c. 1 lett. b / art. 58 c. 1 lett. c D.Lgs. 81/08: arresto fino a 2 mesi o ammenda da 460,70 € a 1.842,78 €)
                      </div>
                    )}

                    {/* Banner Sanzionabile Sopralluogo MC Scaduto */}
                    {def.id === "doc-hlt-04" && meta.expiryDate && meta.expiryDate < todayYmd && (
                      <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, backgroundColor: "#fee2e2", border: "1px solid #f87171", color: "#991b1b", fontSize: "11px", fontWeight: 700 }}>
                        🚨 NON CONFORMITÀ SANZIONABILE: Sopralluogo annuale dei luoghi di lavoro scaduto (art. 25 c. 1 lett. l / art. 58 c. 1 lett. a D.Lgs. 81/08: arresto fino a 3 mesi o ammenda da 491,41 € a 1.965,63 €)
                      </div>
                    )}

                    {/* Espansione Contenuti Minimi */}
                    <div style={{ marginTop: 8 }}>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedMinContents((prev) => ({
                            ...prev,
                            [def.id]: !prev[def.id],
                          }))
                        }
                        style={{
                          background: "none",
                          border: "none",
                          color: "#2563eb",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          padding: 0,
                          textDecoration: "underline",
                        }}
                      >
                        {isMinExpanded ? "Nascondi contenuti minimi di legge" : "Mostra contenuti minimi di legge"}
                      </button>

                      {isMinExpanded && (
                        <div
                          style={{
                            marginTop: 8,
                            padding: 10,
                            borderRadius: 4,
                            background: "#f8fafc",
                            border: "1px dashed #cbd5e1",
                            fontSize: "0.8rem",
                          }}
                        >
                          <strong style={{ display: "block", marginBottom: 6 }}>Contenuti minimi obbligatori:</strong>
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {def.minimumContents.map((mc) => (
                              <li key={mc.id} style={{ marginBottom: 4 }}>
                                {mc.label} <em style={{ color: "#64748b" }}>({mc.normArticle})</em>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2) ACCORDION: PROTOCOLLO SANITARIO AZIENDALE                          */}
      {/* -------------------------------------------------------------------- */}
      <div
        className="card accordion-section"
        style={{
          border: "1px solid var(--color-border, #e2e8f0)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => toggleSection("protocol")}
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "var(--color-surface, #f8fafc)",
            border: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "1rem",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>🔬</span>
            <span>2. Protocollo Sanitario Aziendale (Accertamenti per Mansione & Rischio)</span>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: 4,
                background: "#fef3c7",
                color: "#b45309",
              }}
            >
              {suggestedProtocols.length} Esami suggeriti ATECO
            </span>
          </div>
          <span>{openSections.protocol ? "▲ Chiudi" : "▼ Espandi"}</span>
        </button>

        {openSections.protocol && (
          <div style={{ padding: 18, borderTop: "1px solid var(--color-border, #e2e8f0)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <input
                type="text"
                placeholder="Filtra esami per nome o fattore di rischio..."
                value={examSearchQuery}
                onChange={(e) => setExamSearchQuery(e.target.value)}
                style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid #cbd5e1", minWidth: 260 }}
              />
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowAddCustomExamModal(true)}
                disabled={isInspectionValidated}
                style={{ fontSize: "0.85rem", padding: "6px 12px" }}
              >
                + Aggiungi Esame Personalizzato
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {allProtocolItems
                .filter(
                  (item) =>
                    item.name.toLowerCase().includes(examSearchQuery.toLowerCase()) ||
                    item.riskFactor.toLowerCase().includes(examSearchQuery.toLowerCase()),
                )
                .map((item) => {
                  const currentAnswer = protocolAnswers[item.id] || { status: "yes" };
                  const isMissingMandatory = item.isMandatoryByLaw && currentAnswer.status === "no";

                  return (
                    <div
                      key={item.id}
                      style={{
                        border: `1px solid ${isMissingMandatory ? "#f87171" : "#e2e8f0"}`,
                        borderRadius: 6,
                        padding: 12,
                        background: isMissingMandatory ? "#fef2f2" : "#ffffff",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <strong>{item.name}</strong>
                            {item.isMandatoryByLaw ? (
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  background: "#fee2e2",
                                  color: "#991b1b",
                                  fontWeight: 600,
                                }}
                              >
                                🔴 Obbligatorio per Legge
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  background: "#e0f2fe",
                                  color: "#0369a1",
                                  fontWeight: 600,
                                }}
                              >
                                🔵 Consigliato da DVR
                              </span>
                            )}
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                              Cadenza: {item.recommendedFrequencyMonths} mesi
                            </span>
                          </div>

                          <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: 4 }}>
                            Fattore di Rischio: <strong>{item.riskFactor}</strong> • Mansioni:{" "}
                            {item.typicalJobRoles.join(", ")}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 2 }}>
                            Accertamenti tipici: {item.typicalExams.join(" • ")}
                          </div>
                          {item.notes && (
                            <div style={{ fontSize: "0.75rem", color: "#0f766e", marginTop: 2 }}>
                              ℹ️ {item.notes}
                            </div>
                          )}
                        </div>

                        {/* Selettore Previsto nel Protocollo */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 160 }}>
                          <label style={{ fontSize: "0.75rem", fontWeight: 600 }}>Previsto nel protocollo:</label>
                          <select
                            value={currentAnswer.status}
                            disabled={isInspectionValidated}
                            onChange={(e) =>
                              setProtocolAnswers((prev) => ({
                                ...prev,
                                [item.id]: {
                                  ...prev[item.id],
                                  status: e.target.value as "yes" | "no" | "na",
                                },
                              }))
                            }
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              border: `1px solid ${isMissingMandatory ? "#ef4444" : "#94a3b8"}`,
                              fontSize: "0.85rem",
                            }}
                          >
                            <option value="yes">Sì - Previsto</option>
                            <option value="no">No - Assente</option>
                            <option value="na">N.A. - Rischio non presente</option>
                          </select>
                        </div>
                      </div>

                      {/* Alert Omissione Sanzionabile se Obbligatorio e segnato 'No' */}
                      {isMissingMandatory && (
                        <div
                          style={{
                            marginTop: 8,
                            padding: "6px 10px",
                            borderRadius: 4,
                            background: "#fee2e2",
                            border: "1px solid #f87171",
                            color: "#991b1b",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          ⚠️ ATTENZIONE: Questo esame è inderogabile per legge ({item.legalBasis}). L&apos;omissione ingiustificata
                          genera una Non Conformità sanzionabile ex D.Lgs. 81/08 art. 41. Se il rischio è escluso nel DVR, selezionare N.A.
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 3) ACCORDION: CARTELLE SANITARIE & GIUDIZI DI IDONEITA                */}
      {/* -------------------------------------------------------------------- */}
      <div
        className="card accordion-section"
        style={{
          border: "1px solid var(--color-border, #e2e8f0)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => toggleSection("fitnessRecords")}
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "var(--color-surface, #f8fafc)",
            border: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "1rem",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>📁</span>
            <span>3. Cartelle Sanitarie, Giudizi di Idoneità & Ricorsi SPRESAL</span>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: 4,
                background: "#e2e8f0",
                color: "#334155",
              }}
            >
              {internalEmployees.length} Lavoratori Censiti
            </span>
          </div>
          <span>{openSections.fitnessRecords ? "▲ Chiudi" : "▼ Espandi"}</span>
        </button>

        {openSections.fitnessRecords && (
          <div style={{ padding: 18, borderTop: "1px solid var(--color-border, #e2e8f0)" }}>
            {/* Box Disciplinare Custodia Cartelle Sanitarie */}
            <div
              style={{
                padding: 14,
                borderRadius: 6,
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                marginBottom: 16,
              }}
            >
              <h4 style={{ margin: "0 0 8px 0", fontSize: "0.95rem" }}>
                🔒 Modalità di Custodia delle Cartelle Sanitarie (art. 25 c. 1 lett. c & GDPR)
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Luogo di Custodia concordato:</label>
                  <select
                    value={custodyConfig.location}
                    disabled={isInspectionValidated}
                    onChange={(e) =>
                      setCustodyConfig((prev) => ({
                        ...prev,
                        location: e.target.value as "company_premises" | "doctor_office",
                      }))
                    }
                    style={{ width: "100%", padding: "6px", borderRadius: 4, border: "1px solid #94a3b8", fontSize: "0.85rem", marginTop: 4 }}
                  >
                    <option value="company_premises">Presso la sede aziendale (Armadio riservato al MC)</option>
                    <option value="doctor_office">Presso lo studio / struttura del Medico Competente</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Modalità di Archiviazione & Protezione:</label>
                  <select
                    value={custodyConfig.storageType}
                    disabled={isInspectionValidated}
                    onChange={(e) =>
                      setCustodyConfig((prev) => ({
                        ...prev,
                        storageType: e.target.value as "locked_cabinet" | "encrypted_digital",
                      }))
                    }
                    style={{ width: "100%", padding: "6px", borderRadius: 4, border: "1px solid #94a3b8", fontSize: "0.85rem", marginTop: 4 }}
                  >
                    <option value="locked_cabinet">Cartacea in armadio chiuso a chiave ad accesso esclusivo del MC</option>
                    <option value="encrypted_digital">Digitale cifrata con credenziali univoche protette (art. 53)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tabella Monitoraggio Idoneità Lavoratori */}
            <h4 style={{ margin: "0 0 8px 0", fontSize: "0.95rem" }}>Registro Idoneità Lavoratori</h4>

            {expiredWorkersCount > 0 && (
              <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 8, backgroundColor: "#fee2e2", border: "1px solid #ef4444", color: "#991b1b", fontSize: "0.85rem", fontWeight: 700 }}>
                🚨 ATTENZIONE: Rilevate {expiredWorkersCount} idoneità sanitarie scadute! L&apos;adibizione di lavoratori a mansioni senza idoneità in corso di validità costituisce reato contravvenzionale sanzionato con ammenda da 1.228,52 € a 5.528,35 € (art. 18 c. 1 lett. c e art. 55 c. 5 lett. e D.Lgs. 81/08).
              </div>
            )}

            {internalEmployees.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                Nessun dipendente registrato in anagrafica aziendale. Censire i lavoratori nello Step Formazione o Anagrafica.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #cbd5e1" }}>Lavoratore</th>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #cbd5e1" }}>Mansione</th>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #cbd5e1" }}>Data Ultima Visita</th>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #cbd5e1" }}>Periodicità Visita</th>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #cbd5e1" }}>Scadenza Idoneità</th>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #cbd5e1" }}>Giudizio Rilasciato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {internalEmployees.map((emp) => {
                      const empState = employeeFitnessState[emp.id] || { status: "idoneo", periodicityMonths: 12 };
                      const periodicity = empState.periodicityMonths || 12;
                      const isExpired = Boolean(empState.expiryDate && empState.expiryDate < todayYmd && empState.status !== "da_visitare");

                      return (
                        <tr
                          key={emp.id}
                          style={{
                            borderBottom: "1px solid #e2e8f0",
                            backgroundColor: isExpired ? "#fef2f2" : undefined,
                          }}
                        >
                          <td style={{ padding: "8px 10px", fontWeight: 500 }}>
                            <div>{emp.firstName} {emp.lastName}</div>
                            {emp.fiscalCode && <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{emp.fiscalCode}</div>}
                            {isExpired && (
                              <div style={{ marginTop: 4, fontSize: "0.75rem", color: "#dc2626", fontWeight: 700 }}>
                                🚨 NC SANZIONABILE: Idoneità scaduta ex art. 18 c. 1 lett. c D.Lgs. 81/08 (ammenda art. 55 c. 5 lett. e: da 1.228 € a 5.528 €)
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "8px 10px" }}>{emp.role || emp.department || "Dipendente"}</td>
                          <td style={{ padding: "8px 10px" }}>
                            <input
                              type="date"
                              value={empState.examDate || ""}
                              disabled={isInspectionValidated}
                              onChange={(e) => {
                                const examVal = e.target.value;
                                setEmployeeFitnessState((prev) => {
                                  const cur = prev[emp.id] || { status: "idoneo", periodicityMonths: 12 };
                                  const p = cur.periodicityMonths || 12;
                                  const computedExp = examVal ? addMonthsToYmd(examVal, p) : cur.expiryDate;
                                  return {
                                    ...prev,
                                    [emp.id]: {
                                      ...cur,
                                      examDate: examVal,
                                      expiryDate: computedExp,
                                    },
                                  };
                                });
                              }}
                              style={{ padding: "4px", fontSize: "0.8rem", border: "1px solid #cbd5e1", borderRadius: 4 }}
                            />
                          </td>
                          <td style={{ padding: "8px 10px" }}>
                            <select
                              value={periodicity}
                              disabled={isInspectionValidated}
                              onChange={(e) => {
                                const p = Number(e.target.value);
                                setEmployeeFitnessState((prev) => {
                                  const cur = prev[emp.id] || { status: "idoneo" };
                                  const computedExp = cur.examDate ? addMonthsToYmd(cur.examDate, p) : cur.expiryDate;
                                  return {
                                    ...prev,
                                    [emp.id]: {
                                      ...cur,
                                      periodicityMonths: p,
                                      expiryDate: computedExp,
                                    },
                                  };
                                });
                              }}
                              style={{ padding: "4px 6px", fontSize: "0.8rem", borderRadius: 4, border: "1px solid #cbd5e1" }}
                            >
                              <option value={12}>12 Mesi (Standard - Rischi generici/chimico/MMC)</option>
                              <option value={24}>24 Mesi (Biennale - VDT &gt; 50 anni / con prescrizioni)</option>
                              <option value={60}>60 Mesi (Quinquennale - VDT &lt; 50 anni)</option>
                            </select>
                          </td>
                          <td style={{ padding: "8px 10px" }}>
                            <input
                              type="date"
                              value={empState.expiryDate || ""}
                              disabled={isInspectionValidated}
                              onChange={(e) =>
                                setEmployeeFitnessState((prev) => ({
                                  ...prev,
                                  [emp.id]: { ...prev[emp.id], expiryDate: e.target.value },
                                }))
                              }
                              style={{
                                padding: "4px",
                                fontSize: "0.8rem",
                                border: isExpired ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                backgroundColor: isExpired ? "#fee2e2" : "#fff",
                                color: isExpired ? "#991b1b" : undefined,
                                fontWeight: isExpired ? 700 : undefined,
                                borderRadius: 4,
                              }}
                            />
                          </td>
                          <td style={{ padding: "8px 10px" }}>
                            <select
                              value={empState.status}
                              disabled={isInspectionValidated}
                              onChange={(e) =>
                                setEmployeeFitnessState((prev) => ({
                                  ...prev,
                                  [emp.id]: {
                                    ...prev[emp.id],
                                    status: e.target.value as any,
                                  },
                                }))
                              }
                              style={{ padding: "4px 8px", fontSize: "0.8rem", borderRadius: 4, border: "1px solid #cbd5e1" }}
                            >
                              <option value="idoneo">✅ Idoneo</option>
                              <option value="idoneo_parziale">⚠️ Idoneo con prescrizioni/limitazioni</option>
                              <option value="inidoneo_temporaneo">⏳ Inidoneo temporaneo</option>
                              <option value="inidoneo_permanente">❌ Inidoneo permanente</option>
                              <option value="da_visitare">⚪ Da sottoporre a visita</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sezione Gestione Ricorsi SPRESAL / ASL */}
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px dashed #cbd5e1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h4 style={{ margin: 0, fontSize: "0.95rem" }}>
                  ⚖️ Ricorsi Avversi ai Giudizi di Idoneità (ex art. 41 c. 9 D.Lgs. 81/08)
                </h4>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowAddAppealModal(true)}
                  disabled={isInspectionValidated}
                  style={{ fontSize: "0.8rem", padding: "4px 10px" }}
                >
                  + Registra Ricorso SPRESAL
                </button>
              </div>
              <p style={{ margin: "0 0 10px 0", fontSize: "0.8rem", color: "#64748b" }}>
                I ricorsi possono essere presentati dal lavoratore o dal datore di lavoro all&apos;organo di vigilanza entro il termine perentorio di 30 giorni dalla data di comunicazione del giudizio.
              </p>

              {appealsList.length === 0 ? (
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontStyle: "italic" }}>
                  Nessun ricorso pendente o archiviato registrato per questo sopralluogo.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {appealsList.map((appeal) => (
                    <div
                      key={appeal.id}
                      style={{
                        padding: 10,
                        borderRadius: 4,
                        border: "1px solid #cbd5e1",
                        background: "#f8fafc",
                        fontSize: "0.85rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong>{appeal.workerFullName}</strong> • Presentato il: {appeal.appealDate} • Organo: {appeal.spresalAuthority}
                        {appeal.notes && <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Note: {appeal.notes}</div>}
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontWeight: 600,
                          background: appeal.appealStatus === "confirmed" ? "#dcfce7" : "#fef3c7",
                          color: appeal.appealStatus === "confirmed" ? "#166534" : "#92400e",
                        }}
                      >
                        {appeal.appealStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4) ACCORDION: TUTELE SPECIALI MADRI & MINORI                         */}
      {/* -------------------------------------------------------------------- */}
      <div
        className="card accordion-section"
        style={{
          border: "1px solid var(--color-border, #e2e8f0)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => toggleSection("specialProtections")}
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "var(--color-surface, #f8fafc)",
            border: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "1rem",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>🛡️</span>
            <span>4. Tutele Speciali: Lavoratrici Madri & Minori</span>
            {protectedDetection.hasFemaleWorkers || protectedDetection.hasMinorWorkers ? (
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: "#fee2e2",
                  color: "#991b1b",
                }}
              >
                Attivo e Rilevato
              </span>
            ) : (
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: "#f1f5f9",
                  color: "#64748b",
                }}
              >
                Nessuna figura rilevata
              </span>
            )}
          </div>
          <span>{openSections.specialProtections ? "▲ Chiudi" : "▼ Espandi"}</span>
        </button>

        {openSections.specialProtections && (
          <div style={{ padding: 18, borderTop: "1px solid var(--color-border, #e2e8f0)" }}>
            <p style={{ margin: "0 0 14px 0", fontSize: "0.9rem", color: "var(--color-text-muted, #64748b)" }}>
              Sezioni condizionali attivate automaticamente per categorie tutelate da norme inderogabili.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SPECIAL_PROTECTIONS_CATALOG.map((prot) => {
                const isApplicable =
                  prot.group === "maternita_d_lgs_151_01"
                    ? protectedDetection.hasFemaleWorkers
                    : protectedDetection.hasMinorWorkers;

                return (
                  <div
                    key={prot.id}
                    style={{
                      border: `1px solid ${isApplicable ? "#fbcfe8" : "#e2e8f0"}`,
                      borderRadius: 6,
                      padding: 14,
                      background: isApplicable ? "#fff5f7" : "#f8fafc",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <strong style={{ fontSize: "0.95rem" }}>{prot.title}</strong>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              padding: "2px 6px",
                              borderRadius: 4,
                              background: isApplicable ? "#f43f5e" : "#94a3b8",
                              color: "#ffffff",
                              fontWeight: 600,
                            }}
                          >
                            {isApplicable ? "Applicabile per l'azienda" : "Non rilevato in anagrafica"}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: 4 }}>
                          Rif. Normativo: <strong>{prot.normReference}</strong>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 2 }}>
                          {prot.description}
                        </div>
                      </div>
                    </div>

                    {/* Misure obbligatorie */}
                    <div style={{ marginTop: 10, padding: 10, borderRadius: 4, background: "#ffffff", border: "1px solid #cbd5e1" }}>
                      <strong style={{ fontSize: "0.8rem", display: "block", marginBottom: 6 }}>
                        Misure obbligatorie da verificare nel sopralluogo:
                      </strong>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.8rem" }}>
                        {prot.mandatoryMeasures.map((measure, idx) => (
                          <li key={idx} style={{ marginBottom: 4 }}>
                            {measure}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* MODALE AGGIUNTA ESAME PERSONALIZZATO                                 */}
      {/* -------------------------------------------------------------------- */}
      {showAddCustomExamModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 8,
              padding: 24,
              maxWidth: 500,
              width: "90%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <h3 style={{ margin: 0 }}>Aggiungi Esame Sanitario Personalizzato</h3>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Nome Accertamento / Esame:</label>
              <input
                type="text"
                placeholder="Es. Monitoraggio biologico piombo / Elettrocardiogramma"
                value={customExamName}
                onChange={(e) => setCustomExamName(e.target.value)}
                style={{ width: "100%", padding: "6px", borderRadius: 4, border: "1px solid #cbd5e1", marginTop: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Fattore di Rischio associato:</label>
              <input
                type="text"
                placeholder="Es. Esposizione a polveri speciali / Rumore"
                value={customExamRisk}
                onChange={(e) => setCustomExamRisk(e.target.value)}
                style={{ width: "100%", padding: "6px", borderRadius: 4, border: "1px solid #cbd5e1", marginTop: 4 }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Periodicità (mesi):</label>
                <input
                  type="number"
                  value={customExamFrequency}
                  onChange={(e) => setCustomExamFrequency(parseInt(e.target.value, 10) || 12)}
                  style={{ width: "100%", padding: "6px", borderRadius: 4, border: "1px solid #cbd5e1", marginTop: 4 }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Mansione Bersaglio:</label>
                <input
                  type="text"
                  placeholder="Es. Operatore sabbiatura"
                  value={customExamJobRole}
                  onChange={(e) => setCustomExamJobRole(e.target.value)}
                  style={{ width: "100%", padding: "6px", borderRadius: 4, border: "1px solid #cbd5e1", marginTop: 4 }}
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Riferimento Normativo:</label>
              <input
                type="text"
                value={customExamLegalBasis}
                onChange={(e) => setCustomExamLegalBasis(e.target.value)}
                style={{ width: "100%", padding: "6px", borderRadius: 4, border: "1px solid #cbd5e1", marginTop: 4 }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <input
                type="checkbox"
                id="customMandatoryCheck"
                checked={customExamIsMandatory}
                onChange={(e) => setCustomExamIsMandatory(e.target.checked)}
              />
              <label htmlFor="customMandatoryCheck" style={{ fontSize: "0.85rem" }}>
                Obbligatorio per Legge (genera NC sanzionabile se omesso)
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button type="button" className="secondary-btn" onClick={() => setShowAddCustomExamModal(false)}>
                Annulla
              </button>
              <button type="button" className="btn-primary" onClick={handleCreateCustomExam}>
                Aggiungi Esame
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* MODALE AGGIUNTA RICORSO SPRESAL                                      */}
      {/* -------------------------------------------------------------------- */}
      {showAddAppealModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 8,
              padding: 24,
              maxWidth: 480,
              width: "90%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <h3 style={{ margin: 0 }}>Registra Ricorso SPRESAL (art. 41 c. 9)</h3>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Nominativo Lavoratore ricorrente:</label>
              <input
                type="text"
                placeholder="Nome e cognome lavoratore"
                value={appealWorkerName}
                onChange={(e) => setAppealWorkerName(e.target.value)}
                style={{ width: "100%", padding: "6px", borderRadius: 4, border: "1px solid #cbd5e1", marginTop: 4 }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Data Ricorso:</label>
                <input
                  type="date"
                  value={appealDate}
                  onChange={(e) => setAppealDate(e.target.value)}
                  style={{ width: "100%", padding: "6px", borderRadius: 4, border: "1px solid #cbd5e1", marginTop: 4 }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Stato del Ricorso:</label>
                <select
                  value={appealStatus}
                  onChange={(e) => setAppealStatus(e.target.value as any)}
                  style={{ width: "100%", padding: "6px", borderRadius: 4, border: "1px solid #cbd5e1", marginTop: 4 }}
                >
                  <option value="submitted">Inoltrato / Pendente</option>
                  <option value="in_review">In istruttoria commissione</option>
                  <option value="confirmed">Confermato giudizio MC</option>
                  <option value="modified">Modificato con prescrizioni</option>
                  <option value="revoked">Revocato giudizio MC</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Organo ASL/SPRESAL competente:</label>
              <input
                type="text"
                placeholder="Es. ASL Roma 1 - UOC SPRESAL"
                value={appealSpresal}
                onChange={(e) => setAppealSpresal(e.target.value)}
                style={{ width: "100%", padding: "6px", borderRadius: 4, border: "1px solid #cbd5e1", marginTop: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Note e Protocollo:</label>
              <textarea
                rows={2}
                placeholder="Protocollo ricorso o motivazione"
                value={appealNotes}
                onChange={(e) => setAppealNotes(e.target.value)}
                style={{ width: "100%", padding: "6px", borderRadius: 4, border: "1px solid #cbd5e1", marginTop: 4 }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button type="button" className="secondary-btn" onClick={() => setShowAddAppealModal(false)}>
                Annulla
              </button>
              <button type="button" className="btn-primary" onClick={handleCreateAppeal}>
                Salva Ricorso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
