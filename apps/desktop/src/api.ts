const DESKTOP_LOCAL_API_BASE = "http://127.0.0.1:4000/api";
const isDesktopRuntime = typeof window !== "undefined" && Boolean(window.fedshield);
const desktopOverride = import.meta.env.VITE_API_BASE_URL_DESKTOP;
const genericOverride = import.meta.env.VITE_API_BASE_URL;

const API_BASE = isDesktopRuntime
  ? (desktopOverride?.trim() || DESKTOP_LOCAL_API_BASE)
  : (genericOverride?.trim() || "http://localhost:4000/api");

export class ApiError extends Error {
  statusCode: number;
  responseBody?: string;

  constructor(statusCode: number, message: string, responseBody?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

function parseApiErrorMessage(raw: string, statusCode: number): string {
  if (!raw) return `Errore API ${statusCode}`;
  try {
    const parsed = JSON.parse(raw) as { message?: string };
    if (typeof parsed.message === "string" && parsed.message.trim().length > 0) {
      return parsed.message;
    }
  } catch {
    // fallback to raw body
  }
  return raw;
}

export function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.statusCode === 401;
  }
  if (error instanceof Error) {
    return /token non valido o assente|unauthorized|401/i.test(error.message);
  }
  return false;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "junior" | "senior" | "admin";
  };
}

export interface Company {
  id: string;
  name: string;
  vatNumber: string;
  legalForm?: string;
  reaNumber?: string;
  employeesInfo?: string;
  email?: string;
  pec?: string;
  phone?: string;
  atecoCode?: string;
  riskLevel?: string;
  description?: string;
  legalAddress?: string;
  localUnitAddress?: string;
  preventionSystemSubjects?: string;
  employerRsppPreposto?: string;
  occupationalDoctor?: string;
  rls?: string;
  emergencyTeam?: string;
  firstAidTeam?: string;
  haccpResponsabileAutocontrollo?: string;
  haccpConsulenteEsterno?: string;
  haccpAdditionalResponsabili?: string;
  city?: string;
}

export interface Inspection {
  id: string;
  title: string;
  status: "draft" | "pending_validation" | "validated";
  checklistMode: "unified" | "haccp_only" | "safety_only";
  happenedAt: string;
  companyId?: string;
  company: { name: string };
  nonConformities: Array<{
    id: string;
    title: string;
    isSanctionable: boolean;
    severity: number;
  }>;
  answers?: Array<{
    checklistItemId: string;
    value: "yes" | "no" | "na";
    note?: string;
    severity?: number | null;
    isSanctionable?: boolean | null;
    checklistItem?: {
      id: string;
      question: string;
      area: string;
      templateId: string;
    };
  }>;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  atecoCode?: string | null;
  macroGroup?: string | null;
  isGeneral: boolean;
  _count: {
    items: number;
  };
}

export interface ChecklistItem {
  id: string;
  section: "premises_equipment" | "procedures_hygiene";
  area: string;
  question: string;
  orderIndex: number;
  defaultSeverity: number;
  defaultSanctionable: boolean;
}

export type InspectionDocumentStatus =
  | "viewed_on_site"
  | "requested_later"
  | "not_available"
  | "not_applicable";

export interface InspectionDocumentRequirement {
  documentTemplateId?: string;
  name: string;
  isRequired: boolean;
  status: InspectionDocumentStatus;
  note?: string;
}

export interface InspectionSummary {
  inspectionId: string;
  status: "draft" | "pending_validation" | "validated";
  totals: {
    answers: number;
    nonConformities: number;
    sanctionableNc: number;
    requestedDocuments: number;
  };
  score: number;
  stars: number;
  attestato: {
    eligible: boolean;
    reason: string;
    minScore: number;
  };
}

export interface GeneratedDocument {
  id: string;
  kind: "inspection_report" | "attestato" | "malleva";
  fileName: string;
  filePath: string;
  createdAt: string;
}

export interface ChecklistTemplateDetails {
  template: {
    id: string;
    name: string;
  };
  items: ChecklistItem[];
}

