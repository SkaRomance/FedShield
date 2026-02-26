import type { FastifyInstance } from "fastify";

const SYNC_MAX_BATCH = 500;

export async function ingestSyncEvents(
  fastify: FastifyInstance,
  input: {
    deviceId: string;
    deviceLicenseId?: string;
    events: Array<{
      clientEventId: string;
      eventType: string;
      entityType: string;
      entityId?: string;
      payload: unknown;
      occurredAt: Date;
    }>;
  },
) {
  const events = input.events.slice(0, SYNC_MAX_BATCH);
  let accepted = 0;
  let duplicates = 0;

  for (const event of events) {
    try {
      await fastify.prisma.syncEvent.create({
        data: {
          deviceId: input.deviceId,
          deviceLicenseId: input.deviceLicenseId,
          clientEventId: event.clientEventId,
          eventType: event.eventType,
          entityType: event.entityType,
          entityId: event.entityId,
          payloadJson: JSON.stringify(event.payload),
          occurredAt: event.occurredAt,
          processedAt: new Date(),
        },
      });
      accepted += 1;
    } catch {
      duplicates += 1;
    }
  }

  return {
    accepted,
    duplicates,
    received: events.length,
  };
}

export async function buildSyncDelta(
  fastify: FastifyInstance,
  input?: {
    since?: Date;
  },
) {
  const since = input?.since ?? new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

  const [
    companies,
    inspections,
    quotes,
    checklistTemplates,
    checklistItems,
    generatedDocuments,
    odvInspections,
  ] = await Promise.all([
    fastify.prisma.company.findMany({ where: { updatedAt: { gt: since } }, orderBy: { updatedAt: "asc" }, take: 400 }),
    fastify.prisma.inspection.findMany({
      where: { updatedAt: { gt: since } },
      include: { nonConformities: true },
      orderBy: { updatedAt: "asc" },
      take: 400,
    }),
    fastify.prisma.quote.findMany({ where: { updatedAt: { gt: since } }, orderBy: { updatedAt: "asc" }, take: 400 }),
    fastify.prisma.checklistTemplate.findMany({
      where: { updatedAt: { gt: since } },
      orderBy: { updatedAt: "asc" },
      take: 200,
    }),
    fastify.prisma.checklistItem.findMany({ where: { updatedAt: { gt: since } }, orderBy: { updatedAt: "asc" }, take: 800 }),
    fastify.prisma.generatedDocument.findMany({
      where: { createdAt: { gt: since } },
      orderBy: { createdAt: "asc" },
      take: 400,
    }),
    fastify.prisma.odvInspection.findMany({ where: { updatedAt: { gt: since } }, orderBy: { updatedAt: "asc" }, take: 200 }),
  ]);

  return {
    serverTime: new Date(),
    since,
    nextCursor: new Date(),
    data: {
      companies,
      inspections,
      quotes,
      checklistTemplates,
      checklistItems,
      generatedDocuments,
      odvInspections,
    },
  };
}
