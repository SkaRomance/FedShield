import { useEffect, useMemo, useState } from "react";
import {
  Company,
  createCompany,
  downloadGeneratedDocument,
  exportCompaniesCsvDanea,
  generateInspectionChecklistPdf,
  generateNdaPdf,
  Inspection,
  triggerBlobDownload,
  updateCompany,
} from "../api";
import { queueSyncEvent } from "../services/syncManager";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function todayCompactDateClient(): string {
  const now = new Date();
  return `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}`;
}

function slugifyClient(value: string): string {
  return (value || "azienda")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "azienda";
}

interface CustomerRegistryPageProps {
  token: string;
  companies: Company[];
  inspections: Inspection[];
  onReload: () => Promise<void>;
  onUseForInspection: (companyId: string, inspectionId?: string) => void;
}

type CompanyFormState = {
  name: string;
  vatNumber: string;
  legalForm: string;
  reaNumber: string;
  employeesInfo: string;
  email: string;
  pec: string;
  phone: string;
  atecoCode: string;
  riskLevel: string;
  city: string;
  description: string;
  legalAddress: string;
  localUnitAddress: string;
};

function emptyCompanyForm(): CompanyFormState {
  return {
    name: "",
    vatNumber: "",
    legalForm: "",
    reaNumber: "",
    employeesInfo: "",
    email: "",
    pec: "",
    phone: "",
    atecoCode: "56.10.11",
    riskLevel: "",
    city: "",
    description: "",
    legalAddress: "",
    localUnitAddress: "",
  };
}

function companyToForm(company: Company): CompanyFormState {
  return {
    name: company.name ?? "",
    vatNumber: company.vatNumber ?? "",
    legalForm: company.legalForm ?? "",
    reaNumber: company.reaNumber ?? "",
    employeesInfo: company.employeesInfo ?? "",
    email: company.email ?? "",
    pec: company.pec ?? "",
    phone: company.phone ?? "",
    atecoCode: company.atecoCode ?? "",
    riskLevel: company.riskLevel ?? "",
    city: company.city ?? "",
    description: company.description ?? "",
    legalAddress: company.legalAddress ?? "",
    localUnitAddress: company.localUnitAddress ?? "",
  };
}

