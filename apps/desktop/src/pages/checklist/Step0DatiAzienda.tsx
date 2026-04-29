// Step 0 "Dati Azienda" extracted from ChecklistPage.tsx during S13-A refactor.
// Pure JSX extraction: nessun cambio di logica rispetto al monolite originale.

import { Dispatch, SetStateAction } from "react";
import { ChecklistTemplate, Company } from "../../api";
import {
  ACTIVITY_TYPE_OPTIONS,
  ActivityTypeOption,
  CHECKLIST_MODE_OPTIONS,
  HACCP_ROLE_OPTIONS,
  InspectionChecklistMode,
  PersonCardData,
  RegistrationTaskKey,
  RolePersonCardData,
  atecoFromActivity,
} from "./_shared";

interface Step0DatiAziendaProps {
  // Company / search state
  companies: Company[];
  selectedCompany: Company | undefined;
  companyId: string;
  setCompanyId: Dispatch<SetStateAction<string>>;
  isNewCompanyDraft: boolean;
  setIsNewCompanyDraft: Dispatch<SetStateAction<boolean>>;
  companySearchQuery: string;
  setCompanySearchQuery: Dispatch<SetStateAction<string>>;
  setSelectedInspectionId: Dispatch<SetStateAction<string>>;
  filteredCompanyMatches: Company[];
  selectExistingCompanyForInspection: (nextCompanyId: string) => void;
  handleCompanySearchChange: (value: string) => void;
  resetCompanyRegistrationForm: () => void;

  // Registration task accordions
  visibleTasksBeforeBody: Array<{
    key: RegistrationTaskKey;
    title: string;
    status: string;
    progress: { completed: number; total: number };
  }>;
  visibleTasksAfterBody: Array<{
    key: RegistrationTaskKey;
    title: string;
    status: string;
    progress: { completed: number; total: number };
  }>;
  activeRegistrationTask: RegistrationTaskKey | null;
  renderTaskHeader: (
    taskKey: RegistrationTaskKey,
    title: string,
    status: string,
    progress: { completed: number; total: number },
  ) => React.ReactElement;
  handleSaveRegistrationTask: (taskKey: RegistrationTaskKey, moveNext?: boolean) => Promise<void>;
  moveRegistrationTask: (currentKey: RegistrationTaskKey, direction: -1 | 1) => void;
  closeRegistrationTaskPanel: () => void;

  // General form fields
  newCompanyName: string;
  setNewCompanyName: Dispatch<SetStateAction<string>>;
  newCompanyVat: string;
  setNewCompanyVat: Dispatch<SetStateAction<string>>;
  newCompanyLegalForm: string;
  setNewCompanyLegalForm: Dispatch<SetStateAction<string>>;
  newCompanyReaNumber: string;
  setNewCompanyReaNumber: Dispatch<SetStateAction<string>>;
  newCompanyEmployeesInfo: string;
  setNewCompanyEmployeesInfo: Dispatch<SetStateAction<string>>;
  newCompanyEmail: string;
  setNewCompanyEmail: Dispatch<SetStateAction<string>>;
  newCompanyPec: string;
  setNewCompanyPec: Dispatch<SetStateAction<string>>;
  newCompanyPhone: string;
  setNewCompanyPhone: Dispatch<SetStateAction<string>>;
  newCompanyAteco: string;
  setNewCompanyAteco: Dispatch<SetStateAction<string>>;
  newCompanyRiskLevel: string;
  setNewCompanyRiskLevel: Dispatch<SetStateAction<string>>;
  newCompanyDescription: string;
  setNewCompanyDescription: Dispatch<SetStateAction<string>>;
  newCompanyLegalAddress: string;
  setNewCompanyLegalAddress: Dispatch<SetStateAction<string>>;
  newCompanyLocalUnitAddress: string;
  setNewCompanyLocalUnitAddress: Dispatch<SetStateAction<string>>;
  newCompanyCity: string;
  setNewCompanyCity: Dispatch<SetStateAction<string>>;
  newCompanyActivities: ActivityTypeOption[];
  setNewCompanyActivities: Dispatch<SetStateAction<ActivityTypeOption[]>>;
  newCompanyRetailScopes: string[];
  setNewCompanyRetailScopes: Dispatch<SetStateAction<string[]>>;
  showRetailAdditionalScopes: boolean;
  retailAdditionalScopeOptions: ReadonlyArray<{ value: string; label: string }>;

