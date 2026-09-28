import { useState } from "react";
import {
  ChecklistTemplate,
  Company,
  createCompany,
  updateCompany,
} from "../../api";
import { queueSyncEvent } from "../../services/syncManager";
import CompanyDataForm, {
  CompanyFormData,
  emptyCompanyFormData,
} from "../../components/CompanyDataForm";
import DataOraSopralluogo from "./DataOraSopralluogo";
import { CHECKLIST_MODE_OPTIONS, InspectionChecklistMode } from "./_shared";

interface Step0DatiAziendaProps {
  token?: string;
  onReload?: () => Promise<void>;
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
  momentoManuale: boolean;
  setMomentoManuale: (valore: boolean) => void;
  dataManuale: string;
  setDataManuale: (valore: string) => void;
  oraManuale: string;
  setOraManuale: (valore: string) => void;
}

function optionalText(val: string): string | undefined {
  const t = val.trim();
  return t.length > 0 ? t : undefined;
}

function companyToFormData(company: Company): CompanyFormData {
  return {
    code: company.code ?? "",
    name: company.name ?? "",
    vatNumber: company.vatNumber ?? "",
    fiscalCode: company.fiscalCode ?? "",
    legalForm: company.legalForm ?? "",
    reaNumber: company.reaNumber ?? "",
    employeesInfo: company.employeesInfo ?? "",
    email: company.email ?? "",
    pec: company.pec ?? "",
    phone: company.phone ?? "",
    mobilePhone: company.mobilePhone ?? "",
    atecoCode: company.atecoCode ?? "56.10.11",
    riskLevel: company.riskLevel ?? "",
    province: company.province ?? "",
    city: company.city ?? "",
    cap: company.cap ?? "",
    sdiCode: company.sdiCode ?? "",
    bankCoordinates: company.bankCoordinates ?? "",
    description: company.description ?? "",
    legalAddress: company.legalAddress ?? "",
    localUnitAddress: company.localUnitAddress ?? "",
  };
}