function optionalText(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function inspectionModeLabel(mode: Inspection["checklistMode"]) {
  if (mode === "haccp_only") return "Solo HACCP";
  if (mode === "safety_only") return "Solo Sicurezza";
  return "Unificata";
}

export default function CustomerRegistryPage({
  token,
  companies,
  inspections,
  onReload,
  onUseForInspection,
}: CustomerRegistryPageProps) {
  const [companyId, setCompanyId] = useState<string>("");
  const [companyQuery, setCompanyQuery] = useState<string>("");
  const [downloadInspectionId, setDownloadInspectionId] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [exportingCsv, setExportingCsv] = useState<boolean>(false);
  const [ndaCompanyId, setNdaCompanyId] = useState<string>("");
  const [editingCompanyId, setEditingCompanyId] = useState<string>("");
  const [companyForm, setCompanyForm] = useState<CompanyFormState>(() => emptyCompanyForm());
  const [savingCompany, setSavingCompany] = useState<boolean>(false);

  const normalizedQuery = useMemo(() => companyQuery.trim().toLowerCase(), [companyQuery]);

  const filteredCompanies = useMemo(() => {
    if (!normalizedQuery) {
      return companies;
    }
    return companies.filter((company) => {
      const name = company.name?.toLowerCase() ?? "";
      const ateco = company.atecoCode?.toLowerCase() ?? "";
      const vat = company.vatNumber?.toLowerCase() ?? "";
      return name.includes(normalizedQuery) || ateco.includes(normalizedQuery) || vat.includes(normalizedQuery);
    });
  }, [companies, normalizedQuery]);

  const companySuggestions = useMemo(() => {
    if (!normalizedQuery) {
      return companies.slice(0, 12);
    }
    const scored = companies
      .map((company) => {
        const name = company.name?.toLowerCase() ?? "";
        if (!name.includes(normalizedQuery)) {
          return null;
        }
        const index = name.indexOf(normalizedQuery);
        return { company, score: index >= 0 ? index : Number.MAX_SAFE_INTEGER };
      })
      .filter((entry): entry is { company: Company; score: number } => Boolean(entry))
      .sort((a, b) => a.score - b.score);
    return scored.slice(0, 12).map((entry) => entry.company);
  }, [companies, normalizedQuery]);

  useEffect(() => {
    if (!companyId) {
      return;
    }
    const selectedExists = companies.some((company) => company.id === companyId);
    if (!selectedExists) {
      setCompanyId("");
    }
  }, [companies, companyId]);

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === companyId),
    [companies, companyId],
  );

  const inspectionsForCompany = useMemo(
    () => inspections.filter((inspection) => inspection.companyId === companyId),
    [inspections, companyId],
  );

  function handleQueryChange(value: string) {
    setCompanyQuery(value);
    const exact = companies.find((company) => company.name?.toLowerCase() === value.trim().toLowerCase());
    if (exact) {
      setCompanyId(exact.id);
    }
  }

  function updateCompanyForm(field: keyof CompanyFormState, value: string) {
    setCompanyForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startNewCompany() {
    setEditingCompanyId("");
    setCompanyForm(emptyCompanyForm());
    setStatusMessage("");
  }

  function editCompany(company: Company) {
    setEditingCompanyId(company.id);
    setCompanyId(company.id);
    setCompanyQuery(company.name ?? "");
    setCompanyForm(companyToForm(company));
    setStatusMessage("");
  }

  async function handleSaveCompany() {
    if (!companyForm.name.trim() || !companyForm.vatNumber.trim()) {
      setStatusMessage("Inserisci almeno ragione sociale e partita IVA.");
      return;
    }

    const payload = {
      name: companyForm.name.trim(),
      vatNumber: companyForm.vatNumber.trim(),
      legalForm: optionalText(companyForm.legalForm),
      reaNumber: optionalText(companyForm.reaNumber),
      employeesInfo: optionalText(companyForm.employeesInfo),
      email: optionalText(companyForm.email),
      pec: optionalText(companyForm.pec),
      phone: optionalText(companyForm.phone),
      atecoCode: optionalText(companyForm.atecoCode),
      riskLevel: optionalText(companyForm.riskLevel),
      city: optionalText(companyForm.city),
      description: optionalText(companyForm.description),
      legalAddress: optionalText(companyForm.legalAddress),
      localUnitAddress: optionalText(companyForm.localUnitAddress),
    };

    setSavingCompany(true);
    setStatusMessage("");
    try {
      const savedCompany = editingCompanyId
        ? await updateCompany(token, editingCompanyId, payload)
        : await createCompany(token, payload);
      queueSyncEvent({
        eventType: editingCompanyId ? "company.updated" : "company.created",
        entityType: "company",
        entityId: savedCompany.id,
        payload: savedCompany,
      });
      await onReload();
      setEditingCompanyId(savedCompany.id);
      setCompanyId(savedCompany.id);
      setCompanyQuery(savedCompany.name ?? "");
      setCompanyForm(companyToForm(savedCompany));
      setStatusMessage(editingCompanyId ? "Anagrafica cliente aggiornata." : "Cliente registrato in anagrafica.");
    } catch (error) {
      setStatusMessage(`Errore salvataggio cliente: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setSavingCompany(false);
    }
  }

  async function handleExportDaneaCsv() {
    setStatusMessage("");
    setExportingCsv(true);
    try {
      const blob = await exportCompaniesCsvDanea(token);
      triggerBlobDownload(blob, `danea-clienti-${todayCompactDateClient()}.csv`);
      setStatusMessage("CSV Danea Easyfatt esportato con successo.");
    } catch (error) {
      setStatusMessage(`Errore export CSV Danea: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setExportingCsv(false);
    }
  }

  async function handleGenerateNda(company: Company) {
    setStatusMessage("");
    setNdaCompanyId(company.id);
    try {
      const blob = await generateNdaPdf(token, company.id);
      const fileName = `NDA-${slugifyClient(company.name)}-${todayCompactDateClient()}.pdf`;
      triggerBlobDownload(blob, fileName);
      setStatusMessage(`NDA generata per ${company.name}.`);
    } catch (error) {
      setStatusMessage(`Errore generazione NDA: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setNdaCompanyId("");
    }
  }

  async function handleDownloadChecklistPdf(inspectionId: string) {
    setStatusMessage("");
    setDownloadInspectionId(inspectionId);
    try {
      const generated = await generateInspectionChecklistPdf(token, inspectionId);
      await downloadGeneratedDocument(token, generated.id, generated.fileName);
      setStatusMessage("Checklist completa (domande/risposte/note) scaricata con successo.");
    } catch (error) {
      setStatusMessage(`Errore download checklist PDF: ${error instanceof Error ? error.message : "errore"}`);
    } finally {
      setDownloadInspectionId("");
    }
  }

  return (
    <section className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Anagrafica e Storico Clienti</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="secondary-btn" onClick={startNewCompany}>
            Nuovo cliente
          </button>
          <button
            className="secondary-btn"
            onClick={handleExportDaneaCsv}
            disabled={exportingCsv || companies.length === 0}
            title="Esporta tutta l'anagrafica clienti in CSV compatibile Danea Easyfatt"
          >
            {exportingCsv ? "Esportazione..." : "Esporta CSV (Danea)"}
          </button>
        </div>
      </div>

      <div className="panel section-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0 }}>{editingCompanyId ? "Modifica cliente" : "Registra nuovo cliente"}</h3>
          {editingCompanyId ? (
            <button className="secondary-btn" onClick={startNewCompany} disabled={savingCompany}>
              Pulisci form
            </button>
          ) : null}
        </div>
        <div className="grid-two" style={{ marginTop: 12 }}>
          <div>
            <label htmlFor="registry-company-name">Ragione sociale</label>
            <input
              id="registry-company-name"
              value={companyForm.name}
              onChange={(event) => updateCompanyForm("name", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="registry-company-vat">Codice fiscale, Partita IVA e n. Iscr. Al Registro delle Imprese</label>
            <input
              id="registry-company-vat"
              value={companyForm.vatNumber}
              onChange={(event) => updateCompanyForm("vatNumber", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="registry-company-legalform">Forma Giuridica</label>
            <input
              id="registry-company-legalform"
              value={companyForm.legalForm}
              onChange={(event) => updateCompanyForm("legalForm", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="registry-company-rea">Numero REA</label>
            <input
              id="registry-company-rea"
              value={companyForm.reaNumber}
              onChange={(event) => updateCompanyForm("reaNumber", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="registry-company-employees">Totale dipendenti</label>
            <input
              id="registry-company-employees"
              value={companyForm.employeesInfo}
              onChange={(event) => updateCompanyForm("employeesInfo", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="registry-company-ateco">Codice ATECO</label>
            <input
              id="registry-company-ateco"
              value={companyForm.atecoCode}
              onChange={(event) => updateCompanyForm("atecoCode", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="registry-company-risk">Livello di rischi dell'attivita</label>
            <input
              id="registry-company-risk"
              value={companyForm.riskLevel}
              onChange={(event) => updateCompanyForm("riskLevel", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="registry-company-city">Citta</label>
            <input
              id="registry-company-city"
              value={companyForm.city}
              onChange={(event) => updateCompanyForm("city", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="registry-company-email">Indirizzo e-mail</label>
            <input
              id="registry-company-email"
              value={companyForm.email}
              onChange={(event) => updateCompanyForm("email", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="registry-company-pec">Indirizzo PEC</label>
            <input
              id="registry-company-pec"
              value={companyForm.pec}
              onChange={(event) => updateCompanyForm("pec", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="registry-company-phone">Telefono</label>
            <input
              id="registry-company-phone"
              value={companyForm.phone}
              onChange={(event) => updateCompanyForm("phone", event.target.value)}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label htmlFor="registry-company-description">Descrizione</label>
            <textarea
              id="registry-company-description"
              rows={3}
              value={companyForm.description}
              onChange={(event) => updateCompanyForm("description", event.target.value)}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label htmlFor="registry-company-legaladdr">Sede legale - Indirizzo</label>
            <textarea
              id="registry-company-legaladdr"
              rows={2}
              value={companyForm.legalAddress}
              onChange={(event) => updateCompanyForm("legalAddress", event.target.value)}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label htmlFor="registry-company-localaddr">Unita locale - Indirizzo</label>
            <textarea
              id="registry-company-localaddr"
              rows={2}
              value={companyForm.localUnitAddress}
              onChange={(event) => updateCompanyForm("localUnitAddress", event.target.value)}
            />
          </div>
        </div>
        <div className="footer-actions" style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button onClick={handleSaveCompany} disabled={savingCompany}>
            {savingCompany ? "Salvataggio..." : editingCompanyId ? "Salva modifiche" : "Registra cliente"}
          </button>
          {editingCompanyId ? (
            <button
              className="secondary-btn"
              onClick={() => onUseForInspection(editingCompanyId)}
              disabled={savingCompany}
            >
              Avvia sopralluogo
            </button>
          ) : null}
        </div>
      </div>

      <div className="registry-toolbar">
        <div className="registry-search-field">
          <label htmlFor="company-query">Ricerca azienda</label>
          <input
            id="company-query"
            type="text"
            list="company-name-suggestions"
            value={companyQuery}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Digita ragione sociale, P.IVA o ATECO..."
          />
          <datalist id="company-name-suggestions">
            {companySuggestions.map((company) => (
              <option key={company.id} value={company.name}>
                {company.name}
              </option>
            ))}
          </datalist>
          <p className="template-hint">
            {filteredCompanies.length} aziende trovate su {companies.length}
          </p>
        </div>
      </div>

      {statusMessage && !selectedCompany ? (
        <p className="status-message">{statusMessage}</p>
      ) : null}

      <div className="panel section-panel">
        <h3>Elenco completo aziende registrate</h3>
        <table>
          <thead>
            <tr>
              <th>Ragione sociale</th>
              <th>ATECO</th>
              <th>Città</th>
              <th>Contatti</th>
              <th>Azione</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr
                key={company.id}
                className={company.id === companyId ? "registry-row-selected" : undefined}
              >
                <td>{company.name || "-"}</td>
                <td>{company.atecoCode || "-"}</td>
                <td>{company.city || "-"}</td>
                <td>{company.phone || company.email || "-"}</td>
                <td>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button className="ghost-btn" onClick={() => setCompanyId(company.id)}>
                      Apri anagrafica
                    </button>
                    <button className="ghost-btn" onClick={() => editCompany(company)}>
                      Modifica
                    </button>
                    <button className="ghost-btn" onClick={() => onUseForInspection(company.id)}>
                      Avvia sopralluogo
                    </button>
                    <button
                      className="ghost-btn"
                      onClick={() => handleGenerateNda(company)}
                      disabled={ndaCompanyId === company.id}
                      title="Genera Accordo di Riservatezza (NDA) PDF precompilato"
                    >
                      {ndaCompanyId === company.id ? "Genero..." : "Genera NDA"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCompanies.length === 0 && (
              <tr>
                <td colSpan={5}>Nessuna azienda trovata con i caratteri inseriti.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCompany ? (
        <div className="panel section-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3 style={{ margin: 0 }}>Anagrafica cliente</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="secondary-btn" onClick={() => editCompany(selectedCompany)}>
                Modifica cliente
              </button>
              <button className="secondary-btn" onClick={() => onUseForInspection(selectedCompany.id)}>
                Avvia sopralluogo
              </button>
              <button className="secondary-btn" onClick={() => setCompanyId("")}>
                Chiudi anagrafica
              </button>
            </div>
          </div>
          <table>
            <tbody>
              <tr>
                <th>Ragione sociale</th>
                <td>{selectedCompany.name || "-"}</td>
              </tr>
              <tr>
                <th>Forma giuridica</th>
                <td>{selectedCompany.legalForm || "-"}</td>
              </tr>
              <tr>
                <th>CF/P.IVA/Registro Imprese</th>
                <td>{selectedCompany.vatNumber || "-"}</td>
              </tr>
              <tr>
                <th>Numero REA</th>
                <td>{selectedCompany.reaNumber || "-"}</td>
              </tr>
              <tr>
                <th>Codice ATECO</th>
                <td>{selectedCompany.atecoCode || "-"}</td>
              </tr>
              <tr>
                <th>Livello rischio</th>
                <td>{selectedCompany.riskLevel || "-"}</td>
              </tr>
              <tr>
                <th>Descrizione</th>
                <td>{selectedCompany.description || "-"}</td>
              </tr>
              <tr>
                <th>Sede legale</th>
                <td>{selectedCompany.legalAddress || "-"}</td>
              </tr>
              <tr>
                <th>Unità locale</th>
                <td>{selectedCompany.localUnitAddress || "-"}</td>
              </tr>
              <tr>
                <th>Indirizzo PEC</th>
                <td>{selectedCompany.pec || "-"}</td>
              </tr>
              <tr>
                <th>E-mail</th>
                <td>{selectedCompany.email || "-"}</td>
              </tr>
              <tr>
                <th>Telefono</th>
                <td>{selectedCompany.phone || "-"}</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: 14 }}>Storico sopralluoghi</h3>
          <table>
            <thead>
              <tr>
                <th>Titolo</th>
                <th>Data</th>
                <th>Stato</th>
                <th>Ambito</th>
                <th>NC</th>
                <th>Checklist</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              {inspectionsForCompany.map((inspection) => (
                <tr key={inspection.id}>
                  <td>{inspection.title}</td>
                  <td>{new Date(inspection.happenedAt).toLocaleDateString("it-IT")}</td>
                  <td>{inspection.status}</td>
                  <td>{inspectionModeLabel(inspection.checklistMode)}</td>
                  <td>{inspection.nonConformities.length}</td>
                  <td>
                    <button
                      className="ghost-btn"
                      onClick={() => onUseForInspection(inspection.companyId ?? companyId, inspection.id)}
                    >
                      Apri checklist esistente
                    </button>
                  </td>
                  <td>
                    <button
                      className="ghost-btn"
                      disabled={downloadInspectionId === inspection.id}
                      onClick={() => handleDownloadChecklistPdf(inspection.id)}
                    >
                      {downloadInspectionId === inspection.id ? "Scarico..." : "Scarica checklist completa PDF"}
                    </button>
                  </td>
                </tr>
              ))}
              {inspectionsForCompany.length === 0 && (
                <tr>
                  <td colSpan={7}>Nessun sopralluogo presente per l’azienda selezionata.</td>
                </tr>
              )}
            </tbody>
          </table>
          {statusMessage ? <p className="status-message">{statusMessage}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
