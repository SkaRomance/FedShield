import { MallevaReason, QuoteStatus, UserRole } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { writeAudit } from "../../plugins/audit.js";
import { generateMallevaPdf, updateQuoteStatusWithMalleva } from "../../services/document.service.js";
import { computeDueDate, processExpiredQuotes } from "../../services/quote.service.js";
import { parseNcDescription } from "../../services/restaurant-checklist-knowledge.js";

const createQuoteSchema = z.object({
  nonConformityId: z.string().min(1),
  serviceName: z.string().min(3),
  description: z.string().optional(),
  amount: z.number().nonnegative().optional(),
  dueDays: z.number().int().min(1).max(90).default(14),
});

const respondQuoteSchema = z.object({
  action: z.enum(["accepted", "remodeling_requested", "rejected", "assigned_to_third_party"]),
  note: z.string().optional(),
  dueDays: z.number().int().min(1).max(90).optional(),
});

const quotesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/quotes",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const query = z
        .object({
          companyId: z.string().optional(),
          status: z.nativeEnum(QuoteStatus).optional(),
        })
        .safeParse(request.query);

      if (!query.success) {
        return reply.badRequest("Query preventivi non valida.");
      }

      const quotes = await fastify.prisma.quote.findMany({
        where: {
          companyId: query.data.companyId,
          status: query.data.status,
        },
        include: {
          company: {
            select: { id: true, name: true },
          },
          nonConformity: {
            select: {
              id: true,
              title: true,
              description: true,
              isSanctionable: true,
              severity: true,
            },
          },
          malleva: true,
          documents: true,
        },
        orderBy: [{ updatedAt: "desc" }],
      });

      return quotes.map((quote) => {
        const parsed = parseNcDescription(quote.nonConformity.description);
        return {
          ...quote,
          nonConformity: {
            ...quote.nonConformity,
            ...parsed,
          },
        };
      });
    },
  );

  fastify.get(
    "/quotes/candidates",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const query = z.object({ companyId: z.string().optional() }).safeParse(request.query);
      if (!query.success) {
        return reply.badRequest("Query candidati non valida.");
      }

      const candidates = await fastify.prisma.nonConformity.findMany({
        where: {
          isSanctionable: true,
          isResolved: false,
          inspection: {
            companyId: query.data.companyId,
          },
          quotes: {
            none: {
              status: {
                in: [QuoteStatus.pending, QuoteStatus.remodeling_requested],
              },
            },
          },
        },
        include: {
          inspection: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return candidates.map((candidate) => {
        const parsed = parseNcDescription(candidate.description);
        return {
          ...candidate,
          ...parsed,
          suggestedService: parsed.suggestedService ?? "Servizio di adeguamento",
        };
      });
    },
  );

  fastify.post(
    "/quotes",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = createQuoteSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload preventivo non valido.");
      }

      const auth = request.user;
      const nc = await fastify.prisma.nonConformity.findUnique({
        where: { id: parsed.data.nonConformityId },
        include: {
          inspection: {
            include: {
              company: true,
            },
          },
        },
      });

      if (!nc) {
        return reply.notFound("Non conformita non trovata.");
      }

      const existingOpenQuote = await fastify.prisma.quote.findFirst({
        where: {
          nonConformityId: nc.id,
          status: {
            in: [QuoteStatus.pending, QuoteStatus.remodeling_requested],
          },
        },
      });

      if (existingOpenQuote) {
        return reply.conflict("Esiste gia un preventivo aperto per questa NC.");
      }

      const created = await fastify.prisma.quote.create({
        data: {
          nonConformityId: nc.id,
          inspectionId: nc.inspectionId,
          companyId: nc.inspection.companyId,
          serviceName: parsed.data.serviceName,
          description: parsed.data.description,
          amount: parsed.data.amount,
          responseDueAt: computeDueDate(parsed.data.dueDays),
          createdById: auth.sub,
        },
      });

      await writeAudit(fastify, {
        userId: auth.sub,
        action: "quote.create",
        entityType: "quote",
        entityId: created.id,
        data: parsed.data,
      });

      return reply.code(201).send(created);
    },
  );

  fastify.patch(
    "/quotes/:id/respond",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      const parsed = respondQuoteSchema.safeParse(request.body);

      if (!params.success || !parsed.success) {
        return reply.badRequest("Payload risposta preventivo non valido.");
      }

      const auth = request.user;
      const quote = await fastify.prisma.quote.findUnique({ where: { id: params.data.id } });

      if (!quote) {
        return reply.notFound("Preventivo non trovato.");
      }

      const closedStatuses = new Set<QuoteStatus>([
        QuoteStatus.accepted,
        QuoteStatus.rejected,
        QuoteStatus.expired,
        QuoteStatus.assigned_to_third_party,
      ]);

      if (closedStatuses.has(quote.status)) {
        return reply.conflict("Preventivo gia chiuso e non modificabile.");
      }

      let result: unknown;
      switch (parsed.data.action) {
        case "accepted": {
          result = await fastify.prisma.quote.update({
            where: { id: quote.id },
            data: {
              status: QuoteStatus.accepted,
              responseNote: parsed.data.note,
            },
          });
          break;
        }
        case "remodeling_requested": {
          const dueAt = parsed.data.dueDays ? computeDueDate(parsed.data.dueDays) : computeDueDate(7);
          result = await fastify.prisma.quote.update({
            where: { id: quote.id },
            data: {
              status: QuoteStatus.remodeling_requested,
              responseDueAt: dueAt,
              responseNote: parsed.data.note,
            },
          });
          break;
        }
        case "rejected": {
          result = await updateQuoteStatusWithMalleva(fastify, {
            quoteId: quote.id,
            status: QuoteStatus.rejected,
            reason: MallevaReason.rejected,
            note: parsed.data.note,
            userId: auth.sub,
          });
          break;
        }
        case "assigned_to_third_party": {
          result = await updateQuoteStatusWithMalleva(fastify, {
            quoteId: quote.id,
            status: QuoteStatus.assigned_to_third_party,
            reason: MallevaReason.assigned_to_third_party,
            note: parsed.data.note,
            userId: auth.sub,
          });
          break;
        }
      }

      await writeAudit(fastify, {
        userId: auth.sub,
        action: `quote.respond.${parsed.data.action}`,
        entityType: "quote",
        entityId: quote.id,
        data: parsed.data,
      });

      return result;
    },
  );

  fastify.post(
    "/quotes/:id/malleva",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      const body = z
        .object({
          reason: z.nativeEnum(MallevaReason),
          note: z.string().optional(),
        })
        .safeParse(request.body);

      if (!params.success || !body.success) {
        return reply.badRequest("Payload malleva non valido.");
      }

      const auth = request.user;
      const malleva = await generateMallevaPdf(fastify, {
        quoteId: params.data.id,
        reason: body.data.reason,
        note: body.data.note,
        userId: auth.sub,
      });

      return malleva;
    },
  );

  fastify.post(
    "/quotes/process-expired",
    { preHandler: [fastify.authenticate] },
    async () => {
      return processExpiredQuotes(fastify);
    },
  );
};

export default quotesRoutes;
