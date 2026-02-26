import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { writeAudit } from "../../plugins/audit.js";
import { buildOdvDefensiveReport, findBestNcMatch } from "../../services/odv.service.js";

const createOdvInspectionSchema = z.object({
  companyId: z.string().min(1),
  authorityName: z.string().min(2),
  reportNumber: z.string().optional(),
  inspectedAt: z.coerce.date(),
  attachmentPath: z.string().optional(),
  notes: z.string().optional(),
  sanctions: z
    .array(
      z.object({
        violationTitle: z.string().min(2),
        violationNorm: z.string().optional(),
        amount: z.number().nonnegative().optional(),
        notes: z.string().optional(),
      }),
    )
    .default([]),
});

const odvRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/odv/inspections",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const query = z.object({ companyId: z.string().optional() }).safeParse(request.query);
      if (!query.success) {
        return reply.badRequest("Query ODV non valida.");
      }

      return fastify.prisma.odvInspection.findMany({
        where: {
          companyId: query.data.companyId,
        },
        include: {
          company: {
            select: { id: true, name: true },
          },
          sanctions: true,
        },
        orderBy: { inspectedAt: "desc" },
      });
    },
  );

  fastify.post(
    "/odv/inspections",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = createOdvInspectionSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload ispezione ODV non valido.");
      }

      const company = await fastify.prisma.company.findUnique({ where: { id: parsed.data.companyId } });
      if (!company) {
        return reply.notFound("Azienda non trovata.");
      }

      const auth = request.user as { sub?: string };
      const createdInspection = await fastify.prisma.odvInspection.create({
        data: {
          companyId: parsed.data.companyId,
          authorityName: parsed.data.authorityName,
          reportNumber: parsed.data.reportNumber,
          inspectedAt: parsed.data.inspectedAt,
          attachmentPath: parsed.data.attachmentPath,
          notes: parsed.data.notes,
          createdById: auth.sub,
        },
      });

      for (const sanction of parsed.data.sanctions) {
        const match = await findBestNcMatch(fastify, {
          companyId: parsed.data.companyId,
          inspectedAt: parsed.data.inspectedAt,
          violationTitle: sanction.violationTitle,
          violationNorm: sanction.violationNorm,
        });

        await fastify.prisma.odvSanction.create({
          data: {
            odvInspectionId: createdInspection.id,
            violationTitle: sanction.violationTitle,
            violationNorm: sanction.violationNorm,
            amount: sanction.amount,
            notes: sanction.notes,
            matchedNcId: match.matchedNcId,
            matchedInspectionId: match.matchedInspectionId,
            matchStatus: match.matchStatus,
            matchScore: match.matchScore,
          },
        });
      }

      await writeAudit(fastify, {
        userId: auth.sub,
        action: "odv.inspection.create",
        entityType: "odvInspection",
        entityId: createdInspection.id,
        data: {
          companyId: parsed.data.companyId,
          sanctionsCount: parsed.data.sanctions.length,
        },
      });

      return fastify.prisma.odvInspection.findUnique({
        where: { id: createdInspection.id },
        include: { sanctions: true },
      });
    },
  );

  fastify.get(
    "/odv/inspections/:id/analysis",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("Inspection ID non valido.");
      }

      const inspection = await fastify.prisma.odvInspection.findUnique({
        where: { id: params.data.id },
        include: {
          company: { select: { id: true, name: true } },
          sanctions: {
            include: {
              matchedNc: {
                select: {
                  id: true,
                  title: true,
                  inspection: {
                    select: {
                      id: true,
                      title: true,
                      happenedAt: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!inspection) {
        return reply.notFound("Ispezione ODV non trovata.");
      }

      return inspection;
    },
  );

  fastify.get(
    "/odv/defensive-report/:companyId",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ companyId: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("Company ID non valido.");
      }

      return buildOdvDefensiveReport(fastify, params.data.companyId);
    },
  );
};

export default odvRoutes;