export default function Step0DatiAzienda({
  token,
  onReload,
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
  momentoManuale,
  setMomentoManuale,
  dataManuale,
  setDataManuale,
  oraManuale,
  setOraManuale,
}: Step0DatiAziendaProps) {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [companyForm, setCompanyForm] = useState<CompanyFormData>(emptyCompanyFormData);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

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

  function handleStartNewRegistration() {
    setCompanyForm(emptyCompanyFormData());
    setIsEditingExisting(false);
    setShowRegistrationForm(true);
    setFormError("");
    setFormSuccess("");
  }

  function handleStartEditExisting() {
    if (!selectedCompany) return;
    setCompanyForm(companyToFormData(selectedCompany));
    setIsEditingExisting(true);
    setShowRegistrationForm(true);
    setFormError("");
    setFormSuccess("");
  }

  function handleCancelForm() {
    setShowRegistrationForm(false);
    setIsEditingExisting(false);
    setFormError("");
  }

  function handleFormChange<K extends keyof CompanyFormData>(field: K, value: CompanyFormData[K]) {
    setCompanyForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSaveCompanyOnSite() {
    if (!companyForm.name.trim() || !companyForm.vatNumber.trim()) {
      setFormError("Inserisci almeno ragione sociale e partita IVA.");
      return;
    }

    if (!token) {
      setFormError("Token di autenticazione non disponibile.");
      return;
    }

    const payload = {
      code: optionalText(companyForm.code),
      name: companyForm.name.trim(),
      vatNumber: companyForm.vatNumber.trim(),
      fiscalCode: optionalText(companyForm.fiscalCode),
      legalForm: optionalText(companyForm.legalForm),
      reaNumber: optionalText(companyForm.reaNumber),
      employeesInfo: optionalText(companyForm.employeesInfo),
      email: optionalText(companyForm.email),
      pec: optionalText(companyForm.pec),
      phone: optionalText(companyForm.phone),
      mobilePhone: optionalText(companyForm.mobilePhone),
      atecoCode: optionalText(companyForm.atecoCode),
      riskLevel: optionalText(companyForm.riskLevel),
      province: optionalText(companyForm.province),
      city: optionalText(companyForm.city),
      cap: optionalText(companyForm.cap),
      sdiCode: optionalText(companyForm.sdiCode),
      bankCoordinates: optionalText(companyForm.bankCoordinates),
      description: optionalText(companyForm.description),
      legalAddress: optionalText(companyForm.legalAddress),
      localUnitAddress: optionalText(companyForm.localUnitAddress),
    };

    setFormSaving(true);
    setFormError("");
    try {
      const saved = isEditingExisting && selectedCompany
        ? await updateCompany(token, selectedCompany.id, payload)
        : await createCompany(token, payload);

      queueSyncEvent({
        eventType: isEditingExisting ? "company.updated" : "company.created",
        entityType: "company",
        entityId: saved.id,
        payload: saved,
      });

      if (onReload) {
        await onReload();
      }

      // Seleziona subito la nuova azienda per il sopralluogo
      selectExistingCompanyForInspection(saved.id);
      setCompanySearchQuery(saved.name ?? "");
      setShowRegistrationForm(false);
      setIsEditingExisting(false);
      setFormSuccess(
        isEditingExisting
          ? "Dati azienda aggiornati."
          : `Azienda "${saved.name}" registrata con successo e selezionata per il sopralluogo!`,
      );
    } catch (err) {
      setFormError(
        `Errore salvataggio azienda: ${err instanceof Error ? err.message : "errore sconosciuto"}`,
      );
    } finally {
      setFormSaving(false);
    }
  }

  const companyRows = selectedCompany
    ? [
        ["Cod. (Codice cliente)", selectedCompany.code],
        ["Ragione sociale", selectedCompany.name],
        ["Partita IVA", selectedCompany.vatNumber],
        ["Codice Fiscale", selectedCompany.fiscalCode],
        ["Cod. destinatario (SDI)", selectedCompany.sdiCode],
        ["Forma giuridica", selectedCompany.legalForm],
        ["Numero REA", selectedCompany.reaNumber],
        ["Totale dipendenti", selectedCompany.employeesInfo],
        ["ATECO", selectedCompany.atecoCode],
        ["Livello rischio", selectedCompany.riskLevel],
        ["Sede legale", selectedCompany.legalAddress],
        ["Città / Comune", selectedCompany.city],
        ["Provincia", selectedCompany.province],
        ["CAP", selectedCompany.cap],
        ["Unità locale", selectedCompany.localUnitAddress],
        ["Telefono", selectedCompany.phone],
        ["Cellulare", selectedCompany.mobilePhone],
        ["E-mail", selectedCompany.email],
        ["Indirizzo PEC", selectedCompany.pec],
        ["Coord. bancarie (IBAN)", selectedCompany.bankCoordinates],
        ["Descrizione / Note", selectedCompany.description],
      ]
    : [];

  return (
    <>
      <div className="panel section-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ margin: 0 }}>1A. Dati azienda per sopralluogo</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {!showRegistrationForm && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleStartNewRegistration}
                title="Registra subito una nuova azienda durante il sopralluogo"
              >
                ➕ Registra nuova azienda in sede
              </button>
            )}
            {selectedCompany && !showRegistrationForm && (
              <button
                type="button"
                className="secondary-btn"
                onClick={handleStartEditExisting}
                title="Modifica i dati anagrafici dell'azienda selezionata"
              >
                ✏️ Modifica dati azienda
              </button>
            )}
          </div>
        </div>

        {formSuccess && (
          <div className="status-banner status-banner-success" style={{ marginTop: 12 }}>
            {formSuccess}
          </div>
        )}

        {/* Pannello registrazione / modifica azienda in sede */}
        {showRegistrationForm ? (
          <div style={{ marginTop: 14, background: "var(--color-surface, #ffffff)", padding: 14, borderRadius: 8, border: "2px solid var(--color-accent, #e65712)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h4 style={{ margin: 0, color: "var(--color-primary, #212d52)", fontSize: "16px" }}>
                {isEditingExisting ? "✏️ Modifica dati azienda" : "➕ Nuova registrazione azienda in sede di sopralluogo"}
              </h4>
              <button type="button" className="ghost-btn" onClick={handleCancelForm}>
                Chiudi modulo
              </button>
            </div>

            {formError && (
              <div className="status-banner status-banner-error" style={{ marginBottom: 12 }}>
                {formError}
              </div>
            )}

            <CompanyDataForm
              form={companyForm}
              onChange={handleFormChange}
              idPrefix="onsite"
              disabled={formSaving}
            />

            <div className="footer-actions" style={{ justifyContent: "flex-end", flexWrap: "wrap", marginTop: 16 }}>
              <button type="button" className="secondary-btn" onClick={handleCancelForm} disabled={formSaving}>
                Annulla
              </button>
              <button type="button" className="btn-primary" onClick={handleSaveCompanyOnSite} disabled={formSaving}>
                {formSaving ? "Salvataggio in corso..." : isEditingExisting ? "Salva modifiche" : "Salva e seleziona per il sopralluogo"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid-two" style={{ marginTop: 14 }}>
              <div>
                <label htmlFor="checklist-company-search">Ricerca cliente registrato</label>
                <input
                  id="checklist-company-search"
                  type="text"
                  list="checklist-company-search-suggestions"
                  value={companySearchQuery}
                  onChange={(event) => handleCompanySearchChange(event.target.value)}
                  placeholder="Ragione sociale, P.IVA, ATECO o città"
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
              <div className="table-wrap" style={{ marginTop: 14 }}>
                <table>
                  <tbody>
                    {companyRows
                      .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "")
                      .map(([label, value]) => (
                        <tr key={label}>
                          <th style={{ width: "220px" }}>{label}</th>
                          <td>{value || "-"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="status-banner status-banner-info" style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <span>Nessun cliente selezionato. Puoi cercarne uno registrato oppure registrarlo subito qui.</span>
                <button type="button" className="btn-primary" onClick={handleStartNewRegistration}>
                  ➕ Registra azienda qui
                </button>
              </div>
            )}
          </>
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

        <DataOraSopralluogo
          momentoManuale={momentoManuale}
          setMomentoManuale={setMomentoManuale}
          dataManuale={dataManuale}
          setDataManuale={setDataManuale}
          oraManuale={oraManuale}
          setOraManuale={setOraManuale}
        />

        <div className="footer-actions" style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
          <span className="template-hint" style={{ marginRight: "auto" }}>
            Modelli caricati: {templates.map((template) => template.name).join(" • ") || "nessuno"}
          </span>
          <button className="btn-primary" onClick={handleCreateInspection} disabled={loading || !companyId}>
            Crea sopralluogo
          </button>
        </div>
      </div>
    </>
  );
}
