import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { config } from "../config.js";

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