export interface Quote {
  id: string;
  serviceName: string;
  amount?: number;
  status:
    | "pending"
    | "accepted"
    | "remodeling_requested"
    | "rejected"
    | "expired"
    | "assigned_to_third_party";
  responseDueAt: string;
  company: {
    id: string;
    name: string;
  };
  nonConformity: {
    id: string;
    title: string;
    severity: number;
    note?: string | null;
    normReference?: string | null;
    sanctionImpact?: string | null;
    suggestedService?: string | null;
  };
  malleva?: {
    id: string;
    reason: string;
  } | null;
}

export interface QuoteCandidate {
  id: string;
  title: string;
  severity: number;
  note?: string | null;
  normReference?: string | null;
  sanctionImpact?: string | null;
  suggestedService?: string | null;
  inspection: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
    };
  };
}

export interface KpiOverview {
  generatedAt: string;
  companiesCount: number;
  consultantsCount: number;
  averageComplianceScore: number;
  companies: Array<{
    companyId: string;
    companyName: string;
    complianceScore: number;
  }>;
  consultants: Array<{
    consultantId: string;
    fullName: string;
    role: "junior" | "senior";
    inspectionsCount: number;
    ncTotal: number;
    sanctionableNc: number;
    conversionRate: number;
    averageProcessingDays: number;
    lowNcAlert: boolean;
    lowNcAlertReason?: string | null;
  }>;
}

export interface CompanyKpi {
  companyId: string;
  complianceScore: number;
  stars: number;
  totals: {
    inspections: number;
    nc: number;
    sanctionableNc: number;
    resolvedNc: number;
  };
  collaborationScore: number;
  radar: Array<{ area: string; score: number }>;
  trend: Array<{ month: string; inspections: number; nc: number; sanctionableNc: number }>;
}

export interface OdvInspection {
  id: string;
  authorityName: string;
  reportNumber?: string;
  inspectedAt: string;
  company: { id: string; name: string };
  sanctions: Array<{
    id: string;
    violationTitle: string;
    violationNorm?: string;
    amount?: number;
    matchStatus: "matched_to_reported_nc" | "unmatched_not_reported" | "partially_matched";
    matchScore?: number;
  }>;
}

export interface LicenseActivationResult {
  licenseId: string;
  deviceId: string;
  heartbeatToken: string;
  status: "active" | "expired" | "revoked";
  expiresAt: string;
  graceUntil: string;
  isActive: boolean;
  isWithinGrace: boolean;
  serverTime: string;
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login fallito. Verifica credenziali.");
  }

  return res.json();
}

async function publicFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = init?.body !== undefined && init.body !== null;
  const headers = new Headers(init?.headers ?? {});
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
    });
  } catch (error) {
    throw new Error(
      `Connessione API non riuscita su ${API_BASE}${path}: ${error instanceof Error ? error.message : "errore rete"}`,
    );
  }

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, parseApiErrorMessage(body, res.status), body);
  }

  return res.json();
}

export async function authedFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const hasBody = init?.body !== undefined && init.body !== null;
  const headers = new Headers(init?.headers ?? {});
  headers.set("Authorization", `Bearer ${token}`);
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
    });
  } catch (error) {
    throw new Error(
      `Connessione API non riuscita su ${API_BASE}${path}: ${error instanceof Error ? error.message : "errore rete"}`,
    );
  }

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, parseApiErrorMessage(body, res.status), body);
  }

  return res.json();
}

export function fetchCompanies(token: string): Promise<Company[]> {
  return authedFetch<Company[]>("/companies", token);
}

