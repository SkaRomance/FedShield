import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyRequest, FastifyReply } from "fastify";
import { config } from "../config.js";

export type UserRole = "junior" | "senior" | "admin";

export interface AuthenticatedUser {
  sub?: string;
  role?: UserRole;
}

export default fp(async (fastify) => {
  await fastify.register(fastifyJwt, {
    secret: config.jwtSecret,
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.unauthorized("Token non valido o assente.");
    }
  });
});

/**
 * Factory che produce un preHandler Fastify: blocca l'utente se il suo ruolo
 * non è incluso nella lista. Da usare DOPO `fastify.authenticate` nella catena
 * preHandler. Esempio:
 *
 *   { preHandler: [fastify.authenticate, requireRole(["admin", "senior"])] }
 */
export function requireRole(allowedRoles: UserRole[]) {
  return async function rolePreHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as AuthenticatedUser | undefined;
    if (!user?.role || !allowedRoles.includes(user.role)) {
      return reply.forbidden(
        `Operazione riservata ai ruoli: ${allowedRoles.join(", ")}.`,
      );
    }
  };
}

/** Alias rapido per le route admin-only. */
export const requireAdmin = requireRole(["admin"]);

/** Mutazioni di anagrafiche/master-data: junior può leggere ma non scrivere. */
export const requireSeniorOrAdmin = requireRole(["senior", "admin"]);
