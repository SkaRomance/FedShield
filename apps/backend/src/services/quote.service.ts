import { MallevaReason, QuoteStatus } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { generateMallevaPdf } from "./document.service.js";

export function computeDueDate(days: number): Date {
  const safeDays = Math.max(1, Math.min(days, 90));
  const due = new Date();
  due.setDate(due.getDate() + safeDays);
  return due;
}

const awaitingResponseStatuses: QuoteStatus[] = [QuoteStatus.pending, QuoteStatus.remodeling_requested];

export async function processExpiredQuotes(fastify: FastifyInstance) {
  const now = new Date();

  const expiringQuotes = await fastify.prisma.quote.findMany({
    where: {
      status: { in: awaitingResponseStatuses },
      responseDueAt: { lt: now },
    },
    select: {
      id: true,
    },
  });

  for (const quote of expiringQuotes) {
    await fastify.prisma.quote.update({
      where: { id: quote.id },
      data: { status: QuoteStatus.expired },
    });

    await generateMallevaPdf(fastify, {
      quoteId: quote.id,
      reason: MallevaReason.expired,
      note: "Scadenza countdown senza risposta cliente.",
    });
  }

  return {
    processed: expiringQuotes.length,
  };
}
