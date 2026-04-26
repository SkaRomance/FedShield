import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requireSeniorOrAdmin } from "../../plugins/auth.js";
import { writeAudit } from "../../plugins/audit.js";
import { replyOnUniqueViolation } from "../../plugins/prisma-errors.js";

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

const equipmentStatusEnum = z.enum(["active", "under_maintenance", "expired", "decommissioned"]);

// H3 (review): nelle PATCH consentire null su campi data per "resettare"
// (es. cancellare nextCheckAt finché un estintore non viene ricaricato).
const nullableDate = z.union([z.string().datetime(), z.null()]).optional();

const updateEquipmentSchema = createEquipmentSchema
  .partial()
  .omit({ companyId: true })
  .extend({
    status: equipmentStatusEnum.optional(),
    lastCheckAt: nullableDate,
    nextCheckAt: nullableDate,
  });

const updateMachineSchema = createMachineSchema
  .partial()
  .omit({ companyId: true })
  .extend({
    status: equipmentStatusEnum.optional(),
    lastMaintenanceAt: nullableDate,
    nextMaintenanceAt: nullableDate,
    lastSafetyCheckAt: nullableDate,
    nextSafetyCheckAt: nullableDate,
  });

const updateFireExtinguisherSchema = createFireExtinguisherSchema
  .partial()
  .omit({ companyId: true })
  .extend({
    status: equipmentStatusEnum.optional(),
    manufactureDate: nullableDate,
    lastCheckAt: nullableDate,
    nextCheckAt: nullableDate,
    lastRechargeAt: nullableDate,
  });

const updateFirstAidKitSchema = createFirstAidKitSchema
  .partial()
  .omit({ companyId: true })
  .extend({
    status: equipmentStatusEnum.optional(),
    lastCheckAt: nullableDate,
    nextCheckAt: nullableDate,
    replenishedAt: nullableDate,
  });

function parseDates(data: any, fields: string[]) {
  const result = { ...data };
  for (const f of fields) {
    if (result[f] === null) {
      // explicit reset
      result[f] = null;
    } else if (result[f]) {
      result[f] = new Date(result[f]);
    }
  }
  return result;
}

// S8 (L3): cap risultati lista asset per prevenire payload massivi
// quando il client non passa companyId. Default 200, max 500 via ?limit=
function parseLimit(query: { limit?: string }, defaultLimit = 200, maxLimit = 500): number {
  const raw = query.limit ? Number.parseInt(query.limit, 10) : defaultLimit;
  if (!Number.isFinite(raw) || raw <= 0) return defaultLimit;
  return Math.min(raw, maxLimit);
}

