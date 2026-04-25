import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requireSeniorOrAdmin } from "../../plugins/auth.js";

const createEmployeeSchema = z.object({
  companyId: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  fiscalCode: z.string().optional(),
  role: z.string().optional(),
  department: z.string().optional(),
  hireDate: z.string().datetime().optional(),
});

const updateEmployeeSchema = createEmployeeSchema.partial().omit({ companyId: true });

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
      if (data.hireDate) data.hireDate = new Date(data.hireDate);
      const created = await fastify.prisma.employee.create({ data });
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
      if (data.hireDate) data.hireDate = new Date(data.hireDate);
      if (data.leftDate) data.leftDate = new Date(data.leftDate);
      const updated = await fastify.prisma.employee.update({
        where: { id },
        data,
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
      return reply.code(204).send();
    },
  );
};

export default employeeRoutes;
