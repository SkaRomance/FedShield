import { ChecklistTemplate, Company } from "../../api";
import { CHECKLIST_MODE_OPTIONS, InspectionChecklistMode } from "./_shared";

interface Step0DatiAziendaProps {
  companies: Company[];
  selectedCompany: Company | undefined;
  companyId: string;
  companySearchQuery: string;
  setCompanySearchQuery: (value: string) => void;
  filteredCompanyMatches: Company[];
  selectExistingCompanyForInspection: (nextCompanyId: string) => void;
  handleCompanySearchChange: (value: string) => void;
  newInspectionChecklistMode: InspectionChecklistMode;
  setNewInspectionChecklistMode: (value: InspectionChecklistMode) => void;
  title: string;
  setTitle: (value: string) => void;
  handleCreateInspection: () => Promise<void>;
  templates: ChecklistTemplate[];
  loading: boolean;
}

export default function Step0DatiAzienda({
  companies,
  selectedCompany,
  companyId,
  companySearchQuery,
  setCompanySearchQuery,
  filteredCompanyMatches,
  selectExistingCompanyForInspection,
  handleCompanySearchChange,
  newInspectionChecklistMode,
  setNewInspectionChecklistMode,
  title,
  setTitle,
  handleCreateInspection,
  templates,
  loading,
}: Step0DatiAziendaProps) {
  function chooseCompany(nextCompanyId: string) {
    if (!nextCompanyId) {
      setCompanySearchQuery("");
      return;
    }
    const nextCompany = companies.find((company) => company.id === nextCompanyId);
    if (!nextCompany) return;
    setCompanySearchQuery(nextCompany.name ?? "");
    selectExistingCompanyForInspection(nextCompany.id);
  }

  const companyRows = selectedCompany
    ? [
        ["Ragione sociale", selectedCompany.name],
        ["Forma giuridica", selectedCompany.legalForm],
        ["CF/P.IVA/Registro Imprese", selectedCompany.vatNumber],
        ["Numero REA", selectedCompany.reaNumber],
        ["ATECO", selectedCompany.atecoCode],
        ["Livello rischio", selectedCompany.riskLevel],
        ["Citta", selectedCompany.city],
        ["Sede legale", selectedCompany.legalAddress],
        ["Unita locale", selectedCompany.localUnitAddress],
        ["PEC", selectedCompany.pec],
        ["E-mail", selectedCompany.email],
        ["Telefono", selectedCompany.phone],
        ["Descrizione", selectedCompany.description],
      ]
    : [];

  return (
    <>
      <div className="panel section-panel">
        <h3>1A. Dati azienda</h3>
        <div className="grid-two">
          <div>
            <label htmlFor="checklist-company-search">Ricerca cliente registrato</label>
            <input
              id="checklist-company-search"
              type="text"
              list="checklist-company-search-suggestions"
              value={companySearchQuery}
              onChange={(event) => handleCompanySearchChange(event.target.value)}
              placeholder="Ragione sociale, P.IVA, ATECO o citta"
            />
            <datalist id="checklist-company-search-suggestions">
              {companies.slice(0, 200).map((company) => (
                <option key={company.id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="checklist-company-select">Cliente selezionato</label>
            <select
              id="checklist-company-select"
              value={companyId}
              onChange={(event) => chooseCompany(event.target.value)}
              disabled={companies.length === 0}
            >
              <option value="">Seleziona cliente</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name || "-"} - P.IVA {company.vatNumber || "-"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {companySearchQuery.trim().length > 0 && filteredCompanyMatches.length > 0 ? (
          <div style={{ marginTop: 10 }}>
            <label htmlFor="checklist-company-results">Risultati ricerca</label>
            <select
              id="checklist-company-results"
              value={companyId || filteredCompanyMatches[0]?.id || ""}
              onChange={(event) => chooseCompany(event.target.value)}
            >
              {filteredCompanyMatches.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name || "-"} - P.IVA {company.vatNumber || "-"} - ATECO {company.atecoCode || "-"}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {selectedCompany ? (
          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table>
              <tbody>
                {companyRows.map(([label, value]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    <td>{value || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="template-hint" style={{ marginTop: 10 }}>
            Nessun cliente selezionato. Registra o scegli il cliente da Anagrafica Clienti, poi avvia il sopralluogo.
          </p>
        )}
      </div>

      <div className="panel section-panel">
        <h3>1B. Crea sopralluogo</h3>
        <div className="grid-two">
          <div>
            <label htmlFor="checklist-inspection-title">Titolo sopralluogo</label>
            <input
              id="checklist-inspection-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Sopralluogo Antisanzione"
            />
          </div>
          <div>
            <label htmlFor="checklist-inspection-mode">Ambito sopralluogo</label>
            <select
              id="checklist-inspection-mode"
              value={newInspectionChecklistMode}
              onChange={(event) => setNewInspectionChecklistMode(event.target.value as InspectionChecklistMode)}
            >
              {CHECKLIST_MODE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="footer-actions" style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
          <span className="template-hint" style={{ marginRight: "auto" }}>
            Template caricati: {templates.map((template) => template.name).join(" • ") || "nessuno"}
          </span>
          <button className="secondary-btn" onClick={handleCreateInspection} disabled={loading || !companyId}>
            Crea sopralluogo
          </button>
        </div>
      </div>
    </>
  );
}