const equipmentRoutes: FastifyPluginAsync = async (fastify) => {
  // === GENERIC EQUIPMENT ===
  fastify.get(
    "/equipment",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const query = request.query as { companyId?: string; status?: "active" | "under_maintenance" | "expired" | "decommissioned"; limit?: string };
      return fastify.prisma.equipment.findMany({
        where: {
          ...(query.companyId ? { companyId: query.companyId } : {}),
          ...(query.status ? { status: query.status } : {}),
        },
        orderBy: { nextCheckAt: "asc" },
        take: parseLimit(query),
      });
    },
  );

  fastify.post(
    "/equipment",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const parsed = createEquipmentSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest("Dati equipaggiamento non validi.");
      let created;
      try {
        created = await fastify.prisma.equipment.create({
          data: parseDates(parsed.data, ["lastCheckAt", "nextCheckAt"]),
        });
      } catch (err) {
        if (replyOnUniqueViolation(reply, err, "Numero di serie già usato per un'attrezzatura della stessa azienda.")) {
          return;
        }
        throw err;
      }
      await writeAudit(fastify, {
        userId: request.user?.sub,
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
      const query = request.query as { companyId?: string; status?: "active" | "under_maintenance" | "expired" | "decommissioned"; limit?: string };
      return fastify.prisma.machine.findMany({
        where: {
          ...(query.companyId ? { companyId: query.companyId } : {}),
          ...(query.status ? { status: query.status } : {}),
        },
        orderBy: [{ nextMaintenanceAt: "asc" }, { nextSafetyCheckAt: "asc" }],
        take: parseLimit(query),
      });
    },
  );

  fastify.post(
    "/machines",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const parsed = createMachineSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest("Dati macchina non validi.");
      let created;
      try {
        created = await fastify.prisma.machine.create({
          data: parseDates(parsed.data, [
            "lastMaintenanceAt", "nextMaintenanceAt",
            "lastSafetyCheckAt", "nextSafetyCheckAt",
          ]),
        });
      } catch (err) {
        if (replyOnUniqueViolation(reply, err, "Numero di serie già usato per una macchina della stessa azienda.")) {
          return;
        }
        throw err;
      }
      await writeAudit(fastify, {
        userId: request.user?.sub,
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
      const query = request.query as { companyId?: string; status?: "active" | "under_maintenance" | "expired" | "decommissioned"; limit?: string };
      return fastify.prisma.fireExtinguisher.findMany({
        where: {
          ...(query.companyId ? { companyId: query.companyId } : {}),
          ...(query.status ? { status: query.status } : {}),
        },
        orderBy: { nextCheckAt: "asc" },
        take: parseLimit(query),
      });
    },
  );

  fastify.post(
    "/fire-extinguishers",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const parsed = createFireExtinguisherSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest("Dati estintore non validi.");
      let created;
      try {
        created = await fastify.prisma.fireExtinguisher.create({
          data: parseDates(parsed.data, ["manufactureDate", "lastCheckAt", "nextCheckAt", "lastRechargeAt"]),
        });
      } catch (err) {
        if (replyOnUniqueViolation(reply, err, "Codice estintore già registrato per questa azienda.")) {
          return;
        }
        throw err;
      }
      await writeAudit(fastify, {
        userId: request.user?.sub,
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
      const query = request.query as { companyId?: string; status?: "active" | "under_maintenance" | "expired" | "decommissioned"; limit?: string };
      return fastify.prisma.firstAidKit.findMany({
        where: {
          ...(query.companyId ? { companyId: query.companyId } : {}),
          ...(query.status ? { status: query.status } : {}),
        },
        orderBy: { nextCheckAt: "asc" },
        take: parseLimit(query),
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
        userId: request.user?.sub,
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

  // === EDIT/DELETE EQUIPMENT ===
  fastify.patch(
    "/equipment/:id",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = updateEquipmentSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest("Dati aggiornamento non validi.");
      let updated;
      try {
        updated = await fastify.prisma.equipment.update({
          where: { id },
          data: parseDates(parsed.data, ["lastCheckAt", "nextCheckAt"]),
        });
      } catch (err) {
        if (replyOnUniqueViolation(reply, err, "Numero di serie già usato per un'attrezzatura della stessa azienda.")) {
          return;
        }
        throw err;
      }
      await writeAudit(fastify, {
        userId: request.user?.sub,
        action: "equipment.update",
        entityType: "equipment",
        entityId: updated.id,
        data: parsed.data,
      });
      return updated;
    },
  );

  fastify.delete(
    "/equipment/:id",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      await fastify.prisma.equipment.update({
        where: { id },
        data: { status: "decommissioned" },
      });
      await writeAudit(fastify, {
        userId: request.user?.sub,
        action: "equipment.decommission",
        entityType: "equipment",
        entityId: id,
      });
      return reply.code(204).send();
    },
  );

  // === EDIT/DELETE MACHINES ===
  fastify.get(
    "/machines/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const m = await fastify.prisma.machine.findUnique({ where: { id } });
      if (!m) return reply.notFound("Macchina non trovata.");
      return m;
    },
  );

  fastify.patch(
    "/machines/:id",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = updateMachineSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest("Dati aggiornamento non validi.");
      let updated;
      try {
        updated = await fastify.prisma.machine.update({
          where: { id },
          data: parseDates(parsed.data, [
            "lastMaintenanceAt", "nextMaintenanceAt",
            "lastSafetyCheckAt", "nextSafetyCheckAt",
          ]),
        });
      } catch (err) {
        if (replyOnUniqueViolation(reply, err, "Numero di serie già usato per una macchina della stessa azienda.")) {
          return;
        }
        throw err;
      }
      await writeAudit(fastify, {
        userId: request.user?.sub,
        action: "machine.update",
        entityType: "machine",
        entityId: updated.id,
        data: parsed.data,
      });
      return updated;
    },
  );

  fastify.delete(
    "/machines/:id",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      await fastify.prisma.machine.update({
        where: { id },
        data: { status: "decommissioned" },
      });
      await writeAudit(fastify, {
        userId: request.user?.sub,
        action: "machine.decommission",
        entityType: "machine",
        entityId: id,
      });
      return reply.code(204).send();
    },
  );

  // === EDIT/DELETE FIRE EXTINGUISHERS ===
  fastify.get(
    "/fire-extinguishers/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const e = await fastify.prisma.fireExtinguisher.findUnique({ where: { id } });
      if (!e) return reply.notFound("Estintore non trovato.");
      return e;
    },
  );

  fastify.patch(
    "/fire-extinguishers/:id",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = updateFireExtinguisherSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest("Dati aggiornamento non validi.");
      let updated;
      try {
        updated = await fastify.prisma.fireExtinguisher.update({
          where: { id },
          data: parseDates(parsed.data, ["manufactureDate", "lastCheckAt", "nextCheckAt", "lastRechargeAt"]),
        });
      } catch (err) {
        if (replyOnUniqueViolation(reply, err, "Codice estintore già registrato per questa azienda.")) {
          return;
        }
        throw err;
      }
      await writeAudit(fastify, {
        userId: request.user?.sub,
        action: "fireExtinguisher.update",
        entityType: "fireExtinguisher",
        entityId: updated.id,
        data: parsed.data,
      });
      return updated;
    },
  );

  fastify.delete(
    "/fire-extinguishers/:id",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      await fastify.prisma.fireExtinguisher.update({
        where: { id },
        data: { status: "decommissioned" },
      });
      await writeAudit(fastify, {
        userId: request.user?.sub,
        action: "fireExtinguisher.decommission",
        entityType: "fireExtinguisher",
        entityId: id,
      });
      return reply.code(204).send();
    },
  );

  // === EDIT/DELETE FIRST AID KITS ===
  fastify.get(
    "/first-aid-kits/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const k = await fastify.prisma.firstAidKit.findUnique({ where: { id } });
      if (!k) return reply.notFound("Cassetta PS non trovata.");
      return k;
    },
  );

  fastify.patch(
    "/first-aid-kits/:id",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = updateFirstAidKitSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest("Dati aggiornamento non validi.");
      const updated = await fastify.prisma.firstAidKit.update({
        where: { id },
        data: parseDates(parsed.data, ["lastCheckAt", "nextCheckAt", "replenishedAt"]),
      });
      await writeAudit(fastify, {
        userId: request.user?.sub,
        action: "firstAidKit.update",
        entityType: "firstAidKit",
        entityId: updated.id,
        data: parsed.data,
      });
      return updated;
    },
  );

  fastify.delete(
    "/first-aid-kits/:id",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      await fastify.prisma.firstAidKit.update({
        where: { id },
        data: { status: "decommissioned" },
      });
      await writeAudit(fastify, {
        userId: request.user?.sub,
        action: "firstAidKit.decommission",
        entityType: "firstAidKit",
        entityId: id,
      });
      return reply.code(204).send();
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
