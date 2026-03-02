import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { GeneratedDocumentKind, MallevaReason, Prisma } from "@prisma/client";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { FastifyInstance } from "fastify";
import { config } from "../config.js";
import { buildInspectionReport, computeInspectionComplianceScore, starsFromScore } from "./report.service.js";

const execFileAsync = promisify(execFile);
let cachedSofficeBinary: string | null = null;

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

function toPdfSafeLine(line: string): string {
  return line
    .replace(/[\u2018\u2019\u0060\u00B4]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u2022\u25CF]/g, "-")
    .replace(/[\u2605\u2606]/g, "*")
    .replace(/\u00A0/g, " ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
}

function wrapLine(line: string, maxChars = 100): string[] {
  const safe = toPdfSafeLine(line);
  if (safe.length <= maxChars) {
    return [safe];
  }

  const words = safe.split(" ");
  const rows: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }
    if (current) {
      rows.push(current);
    }
    current = word;
  }
  if (current) {
    rows.push(current);
  }

  return rows.length > 0 ? rows : [safe.slice(0, maxChars)];
}

function clampAttestatoStars(stars: number): number {
  return Math.max(0, Math.min(5, Math.round(stars)));
}

function buildStarSvgPath(centerX: number, centerY: number, outerRadius: number, innerRadius: number): string {
  const commands: string[] = [];
  for (let pointIndex = 0; pointIndex < 10; pointIndex += 1) {
    const angle = ((-90 + pointIndex * 36) * Math.PI) / 180;
    const radius = pointIndex % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    commands.push(`${pointIndex === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `${commands.join(" ")} Z`;
}

async function savePdf(lines: string[], filePrefix: string): Promise<{ fileName: string; relativePath: string }> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pageSize: [number, number] = [595, 842];
  const x = 40;
  const yStart = 770;
  const yMin = 40;
  const lineHeight = 16;
  let page = doc.addPage(pageSize);
  let y = yStart;

  const drawHeader = () => {
    page.drawText("FedShield", {
      x,
      y: 800,
      size: 20,
      font,
      color: rgb(0.48, 0.08, 0.14),
    });
  };

  drawHeader();

  for (const line of lines) {
    const wrapped = wrapLine(line, 102);
    for (const row of wrapped) {
      if (y < yMin) {
        page = doc.addPage(pageSize);
        y = yStart;
        drawHeader();
      }
      page.drawText(row, {
        x,
        y,
        size: 11,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= lineHeight;
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

async function savePdfBytes(bytes: Uint8Array, filePrefix: string): Promise<{ fileName: string; relativePath: string }> {
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

function formatAnswerValue(value: string): string {
  if (value === "yes") return "SI";
  if (value === "no") return "NO";
  return "N.A.";
}

function formatSectionLabel(section: string): string {
  if (section === "premises_equipment") {
    return "Locali / Attrezzature";
  }
  return "Procedure / Igiene";
}

function formatDomainLabel(domain: string): string {
  if (domain === "safety") return "Sicurezza";
  if (domain === "haccp") return "HACCP";
  return "Unificata";
}

function formatItalyDate(date: Date): string {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatItalyTime(date: Date): string {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

async function ensureInspectionClosedAt(
  fastify: FastifyInstance,
  inspectionId: string,
  finalizedAt: Date | null | undefined,
): Promise<Date> {
  if (finalizedAt) {
    return finalizedAt;
  }

  const now = new Date();
  await fastify.prisma.inspection.update({
    where: { id: inspectionId },
    data: { finalizedAt: now },
  });
  return now;
}

export function buildAttestatoVerificationToken(payload: {
  inspectionId: string;
  closedAtIso: string;
  score: number;
  stars: number;
}): string {
  return createHash("sha256")
    .update(
      `${payload.inspectionId}|${payload.closedAtIso}|${payload.score}|${payload.stars}|${config.documentSealSecret}`,
    )
    .digest("hex")
    .slice(0, 32);
}

function buildAttestatoVerificationUrl(inspectionId: string, verificationToken: string): string {
  const base = config.verificationBaseUrl.replace(/\/+$/, "");
  return `${base}/api/verify/attestato/${inspectionId}?token=${verificationToken}`;
}

async function readAttestatoDocxTemplate(): Promise<{ templatePath: string; templateHash: string }> {
  const configuredTemplatePath = path.isAbsolute(config.attestatoTemplateDocxPath)
    ? config.attestatoTemplateDocxPath
    : path.resolve(process.cwd(), config.attestatoTemplateDocxPath);
  const inputTemplatePath = path.resolve(
    process.cwd(),
    "input",
    "Format per Generazione Attestati",
    "Attestato_Antisanzione_TEMPLATE_PLACEHOLDERS.docx",
  );
  const backendRelativeInputTemplatePath = path.resolve(
    process.cwd(),
    "..",
    "..",
    "input",
    "Format per Generazione Attestati",
    "Attestato_Antisanzione_TEMPLATE_PLACEHOLDERS.docx",
  );
  const candidates = [inputTemplatePath, backendRelativeInputTemplatePath, configuredTemplatePath];
  let templatePath = configuredTemplatePath;
  for (const candidate of candidates) {
    try {
      await readFile(candidate);
      templatePath = candidate;
      break;
    } catch {
      // Try next candidate.
    }
  }
  const bytes = await readFile(templatePath);
  const templateHash = createHash("sha256").update(bytes).digest("hex");
  return { templatePath, templateHash };
}

async function resolveBackendScriptPath(scriptFileName: string): Promise<string> {
  const candidates = [
    path.resolve(process.cwd(), "scripts", scriptFileName),
    path.resolve(process.cwd(), "apps", "backend", "scripts", scriptFileName),
  ];
  for (const candidate of candidates) {
    try {
      await readFile(candidate);
      return candidate;
    } catch {
      // Try next candidate.
    }
  }
  throw new Error(`Script backend non trovato: ${scriptFileName}`);
}

async function resolveSofficeBinary(): Promise<string> {
  if (cachedSofficeBinary) {
    return cachedSofficeBinary;
  }

  const envCandidate = process.env.SOFFICE_PATH?.trim();
  const windowsCandidates = process.platform === "win32"
    ? [
        "C:\\Program Files\\LibreOffice\\program\\soffice.com",
        "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
      ]
    : [];
  const candidates = [envCandidate, ...windowsCandidates, "soffice", "soffice.com"].filter(
    (value): value is string => Boolean(value && value.length > 0),
  );

  for (const candidate of candidates) {
    try {
      await execFileAsync(candidate, ["--version"], {
        windowsHide: true,
        maxBuffer: 1024 * 1024,
      });
      cachedSofficeBinary = candidate;
      return candidate;
    } catch {
      // Try next candidate.
    }
  }

  throw new Error(
    "LibreOffice soffice non trovato. Imposta SOFFICE_PATH o installa LibreOffice.",
  );
}

async function fetchQrPng(verificationUrl: string): Promise<Uint8Array | null> {
  const endpoints = [
    `https://api.qrserver.com/v1/create-qr-code/?size=240x240&format=png&data=${encodeURIComponent(verificationUrl)}`,
    `https://quickchart.io/qr?size=240&text=${encodeURIComponent(verificationUrl)}`,
  ];

  for (const endpoint of endpoints) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        signal: controller.signal,
      });
      if (!response.ok) {
        continue;
      }
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("image")) {
        continue;
      }
      return new Uint8Array(await response.arrayBuffer());
    } catch {
      // Try next provider
    } finally {
      clearTimeout(timeout);
    }
  }
  return null;
}

