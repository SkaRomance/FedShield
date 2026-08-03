import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { ComplianceDomain, InspectionChecklistMode } from "@prisma/client";

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
};

export default checklistRoutes;
