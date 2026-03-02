import { useEffect, useMemo, useState } from "react";
import {
  ChecklistItem,
  ChecklistTemplate,
  Company,
  Inspection,
  InspectionDocumentRequirement,
  InspectionSummary,
  createCompany,
  createInspection,
  fetchChecklistItems,
  fetchChecklistTemplates,
  fetchInspectionDocumentRequirements,
  fetchInspectionSummary,
  generateAttestatoPdf,
  generateInspectionReportPdf,
  saveInspectionAnswers,
  sendInspectionToAdmin,
  upsertInspectionDocuments,
  validateInspection,
} from "../api";
import { queueSyncEvent } from "../services/syncManager";

interface ChecklistPageProps {
  token: string;
  user: {
    role: "junior" | "senior" | "admin";
  };
  companies: Company[];
  inspections: Inspection[];
  initialCompanyId?: string;
  initialInspectionId?: string;
  selectionToken?: number;
  onReload: () => Promise<void>;
}

type AnswerValue = "yes" | "no" | "na";

interface LocalAnswer {
  value: AnswerValue;
  note: string;
  severity?: number;
  isSanctionable?: boolean;
}

const STEPS = [
  "1. Dati Azienda",
  "2. Documenti",
  "3. Locali e Attrezzature",
  "4. Procedure e Igiene",
  "5. Riepilogo e Invio",
] as const;

const DOCUMENT_STATUS_OPTIONS: Array<{ value: InspectionDocumentRequirement["status"]; label: string }> = [
  { value: "viewed_on_site", label: "Visionato in sede" },
  { value: "requested_later", label: "Richiesto in differita" },
  { value: "not_available", label: "Non disponibile" },
  { value: "not_applicable", label: "Non applicabile" },
];

const ACTIVITY_TYPE_OPTIONS = [
  { value: "restaurant", label: "Ristorante", atecoCode: "56.10.11" },
  { value: "pizzeria", label: "Pizzeria / Asporto", atecoCode: "56.10.20" },
  { value: "canteen", label: "Mense / Catering", atecoCode: "56.29.10" },
  { value: "event_catering", label: "Catering Eventi", atecoCode: "56.21.00" },
  { value: "food_truck", label: "Food Truck / Street Food", atecoCode: "56.10.42" },
  { value: "ambulant_pastry", label: "Gelateria/Pasticceria Ambulante", atecoCode: "56.10.41" },
  { value: "bar", label: "Bar / Caffetteria", atecoCode: "56.30" },
  { value: "hotel", label: "Hotel / Albergo", atecoCode: "55.10.00" },
  { value: "pastry", label: "Pasticceria / Gelateria", atecoCode: "56.10.30" },
  { value: "custom", label: "Altro (ATECO manuale)", atecoCode: "" },
] as const;

type ActivityTypeOption = (typeof ACTIVITY_TYPE_OPTIONS)[number]["value"];
type ChecklistActivityFilter = "company" | ActivityTypeOption;
type InspectionChecklistMode = "unified" | "haccp_only" | "safety_only";

const CHECKLIST_MODE_OPTIONS: Array<{ value: InspectionChecklistMode; label: string }> = [
  { value: "unified", label: "Checklist unificata (HACCP + Sicurezza)" },
  { value: "haccp_only", label: "Solo HACCP" },
  { value: "safety_only", label: "Solo Sicurezza lavoro" },
];

function checklistModeLabel(mode?: InspectionChecklistMode) {
  return CHECKLIST_MODE_OPTIONS.find((option) => option.value === mode)?.label ?? "Checklist unificata";
}

function atecoFromActivity(activity: ActivityTypeOption): string {
  return ACTIVITY_TYPE_OPTIONS.find((option) => option.value === activity)?.atecoCode ?? "";
}

function defaultAnswer(item: ChecklistItem): LocalAnswer {
  return {
    value: "na",
    note: "",
    severity: item.defaultSeverity,
    isSanctionable: item.defaultSanctionable,
  };
}

