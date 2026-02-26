import { OdvMatchStatus } from "@prisma/client";
import type { FastifyInstance } from "fastify";

function normalizeText(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9àèéìòóù\s]/gi, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function overlapScore(source: string, target: string): number {
  const sourceTokens = new Set(normalizeText(source));
  const targetTokens = new Set(normalizeText(target));

  if (sourceTokens.size === 0 || targetTokens.size === 0) {
    return 0;
  }

  let overlap = 0;
  for (const token of sourceTokens) {
    if (targetTokens.has(token)) {
      overlap += 1;
    }
  }

  return overlap / Math.max(sourceTokens.size, targetTokens.size);
}

function classifyScore(score: number): OdvMatchStatus {
  if (score >= 0.55) return OdvMatchStatus.matched_to_reported_nc;
  if (score >= 0.3) return OdvMatchStatus.partially_matched;
  return OdvMatchStatus.unmatched_not_reported;
}

export async function findBestNcMatch(
  fastify: FastifyInstance,
  params: {
    companyId: string;
    inspectedAt: Date;
    violationTitle: string;
    violationNorm?: string | null;
  },
) {
  const ncList = await fastify.prisma.nonConformity.findMany({
    where: {
      inspection: {
        companyId: params.companyId,
        happenedAt: {
          lte: params.inspectedAt,
        },
      },
    },
    include: {
      inspection: {
        select: {
          id: true,
          title: true,
          happenedAt: true,
        },
      },
    },
  });

  const sanctionText = `${params.violationTitle} ${params.violationNorm ?? ""}`;
  let best:
    | {
        ncId: string;
        inspectionId: string;
        score: number;
      }
    | undefined;

  for (const nc of ncList) {
    const ncText = `${nc.title} ${nc.description ?? ""}`;
    const score = overlapScore(sanctionText, ncText);
    if (!best || score > best.score) {
      best = {
        ncId: nc.id,
        inspectionId: nc.inspection.id,
        score,
      };
    }
  }

  if (!best) {
    return {
      matchStatus: OdvMatchStatus.unmatched_not_reported,
      matchedNcId: null,
      matchedInspectionId: null,
      matchScore: 0,
    };
  }

  return {
    matchStatus: classifyScore(best.score),
    matchedNcId: best.ncId,
    matchedInspectionId: best.inspectionId,
    matchScore: best.score,
  };
}

export async function buildOdvDefensiveReport(fastify: FastifyInstance, companyId: string) {
  const inspections = await fastify.prisma.odvInspection.findMany({
    where: { companyId },
    include: {
      sanctions: true,
      company: {
        select: { id: true, name: true },
      },
    },
    orderBy: { inspectedAt: "desc" },
  });

  const sanctions = inspections.flatMap((inspection) => inspection.sanctions);
  const matched = sanctions.filter((item) => item.matchStatus === OdvMatchStatus.matched_to_reported_nc).length;
  const partial = sanctions.filter((item) => item.matchStatus === OdvMatchStatus.partially_matched).length;
  const unmatched = sanctions.filter((item) => item.matchStatus === OdvMatchStatus.unmatched_not_reported).length;

  return {
    companyId,
    companyName: inspections[0]?.company.name,
    inspections: inspections.length,
    sanctions: sanctions.length,
    matched,
    partial,
    unmatched,
    coverageRate: sanctions.length ? Math.round((matched / sanctions.length) * 10000) / 100 : 0,
    recentInspections: inspections.slice(0, 5).map((inspection) => ({
      id: inspection.id,
      inspectedAt: inspection.inspectedAt,
      authorityName: inspection.authorityName,
      sanctionsCount: inspection.sanctions.length,
    })),
  };
}
