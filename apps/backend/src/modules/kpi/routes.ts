import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { writeAudit } from "../../plugins/audit.js";
import {
  buildKpiOverview,
  computeCompanyKpi,
  computeConsultantsKpi,
  persistKpiSnapshots,
} from "../../services/kpi.service.js";

const kpiRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/kpi/overview",
    { preHandler: [fastify.authenticate] },
    async () => {
      return buildKpiOverview(fastify);
    },
  );

  fastify.get(
    "/kpi/companies/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("Company ID non valido.");
      }

      const company = await fastify.prisma.company.findUnique({ where: { id: params.data.id } });
      if (!company) {
        return reply.notFound("Azienda non trovata.");
      }

      return computeCompanyKpi(fastify, company.id);
    },
  );

  fastify.get(
    "/kpi/consultants",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const query = z
        .object({
          monthsWindow: z.coerce.number().int().min(1).max(24).optional(),
          minInspectionsForAlert: z.coerce.number().int().min(1).max(100).optional(),
          expectedNcPerInspection: z.coerce.number().min(0).max(5).optional(),
        })
        .safeParse(request.query);

      if (!query.success) {
        return reply.badRequest("Query KPI consulenti non valida.");
      }

      return computeConsultantsKpi(fastify, query.data);
    },
  );

  fastify.post(
    "/kpi/snapshots",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const auth = request.user as { sub?: string };
      const result = await persistKpiSnapshots(fastify);

      await writeAudit(fastify, {
        userId: auth.sub,
        action: "kpi.snapshot.create",
        entityType: "kpi",
        data: result,
      });

      return result;
    },
  );
};

export default kpiRoutes;
