import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { GeneratedDocumentKind, MallevaReason, Prisma } from "@prisma/client";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { FastifyInstance } from "fastify";
import { config } from "../config.js";
import { buildInspectionReport, computeInspectionComplianceScore, starsFromScore } from "./report.service.js";

function toAbsoluteStoragePath(relativePath: string): string {
  return path.resolve(process.cwd(), config.storageDir, relativePath);
}

function createDocumentSeal(payload: Record<string, unknown>): { sealHash: string; sealedAt: string } {
  const sealedAt = new Date().toISOString();
  const raw = JSON.stringify(payload);
  const sealHash = createHash("sha256")
    .update(`${raw}|${sealedAt}|${config.documentSealSecret}`)
    .digest("hex");

  return { sealHash, sealedAt };
}

async function savePdf(lines: string[], filePrefix: string): Promise<{ fileName: string; relativePath: string }> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);

  page.drawText("FedShield", {
    x: 40,
    y: 800,
    size: 20,
    font,
    color: rgb(0.48, 0.08, 0.14),
  });

  let y = 770;
  for (const line of lines) {
    page.drawText(line.slice(0, 130), {
      x: 40,
      y,
      size: 11,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 16;
    if (y < 40) {
      break;
    }
  }

  const bytes = await doc.save();
  const now = new Date();
  const dateFolder = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const relativeDir = path.join("documents", dateFolder);
  const absoluteDir = toAbsoluteStoragePath(relativeDir);
  await mkdir(absoluteDir, { recursive: true });

  const fileName = `${filePrefix}_${now.getTime()}_${randomUUID().slice(0, 8)}.pdf`;
  const relativePath = path.join(relativeDir, fileName);
  const absolutePath = toAbsoluteStoragePath(relativePath);
  await writeFile(absolutePath, bytes);

  return { fileName, relativePath };
}

export async function generateInspectionReportPdf(
  fastify: FastifyInstance,
  inspectionId: string,
  userId?: string,
) {
  const inspection = await fastify.prisma.inspection.findUnique({
    where: { id: inspectionId },
    include: {
      company: true,
      author: { select: { fullName: true, role: true } },
      validator: { select: { fullName: true, role: true } },
      nonConformities: true,
      documents: true,
      answers: {
        include: {
          checklistItem: { select: { question: true, area: true } },
        },
      },
    },
  });

  if (!inspection) {
    throw new Error("Sopralluogo non trovato.");
  }

  const report = buildInspectionReport({
    id: inspection.id,
    title: inspection.title,
    happenedAt: inspection.happenedAt,
    status: inspection.status,
    company: {
      id: inspection.company.id,
      name: inspection.company.name,
      vatNumber: inspection.company.vatNumber,
      atecoCode: inspection.company.atecoCode,
    },
    author: {
      fullName: inspection.author.fullName,
      role: inspection.author.role,
    },
    validator: inspection.validator
      ? {
          fullName: inspection.validator.fullName,
          role: inspection.validator.role,
        }
      : null,
    nonConformities: inspection.nonConformities,
    documents: inspection.documents,
    answers: inspection.answers.map((answer) => ({
      value: answer.value,
      note: answer.note,
      checklistItem: {
        question: answer.checklistItem.question,
        area: answer.checklistItem.area,
      },
    })),
  });

  const lines = [
    `Verbale sopralluogo: ${inspection.title}`,
    `Azienda: ${inspection.company.name} (P.IVA ${inspection.company.vatNumber})`,
    `Data: ${inspection.happenedAt.toLocaleDateString("it-IT")}`,
    `Consulente: ${inspection.author.fullName}`,
    `Stato: ${inspection.status}`,
    `NC Totali: ${report.summary.totalNc}`,
    `NC Sanzionabili: ${report.summary.sanctionableNc}`,
    `Score compliance: ${report.summary.score}/100 - FED Stars: ${report.summary.stars}/5`,
    "",
    "Documenti visionati in sede:",
    ...(report.documents.viewedOnSite.length > 0 ? report.documents.viewedOnSite : ["- Nessun documento marcato come visionato"]),
    "",
    "Documenti richiesti in differita:",
    ...(report.documents.requestedLater.length > 0
      ? report.documents.requestedLater
      : ["- Nessun documento richiesto in differita"]),
    "",
    "Riepilogo non conformita:",
    ...report.findings,
  ];

  const { fileName, relativePath } = await savePdf(lines, "verbale");
  const seal = createDocumentSeal({
    type: "inspection_report",
    inspectionId: inspection.id,
    filePath: relativePath,
    totalNc: report.summary.totalNc,
    sanctionableNc: report.summary.sanctionableNc,
  });

  return fastify.prisma.generatedDocument.create({
    data: {
      kind: GeneratedDocumentKind.inspection_report,
      fileName,
      filePath: relativePath,
      inspectionId: inspection.id,
      createdById: userId,
      metadataJson: JSON.stringify({
        totalNc: report.summary.totalNc,
        sanctionableNc: report.summary.sanctionableNc,
        score: report.summary.score,
        stars: report.summary.stars,
        requestedDocuments: report.documents.requestedLater.length,
        ...seal,
      }),
    },
  });
}

export async function generateAttestatoPdf(
  fastify: FastifyInstance,
  inspectionId: string,
  userId?: string,
) {
  const inspection = await fastify.prisma.inspection.findUnique({
    where: { id: inspectionId },
    include: {
      company: true,
      nonConformities: true,
    },
  });

  if (!inspection) {
    throw new Error("Sopralluogo non trovato.");
  }

  const hasSanctionableNc = inspection.nonConformities.some((nc) => nc.isSanctionable && !nc.isResolved);
  if (hasSanctionableNc) {
    throw new Error("Attestato non rilasciabile: presenti NC sanzionabili.");
  }

  const score = computeInspectionComplianceScore(inspection.nonConformities);
  if (score < config.attestatoMinScore) {
    throw new Error(
      `Attestato non rilasciabile: punteggio ${score}/100 inferiore alla soglia minima ${config.attestatoMinScore}.`,
    );
  }

  const stars = starsFromScore(score);

  const lines = [
    "ATTESTATO ANTISANZIONE",
    `Azienda: ${inspection.company.name}`,
    `P.IVA: ${inspection.company.vatNumber}`,
    `Data valutazione: ${inspection.happenedAt.toLocaleDateString("it-IT")}`,
    `Rating compliance: ${score}/100`,
    `FED Stars: ${"★".repeat(stars)}${"☆".repeat(5 - stars)}`,
    "",
    "FacileSicurezza by FEDINVEST S.r.l. attesta il livello di compliance",
    "normativa secondo i controlli eseguiti nel sopralluogo antisanzione.",
  ];

  const { fileName, relativePath } = await savePdf(lines, "attestato");
  const seal = createDocumentSeal({
    type: "attestato",
    inspectionId: inspection.id,
    filePath: relativePath,
    score,
    stars,
  });

  return fastify.prisma.generatedDocument.create({
    data: {
      kind: GeneratedDocumentKind.attestato,
      fileName,
      filePath: relativePath,
      inspectionId: inspection.id,
      createdById: userId,
      metadataJson: JSON.stringify({ score, stars, ...seal }),
    },
  });
}

export async function generateMallevaPdf(
  fastify: FastifyInstance,
  params: {
    quoteId: string;
    reason: MallevaReason;
    note?: string;
    userId?: string;
  },
) {
  const quote = await fastify.prisma.quote.findUnique({
    where: { id: params.quoteId },
    include: {
      company: true,
      nonConformity: true,
      inspection: true,
      malleva: true,
    },
  });

  if (!quote) {
    throw new Error("Preventivo non trovato.");
  }

  if (quote.malleva) {
    return quote.malleva;
  }

  const lines = [
    "VERBALE DI MALLEVA RESPONSABILITA",
    `Azienda: ${quote.company.name}`,
    `Preventivo: ${quote.serviceName}`,
    `NC collegata: ${quote.nonConformity.title}`,
    `Motivo malleva: ${params.reason}`,
    `Data invio preventivo: ${quote.sentAt.toLocaleDateString("it-IT")}`,
    `Scadenza risposta: ${quote.responseDueAt.toLocaleDateString("it-IT")}`,
    params.note ? `Nota: ${params.note}` : "",
    "",
    "Da questo momento FEDINVEST risulta sollevata da responsabilita sulla NC",
    "in quanto la proposta di trattamento non e stata accettata nei tempi/modalita previsti.",
  ];

  const { fileName, relativePath } = await savePdf(lines, "malleva");
  const seal = createDocumentSeal({
    type: "malleva",
    quoteId: quote.id,
    filePath: relativePath,
    reason: params.reason,
  });

  const generatedDocument = await fastify.prisma.generatedDocument.create({
    data: {
      kind: GeneratedDocumentKind.malleva,
      fileName,
      filePath: relativePath,
      quoteId: quote.id,
      createdById: params.userId,
      metadataJson: JSON.stringify({ reason: params.reason, ...seal }),
    },
  });

  return fastify.prisma.malleva.create({
    data: {
      quoteId: quote.id,
      reason: params.reason,
      note: params.note,
      documentId: generatedDocument.id,
    },
  });
}

export async function listDocuments(
  fastify: FastifyInstance,
  filters?: {
    inspectionId?: string;
    quoteId?: string;
    kind?: GeneratedDocumentKind;
  },
) {
  return fastify.prisma.generatedDocument.findMany({
    where: {
      inspectionId: filters?.inspectionId,
      quoteId: filters?.quoteId,
      kind: filters?.kind,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateQuoteStatusWithMalleva(
  fastify: FastifyInstance,
  params: {
    quoteId: string;
    status: Prisma.EnumQuoteStatusFieldUpdateOperationsInput["set"];
    reason: MallevaReason;
    note?: string;
    userId?: string;
  },
) {
  const updatedQuote = await fastify.prisma.quote.update({
    where: { id: params.quoteId },
    data: {
      status: params.status,
      responseNote: params.note,
    },
  });

  const malleva = await generateMallevaPdf(fastify, {
    quoteId: updatedQuote.id,
    reason: params.reason,
    note: params.note,
    userId: params.userId,
  });

  return { updatedQuote, malleva };
}
