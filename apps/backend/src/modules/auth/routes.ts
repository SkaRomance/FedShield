import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { writeAudit } from "../../plugins/audit.js";
import {
  consumeDummyVerify,
  hashPassword,
  shouldRehash,
  verifyPassword,
} from "../../plugins/password.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/auth/login",
    {
      // Anti-brute-force: max 5 tentativi al minuto per IP.
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
    },
    async (request, reply) => {
    const parseResult = loginSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.badRequest("Payload login non valido.");
    }

    const { email, password } = parseResult.data;
    const user = await fastify.prisma.user.findUnique({ where: { email } });

    // Anti-timing user enumeration (M1): se l'email non è registrata
    // eseguiamo comunque un verify argon2 dummy per uniformare la latenza
    // di risposta tra "email inesistente" e "password sbagliata".
    if (!user) {
      await consumeDummyVerify(password);
      return reply.unauthorized("Credenziali non valide.");
    }
    if (!(await verifyPassword(password, user.passwordHash))) {
      return reply.unauthorized("Credenziali non valide.");
    }

    // Migrazione opportunistica bcrypt → argon2id sui login andati a buon fine.
    if (await shouldRehash(user.passwordHash)) {
      try {
        const newHash = await hashPassword(password);
        await fastify.prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: newHash },
        });
        fastify.log.info({ userId: user.id }, "Password rehashed bcrypt → argon2id");
      } catch (err) {
        fastify.log.error({ err, userId: user.id }, "Re-hash argon2 failed (login proceeds anyway)");
      }
    }

    const token = await reply.jwtSign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await writeAudit(fastify, {
      userId: user.id,
      action: "auth.login",
      entityType: "user",
      entityId: user.id,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
    },
  );
};

export default authRoutes;
