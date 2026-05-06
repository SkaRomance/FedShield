import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeAudit } from "../../plugins/audit.js";
import { requireSeniorOrAdmin } from "../../plugins/auth.js";

const createCompanySchema = z.object({
  name: z.string().min(2),
  vatNumber: z.string().min(8),
  legalForm: z.string().optional(),
  reaNumber: z.string().optional(),
  employeesInfo: z.string().optional(),
  email: z.string().optional(),
  pec: z.string().optional(),
  phone: z.string().optional(),
  atecoCode: z.string().optional(),
  riskLevel: z.string().optional(),
  description: z.string().optional(),
  legalAddress: z.string().optional(),
  localUnitAddress: z.string().optional(),
  preventionSystemSubjects: z.string().optional(),
  employerRsppPreposto: z.string().optional(),
  occupationalDoctor: z.string().optional(),
  rls: z.string().optional(),
  emergencyTeam: z.string().optional(),
  firstAidTeam: z.string().optional(),
  haccpResponsabileAutocontrollo: z.string().optional(),
  haccpConsulenteEsterno: z.string().optional(),
  haccpAdditionalResponsabili: z.string().optional(),
  city: z.string().optional(),
});
const updateCompanySchema = createCompanySchema.partial();
const companyParamsSchema = z.object({
  id: z.string().min(1),
});

// DTO output: solo i campi pubblici. Eventuali nuovi campi dello schema Prisma
// non vengono restituiti finché non sono aggiunti esplicitamente qui (deny-by-default).
const companyOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  vatNumber: z.string(),
  legalForm: z.string().nullable(),
  reaNumber: z.string().nullable(),
  employeesInfo: z.string().nullable(),
  email: z.string().nullable(),
  pec: z.string().nullable(),
  phone: z.string().nullable(),
  atecoCode: z.string().nullable(),
  riskLevel: z.string().nullable(),
  description: z.string().nullable(),
  legalAddress: z.string().nullable(),
  localUnitAddress: z.string().nullable(),
  city: z.string().nullable(),
  preventionSystemSubjects: z.string().nullable(),
  employerRsppPreposto: z.string().nullable(),
  occupationalDoctor: z.string().nullable(),
  rls: z.string().nullable(),
  emergencyTeam: z.string().nullable(),
  firstAidTeam: z.string().nullable(),
  haccpResponsabileAutocontrollo: z.string().nullable(),
  haccpConsulenteEsterno: z.string().nullable(),
  haccpAdditionalResponsabili: z.string().nullable(),
  contractStart: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

function toCompanyDto(record: unknown) {
  return companyOutputSchema.parse(record);
}

// M3 (review): policy PII per ruolo. I nominativi HACCP e il medico
// competente sono dati personali di persone fisiche (referenti aziendali).
// Il consulente junior può vedere l'azienda ma NON questi nominativi —
// la rifinitura HACCP/sanità è competenza senior+admin.
type CompanyDto = z.infer<typeof companyOutputSchema>;
const HACCP_PII_FIELDS: ReadonlyArray<keyof CompanyDto> = [
  "occupationalDoctor",
  "haccpResponsabileAutocontrollo",
  "haccpConsulenteEsterno",
  "haccpAdditionalResponsabili",
];

function redactForJunior(dto: CompanyDto): CompanyDto {
  const result = { ...dto };
  for (const field of HACCP_PII_FIELDS) {
    (result as Record<keyof CompanyDto, unknown>)[field] = null;
  }
  return result;
}

function toCompanyDtoFor(record: unknown, role: string | undefined): CompanyDto {
  const dto = toCompanyDto(record);
  return role === "junior" ? redactForJunior(dto) : dto;
}

// ---- S18-A helpers: Danea CSV + NDA PDF ---------------------------------

function todayCompactDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function todayItalyDate(): string {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

// Escape CSV cell for Danea (semicolon-separated). Wrap in double quotes if
// the cell contains the separator, a double quote, CR or LF; double-up
// inner quotes per RFC4180.
function escapeCsvCell(value: string | null | undefined): string {
  const raw = value ?? "";
  if (raw === "") return "";
  const needsQuoting = /[;"\r\n]/.test(raw);
  if (!needsQuoting) return raw;
  return `"${raw.replace(/"/g, '""')}"`;
}

interface DaneaRow {
  Codice: string;
  NomeContoCliente: string;
  PartitaIVA: string;
  CodiceFiscale: string;
  Indirizzo: string;
  Cap: string;
  Citta: string;
  Provincia: string;
  Nazione: string;
  Telefono: string;
  Email: string;
  PEC: string;
  Note: string;
}

const DANEA_HEADER = [
  "Codice",
  "NomeContoCliente",
  "PartitaIVA",
  "CodiceFiscale",
  "Indirizzo",
  "Cap",
  "Citta",
  "Provincia",
  "Nazione",
  "Telefono",
  "Email",
  "PEC",
  "Note",
] as const;

function buildDaneaRow(company: {
  id: string;
  name: string;
  vatNumber: string;
  reaNumber: string | null;
  legalAddress: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  pec: string | null;
}): DaneaRow {
  const codice = (company.id || company.vatNumber || "").slice(0, 8);
  return {
    Codice: codice,
    NomeContoCliente: company.name ?? "",
    PartitaIVA: company.vatNumber ?? "",
    CodiceFiscale: company.reaNumber ?? "",
    Indirizzo: company.legalAddress ?? "",
    Cap: "",
    Citta: company.city ?? "",
    Provincia: "",
    Nazione: "IT",
    Telefono: company.phone ?? "",
    Email: company.email ?? "",
    PEC: company.pec ?? "",
    Note: "",
  };
}

function buildDaneaCsv(rows: DaneaRow[]): string {
  const lines: string[] = [];
  lines.push(DANEA_HEADER.join(";"));
  for (const row of rows) {
    const cells = DANEA_HEADER.map((col) => escapeCsvCell(row[col]));
    lines.push(cells.join(";"));
  }
  // CRLF for max compatibility with Italian Windows tools (Excel/Danea).
  return lines.join("\r\n") + "\r\n";
}

function slugifyForFilename(value: string): string {
  const base = (value || "azienda")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base.length > 0 ? base.slice(0, 60) : "azienda";
}

// pdf-lib usa StandardFonts WinAnsi: niente caratteri unicode esotici.
function toPdfSafeText(line: string): string {
  return line
    .replace(/[‘’`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[•●]/g, "-")
    .replace(/ /g, " ")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
}

function wrapPdfLine(line: string, maxChars = 95): string[] {
  const safe = toPdfSafeText(line);
  if (safe.length <= maxChars) return [safe];
  const words = safe.split(" ");
  const rows: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }
    if (current) rows.push(current);
    current = word;
  }
  if (current) rows.push(current);
  return rows.length > 0 ? rows : [safe.slice(0, maxChars)];
}

async function buildNdaPdfBuffer(company: {
  name: string;
  vatNumber: string;
  legalAddress: string | null;
  city: string | null;
}): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageSize: [number, number] = [595, 842]; // A4
  const xLeft = 50;
  const xRight = 545;
  const yStart = 790;
  const yMin = 60;
  const lineHeight = 14;

  let page = doc.addPage(pageSize);
  let y = yStart;

  const drawLine = (
    text: string,
    options: { bold?: boolean; size?: number; gapBefore?: number } = {},
  ) => {
    const size = options.size ?? 11;
    const font = options.bold ? fontBold : fontRegular;
    if (options.gapBefore) y -= options.gapBefore;
    const wrapped = wrapPdfLine(text, 95);
    for (const row of wrapped) {
      if (y < yMin) {
        page = doc.addPage(pageSize);
        y = yStart;
      }
      page.drawText(row, {
        x: xLeft,
        y,
        size,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= lineHeight;
    }
  };

  // Header
  page.drawText("ACCORDO DI RISERVATEZZA", {
    x: xLeft,
    y,
    size: 16,
    font: fontBold,
    color: rgb(0.48, 0.08, 0.14),
  });
  y -= 22;
  page.drawText("(Non Disclosure Agreement - NDA)", {
    x: xLeft,
    y,
    size: 10,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 24;

  // Premessa
  drawLine("Tra:", { bold: true });
  drawLine(
    "FedShield - Studio di Consulenza HSE (di seguito 'Consulente'), in qualita' di " +
      "fornitore di servizi di consulenza in materia di sicurezza sul lavoro, igiene " +
      "alimentare (HACCP) e tutela ambientale;",
  );
  drawLine("e", { gapBefore: 6 });
  const cityLabel = company.city && company.city.trim() ? company.city.trim() : "[citta non specificata]";
  const addressLabel =
    company.legalAddress && company.legalAddress.trim() ? company.legalAddress.trim() : "[sede non specificata]";
  drawLine(
    `${company.name} - P.IVA ${company.vatNumber} - sede: ${addressLabel} (${cityLabel}) ` +
      "(di seguito 'Cliente').",
    { gapBefore: 6 },
  );

  drawLine("Premesso che:", { bold: true, gapBefore: 10 });
  drawLine(
    "- il Consulente nell'esecuzione dell'incarico potra' venire a conoscenza di " +
      "informazioni riservate del Cliente (dati aziendali, processi produttivi, " +
      "anagrafica dipendenti, documentazione HSE);",
  );
  drawLine(
    "- il Cliente potra' a sua volta venire a conoscenza di metodologie, modulistica " +
      "e know-how del Consulente;",
  );
  drawLine("le Parti convengono quanto segue:", { gapBefore: 4 });

  // Articoli
  drawLine("Art. 1 - Oggetto", { bold: true, gapBefore: 12 });
  drawLine(
    "Il presente accordo disciplina il trattamento delle informazioni riservate " +
      "scambiate dalle Parti nell'ambito della consulenza HSE (sicurezza sul lavoro " +
      "ex D.Lgs. 81/2008, autocontrollo HACCP ex Reg. CE 852/2004, ambiente).",
  );

  drawLine("Art. 2 - Reciprocita' delle informazioni riservate", { bold: true, gapBefore: 10 });
  drawLine(
    "L'obbligo di riservatezza e' reciproco. Ciascuna Parte si impegna a non " +
      "divulgare a terzi le informazioni ricevute dall'altra Parte e ad utilizzarle " +
      "esclusivamente per le finalita' dell'incarico, adottando misure di sicurezza " +
      "adeguate (cartacee e informatiche).",
  );

  drawLine("Art. 3 - Durata", { bold: true, gapBefore: 10 });
  drawLine(
    "Il presente accordo ha durata di 5 (cinque) anni a decorrere dalla data della " +
      "firma e si intende valido anche oltre la cessazione del rapporto professionale " +
      "tra le Parti, entro il medesimo periodo.",
  );

  drawLine("Art. 4 - Foro competente", { bold: true, gapBefore: 10 });
  drawLine(
    `Per qualsiasi controversia derivante dal presente accordo sara' competente in ` +
      `via esclusiva il Tribunale di ${cityLabel}.`,
  );

  drawLine("Art. 5 - Firma digitale", { bold: true, gapBefore: 10 });
  drawLine(
    "Le Parti convengono che il presente accordo possa essere sottoscritto anche " +
      "mediante firma elettronica qualificata o firma digitale ai sensi del CAD " +
      "(D.Lgs. 82/2005), con pari efficacia rispetto alla firma autografa.",
  );

  // Footer firme
  drawLine(`Data: ${todayItalyDate()}`, { bold: true, gapBefore: 24 });
  y -= 10;

  if (y < yMin + 80) {
    page = doc.addPage(pageSize);
    y = yStart;
  }

  const signLineY = y - 40;
  // Signature line (Consulente)
  page.drawLine({
    start: { x: xLeft, y: signLineY },
    end: { x: xLeft + 200, y: signLineY },
    thickness: 0.6,
    color: rgb(0.1, 0.1, 0.1),
  });
  page.drawText("FedShield (Consulente)", {
    x: xLeft,
    y: signLineY - 14,
    size: 10,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Signature line (Cliente)
  page.drawLine({
    start: { x: xRight - 200, y: signLineY },
    end: { x: xRight, y: signLineY },
    thickness: 0.6,
    color: rgb(0.1, 0.1, 0.1),
  });
  const clientLabel = toPdfSafeText(`${company.name} (Cliente)`).slice(0, 60);
  page.drawText(clientLabel, {
    x: xRight - 200,
    y: signLineY - 14,
    size: 10,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

const companyRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/companies",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const role = request.user?.role;
      const records = await fastify.prisma.company.findMany({
        orderBy: { createdAt: "desc" },
      });
      return records.map((r) => toCompanyDtoFor(r, role));
    },
  );

  fastify.post(
    "/companies",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const parsed = createCompanySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload azienda non valido.");
      }

      const created = await fastify.prisma.company.create({ data: parsed.data });
      const auth = request.user;

      await writeAudit(fastify, {
        userId: auth?.sub,
        action: "company.create",
        entityType: "company",
        entityId: created.id,
        data: parsed.data,
      });

      return reply.code(201).send(toCompanyDto(created));
    },
  );

  fastify.patch(
    "/companies/:id",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const params = companyParamsSchema.safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("Parametri azienda non validi.");
      }

      const parsed = updateCompanySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload aggiornamento azienda non valido.");
      }

      if (Object.keys(parsed.data).length === 0) {
        return reply.badRequest("Nessun campo da aggiornare.");
      }

      const existing = await fastify.prisma.company.findUnique({ where: { id: params.data.id } });
      if (!existing) {
        return reply.notFound("Azienda non trovata.");
      }

      const updated = await fastify.prisma.company.update({
        where: { id: params.data.id },
        data: parsed.data,
      });
      const auth = request.user;

      await writeAudit(fastify, {
        userId: auth?.sub,
        action: "company.update",
        entityType: "company",
        entityId: updated.id,
        data: parsed.data,
      });

      return reply.send(toCompanyDto(updated));
    },
  );

  // ---- S18-A: Export CSV Danea Easyfatt ---------------------------------
  // Esporta tutti i clienti nel formato CSV importabile da Danea Easyfatt
  // (separatore ';', UTF-8 con BOM per compatibilita' Excel/Italiano).
  // Riservato a senior+admin.
  fastify.get(
    "/companies/export-csv",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const records = await fastify.prisma.company.findMany({
        orderBy: { name: "asc" },
      });

      const rows = records.map((r) =>
        buildDaneaRow({
          id: r.id,
          name: r.name,
          vatNumber: r.vatNumber,
          reaNumber: r.reaNumber,
          legalAddress: r.legalAddress,
          city: r.city,
          phone: r.phone,
          email: r.email,
          pec: r.pec,
        }),
      );
      const csvBody = buildDaneaCsv(rows);
      // BOM UTF-8: fa riconoscere correttamente l'encoding a Excel/Danea su Win.
      const buffer = Buffer.concat([Buffer.from("﻿", "utf8"), Buffer.from(csvBody, "utf8")]);

      const fileName = `danea-clienti-${todayCompactDate()}.csv`;

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth?.sub,
        action: "company.export_csv_danea",
        entityType: "company",
        entityId: "*",
        data: { count: rows.length },
      });

      reply.header("Content-Type", "text/csv; charset=utf-8");
      reply.header("Content-Disposition", `attachment; filename="${fileName}"`);
      return reply.send(buffer);
    },
  );

  // ---- S18-A: NDA PDF generator -----------------------------------------
  // Produce un PDF "Accordo di Riservatezza" precompilato con i dati della
  // singola azienda. 5 articoli (oggetto/reciprocita/durata/foro/firma
  // digitale). Riservato a senior+admin.
  fastify.get(
    "/companies/:id/nda-pdf",
    { preHandler: [fastify.authenticate, requireSeniorOrAdmin] },
    async (request, reply) => {
      const params = companyParamsSchema.safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("Parametri azienda non validi.");
      }

      const company = await fastify.prisma.company.findUnique({
        where: { id: params.data.id },
      });
      if (!company) {
        return reply.notFound("Azienda non trovata.");
      }

      const buffer = await buildNdaPdfBuffer({
        name: company.name,
        vatNumber: company.vatNumber,
        legalAddress: company.legalAddress,
        city: company.city,
      });

      const slug = slugifyForFilename(company.name);
      const fileName = `NDA-${slug}-${todayCompactDate()}.pdf`;

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth?.sub,
        action: "company.nda_pdf",
        entityType: "company",
        entityId: company.id,
        data: { fileName },
      });

      reply.header("Content-Type", "application/pdf");
      reply.header("Content-Disposition", `attachment; filename="${fileName}"`);
      return reply.send(buffer);
    },
  );
};

export default companyRoutes;
