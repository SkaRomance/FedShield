import { QuoteStatus, UserRole } from "@prisma/client";
import type { FastifyInstance } from "fastify";

interface RadarArea {
  area: string;
  score: number;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function starsFromScore(score: number): number {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  return 1;
}

export async function computeCompanyKpi(fastify: FastifyInstance, companyId: string) {
  const inspections = await fastify.prisma.inspection.findMany({
    where: { companyId },
    include: {
      nonConformities: true,
      answers: {
        include: {
          checklistItem: {
            select: { area: true },
          },
        },
      },
    },
    orderBy: { happenedAt: "asc" },
  });

  const quotes = await fastify.prisma.quote.findMany({
    where: { companyId },
    select: {
      status: true,
    },
  });

  const totalInspections = inspections.length;
  const allNc = inspections.flatMap((inspection) => inspection.nonConformities);
  const totalNc = allNc.length;
  const sanctionableNc = allNc.filter((nc) => nc.isSanctionable).length;
  const resolvedNc = allNc.filter((nc) => nc.isResolved).length;

  const acceptedQuotes = quotes.filter((quote) => quote.status === QuoteStatus.accepted).length;
  const rejectionStatuses = new Set<QuoteStatus>([
    QuoteStatus.rejected,
    QuoteStatus.expired,
    QuoteStatus.assigned_to_third_party,
  ]);
  const rejectedQuotes = quotes.filter((quote) => rejectionStatuses.has(quote.status)).length;

  const collaborationScore = quotes.length
    ? Math.max(0, Math.min(20, (acceptedQuotes / quotes.length) * 20 - (rejectedQuotes / quotes.length) * 8))
    : 0;

  const base = 100;
  const penaltySanctionable = sanctionableNc * 8;
  const penaltyNonSanctionable = (totalNc - sanctionableNc) * 2;
  const rawScore = base - penaltySanctionable - penaltyNonSanctionable + collaborationScore;
  const complianceScore = Math.max(0, Math.min(100, round2(rawScore)));

  const areaStats = new Map<string, { total: number; noCount: number }>();
  for (const inspection of inspections) {
    for (const answer of inspection.answers) {
      const key = answer.checklistItem.area;
      const current = areaStats.get(key) ?? { total: 0, noCount: 0 };
      current.total += 1;
      if (answer.value === "no") {
        current.noCount += 1;
      }
      areaStats.set(key, current);
    }
  }

  const radar: RadarArea[] = [...areaStats.entries()].map(([area, stat]) => {
    const areaScore = stat.total === 0 ? 100 : Math.max(0, round2(100 - (stat.noCount / stat.total) * 100));
    return { area, score: areaScore };
  });

  const trendByMonth = new Map<string, { inspections: number; nc: number; sanctionableNc: number }>();
  inspections.forEach((inspection) => {
    const key = inspection.happenedAt.toISOString().slice(0, 7);
    const current = trendByMonth.get(key) ?? { inspections: 0, nc: 0, sanctionableNc: 0 };
    current.inspections += 1;
    current.nc += inspection.nonConformities.length;
    current.sanctionableNc += inspection.nonConformities.filter((nc) => nc.isSanctionable).length;
    trendByMonth.set(key, current);
  });

  return {
    companyId,
    complianceScore,
    stars: starsFromScore(complianceScore),
    totals: {
      inspections: totalInspections,
      nc: totalNc,
      sanctionableNc,
      resolvedNc,
    },
    collaborationScore: round2(collaborationScore),
    radar,
    trend: [...trendByMonth.entries()].map(([month, values]) => ({ month, ...values })),
  };
}

export async function computeConsultantsKpi(
  fastify: FastifyInstance,
  options?: {
    monthsWindow?: number;
    minInspectionsForAlert?: number;
    expectedNcPerInspection?: number;
  },
) {
  const monthsWindow = options?.monthsWindow ?? 7;
  const minInspectionsForAlert = options?.minInspectionsForAlert ?? 10;
  const expectedNcPerInspection = options?.expectedNcPerInspection ?? 0.4;

  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - monthsWindow);

  const consultants = await fastify.prisma.user.findMany({
    where: { role: { in: [UserRole.junior, UserRole.senior] } },
    select: {
      id: true,
      fullName: true,
      role: true,
      inspections: {
        where: {
          happenedAt: { gte: fromDate },
        },
        include: {
          nonConformities: true,
          quotes: true,
        },
      },
    },
  });

