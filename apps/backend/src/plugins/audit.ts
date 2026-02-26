import { FastifyInstance } from "fastify";

export async function writeAudit(
  fastify: FastifyInstance,
  payload: {
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    data?: unknown;
  },
): Promise<void> {
  await fastify.prisma.auditLog.create({
    data: {
      userId: payload.userId,
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      payloadJson: payload.data ? JSON.stringify(payload.data) : undefined,
    },
  });
}