export function createCompany(
  token: string,
  payload: {
    name: string;
    vatNumber: string;
    legalForm?: string;
    reaNumber?: string;
    employeesInfo?: string;
    email?: string;
    pec?: string;
    phone?: string;
    atecoCode?: string;
    riskLevel?: string;
    description?: string;
    legalAddress?: string;
    localUnitAddress?: string;
    preventionSystemSubjects?: string;
    employerRsppPreposto?: string;
    occupationalDoctor?: string;
    rls?: string;
    emergencyTeam?: string;
    firstAidTeam?: string;
    haccpResponsabileAutocontrollo?: string;
    haccpConsulenteEsterno?: string;
    haccpAdditionalResponsabili?: string;
    city?: string;
  },
): Promise<Company> {
  return authedFetch<Company>("/companies", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCompany(
  token: string,
  companyId: string,
  payload: {
    name?: string;
    vatNumber?: string;
    legalForm?: string;
    reaNumber?: string;
    employeesInfo?: string;
    email?: string;
    pec?: string;
    phone?: string;
    atecoCode?: string;
    riskLevel?: string;
    description?: string;
    legalAddress?: string;
    localUnitAddress?: string;
    preventionSystemSubjects?: string;
    employerRsppPreposto?: string;
    occupationalDoctor?: string;
    rls?: string;
    emergencyTeam?: string;
    firstAidTeam?: string;
    haccpResponsabileAutocontrollo?: string;
    haccpConsulenteEsterno?: string;
    haccpAdditionalResponsabili?: string;
    city?: string;
  },
): Promise<Company> {
  return authedFetch<Company>(`/companies/${companyId}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function fetchInspections(token: string): Promise<Inspection[]> {
  return authedFetch<Inspection[]>("/inspections", token);
}

export function createInspection(
  token: string,
  payload: {
    companyId: string;
    title: string;
    notes?: string;
    checklistMode?: "unified" | "haccp_only" | "safety_only";
  },
) {
  return authedFetch<Inspection>("/inspections", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchChecklistTemplates(
  token: string,
  atecoCode?: string,
  checklistMode?: "unified" | "haccp_only" | "safety_only",
  retailScopes?: string[],
) {
  const params = new URLSearchParams();
  if (atecoCode) {
    params.set("atecoCode", atecoCode);
  }
  if (checklistMode) {
    params.set("checklistMode", checklistMode);
  }
  if (retailScopes && retailScopes.length > 0) {
    params.set("retailScopes", retailScopes.join(","));
  }
  const query = params.toString() ? `?${params.toString()}` : "";
  return authedFetch<ChecklistTemplate[]>(`/checklists/templates${query}`, token);
}

export function fetchChecklistItems(
  token: string,
  templateId: string,
  checklistMode?: "unified" | "haccp_only" | "safety_only",
) {
  const query = checklistMode ? `?checklistMode=${encodeURIComponent(checklistMode)}` : "";
  return authedFetch<ChecklistTemplateDetails>(`/checklists/templates/${templateId}/items${query}`, token);
}

export function fetchDocumentTemplates(
  token: string,
  atecoCode?: string,
  checklistMode?: "unified" | "haccp_only" | "safety_only",
  retailScopes?: string[],
) {
  const params = new URLSearchParams();
  if (atecoCode) {
    params.set("atecoCode", atecoCode);
  }
  if (checklistMode) {
    params.set("checklistMode", checklistMode);
  }
  if (retailScopes && retailScopes.length > 0) {
    params.set("retailScopes", retailScopes.join(","));
  }
  const query = params.toString() ? `?${params.toString()}` : "";
  return authedFetch<
    Array<{
      id: string;
      name: string;
      isRequired: boolean;
      atecoCode?: string | null;
      macroGroup?: string | null;
    }>
  >(`/checklists/document-templates${query}`, token);
}

export function saveInspectionAnswers(
  token: string,
  inspectionId: string,
  answers: Array<{
    checklistItemId: string;
    value: "yes" | "no" | "na";
    note?: string;
    severity?: number;
    isSanctionable?: boolean;
  }>,
) {
  return authedFetch<{ inspectionId: string; answersSaved: number }>(`/inspections/${inspectionId}/answers`, token, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}

export function fetchInspectionReport(token: string, inspectionId: string) {
  return authedFetch(`/inspections/${inspectionId}/report`, token);
}

export function generateInspectionReportPdf(token: string, inspectionId: string) {
  return authedFetch<GeneratedDocument>(`/inspections/${inspectionId}/report/pdf`, token, {
    method: "POST",
    body: "{}",
  });
}

export function generateInspectionChecklistPdf(token: string, inspectionId: string) {
  return authedFetch<GeneratedDocument>(`/inspections/${inspectionId}/checklist/pdf`, token, {
    method: "POST",
    body: "{}",
  });
}

export function generateAttestatoPdf(token: string, inspectionId: string) {
  return authedFetch<GeneratedDocument>(`/inspections/${inspectionId}/attestato/pdf`, token, {
    method: "POST",
    body: "{}",
  });
}

export async function downloadGeneratedDocument(
  token: string,
  documentId: string,
  suggestedFileName?: string,
): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/documents/${documentId}/download`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error(
      `Connessione API non riuscita su ${API_BASE}/documents/${documentId}/download: ${
        error instanceof Error ? error.message : "errore rete"
      }`,
    );
  }

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, parseApiErrorMessage(body, res.status), body);
  }

  if (typeof document === "undefined") {
    throw new Error("Download non supportato in questo ambiente.");
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = suggestedFileName ?? `${documentId}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export function fetchInspectionDocumentRequirements(
  token: string,
  inspectionId: string,
  retailScopes?: string[],
) {
  const params = new URLSearchParams();
  if (retailScopes && retailScopes.length > 0) {
    params.set("retailScopes", retailScopes.join(","));
  }
  const query = params.toString() ? `?${params.toString()}` : "";
  return authedFetch<InspectionDocumentRequirement[]>(
    `/inspections/${inspectionId}/documents/requirements${query}`,
    token,
  );
}

export function upsertInspectionDocuments(
  token: string,
  inspectionId: string,
  documents: Array<{
    documentTemplateId?: string;
    name: string;
    status: InspectionDocumentStatus;
    note?: string;
  }>,
) {
  return authedFetch<{ inspectionId: string; documentsSaved: number }>(`/inspections/${inspectionId}/documents`, token, {
    method: "PUT",
    body: JSON.stringify({ documents }),
  });
}

export function fetchInspectionSummary(token: string, inspectionId: string) {
  return authedFetch<InspectionSummary>(`/inspections/${inspectionId}/summary`, token);
}

export function sendInspectionToAdmin(token: string, inspectionId: string) {
  return authedFetch(`/inspections/${inspectionId}/send-to-admin`, token, {
    method: "POST",
  });
}

export function validateInspection(
  token: string,
  payload: {
    inspectionId: string;
    approved: boolean;
    notes?: string;
  },
) {
  return authedFetch("/inspections/validate", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchQuotes(token: string): Promise<Quote[]> {
  return authedFetch<Quote[]>("/quotes", token);
}

export function fetchQuoteCandidates(token: string, companyId?: string): Promise<QuoteCandidate[]> {
  const query = companyId ? `?companyId=${encodeURIComponent(companyId)}` : "";
  return authedFetch<QuoteCandidate[]>(`/quotes/candidates${query}`, token);
}

export function createQuote(
  token: string,
  payload: {
    nonConformityId: string;
    serviceName: string;
    amount?: number;
    dueDays: number;
  },
) {
  return authedFetch("/quotes", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function respondQuote(
  token: string,
  quoteId: string,
  payload: {
    action: "accepted" | "remodeling_requested" | "rejected" | "assigned_to_third_party";
    note?: string;
    dueDays?: number;
  },
) {
  return authedFetch(`/quotes/${quoteId}/respond`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function processExpiredQuotes(token: string) {
  return authedFetch<{ processed: number }>("/quotes/process-expired", token, {
    method: "POST",
  });
}

export function fetchKpiOverview(token: string): Promise<KpiOverview> {
  return authedFetch<KpiOverview>("/kpi/overview", token);
}

export function fetchCompanyKpi(token: string, companyId: string): Promise<CompanyKpi> {
  return authedFetch<CompanyKpi>(`/kpi/companies/${companyId}`, token);
}

export function createKpiSnapshot(token: string) {
  return authedFetch<{ companySnapshots: number; consultantSnapshots: number }>("/kpi/snapshots", token, {
    method: "POST",
  });
}

export function fetchOdvInspections(token: string, companyId?: string): Promise<OdvInspection[]> {
  const query = companyId ? `?companyId=${encodeURIComponent(companyId)}` : "";
  return authedFetch<OdvInspection[]>(`/odv/inspections${query}`, token);
}

export function createOdvInspection(
  token: string,
  payload: {
    companyId: string;
    authorityName: string;
    reportNumber?: string;
    inspectedAt: string;
    notes?: string;
    sanctions: Array<{
      violationTitle: string;
      violationNorm?: string;
      amount?: number;
    }>;
  },
) {
  return authedFetch<OdvInspection>("/odv/inspections", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchOdvDefensiveReport(token: string, companyId: string) {
  return authedFetch<{
    companyId: string;
    companyName?: string;
    inspections: number;
    sanctions: number;
    matched: number;
    partial: number;
    unmatched: number;
    coverageRate: number;
  }>(`/odv/defensive-report/${companyId}`, token);
}

export function activateDeviceLicense(payload: {
  deviceId: string;
  deviceName: string;
  platform: string;
  appVersion?: string;
  activationCode: string;
}): Promise<LicenseActivationResult> {
  return publicFetch<LicenseActivationResult>("/licensing/activate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function validateDeviceLicense(payload: {
  deviceId: string;
  heartbeatToken: string;
}): Promise<{
  found: boolean;
  isActive: boolean;
  isWithinGrace?: boolean;
  status?: "active" | "expired" | "revoked";
  reason?: string;
  expiresAt?: string;
  graceUntil?: string;
  serverTime: string;
}> {
  return publicFetch("/licensing/validate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface DeviceHeartbeatResponse {
  found: boolean;
  isActive: boolean;
  isWithinGrace?: boolean;
  status?: "active" | "expired" | "revoked";
  expiresAt?: string | null;
  graceUntil?: string | null;
  revokedAt?: string | null;
  revokedReason?: string | null;
  reason?: string;
  serverTime: string;
  heartbeatAccepted?: boolean;
}

export function heartbeatDeviceLicense(payload: {
  deviceId: string;
  heartbeatToken: string;
  appVersion?: string;
}) {
  return publicFetch<DeviceHeartbeatResponse>("/licensing/heartbeat", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function syncPush(
  token: string,
  payload: {
    deviceId: string;
    heartbeatToken: string;
    events: Array<{
      clientEventId: string;
      eventType: string;
      entityType: string;
      entityId?: string;
      payload: unknown;
      occurredAt: string;
    }>;
  },
) {
  return authedFetch<{ accepted: number; duplicates: number; received: number; serverTime: string }>(
    "/sync/push",
    token,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export function syncPull(
  token: string,
  payload: {
    deviceId: string;
    heartbeatToken: string;
    since?: string;
  },
) {
  return authedFetch<{
    serverTime: string;
    since: string;
    nextCursor: string;
    data: Record<string, unknown>;
  }>("/sync/pull", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function syncAck(
  token: string,
  payload: {
    deviceId: string;
    heartbeatToken: string;
    cursor?: string;
  },
) {
  return authedFetch<{ acknowledged: boolean; cursor: string }>("/sync/ack", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// === CHATBOT ===
export interface ChatbotResponse {
  answer: string;
  source?: string;
  timestamp: string;
}

export function chatbotQuery(
  token: string,
  payload: {
    companyId?: string;
    question: string;
    inspectionId?: string;
    history?: Array<{ role: string; content: string }>;
  },
): Promise<ChatbotResponse> {
  return authedFetch<ChatbotResponse>("/chatbot/query", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// === NORM-SYNC ===
export interface NormativeProposal {
  id: string;
  sourceId?: string;
  normTitle: string;
  normReference: string;
  normText?: string;
  changeSummary: string;
  proposedChanges: unknown;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string | null;
}

export function fetchNormSyncProposals(token: string, status?: string): Promise<NormativeProposal[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return authedFetch<NormativeProposal[]>(`/norm-sync/proposals${query}`, token);
}

export function approveNormSyncProposal(token: string, proposalId: string, note?: string) {
  return authedFetch<NormativeProposal>(`/norm-sync/proposals/${proposalId}/approve`, token, {
    method: "PATCH",
    body: JSON.stringify({ status: "approved", note }),
  });
}

export function rejectNormSyncProposal(token: string, proposalId: string, note?: string) {
  return authedFetch<NormativeProposal>(`/norm-sync/proposals/${proposalId}/reject`, token, {
    method: "PATCH",
    body: JSON.stringify({ note }),
  });
}

// === EMPLOYEES (Sprint 2) ===
export interface TrainingRecord {
  id: string;
  course: { id: string; name: string; minHours: number; frequencyYears: number };
  completedAt: string | null;
  expiresAt: string | null;
  hoursDone: number | null;
  certificateNumber: string | null;
}

export interface Employee {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  fiscalCode?: string | null;
  role?: string | null;
  department?: string | null;
  isActive: boolean;
  hireDate?: string | null;
  leftDate?: string | null;
  trainingRecords?: TrainingRecord[];
}

export interface EmployeePayload {
  companyId: string;
  firstName: string;
  lastName: string;
  fiscalCode?: string;
  role?: string;
  department?: string;
  hireDate?: string;
}

export function fetchEmployees(
  token: string,
  filters?: { companyId?: string; isActive?: boolean },
): Promise<Employee[]> {
  const params = new URLSearchParams();
  if (filters?.companyId) params.set("companyId", filters.companyId);
  if (filters?.isActive !== undefined) params.set("isActive", String(filters.isActive));
  const query = params.toString() ? `?${params.toString()}` : "";
  return authedFetch<Employee[]>(`/employees${query}`, token);
}

export function createEmployee(token: string, payload: EmployeePayload): Promise<Employee> {
  return authedFetch<Employee>("/employees", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateEmployee(
  token: string,
  employeeId: string,
  payload: Partial<Omit<EmployeePayload, "companyId">>,
): Promise<Employee> {
  return authedFetch<Employee>(`/employees/${employeeId}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteEmployee(token: string, employeeId: string): Promise<void> {
  return authedFetch<void>(`/employees/${employeeId}`, token, { method: "DELETE" });
}

// === TRAINING COURSES (Sprint 2) ===
export interface TrainingCourse {
  id: string;
  name: string;
  description?: string | null;
  targetAudience: string;
  minHours: number;
  frequencyYears: number;
  normReference: string;
  domain?: "safety" | "haccp" | "both" | null;
  isActive?: boolean;
}

export interface TrainingCoursePayload {
  name: string;
  description?: string;
  targetAudience: string;
  minHours: number;
  frequencyYears: number;
  normReference: string;
  domain?: "safety" | "haccp" | "both";
}

export function fetchTrainingCourses(token: string): Promise<TrainingCourse[]> {
  return authedFetch<TrainingCourse[]>("/training/courses", token);
}

export function createTrainingCourse(
  token: string,
  payload: TrainingCoursePayload,
): Promise<TrainingCourse> {
  return authedFetch<TrainingCourse>("/training/courses", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createTrainingRecord(
  token: string,
  payload: {
    employeeId: string;
    courseId: string;
    completedAt?: string;
    expiresAt?: string;
    hoursDone?: number;
    certificateNumber?: string;
    note?: string;
  },
) {
  return authedFetch<TrainingRecord>("/training/records", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// === EQUIPMENT / ASSETS (Sprint 2) ===
export type EquipmentStatus = "active" | "under_maintenance" | "expired" | "decommissioned";

interface BaseAsset {
  id: string;
  companyId: string;
  status: EquipmentStatus;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Equipment extends BaseAsset {
  name: string;
  type: string;
  model?: string | null;
  serialNumber?: string | null;
  location?: string | null;
  lastCheckAt?: string | null;
  nextCheckAt?: string | null;
}

export interface Machine extends BaseAsset {
  name: string;
  type: string;
  model?: string | null;
  serialNumber?: string | null;
  manufacturer?: string | null;
  location?: string | null;
  riskLevel?: string | null;
  lastMaintenanceAt?: string | null;
  nextMaintenanceAt?: string | null;
  lastSafetyCheckAt?: string | null;
  nextSafetyCheckAt?: string | null;
}

export interface FireExtinguisher extends BaseAsset {
  code: string;
  type: string;
  location: string;
  capacity?: string | null;
  manufactureDate?: string | null;
  lastCheckAt?: string | null;
  nextCheckAt?: string | null;
  lastRechargeAt?: string | null;
}

export interface FirstAidKit extends BaseAsset {
  location: string;
  contents?: string | null;
  lastCheckAt?: string | null;
  nextCheckAt?: string | null;
  replenishedAt?: string | null;
}

function buildAssetQuery(filters?: { companyId?: string; status?: EquipmentStatus }) {
  const params = new URLSearchParams();
  if (filters?.companyId) params.set("companyId", filters.companyId);
  if (filters?.status) params.set("status", filters.status);
  return params.toString() ? `?${params.toString()}` : "";
}

export function fetchEquipment(token: string, filters?: { companyId?: string; status?: EquipmentStatus }) {
  return authedFetch<Equipment[]>(`/equipment${buildAssetQuery(filters)}`, token);
}

export function fetchEquipmentById(token: string, id: string) {
  return authedFetch<Equipment>(`/equipment/${id}`, token);
}

export function createEquipment(
  token: string,
  payload: Omit<Equipment, "id" | "status" | "createdAt" | "updatedAt"> & { lastCheckAt?: string; nextCheckAt?: string },
) {
  return authedFetch<Equipment>("/equipment", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchMachines(token: string, filters?: { companyId?: string; status?: EquipmentStatus }) {
  return authedFetch<Machine[]>(`/machines${buildAssetQuery(filters)}`, token);
}

export function createMachine(
  token: string,
  payload: Omit<Machine, "id" | "status" | "createdAt" | "updatedAt"> & {
    lastMaintenanceAt?: string;
    nextMaintenanceAt?: string;
    lastSafetyCheckAt?: string;
    nextSafetyCheckAt?: string;
  },
) {
  return authedFetch<Machine>("/machines", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchFireExtinguishers(
  token: string,
  filters?: { companyId?: string; status?: EquipmentStatus },
) {
  return authedFetch<FireExtinguisher[]>(`/fire-extinguishers${buildAssetQuery(filters)}`, token);
}

export function createFireExtinguisher(
  token: string,
  payload: Omit<FireExtinguisher, "id" | "status" | "createdAt" | "updatedAt"> & {
    manufactureDate?: string;
    lastCheckAt?: string;
    nextCheckAt?: string;
    lastRechargeAt?: string;
  },
) {
  return authedFetch<FireExtinguisher>("/fire-extinguishers", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchFirstAidKits(
  token: string,
  filters?: { companyId?: string; status?: EquipmentStatus },
) {
  return authedFetch<FirstAidKit[]>(`/first-aid-kits${buildAssetQuery(filters)}`, token);
}

export function createFirstAidKit(
  token: string,
  payload: Omit<FirstAidKit, "id" | "status" | "createdAt" | "updatedAt"> & {
    lastCheckAt?: string;
    nextCheckAt?: string;
    replenishedAt?: string;
  },
) {
  return authedFetch<FirstAidKit>("/first-aid-kits", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

type EquipmentUpdate = Partial<Omit<Equipment, "id" | "companyId" | "createdAt" | "updatedAt">>;
type MachineUpdate = Partial<Omit<Machine, "id" | "companyId" | "createdAt" | "updatedAt">>;
type FireExtinguisherUpdate = Partial<Omit<FireExtinguisher, "id" | "companyId" | "createdAt" | "updatedAt">>;
type FirstAidKitUpdate = Partial<Omit<FirstAidKit, "id" | "companyId" | "createdAt" | "updatedAt">>;

export function updateEquipment(token: string, id: string, payload: EquipmentUpdate) {
  return authedFetch<Equipment>(`/equipment/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteEquipment(token: string, id: string) {
  return authedFetch<void>(`/equipment/${id}`, token, { method: "DELETE" });
}

export function fetchMachineById(token: string, id: string) {
  return authedFetch<Machine>(`/machines/${id}`, token);
}

export function updateMachine(token: string, id: string, payload: MachineUpdate) {
  return authedFetch<Machine>(`/machines/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteMachine(token: string, id: string) {
  return authedFetch<void>(`/machines/${id}`, token, { method: "DELETE" });
}

export function fetchFireExtinguisherById(token: string, id: string) {
  return authedFetch<FireExtinguisher>(`/fire-extinguishers/${id}`, token);
}

export function updateFireExtinguisher(token: string, id: string, payload: FireExtinguisherUpdate) {
  return authedFetch<FireExtinguisher>(`/fire-extinguishers/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteFireExtinguisher(token: string, id: string) {
  return authedFetch<void>(`/fire-extinguishers/${id}`, token, { method: "DELETE" });
}

export function fetchFirstAidKitById(token: string, id: string) {
  return authedFetch<FirstAidKit>(`/first-aid-kits/${id}`, token);
}

export function updateFirstAidKit(token: string, id: string, payload: FirstAidKitUpdate) {
  return authedFetch<FirstAidKit>(`/first-aid-kits/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteFirstAidKit(token: string, id: string) {
  return authedFetch<void>(`/first-aid-kits/${id}`, token, { method: "DELETE" });
}