async function generateAttestatoTemplatePdf(params: {
  templateDocxPath: string;
  companyName: string;
  vatNumber: string;
  inspectionDate: string;
  score: number;
  stars: number;
  verificationUrl: string;
}): Promise<{ fileName: string; relativePath: string }> {
  const workDir = await mkdtemp(path.join(tmpdir(), "fedshield-attestato-"));
  const filledDocxPath = path.join(workDir, "attestato_filled.docx");
  const scriptPath = await resolveBackendScriptPath("fill_attestato_template.py");
  const sofficeBinary = await resolveSofficeBinary();
  const qrImagePath = path.join(workDir, "attestato_qr.png");
  let hasQrImage = false;

  try {
    const qrPng = await fetchQrPng(params.verificationUrl);
    if (qrPng) {
      await writeFile(qrImagePath, qrPng);
      hasQrImage = true;
    }

    const pythonArgs = [
      scriptPath,
      "--template",
      params.templateDocxPath,
      "--output-docx",
      filledDocxPath,
      "--company-name",
      params.companyName,
      "--partita-iva",
      params.vatNumber,
      "--data-sopralluogo",
      params.inspectionDate,
      "--fed-score",
      String(params.score),
      "--fed-stars",
      String(clampAttestatoStars(params.stars)),
      "--work-dir",
      workDir,
    ];

    if (hasQrImage) {
      pythonArgs.push("--qr-image", qrImagePath);
    }

    await execFileAsync("python", pythonArgs, {
      windowsHide: true,
      maxBuffer: 10 * 1024 * 1024,
    });

    await execFileAsync(
      sofficeBinary,
      ["--headless", "--convert-to", "pdf", "--outdir", workDir, filledDocxPath],
      {
        windowsHide: true,
        maxBuffer: 10 * 1024 * 1024,
      },
    );

    const expectedPdfPath = path.join(workDir, "attestato_filled.pdf");
    let pdfPath = expectedPdfPath;
    try {
      await readFile(expectedPdfPath);
    } catch {
      const files = await readdir(workDir);
      const detectedPdf = files.find((fileName) => fileName.toLowerCase().endsWith(".pdf"));
      if (!detectedPdf) {
        throw new Error("Conversione template DOCX->PDF non riuscita.");
      }
      pdfPath = path.join(workDir, detectedPdf);
    }

    const pdfBytes = await readFile(pdfPath);
    return savePdfBytes(pdfBytes, "attestato");
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

async function generateAttestatoTemplateFallbackPdf(params: {
  companyName: string;
  vatNumber: string;
  inspectionDate: string;
  score: number;
  stars: number;
  verificationUrl: string;
}): Promise<{ fileName: string; relativePath: string }> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const colorNavy = rgb(0x1d / 255, 0x2f / 255, 0x54 / 255);
  const colorOrange = rgb(0xef / 255, 0x59 / 255, 0x00 / 255);

  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const logoPath = path.isAbsolute(config.attestatoLogoPath)
    ? config.attestatoLogoPath
    : path.resolve(process.cwd(), config.attestatoLogoPath);
  const logoPng = await readFile(logoPath);
  const logoImage = await doc.embedPng(logoPng);

  const drawCentered = (text: string, y: number, size: number, color: ReturnType<typeof rgb>, font = bold) => {
    const safeText = toPdfSafeLine(text);
    const textWidth = font.widthOfTextAtSize(safeText, size);
    const x = (width - textWidth) / 2;
    page.drawText(safeText, { x, y, size, color, font });
  };

  const drawFedStarsRow = (stars: number, centerY: number) => {
    const maxStars = 5;
    const clampedStars = clampAttestatoStars(stars);
    const outerRadius = 13;
    const innerRadius = 5.4;
    const gap = 8;
    const starWidth = outerRadius * 2;
    const totalWidth = maxStars * starWidth + (maxStars - 1) * gap;
    const startX = (width - totalWidth) / 2;

    for (let index = 0; index < maxStars; index += 1) {
      const centerX = startX + outerRadius + index * (starWidth + gap);
      const path = buildStarSvgPath(centerX, centerY, outerRadius, innerRadius);
      const filled = index < clampedStars;
      try {
        page.drawSvgPath(path, {
          color: filled ? colorOrange : rgb(0.94, 0.94, 0.94),
          borderColor: filled ? colorOrange : rgb(0.78, 0.78, 0.78),
          borderWidth: 1,
        });
      } catch {
        // Fallback grafico se drawSvgPath non e disponibile a runtime.
        page.drawRectangle({
          x: centerX - outerRadius + 1,
          y: centerY - outerRadius + 1,
          width: outerRadius * 2 - 2,
          height: outerRadius * 2 - 2,
          color: filled ? colorOrange : rgb(0.95, 0.95, 0.95),
          borderColor: colorOrange,
          borderWidth: 1,
        });
      }
    }
  };

  // Background and frame
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.98, 0.98, 0.98) });
  page.drawRectangle({ x: 8, y: 8, width: width - 16, height: height - 16, borderWidth: 1, borderColor: rgb(0.65, 0.65, 0.65) });

  // Logo
  const logoWidth = 350;
  const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
  page.drawImage(logoImage, {
    x: (width - logoWidth) / 2,
    y: 740,
    width: logoWidth,
    height: logoHeight,
  });
  page.drawLine({
    start: { x: 145, y: 705 },
    end: { x: width - 145, y: 705 },
    thickness: 2,
    color: colorOrange,
  });

  drawCentered("ATTESTATO ANTISANZIONE", 670, 34, colorNavy, bold);
  drawCentered(params.companyName, 618, 40, colorNavy, bold);
  drawCentered(`P. IVA ${params.vatNumber}`, 585, 16, colorNavy, regular);
  drawCentered(`a seguito del sopralluogo antisanzione svolto in data ${params.inspectionDate}`, 532, 14, colorNavy, regular);
  drawCentered("HA TOTALIZZATO", 472, 20, colorOrange, bold);
  drawCentered(`UN FED-SCORE DI ${params.score}/100`, 430, 42, colorNavy, bold);
  drawFedStarsRow(params.stars, 384);
  drawCentered("Verifica attestato tramite QR Code", 302, 12, colorNavy, regular);

  const qrPng = await fetchQrPng(params.verificationUrl);
  if (qrPng) {
    const qrImage = await doc.embedPng(qrPng);
    page.drawImage(qrImage, {
      x: (width / 2) - 52,
      y: 178,
      width: 104,
      height: 104,
    });
  } else {
    drawCentered("QR non disponibile", 218, 10, colorNavy, regular);
  }

  page.drawLine({
    start: { x: 28, y: 54 },
    end: { x: width - 28, y: 54 },
    thickness: 1,
    color: rgb(0.35, 0.35, 0.35),
  });
  drawCentered("FacileSicurezza by FEDINVEST S.r.l. - Viale Affaccio, 59 - 89900 Vibo Valentia", 40, 8, colorNavy, regular);

  const bytes = await doc.save();
  return savePdfBytes(bytes, "attestato");
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

  const closedAt = await ensureInspectionClosedAt(fastify, inspection.id, inspection.finalizedAt);
  const closedDate = formatItalyDate(closedAt);
  const closedTime = formatItalyTime(closedAt);

  const lines = [
    `Verbale sopralluogo: ${inspection.title}`,
    `Azienda: ${inspection.company.name} (P.IVA ${inspection.company.vatNumber})`,
    `Data sopralluogo: ${formatItalyDate(inspection.happenedAt)}`,
    `Data chiusura sopralluogo: ${closedDate} - Ora chiusura (Italia): ${closedTime}`,
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
        closedAt: closedAt.toISOString(),
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
  const closedAt = await ensureInspectionClosedAt(fastify, inspection.id, inspection.finalizedAt);
  const closedAtIso = closedAt.toISOString();
  const docxTemplate = await readAttestatoDocxTemplate();
  const verificationToken = buildAttestatoVerificationToken({
    inspectionId: inspection.id,
    closedAtIso,
    score,
    stars,
  });
  const verificationUrl = buildAttestatoVerificationUrl(inspection.id, verificationToken);

  let fileName: string;
  let relativePath: string;
  let renderMode: "template" | "fallback" = "template";
  let renderError: string | null = null;
  try {
    const generated = await generateAttestatoTemplatePdf({
      templateDocxPath: docxTemplate.templatePath,
      companyName: inspection.company.name,
      vatNumber: inspection.company.vatNumber,
      inspectionDate: formatItalyDate(inspection.happenedAt),
      score,
      stars,
      verificationUrl,
    });
    fileName = generated.fileName;
    relativePath = generated.relativePath;
  } catch (error) {
    renderMode = "fallback";
    renderError = error instanceof Error ? error.message : "unknown_template_error";
    try {
      const generatedFallback = await generateAttestatoTemplateFallbackPdf({
        companyName: inspection.company.name,
        vatNumber: inspection.company.vatNumber,
        inspectionDate: formatItalyDate(inspection.happenedAt),
        score,
        stars,
        verificationUrl,
      });
      fileName = generatedFallback.fileName;
      relativePath = generatedFallback.relativePath;
    } catch (fallbackError) {
      renderError = `${renderError}; styled_fallback_error=${
        fallbackError instanceof Error ? fallbackError.message : "unknown_styled_fallback_error"
      }`;
      const fallbackLines = [
        "ATTESTATO ANTISANZIONE",
        `Azienda: ${inspection.company.name}`,
        `P.IVA: ${inspection.company.vatNumber}`,
        `Data sopralluogo: ${formatItalyDate(inspection.happenedAt)}`,
        `Data chiusura sopralluogo: ${formatItalyDate(closedAt)} - Ora chiusura (Italia): ${formatItalyTime(closedAt)}`,
        `Rating compliance: ${score}/100`,
        `FED Stars: ${"*".repeat(stars)}${"-".repeat(5 - stars)} (${stars}/5)`,
        "",
        "FacileSicurezza by FEDINVEST S.r.l. attesta il livello di compliance",
        "normativa secondo i controlli eseguiti nel sopralluogo antisanzione.",
        "",
        `Verifica QR: ${verificationUrl}`,
      ];
      const generated = await savePdf(fallbackLines, "attestato");
      fileName = generated.fileName;
      relativePath = generated.relativePath;
    }
  }

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
      metadataJson: JSON.stringify({
        score,
        stars,
        inspectionDate: inspection.happenedAt.toISOString(),
        closedAt: closedAtIso,
        verificationToken,
        verificationUrl,
        templateDocxPath: docxTemplate.templatePath,
        templateDocxHash: docxTemplate.templateHash,
        templateLogoPath: config.attestatoLogoPath,
        renderMode,
        renderError,
        ...seal,
      }),
    },
  });
}

