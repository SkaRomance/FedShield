import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { writeAudit } from "../../plugins/audit.js";
import { requireSeniorOrAdmin } from "../../plugins/auth.js";

const createCompanySchema = z.object({
  name: z.string().min(2),
  vatNumber: z.string().min(8),
  legalForm: z.string().optional(),
  reaNumber: z.string().optional(),
  employeesInfo: z.string().optional(),
  email: z.string().optional(),
  pec: z.string().optional(),
  phone: z.string().optional(),
  atecoCode: z.string().optional(),
  riskLevel: z.string().optional(),
  description: z.string().optional(),
  legalAddress: z.string().optional(),
  localUnitAddress: z.string().optional(),
  preventionSystemSubjects: z.string().optional(),
  employerRsppPreposto: z.string().optional(),
  occupationalDoctor: z.string().optional(),
  rls: z.string().optional(),
  emergencyTeam: z.string().optional(),
  firstAidTeam: z.string().optional(),
  haccpResponsabileAutocontrollo: z.string().optional(),
  haccpConsulenteEsterno: z.string().optional(),
  haccpAdditionalResponsabili: z.string().optional(),
  city: z.string().optional(),
});
const updateCompanySchema = createCompanySchema.partial();
const companyParamsSchema = z.object({
  id: z.string().min(1),
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
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
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

  fastify.patch(
    "/companies/:id",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const params = companyParamsSchema.safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("Parametri azienda non validi.");
      }

      const parsed = updateCompanySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload aggiornamento azienda non valido.");
      }

      if (Object.keys(parsed.data).length === 0) {
        return reply.badRequest("Nessun campo da aggiornare.");
      }

      const existing = await fastify.prisma.company.findUnique({ where: { id: params.data.id } });
      if (!existing) {
        return reply.notFound("Azienda non trovata.");
      }

      const updated = await fastify.prisma.company.update({
        where: { id: params.data.id },
        data: parsed.data,
      });
      const auth = request.user as { sub?: string };

      await writeAudit(fastify, {
        userId: auth?.sub,
        action: "company.update",
        entityType: "company",
        entityId: updated.id,
        data: parsed.data,
      });

      return reply.send(updated);
    },
  );
};

export default companyRoutes;
