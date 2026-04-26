import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { writeAudit } from "../../plugins/audit.js";
import { requireActiveLicense } from "../../services/licensing.service.js";
import { buildSyncDelta, ingestSyncEvents } from "../../services/sync.service.js";

const pushSchema = z.object({
  deviceId: z.string().min(8),
  heartbeatToken: z.string().min(8),
  events: z
    .array(
      z.object({
        clientEventId: z.string().min(4),
        eventType: z.string().min(2),
        entityType: z.string().min(2),
        entityId: z.string().optional(),
        payload: z.unknown(),
        occurredAt: z.coerce.date(),
      }),
    )
    .max(500)
    .default([]),
});

const pullSchema = z.object({
  deviceId: z.string().min(8),
  heartbeatToken: z.string().min(8),
  since: z.coerce.date().optional(),
});

const ackSchema = z.object({
  deviceId: z.string().min(8),
  heartbeatToken: z.string().min(8),
  cursor: z.coerce.date().optional(),
});

const syncRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/sync/push",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = pushSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload sync push non valido.");
      }

      let license;
      try {
        license = await requireActiveLicense(fastify, {
          deviceId: parsed.data.deviceId,
          heartbeatToken: parsed.data.heartbeatToken,
        });
      } catch (error) {
        return reply.forbidden(error instanceof Error ? error.message : "Licenza non valida.");
      }

      const ingest = await ingestSyncEvents(fastify, {
        deviceId: parsed.data.deviceId,
        deviceLicenseId: license.id,
        events: parsed.data.events,
      });

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth.sub,
        action: "sync.push",
        entityType: "sync",
        entityId: parsed.data.deviceId,
        data: ingest,
      });

      return {
        ...ingest,
        serverTime: new Date(),
      };
    },
  );

  fastify.post(
    "/sync/pull",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = pullSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload sync pull non valido.");
      }

      try {
        await requireActiveLicense(fastify, {
          deviceId: parsed.data.deviceId,
          heartbeatToken: parsed.data.heartbeatToken,
        });
      } catch (error) {
        return reply.forbidden(error instanceof Error ? error.message : "Licenza non valida.");
      }

      return buildSyncDelta(fastify, { since: parsed.data.since });
    },
  );

  fastify.post(
    "/sync/ack",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = ackSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload sync ack non valido.");
      }

      const license = await requireActiveLicense(fastify, {
        deviceId: parsed.data.deviceId,
        heartbeatToken: parsed.data.heartbeatToken,
      }).catch(() => null);

      if (!license) {
        return reply.forbidden("Licenza non valida.");
      }

      await fastify.prisma.deviceLicense.update({
        where: { id: license.id },
        data: {
          lastSyncAt: parsed.data.cursor ?? new Date(),
          lastSeenAt: new Date(),
        },
      });

      return {
        acknowledged: true,
        cursor: parsed.data.cursor ?? new Date(),
      };
    },
  );
};

export default syncRoutes;
