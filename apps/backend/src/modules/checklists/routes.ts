import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

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
        })
        .safeParse(request.query);

      if (!query.success) {
        return reply.badRequest("Query non valida.");
      }

      const atecoVariants = buildAtecoVariants(query.data.atecoCode);
      const where =
        atecoVariants.length > 0
          ? {
              isActive: true,
              OR: [
                { isGeneral: true },
                { atecoCode: { in: atecoVariants } },
                { macroGroup: { in: atecoVariants } },
              ],
            }
          : {
              isActive: true,
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
      if (!params.success) {
        return reply.badRequest("Template ID non valido.");
      }

      const template = await fastify.prisma.checklistTemplate.findUnique({
        where: { id: params.data.id },
      });

      if (!template || !template.isActive) {
        return reply.notFound("Checklist template non trovata.");
      }

      const items = await fastify.prisma.checklistItem.findMany({
        where: { templateId: template.id },
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
        })
        .safeParse(request.query);

      if (!query.success) {
        return reply.badRequest("Query non valida.");
      }

      const atecoVariants = buildAtecoVariants(query.data.atecoCode);
      const where =
        atecoVariants.length > 0
          ? {
              isActive: true,
              OR: [
                { isGeneral: true },
                { atecoCode: { in: atecoVariants } },
                { macroGroup: { in: atecoVariants } },
              ],
            }
          : {
              isActive: true,
            };

      return fastify.prisma.documentTemplate.findMany({
        where,
        orderBy: [{ isRequired: "desc" }, { name: "asc" }],
      });
    },
  );
};

export default checklistRoutes;
