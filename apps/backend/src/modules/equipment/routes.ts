import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requireSeniorOrAdmin } from "../../plugins/auth.js";
import { writeAudit } from "../../plugins/audit.js";

const createEquipmentSchema = z.object({
  companyId: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  location: z.string().optional(),
  lastCheckAt: z.string().datetime().optional(),
  nextCheckAt: z.string().datetime().optional(),
  note: z.string().optional(),
});

const createMachineSchema = z.object({
  companyId: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  location: z.string().optional(),
  riskLevel: z.string().optional(),
  lastMaintenanceAt: z.string().datetime().optional(),
  nextMaintenanceAt: z.string().datetime().optional(),
  lastSafetyCheckAt: z.string().datetime().optional(),
  nextSafetyCheckAt: z.string().datetime().optional(),
  note: z.string().optional(),
});

const createFireExtinguisherSchema = z.object({
  companyId: z.string().min(1),
  code: z.string().min(1),
  type: z.string().min(1),
  location: z.string().min(1),
  capacity: z.string().optional(),
  manufactureDate: z.string().datetime().optional(),
  lastCheckAt: z.string().datetime().optional(),
  nextCheckAt: z.string().datetime().optional(),
  lastRechargeAt: z.string().datetime().optional(),
  note: z.string().optional(),
});

const createFirstAidKitSchema = z.object({
  companyId: z.string().min(1),
  location: z.string().min(1),
  contents: z.string().optional(),
  lastCheckAt: z.string().datetime().optional(),
  nextCheckAt: z.string().datetime().optional(),
  replenishedAt: z.string().datetime().optional(),
  note: z.string().optional(),
});

function parseDates(data: any, fields: string[]) {
  const result = { ...data };
  for (const f of fields) {
    if (result[f]) result[f] = new Date(result[f]);
  }
  return result;
}

const equipmentRoutes: FastifyPluginAsync = async (fastify) => {
  // === GENERIC EQUIPMENT ===
  fastify.get(
    "/equipment",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const { companyId, status } = request.query as { companyId?: string; status?: string };
      return fastify.prisma.equipment.findMany({
        where: {
          ...(companyId ? { companyId } : {}),
          ...(status ? { status } : {}),
        },
        orderBy: { nextCheckAt: "asc" },
      });
    },
  );

  fastify.post(
    "/equipment",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const parsed = createEquipmentSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest("Dati equipaggiamento non validi.");
      const created = await fastify.prisma.equipment.create({
        data: parseDates(parsed.data, ["lastCheckAt", "nextCheckAt"]),
      });
      await writeAudit(fastify, {
        userId: (request.user as { sub?: string })?.sub,
        action: "equipment.create",
        entityType: "equipment",
        entityId: created.id,
        data: parsed.data,
      });
      return reply.code(201).send(created);
    },
  );

  // === MACHINES ===
  fastify.get(
    "/machines",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const { companyId, status } = request.query as { companyId?: string; status?: string };
      return fastify.prisma.machine.findMany({
        where: {
          ...(companyId ? { companyId } : {}),
          ...(status ? { status } : {}),
        },
        orderBy: [{ nextMaintenanceAt: "asc" }, { nextSafetyCheckAt: "asc" }],
      });
    },
  );

  fastify.post(
    "/machines",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const parsed = createMachineSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest("Dati macchina non validi.");
      const created = await fastify.prisma.machine.create({
        data: parseDates(parsed.data, [
          "lastMaintenanceAt", "nextMaintenanceAt",
          "lastSafetyCheckAt", "nextSafetyCheckAt",
        ]),
      });
      await writeAudit(fastify, {
        userId: (request.user as { sub?: string })?.sub,
        action: "machine.create",
        entityType: "machine",
        entityId: created.id,
        data: parsed.data,
      });
      return reply.code(201).send(created);
    },
  );

  // === FIRE EXTINGUISHERS ===
  fastify.get(
    "/fire-extinguishers",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const { companyId, status } = request.query as { companyId?: string; status?: string };
      return fastify.prisma.fireExtinguisher.findMany({
        where: {
          ...(companyId ? { companyId } : {}),
          ...(status ? { status } : {}),
        },
        orderBy: { nextCheckAt: "asc" },
      });
    },
  );

  fastify.post(
    "/fire-extinguishers",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const parsed = createFireExtinguisherSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest("Dati estintore non validi.");
      const created = await fastify.prisma.fireExtinguisher.create({
        data: parseDates(parsed.data, ["manufactureDate", "lastCheckAt", "nextCheckAt", "lastRechargeAt"]),
      });
      await writeAudit(fastify, {
        userId: (request.user as { sub?: string })?.sub,
        action: "fireExtinguisher.create",
        entityType: "fireExtinguisher",
        entityId: created.id,
        data: parsed.data,
      });
      return reply.code(201).send(created);
    },
  );

  // === FIRST AID KITS ===
  fastify.get(
    "/first-aid-kits",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const { companyId, status } = request.query as { companyId?: string; status?: string };
      return fastify.prisma.firstAidKit.findMany({
        where: {
          ...(companyId ? { companyId } : {}),
          ...(status ? { status } : {}),
        },
        orderBy: { nextCheckAt: "asc" },
      });
    },
  );

  fastify.post(
    "/first-aid-kits",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const parsed = createFirstAidKitSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest("Dati cassetta PS non validi.");
      const created = await fastify.prisma.firstAidKit.create({
        data: parseDates(parsed.data, ["lastCheckAt", "nextCheckAt", "replenishedAt"]),
      });
      await writeAudit(fastify, {
        userId: (request.user as { sub?: string })?.sub,
        action: "firstAidKit.create",
        entityType: "firstAidKit",
        entityId: created.id,
        data: parsed.data,
      });
      return reply.code(201).send(created);
    },
  );

  // === GET SINGLE EQUIPMENT ===
  fastify.get(
    "/equipment/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const eq = await fastify.prisma.equipment.findUnique({
        where: { id },
      });
      if (!eq) return reply.notFound("Asset non trovato.");
      return eq;
    },
  );

  // === DASHBOARD OVERVIEW ===
  fastify.get(
    "/equipment/overview",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const { companyId } = request.query as { companyId?: string };
      if (!companyId) return { error: "companyId richiesto" };
      const where = { companyId };

      const [equipment, machines, extinguishers, firstAidKits] = await Promise.all([
        fastify.prisma.equipment.findMany({ where, orderBy: { nextCheckAt: "asc" } }),
        fastify.prisma.machine.findMany({ where, orderBy: { nextMaintenanceAt: "asc" } }),
        fastify.prisma.fireExtinguisher.findMany({ where, orderBy: { nextCheckAt: "asc" } }),
        fastify.prisma.firstAidKit.findMany({ where, orderBy: { nextCheckAt: "asc" } }),
      ]);

      const now = new Date();
      const expiringSoon = (arr: any[], field: string) =>
        arr.filter((i) => i[field] && new Date(i[field]) <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));

      return {
        equipment: { total: equipment.length, expiring: expiringSoon(equipment, "nextCheckAt") },
        machines: { total: machines.length, expiring: expiringSoon(machines, "nextMaintenanceAt") },
        extinguishers: { total: extinguishers.length, expiring: expiringSoon(extinguishers, "nextCheckAt") },
        firstAidKits: { total: firstAidKits.length, expiring: expiringSoon(firstAidKits, "nextCheckAt") },
      };
    },
  );
};

export default equipmentRoutes;
