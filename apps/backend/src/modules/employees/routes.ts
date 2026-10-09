import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requireSeniorOrAdmin } from "../../plugins/auth.js";
import { writeAudit } from "../../plugins/audit.js";
import { replyOnUniqueViolation } from "../../plugins/prisma-errors.js";

const birthDateSchema = z
  .union([
    z.string().datetime({ offset: true }),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    z.literal(""),
    z.null(),
  ])
  .optional();

const weeklyHoursSchema = z
  .union([
    z.number(),
    z.string().regex(/^\d+(\.\d+)?$/).transform((v) => Number(v)),
    z.null(),
  ])
  .optional();

const createEmployeeSchema = z.object({
  companyId: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  fiscalCode: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  hireDate: z
    .union([
      z.string().datetime({ offset: true }),
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      z.literal(""),
      z.null(),
    ])
    .optional(),
  birthDate: birthDateSchema,
  birthPlace: z.string().optional().nullable(),
  contractType: z.string().optional().nullable(),
  weeklyHours: weeklyHoursSchema,
  safetyRoles: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  assignedEquipment: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  notes: z.string().optional().nullable(),
});

const updateEmployeeSchema = createEmployeeSchema
  .partial()
  .omit({ companyId: true })
  .extend({
    leftDate: z
      .union([
        z.string().datetime({ offset: true }),
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        z.literal(""),
        z.null(),
      ])
      .optional(),
  });

const employeeRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/employees",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const { companyId, isActive } = request.query as {
        companyId?: string;
        isActive?: string;
      };
      return fastify.prisma.employee.findMany({
        where: {
          ...(companyId ? { companyId } : {}),
          ...(isActive !== undefined ? { isActive: isActive === "true" } : {}),
        },
        include: {
          trainingRecords: {
            include: { course: true },
            orderBy: { expiresAt: "asc" },
          },
        },
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      });
    },
  );

  fastify.get(
    "/employees/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const emp = await fastify.prisma.employee.findUnique({
        where: { id },
        include: {
          trainingRecords: { include: { course: true } },
          company: true,
        },
      });
      if (!emp) return reply.notFound("Dipendente non trovato.");
      return emp;
    },
  );

  fastify.post(
    "/employees",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const parsed = createEmployeeSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Dati dipendente non validi.");
      }
      const data: any = { ...parsed.data };
      if (data.hireDate !== undefined) {
        data.hireDate = data.hireDate ? new Date(data.hireDate) : null;
      }
      if (data.birthDate !== undefined) {
        data.birthDate = data.birthDate ? new Date(data.birthDate) : null;
      }
      if (Array.isArray(data.safetyRoles)) {
        data.safetyRoles = JSON.stringify(data.safetyRoles);
      }
      if (Array.isArray(data.assignedEquipment)) {
        data.assignedEquipment = JSON.stringify(data.assignedEquipment);
      }
      let created;
      try {
        created = await fastify.prisma.employee.create({ data });
      } catch (err) {
        if (replyOnUniqueViolation(reply, err, "Codice fiscale già registrato per questa azienda.")) {
          return;
        }
        throw err;
      }
      await writeAudit(fastify, {
        userId: request.user?.sub,
        action: "employee.create",
        entityType: "employee",
        entityId: created.id,
        data: parsed.data,
      });
      return reply.code(201).send(created);
    },
  );

  fastify.patch(
    "/employees/:id",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = updateEmployeeSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Dati aggiornamento non validi.");
      }
      const data: any = { ...parsed.data };
      if (data.hireDate !== undefined) {
        data.hireDate = data.hireDate ? new Date(data.hireDate) : null;
      }
      if (data.leftDate !== undefined) {
        data.leftDate = data.leftDate ? new Date(data.leftDate) : null;
      }
      if (data.birthDate !== undefined) {
        data.birthDate = data.birthDate ? new Date(data.birthDate) : null;
      }
      if (Array.isArray(data.safetyRoles)) {
        data.safetyRoles = JSON.stringify(data.safetyRoles);
      }
      if (Array.isArray(data.assignedEquipment)) {
        data.assignedEquipment = JSON.stringify(data.assignedEquipment);
      }
      let updated;
      try {
        updated = await fastify.prisma.employee.update({
          where: { id },
          data,
        });
      } catch (err) {
        if (replyOnUniqueViolation(reply, err, "Codice fiscale già registrato per questa azienda.")) {
          return;
        }
        throw err;
      }
      await writeAudit(fastify, {
        userId: request.user?.sub,
        action: "employee.update",
        entityType: "employee",
        entityId: updated.id,
        data: parsed.data,
      });
      return updated;
    },
  );

  fastify.delete(
    "/employees/:id",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      await fastify.prisma.employee.update({
        where: { id },
        data: { isActive: false, leftDate: new Date() },
      });
      await writeAudit(fastify, {
        userId: request.user?.sub,
        action: "employee.softDelete",
        entityType: "employee",
        entityId: id,
      });
      return reply.code(204).send();
    },
  );
};

export default employeeRoutes;