  // Safety task fields
  showSafetyRoleBlock: boolean;
  newCompanyEmployerRsppPreposto: PersonCardData;
  setNewCompanyEmployerRsppPreposto: Dispatch<SetStateAction<PersonCardData>>;
  newCompanyOccupationalDoctor: PersonCardData;
  setNewCompanyOccupationalDoctor: Dispatch<SetStateAction<PersonCardData>>;
  newCompanyRls: PersonCardData;
  setNewCompanyRls: Dispatch<SetStateAction<PersonCardData>>;
  newCompanyEmergencyTeam: PersonCardData[];
  setNewCompanyEmergencyTeam: Dispatch<SetStateAction<PersonCardData[]>>;
  newCompanyFirstAidTeam: PersonCardData[];
  setNewCompanyFirstAidTeam: Dispatch<SetStateAction<PersonCardData[]>>;
  updatePersonCard: (
    setValue: Dispatch<SetStateAction<PersonCardData>>,
    key: keyof PersonCardData,
    value: string,
  ) => void;
  addPersonToList: (setter: Dispatch<SetStateAction<PersonCardData[]>>) => void;
  updatePersonListItem: (
    setter: Dispatch<SetStateAction<PersonCardData[]>>,
    index: number,
    key: keyof PersonCardData,
    value: string,
  ) => void;
  removePersonListItem: (setter: Dispatch<SetStateAction<PersonCardData[]>>, index: number) => void;

  // HACCP task fields
  showHaccpRoleBlock: boolean;
  newCompanyHaccpResponsabileAutocontrollo: PersonCardData;
  setNewCompanyHaccpResponsabileAutocontrollo: Dispatch<SetStateAction<PersonCardData>>;
  newCompanyHaccpConsulenteEsterno: PersonCardData;
  setNewCompanyHaccpConsulenteEsterno: Dispatch<SetStateAction<PersonCardData>>;
  newCompanyHaccpAdditionalRoles: RolePersonCardData[];
  newCompanyHaccpCustomRole: string;
  setNewCompanyHaccpCustomRole: Dispatch<SetStateAction<string>>;
  toggleHaccpAdditionalRole: (role: string) => void;
  addCustomHaccpRole: () => void;
  updateHaccpAdditionalRole: (index: number, key: keyof RolePersonCardData, value: string) => void;
  removeHaccpAdditionalRole: (index: number) => void;

  // Inspection creation
  newInspectionChecklistMode: InspectionChecklistMode;
  setNewInspectionChecklistMode: Dispatch<SetStateAction<InspectionChecklistMode>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  handleCreateInspection: () => Promise<void>;
  templates: ChecklistTemplate[];

  // General
  loading: boolean;
}