  return consultants.map((consultant) => {
    const inspectionsCount = consultant.inspections.length;
    const ncTotal = consultant.inspections.reduce((sum, inspection) => sum + inspection.nonConformities.length, 0);
    const sanctionableNc = consultant.inspections.reduce(
      (sum, inspection) => sum + inspection.nonConformities.filter((nc) => nc.isSanctionable).length,
      0,
    );

    const quoteCollection = consultant.inspections.flatMap((inspection) => inspection.quotes);
    const accepted = quoteCollection.filter((quote) => quote.status === QuoteStatus.accepted).length;
    const conversionRate = quoteCollection.length ? round2((accepted / quoteCollection.length) * 100) : 0;

    const averageProcessingDays = quoteCollection.length
      ? round2(
          quoteCollection.reduce((sum, quote) => {
            const ms = quote.updatedAt.getTime() - quote.sentAt.getTime();
            return sum + ms / 1000 / 60 / 60 / 24;
          }, 0) / quoteCollection.length,
        )
      : 0;

    const observedNcPerInspection = inspectionsCount ? ncTotal / inspectionsCount : 0;
    const lowNcAlert =
      inspectionsCount >= minInspectionsForAlert && observedNcPerInspection < expectedNcPerInspection;

    return {
      consultantId: consultant.id,
      fullName: consultant.fullName,
      role: consultant.role,
      monthsWindow,
      inspectionsCount,
      ncTotal,
      sanctionableNc,
      conversionRate,
      averageProcessingDays,
      lowNcAlert,
      lowNcAlertReason: lowNcAlert
        ? `Media NC per sopralluogo (${round2(observedNcPerInspection)}) inferiore alla soglia attesa (${expectedNcPerInspection}).`
        : null,
    };
  });
}

export async function buildKpiOverview(fastify: FastifyInstance) {
  const companies = await fastify.prisma.company.findMany({ select: { id: true, name: true } });
  const companyScores = await Promise.all(
    companies.map(async (company) => {
      const kpi = await computeCompanyKpi(fastify, company.id);
      return {
        companyId: company.id,
        companyName: company.name,
        complianceScore: kpi.complianceScore,
      };
    }),
  );

  const consultants = await computeConsultantsKpi(fastify);
  const avgScore =
    companyScores.length > 0
      ? round2(companyScores.reduce((sum, item) => sum + item.complianceScore, 0) / companyScores.length)
      : 0;

  return {
    generatedAt: new Date().toISOString(),
    companiesCount: companyScores.length,
    consultantsCount: consultants.length,
    averageComplianceScore: avgScore,
    companies: companyScores,
    consultants,
  };
}

export async function persistKpiSnapshots(fastify: FastifyInstance) {
  const companies = await fastify.prisma.company.findMany({ select: { id: true } });

  for (const company of companies) {
    const kpi = await computeCompanyKpi(fastify, company.id);
    await fastify.prisma.companyKpiSnapshot.create({
      data: {
        companyId: company.id,
        complianceScore: kpi.complianceScore,
        totalInspections: kpi.totals.inspections,
        totalNc: kpi.totals.nc,
        sanctionableNc: kpi.totals.sanctionableNc,
        resolvedNc: kpi.totals.resolvedNc,
        collaborationScore: kpi.collaborationScore,
        trendJson: JSON.stringify({ radar: kpi.radar, trend: kpi.trend }),
      },
    });
  }

  const consultants = await computeConsultantsKpi(fastify);
  for (const consultant of consultants) {
    await fastify.prisma.consultantKpiSnapshot.create({
      data: {
        consultantId: consultant.consultantId,
        inspectionsCount: consultant.inspectionsCount,
        ncTotal: consultant.ncTotal,
        sanctionableNc: consultant.sanctionableNc,
        conversionRate: consultant.conversionRate,
        averageProcessingDays: consultant.averageProcessingDays,
        lowNcAlert: consultant.lowNcAlert,
        lowNcAlertReason: consultant.lowNcAlertReason,
      },
    });
  }

  return {
    companySnapshots: companies.length,
    consultantSnapshots: consultants.length,
  };
}
