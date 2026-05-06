import { useEffect, useMemo, useState } from "react";
import {
  Company,
  downloadGeneratedDocument,
  exportCompaniesCsvDanea,
  generateInspectionChecklistPdf,
  generateNdaPdf,
  Inspection,
  triggerBlobDownload,
} from "../api";

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
  onUseForInspection: (companyId: string, inspectionId: string) => void;
}

function inspectionModeLabel(mode: Inspection["checklistMode"]) {
  if (mode === "haccp_only") return "Solo HACCP";
  if (mode === "safety_only") return "Solo Sicurezza";
  return "Unificata";
}

export default function CustomerRegistryPage({ token, companies, inspections, onUseForInspection }: CustomerRegistryPageProps) {
  const [companyId, setCompanyId] = useState<string>("");
  const [companyQuery, setCompanyQuery] = useState<string>("");
  const [downloadInspectionId, setDownloadInspectionId] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [exportingCsv, setExportingCsv] = useState<boolean>(false);
  const [ndaCompanyId, setNdaCompanyId] = useState<string>("");

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
            <button className="secondary-btn" onClick={() => setCompanyId("")}>
              Chiudi anagrafica
            </button>
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
                      Usa check per sopralluogo
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
