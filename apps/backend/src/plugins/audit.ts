import { FastifyInstance } from "fastify";

/**
 * Scrive un record AuditLog. Best-effort: se la persistence fallisce
 * (es. FK violata perché l'userId del JWT non esiste più nel DB,
 * o DB momentaneamente non raggiungibile) l'errore viene loggato a livello
 * Pino ma NON propagato. La business logic della route che ha invocato
 * writeAudit non deve mai vedere un 500 a causa di un fallimento
 * di audit infrastructure.
 */
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
  try {
    await fastify.prisma.auditLog.create({
      data: {
        userId: payload.userId,
        action: payload.action,
        entityType: payload.entityType,
        entityId: payload.entityId,
        payloadJson: payload.data ? JSON.stringify(payload.data) : undefined,
      },
    });
  } catch (err) {
    fastify.log.error({ err, audit: payload }, "writeAudit failed");
  }
}
