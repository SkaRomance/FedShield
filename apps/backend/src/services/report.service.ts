export interface InspectionReportPayload {
  id: string;
  title: string;
  happenedAt: Date;
  status: string;
  company: {
    id: string;
    name: string;
    vatNumber: string;
    atecoCode: string | null;
  };
  author: {
    fullName: string;
    role: string;
  };
  validator: {
    fullName: string;
    role: string;
  } | null;
  nonConformities: Array<{
    title: string;
    area?: string | null;
    description: string | null;
    isSanctionable: boolean;
    severity: number;
  }>;
  documents?: Array<{
    name: string;
    status: "viewed_on_site" | "requested_later" | "not_available" | "not_applicable";
    note: string | null;
  }>;
  answers: Array<{
    value: "yes" | "no" | "na";
    note: string | null;
    checklistItem: {
      question: string;
      area: string;
    };
  }>;
}

import { parseNcDescription } from "./restaurant-checklist-knowledge.js";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function starsFromScore(score: number): number {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  return 1;
}

export function computeInspectionComplianceScore(
  nonConformities: Array<{ isSanctionable: boolean; severity: number }>,
): number {
  const sanctionablePenalty = nonConformities
    .filter((nc) => nc.isSanctionable)
    .reduce((sum, nc) => sum + 8 + Math.max(0, nc.severity - 1) * 2, 0);

  const nonSanctionablePenalty = nonConformities
    .filter((nc) => !nc.isSanctionable)
    .reduce((sum, nc) => sum + 2 + Math.max(0, nc.severity - 1), 0);

  const score = 100 - sanctionablePenalty - nonSanctionablePenalty;
  return Math.max(0, Math.min(100, round2(score)));
}

export function buildInspectionReport(inspection: InspectionReportPayload) {
  const sanctionableCount = inspection.nonConformities.filter((nc) => nc.isSanctionable).length;
  const score = computeInspectionComplianceScore(inspection.nonConformities);
  const stars = starsFromScore(score);

  const viewedDocuments =
    inspection.documents?.filter((doc) => doc.status === "viewed_on_site").map((doc) => doc.name) ?? [];
  const requestedLaterDocuments =
    inspection.documents
      ?.filter((doc) => doc.status === "requested_later")
      .map((doc) => `${doc.name}${doc.note ? ` (${doc.note})` : ""}`) ?? [];

  const findings = inspection.nonConformities.map((nc, index) => {
    const parsed = parseNcDescription(nc.description);
    const intro = `NC ${index + 1}: ${nc.title}`;
    const detail = parsed.note ? ` - ${parsed.note}` : "";
    const sanctionTag = nc.isSanctionable ? " (potenzialmente sanzionabile)" : "";
    const normTag = parsed.normReference ? ` [Rif: ${parsed.normReference}]` : "";
    const serviceTag = parsed.suggestedService ? ` [Servizio: ${parsed.suggestedService}]` : "";
    return `${intro}${sanctionTag}${detail}${normTag}${serviceTag}`;
  });

  const todo = inspection.nonConformities.map((nc) => {
    const parsed = parseNcDescription(nc.description);
    return {
      area: nc.severity >= 3 ? "Priorita alta" : "Priorita ordinaria",
      action: parsed.suggestedService ?? nc.title,
      urgency: nc.severity,
      normReference: parsed.normReference,
      sanctionImpact: parsed.sanctionImpact,
    };
  });

  return {
    inspection: {
      id: inspection.id,
      title: inspection.title,
      date: inspection.happenedAt,
      status: inspection.status,
    },
    company: inspection.company,
    people: {
      author: inspection.author,
      validator: inspection.validator,
    },
    summary: {
      totalAnswers: inspection.answers.length,
      totalNc: inspection.nonConformities.length,
      sanctionableNc: sanctionableCount,
      score,
      stars,
    },
    documents: {
      viewedOnSite: viewedDocuments,
      requestedLater: requestedLaterDocuments,
    },
    findings,
    todo,
  };
}