export default function ChecklistPage({
  token,
  user,
  companies,
  inspections,
  initialCompanyId,
  initialInspectionId,
  selectionToken,
  onReload,
}: ChecklistPageProps) {
  const [step, setStep] = useState(0);
  const [companyId, setCompanyId] = useState<string>(initialCompanyId ?? companies[0]?.id ?? "");
  const [selectedInspectionId, setSelectedInspectionId] = useState<string>(initialInspectionId ?? "");
  const [title, setTitle] = useState("Sopralluogo Antisanzione");
  const [newInspectionChecklistMode, setNewInspectionChecklistMode] = useState<InspectionChecklistMode>("unified");

  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [allItems, setAllItems] = useState<ChecklistItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({});
  const [documents, setDocuments] = useState<InspectionDocumentRequirement[]>([]);
  const [summary, setSummary] = useState<InspectionSummary | null>(null);
  const [companySearch, setCompanySearch] = useState("");
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyVat, setNewCompanyVat] = useState("");
  const [newCompanyAteco, setNewCompanyAteco] = useState("56.10.11");
  const [newCompanyCity, setNewCompanyCity] = useState("");

  const [checklistActivityFilter, setChecklistActivityFilter] = useState<ChecklistActivityFilter>("company");
  const [customChecklistAteco, setCustomChecklistAteco] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === companyId),
    [companies, companyId],
  );

  const inspectionsForCompany = useMemo(
    () => inspections.filter((inspection) => inspection.companyId === companyId),
    [inspections, companyId],
  );

  const selectedInspection = useMemo(
    () => inspections.find((inspection) => inspection.id === selectedInspectionId),
    [inspections, selectedInspectionId],
  );

  const filteredCompanies = useMemo(() => {
    const query = companySearch.trim().toLowerCase();
    if (!query) return companies;
    return companies.filter((company) => {
      return (
        company.name.toLowerCase().includes(query) ||
        company.vatNumber.toLowerCase().includes(query) ||
        (company.atecoCode?.toLowerCase().includes(query) ?? false) ||
        (company.city?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [companies, companySearch]);

  const effectiveChecklistAteco = useMemo(() => {
    if (checklistActivityFilter === "company") {
      return selectedCompany?.atecoCode;
    }
    if (checklistActivityFilter === "custom") {
      return customChecklistAteco.trim() || undefined;
    }
    return atecoFromActivity(checklistActivityFilter);
  }, [checklistActivityFilter, customChecklistAteco, selectedCompany?.atecoCode]);

  const effectiveChecklistMode = useMemo<InspectionChecklistMode>(
    () => selectedInspection?.checklistMode ?? newInspectionChecklistMode,
    [selectedInspection?.checklistMode, newInspectionChecklistMode],
  );

  const premisesItems = useMemo(
    () => allItems.filter((item) => item.section === "premises_equipment"),
    [allItems],
  );
  const procedureItems = useMemo(
    () => allItems.filter((item) => item.section === "procedures_hygiene"),
    [allItems],
  );

  useEffect(() => {
    if (!companyId && companies[0]) {
      setCompanyId(companies[0].id);
    }
  }, [companies, companyId]);

  useEffect(() => {
    if (!companySearch.trim()) return;
    const firstMatch = filteredCompanies[0];
    if (firstMatch && firstMatch.id !== companyId) {
      setCompanyId(firstMatch.id);
    }
  }, [companySearch, filteredCompanies, companyId]);

  useEffect(() => {
    if (!initialCompanyId) return;
    setCompanyId(initialCompanyId);
  }, [initialCompanyId, selectionToken]);

  useEffect(() => {
    if (!companyId) return;
    const hasCurrentSelection = inspectionsForCompany.some((inspection) => inspection.id === selectedInspectionId);
    if (!hasCurrentSelection) {
      setSelectedInspectionId(inspectionsForCompany[0]?.id ?? "");
    }
  }, [companyId, inspectionsForCompany, selectedInspectionId]);

  useEffect(() => {
    if (selectionToken === undefined) return;
    setSelectedInspectionId(initialInspectionId ?? "");
  }, [initialInspectionId, selectionToken]);

  useEffect(() => {
    setChecklistActivityFilter("company");
    setCustomChecklistAteco("");
  }, [companyId]);

  useEffect(() => {
    async function loadChecklistTemplates() {
      if (!companyId) return;

      const nextTemplates = await fetchChecklistTemplates(token, effectiveChecklistAteco, effectiveChecklistMode);
      setTemplates(nextTemplates);

      const loadedItems = await Promise.all(
        nextTemplates.map((template) => fetchChecklistItems(token, template.id, effectiveChecklistMode)),
      );
      const mergedItems = loadedItems.flatMap((entry) => entry.items);
      setAllItems(mergedItems);

      const initialAnswers: Record<string, LocalAnswer> = {};
      for (const item of mergedItems) {
        initialAnswers[item.id] = defaultAnswer(item);
      }

      const existingAnswers = selectedInspection?.answers ?? [];
      for (const existing of existingAnswers) {
        if (!initialAnswers[existing.checklistItemId]) continue;
        initialAnswers[existing.checklistItemId] = {
          value: existing.value,
          note: existing.note ?? "",
          severity: existing.severity ?? initialAnswers[existing.checklistItemId].severity,
          isSanctionable: existing.isSanctionable ?? initialAnswers[existing.checklistItemId].isSanctionable,
        };
      }

      setAnswers(initialAnswers);
    }

    loadChecklistTemplates().catch((error) => {
      setMessage(`Errore caricamento checklist: ${error instanceof Error ? error.message : "errore"}`);
    });
  }, [token, companyId, effectiveChecklistAteco, effectiveChecklistMode, selectedInspection?.answers]);

  useEffect(() => {
    async function loadDocumentsAndSummary() {
      if (!selectedInspectionId) {
        setDocuments([]);
        setSummary(null);
        return;
      }

      const [requirements, nextSummary] = await Promise.all([
        fetchInspectionDocumentRequirements(token, selectedInspectionId),
        fetchInspectionSummary(token, selectedInspectionId),
      ]);
      setDocuments(requirements);
      setSummary(nextSummary);
    }

    loadDocumentsAndSummary().catch((error) => {
      setMessage(`Errore caricamento dettaglio sopralluogo: ${error instanceof Error ? error.message : "errore"}`);
    });
  }, [token, selectedInspectionId]);

  function updateAnswer(itemId: string, partial: Partial<LocalAnswer>) {
    setAnswers((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        ...partial,
      },
    }));
  }

  async function handleCreateCompany() {
    if (!newCompanyName.trim() || !newCompanyVat.trim()) {
      setMessage("Inserisci almeno ragione sociale e partita IVA.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const created = await createCompany(token, {
        name: newCompanyName.trim(),
        vatNumber: newCompanyVat.trim(),
        atecoCode: newCompanyAteco.trim() || undefined,
        city: newCompanyCity.trim() || undefined,
      });
      queueSyncEvent({
        eventType: "company.created",
        entityType: "company",
        entityId: created.id,
        payload: created,
      });
      await onReload();
      setCompanyId(created.id);
      setCompanySearch(created.name);
      setNewCompanyName("");
      setNewCompanyVat("");
      setNewCompanyAteco("56.10.11");
      setNewCompanyCity("");
      setMessage("Nuovo cliente registrato.");
    } catch (error) {
      setMessage(`Errore creazione azienda: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateInspection() {
    if (!companyId) {
      setMessage("Seleziona un'azienda prima di creare il sopralluogo.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const created = await createInspection(token, {
        companyId,
        title,
        checklistMode: newInspectionChecklistMode,
      });
      queueSyncEvent({
        eventType: "inspection.created",
        entityType: "inspection",
        entityId: created.id,
        payload: { companyId, title, checklistMode: newInspectionChecklistMode },
      });
      await onReload();
      setSelectedInspectionId(created.id);
      setStep(1);
      setMessage("Sopralluogo creato. Procedi con i documenti.");
    } catch (error) {
      setMessage(`Errore creazione sopralluogo: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setLoading(false);
    }
  }

  async function saveDocuments() {
    if (!selectedInspectionId || documents.length === 0) return;
    await upsertInspectionDocuments(token, selectedInspectionId, documents);
    queueSyncEvent({
      eventType: "inspection.documents.saved",
      entityType: "inspection",
      entityId: selectedInspectionId,
      payload: { documentsCount: documents.length },
    });
  }

  async function saveAnswers() {
    if (!selectedInspectionId) return;

    const payload = Object.entries(answers).map(([checklistItemId, answer]) => ({
      checklistItemId,
      value: answer.value,
      note: answer.note || undefined,
      severity: answer.severity,
      isSanctionable: answer.value === "no" ? answer.isSanctionable : undefined,
    }));

    await saveInspectionAnswers(token, selectedInspectionId, payload);
    queueSyncEvent({
      eventType: "inspection.answers.saved",
      entityType: "inspection",
      entityId: selectedInspectionId,
      payload: { answersCount: payload.length },
    });
  }

  async function handleSaveChecklist() {
    if (!selectedInspectionId) {
      setMessage("Crea o seleziona prima un sopralluogo.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await Promise.all([saveDocuments(), saveAnswers()]);
      const refreshedSummary = await fetchInspectionSummary(token, selectedInspectionId);
      setSummary(refreshedSummary);
      setMessage("Checklist salvata. Riepilogo aggiornato.");
    } catch (error) {
      setMessage(`Errore salvataggio checklist: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendToAdmin() {
    if (!selectedInspectionId) return;
    setLoading(true);
    setMessage("");
    try {
      await Promise.all([saveDocuments(), saveAnswers()]);
      await sendInspectionToAdmin(token, selectedInspectionId);
      queueSyncEvent({
        eventType: "inspection.sent_to_admin",
        entityType: "inspection",
        entityId: selectedInspectionId,
        payload: {},
      });
      setMessage("Checklist inviata all'amministrazione per generazione preventivo.");
    } catch (error) {
      setMessage(`Errore invio amministrazione: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleValidateInspection() {
    if (!selectedInspectionId) return;
    if (user.role === "junior") {
      setMessage("Un utente junior non puo validare il sopralluogo.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await validateInspection(token, {
        inspectionId: selectedInspectionId,
        approved: true,
      });
      await onReload();
      setMessage("Sopralluogo validato con successo.");
    } catch (error) {
      setMessage(`Errore validazione: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateVerbale() {
    if (!selectedInspectionId) return;
    setLoading(true);
    setMessage("");
    try {
      await Promise.all([saveDocuments(), saveAnswers()]);
      await generateInspectionReportPdf(token, selectedInspectionId);
      queueSyncEvent({
        eventType: "document.generated",
        entityType: "inspection",
        entityId: selectedInspectionId,
        payload: { kind: "inspection_report" },
      });
      setMessage("Verbale cliente generato con KPI e To-Do.");
    } catch (error) {
      setMessage(`Errore generazione verbale: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateAttestato() {
    if (!selectedInspectionId) return;
    setLoading(true);
    setMessage("");
    try {
      await generateAttestatoPdf(token, selectedInspectionId);
      queueSyncEvent({
        eventType: "document.generated",
        entityType: "inspection",
        entityId: selectedInspectionId,
        payload: { kind: "attestato" },
      });
      setMessage("Attestato compliance generato.");
    } catch (error) {
      setMessage(`Attestato non generato: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setLoading(false);
    }
  }

  function renderAnswersTable(items: ChecklistItem[]) {
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Area</th>
              <th>Requisito</th>
              <th>Esito</th>
              <th>Note</th>
              <th>Gravita</th>
              <th>Sanzionabile</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const answer = answers[item.id] ?? defaultAnswer(item);
              return (
                <tr key={item.id}>
                  <td>{item.area}</td>
                  <td>{item.question}</td>
                  <td>
                    <select
                      value={answer.value}
                      onChange={(event) => updateAnswer(item.id, { value: event.target.value as AnswerValue })}
                    >
                      <option value="yes">SI</option>
                      <option value="no">NO</option>
                      <option value="na">NA</option>
                    </select>
                  </td>
                  <td>
                    <input value={answer.note} onChange={(event) => updateAnswer(item.id, { note: event.target.value })} />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={answer.severity ?? 1}
                      onChange={(event) => updateAnswer(item.id, { severity: Number(event.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={Boolean(answer.isSanctionable)}
                      disabled={answer.value !== "no"}
                      onChange={(event) => updateAnswer(item.id, { isSanctionable: event.target.checked })}
                    />
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={6}>Nessun requisito disponibile.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section className="panel checklist-panel">
      <h2>Checklist Ho.Re.Ca guidata</h2>

      <div className="stepper">
        {STEPS.map((label, index) => (
          <button
            key={label}
            className={`stepper-item ${index === step ? "stepper-item-active" : ""}`}
            onClick={() => setStep(index)}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Ricerca cliente</label>
        <input
          value={companySearch}
          onChange={(event) => setCompanySearch(event.target.value)}
          placeholder="Cerca per ragione sociale, P.IVA, ATECO o citta"
        />
        <div className="footer-actions" style={{ marginTop: 8 }}>
          <button onClick={() => setShowNewCompanyForm((current) => !current)} disabled={loading}>
            {showNewCompanyForm ? "Chiudi registrazione cliente" : "Registra nuovo cliente"}
          </button>
        </div>
        {filteredCompanies.length === 0 ? (
          <p className="status-message">Nessun cliente trovato.</p>
        ) : (
          <p className="status-message">Cliente attivo: {selectedCompany?.name ?? filteredCompanies[0]?.name}</p>
        )}
      </div>

      {showNewCompanyForm && (
        <div className="panel section-panel">
          <h3>Registra nuovo cliente</h3>
          <div className="grid-two">
            <div>
              <label>Ragione sociale</label>
              <input value={newCompanyName} onChange={(event) => setNewCompanyName(event.target.value)} />
            </div>
            <div>
              <label>P.IVA</label>
              <input value={newCompanyVat} onChange={(event) => setNewCompanyVat(event.target.value)} />
            </div>
            <div>
              <label>ATECO</label>
              <input value={newCompanyAteco} onChange={(event) => setNewCompanyAteco(event.target.value)} />
            </div>
            <div>
              <label>Citta</label>
              <input value={newCompanyCity} onChange={(event) => setNewCompanyCity(event.target.value)} />
            </div>
          </div>
          <div className="footer-actions">
            <button onClick={handleCreateCompany} disabled={loading}>
              Conferma nuovo cliente
            </button>
          </div>
        </div>
      )}
      <div className="grid-two" style={{ marginTop: 10 }}>
        <div>
          <label>Tipo attivita checklist</label>
          <select
            value={checklistActivityFilter}
            onChange={(event) => setChecklistActivityFilter(event.target.value as ChecklistActivityFilter)}
          >
            <option value="company">Usa ATECO azienda ({selectedCompany?.atecoCode ?? "non impostato"})</option>
            {ACTIVITY_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} {option.atecoCode ? `(${option.atecoCode})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>ATECO checklist effettivo</label>
          {checklistActivityFilter === "custom" ? (
            <input
              value={customChecklistAteco}
              onChange={(event) => setCustomChecklistAteco(event.target.value)}
              placeholder="Es. 56.30"
            />
          ) : (
            <input value={effectiveChecklistAteco ?? ""} readOnly />
          )}
        </div>
      </div>

      {step === 0 && (
        <div className="panel section-panel">
          <h3>1. Crea sopralluogo</h3>
          <label>Titolo sopralluogo</label>
          <label>Ambito sopralluogo</label>
          <select
            value={newInspectionChecklistMode}
            onChange={(event) => setNewInspectionChecklistMode(event.target.value as InspectionChecklistMode)}
          >
            {CHECKLIST_MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="inline-actions">
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Sopralluogo Antisanzione" />
            <button className="secondary-btn" onClick={handleCreateInspection} disabled={loading}>
              Crea
            </button>
          </div>
          <p className="template-hint">
            Template caricati: {templates.map((template) => template.name).join(" • ") || "nessuno"}
          </p>
        </div>
      )}

      {step === 1 && (
        <div className="panel section-panel">
          <h3>Documenti visionati e richiesti in differita</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Obbl.</th>
                  <th>Stato</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, idx) => (
                  <tr key={`${doc.name}-${idx}`}>
                    <td>{doc.name}</td>
                    <td>{doc.isRequired ? "SI" : "NO"}</td>
                    <td>
                      <select
                        value={doc.status}
                        onChange={(event) => {
                          const nextStatus = event.target.value as InspectionDocumentRequirement["status"];
                          setDocuments((current) =>
                            current.map((item, itemIdx) =>
                              itemIdx === idx
                                ? {
                                    ...item,
                                    status: nextStatus,
                                  }
                                : item,
                            ),
                          );
                        }}
                      >
                        {DOCUMENT_STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        value={doc.note ?? ""}
                        onChange={(event) =>
                          setDocuments((current) =>
                            current.map((item, itemIdx) =>
                              itemIdx === idx
                                ? {
                                    ...item,
                                    note: event.target.value,
                                  }
                                : item,
                            ),
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr>
                    <td colSpan={4}>Seleziona un sopralluogo per caricare la checklist documentale.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="panel section-panel">
          <h3>Requisiti locali e attrezzature</h3>
          {renderAnswersTable(premisesItems)}
        </div>
      )}

      {step === 3 && (
        <div className="panel section-panel">
          <h3>Procedure di lavoro e requisiti igienici</h3>
          {renderAnswersTable(procedureItems)}
        </div>
      )}

      {step === 4 && (
        <div className="panel section-panel">
          <h3>Riepilogo finale</h3>
          {summary ? (
            <div className="kpi-grid">
              <article className="kpi-card">
                <h3>Score compliance</h3>
                <strong>{summary.score}/100</strong>
              </article>
              <article className="kpi-card">
                <h3>FED Stars</h3>
                <strong>
                  {"★".repeat(summary.stars)}
                  {"☆".repeat(5 - summary.stars)}
                </strong>
              </article>
              <article className="kpi-card">
                <h3>NC totali</h3>
                <strong>{summary.totals.nonConformities}</strong>
              </article>
              <article className="kpi-card">
                <h3>NC sanzionabili</h3>
                <strong>{summary.totals.sanctionableNc}</strong>
              </article>
            </div>
          ) : (
            <p>Nessun riepilogo disponibile.</p>
          )}

          <div className={`status-banner ${summary?.attestato.eligible ? "status-banner-ok" : "status-banner-warning"}`}>
            <strong>Attestato:</strong> {summary?.attestato.reason ?? "Salva la checklist per valutare idoneita attestato."}
          </div>

          <div className="footer-actions" style={{ flexWrap: "wrap" }}>
            <button onClick={handleSaveChecklist} disabled={loading || !selectedInspectionId}>
              Salva checklist completa
            </button>
            <button onClick={handleValidateInspection} disabled={loading || !selectedInspectionId || user.role === "junior"}>
              Valida sopralluogo
            </button>
            <button onClick={handleSendToAdmin} disabled={loading || !selectedInspectionId}>
              Invia ad amministrazione
            </button>
            <button onClick={handleGenerateVerbale} disabled={loading || !selectedInspectionId}>
              Genera verbale cliente
            </button>
            <button
              onClick={handleGenerateAttestato}
              disabled={loading || !selectedInspectionId || !summary?.attestato.eligible}
            >
              Genera attestato
            </button>
          </div>
        </div>
      )}

      <div className="footer-actions">
        <button onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
          Indietro
        </button>
        <button onClick={() => setStep((current) => Math.min(STEPS.length - 1, current + 1))} disabled={step === STEPS.length - 1}>
          Avanti
        </button>
        {message ? <span className="status-message">{message}</span> : null}
      </div>
    </section>
  );
}
