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

type RegistrationTaskKey = "general" | "safety" | "haccp";

interface PersonCardData {
  fullName: string;
  taxCode: string;
  contact: string;
  notes: string;
}

interface RolePersonCardData extends PersonCardData {
  role: string;
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
  { value: "bnb_guesthouse", label: "B&B / Affittacamere", atecoCode: "55.20.51" },
  { value: "hostel_residence", label: "Ostello / Residence", atecoCode: "55.20.20" },
  { value: "camping_village", label: "Campeggio / Villaggio turistico", atecoCode: "55.30.00" },
  { value: "beach_club", label: "Stabilimento balneare con somministrazione", atecoCode: "93.29.20" },
  { value: "nightlife_venue", label: "Locale serale / Discoteca con somministrazione", atecoCode: "93.29.10" },
  { value: "pastry", label: "Pasticceria / Gelateria", atecoCode: "56.10.30" },
  { value: "gastronomy_production", label: "Gastronomia / Produzione alimentare", atecoCode: "10.85" },
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

const HACCP_ROLE_OPTIONS = [
  "Responsabile produzione",
  "Responsabile industria alimentare",
  "Responsabile cucina",
  "Responsabile bar",
  "Responsabile pasticceria",
  "Responsabile gelateria",
] as const;

function emptyPersonCard(): PersonCardData {
  return {
    fullName: "",
    taxCode: "",
    contact: "",
    notes: "",
  };
}

function emptyRolePersonCard(role = ""): RolePersonCardData {
  return {
    role,
    ...emptyPersonCard(),
  };
}

function hasPersonContent(person: PersonCardData | RolePersonCardData): boolean {
  return Boolean(person.fullName.trim() || person.taxCode.trim() || person.contact.trim() || person.notes.trim());
}

function parsePersonCard(jsonValue?: string | null): PersonCardData {
  if (!jsonValue) return emptyPersonCard();
  try {
    const parsed = JSON.parse(jsonValue) as Partial<PersonCardData>;
    return {
      fullName: parsed.fullName?.toString() ?? "",
      taxCode: parsed.taxCode?.toString() ?? "",
      contact: parsed.contact?.toString() ?? "",
      notes: parsed.notes?.toString() ?? "",
    };
  } catch {
    return emptyPersonCard();
  }
}

function parseRolePersonCards(jsonValue?: string | null): RolePersonCardData[] {
  if (!jsonValue) return [];
  try {
    const parsed = JSON.parse(jsonValue) as Array<Partial<RolePersonCardData>>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        role: item.role?.toString() ?? "",
        fullName: item.fullName?.toString() ?? "",
        taxCode: item.taxCode?.toString() ?? "",
        contact: item.contact?.toString() ?? "",
        notes: item.notes?.toString() ?? "",
      }))
      .filter((item) => item.role.trim() || hasPersonContent(item));
  } catch {
    return [];
  }
}

function checklistModeLabel(mode?: InspectionChecklistMode) {
  return CHECKLIST_MODE_OPTIONS.find((option) => option.value === mode)?.label ?? "Checklist unificata";
}

