import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requireSeniorOrAdmin } from "../../plugins/auth.js";
import { writeAudit } from "../../plugins/audit.js";

const createCourseSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  targetAudience: z.string().min(1),
  minHours: z.number().int().min(1),
  frequencyYears: z.number().int().min(1),
  normReference: z.string().min(1),
  domain: z.enum(["safety", "haccp", "both"]).optional(),
});

const createRequirementSchema = z.object({
  courseId: z.string().min(1),
  atecoCode: z.string().min(1),
  macroGroup: z.string().optional(),
  riskLevel: z.string().optional(),
  isMandatory: z.boolean().optional(),
  conditionalOn: z.string().optional(),
});

const createRecordSchema = z.object({
  employeeId: z.string().min(1),
  courseId: z.string().min(1),
  completedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  hoursDone: z.number().int().optional(),
  certificateNumber: z.string().optional(),
  note: z.string().optional(),
});

const trainingCourseRoutes: FastifyPluginAsync = async (fastify) => {
  // === CORSI ===
  fastify.get(
    "/training/courses",
    { preHandler: [fastify.authenticate] },
    async () => {
      return fastify.prisma.trainingCourse.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      });
    },
  );

  fastify.get(
    "/training/courses/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const course = await fastify.prisma.trainingCourse.findUnique({
        where: { id },
        include: { requirements: true },
      });
      if (!course) return reply.notFound("Corso non trovato.");
      return course;
    },
  );

  fastify.post(
    "/training/courses",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const parsed = createCourseSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Dati corso non validi.");
      }
      const created = await fastify.prisma.trainingCourse.create({
        data: parsed.data,
      });
      await writeAudit(fastify, {
        userId: (request.user as { sub?: string })?.sub,
        action: "trainingCourse.create",
        entityType: "trainingCourse",
        entityId: created.id,
        data: parsed.data,
      });
      return reply.code(201).send(created);
    },
  );

  // === REQUISITI PER ATECO ===
  fastify.get(
    "/training/requirements",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const { atecoCode, macroGroup } = request.query as {
        atecoCode?: string;
        macroGroup?: string;
      };
      return fastify.prisma.trainingRequirement.findMany({
        where: {
          ...(atecoCode ? { atecoCode } : {}),
          ...(macroGroup ? { macroGroup } : {}),
        },
        include: { course: true },
      });
    },
  );

  fastify.post(
    "/training/requirements",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const parsed = createRequirementSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Dati requisito non validi.");
      }
      const created = await fastify.prisma.trainingRequirement.create({
        data: parsed.data,
      });
      await writeAudit(fastify, {
        userId: (request.user as { sub?: string })?.sub,
        action: "trainingRequirement.create",
        entityType: "trainingRequirement",
        entityId: created.id,
        data: parsed.data,
      });
      return reply.code(201).send(created);
    },
  );

  // === RECORD DI FORMAZIONE DIPENDENTE ===
  fastify.get(
    "/training/records",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const { employeeId, companyId } = request.query as {
        employeeId?: string;
        companyId?: string;
      };
      if (companyId) {
        return fastify.prisma.employeeTrainingRecord.findMany({
          where: { employee: { companyId } },
          include: { employee: true, course: true },
          orderBy: { expiresAt: "asc" },
        });
      }
      return fastify.prisma.employeeTrainingRecord.findMany({
        where: employeeId ? { employeeId } : {},
        include: { employee: true, course: true },
        orderBy: { expiresAt: "asc" },
      });
    },
  );

  fastify.post(
    "/training/records",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = createRecordSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Dati record non validi.");
      }
      const data: any = { ...parsed.data };
      if (data.completedAt) data.completedAt = new Date(data.completedAt);
      if (data.expiresAt) data.expiresAt = new Date(data.expiresAt);
      const created = await fastify.prisma.employeeTrainingRecord.create({ data });
      await writeAudit(fastify, {
        userId: (request.user as { sub?: string })?.sub,
        action: "trainingRecord.create",
        entityType: "trainingRecord",
        entityId: created.id,
        data: parsed.data,
      });
      return reply.code(201).send(created);
    },
  );

  fastify.get(
    "/training/records/expiring",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const { days = "90", companyId } = request.query as {
        days?: string;
        companyId?: string;
      };
      const threshold = new Date();
      threshold.setDate(threshold.getDate() + parseInt(days, 10));
      return fastify.prisma.employeeTrainingRecord.findMany({
        where: {
          expiresAt: { lte: threshold, gte: new Date() },
          ...(companyId ? { employee: { companyId } } : {}),
        },
        include: { employee: true, course: true },
        orderBy: { expiresAt: "asc" },
      });
    },
  );
};

export default trainingCourseRoutes;
