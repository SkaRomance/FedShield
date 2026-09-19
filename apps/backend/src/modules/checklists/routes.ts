import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { ChecklistSection, ComplianceDomain, InspectionChecklistMode } from "@prisma/client";
import { writeAudit } from "../../plugins/audit.js";

function buildAtecoVariants(atecoCode?: string) {
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

  return [...variants];
}

function buildDomainFilterByChecklistMode(checklistMode?: InspectionChecklistMode) {
  if (!checklistMode || checklistMode === InspectionChecklistMode.unified) {
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

function parseRetailScopes(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
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

const checklistRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/checklists/templates",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const query = z
        .object({
          atecoCode: z.string().optional(),
          checklistMode: z.nativeEnum(InspectionChecklistMode).optional(),
          retailScopes: z.string().optional(),
        })
        .safeParse(request.query);

      if (!query.success) {
        return reply.badRequest("Query non valida.");
      }

      const atecoVariants = buildAtecoVariants(query.data.atecoCode);
      const auth = request.user;
      const retailScopeVariants =
        auth.role === "admin" ? [] : buildRetailScopeVariants(parseRetailScopes(query.data.retailScopes));
      const macroGroupVariants = [...new Set([...atecoVariants, ...retailScopeVariants])];
      const domainFilter = buildDomainFilterByChecklistMode(query.data.checklistMode);
      const where =
        atecoVariants.length > 0
          ? {
              isActive: true,
              OR: [
                { isGeneral: true },
                { atecoCode: { in: atecoVariants } },
                ...(macroGroupVariants.length > 0 ? [{ macroGroup: { in: macroGroupVariants } }] : []),
              ],
              ...(domainFilter ? { items: { some: { domain: domainFilter } } } : {}),
            }
          : {
              isActive: true,
              ...(domainFilter ? { items: { some: { domain: domainFilter } } } : {}),
            };

      return fastify.prisma.checklistTemplate.findMany({
        where,
        orderBy: [{ isGeneral: "desc" }, { name: "asc" }],
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
      });
    },
  );

  fastify.get(
    "/checklists/templates/:id/items",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      const query = z
        .object({
          checklistMode: z.nativeEnum(InspectionChecklistMode).optional(),
        })
        .safeParse(request.query);
      if (!params.success) {
        return reply.badRequest("Template ID non valido.");
      }
      if (!query.success) {
        return reply.badRequest("Query non valida.");
      }

      const template = await fastify.prisma.checklistTemplate.findUnique({
        where: { id: params.data.id },
      });

      if (!template || !template.isActive) {
        return reply.notFound("Checklist template non trovata.");
      }

      const domainFilter = buildDomainFilterByChecklistMode(query.data.checklistMode);
      const items = await fastify.prisma.checklistItem.findMany({
        where: {
          templateId: template.id,
          ...(domainFilter ? { domain: domainFilter } : {}),
        },
        orderBy: { orderIndex: "asc" },
      });

      return {
        template,
        items,
      };
    },
  );

  fastify.get(
    "/checklists/document-templates",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const query = z
        .object({
          atecoCode: z.string().optional(),
          checklistMode: z.nativeEnum(InspectionChecklistMode).optional(),
          retailScopes: z.string().optional(),
        })
        .safeParse(request.query);

      if (!query.success) {
        return reply.badRequest("Query non valida.");
      }

      const atecoVariants = buildAtecoVariants(query.data.atecoCode);
      const auth = request.user;
      const retailScopeVariants =
        auth.role === "admin" ? [] : buildRetailScopeVariants(parseRetailScopes(query.data.retailScopes));
      const macroGroupVariants = [...new Set([...atecoVariants, ...retailScopeVariants])];
      const domainFilter = buildDomainFilterByChecklistMode(query.data.checklistMode);
      const where =
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
            };

      return fastify.prisma.documentTemplate.findMany({
        where,
        orderBy: [{ isRequired: "desc" }, { name: "asc" }],
      });
    },
  );

  // ---- S20: Aggiunta Volontaria Requisiti Specifici (Custom Checklist Items) ----
  // Consente al consulente di aggiungere controlli personalizzati / specifici
  // durante un sopralluogo per una determinata attività.
  fastify.post(
    "/checklists/custom-items",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const schema = z.object({
        templateId: z.string().min(1),
        section: z.nativeEnum(ChecklistSection).default(ChecklistSection.premises_equipment),
        domain: z.nativeEnum(ComplianceDomain).default(ComplianceDomain.both),
        area: z.string().min(1),
        question: z.string().min(3),
        normReference: z.string().optional(),
        defaultSeverity: z.number().int().min(1).max(4).default(1),
        defaultSanctionable: z.boolean().default(false),
      });

      const parsed = schema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Dati requisito specifico non validi.");
      }

      const template = await fastify.prisma.checklistTemplate.findUnique({
        where: { id: parsed.data.templateId },
      });
      if (!template) {
        return reply.notFound("Checklist template non trovata.");
      }

      const maxItem = await fastify.prisma.checklistItem.findFirst({
        where: { templateId: template.id },
        orderBy: { orderIndex: "desc" },
      });
      const nextOrderIndex = (maxItem?.orderIndex ?? 0) + 1;

      const created = await fastify.prisma.checklistItem.create({
        data: {
          templateId: template.id,
          section: parsed.data.section,
          domain: parsed.data.domain,
          area: parsed.data.area,
          question: parsed.data.question,
          normReference: parsed.data.normReference ?? null,
          defaultSeverity: parsed.data.defaultSeverity,
          defaultSanctionable: parsed.data.defaultSanctionable,
          orderIndex: nextOrderIndex,
          isRequired: false,
        },
      });

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth?.sub,
        action: "checklistItem.create_custom",
        entityType: "checklistItem",
        entityId: created.id,
        data: {
          templateId: template.id,
          area: created.area,
          question: created.question,
        },
      });

      return reply.code(201).send(created);
    },
  );

  // Bulk creation per inserimento massivo (es. requisiti specifici generati da macchine registrate)
  fastify.post(
    "/checklists/custom-items/bulk",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const schema = z.object({
        templateId: z.string().min(1),
        items: z
          .array(
            z.object({
              section: z.nativeEnum(ChecklistSection).default(ChecklistSection.premises_equipment),
              domain: z.nativeEnum(ComplianceDomain).default(ComplianceDomain.both),
              area: z.string().min(1),
              question: z.string().min(3),
              normReference: z.string().optional(),
              defaultSeverity: z.number().int().min(1).max(4).default(1),
              defaultSanctionable: z.boolean().default(false),
            }),
          )
          .min(1),
      });

      const parsed = schema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload requisiti massivi non valido.");
      }

      const template = await fastify.prisma.checklistTemplate.findUnique({
        where: { id: parsed.data.templateId },
      });
      if (!template) {
        return reply.notFound("Checklist template non trovata.");
      }

      const maxItem = await fastify.prisma.checklistItem.findFirst({
        where: { templateId: template.id },
        orderBy: { orderIndex: "desc" },
      });
      let currentOrderIndex = maxItem?.orderIndex ?? 0;

      const createdItems = [];
      for (const item of parsed.data.items) {
        currentOrderIndex += 1;
        const created = await fastify.prisma.checklistItem.create({
          data: {
            templateId: template.id,
            section: item.section,
            domain: item.domain,
            area: item.area,
            question: item.question,
            normReference: item.normReference ?? null,
            defaultSeverity: item.defaultSeverity,
            defaultSanctionable: item.defaultSanctionable,
            orderIndex: currentOrderIndex,
            isRequired: false,
          },
        });
        createdItems.push(created);
      }

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth?.sub,
        action: "checklistItem.create_bulk_custom",
        entityType: "checklistItem",
        entityId: template.id,
        data: { count: createdItems.length },
      });

      return reply.code(201).send(createdItems);
    },
  );

  fastify.delete(
    "/checklists/custom-items/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("Item ID non valido.");
      }

      const existing = await fastify.prisma.checklistItem.findUnique({
        where: { id: params.data.id },
      });
      if (!existing) {
        return reply.notFound("Requisito non trovato.");
      }

      await fastify.prisma.checklistItem.delete({
        where: { id: params.data.id },
      });

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth?.sub,
        action: "checklistItem.delete_custom",
        entityType: "checklistItem",
        entityId: params.data.id,
      });

      return reply.send({ success: true, id: params.data.id });
    },
  );
};

export default checklistRoutes;
