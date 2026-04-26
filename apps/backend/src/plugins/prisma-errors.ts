import type { FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";

/**
 * Restituisce true se l'errore è una violazione di unique constraint
 * di Prisma (P2002). In tal caso invia un 409 Conflict al client e
 * il chiamante deve interrompere l'esecuzione del route handler.
 *
 * Esempio d'uso:
 *
 *   try {
 *     const created = await fastify.prisma.employee.create({ data });
 *     return reply.code(201).send(created);
 *   } catch (err) {
 *     if (replyOnUniqueViolation(reply, err, "Codice fiscale già usato per questa azienda.")) {
 *       return;
 *     }
 *     throw err;
 *   }
 */
export function replyOnUniqueViolation(
  reply: FastifyReply,
  err: unknown,
  message: string,
): boolean {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    reply.conflict(message);
    return true;
  }
  return false;
}
