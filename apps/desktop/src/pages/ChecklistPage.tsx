import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import {
  ChecklistItem,
  ChecklistTemplate,
  Company,
  Inspection,
  InspectionDocumentRequirement,
  InspectionSummary,
  createCompany,
  createInspection,
  downloadGeneratedDocument,
  fetchChecklistItems,
  fetchChecklistTemplates,
  fetchInspectionDocumentRequirements,
  fetchInspectionSummary,
  generateAttestatoPdf,
  generateInspectionReportPdf,
  saveInspectionAnswers,
  sendInspectionToAdmin,
  upsertInspectionDocuments,
  updateCompany,
  validateInspection,
} from "../api";
import { queueSyncEvent } from "../services/syncManager";
import Step0DatiAzienda from "./checklist/Step0DatiAzienda";
import Step1Documenti from "./checklist/Step1Documenti";
import Step2LocaliAttrezzature from "./checklist/Step2LocaliAttrezzature";
import Step3ProcedureIgiene from "./checklist/Step3ProcedureIgiene";
import Step4AssetAttrezzature from "./checklist/Step4AssetAttrezzature";
import Step5Formazione from "./checklist/Step5Formazione";
import Step6RiepilogoInvio from "./checklist/Step6RiepilogoInvio";
import {
  ACTIVITY_TYPE_OPTIONS,
  ActivityTypeOption,
  AnswerValue,
  ChecklistActivityFilter,
  HYPERMARKET_INTERNAL_SCOPE_OPTIONS,
  InspectionChecklistMode,
  LocalAnswer,
  PersonCardData,
  RegistrationTaskKey,
  RolePersonCardData,
  STEPS,
  SUPERMARKET_INTERNAL_SCOPE_OPTIONS,
  atecoFromActivity,
  companyActivitiesStorageKey,
  defaultAnswer,
  emptyPersonCard,
  emptyRolePersonCard,
  hasPersonContent,
  inferActivitiesFromAteco,
  parseCompanyActivities,
  parsePersonCard,
  parseRetailAdditionalScopes,
  parseRolePersonCards,
  retailScopesStorageKey,
} from "./checklist/_shared";

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
  onOpenQr?: (assetId: string, kind: "equipment" | "machine" | "extinguisher" | "firstAid") => void;
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
  onOpenQr,
}: ChecklistPageProps) {
  const [step, setStep] = useState(0);
  const [companyId, setCompanyId] = useState<string>(initialCompanyId ?? companies[0]?.id ?? "");
  const [companySearchQuery, setCompanySearchQuery] = useState("");
  const [isNewCompanyDraft, setIsNewCompanyDraft] = useState<boolean>(companies.length === 0);
  const [selectedInspectionId, setSelectedInspectionId] = useState<string>(initialInspectionId ?? "");
  const [title, setTitle] = useState("Sopralluogo Antisanzione");
  const [newInspectionChecklistMode, setNewInspectionChecklistMode] = useState<InspectionChecklistMode>("unified");

  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [allItems, setAllItems] = useState<ChecklistItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({});
  const [documents, setDocuments] = useState<InspectionDocumentRequirement[]>([]);
  const [summary, setSummary] = useState<InspectionSummary | null>(null);

  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyVat, setNewCompanyVat] = useState("");
  const [newCompanyLegalForm, setNewCompanyLegalForm] = useState("");
  const [newCompanyReaNumber, setNewCompanyReaNumber] = useState("");
  const [newCompanyEmployeesInfo, setNewCompanyEmployeesInfo] = useState("");
  const [newCompanyEmail, setNewCompanyEmail] = useState("");
  const [newCompanyPec, setNewCompanyPec] = useState("");
  const [newCompanyPhone, setNewCompanyPhone] = useState("");
  const [newCompanyAteco, setNewCompanyAteco] = useState("56.10.11");
  const [newCompanyRiskLevel, setNewCompanyRiskLevel] = useState("");
  const [newCompanyDescription, setNewCompanyDescription] = useState("");
  const [newCompanyLegalAddress, setNewCompanyLegalAddress] = useState("");
  const [newCompanyLocalUnitAddress, setNewCompanyLocalUnitAddress] = useState("");
  const [newCompanyPreventionSubjects, setNewCompanyPreventionSubjects] = useState("");
  const [newCompanyEmployerRsppPreposto, setNewCompanyEmployerRsppPreposto] = useState<PersonCardData>(emptyPersonCard());
  const [newCompanyOccupationalDoctor, setNewCompanyOccupationalDoctor] = useState<PersonCardData>(emptyPersonCard());
  const [newCompanyRls, setNewCompanyRls] = useState<PersonCardData>(emptyPersonCard());
  const [newCompanyEmergencyTeam, setNewCompanyEmergencyTeam] = useState<PersonCardData[]>([]);
  const [newCompanyFirstAidTeam, setNewCompanyFirstAidTeam] = useState<PersonCardData[]>([]);
  const [newCompanyHaccpResponsabileAutocontrollo, setNewCompanyHaccpResponsabileAutocontrollo] =
    useState<PersonCardData>(emptyPersonCard());
  const [newCompanyHaccpConsulenteEsterno, setNewCompanyHaccpConsulenteEsterno] = useState<PersonCardData>(emptyPersonCard());
  const [newCompanyHaccpAdditionalRoles, setNewCompanyHaccpAdditionalRoles] = useState<RolePersonCardData[]>([]);
  const [newCompanyHaccpCustomRole, setNewCompanyHaccpCustomRole] = useState("");
  const [newCompanyActivities, setNewCompanyActivities] = useState<ActivityTypeOption[]>(["restaurant"]);
  const [newCompanyCity, setNewCompanyCity] = useState("");
  const [newCompanyRetailScopes, setNewCompanyRetailScopes] = useState<string[]>([]);
  const [activeRegistrationTask, setActiveRegistrationTask] = useState<RegistrationTaskKey | null>(null);
  const [taskLastSavedAt, setTaskLastSavedAt] = useState<Partial<Record<RegistrationTaskKey, string>>>({});
  const [checklistActivityFilter, setChecklistActivityFilter] = useState<ChecklistActivityFilter>("company");
  const [customChecklistAteco, setCustomChecklistAteco] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const previousSelectedCompanyIdRef = useRef<string | null>(null);
  const skipNextRegistrationResetRef = useRef(false);

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

  const filteredCompanyMatches = useMemo(() => {
    const query = companySearchQuery.trim().toLowerCase();
    if (!query) {
      return companies.slice(0, 10);
    }
    return companies
      .filter((company) => {
        const name = company.name?.toLowerCase() ?? "";
        const vat = company.vatNumber?.toLowerCase() ?? "";
        const ateco = company.atecoCode?.toLowerCase() ?? "";
        const city = company.city?.toLowerCase() ?? "";
        return name.includes(query) || vat.includes(query) || ateco.includes(query) || city.includes(query);
      })
      .slice(0, 20);
  }, [companies, companySearchQuery]);

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
  const isInspectionValidated = selectedInspection?.status === "validated";
  const showSafetyRoleBlock = effectiveChecklistMode !== "haccp_only";
  const showHaccpRoleBlock = effectiveChecklistMode !== "safety_only";
  const isHypermarketAteco = /^47\.11\.1(\.|$)/.test(newCompanyAteco.trim());
  const isRetailLargeFoodAteco = /^47\.11(\.|$)/.test(newCompanyAteco.trim());
  const showRetailAdditionalScopes = user.role !== "admin" && isRetailLargeFoodAteco;
  const retailAdditionalScopeOptions = isHypermarketAteco
    ? HYPERMARKET_INTERNAL_SCOPE_OPTIONS
    : SUPERMARKET_INTERNAL_SCOPE_OPTIONS;
  const retailAdditionalScopeValues = useMemo<Set<string>>(
    () => new Set(retailAdditionalScopeOptions.map((option) => option.value)),
    [retailAdditionalScopeOptions],
  );
  const effectiveRetailScopes = user.role === "admin" ? [] : newCompanyRetailScopes;

  const generalProgress = useMemo(() => {
    const fields = [
      newCompanyName,
      newCompanyVat,
      newCompanyLegalForm,
      newCompanyReaNumber,
      newCompanyEmployeesInfo,
      newCompanyEmail,
      newCompanyPec,
      newCompanyPhone,
      newCompanyAteco,
      newCompanyRiskLevel,
      newCompanyDescription,
      newCompanyLegalAddress,
      newCompanyLocalUnitAddress,
      newCompanyCity,
    ];
    const completed = fields.filter((value) => value.trim().length > 0).length;
    return { total: fields.length, completed };
  }, [
    newCompanyName,
    newCompanyVat,
    newCompanyLegalForm,
    newCompanyReaNumber,
    newCompanyEmployeesInfo,
    newCompanyEmail,
    newCompanyPec,
    newCompanyPhone,
    newCompanyAteco,
    newCompanyRiskLevel,
    newCompanyDescription,
    newCompanyLegalAddress,
    newCompanyLocalUnitAddress,
    newCompanyCity,
  ]);

  const safetyProgress = useMemo(() => {
    if (!showSafetyRoleBlock) return { total: 0, completed: 0 };
    const checks = [
      hasPersonContent(newCompanyEmployerRsppPreposto),
      hasPersonContent(newCompanyOccupationalDoctor),
      hasPersonContent(newCompanyRls),
      newCompanyEmergencyTeam.some((item) => hasPersonContent(item)),
      newCompanyFirstAidTeam.some((item) => hasPersonContent(item)),
    ];
    return { total: checks.length, completed: checks.filter(Boolean).length };
  }, [
    showSafetyRoleBlock,
    newCompanyEmployerRsppPreposto,
    newCompanyOccupationalDoctor,
    newCompanyRls,
    newCompanyEmergencyTeam,
    newCompanyFirstAidTeam,
  ]);

  const haccpProgress = useMemo(() => {
    if (!showHaccpRoleBlock) return { total: 0, completed: 0 };
    const checks = [
      hasPersonContent(newCompanyHaccpResponsabileAutocontrollo),
      hasPersonContent(newCompanyHaccpConsulenteEsterno),
      newCompanyHaccpAdditionalRoles.some((item) => item.role.trim() || hasPersonContent(item)),
    ];
    return { total: checks.length, completed: checks.filter(Boolean).length };
  }, [
    showHaccpRoleBlock,
    newCompanyHaccpResponsabileAutocontrollo,
    newCompanyHaccpConsulenteEsterno,
    newCompanyHaccpAdditionalRoles,
  ]);

  const premisesItems = useMemo(
    () => allItems.filter((item) => item.section === "premises_equipment"),
    [allItems],
  );
  const procedureItems = useMemo(
    () => allItems.filter((item) => item.section === "procedures_hygiene"),
    [allItems],
  );

  useEffect(() => {
    if (!companyId && companies[0] && !isNewCompanyDraft) {
      setCompanyId(companies[0].id);
    }
  }, [companies, companyId, isNewCompanyDraft]);

  useEffect(() => {
    if (!initialCompanyId) return;
    setIsNewCompanyDraft(false);
    setCompanyId(initialCompanyId);
  }, [initialCompanyId, selectionToken]);

  useEffect(() => {
    if (selectionToken === undefined) return;
    setSelectedInspectionId(initialInspectionId ?? "");
  }, [initialInspectionId, selectionToken]);

  useEffect(() => {
    if (isNewCompanyDraft) {
      previousSelectedCompanyIdRef.current = null;
      return;
    }
    if (!selectedCompany) return;
    const companyChanged = previousSelectedCompanyIdRef.current !== selectedCompany.id;
    previousSelectedCompanyIdRef.current = selectedCompany.id;

    setNewCompanyName(selectedCompany.name ?? "");
    setNewCompanyVat(selectedCompany.vatNumber ?? "");
    setNewCompanyLegalForm(selectedCompany.legalForm ?? "");
    setNewCompanyReaNumber(selectedCompany.reaNumber ?? "");
    setNewCompanyEmployeesInfo(selectedCompany.employeesInfo ?? "");
    setNewCompanyEmail(selectedCompany.email ?? "");
    setNewCompanyPec(selectedCompany.pec ?? "");
    setNewCompanyPhone(selectedCompany.phone ?? "");
    setNewCompanyAteco(selectedCompany.atecoCode ?? "");
    setNewCompanyRiskLevel(selectedCompany.riskLevel ?? "");
    setNewCompanyDescription(selectedCompany.description ?? "");
    setNewCompanyLegalAddress(selectedCompany.legalAddress ?? "");
    setNewCompanyLocalUnitAddress(selectedCompany.localUnitAddress ?? "");
    setNewCompanyPreventionSubjects(selectedCompany.preventionSystemSubjects ?? "");
    setNewCompanyEmployerRsppPreposto(parsePersonCard(selectedCompany.employerRsppPreposto));
    setNewCompanyOccupationalDoctor(parsePersonCard(selectedCompany.occupationalDoctor));
    setNewCompanyRls(parsePersonCard(selectedCompany.rls));
    setNewCompanyEmergencyTeam(parseRolePersonCards(selectedCompany.emergencyTeam).map(({ role: _role, ...rest }) => rest));
    setNewCompanyFirstAidTeam(parseRolePersonCards(selectedCompany.firstAidTeam).map(({ role: _role, ...rest }) => rest));
    setNewCompanyHaccpResponsabileAutocontrollo(parsePersonCard(selectedCompany.haccpResponsabileAutocontrollo));
    setNewCompanyHaccpConsulenteEsterno(parsePersonCard(selectedCompany.haccpConsulenteEsterno));
    setNewCompanyHaccpAdditionalRoles(parseRolePersonCards(selectedCompany.haccpAdditionalResponsabili));
    setNewCompanyCity(selectedCompany.city ?? "");
    if (typeof window !== "undefined") {
      const rawActivities = window.localStorage.getItem(companyActivitiesStorageKey(selectedCompany.id));
      const parsedActivities = parseCompanyActivities(rawActivities);
      setNewCompanyActivities(
        parsedActivities.length > 0 ? parsedActivities : inferActivitiesFromAteco(selectedCompany.atecoCode),
      );
    } else {
      setNewCompanyActivities(inferActivitiesFromAteco(selectedCompany.atecoCode));
    }
    if (user.role === "admin") {
      setNewCompanyRetailScopes([]);
    } else if (typeof window !== "undefined") {
      const rawScopes = window.localStorage.getItem(retailScopesStorageKey(selectedCompany.id));
      setNewCompanyRetailScopes(parseRetailAdditionalScopes(rawScopes));
    } else {
      setNewCompanyRetailScopes([]);
    }
    if (!companyChanged) return;
    if (skipNextRegistrationResetRef.current) {
      skipNextRegistrationResetRef.current = false;
      return;
    }
    setTaskLastSavedAt({});
    setActiveRegistrationTask(null);
  }, [selectedCompany, isNewCompanyDraft, user.role]);

  useEffect(() => {
    if (!companyId) return;
    const latest = inspectionsForCompany[0];
    setSelectedInspectionId((current) => current || latest?.id || "");
  }, [companyId, inspectionsForCompany]);

  useEffect(() => {
    setChecklistActivityFilter("company");
    setCustomChecklistAteco("");
  }, [companyId]);

  useEffect(() => {
    if (!showRetailAdditionalScopes) {
      if (newCompanyRetailScopes.length > 0) setNewCompanyRetailScopes([]);
      return;
    }
    setNewCompanyRetailScopes((current) => {
      const filtered = current.filter((value) => retailAdditionalScopeValues.has(value));
      return filtered.length === current.length ? current : filtered;
    });
  }, [showRetailAdditionalScopes, retailAdditionalScopeValues, newCompanyRetailScopes.length]);

  useEffect(() => {
    if (!selectedCompany?.id) return;
    if (typeof window === "undefined") return;
    const storageKey = companyActivitiesStorageKey(selectedCompany.id);
    if (newCompanyActivities.length === 0) {
      window.localStorage.removeItem(storageKey);
      return;
    }
    window.localStorage.setItem(storageKey, JSON.stringify(newCompanyActivities));
  }, [selectedCompany?.id, newCompanyActivities]);

  useEffect(() => {
    if (user.role === "admin") return;
    if (!selectedCompany?.id) return;
    if (typeof window === "undefined") return;
    const storageKey = retailScopesStorageKey(selectedCompany.id);
    if (!isRetailLargeFoodAteco || newCompanyRetailScopes.length === 0) {
      window.localStorage.removeItem(storageKey);
      return;
    }
    window.localStorage.setItem(storageKey, JSON.stringify(newCompanyRetailScopes));
  }, [user.role, selectedCompany?.id, isRetailLargeFoodAteco, newCompanyRetailScopes]);

  useEffect(() => {
    async function loadChecklistTemplates() {
      if (!companyId) return;

      const nextTemplates = await fetchChecklistTemplates(
        token,
        effectiveChecklistAteco,
        effectiveChecklistMode,
        effectiveRetailScopes,
      );
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
  }, [token, companyId, effectiveChecklistAteco, effectiveChecklistMode, effectiveRetailScopes, selectedInspection?.answers]);

  useEffect(() => {
    async function loadDocumentsAndSummary() {
      if (!selectedInspectionId) {
        setDocuments([]);
        setSummary(null);
        return;
      }

      const [requirements, nextSummary] = await Promise.all([
        fetchInspectionDocumentRequirements(token, selectedInspectionId, effectiveRetailScopes),
        fetchInspectionSummary(token, selectedInspectionId),
      ]);
      setDocuments(requirements);
      setSummary(nextSummary);
    }

    loadDocumentsAndSummary().catch((error) => {
      setMessage(`Errore caricamento dettaglio sopralluogo: ${error instanceof Error ? error.message : "errore"}`);
    });
  }, [token, selectedInspectionId, effectiveRetailScopes]);

  function updateAnswer(itemId: string, partial: Partial<LocalAnswer>) {
    setAnswers((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        ...partial,
      },
    }));
  }

  function selectExistingCompanyForInspection(nextCompanyId: string) {
    setIsNewCompanyDraft(false);
    setCompanyId(nextCompanyId);
    setSelectedInspectionId("");
    setStep(0);
  }

  function handleCompanySearchChange(value: string) {
    setCompanySearchQuery(value);
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return;
    }
    const exact = companies.find((company) => {
      const name = company.name?.trim().toLowerCase() ?? "";
      const vat = company.vatNumber?.trim().toLowerCase() ?? "";
      return name === normalized || vat === normalized;
    });
    if (exact) {
      selectExistingCompanyForInspection(exact.id);
    }
  }

  function resetCompanyRegistrationForm() {
    setNewCompanyName("");
    setNewCompanyVat("");
    setNewCompanyLegalForm("");
    setNewCompanyReaNumber("");
    setNewCompanyEmployeesInfo("");
    setNewCompanyEmail("");
    setNewCompanyPec("");
    setNewCompanyPhone("");
    setNewCompanyAteco("56.10.11");
    setNewCompanyRiskLevel("");
    setNewCompanyDescription("");
    setNewCompanyLegalAddress("");
    setNewCompanyLocalUnitAddress("");
    setNewCompanyPreventionSubjects("");
    setNewCompanyEmployerRsppPreposto(emptyPersonCard());
    setNewCompanyOccupationalDoctor(emptyPersonCard());
    setNewCompanyRls(emptyPersonCard());
    setNewCompanyEmergencyTeam([]);
    setNewCompanyFirstAidTeam([]);
    setNewCompanyHaccpResponsabileAutocontrollo(emptyPersonCard());
    setNewCompanyHaccpConsulenteEsterno(emptyPersonCard());
    setNewCompanyHaccpAdditionalRoles([]);
    setNewCompanyHaccpCustomRole("");
    setNewCompanyActivities(["restaurant"]);
    setNewCompanyCity("");
    setNewCompanyRetailScopes([]);
    setTaskLastSavedAt({});
    setActiveRegistrationTask(null);
  }

  function openRegistrationTask(taskKey: RegistrationTaskKey) {
    setActiveRegistrationTask(taskKey);
  }

  function updatePersonCard(
    setValue: Dispatch<SetStateAction<PersonCardData>>,
    key: keyof PersonCardData,
    value: string,
  ) {
    setValue((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function addPersonToList(setter: Dispatch<SetStateAction<PersonCardData[]>>) {
    setter((current) => [...current, emptyPersonCard()]);
  }

  function updatePersonListItem(
    setter: Dispatch<SetStateAction<PersonCardData[]>>,
    index: number,
    key: keyof PersonCardData,
    value: string,
  ) {
    setter((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );
  }

  function removePersonListItem(setter: Dispatch<SetStateAction<PersonCardData[]>>, index: number) {
    setter((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function toggleHaccpAdditionalRole(role: string) {
    setNewCompanyHaccpAdditionalRoles((current) => {
      const exists = current.some((item) => item.role.toLowerCase() === role.toLowerCase());
      if (exists) {
        return current.filter((item) => item.role.toLowerCase() !== role.toLowerCase());
      }
      return [...current, emptyRolePersonCard(role)];
    });
  }

  function addCustomHaccpRole() {
    const next = newCompanyHaccpCustomRole.trim();
    if (!next) return;
    setNewCompanyHaccpAdditionalRoles((current) =>
      current.some((item) => item.role.toLowerCase() === next.toLowerCase()) ? current : [...current, emptyRolePersonCard(next)],
    );
    setNewCompanyHaccpCustomRole("");
  }

  function updateHaccpAdditionalRole(index: number, key: keyof RolePersonCardData, value: string) {
    setNewCompanyHaccpAdditionalRoles((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );
  }

  function removeHaccpAdditionalRole(index: number) {
    setNewCompanyHaccpAdditionalRoles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function optionalText(value: string) {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  function taskStatus(
    completed: number,
    total: number,
    isRequired: boolean,
  ): "Da compilare" | "In corso" | "Completata" | "Non richiesta" {
    if (!isRequired) return "Non richiesta";
    if (completed === 0) return "Da compilare";
    if (completed >= total) return "Completata";
    return "In corso";
  }

  async function saveGeneralTask() {
    if (!newCompanyName.trim() || !newCompanyVat.trim()) {
      throw new Error("Inserisci almeno ragione sociale e partita IVA.");
    }

    const payload = {
      name: newCompanyName.trim(),
      vatNumber: newCompanyVat.trim(),
      legalForm: optionalText(newCompanyLegalForm),
      reaNumber: optionalText(newCompanyReaNumber),
      employeesInfo: optionalText(newCompanyEmployeesInfo),
      email: optionalText(newCompanyEmail),
      pec: optionalText(newCompanyPec),
      phone: optionalText(newCompanyPhone),
      atecoCode: optionalText(newCompanyAteco),
      riskLevel: optionalText(newCompanyRiskLevel),
      description: optionalText(newCompanyDescription),
      legalAddress: optionalText(newCompanyLegalAddress),
      localUnitAddress: optionalText(newCompanyLocalUnitAddress),
      city: optionalText(newCompanyCity),
    };

    const currentCompanyId = isNewCompanyDraft ? undefined : selectedCompany?.id ?? companyId;
    const savedCompany = currentCompanyId
      ? await updateCompany(token, currentCompanyId, payload)
      : await createCompany(token, payload);

    queueSyncEvent({
      eventType: currentCompanyId ? "company.updated" : "company.created",
      entityType: "company",
      entityId: savedCompany.id,
      payload: savedCompany,
    });
    if (typeof window !== "undefined") {
      const activitiesStorageKey = companyActivitiesStorageKey(savedCompany.id);
      if (newCompanyActivities.length > 0) {
        window.localStorage.setItem(activitiesStorageKey, JSON.stringify(newCompanyActivities));
      } else {
        window.localStorage.removeItem(activitiesStorageKey);
      }
    }
    if (user.role !== "admin" && typeof window !== "undefined") {
      const storageKey = retailScopesStorageKey(savedCompany.id);
      if (/^47\.11(\.|$)/.test((savedCompany.atecoCode ?? "").trim()) && newCompanyRetailScopes.length > 0) {
        window.localStorage.setItem(storageKey, JSON.stringify(newCompanyRetailScopes));
      } else {
        window.localStorage.removeItem(storageKey);
      }
    }
    await onReload();
    setIsNewCompanyDraft(false);
    setCompanyId(savedCompany.id);
    setTaskLastSavedAt((current) => ({
      ...current,
      general: new Date().toLocaleString("it-IT"),
    }));
    setMessage("Task Dati Generali salvata.");
  }

  async function saveSafetyTask() {
    const currentCompanyId = isNewCompanyDraft ? undefined : selectedCompany?.id ?? companyId;
    if (!currentCompanyId) {
      throw new Error("Salva prima i Dati Generali.");
    }
    const payload = {
      preventionSystemSubjects: optionalText(newCompanyPreventionSubjects),
      employerRsppPreposto: showSafetyRoleBlock ? JSON.stringify(newCompanyEmployerRsppPreposto) : undefined,
      occupationalDoctor: showSafetyRoleBlock ? JSON.stringify(newCompanyOccupationalDoctor) : undefined,
      rls: showSafetyRoleBlock ? JSON.stringify(newCompanyRls) : undefined,
      emergencyTeam: showSafetyRoleBlock ? JSON.stringify(newCompanyEmergencyTeam) : undefined,
      firstAidTeam: showSafetyRoleBlock ? JSON.stringify(newCompanyFirstAidTeam) : undefined,
    };
    const savedCompany = await updateCompany(token, currentCompanyId, payload);
    queueSyncEvent({
      eventType: "company.updated",
      entityType: "company",
      entityId: savedCompany.id,
      payload: { task: "safety" },
    });
    await onReload();
    setTaskLastSavedAt((current) => ({
      ...current,
      safety: new Date().toLocaleString("it-IT"),
    }));
    setMessage("Task Soggetti Sicurezza salvata.");
  }

  async function saveHaccpTask() {
    const currentCompanyId = isNewCompanyDraft ? undefined : selectedCompany?.id ?? companyId;
    if (!currentCompanyId) {
      throw new Error("Salva prima i Dati Generali.");
    }
    const payload = {
      preventionSystemSubjects: optionalText(newCompanyPreventionSubjects),
      haccpResponsabileAutocontrollo: showHaccpRoleBlock ? JSON.stringify(newCompanyHaccpResponsabileAutocontrollo) : undefined,
      haccpConsulenteEsterno: showHaccpRoleBlock ? JSON.stringify(newCompanyHaccpConsulenteEsterno) : undefined,
      haccpAdditionalResponsabili: showHaccpRoleBlock ? JSON.stringify(newCompanyHaccpAdditionalRoles) : undefined,
    };
    const savedCompany = await updateCompany(token, currentCompanyId, payload);
    queueSyncEvent({
      eventType: "company.updated",
      entityType: "company",
      entityId: savedCompany.id,
      payload: { task: "haccp" },
    });
    await onReload();
    setTaskLastSavedAt((current) => ({
      ...current,
      haccp: new Date().toLocaleString("it-IT"),
    }));
    setMessage("Task Soggetti HACCP salvata.");
  }

  async function handleSaveRegistrationTask(taskKey: RegistrationTaskKey, moveNext = true) {
    const preserveTaskNavigationOnSave = taskKey === "general" && moveNext && isNewCompanyDraft;
    if (preserveTaskNavigationOnSave) {
      skipNextRegistrationResetRef.current = true;
    }
    setLoading(true);
    setMessage("");
    try {
      if (taskKey === "general") {
        await saveGeneralTask();
        if (moveNext) {
          if (showSafetyRoleBlock) {
            openRegistrationTask("safety");
          } else if (showHaccpRoleBlock) {
            openRegistrationTask("haccp");
          } else {
            setActiveRegistrationTask(null);
          }
        }
      } else if (taskKey === "safety") {
        if (showSafetyRoleBlock) {
          await saveSafetyTask();
        }
        if (moveNext) {
          if (showHaccpRoleBlock) {
            openRegistrationTask("haccp");
          } else {
            setActiveRegistrationTask(null);
          }
        }
      } else {
        if (showHaccpRoleBlock) {
          await saveHaccpTask();
        }
        if (moveNext) setActiveRegistrationTask(null);
      }
    } catch (error) {
      if (preserveTaskNavigationOnSave) {
        skipNextRegistrationResetRef.current = false;
      }
      setMessage(error instanceof Error ? error.message : "Errore salvataggio task.");
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
    if (isInspectionValidated) {
      setMessage("Sopralluogo validato: checklist in sola lettura.");
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
      if (!isInspectionValidated) {
        await Promise.all([saveDocuments(), saveAnswers()]);
      }
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
    if (isInspectionValidated) {
      setMessage("Sopralluogo gia validato.");
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
      const isValidated = selectedInspection?.status === "validated";
      if (!isValidated) {
        try {
          await saveDocuments();
        } catch (error) {
          setMessage(`Errore salvataggio documenti prima del verbale: ${error instanceof Error ? error.message : "errore"}`);
          return;
        }
        try {
          await saveAnswers();
        } catch (error) {
          setMessage(`Errore salvataggio risposte prima del verbale: ${error instanceof Error ? error.message : "errore"}`);
          return;
        }
      }

      const generated = await generateInspectionReportPdf(token, selectedInspectionId);
      try {
        await downloadGeneratedDocument(token, generated.id, generated.fileName);
      } catch (downloadError) {
        setMessage(
          `Verbale generato ma download fallito: ${
            downloadError instanceof Error ? downloadError.message : "errore"
          }`,
        );
        return;
      }
      queueSyncEvent({
        eventType: "document.generated",
        entityType: "inspection",
        entityId: selectedInspectionId,
        payload: { kind: "inspection_report" },
      });
      setMessage("Verbale cliente generato e scaricato.");
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
      const isValidated = selectedInspection?.status === "validated";
      if (!isValidated) {
        await Promise.all([saveDocuments(), saveAnswers()]);
      }
      const generated = await generateAttestatoPdf(token, selectedInspectionId);
      try {
        await downloadGeneratedDocument(token, generated.id, generated.fileName);
      } catch (downloadError) {
        setMessage(
          `Attestato generato ma download fallito: ${
            downloadError instanceof Error ? downloadError.message : "errore"
          }`,
        );
        return;
      }
      queueSyncEvent({
        eventType: "document.generated",
        entityType: "inspection",
        entityId: selectedInspectionId,
        payload: { kind: "attestato" },
      });
      setMessage("Attestato compliance generato e scaricato.");
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
                      disabled={isInspectionValidated}
                      onChange={(event) => updateAnswer(item.id, { value: event.target.value as AnswerValue })}
                    >
                      <option value="yes">SI</option>
                      <option value="no">NO</option>
                      <option value="na">NA</option>
                    </select>
                  </td>
                  <td>
                    <input
                      value={answer.note}
                      disabled={isInspectionValidated}
                      onChange={(event) => updateAnswer(item.id, { note: event.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      disabled={isInspectionValidated}
                      value={answer.severity ?? 1}
                      onChange={(event) => updateAnswer(item.id, { severity: Number(event.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={Boolean(answer.isSanctionable)}
                      disabled={answer.value !== "no" || isInspectionValidated}
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

  const generalTaskStatus = taskStatus(generalProgress.completed, generalProgress.total, true);
  const safetyTaskStatus = taskStatus(safetyProgress.completed, safetyProgress.total, showSafetyRoleBlock);
  const haccpTaskStatus = taskStatus(haccpProgress.completed, haccpProgress.total, showHaccpRoleBlock);

  const registrationTasks: Array<{
    key: RegistrationTaskKey;
    title: string;
    status: string;
    progress: { completed: number; total: number };
  }> = [
    { key: "general", title: "Dati Generali", status: generalTaskStatus, progress: generalProgress },
    { key: "safety", title: "Soggetti Sicurezza", status: safetyTaskStatus, progress: safetyProgress },
    { key: "haccp", title: "Soggetti Igiene Alimenti (HACCP)", status: haccpTaskStatus, progress: haccpProgress },
  ];

  const registrationTaskSequence: RegistrationTaskKey[] = ["general", "safety", "haccp"];
  const activeTaskIndex =
    activeRegistrationTask !== null ? registrationTaskSequence.indexOf(activeRegistrationTask) : -1;
  const visibleTasksBeforeBody =
    activeTaskIndex >= 0 ? registrationTasks.slice(0, activeTaskIndex + 1) : registrationTasks;
  const visibleTasksAfterBody = activeTaskIndex >= 0 ? registrationTasks.slice(activeTaskIndex + 1) : [];

  function moveRegistrationTask(currentKey: RegistrationTaskKey, direction: -1 | 1) {
    const currentIndex = registrationTaskSequence.indexOf(currentKey);
    if (currentIndex < 0) return;
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= registrationTaskSequence.length) return;
    openRegistrationTask(registrationTaskSequence[nextIndex]);
  }

  function closeRegistrationTaskPanel() {
    setActiveRegistrationTask(null);
  }

  function renderTaskHeader(
    taskKey: RegistrationTaskKey,
    title: string,
    status: string,
    progress: { completed: number; total: number },
  ) {
    const isOpen = activeRegistrationTask === taskKey;
    const lastSaved = taskLastSavedAt[taskKey];
    return (
      <button
        type="button"
        className={`task-accordion-header ${isOpen ? "task-accordion-header-active" : ""}`}
        onClick={() => openRegistrationTask(taskKey)}
      >
        <span>{title}</span>
        <span className="task-accordion-meta">
          {status} • {progress.completed}/{progress.total}
          {lastSaved ? ` • salvata ${lastSaved}` : ""}
        </span>
      </button>
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

      {isInspectionValidated && (
        <div className="status-banner status-banner-warning" style={{ marginTop: 10 }}>
          Sopralluogo validato: modifica checklist e documenti disabilitata (sola lettura).
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
        <Step0DatiAzienda
          companies={companies}
          selectedCompany={selectedCompany}
          companyId={companyId}
          setCompanyId={setCompanyId}
          isNewCompanyDraft={isNewCompanyDraft}
          setIsNewCompanyDraft={setIsNewCompanyDraft}
          companySearchQuery={companySearchQuery}
          setCompanySearchQuery={setCompanySearchQuery}
          setSelectedInspectionId={setSelectedInspectionId}
          filteredCompanyMatches={filteredCompanyMatches}
          selectExistingCompanyForInspection={selectExistingCompanyForInspection}
          handleCompanySearchChange={handleCompanySearchChange}
          resetCompanyRegistrationForm={resetCompanyRegistrationForm}
          visibleTasksBeforeBody={visibleTasksBeforeBody}
          visibleTasksAfterBody={visibleTasksAfterBody}
          activeRegistrationTask={activeRegistrationTask}
          renderTaskHeader={renderTaskHeader}
          handleSaveRegistrationTask={handleSaveRegistrationTask}
          moveRegistrationTask={moveRegistrationTask}
          closeRegistrationTaskPanel={closeRegistrationTaskPanel}
          newCompanyName={newCompanyName}
          setNewCompanyName={setNewCompanyName}
          newCompanyVat={newCompanyVat}
          setNewCompanyVat={setNewCompanyVat}
          newCompanyLegalForm={newCompanyLegalForm}
          setNewCompanyLegalForm={setNewCompanyLegalForm}
          newCompanyReaNumber={newCompanyReaNumber}
          setNewCompanyReaNumber={setNewCompanyReaNumber}
          newCompanyEmployeesInfo={newCompanyEmployeesInfo}
          setNewCompanyEmployeesInfo={setNewCompanyEmployeesInfo}
          newCompanyEmail={newCompanyEmail}
          setNewCompanyEmail={setNewCompanyEmail}
          newCompanyPec={newCompanyPec}
          setNewCompanyPec={setNewCompanyPec}
          newCompanyPhone={newCompanyPhone}
          setNewCompanyPhone={setNewCompanyPhone}
          newCompanyAteco={newCompanyAteco}
          setNewCompanyAteco={setNewCompanyAteco}
          newCompanyRiskLevel={newCompanyRiskLevel}
          setNewCompanyRiskLevel={setNewCompanyRiskLevel}
          newCompanyDescription={newCompanyDescription}
          setNewCompanyDescription={setNewCompanyDescription}
          newCompanyLegalAddress={newCompanyLegalAddress}
          setNewCompanyLegalAddress={setNewCompanyLegalAddress}
          newCompanyLocalUnitAddress={newCompanyLocalUnitAddress}
          setNewCompanyLocalUnitAddress={setNewCompanyLocalUnitAddress}
          newCompanyCity={newCompanyCity}
          setNewCompanyCity={setNewCompanyCity}
          newCompanyActivities={newCompanyActivities}
          setNewCompanyActivities={setNewCompanyActivities}
          newCompanyRetailScopes={newCompanyRetailScopes}
          setNewCompanyRetailScopes={setNewCompanyRetailScopes}
          showRetailAdditionalScopes={showRetailAdditionalScopes}
          retailAdditionalScopeOptions={retailAdditionalScopeOptions}
          showSafetyRoleBlock={showSafetyRoleBlock}
          newCompanyEmployerRsppPreposto={newCompanyEmployerRsppPreposto}
          setNewCompanyEmployerRsppPreposto={setNewCompanyEmployerRsppPreposto}
          newCompanyOccupationalDoctor={newCompanyOccupationalDoctor}
          setNewCompanyOccupationalDoctor={setNewCompanyOccupationalDoctor}
          newCompanyRls={newCompanyRls}
          setNewCompanyRls={setNewCompanyRls}
          newCompanyEmergencyTeam={newCompanyEmergencyTeam}
          setNewCompanyEmergencyTeam={setNewCompanyEmergencyTeam}
          newCompanyFirstAidTeam={newCompanyFirstAidTeam}
          setNewCompanyFirstAidTeam={setNewCompanyFirstAidTeam}
          updatePersonCard={updatePersonCard}
          addPersonToList={addPersonToList}
          updatePersonListItem={updatePersonListItem}
          removePersonListItem={removePersonListItem}
          showHaccpRoleBlock={showHaccpRoleBlock}
          newCompanyHaccpResponsabileAutocontrollo={newCompanyHaccpResponsabileAutocontrollo}
          setNewCompanyHaccpResponsabileAutocontrollo={setNewCompanyHaccpResponsabileAutocontrollo}
          newCompanyHaccpConsulenteEsterno={newCompanyHaccpConsulenteEsterno}
          setNewCompanyHaccpConsulenteEsterno={setNewCompanyHaccpConsulenteEsterno}
          newCompanyHaccpAdditionalRoles={newCompanyHaccpAdditionalRoles}
          newCompanyHaccpCustomRole={newCompanyHaccpCustomRole}
          setNewCompanyHaccpCustomRole={setNewCompanyHaccpCustomRole}
          toggleHaccpAdditionalRole={toggleHaccpAdditionalRole}
          addCustomHaccpRole={addCustomHaccpRole}
          updateHaccpAdditionalRole={updateHaccpAdditionalRole}
          removeHaccpAdditionalRole={removeHaccpAdditionalRole}
          newInspectionChecklistMode={newInspectionChecklistMode}
          setNewInspectionChecklistMode={setNewInspectionChecklistMode}
          title={title}
          setTitle={setTitle}
          handleCreateInspection={handleCreateInspection}
          templates={templates}
          loading={loading}
        />
      )}

      {step === 1 && (
        <Step1Documenti
          documents={documents}
          setDocuments={setDocuments}
          isInspectionValidated={!!isInspectionValidated}
        />
      )}

      {step === 2 && (
        <Step2LocaliAttrezzature
          premisesItems={premisesItems}
          renderAnswersTable={renderAnswersTable}
        />
      )}

      {step === 3 && (
        <Step3ProcedureIgiene
          procedureItems={procedureItems}
          renderAnswersTable={renderAnswersTable}
        />
      )}

      {step === 4 && (
        <Step4AssetAttrezzature
          token={token}
          companyId={selectedCompany?.id ?? companyId}
          onOpenQr={onOpenQr ?? (() => undefined)}
        />
      )}

      {step === 5 && (
        <Step5Formazione
          token={token}
          companyId={selectedCompany?.id ?? companyId}
          companies={companies}
        />
      )}

      {step === 6 && (
        <Step6RiepilogoInvio
          summary={summary}
          loading={loading}
          selectedInspectionId={selectedInspectionId}
          isInspectionValidated={!!isInspectionValidated}
          user={user}
          handleSaveChecklist={handleSaveChecklist}
          handleValidateInspection={handleValidateInspection}
          handleSendToAdmin={handleSendToAdmin}
          handleGenerateVerbale={handleGenerateVerbale}
          handleGenerateAttestato={handleGenerateAttestato}
        />
      )}

      <div className="footer-actions" style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
        {message ? <span className="status-message" style={{ marginRight: "auto" }}>{message}</span> : null}
        <button onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
          Indietro
        </button>
        <button onClick={() => setStep((current) => Math.min(STEPS.length - 1, current + 1))} disabled={step === STEPS.length - 1}>
          Avanti
        </button>
        {step === 0 && activeRegistrationTask ? (
          <button className="secondary-btn" onClick={closeRegistrationTaskPanel} disabled={loading}>
            Chiudi/Riduci task
          </button>
        ) : null}
      </div>
    </section>
  );
}