export async function generateInspectionChecklistPdf(
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
      answers: {
        include: {
          checklistItem: {
            select: {
              question: true,
              area: true,
              section: true,
              domain: true,
              orderIndex: true,
            },
          },
          nonConformity: {
            select: {
              severity: true,
              isSanctionable: true,
              description: true,
            },
          },
        },
        orderBy: [{ checklistItem: { section: "asc" } }, { checklistItem: { orderIndex: "asc" } }],
      },
    },
  });

  if (!inspection) {
    throw new Error("Sopralluogo non trovato.");
  }

  const closedAt = await ensureInspectionClosedAt(fastify, inspection.id, inspection.finalizedAt);

  const lines: string[] = [
    "CHECKLIST COMPILATA - DETTAGLIO RISPOSTE",
    `Sopralluogo: ${inspection.title}`,
    `Azienda: ${inspection.company.name} (P.IVA ${inspection.company.vatNumber})`,
    `Data sopralluogo: ${formatItalyDate(inspection.happenedAt)}`,
    `Data chiusura sopralluogo: ${formatItalyDate(closedAt)} - Ora chiusura (Italia): ${formatItalyTime(closedAt)}`,
    `Consulente: ${inspection.author.fullName}`,
    `Stato sopralluogo: ${inspection.status}`,
    `Modalita checklist: ${inspection.checklistMode}`,
    "",
  ];

  if (inspection.answers.length === 0) {
    lines.push("Nessuna risposta checklist disponibile per questo sopralluogo.");
  } else {
    let currentSection = "";
    inspection.answers.forEach((answer, index) => {
      const sectionLabel = formatSectionLabel(answer.checklistItem.section);
      const domainLabel = formatDomainLabel(answer.checklistItem.domain);
      if (sectionLabel !== currentSection) {
        currentSection = sectionLabel;
        lines.push(`=== ${sectionLabel.toUpperCase()} ===`);
      }

      const progressive = String(index + 1).padStart(3, "0");
      lines.push(
        `[${progressive}] [${domainLabel}] [Area: ${answer.checklistItem.area}] ${answer.checklistItem.question}`,
      );
      lines.push(`Risposta: ${formatAnswerValue(answer.value)}`);
      if (answer.note?.trim()) {
        lines.push(`Nota consulente: ${answer.note.trim()}`);
      }
      if (answer.value === "no") {
        const severity = answer.severity ?? answer.nonConformity?.severity ?? 1;
        const isSanctionable = answer.isSanctionable ?? answer.nonConformity?.isSanctionable ?? false;
        lines.push(`NC correlata: SI | Gravita: ${severity} | Sanzionabile: ${isSanctionable ? "SI" : "NO"}`);
        if (answer.nonConformity?.description?.trim()) {
          lines.push(`Dettaglio NC: ${answer.nonConformity.description.trim()}`);
        }
      }
      lines.push("");
    });
  }

  const totals = {
    answers: inspection.answers.length,
    noAnswers: inspection.answers.filter((answer) => answer.value === "no").length,
    sanctionableNoAnswers: inspection.answers.filter(
      (answer) => answer.value === "no" && (answer.isSanctionable ?? answer.nonConformity?.isSanctionable),
    ).length,
  };

  lines.push("RIEPILOGO FINALE");
  lines.push(`Risposte compilate: ${totals.answers}`);
  lines.push(`Risposte NO: ${totals.noAnswers}`);
  lines.push(`Risposte NO sanzionabili: ${totals.sanctionableNoAnswers}`);

  const { fileName, relativePath } = await savePdf(lines, "checklist");
  const seal = createDocumentSeal({
    type: "inspection_checklist_full",
    inspectionId: inspection.id,
    filePath: relativePath,
    answers: totals.answers,
    noAnswers: totals.noAnswers,
    sanctionableNoAnswers: totals.sanctionableNoAnswers,
  });

  return fastify.prisma.generatedDocument.create({
    data: {
      kind: GeneratedDocumentKind.inspection_report,
      fileName,
      filePath: relativePath,
      inspectionId: inspection.id,
      createdById: userId,
      metadataJson: JSON.stringify({
        documentType: "checklist_full",
        ...totals,
        closedAt: closedAt.toISOString(),
        ...seal,
      }),
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
