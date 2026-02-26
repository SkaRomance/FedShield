import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { writeAudit } from "../../plugins/audit.js";

const createCompanySchema = z.object({
  name: z.string().min(2),
  vatNumber: z.string().min(8),
  atecoCode: z.string().optional(),
  city: z.string().optional(),
});

const companyRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/companies",
    { preHandler: [fastify.authenticate] },
    async () => {
      return fastify.prisma.company.findMany({
        orderBy: { createdAt: "desc" },
      });
    },
  );

  fastify.post(
    "/companies",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = createCompanySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload azienda non valido.");
      }

      const created = await fastify.prisma.company.create({ data: parsed.data });
      const auth = request.user as { sub?: string };

      await writeAudit(fastify, {
        userId: auth?.sub,
        action: "company.create",
        entityType: "company",
        entityId: created.id,
        data: parsed.data,
      });

      return reply.code(201).send(created);
    },
  );
};

export default companyRoutes;
