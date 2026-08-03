import {
  ChecklistAnswerValue,
  ChecklistSection,
  ComplianceDomain,
  InspectionChecklistMode,
  InspectionDocumentStatus,
  Inspection as PrismaInspection,
  GeneratedDocument as PrismaGeneratedDocument,
  QuoteServiceDeliveryMode,
  UserRole,
} from "@prisma/client";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import {
  buildAttestatoVerificationToken,
  generateAttestatoPdf,
  generateInspectionChecklistPdf,
  generateInspectionReportPdf,
  listDocuments,
} from "../../services/document.service.js";
import {
  buildInspectionReport,
  computeInspectionComplianceScore,
  starsFromScore,
} from "../../services/report.service.js";
import { writeAudit } from "../../plugins/audit.js";
import { config } from "../../config.js";
import { composeNcDescription, getNcGuidance } from "../../services/restaurant-checklist-knowledge.js";

const createInspectionSchema = z.object({
  companyId: z.string().min(1),
  title: z.string().min(3),
  notes: z.string().optional(),
  checklistMode: z.nativeEnum(InspectionChecklistMode).optional(),
});

const validateInspectionSchema = z.object({
  inspectionId: z.string().min(1),
  approved: z.boolean(),
  notes: z.string().optional(),
});

const addNcSchema = z.object({
  inspectionId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().optional(),
  suggestedServiceName: z.string().min(3).max(180).optional(),
  suggestedServiceDescription: z.string().min(3).max(1_000).optional(),
  suggestedServiceDeliveryMode: z.nativeEnum(QuoteServiceDeliveryMode).optional(),
  isSanctionable: z.boolean().default(false),
  severity: z.number().int().min(1).max(4).default(1),
});

const submitAnswersSchema = z.object({
  answers: z
    .array(
      z.object({
        checklistItemId: z.string().min(1),
        value: z.enum([ChecklistAnswerValue.yes, ChecklistAnswerValue.no, ChecklistAnswerValue.na]),
        note: z.string().optional(),
        severity: z.number().int().min(1).max(4).optional(),
        isSanctionable: z.boolean().optional(),
      }),
    )
    .min(1),
});

const manualRequirementSchema = z.object({
  rawRequirement: z.string().min(5).max(2_000),
  area: z.string().min(2).max(120).optional(),
  section: z
    .enum([ChecklistSection.premises_equipment, ChecklistSection.procedures_hygiene])
    .default(ChecklistSection.procedures_hygiene),
  domain: z.nativeEnum(ComplianceDomain).default(ComplianceDomain.both),
  normReference: z.string().min(2).max(500).optional(),
  defaultSeverity: z.number().int().min(1).max(4).default(2),
  defaultSanctionable: z.boolean().default(false),
  suggestedServiceName: z.string().min(3).max(180).optional(),
  suggestedServiceDescription: z.string().min(3).max(1_000).optional(),
  suggestedServiceDeliveryMode: z
    .nativeEnum(QuoteServiceDeliveryMode)
    .default(QuoteServiceDeliveryMode.internal),
});

const documentStatusSchema = z.enum([
  InspectionDocumentStatus.viewed_on_site,
  InspectionDocumentStatus.requested_later,
  InspectionDocumentStatus.not_available,
  InspectionDocumentStatus.not_applicable,
]);

const upsertDocumentsSchema = z.object({
  documents: z
    .array(
      z.object({
        documentTemplateId: z.string().optional(),
        name: z.string().min(2),
        status: documentStatusSchema,
        note: z.string().optional(),
      }),
    )
    .min(1),
});

