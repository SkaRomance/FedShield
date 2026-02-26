import "fastify";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<unknown>;
  }

  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
      role: "junior" | "senior" | "admin";
    };

    user: {
      sub: string;
      email: string;
      role: "junior" | "senior" | "admin";
    };
  }
}