export default function Step0DatiAzienda({
  companies,
  selectedCompany,
  companyId,
  setCompanyId,
  isNewCompanyDraft,
  setIsNewCompanyDraft,
  companySearchQuery,
  setCompanySearchQuery,
  setSelectedInspectionId,
  filteredCompanyMatches,
  selectExistingCompanyForInspection,
  handleCompanySearchChange,
  resetCompanyRegistrationForm,
  visibleTasksBeforeBody,
  visibleTasksAfterBody,
  activeRegistrationTask,
  renderTaskHeader,
  handleSaveRegistrationTask,
  moveRegistrationTask,
  closeRegistrationTaskPanel,
  newCompanyName,
  setNewCompanyName,
  newCompanyVat,
  setNewCompanyVat,
  newCompanyLegalForm,
  setNewCompanyLegalForm,
  newCompanyReaNumber,
  setNewCompanyReaNumber,
  newCompanyEmployeesInfo,
  setNewCompanyEmployeesInfo,
  newCompanyEmail,
  setNewCompanyEmail,
  newCompanyPec,
  setNewCompanyPec,
  newCompanyPhone,
  setNewCompanyPhone,
  newCompanyAteco,
  setNewCompanyAteco,
  newCompanyRiskLevel,
  setNewCompanyRiskLevel,
  newCompanyDescription,
  setNewCompanyDescription,
  newCompanyLegalAddress,
  setNewCompanyLegalAddress,
  newCompanyLocalUnitAddress,
  setNewCompanyLocalUnitAddress,
  newCompanyCity,
  setNewCompanyCity,
  newCompanyActivities,
  setNewCompanyActivities,
  newCompanyRetailScopes,
  setNewCompanyRetailScopes,
  showRetailAdditionalScopes,
  retailAdditionalScopeOptions,
  showSafetyRoleBlock,
  newCompanyEmployerRsppPreposto,
  setNewCompanyEmployerRsppPreposto,
  newCompanyOccupationalDoctor,
  setNewCompanyOccupationalDoctor,
  newCompanyRls,
  setNewCompanyRls,
  newCompanyEmergencyTeam,
  setNewCompanyEmergencyTeam,
  newCompanyFirstAidTeam,
  setNewCompanyFirstAidTeam,
  updatePersonCard,
  addPersonToList,
  updatePersonListItem,
  removePersonListItem,
  showHaccpRoleBlock,
  newCompanyHaccpResponsabileAutocontrollo,
  setNewCompanyHaccpResponsabileAutocontrollo,
  newCompanyHaccpConsulenteEsterno,
  setNewCompanyHaccpConsulenteEsterno,
  newCompanyHaccpAdditionalRoles,
  newCompanyHaccpCustomRole,
  setNewCompanyHaccpCustomRole,
  toggleHaccpAdditionalRole,
  addCustomHaccpRole,
  updateHaccpAdditionalRole,
  removeHaccpAdditionalRole,
  newInspectionChecklistMode,
  setNewInspectionChecklistMode,
  title,
  setTitle,
  handleCreateInspection,
  templates,
  loading,
}: Step0DatiAziendaProps) {
  return (
    <>
      <div className="panel section-panel">
        <h3>1A. Registrazione nuovo cliente</h3>
        <div className="person-list-header" style={{ marginBottom: 8 }}>
          <p className="template-hint" style={{ margin: 0 }}>
            {isNewCompanyDraft
              ? "Modalita nuovo cliente"
              : `Modifica anagrafica: ${selectedCompany?.name ?? "cliente selezionato"}`}
          </p>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => {
              setIsNewCompanyDraft(true);
              setCompanyId("");
              setSelectedInspectionId("");
              setCompanySearchQuery("");
              resetCompanyRegistrationForm();
            }}
          >
            Nuovo cliente
          </button>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="checklist-company-search">Ricerca cliente gia registrato</label>
          <input
            id="checklist-company-search"
            type="text"
            list="checklist-company-search-suggestions"
            value={companySearchQuery}
            onChange={(event) => handleCompanySearchChange(event.target.value)}
            placeholder="Digita ragione sociale, P.IVA, ATECO o citta..."
          />
          <datalist id="checklist-company-search-suggestions">
            {companies.slice(0, 200).map((company) => (
              <option key={company.id} value={company.name}>
                {company.name}
              </option>
            ))}
          </datalist>
          {companySearchQuery.trim().length > 0 ? (
            filteredCompanyMatches.length > 0 ? (
              <div style={{ marginTop: 8 }}>
                <label htmlFor="checklist-company-results">Risultati ricerca</label>
                <select
                  id="checklist-company-results"
                  value={companyId || filteredCompanyMatches[0]?.id || ""}
                  onChange={(event) => {
                    const nextId = event.target.value;
                    const nextCompany = companies.find((company) => company.id === nextId);
                    if (nextCompany) {
                      setCompanySearchQuery(nextCompany.name);
                      selectExistingCompanyForInspection(nextCompany.id);
                    }
                  }}
                >
                  {filteredCompanyMatches.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name || "-"} - P.IVA {company.vatNumber || "-"} - ATECO {company.atecoCode || "-"}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="template-hint" style={{ marginTop: 6 }}>
                Nessun cliente corrisponde ai criteri di ricerca.
              </p>
            )
          ) : null}
        </div>
        <div className="task-accordion-list">
          {visibleTasksBeforeBody.map((task) =>
            renderTaskHeader(task.key, task.title, task.status, task.progress),
          )}
        </div>
        {!activeRegistrationTask && (
          <p className="template-hint">Seleziona un task per iniziare la compilazione.</p>
        )}

        {activeRegistrationTask === "general" && (
          <div className="task-accordion-body">
            <div className="grid-two">
              <div>
                <label>Ragione sociale</label>
                <input value={newCompanyName} onChange={(event) => setNewCompanyName(event.target.value)} />
              </div>
              <div>
                <label>Codice fiscale, Partita IVA e n. Iscr. Al Registro delle Imprese</label>
                <input value={newCompanyVat} onChange={(event) => setNewCompanyVat(event.target.value)} />
              </div>
              <div>
                <label>Forma Giuridica</label>
                <input value={newCompanyLegalForm} onChange={(event) => setNewCompanyLegalForm(event.target.value)} />
              </div>
              <div>
                <label>Numero REA</label>
                <input value={newCompanyReaNumber} onChange={(event) => setNewCompanyReaNumber(event.target.value)} />
              </div>
              <div>
                <label>Totale dipendenti</label>
                <input value={newCompanyEmployeesInfo} onChange={(event) => setNewCompanyEmployeesInfo(event.target.value)} />
              </div>
              <div>
                <label>Indirizzo e-mail</label>
                <input value={newCompanyEmail} onChange={(event) => setNewCompanyEmail(event.target.value)} />
              </div>
              <div>
                <label>Indirizzo PEC</label>
                <input value={newCompanyPec} onChange={(event) => setNewCompanyPec(event.target.value)} />
              </div>
              <div>
                <label>Telefono</label>
                <input value={newCompanyPhone} onChange={(event) => setNewCompanyPhone(event.target.value)} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label>Tipo attivita (selezione multipla)</label>
                <div className="haccp-role-options">
                  {ACTIVITY_TYPE_OPTIONS.map((option) => (
                    <label key={option.value} className="haccp-role-option">
                      <input
                        type="checkbox"
                        checked={newCompanyActivities.includes(option.value)}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setNewCompanyActivities((current) => {
                            const exists = current.includes(option.value);
                            if (checked && !exists) {
                              const next = [...current, option.value];
                              if (next.length === 1 && option.value !== "custom") {
                                setNewCompanyAteco(atecoFromActivity(option.value));
                              }
                              return next;
                            }
                            if (!checked && exists) {
                              return current.filter((value) => value !== option.value);
                            }
                            return current;
                          });
                        }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label>Codice ATECO</label>
                <input
                  value={newCompanyAteco}
                  onChange={(event) => {
                    const value = event.target.value;
                    setNewCompanyAteco(value);
                  }}
                />
              </div>
              {showRetailAdditionalScopes && (
                <div style={{ gridColumn: "span 2" }}>
                  <label>Attivita interne presenti (attivano domande e requisiti extra)</label>
                  <div className="haccp-role-options">
                    {retailAdditionalScopeOptions.map((option) => (
                      <label key={option.value} className="haccp-role-option">
                        <input
                          type="checkbox"
                          checked={newCompanyRetailScopes.includes(option.value)}
                          onChange={(event) => {
                            const checked = event.target.checked;
                            setNewCompanyRetailScopes((current) => {
                              if (checked) {
                                return current.includes(option.value) ? current : [...current, option.value];
                              }
                              return current.filter((value) => value !== option.value);
                            });
                          }}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label>Livello di rischi dell’attivita</label>
                <input value={newCompanyRiskLevel} onChange={(event) => setNewCompanyRiskLevel(event.target.value)} />
              </div>
              <div>
                <label>Citta</label>
                <input value={newCompanyCity} onChange={(event) => setNewCompanyCity(event.target.value)} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label>Descrizione</label>
                <textarea rows={3} value={newCompanyDescription} onChange={(event) => setNewCompanyDescription(event.target.value)} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label>Sede legale - Indirizzo</label>
                <textarea rows={2} value={newCompanyLegalAddress} onChange={(event) => setNewCompanyLegalAddress(event.target.value)} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label>Unita locale - Indirizzo</label>
                <textarea rows={2} value={newCompanyLocalUnitAddress} onChange={(event) => setNewCompanyLocalUnitAddress(event.target.value)} />
              </div>
            </div>
            <div className="footer-actions" style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button onClick={() => handleSaveRegistrationTask("general", true)} disabled={loading}>
                Salva task
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => moveRegistrationTask("general", -1)}
                disabled
              >
                Indietro
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={closeRegistrationTaskPanel}
                disabled={loading}
              >
                Chiudi/Riduci
              </button>
            </div>
          </div>
        )}

        {activeRegistrationTask === "safety" && (
          <div className="task-accordion-body">
            {!showSafetyRoleBlock ? (
              <p className="template-hint">Task non richiesta per l’ambito selezionato.</p>
            ) : (
              <>
                <div className="person-card-grid">
                  <div className="person-card">
                    <h4>Datore/RSPP/Preposto</h4>
                    <input placeholder="Nominativo" value={newCompanyEmployerRsppPreposto.fullName} onChange={(event) => updatePersonCard(setNewCompanyEmployerRsppPreposto, "fullName", event.target.value)} />
                    <input placeholder="Codice Fiscale" value={newCompanyEmployerRsppPreposto.taxCode} onChange={(event) => updatePersonCard(setNewCompanyEmployerRsppPreposto, "taxCode", event.target.value)} />
                    <input placeholder="Recapito" value={newCompanyEmployerRsppPreposto.contact} onChange={(event) => updatePersonCard(setNewCompanyEmployerRsppPreposto, "contact", event.target.value)} />
                    <textarea rows={2} placeholder="Note" value={newCompanyEmployerRsppPreposto.notes} onChange={(event) => updatePersonCard(setNewCompanyEmployerRsppPreposto, "notes", event.target.value)} />
                  </div>
                  <div className="person-card">
                    <h4>Medico Competente</h4>
                    <input placeholder="Nominativo" value={newCompanyOccupationalDoctor.fullName} onChange={(event) => updatePersonCard(setNewCompanyOccupationalDoctor, "fullName", event.target.value)} />
                    <input placeholder="Codice Fiscale" value={newCompanyOccupationalDoctor.taxCode} onChange={(event) => updatePersonCard(setNewCompanyOccupationalDoctor, "taxCode", event.target.value)} />
                    <input placeholder="Recapito" value={newCompanyOccupationalDoctor.contact} onChange={(event) => updatePersonCard(setNewCompanyOccupationalDoctor, "contact", event.target.value)} />
                    <textarea rows={2} placeholder="Note" value={newCompanyOccupationalDoctor.notes} onChange={(event) => updatePersonCard(setNewCompanyOccupationalDoctor, "notes", event.target.value)} />
                  </div>
                  <div className="person-card">
                    <h4>RLS</h4>
                    <input placeholder="Nominativo" value={newCompanyRls.fullName} onChange={(event) => updatePersonCard(setNewCompanyRls, "fullName", event.target.value)} />
                    <input placeholder="Codice Fiscale" value={newCompanyRls.taxCode} onChange={(event) => updatePersonCard(setNewCompanyRls, "taxCode", event.target.value)} />
                    <input placeholder="Recapito" value={newCompanyRls.contact} onChange={(event) => updatePersonCard(setNewCompanyRls, "contact", event.target.value)} />
                    <textarea rows={2} placeholder="Note" value={newCompanyRls.notes} onChange={(event) => updatePersonCard(setNewCompanyRls, "notes", event.target.value)} />
                  </div>
                </div>
                <div className="person-list-header">
                  <h4>Addetti emergenza/antincendio/evacuazione</h4>
                  <button type="button" className="secondary-btn" onClick={() => addPersonToList(setNewCompanyEmergencyTeam)}>
                    Aggiungi
                  </button>
                </div>
                {newCompanyEmergencyTeam.map((item, index) => (
                  <div key={`em-${index}`} className="person-card-inline">
                    <input placeholder="Nominativo" value={item.fullName} onChange={(event) => updatePersonListItem(setNewCompanyEmergencyTeam, index, "fullName", event.target.value)} />
                    <input placeholder="Codice Fiscale" value={item.taxCode} onChange={(event) => updatePersonListItem(setNewCompanyEmergencyTeam, index, "taxCode", event.target.value)} />
                    <input placeholder="Recapito" value={item.contact} onChange={(event) => updatePersonListItem(setNewCompanyEmergencyTeam, index, "contact", event.target.value)} />
                    <input placeholder="Note" value={item.notes} onChange={(event) => updatePersonListItem(setNewCompanyEmergencyTeam, index, "notes", event.target.value)} />
                    <button type="button" className="ghost-btn" onClick={() => removePersonListItem(setNewCompanyEmergencyTeam, index)}>Rimuovi</button>
                  </div>
                ))}
                <div className="person-list-header">
                  <h4>Addetti pronto soccorso</h4>
                  <button type="button" className="secondary-btn" onClick={() => addPersonToList(setNewCompanyFirstAidTeam)}>
                    Aggiungi
                  </button>
                </div>
                {newCompanyFirstAidTeam.map((item, index) => (
                  <div key={`fa-${index}`} className="person-card-inline">
                    <input placeholder="Nominativo" value={item.fullName} onChange={(event) => updatePersonListItem(setNewCompanyFirstAidTeam, index, "fullName", event.target.value)} />
                    <input placeholder="Codice Fiscale" value={item.taxCode} onChange={(event) => updatePersonListItem(setNewCompanyFirstAidTeam, index, "taxCode", event.target.value)} />
                    <input placeholder="Recapito" value={item.contact} onChange={(event) => updatePersonListItem(setNewCompanyFirstAidTeam, index, "contact", event.target.value)} />
                    <input placeholder="Note" value={item.notes} onChange={(event) => updatePersonListItem(setNewCompanyFirstAidTeam, index, "notes", event.target.value)} />
                    <button type="button" className="ghost-btn" onClick={() => removePersonListItem(setNewCompanyFirstAidTeam, index)}>Rimuovi</button>
                  </div>
                ))}
              </>
            )}
            <div className="footer-actions" style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button onClick={() => handleSaveRegistrationTask("safety", true)} disabled={loading}>
                Salva task
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => moveRegistrationTask("safety", -1)}
                disabled={loading}
              >
                Indietro
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={closeRegistrationTaskPanel}
                disabled={loading}
              >
                Chiudi/Riduci
              </button>
            </div>
          </div>
        )}

        {activeRegistrationTask === "haccp" && (
          <div className="task-accordion-body">
            {!showHaccpRoleBlock ? (
              <p className="template-hint">Task non richiesta per l’ambito selezionato.</p>
            ) : (
              <>
                <div className="person-card-grid">
                  <div className="person-card">
                    <h4>Responsabile Autocontrollo</h4>
                    <input placeholder="Nominativo" value={newCompanyHaccpResponsabileAutocontrollo.fullName} onChange={(event) => updatePersonCard(setNewCompanyHaccpResponsabileAutocontrollo, "fullName", event.target.value)} />
                    <input placeholder="Codice Fiscale" value={newCompanyHaccpResponsabileAutocontrollo.taxCode} onChange={(event) => updatePersonCard(setNewCompanyHaccpResponsabileAutocontrollo, "taxCode", event.target.value)} />
                    <input placeholder="Recapito" value={newCompanyHaccpResponsabileAutocontrollo.contact} onChange={(event) => updatePersonCard(setNewCompanyHaccpResponsabileAutocontrollo, "contact", event.target.value)} />
                    <textarea rows={2} placeholder="Note" value={newCompanyHaccpResponsabileAutocontrollo.notes} onChange={(event) => updatePersonCard(setNewCompanyHaccpResponsabileAutocontrollo, "notes", event.target.value)} />
                  </div>
                  <div className="person-card">
                    <h4>Consulente esterno</h4>
                    <input placeholder="Nominativo" value={newCompanyHaccpConsulenteEsterno.fullName} onChange={(event) => updatePersonCard(setNewCompanyHaccpConsulenteEsterno, "fullName", event.target.value)} />
                    <input placeholder="Codice Fiscale" value={newCompanyHaccpConsulenteEsterno.taxCode} onChange={(event) => updatePersonCard(setNewCompanyHaccpConsulenteEsterno, "taxCode", event.target.value)} />
                    <input placeholder="Recapito" value={newCompanyHaccpConsulenteEsterno.contact} onChange={(event) => updatePersonCard(setNewCompanyHaccpConsulenteEsterno, "contact", event.target.value)} />
                    <textarea rows={2} placeholder="Note" value={newCompanyHaccpConsulenteEsterno.notes} onChange={(event) => updatePersonCard(setNewCompanyHaccpConsulenteEsterno, "notes", event.target.value)} />
                  </div>
                </div>
                <label>Altri responsabili HACCP</label>
                <div className="haccp-role-options">
                  {HACCP_ROLE_OPTIONS.map((role) => (
                    <label key={role} className="haccp-role-option">
                      <input
                        type="checkbox"
                        checked={newCompanyHaccpAdditionalRoles.some((item) => item.role.toLowerCase() === role.toLowerCase())}
                        onChange={() => toggleHaccpAdditionalRole(role)}
                      />
                      {role}
                    </label>
                  ))}
                </div>
                <div className="inline-actions" style={{ marginTop: 8 }}>
                  <input placeholder="Aggiungi responsabile personalizzato" value={newCompanyHaccpCustomRole} onChange={(event) => setNewCompanyHaccpCustomRole(event.target.value)} />
                  <button type="button" className="secondary-btn" onClick={addCustomHaccpRole}>Aggiungi</button>
                </div>
                {newCompanyHaccpAdditionalRoles.map((item, index) => (
                  <div key={`hr-${index}`} className="person-card-inline">
                    <input placeholder="Ruolo" value={item.role} onChange={(event) => updateHaccpAdditionalRole(index, "role", event.target.value)} />
                    <input placeholder="Nominativo" value={item.fullName} onChange={(event) => updateHaccpAdditionalRole(index, "fullName", event.target.value)} />
                    <input placeholder="Codice Fiscale" value={item.taxCode} onChange={(event) => updateHaccpAdditionalRole(index, "taxCode", event.target.value)} />
                    <input placeholder="Recapito" value={item.contact} onChange={(event) => updateHaccpAdditionalRole(index, "contact", event.target.value)} />
                    <input placeholder="Note" value={item.notes} onChange={(event) => updateHaccpAdditionalRole(index, "notes", event.target.value)} />
                    <button type="button" className="ghost-btn" onClick={() => removeHaccpAdditionalRole(index)}>Rimuovi</button>
                  </div>
                ))}
              </>
            )}
            <div className="footer-actions" style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button onClick={() => handleSaveRegistrationTask("haccp", true)} disabled={loading}>
                Salva task
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => moveRegistrationTask("haccp", -1)}
                disabled={loading}
              >
                Indietro
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={closeRegistrationTaskPanel}
                disabled={loading}
              >
                Chiudi/Riduci
              </button>
            </div>
          </div>
        )}
        {visibleTasksAfterBody.length > 0 && (
          <div className="task-accordion-list">
            {visibleTasksAfterBody.map((task) => renderTaskHeader(task.key, task.title, task.status, task.progress))}
          </div>
        )}
      </div>

      <div className="panel section-panel">
        <h3>1B. Crea sopralluogo</h3>
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
    </>
  );
}