function parseMetadataJson(value?: string | null): Record<string, unknown> {
  if (!value) {
    return {};
  }
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function resolveDocumentPath(filePath: string): { storageRoot: string; absolutePath: string } {
  const storageRoot = path.resolve(process.cwd(), config.storageDir);
  const absolutePath = path.resolve(storageRoot, filePath);
  return { storageRoot, absolutePath };
}

type AttestatoVerificationResolution =
  | { status: "inspection_not_found" }
  | { status: "attestato_not_found"; inspection: PrismaInspection & { company: { name: string; vatNumber: string } } }
  | {
      status: "ok";
      inspection: PrismaInspection & { company: { name: string; vatNumber: string } };
      attestato: PrismaGeneratedDocument;
      score: number;
      stars: number;
      inspectionDate: Date;
      isValid: boolean;
    };

async function resolveAttestatoVerification(
  fastify: FastifyInstance,
  inspectionId: string,
  token: string,
): Promise<AttestatoVerificationResolution> {
  const inspection = await fastify.prisma.inspection.findUnique({
    where: { id: inspectionId },
    include: { company: true },
  });

  if (!inspection) {
    return { status: "inspection_not_found" };
  }

  const attestato = await fastify.prisma.generatedDocument.findFirst({
    where: {
      inspectionId: inspection.id,
      kind: "attestato",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!attestato) {
    return { status: "attestato_not_found", inspection };
  }

  const metadata = parseMetadataJson(attestato.metadataJson);
  const score = Number(metadata.score);
  const stars = Number(metadata.stars);
  const closedAtIso = typeof metadata.closedAt === "string" ? metadata.closedAt : null;
  const storedToken = typeof metadata.verificationToken === "string" ? metadata.verificationToken : null;
  const expectedToken =
    closedAtIso && Number.isFinite(score) && Number.isFinite(stars)
      ? buildAttestatoVerificationToken({
          inspectionId: inspection.id,
          closedAtIso,
          score,
          stars,
        })
      : null;

  const inspectionDate =
    typeof metadata.inspectionDate === "string" ? new Date(metadata.inspectionDate) : inspection.happenedAt;
  const isValid = Boolean(storedToken && expectedToken && token === storedToken && token === expectedToken);

  return {
    status: "ok",
    inspection,
    attestato,
    score: Number.isFinite(score) ? score : 0,
    stars: Number.isFinite(stars) ? stars : 0,
    inspectionDate,
    isValid,
  };
}

function buildAtecoVariants(atecoCode?: string | null) {
  if (!atecoCode) {
    return [];
  }

  const normalized = atecoCode.trim();
  const parts = normalized.split(".");
  const variants = new Set<string>([normalized]);

  if (parts.length >= 2) {
    variants.add(`${parts[0]}.${parts[1]}`);
  }

  if (parts.length >= 1) {
    variants.add(parts[0]);
  }

  if (parts[0] === "56") {
    variants.add("HO.RE.CA");
    variants.add("HORECA");
  }

  if (parts[0] === "47" && !normalized.startsWith("47.11")) {
    variants.add("COMMERCIO_NON_FOOD");
  }
  if (normalized.startsWith("49.4") || parts[0] === "52" || parts[0] === "53") {
    variants.add("LOGISTICA_MAGAZZINO");
  }
  if (normalized.startsWith("81.2")) {
    variants.add("PULIZIE_SANIFICAZIONE");
  }
  if (normalized.startsWith("96.02") || normalized.startsWith("96.04")) {
    variants.add("SERVIZI_PERSONA");
  }
  if (parts[0] === "85") {
    variants.add("ISTRUZIONE_FORMAZIONE");
  }
  if (normalized.startsWith("45.2")) {
    variants.add("AUTORIPARAZIONE");
  }
  if (parts[0] === "10" && !normalized.startsWith("10.85")) {
    variants.add("INDUSTRIA_ALIMENTARE");
  }
  if (parts[0] === "41") {
    variants.add("EDILIZIA_COSTRUZIONI");
  }
  if (parts[0] === "42") {
    variants.add("INGEGNERIA_CIVILE_INFRASTRUTTURE");
  }
  if (normalized.startsWith("42.11") || normalized.startsWith("42.99")) {
    variants.add("ASFALTI_PAVIMENTAZIONI_STRADALI");
  }
  if (normalized.startsWith("43.13")) {
    variants.add("FONDAZIONI_SPECIALI_PERFORAZIONI");
  }
  if (normalized.startsWith("43.11") || normalized.startsWith("43.12")) {
    variants.add("DEMOLIZIONI_SCAVI_PREPARAZIONE");
  }
  if (normalized.startsWith("43.2")) {
    variants.add("IMPIANTISTICA_MANUTENZIONE");
  }
  if (normalized.startsWith("43.21")) {
    variants.add("IMPIANTISTICA_ELETTRICA");
  }
  if (normalized.startsWith("43.22")) {
    variants.add("IMPIANTISTICA_TERMOIDRAULICA");
  }
  if (normalized.startsWith("43.3")) {
    variants.add("FINITURE_EDILI");
  }
  if (normalized.startsWith("43.32")) {
    variants.add("SERRAMENTI_FACCIATE_VETRAZIONI");
  }
  if (normalized.startsWith("43.91") || normalized.startsWith("43.99")) {
    variants.add("OPERE_SPECIALIZZATE_COPERTURE");
  }
  if (normalized.startsWith("25.11") || normalized.startsWith("43.99")) {
    variants.add("CARPENTERIA_METALLICA_PREFABBRICATI");
  }
  if (normalized.startsWith("77.32") || normalized.startsWith("43.99")) {
    variants.add("NOLEGGIO_MEZZI_CANTIERE_OPERATORE");
  }
  if (normalized.startsWith("81.30")) {
    variants.add("VERDE_OPERE_ESTERNE_CANTIERI");
  }
  if (parts[0] === "39") {
    variants.add("BONIFICHE_AMBIENTALI_AMIANTO");
  }
  if (parts[0] === "38") {
    variants.add("RIFIUTI_EDILI_RECUPERO_SMALTIMENTO");
  }
  if (normalized.startsWith("38.22")) {
    variants.add("BONIFICHE_AMBIENTALI_AMIANTO");
  }
  if (normalized.startsWith("71.1")) {
    variants.add("PROGETTAZIONE_DIREZIONE_LAVORI");
  }
  if (normalized.startsWith("68.32") || normalized.startsWith("81.10")) {
    variants.add("GESTIONE_IMMOBILI_CONDOMINI");
  }
  if (normalized.startsWith("49.3")) {
    variants.add("TRASPORTO_PERSONE");
  }
  if (parts[0] === "16" || parts[0] === "31") {
    variants.add("LEGNO_ARREDO");
  }
  if (parts[0] === "20") {
    variants.add("CHIMICA_COSMETICA");
  }
  if (normalized.startsWith("96.01")) {
    variants.add("LAVANDERIE_TINTORIE");
  }
  if (
    normalized.startsWith("90.02") ||
    normalized.startsWith("82.30") ||
    (normalized.startsWith("93.29") && !normalized.startsWith("93.29.10") && !normalized.startsWith("93.29.20"))
  ) {
    variants.add("EVENTI_ALLESTIMENTI");
  }

  return [...variants];
}

function buildDomainFilterByChecklistMode(checklistMode: InspectionChecklistMode) {
  if (checklistMode === InspectionChecklistMode.unified) {
    return undefined;
  }

  if (checklistMode === InspectionChecklistMode.haccp_only) {
    return {
      in: [ComplianceDomain.haccp, ComplianceDomain.both],
    };
  }

  return {
    in: [ComplianceDomain.safety, ComplianceDomain.both],
  };
}

function parseRetailScopes(raw?: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);
  } catch {
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
}

function buildRetailScopeVariants(scopes: string[]): string[] {
  const mapping: Record<string, string[]> = {
    retail_restaurant: ["RISTORANTI"],
    retail_pizzeria: ["PIZZERIA_ASPORTO"],
    retail_bar: ["BAR"],
    retail_butcher_counter: ["RETAIL_LARGE_BUTCHER"],
    retail_fish_counter: ["RETAIL_LARGE_FISH"],
    retail_produce_counter: ["RETAIL_LARGE_PRODUCE"],
    retail_deli_counter: ["RETAIL_LARGE_DELI"],
    retail_icecream: ["PASTICCERIA_GELATERIA"],
    retail_pastry: ["PASTICCERIA_GELATERIA"],
  };

  const variants = new Set<string>();
  for (const scope of scopes) {
    const key = scope.toLowerCase();
    const mapped = mapping[key];
    if (mapped) {
      mapped.forEach((value) => variants.add(value));
      continue;
    }
    variants.add(scope);
  }
  return [...variants];
}

function normalizeOptionalText(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function manualRequirementTemplateId(inspectionId: string): string {
  return `tmpl-inspection-${inspectionId}-manual-v1`;
}

function buildManualRequirementQuestion(rawRequirement: string): string {
  const cleaned = rawRequirement.replace(/\s+/g, " ").trim();
  if (cleaned.endsWith("?")) {
    return cleaned;
  }

  const withoutFinalPunctuation = cleaned.replace(/[.;:]+$/g, "");
  if (/^(e'|è|sono|risulta|risultano|il|la|lo|i|gli|le|l')\b/i.test(withoutFinalPunctuation)) {
    return `${withoutFinalPunctuation}?`;
  }

  return `Il requisito "${withoutFinalPunctuation}" risulta soddisfatto e documentabile?`;
}

function defaultManualServiceName(question: string): string {
  const compact = question.replace(/\?$/g, "").slice(0, 90);
  return `Adeguamento requisito manuale: ${compact}`;
}

const inspectionRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/verify/attestato/:inspectionId",
    async (request, reply) => {
      const params = z.object({ inspectionId: z.string().min(1) }).safeParse(request.params);
      const query = z.object({ token: z.string().min(8) }).safeParse(request.query ?? {});
      if (!params.success || !query.success) {
        return reply
          .type("text/html; charset=utf-8")
          .code(400)
          .send(
            "<!doctype html><html><body><h1>Attestato non verificabile</h1><p>Token o ID non validi.</p></body></html>",
          );
      }

      const token = query.data.token.trim();
      const resolved = await resolveAttestatoVerification(fastify, params.data.inspectionId, token);

      if (resolved.status === "inspection_not_found") {
        return reply
          .type("text/html; charset=utf-8")
          .code(404)
          .send("<!doctype html><html><body><h1>Attestato non trovato</h1><p>Inspection inesistente.</p></body></html>");
      }

      if (resolved.status === "attestato_not_found") {
        return reply
          .type("text/html; charset=utf-8")
          .code(404)
          .send(
            "<!doctype html><html><body><h1>Attestato non presente</h1><p>Non risulta alcun attestato valido per questo sopralluogo.</p></body></html>",
          );
      }

      const { inspection, attestato, score, stars, inspectionDate, isValid } = resolved;

      const title = isValid ? "Attestato verificato" : "Attestato non valido";
      const message = isValid
        ? "Documento autentico rilasciato da FedShield by FEDINVEST."
        : "Il QR non corrisponde a un attestato valido.";
      const safeCompany = escapeHtml(inspection.company.name);
      const safeVat = escapeHtml(inspection.company.vatNumber);
      const safeDate = inspectionDate.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" });
      const safeScore = `${score}/100`;
      const safeStars = `${stars}/5`;
      const downloadHref = `/api/verify/attestato/${encodeURIComponent(inspection.id)}/pdf?token=${encodeURIComponent(token)}`;

      const html = `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: light; }
      body { margin:0; font-family: Arial, sans-serif; background:#FEFEFE; color:#212D52; }
      .hero { background:#212D52; color:#FEFEFE; padding:24px 16px; text-align:center; }
      .hero .brand { color:#E65712; font-weight:700; letter-spacing:.02em; }
      .card { max-width: 820px; margin: 24px auto; background:#FEFEFE; border:1px solid #969CAD; border-radius:12px; padding:24px; }
      h1 { margin:0 0 8px 0; color:${isValid ? "#212D52" : "#E65712"}; }
      p { margin: 0 0 16px 0; }
      .grid { display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
      .row { background:#FEFEFE; border:1px solid #969CAD; border-radius:8px; padding:10px 12px; }
      .label { font-size:12px; color:#6D748D; margin-bottom:4px; text-transform:uppercase; letter-spacing:.03em; }
      .value { font-weight:700; }
      .footer { margin-top:16px; font-size:12px; color:#6D748D; }
      .actions { margin-top: 18px; display:flex; gap:10px; flex-wrap:wrap; }
      .btn { display:inline-block; background:#212D52; color:#FEFEFE; border-radius:8px; padding:10px 14px; text-decoration:none; font-weight:700; }
      .btn:hover { background:#394264; }
      .btn.secondary { background:#E65712; }
      .btn.secondary:hover { background:#EE8F5F; }
      .invalid-note { margin-top: 12px; color:#E65712; font-weight:700; }
      @media (max-width: 760px) { .grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <div class="hero">Verifica attestato <span class="brand">FedShield by FEDINVEST</span></div>
    <div class="card">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      <div class="grid">
        <div class="row"><div class="label">Ragione Sociale</div><div class="value">${safeCompany}</div></div>
        <div class="row"><div class="label">Partita IVA</div><div class="value">${safeVat}</div></div>
        <div class="row"><div class="label">Data sopralluogo</div><div class="value">${escapeHtml(safeDate)}</div></div>
        <div class="row"><div class="label">Fed Score</div><div class="value">${escapeHtml(safeScore)}</div></div>
        <div class="row"><div class="label">Stelline</div><div class="value">${escapeHtml(safeStars)}</div></div>
        <div class="row"><div class="label">ID attestato</div><div class="value">${escapeHtml(attestato.id)}</div></div>
      </div>
      <div class="actions">
        <a class="btn${isValid ? "" : " secondary"}" href="${downloadHref}">Scarica attestato PDF</a>
      </div>
      ${isValid ? "" : '<div class="invalid-note">Download non disponibile: QR non valido.</div>'}
      <div class="footer">FedShield by FEDINVEST S.r.l.</div>
    </div>
  </body>
</html>`;

      return reply.type("text/html; charset=utf-8").code(isValid ? 200 : 400).send(html);
    },
  );

  fastify.get(
    "/verify/attestato/:inspectionId/pdf",
    async (request, reply) => {
      const params = z.object({ inspectionId: z.string().min(1) }).safeParse(request.params);
      const query = z.object({ token: z.string().min(8) }).safeParse(request.query ?? {});
      if (!params.success || !query.success) {
        return reply.badRequest("Token o ID non validi.");
      }

      const token = query.data.token.trim();
      const resolved = await resolveAttestatoVerification(fastify, params.data.inspectionId, token);
      if (resolved.status === "inspection_not_found") {
        return reply.notFound("Inspection inesistente.");
      }
      if (resolved.status === "attestato_not_found") {
        return reply.notFound("Attestato non presente.");
      }
      if (!resolved.isValid) {
        return reply.badRequest("Token di verifica non valido.");
      }

      const { storageRoot, absolutePath } = resolveDocumentPath(resolved.attestato.filePath);
      if (!absolutePath.startsWith(storageRoot)) {
        return reply.forbidden("Percorso documento non valido.");
      }

      try {
        await access(absolutePath);
      } catch {
        return reply.notFound("File attestato non presente su disco.");
      }

      reply.header("Content-Type", "application/pdf");
      reply.header("Content-Disposition", `attachment; filename="${resolved.attestato.fileName}"`);
      return reply.send(createReadStream(absolutePath));
    },
  );

  fastify.get(
    "/documents/:documentId/download",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ documentId: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID documento non valido.");
      }

      const document = await fastify.prisma.generatedDocument.findUnique({
        where: { id: params.data.documentId },
      });
      if (!document) {
        return reply.notFound("Documento non trovato.");
      }

      const { storageRoot, absolutePath } = resolveDocumentPath(document.filePath);
      if (!absolutePath.startsWith(storageRoot)) {
        return reply.forbidden("Percorso documento non valido.");
      }

      try {
        await access(absolutePath);
      } catch {
        return reply.notFound("File documento non presente su disco.");
      }

      reply.header("Content-Type", "application/pdf");
      reply.header("Content-Disposition", `attachment; filename="${document.fileName}"`);
      return reply.send(createReadStream(absolutePath));
    },
  );

  fastify.get(
    "/inspections",
    { preHandler: [fastify.authenticate] },
    async () => {
      return fastify.prisma.inspection.findMany({
        include: {
          company: true,
          author: { select: { id: true, fullName: true, role: true } },
          validator: { select: { id: true, fullName: true, role: true } },
          nonConformities: true,
          answers: {
            include: {
              checklistItem: {
                select: {
                  id: true,
                  question: true,
                  area: true,
                  templateId: true,
                },
              },
            },
          },
        },
        orderBy: { happenedAt: "desc" },
      });
    },
  );

  fastify.get(
    "/inspections/:id/documents/requirements",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      const query = z.object({ retailScopes: z.string().optional() }).safeParse(request.query ?? {});
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }
      if (!query.success) {
        return reply.badRequest("Query requisiti documentali non valida.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({
        where: { id: params.data.id },
        include: {
          company: true,
          documents: true,
        },
      });

      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      const atecoVariants = buildAtecoVariants(inspection.company.atecoCode);
      const auth = request.user;
      const retailScopeVariants =
        auth.role === UserRole.admin
          ? []
          : buildRetailScopeVariants(parseRetailScopes(query.data.retailScopes));
      const macroGroupVariants = [...new Set([...atecoVariants, ...retailScopeVariants])];
      const domainFilter = buildDomainFilterByChecklistMode(inspection.checklistMode);
      const templates = await fastify.prisma.documentTemplate.findMany({
        where:
          atecoVariants.length > 0
            ? {
                isActive: true,
                OR: [
                  { isGeneral: true },
                  { atecoCode: { in: atecoVariants } },
                  ...(macroGroupVariants.length > 0 ? [{ macroGroup: { in: macroGroupVariants } }] : []),
                ],
                ...(domainFilter ? { domain: domainFilter } : {}),
              }
            : {
                isActive: true,
                ...(domainFilter ? { domain: domainFilter } : {}),
              },
        orderBy: [{ isRequired: "desc" }, { name: "asc" }],
      });

      const existingByName = new Map(inspection.documents.map((doc) => [doc.name.toLowerCase(), doc]));

      return templates.map((template) => {
        const existing = existingByName.get(template.name.toLowerCase());
        return {
          documentTemplateId: template.id,
          name: template.name,
          isRequired: template.isRequired,
          status: existing?.status ?? InspectionDocumentStatus.not_available,
          note: existing?.note ?? "",
        };
      });
    },
  );

  fastify.put(
    "/inspections/:id/documents",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      const parsed = upsertDocumentsSchema.safeParse(request.body);

      if (!params.success || !parsed.success) {
        return reply.badRequest("Payload documenti non valido.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({ where: { id: params.data.id } });
      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      if (inspection.status === "validated") {
        return reply.conflict("Sopralluogo validato: documenti non modificabili.");
      }

      for (const doc of parsed.data.documents) {
        await fastify.prisma.inspectionDocument.upsert({
          where: {
            inspectionId_name: {
              inspectionId: params.data.id,
              name: doc.name,
            },
          },
          update: {
            status: doc.status,
            note: doc.note,
            documentTemplateId: doc.documentTemplateId,
          },
          create: {
            inspectionId: params.data.id,
            name: doc.name,
            status: doc.status,
            note: doc.note,
            documentTemplateId: doc.documentTemplateId,
          },
        });
      }

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth.sub,
        action: "inspection.documents.upsert",
        entityType: "inspection",
        entityId: params.data.id,
        data: { documentsCount: parsed.data.documents.length },
      });

      return {
        inspectionId: params.data.id,
        documentsSaved: parsed.data.documents.length,
      };
    },
  );

  fastify.post(
    "/inspections",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = createInspectionSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload sopralluogo non valido.");
      }

      const auth = request.user;
      if (!auth.sub) return reply.unauthorized("JWT senza subject — login non valido.");

      const created = await fastify.prisma.inspection.create({
        data: {
          companyId: parsed.data.companyId,
          title: parsed.data.title,
          notes: parsed.data.notes,
          checklistMode: parsed.data.checklistMode ?? InspectionChecklistMode.unified,
          authorId: auth.sub,
          status: "draft",
          validatorId: null,
        },
      });

      await writeAudit(fastify, {
        userId: auth.sub,
        action: "inspection.create",
        entityType: "inspection",
        entityId: created.id,
        data: parsed.data,
      });

      return reply.code(201).send(created);
    },
  );

  fastify.post(
    "/inspections/nc",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = addNcSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload non conformita non valido.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({ where: { id: parsed.data.inspectionId } });
      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      if (inspection.status === "validated") {
        return reply.conflict("Il sopralluogo validato e immodificabile.");
      }

      const nc = await fastify.prisma.nonConformity.create({
        data: {
          inspectionId: parsed.data.inspectionId,
          title: parsed.data.title,
          description: parsed.data.description,
          suggestedServiceName: parsed.data.suggestedServiceName,
          suggestedServiceDescription: parsed.data.suggestedServiceDescription,
          suggestedServiceDeliveryMode: parsed.data.suggestedServiceDeliveryMode,
          isSanctionable: parsed.data.isSanctionable,
          severity: parsed.data.severity,
        },
      });

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth.sub,
        action: "nc.create",
        entityType: "inspection",
        entityId: parsed.data.inspectionId,
        data: parsed.data,
      });

      return reply.code(201).send(nc);
    },
  );

  fastify.get(
    "/inspections/:id/manual-requirements",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({ where: { id: params.data.id } });
      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      const templateId = manualRequirementTemplateId(params.data.id);
      const items = await fastify.prisma.checklistItem.findMany({
        where: { templateId },
        orderBy: [{ orderIndex: "asc" }],
      });

      return {
        templateId,
        items,
      };
    },
  );

  fastify.post(
    "/inspections/:id/manual-requirements",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      const parsed = manualRequirementSchema.safeParse(request.body);

      if (!params.success || !parsed.success) {
        return reply.badRequest("Payload requisito manuale non valido.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({
        where: { id: params.data.id },
        include: { company: true },
      });
      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      if (inspection.status === "validated") {
        return reply.conflict("Sopralluogo validato: requisiti manuali non modificabili.");
      }

      const templateId = manualRequirementTemplateId(inspection.id);
      await fastify.prisma.checklistTemplate.upsert({
        where: { id: templateId },
        update: {
          name: `Requisiti manuali - ${inspection.title}`,
          description: "Requisiti inseriti durante il sopralluogo e riformulati come domanda checklist.",
          atecoCode: inspection.company.atecoCode,
          isActive: true,
        },
        create: {
          id: templateId,
          name: `Requisiti manuali - ${inspection.title}`,
          description: "Requisiti inseriti durante il sopralluogo e riformulati come domanda checklist.",
          atecoCode: inspection.company.atecoCode,
          macroGroup: "MANUAL_REQUIREMENTS",
          isGeneral: false,
          isActive: true,
        },
      });

      const maxOrder = await fastify.prisma.checklistItem.aggregate({
        where: { templateId },
        _max: { orderIndex: true },
      });

      const rawRequirement = parsed.data.rawRequirement.trim();
      const question = buildManualRequirementQuestion(rawRequirement);
      const suggestedServiceName =
        normalizeOptionalText(parsed.data.suggestedServiceName) ?? defaultManualServiceName(question);

      const item = await fastify.prisma.checklistItem.create({
        data: {
          templateId,
          section: parsed.data.section,
          domain: parsed.data.domain,
          area: normalizeOptionalText(parsed.data.area) ?? "Requisito manuale",
          question,
          orderIndex: (maxOrder._max.orderIndex ?? 0) + 1,
          defaultSeverity: parsed.data.defaultSeverity,
          defaultSanctionable: parsed.data.defaultSanctionable,
          normReference: normalizeOptionalText(parsed.data.normReference),
          source: "manual_ai_reformulated",
          rawRequirement,
          suggestedServiceName,
          suggestedServiceDescription: normalizeOptionalText(parsed.data.suggestedServiceDescription),
          suggestedServiceDeliveryMode: parsed.data.suggestedServiceDeliveryMode,
        },
      });

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth.sub,
        action: "inspection.manual_requirement.create",
        entityType: "inspection",
        entityId: inspection.id,
        data: {
          checklistItemId: item.id,
          rawRequirement,
          question,
          suggestedServiceName,
          suggestedServiceDeliveryMode: parsed.data.suggestedServiceDeliveryMode,
        },
      });

      return reply.code(201).send({ item });
    },
  );

  fastify.post(
    "/inspections/:id/answers",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      const body = submitAnswersSchema.safeParse(request.body);

      if (!params.success || !body.success) {
        return reply.badRequest("Payload risposte checklist non valido.");
      }

      const inspectionId = params.data.id;
      const inspection = await fastify.prisma.inspection.findUnique({ where: { id: inspectionId } });

      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      if (inspection.status === "validated") {
        return reply.conflict("Sopralluogo validato: risposte non modificabili.");
      }

      const checklistItemIds = [...new Set(body.data.answers.map((answer) => answer.checklistItemId))];
      const checklistItems = await fastify.prisma.checklistItem.findMany({
        where: {
          id: { in: checklistItemIds },
        },
      });

      if (checklistItems.length !== checklistItemIds.length) {
        return reply.badRequest("Uno o piu checklistItemId non esistono.");
      }

      const itemById = new Map(checklistItems.map((item) => [item.id, item]));

      for (const answerPayload of body.data.answers) {
        const item = itemById.get(answerPayload.checklistItemId);
        if (!item) {
          continue;
        }

        const answer = await fastify.prisma.inspectionAnswer.upsert({
          where: {
            inspectionId_checklistItemId: {
              inspectionId,
              checklistItemId: answerPayload.checklistItemId,
            },
          },
          update: {
            value: answerPayload.value,
            note: answerPayload.note,
            severity: answerPayload.severity,
            isSanctionable: answerPayload.isSanctionable,
          },
          create: {
            inspectionId,
            checklistItemId: answerPayload.checklistItemId,
            value: answerPayload.value,
            note: answerPayload.note,
            severity: answerPayload.severity,
            isSanctionable: answerPayload.isSanctionable,
          },
        });

        if (answerPayload.value === ChecklistAnswerValue.no) {
          const baseGuidance = getNcGuidance(item.question, item.area);
          const guidance = {
            normReference: item.normReference ?? baseGuidance.normReference,
            sanctionImpact: baseGuidance.sanctionImpact,
            suggestedService: item.suggestedServiceName ?? baseGuidance.suggestedService,
          };
          const enrichedDescription = composeNcDescription(answerPayload.note, guidance, {
            suggestedServiceDescription: item.suggestedServiceDescription,
            suggestedServiceDeliveryMode: item.suggestedServiceDeliveryMode,
          });

          await fastify.prisma.nonConformity.upsert({
            where: {
              answerId: answer.id,
            },
            update: {
              title: item.question,
              description: enrichedDescription,
              suggestedServiceName: item.suggestedServiceName,
              suggestedServiceDescription: item.suggestedServiceDescription,
              suggestedServiceDeliveryMode: item.suggestedServiceDeliveryMode,
              severity: answerPayload.severity ?? item.defaultSeverity,
              isSanctionable: answerPayload.isSanctionable ?? item.defaultSanctionable,
            },
            create: {
              inspectionId,
              answerId: answer.id,
              title: item.question,
              description: enrichedDescription,
              suggestedServiceName: item.suggestedServiceName,
              suggestedServiceDescription: item.suggestedServiceDescription,
              suggestedServiceDeliveryMode: item.suggestedServiceDeliveryMode,
              severity: answerPayload.severity ?? item.defaultSeverity,
              isSanctionable: answerPayload.isSanctionable ?? item.defaultSanctionable,
            },
          });
        } else {
          await fastify.prisma.nonConformity.deleteMany({
            where: {
              answerId: answer.id,
            },
          });
        }
      }

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth.sub,
        action: "inspection.answers.upsert",
        entityType: "inspection",
        entityId: inspectionId,
        data: {
          answersCount: body.data.answers.length,
        },
      });

      const refreshed = await fastify.prisma.inspection.findUnique({
        where: { id: inspectionId },
        include: {
          nonConformities: true,
          answers: true,
        },
      });

      return {
        inspectionId,
        answersSaved: body.data.answers.length,
        nonConformities: refreshed?.nonConformities ?? [],
      };
    },
  );

  fastify.get(
    "/inspections/:id/report",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({
        where: { id: params.data.id },
        include: {
          company: true,
          author: { select: { id: true, fullName: true, role: true } },
          validator: { select: { id: true, fullName: true, role: true } },
          nonConformities: true,
          documents: true,
          answers: {
            include: {
              checklistItem: {
                select: {
                  question: true,
                  area: true,
                },
              },
            },
          },
        },
      });

      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      return buildInspectionReport(inspection);
    },
  );

  fastify.get(
    "/inspections/:id/summary",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({
        where: { id: params.data.id },
        include: {
          nonConformities: true,
          documents: true,
          answers: true,
        },
      });

      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      const score = computeInspectionComplianceScore(inspection.nonConformities);
      const hasSanctionableNc = inspection.nonConformities.some((nc) => nc.isSanctionable && !nc.isResolved);
      const attestatoEligible = !hasSanctionableNc && score >= config.attestatoMinScore;
      const reason = hasSanctionableNc
        ? "Presenti NC sanzionabili aperte."
        : score < config.attestatoMinScore
          ? `Punteggio insufficiente (${score}/100, soglia minima ${config.attestatoMinScore}).`
          : "Idonea al rilascio attestato.";

      return {
        inspectionId: inspection.id,
        status: inspection.status,
        totals: {
          answers: inspection.answers.length,
          nonConformities: inspection.nonConformities.length,
          sanctionableNc: inspection.nonConformities.filter((nc) => nc.isSanctionable).length,
          requestedDocuments: inspection.documents.filter((doc) => doc.status === "requested_later").length,
        },
        score,
        stars: starsFromScore(score),
        attestato: {
          eligible: attestatoEligible,
          reason,
          minScore: config.attestatoMinScore,
        },
      };
    },
  );

  fastify.post(
    "/inspections/:id/checklist/pdf",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const auth = request.user;
      try {
        const generated = await generateInspectionChecklistPdf(fastify, params.data.id, auth.sub);
        await writeAudit(fastify, {
          userId: auth.sub,
          action: "inspection.checklist.pdf.generate",
          entityType: "inspection",
          entityId: params.data.id,
          data: { documentId: generated.id },
        });
        return generated;
      } catch (error) {
        return reply.badRequest(
          error instanceof Error ? error.message : "Generazione checklist PDF non riuscita.",
        );
      }
    },
  );

  fastify.post(
    "/inspections/:id/report/pdf",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const auth = request.user;
      try {
        const generated = await generateInspectionReportPdf(fastify, params.data.id, auth.sub);
        await writeAudit(fastify, {
          userId: auth.sub,
          action: "inspection.report.pdf.generate",
          entityType: "inspection",
          entityId: params.data.id,
          data: { documentId: generated.id },
        });
        return generated;
      } catch (error) {
        return reply.badRequest(error instanceof Error ? error.message : "Generazione PDF non riuscita.");
      }
    },
  );

  fastify.post(
    "/inspections/:id/attestato/pdf",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const auth = request.user;
      try {
        const generated = await generateAttestatoPdf(fastify, params.data.id, auth.sub);
        await writeAudit(fastify, {
          userId: auth.sub,
          action: "inspection.attestato.pdf.generate",
          entityType: "inspection",
          entityId: params.data.id,
          data: { documentId: generated.id },
        });
        return generated;
      } catch (error) {
        return reply.badRequest(error instanceof Error ? error.message : "Generazione attestato non riuscita.");
      }
    },
  );

  fastify.get(
    "/inspections/:id/documents",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      return listDocuments(fastify, { inspectionId: params.data.id });
    },
  );

  fastify.post(
    "/inspections/:id/send-to-admin",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({ where: { id: params.data.id } });
      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      const updated = await fastify.prisma.inspection.update({
        where: { id: params.data.id },
        data: { sentToAdminAt: new Date() },
      });

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth.sub,
        action: "inspection.send_to_admin",
        entityType: "inspection",
        entityId: params.data.id,
      });

      return updated;
    },
  );

  fastify.post(
    "/inspections/validate",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = validateInspectionSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload validazione non valido.");
      }

      const auth = request.user;
      if (auth.role === UserRole.junior) {
        return reply.forbidden("Un utente junior non puo validare sopralluoghi.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({ where: { id: parsed.data.inspectionId } });
      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      if (inspection.status === "validated") {
        return reply.conflict("Sopralluogo gia validato.");
      }

      const status = parsed.data.approved ? "validated" : "draft";
      const updated = await fastify.prisma.inspection.update({
        where: { id: parsed.data.inspectionId },
        data: {
          status,
          validatorId: parsed.data.approved ? auth.sub : null,
          finalizedAt: parsed.data.approved ? inspection.finalizedAt ?? new Date() : null,
          notes: parsed.data.notes
            ? `${inspection.notes ?? ""}\n[VALIDATION NOTE] ${parsed.data.notes}`.trim()
            : inspection.notes,
        },
      });

      await writeAudit(fastify, {
        userId: auth.sub,
        action: parsed.data.approved ? "inspection.validate" : "inspection.reject",
        entityType: "inspection",
        entityId: inspection.id,
        data: parsed.data,
      });

      return updated;
    },
  );
};

export default inspectionRoutes;