function inferActivityFromAteco(atecoCode?: string | null): ActivityTypeOption {
  const normalized = atecoCode?.trim() ?? "";
  if (normalized.startsWith("55.10")) return "hotel";
  if (normalized.startsWith("55.20.51")) return "bnb_guesthouse";
  if (normalized.startsWith("55.20.20")) return "hostel_residence";
  if (normalized.startsWith("55.30")) return "camping_village";
  if (normalized.startsWith("93.29.20")) return "beach_club";
  if (normalized.startsWith("93.29.10")) return "nightlife_venue";
  if (normalized.startsWith("56.10.30")) return "pastry";
  if (normalized.startsWith("56.10.20")) return "pizzeria";
  if (normalized.startsWith("56.29.10")) return "canteen";
  if (normalized.startsWith("56.21.00")) return "event_catering";
  if (normalized.startsWith("56.10.42")) return "food_truck";
  if (normalized.startsWith("56.10.41")) return "ambulant_pastry";
  if (normalized.startsWith("10.85")) return "gastronomy_production";
  if (normalized.startsWith("56.30")) return "bar";
  if (normalized.startsWith("56.10")) return "restaurant";
  return "custom";
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
  const [newCompanyActivity, setNewCompanyActivity] = useState<ActivityTypeOption>("restaurant");
  const [newCompanyCity, setNewCompanyCity] = useState("");
  const [activeRegistrationTask, setActiveRegistrationTask] = useState<RegistrationTaskKey | null>(null);
  const [registrationTaskOrder, setRegistrationTaskOrder] = useState<RegistrationTaskKey[]>([]);
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
      newCompanyPreventionSubjects.trim().length > 0,
      hasPersonContent(newCompanyEmployerRsppPreposto),
      hasPersonContent(newCompanyOccupationalDoctor),
      hasPersonContent(newCompanyRls),
      newCompanyEmergencyTeam.some((item) => hasPersonContent(item)),
      newCompanyFirstAidTeam.some((item) => hasPersonContent(item)),
    ];
    return { total: checks.length, completed: checks.filter(Boolean).length };
  }, [
    showSafetyRoleBlock,
    newCompanyPreventionSubjects,
    newCompanyEmployerRsppPreposto,
    newCompanyOccupationalDoctor,
    newCompanyRls,
    newCompanyEmergencyTeam,
    newCompanyFirstAidTeam,
  ]);

  const haccpProgress = useMemo(() => {
    if (!showHaccpRoleBlock) return { total: 0, completed: 0 };
    const checks = [
      newCompanyPreventionSubjects.trim().length > 0,
      hasPersonContent(newCompanyHaccpResponsabileAutocontrollo),
      hasPersonContent(newCompanyHaccpConsulenteEsterno),
      newCompanyHaccpAdditionalRoles.some((item) => item.role.trim() || hasPersonContent(item)),
    ];
    return { total: checks.length, completed: checks.filter(Boolean).length };
  }, [
    showHaccpRoleBlock,
    newCompanyPreventionSubjects,
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
    setNewCompanyActivity(inferActivityFromAteco(selectedCompany.atecoCode));
    setNewCompanyCity(selectedCompany.city ?? "");
    if (!companyChanged) return;
    if (skipNextRegistrationResetRef.current) {
      skipNextRegistrationResetRef.current = false;
      return;
    }
    setTaskLastSavedAt({});
    setRegistrationTaskOrder([]);
    setActiveRegistrationTask(null);
  }, [selectedCompany, isNewCompanyDraft]);

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
    setNewCompanyActivity("restaurant");
    setNewCompanyCity("");
    setTaskLastSavedAt({});
    setRegistrationTaskOrder([]);
    setActiveRegistrationTask(null);
  }

  function promoteRegistrationTask(taskKey: RegistrationTaskKey) {
    setRegistrationTaskOrder((current) => (current.includes(taskKey) ? current : [...current, taskKey]));
  }

  function openRegistrationTask(taskKey: RegistrationTaskKey) {
    promoteRegistrationTask(taskKey);
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

  const topRegistrationTasks = registrationTaskOrder
    .map((taskKey) => registrationTasks.find((item) => item.key === taskKey))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const bottomRegistrationTasks = registrationTasks.filter(
    (item) => !registrationTaskOrder.includes(item.key),
  );
  const registrationTaskSequence: RegistrationTaskKey[] = ["general", "safety", "haccp"];

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
            {topRegistrationTasks.length > 0 && (
              <div className="task-accordion-list">
                {topRegistrationTasks.map((task) =>
                  renderTaskHeader(task.key, task.title, task.status, task.progress),
                )}
              </div>
            )}
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
                  <div>
                    <label>Tipo attivita</label>
                    <select
                      value={newCompanyActivity}
                      onChange={(event) => {
                        const next = event.target.value as ActivityTypeOption;
                        setNewCompanyActivity(next);
                        if (next !== "custom") {
                          setNewCompanyAteco(atecoFromActivity(next));
                        }
                      }}
                    >
                      {ACTIVITY_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Codice ATECO</label>
                    <input
                      value={newCompanyAteco}
                      onChange={(event) => {
                        const value = event.target.value;
                        setNewCompanyAteco(value);
                        setNewCompanyActivity(inferActivityFromAteco(value));
                      }}
                    />
                  </div>
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
                    <label>Soggetti coinvolti nel Sistema di Prevenzione e Protezione aziendale</label>
                    <textarea rows={2} value={newCompanyPreventionSubjects} onChange={(event) => setNewCompanyPreventionSubjects(event.target.value)} />
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
                    <label>Soggetti coinvolti nel Sistema di Autocontrollo HACCP</label>
                    <textarea rows={2} value={newCompanyPreventionSubjects} onChange={(event) => setNewCompanyPreventionSubjects(event.target.value)} />
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
            <div className="task-accordion-list">
              {bottomRegistrationTasks.map((task) => renderTaskHeader(task.key, task.title, task.status, task.progress))}
            </div>
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
                        disabled={isInspectionValidated}
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
                        disabled={isInspectionValidated}
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
            <button onClick={handleSaveChecklist} disabled={loading || !selectedInspectionId || isInspectionValidated}>
              Salva checklist completa
            </button>
            <button
              onClick={handleValidateInspection}
              disabled={loading || !selectedInspectionId || user.role === "junior" || isInspectionValidated}
            >
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
