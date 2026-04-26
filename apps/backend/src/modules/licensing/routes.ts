import { UserRole } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { writeAudit } from "../../plugins/audit.js";
import {
  activateDeviceLicense,
  heartbeatDeviceLicense,
  revokeDeviceLicense,
  validateDeviceLicense,
} from "../../services/licensing.service.js";

const activationSchema = z.object({
  deviceId: z.string().min(8),
  deviceName: z.string().min(2),
  platform: z.string().min(2),
  appVersion: z.string().optional(),
  activationCode: z.string().min(4),
});

const validateSchema = z.object({
  deviceId: z.string().min(8),
  heartbeatToken: z.string().min(8),
});

const heartbeatSchema = validateSchema.extend({
  appVersion: z.string().optional(),
});

const revokeSchema = z.object({
  deviceId: z.string().min(8),
  reason: z.string().optional(),
});

const licensingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/licensing/activate", async (request, reply) => {
    const parsed = activationSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.badRequest("Payload attivazione licenza non valido.");
    }

    try {
      const activated = await activateDeviceLicense(fastify, parsed.data);
      return activated;
    } catch (error) {
      return reply.forbidden(error instanceof Error ? error.message : "Attivazione non riuscita.");
    }
  });

  fastify.post("/licensing/validate", async (request, reply) => {
    const parsed = validateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.badRequest("Payload validazione licenza non valido.");
    }

    return validateDeviceLicense(fastify, parsed.data);
  });

  fastify.post("/licensing/heartbeat", async (request, reply) => {
    const parsed = heartbeatSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.badRequest("Payload heartbeat licenza non valido.");
    }

    return heartbeatDeviceLicense(fastify, parsed.data);
  });

  fastify.post(
    "/licensing/revoke",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = revokeSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload revoca licenza non valido.");
      }

      const auth = request.user;
      if (auth.role !== UserRole.admin) {
        return reply.forbidden("Solo admin puo revocare licenze device.");
      }

      try {
        const revoked = await revokeDeviceLicense(fastify, parsed.data);
        await writeAudit(fastify, {
          userId: auth.sub,
          action: "license.revoke",
          entityType: "deviceLicense",
          entityId: revoked.id,
          data: parsed.data,
        });
        return revoked;
      } catch (error) {
        return reply.badRequest(error instanceof Error ? error.message : "Revoca non riuscita.");
      }
    },
  );

  fastify.get(
    "/licensing/devices",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const auth = request.user;
      if (auth.role !== UserRole.admin) {
        return reply.forbidden("Solo admin puo consultare le licenze device.");
      }

      return fastify.prisma.deviceLicense.findMany({
        orderBy: { updatedAt: "desc" },
      });
    },
  );
};

export default licensingRoutes;
