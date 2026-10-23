import {
  ChecklistAnswerValue,
  ComplianceDomain,
  InspectionChecklistMode,
  InspectionDocumentStatus,
  Inspection as PrismaInspection,
  GeneratedDocument as PrismaGeneratedDocument,
  UserRole,
} from "@prisma/client";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import {
  buildAttestatoVerificationToken,
  generateAttestatoPdf,
  generateInspectionChecklistPdf,
  generateInspectionReportPdf,
  listDocuments,
} from "../../services/document.service.js";
import {
  buildInspectionReport,
  computeInspectionComplianceScore,
  starsFromScore,
} from "../../services/report.service.js";
import { writeAudit } from "../../plugins/audit.js";
import { config } from "../../config.js";
import { composeNcDescription, getNcGuidance } from "../../services/restaurant-checklist-knowledge.js";

const createInspectionSchema = z.object({
  companyId: z.string().min(1),
  title: z.string().min(3),
  notes: z.string().optional(),
  checklistMode: z.nativeEnum(InspectionChecklistMode).optional(),
  // Momento del sopralluogo rilevato dal dispositivo del consulente.
  // Se assente vale l'orario del server. Le date nel futuro oltre un
  // giorno e quelle oltre dieci anni indietro vengono rifiutate.
  happenedAt: z
    .string()
    .datetime()
    .refine(
      (valore) => {
        const istante = new Date(valore).getTime();
        const adesso = Date.now();
        return istante <= adesso + 24 * 3600_000 && istante >= adesso - 10 * 365 * 24 * 3600_000;
      },
      { message: "Data del sopralluogo fuori dall'intervallo consentito." },
    )
    .optional(),
});

const validateInspectionSchema = z.object({
  inspectionId: z.string().min(1),
  approved: z.boolean(),
  notes: z.string().optional(),
});

const addNcSchema = z.object({
  inspectionId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().optional(),
  isSanctionable: z.boolean().default(false),
  severity: z.number().int().min(1).max(4).default(1),
});

const submitAnswersSchema = z.object({
  answers: z
    .array(
      z.object({
        checklistItemId: z.string().min(1),
        value: z.enum([ChecklistAnswerValue.yes, ChecklistAnswerValue.no, ChecklistAnswerValue.na]),
        note: z.string().optional(),
        severity: z.number().int().min(1).max(4).optional(),
        isSanctionable: z.boolean().optional(),
      }),
    )
    .min(1),
});

const documentStatusSchema = z.enum([
  InspectionDocumentStatus.viewed_on_site,
  InspectionDocumentStatus.requested_later,
  InspectionDocumentStatus.not_available,
  InspectionDocumentStatus.not_applicable,
]);

const upsertDocumentsSchema = z.object({
  documents: z
    .array(
      z.object({
        documentTemplateId: z.string().optional(),
        name: z.string().min(2),
        status: documentStatusSchema,
        note: z.string().optional(),
      }),
    )
    .min(1),
});

function parseMetadataJson(value?: string | null): Record<string, unknown> {
  if (!value) {
    return {};
  }
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function resolveDocumentPath(filePath: string): { storageRoot: string; absolutePath: string } {
  const storageRoot = path.resolve(process.cwd(), config.storageDir);
  const absolutePath = path.resolve(storageRoot, filePath);
  return { storageRoot, absolutePath };
}

type AttestatoVerificationResolution =
  | { status: "inspection_not_found" }
  | { status: "attestato_not_found"; inspection: PrismaInspection & { company: { name: string; vatNumber: string } } }
  | {
      status: "ok";
      inspection: PrismaInspection & { company: { name: string; vatNumber: string } };
      attestato: PrismaGeneratedDocument;
      score: number;
      stars: number;
      inspectionDate: Date;
      isValid: boolean;
    };

async function resolveAttestatoVerification(
  fastify: FastifyInstance,
  inspectionId: string,
  token: string,
): Promise<AttestatoVerificationResolution> {
  const inspection = await fastify.prisma.inspection.findUnique({
    where: { id: inspectionId },
    include: { company: true },
  });

  if (!inspection) {
    return { status: "inspection_not_found" };
  }

  const attestato = await fastify.prisma.generatedDocument.findFirst({
    where: {
      inspectionId: inspection.id,
      kind: "attestato",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!attestato) {
    return { status: "attestato_not_found", inspection };
  }

  const metadata = parseMetadataJson(attestato.metadataJson);
  const score = Number(metadata.score);
  const stars = Number(metadata.stars);
  const closedAtIso = typeof metadata.closedAt === "string" ? metadata.closedAt : null;
  const storedToken = typeof metadata.verificationToken === "string" ? metadata.verificationToken : null;
  const expectedToken =
    closedAtIso && Number.isFinite(score) && Number.isFinite(stars)
      ? buildAttestatoVerificationToken({
          inspectionId: inspection.id,
          closedAtIso,
          score,
          stars,
        })
      : null;

  const inspectionDate =
    typeof metadata.inspectionDate === "string" ? new Date(metadata.inspectionDate) : inspection.happenedAt;
  const isValid = Boolean(storedToken && expectedToken && token === storedToken && token === expectedToken);

  return {
    status: "ok",
    inspection,
    attestato,
    score: Number.isFinite(score) ? score : 0,
    stars: Number.isFinite(stars) ? stars : 0,
    inspectionDate,
    isValid,
  };
}

function buildAtecoVariants(atecoCode?: string | null) {
  if (!atecoCode) {
    return [];
  }

  const normalized = atecoCode.trim();
  const digits = normalized.replace(/\D/g, "");
  const parts = normalized.split(".");
  const variants = new Set<string>([normalized]);

  if (parts.length >= 2) {
    variants.add(`${parts[0]}.${parts[1]}`);
  }

  if (parts.length >= 1) {
    variants.add(parts[0]);
  }

  // Normalizzazione per codici ATECO privi di separatori (es. "551000", "561011", "5510", "551")
  if (digits.length >= 2) {
    const d2 = digits.slice(0, 2);
    variants.add(d2);
    if (digits.length === 3) {
      variants.add(`${d2}.${digits.slice(2, 3)}`);
    }
    if (digits.length >= 4) {
      const d4 = `${d2}.${digits.slice(2, 4)}`;
      variants.add(d4);
      if (digits.length >= 5) {
        variants.add(`${d4}.${digits.slice(4, 6)}`);
      }
    }
  }

  // Macrosettori HoReCa / Ricettività / Alloggio per Divisione ATECO 55
  if (parts[0] === "55" || digits.startsWith("55")) {
    variants.add("HO.RE.CA");
    variants.add("HORECA");
    variants.add("RICETTIVITA");
    variants.add("RICETTIVITÀ");
    variants.add("STRUTTURE_RICETTIVE");
    variants.add("ALLOGGIO");
  }

  const upper = normalized.toUpperCase();

  // Hotel / Alberghi (55.10.00, 55.10, 55.1, 551000, 5510, 551)
  const isHotelText =
    upper === "HOTEL" ||
    upper === "ALBERGO" ||
    upper === "ALBERGHI" ||
    upper === "RESORT";

  if (
    normalized.startsWith("55.10") ||
    normalized.startsWith("55.1") ||
    digits.startsWith("5510") ||
    digits === "551" ||
    isHotelText
  ) {
    variants.add("55.10.00");
    variants.add("55.10");
    variants.add("55.1");
    variants.add("551000");
    variants.add("5510");
    variants.add("HOTEL");
    variants.add("ALBERGO");
    variants.add("ALBERGHI");
    variants.add("STRUTTURE_RICETTIVE");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
    variants.add("RICETTIVITA");
    variants.add("RICETTIVITÀ");
  }

  // B&B e Affittacamere (55.20.51, 55.20.5, 55.20, 55.2, 552051, 55205, 5520, 552)
  const isBnbCode =
    normalized.startsWith("55.20.5") ||
    digits.startsWith("55205") ||
    normalized === "55.20" ||
    normalized === "55.2" ||
    digits === "5520" ||
    digits === "552";

  const isBnbText =
    upper === "BEB_AFFITTACAMERE" ||
    upper === "AFFITTACAMERE" ||
    upper === "B&B" ||
    upper === "B & B" ||
    upper === "BNB" ||
    upper === "GUESTHOUSE" ||
    upper === "BED AND BREAKFAST" ||
    upper === "BED & BREAKFAST" ||
    upper === "BED_AND_BREAKFAST" ||
    upper === "EXTRA ALBERGHIERO" ||
    upper === "EXTRA_ALBERGHIERO" ||
    upper === "EXTRAALBERGHIERO";

  if (isBnbCode || isBnbText) {
    variants.add("55.20.51");
    variants.add("55.20.5");
    variants.add("55.20");
    variants.add("55.2");
    variants.add("552051");
    variants.add("55205");
    variants.add("5520");
    variants.add("BEB_AFFITTACAMERE");
    variants.add("AFFITTACAMERE");
    variants.add("B&B");
    variants.add("BNB");
    variants.add("GUESTHOUSE");
    variants.add("STRUTTURE_RICETTIVE");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
    variants.add("RICETTIVITA");
    variants.add("RICETTIVITÀ");
    variants.add("ALLOGGIO");
  }

  // Ostelli e Residence (55.20.20, 55.20.2, 552020, 55202)
  const isOstelloCode =
    normalized.startsWith("55.20.2") ||
    digits.startsWith("55202");

  const isOstelloText =
    upper === "OSTELLI_RESIDENCE" ||
    upper === "OSTELLO_RESIDENCE" ||
    upper === "OSTELLI" ||
    upper === "OSTELLO" ||
    upper === "RESIDENCE" ||
    upper === "HOSTEL" ||
    upper === "CASE_PER_FERIE" ||
    upper === "CASE PER FERIE" ||
    upper === "STUDENTATO" ||
    upper === "ALLOGGI_STUDENTI" ||
    upper === "ALLOGGI STUDENTI";

  if (isOstelloCode || isOstelloText) {
    variants.add("55.20.20");
    variants.add("55.20.2");
    variants.add("55.20");
    variants.add("552020");
    variants.add("55202");
    variants.add("OSTELLI_RESIDENCE");
    variants.add("OSTELLO_RESIDENCE");
    variants.add("RESIDENCE");
    variants.add("OSTELLI");
    variants.add("OSTELLO");
    variants.add("STRUTTURE_RICETTIVE");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
    variants.add("RICETTIVITA");
    variants.add("RICETTIVITÀ");
    variants.add("ALLOGGIO");
  }

  // Campeggi e Villaggi turistici (55.30.00, 55.30.0, 55.30, 55.3, 553000, 55300, 5530, 553)
  const isCampingText =
    upper === "CAMPEGGIO_VILLAGGIO" ||
    upper === "CAMPEGGI_VILLAGGI" ||
    upper === "CAMPEGGIO" ||
    upper === "CAMPEGGI" ||
    upper === "CAMPING" ||
    upper === "CAMPING_VILLAGE" ||
    upper === "CAMPING VILLAGE" ||
    upper === "VILLAGGIO_TURISTICO" ||
    upper === "VILLAGGI_TURISTICI" ||
    upper === "VILLAGGIO TURISTICO" ||
    upper === "VILLAGGI TURISTICI";

  if (normalized.startsWith("55.3") || digits.startsWith("553") || isCampingText) {
    variants.add("55.30.00");
    variants.add("55.30.0");
    variants.add("55.30");
    variants.add("55.3");
    variants.add("553000");
    variants.add("55300");
    variants.add("5530");
    variants.add("553");
    variants.add("CAMPEGGIO_VILLAGGIO");
    variants.add("CAMPEGGI_VILLAGGI");
    variants.add("CAMPEGGIO");
    variants.add("CAMPEGGI");
    variants.add("CAMPING");
    variants.add("CAMPING_VILLAGE");
    variants.add("VILLAGGIO_TURISTICO");
    variants.add("VILLAGGI_TURISTICI");
    variants.add("STRUTTURE_RICETTIVE");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
    variants.add("RICETTIVITA");
    variants.add("RICETTIVITÀ");
    variants.add("ALLOGGIO");
  }

  // Divisione ATECO 56 (Ristorazione e somministrazione alimenti / HoReCa)
  if (parts[0] === "56" || digits.startsWith("56")) {
    variants.add("HO.RE.CA");
    variants.add("HORECA");
  }

  if (normalized.startsWith("56.10.41") || digits.startsWith("561041")) {
    variants.add("PASTICCERIA_AMBULANTE");
  }
  if (normalized.startsWith("56.10.42") || digits.startsWith("561042")) {
    variants.add("FOOD_TRUCK");
  }

  // Pasticcerie e Gelaterie artigianali con laboratorio (56.10.30, 56.10.3, 561030, 56103)
  const isPastryGelateriaText =
    upper === "PASTICCERIA" ||
    upper === "PASTICCERIE" ||
    upper === "GELATERIA" ||
    upper === "GELATERIE" ||
    upper === "PASTICCERIA_GELATERIA" ||
    upper === "GELATERIA_PASTICCERIA" ||
    upper === "PASTICCERIA GELATERIA" ||
    upper === "GELATERIA PASTICCERIA" ||
    upper === "LABORATORIO_PASTICCERIA" ||
    upper === "LABORATORIO PASTICCERIA";

  const isPastryGelateriaCode =
    normalized.startsWith("56.10.3") ||
    digits.startsWith("56103");

  if (isPastryGelateriaCode || isPastryGelateriaText) {
    variants.add("56.10.30");
    variants.add("56.10.3");
    variants.add("561030");
    variants.add("56103");
    variants.add("PASTICCERIA_GELATERIA");
    variants.add("PASTICCERIA");
    variants.add("GELATERIA");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
  }

  if (normalized.startsWith("56.10.20") || digits.startsWith("561020")) {
    variants.add("PIZZERIA_ASPORTO");
  }
  if (normalized.startsWith("56.10.11") || digits.startsWith("561011") || normalized === "56.10.1") {
    variants.add("RISTORANTI");
  }
  if (normalized.startsWith("56.29.10") || digits.startsWith("562910")) {
    variants.add("MENSE_CATERING");
  }
  if (normalized.startsWith("56.21.00") || digits.startsWith("562100")) {
    variants.add("CATERING_EVENTI");
  }
  if (normalized.startsWith("56.30") || digits.startsWith("5630")) {
    variants.add("BAR");
  }

  // Discoteche, sale da ballo, night-club, locali serali e club (93.29.10, 93.29.1, 932910, 93291)
  const isDiscoText =
    upper === "DISCOTECA_LOCALE_SERALE" ||
    upper === "DISCOTECHE_LOCALI_SERALI" ||
    upper === "DISCOTECA LOCALE SERALE" ||
    upper === "DISCOTECHE LOCALI SERALI" ||
    upper === "DISCOTECA" ||
    upper === "DISCOTECHE" ||
    upper === "LOCALE_SERALE" ||
    upper === "LOCALI_SERALI" ||
    upper === "LOCALE SERALE" ||
    upper === "LOCALI SERALI" ||
    upper === "LOCALE_NOTTURNO" ||
    upper === "LOCALI_NOTTURNI" ||
    upper === "LOCALE NOTTURNO" ||
    upper === "LOCALI NOTTURNI" ||
    upper === "NIGHTLIFE" ||
    upper === "NIGHT_LIFE" ||
    upper === "NIGHT LIFE" ||
    upper === "NIGHTCLUB" ||
    upper === "NIGHT_CLUB" ||
    upper === "NIGHT CLUB" ||
    upper === "NIGHT-CLUB" ||
    upper === "CLUB" ||
    upper === "PUB_SERALE" ||
    upper === "PUB SERALE" ||
    upper === "PUB_DISCO" ||
    upper === "PUB DISCO" ||
    upper === "SALA_DA_BALLO" ||
    upper === "SALE_DA_BALLO" ||
    upper === "SALA DA BALLO" ||
    upper === "SALE DA BALLO" ||
    upper === "DISCO";

  const isDiscoCode =
    normalized.startsWith("93.29.1") ||
    digits.startsWith("93291");

  if (isDiscoCode || isDiscoText) {
    variants.add("93.29.10");
    variants.add("93.29.1");
    variants.add("932910");
    variants.add("93291");
    variants.add("DISCOTECA_LOCALE_SERALE");
    variants.add("DISCOTECA");
    variants.add("DISCOTECHE");
    variants.add("LOCALE_SERALE");
    variants.add("LOCALI_SERALI");
    variants.add("LOCALE_NOTTURNO");
    variants.add("LOCALI_NOTTURNI");
    variants.add("NIGHTLIFE");
    variants.add("NIGHTCLUB");
    variants.add("CLUB");
    variants.add("PUB_SERALE");
    variants.add("PUB_DISCO");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
  }

  // Stabilimenti balneari / Lidi / Beach club (93.29.20, 93.29.2, 93.29, 93.2, 932920, 93292, 9329, 932)
  const isBeachClubText =
    upper === "STABILIMENTO_BALNEARE" ||
    upper === "STABILIMENTI_BALNEARI" ||
    upper === "STABILIMENTO BALNEARE" ||
    upper === "STABILIMENTI BALNEARI" ||
    upper === "LIDO" ||
    upper === "LIDI" ||
    upper === "BEACH_CLUB" ||
    upper === "BEACH CLUB" ||
    upper === "BEACHCLUB" ||
    upper === "BALNEARE" ||
    upper === "BALNEARI" ||
    upper === "STRUTTURE_BALNEARI" ||
    upper === "STRUTTURA_BALNEARE" ||
    upper === "STRUTTURE BALNEARI" ||
    upper === "STRUTTURA BALNEARE";

  const isBeachClubCode =
    normalized.startsWith("93.29.2") ||
    digits.startsWith("93292") ||
    ((normalized === "93.29" || digits === "9329" || normalized === "93.2" || digits === "932") &&
      !isDiscoCode);

  if (isBeachClubCode || isBeachClubText) {
    variants.add("93.29.20");
    variants.add("93.29.2");
    variants.add("93.29");
    variants.add("93.2");
    variants.add("932920");
    variants.add("93292");
    variants.add("9329");
    variants.add("932");
    variants.add("STABILIMENTO_BALNEARE");
    variants.add("STABILIMENTI_BALNEARI");
    variants.add("LIDO");
    variants.add("BEACH_CLUB");
    variants.add("BALNEARE");
    variants.add("STRUTTURE_BALNEARI");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
  }

  // Ricerca testuale diretta per nome macrosettore
  if (upper === "HOTEL" || upper === "ALBERGO" || upper === "ALBERGHI") {
    variants.add("55.10.00");
    variants.add("55.10");
    variants.add("55.1");
    variants.add("551000");
    variants.add("HOTEL");
    variants.add("ALBERGO");
    variants.add("HO.RE.CA");
    variants.add("HORECA");
    variants.add("RICETTIVITA");
    variants.add("STRUTTURE_RICETTIVE");
  }
  if (
    upper === "HORECA" ||
    upper === "HO.RE.CA" ||
    upper === "RICETTIVITA" ||
    upper === "RICETTIVITÀ" ||
    upper === "STRUTTURE_RICETTIVE" ||
    upper === "STRUTTURE RICETTIVE" ||
    upper === "ALLOGGIO"
  ) {
    variants.add("HO.RE.CA");
    variants.add("HORECA");
    variants.add("RICETTIVITA");
    variants.add("RICETTIVITÀ");
    variants.add("STRUTTURE_RICETTIVE");
    variants.add("ALLOGGIO");
    variants.add("HOTEL");
    variants.add("55.10.00");
    variants.add("55.10");
    variants.add("BEB_AFFITTACAMERE");
    variants.add("AFFITTACAMERE");
    variants.add("B&B");
    variants.add("BNB");
    variants.add("GUESTHOUSE");
    variants.add("55.20.51");
    variants.add("55.20");
    variants.add("OSTELLI_RESIDENCE");
    variants.add("OSTELLO_RESIDENCE");
    variants.add("OSTELLI");
    variants.add("OSTELLO");
    variants.add("RESIDENCE");
    variants.add("55.20.20");
    variants.add("55.20.2");
    variants.add("552020");
    variants.add("55202");
    variants.add("55.30.00");
    variants.add("55.30");
    variants.add("553000");
    variants.add("CAMPEGGIO_VILLAGGIO");
    variants.add("CAMPEGGI_VILLAGGI");
    variants.add("CAMPEGGIO");
    variants.add("CAMPING");
    variants.add("VILLAGGIO_TURISTICO");
    variants.add("VILLAGGI_TURISTICI");
    variants.add("STABILIMENTI_BALNEARI");
    variants.add("STABILIMENTO_BALNEARE");
    variants.add("BEACH_CLUB");
    variants.add("LIDO");
    variants.add("BALNEARE");
    variants.add("STRUTTURE_BALNEARI");
    variants.add("93.29.20");
    variants.add("932920");
    variants.add("LOCALI_SERALI");
    variants.add("LOCALE_SERALE");
    variants.add("DISCOTECA");
    variants.add("DISCOTECHE");
    variants.add("DISCOTECA_LOCALE_SERALE");
    variants.add("93.29.10");
    variants.add("932910");
  }

  // Commercio al Dettaglio Non Alimentare / Abbigliamento, Calzature, Casalinghi, Elettronica ed Esercizi Commerciali Specializzati
  // ATECO 47.71, 47.72, 47.5, 47.6, 47.7 e prefissi
  const isFoodRetail =
    normalized.startsWith("47.11") ||
    digits.startsWith("4711") ||
    normalized.startsWith("47.2") ||
    digits.startsWith("472") ||
    normalized.startsWith("47.81") ||
    digits.startsWith("4781");

  const isCommerceNonFoodText =
    upper === "COMMERCIO_NON_FOOD" ||
    upper === "COMMERCIO NON FOOD" ||
    upper === "COMMERCIO_NON_ALIMENTARE" ||
    upper === "COMMERCIO NON ALIMENTARE" ||
    upper === "RETAIL_NON_FOOD" ||
    upper === "RETAIL NON FOOD" ||
    upper === "NEGOZIO_ABBIGLIAMENTO" ||
    upper === "NEGOZIO ABBIGLIAMENTO" ||
    upper === "COMMERCIO_DETTAGLIO_NON_FOOD" ||
    upper === "COMMERCIO DETTAGLIO NON FOOD";

  const isCommerceNonFoodCode =
    !isFoodRetail &&
    (normalized.startsWith("47.71") ||
      normalized.startsWith("47.72") ||
      normalized.startsWith("47.7") ||
      normalized.startsWith("47.5") ||
      normalized.startsWith("47.6") ||
      digits.startsWith("4771") ||
      digits.startsWith("4772") ||
      digits.startsWith("477") ||
      digits.startsWith("475") ||
      digits.startsWith("476") ||
      normalized === "47" ||
      digits === "47" ||
      parts[0] === "47");

  if (isCommerceNonFoodCode || isCommerceNonFoodText) {
    variants.add("47.71");
    variants.add("47.71.1");
    variants.add("47.71.10");
    variants.add("47.71.2");
    variants.add("47.71.3");
    variants.add("47.72");
    variants.add("47.5");
    variants.add("47.6");
    variants.add("47.7");
    variants.add("4771");
    variants.add("477110");
    variants.add("477120");
    variants.add("47711");
    variants.add("47712");
    variants.add("47713");
    variants.add("477");
    variants.add("475");
    variants.add("476");
    variants.add("COMMERCIO_NON_FOOD");
    variants.add("COMMERCIO_NON_ALIMENTARE");
    variants.add("RETAIL_NON_FOOD");
    variants.add("NEGOZIO_ABBIGLIAMENTO");
  }
  if (normalized.startsWith("49.4") || parts[0] === "52" || parts[0] === "53") {
    variants.add("LOGISTICA_MAGAZZINO");
  }
  if (normalized.startsWith("81.2")) {
    variants.add("PULIZIE_SANIFICAZIONE");
  }
  if (normalized.startsWith("96.02") || normalized.startsWith("96.04")) {
    variants.add("SERVIZI_PERSONA");
  }
  if (parts[0] === "85") {
    variants.add("ISTRUZIONE_FORMAZIONE");
  }
  if (parts[0] === "45" || normalized.startsWith("45.2")) {
    variants.add("AUTORIPARAZIONE");
  }
  // Gastronomia / Produzione e Confezionamento di Piatti Pronti, Pasti Cotti e Basi Alimentari Refrigerate/Surgelate
  // ATECO 10.85 (10.85, 10.85.0, 10.85.00, 10.85.01, 10.8, 108500, 10850, 1085, 108)
  const isGastronomyCode =
    normalized.startsWith("10.85") ||
    digits.startsWith("1085") ||
    normalized === "10.8" ||
    digits === "108";

  const isGastronomyText =
    upper === "GASTRONOMIA_PRODUZIONE" ||
    upper === "GASTRONOMIA PRODUZIONE" ||
    upper === "GASTRONOMIA" ||
    upper === "PRODUZIONE_ALIMENTARE" ||
    upper === "PRODUZIONE ALIMENTARE" ||
    upper === "PASTI_PRONTI" ||
    upper === "PASTI PRONTI" ||
    upper === "PIATTI_PRONTI" ||
    upper === "PIATTI PRONTI" ||
    upper === "INDUSTRIA_ALIMENTARE" ||
    upper === "INDUSTRIA ALIMENTARE";

  if (isGastronomyCode || isGastronomyText) {
    variants.add("10.85");
    variants.add("10.85.0");
    variants.add("10.85.00");
    variants.add("10.85.01");
    variants.add("10.8");
    variants.add("108500");
    variants.add("10850");
    variants.add("1085");
    variants.add("108");
    variants.add("GASTRONOMIA_PRODUZIONE");
    variants.add("GASTRONOMIA");
    variants.add("PRODUZIONE_ALIMENTARE");
    variants.add("PASTI_PRONTI");
    variants.add("PIATTI_PRONTI");
    variants.add("HORECA");
    variants.add("HO.RE.CA");
  }

  if (parts[0] === "10" && !isGastronomyCode) {
    variants.add("INDUSTRIA_ALIMENTARE");
  }

  // EDILIZIA (Costruzioni, cantieri, ingegneria civile, impiantistica)
  if (parts[0] === "41" || parts[0] === "42" || parts[0] === "43") {
    variants.add("EDILIZIA");
    variants.add("construction");
  }

  // METALMECCANICA (Fabbricazione prodotti in metallo, macchinari, saldatura)
  if (parts[0] === "25" || parts[0] === "28") {
    variants.add("metalmechanics");
    variants.add("METALMECCANICO");
    variants.add("METALMECCANICA");
    variants.add("metalworking");
  }

  // SANITA (Assistenza sanitaria, studi medici, odontoiatria, RSA)
  if (parts[0] === "86" || parts[0] === "87") {
    variants.add("healthcare");
    variants.add("SANITA");
  }

  // UFFICI / SERVIZI IT (Informatica, software, consulenza, studi professionali)
  if (
    parts[0] === "62" ||
    parts[0] === "69" ||
    parts[0] === "70" ||
    parts[0] === "74" ||
    parts[0] === "58" ||
    parts[0] === "63"
  ) {
    variants.add("office-it");
    variants.add("office");
    variants.add("UFFICI");
  }

  // AGRICOLTURA (Coltivazioni agricole, produzione prodotti animali, vivai, cantine)
  if (parts[0] === "01") {
    variants.add("agriculture");
    variants.add("AGRICOLTURA");
  }

  // SPORT & FITNESS (Palestre, piscine, circoli sportivi, impianti fitness)
  if (normalized.startsWith("93.1")) {
    variants.add("SPORT_FITNESS");
    variants.add("sport_fitness");
  }

  // TRASPORTO PERSONE (NCC, taxi, noleggio bus con conducente)
  if (normalized.startsWith("49.3")) {
    variants.add("TRASPORTO_PERSONE");
    variants.add("passenger_transport");
  }

  // FALEGNAMERIA / LAVORAZIONE LEGNO (Industria del legno, fabbricazione mobili)
  if (parts[0] === "16" || parts[0] === "31") {
    variants.add("FALEGNAMERIA_LEGNO");
    variants.add("woodworking");
  }

  return [...variants];
}

function buildDomainFilterByChecklistMode(checklistMode?: InspectionChecklistMode | null) {
  if (!checklistMode || checklistMode === InspectionChecklistMode.unified) {
    return undefined;
  }

  if (checklistMode === InspectionChecklistMode.haccp_only) {
    return {
      in: [ComplianceDomain.haccp, ComplianceDomain.both],
    };
  }

  return {
    in: [ComplianceDomain.safety, ComplianceDomain.both],
  };
}

function parseRetailScopes(raw?: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);
  } catch {
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
}

function buildRetailScopeVariants(scopes: string[]): string[] {
  const mapping: Record<string, string[]> = {
    retail_restaurant: ["RISTORANTI"],
    retail_pizzeria: ["PIZZERIA_ASPORTO"],
    retail_bar: ["BAR"],
    retail_butcher_counter: ["RETAIL_LARGE_BUTCHER"],
    retail_fish_counter: ["RETAIL_LARGE_FISH"],
    retail_produce_counter: ["RETAIL_LARGE_PRODUCE"],
    retail_deli_counter: ["RETAIL_LARGE_DELI"],
    retail_icecream: ["PASTICCERIA_GELATERIA"],
    retail_pastry: ["PASTICCERIA_GELATERIA"],
  };

  const variants = new Set<string>();
  for (const scope of scopes) {
    const key = scope.toLowerCase();
    const mapped = mapping[key];
    if (mapped) {
      mapped.forEach((value) => variants.add(value));
      continue;
    }
    variants.add(scope);
  }
  return [...variants];
}

const inspectionRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/verify/attestato/:inspectionId",
    async (request, reply) => {
      const params = z.object({ inspectionId: z.string().min(1) }).safeParse(request.params);
      const query = z.object({ token: z.string().min(8) }).safeParse(request.query ?? {});
      if (!params.success || !query.success) {
        return reply
          .type("text/html; charset=utf-8")
          .code(400)
          .send(
            "<!doctype html><html><body><h1>Attestato non verificabile</h1><p>Token o ID non validi.</p></body></html>",
          );
      }

      const token = query.data.token.trim();
      const resolved = await resolveAttestatoVerification(fastify, params.data.inspectionId, token);

      if (resolved.status === "inspection_not_found") {
        return reply
          .type("text/html; charset=utf-8")
          .code(404)
          .send("<!doctype html><html><body><h1>Attestato non trovato</h1><p>Inspection inesistente.</p></body></html>");
      }

      if (resolved.status === "attestato_not_found") {
        return reply
          .type("text/html; charset=utf-8")
          .code(404)
          .send(
            "<!doctype html><html><body><h1>Attestato non presente</h1><p>Non risulta alcun attestato valido per questo sopralluogo.</p></body></html>",
          );
      }

      const { inspection, attestato, score, stars, inspectionDate, isValid } = resolved;

      const title = isValid ? "Attestato verificato" : "Attestato non valido";
      const message = isValid
        ? "Documento autentico rilasciato da FedShield by FEDINVEST."
        : "Il QR non corrisponde a un attestato valido.";
      const safeCompany = escapeHtml(inspection.company.name);
      const safeVat = escapeHtml(inspection.company.vatNumber);
      const safeDate = inspectionDate.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" });
      const safeScore = `${score}/100`;
      const safeStars = `${stars}/5`;
      const downloadHref = `/api/verify/attestato/${encodeURIComponent(inspection.id)}/pdf?token=${encodeURIComponent(token)}`;

      const html = `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: light; }
      body { margin:0; font-family: Arial, sans-serif; background:#FEFEFE; color:#212D52; }
      .hero { background:#212D52; color:#FEFEFE; padding:24px 16px; text-align:center; }
      .hero .brand { color:#E65712; font-weight:700; letter-spacing:.02em; }
      .card { max-width: 820px; margin: 24px auto; background:#FEFEFE; border:1px solid #969CAD; border-radius:12px; padding:24px; }
      h1 { margin:0 0 8px 0; color:${isValid ? "#212D52" : "#E65712"}; }
      p { margin: 0 0 16px 0; }
      .grid { display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
      .row { background:#FEFEFE; border:1px solid #969CAD; border-radius:8px; padding:10px 12px; }
      .label { font-size:12px; color:#6D748D; margin-bottom:4px; text-transform:uppercase; letter-spacing:.03em; }
      .value { font-weight:700; }
      .footer { margin-top:16px; font-size:12px; color:#6D748D; }
      .actions { margin-top: 18px; display:flex; gap:10px; flex-wrap:wrap; }
      .btn { display:inline-block; background:#212D52; color:#FEFEFE; border-radius:8px; padding:10px 14px; text-decoration:none; font-weight:700; }
      .btn:hover { background:#394264; }
      .btn.secondary { background:#E65712; }
      .btn.secondary:hover { background:#EE8F5F; }
      .invalid-note { margin-top: 12px; color:#E65712; font-weight:700; }
      @media (max-width: 760px) { .grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <div class="hero">Verifica attestato <span class="brand">FedShield by FEDINVEST</span></div>
    <div class="card">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      <div class="grid">
        <div class="row"><div class="label">Ragione Sociale</div><div class="value">${safeCompany}</div></div>
        <div class="row"><div class="label">Partita IVA</div><div class="value">${safeVat}</div></div>
        <div class="row"><div class="label">Data sopralluogo</div><div class="value">${escapeHtml(safeDate)}</div></div>
        <div class="row"><div class="label">Fed Score</div><div class="value">${escapeHtml(safeScore)}</div></div>
        <div class="row"><div class="label">Stelline</div><div class="value">${escapeHtml(safeStars)}</div></div>
        <div class="row"><div class="label">ID attestato</div><div class="value">${escapeHtml(attestato.id)}</div></div>
      </div>
      <div class="actions">
        <a class="btn${isValid ? "" : " secondary"}" href="${downloadHref}">Scarica attestato PDF</a>
      </div>
      ${isValid ? "" : '<div class="invalid-note">Download non disponibile: QR non valido.</div>'}
      <div class="footer">FedShield by FEDINVEST S.r.l.</div>
    </div>
  </body>
</html>`;

      return reply.type("text/html; charset=utf-8").code(isValid ? 200 : 400).send(html);
    },
  );

  fastify.get(
    "/verify/attestato/:inspectionId/pdf",
    async (request, reply) => {
      const params = z.object({ inspectionId: z.string().min(1) }).safeParse(request.params);
      const query = z.object({ token: z.string().min(8) }).safeParse(request.query ?? {});
      if (!params.success || !query.success) {
        return reply.badRequest("Token o ID non validi.");
      }

      const token = query.data.token.trim();
      const resolved = await resolveAttestatoVerification(fastify, params.data.inspectionId, token);
      if (resolved.status === "inspection_not_found") {
        return reply.notFound("Inspection inesistente.");
      }
      if (resolved.status === "attestato_not_found") {
        return reply.notFound("Attestato non presente.");
      }
      if (!resolved.isValid) {
        return reply.badRequest("Token di verifica non valido.");
      }

      const { storageRoot, absolutePath } = resolveDocumentPath(resolved.attestato.filePath);
      if (!absolutePath.startsWith(storageRoot)) {
        return reply.forbidden("Percorso documento non valido.");
      }

      try {
        await access(absolutePath);
      } catch {
        return reply.notFound("File attestato non presente su disco.");
      }

      reply.header("Content-Type", "application/pdf");
      reply.header("Content-Disposition", `attachment; filename="${resolved.attestato.fileName}"`);
      return reply.send(createReadStream(absolutePath));
    },
  );

  fastify.get(
    "/documents/:documentId/download",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ documentId: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID documento non valido.");
      }

      const document = await fastify.prisma.generatedDocument.findUnique({
        where: { id: params.data.documentId },
      });
      if (!document) {
        return reply.notFound("Documento non trovato.");
      }

      const { storageRoot, absolutePath } = resolveDocumentPath(document.filePath);
      if (!absolutePath.startsWith(storageRoot)) {
        return reply.forbidden("Percorso documento non valido.");
      }

      try {
        await access(absolutePath);
      } catch {
        return reply.notFound("File documento non presente su disco.");
      }

      reply.header("Content-Type", "application/pdf");
      reply.header("Content-Disposition", `attachment; filename="${document.fileName}"`);
      return reply.send(createReadStream(absolutePath));
    },
  );

  fastify.get(
    "/inspections",
    { preHandler: [fastify.authenticate] },
    async () => {
      return fastify.prisma.inspection.findMany({
        include: {
          company: true,
          author: { select: { id: true, fullName: true, role: true } },
          validator: { select: { id: true, fullName: true, role: true } },
          nonConformities: true,
          answers: {
            include: {
              checklistItem: {
                select: {
                  id: true,
                  question: true,
                  area: true,
                  templateId: true,
                },
              },
            },
          },
        },
        orderBy: { happenedAt: "desc" },
      });
    },
  );

  fastify.get(
    "/inspections/:id/documents/requirements",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      const query = z.object({ retailScopes: z.string().optional() }).safeParse(request.query ?? {});
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }
      if (!query.success) {
        return reply.badRequest("Query requisiti documentali non valida.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({
        where: { id: params.data.id },
        include: {
          company: true,
          documents: true,
        },
      });

      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      const atecoVariants = buildAtecoVariants(inspection.company.atecoCode);
      const auth = request.user;
      const retailScopeVariants =
        auth.role === UserRole.admin
          ? []
          : buildRetailScopeVariants(parseRetailScopes(query.data.retailScopes));
      const macroGroupVariants = [...new Set([...atecoVariants, ...retailScopeVariants])];
      const domainFilter = buildDomainFilterByChecklistMode(inspection.checklistMode);
      const templates = await fastify.prisma.documentTemplate.findMany({
        where:
          atecoVariants.length > 0
            ? {
                isActive: true,
                OR: [
                  { isGeneral: true },
                  { atecoCode: { in: atecoVariants } },
                  ...(macroGroupVariants.length > 0 ? [{ macroGroup: { in: macroGroupVariants } }] : []),
                ],
                ...(domainFilter ? { domain: domainFilter } : {}),
              }
            : {
                isActive: true,
                ...(domainFilter ? { domain: domainFilter } : {}),
              },
        orderBy: [{ isRequired: "desc" }, { name: "asc" }],
      });

      const existingByName = new Map(inspection.documents.map((doc) => [doc.name.toLowerCase(), doc]));

      return templates.map((template) => {
        const existing = existingByName.get(template.name.toLowerCase());
        return {
          documentTemplateId: template.id,
          name: template.name,
          isRequired: template.isRequired,
          status: existing?.status ?? InspectionDocumentStatus.not_available,
          note: existing?.note ?? "",
        };
      });
    },
  );

  fastify.put(
    "/inspections/:id/documents",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      const parsed = upsertDocumentsSchema.safeParse(request.body);

      if (!params.success || !parsed.success) {
        return reply.badRequest("Payload documenti non valido.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({ where: { id: params.data.id } });
      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      if (inspection.status === "validated") {
        return reply.conflict("Sopralluogo validato: documenti non modificabili.");
      }

      for (const doc of parsed.data.documents) {
        await fastify.prisma.inspectionDocument.upsert({
          where: {
            inspectionId_name: {
              inspectionId: params.data.id,
              name: doc.name,
            },
          },
          update: {
            status: doc.status,
            note: doc.note,
            documentTemplateId: doc.documentTemplateId,
          },
          create: {
            inspectionId: params.data.id,
            name: doc.name,
            status: doc.status,
            note: doc.note,
            documentTemplateId: doc.documentTemplateId,
          },
        });
      }

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth.sub,
        action: "inspection.documents.upsert",
        entityType: "inspection",
        entityId: params.data.id,
        data: { documentsCount: parsed.data.documents.length },
      });

      return {
        inspectionId: params.data.id,
        documentsSaved: parsed.data.documents.length,
      };
    },
  );

  fastify.post(
    "/inspections",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = createInspectionSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload sopralluogo non valido.");
      }

      const auth = request.user;
      if (!auth.sub) return reply.unauthorized("JWT senza subject — login non valido.");

      const created = await fastify.prisma.inspection.create({
        data: {
          companyId: parsed.data.companyId,
          title: parsed.data.title,
          notes: parsed.data.notes,
          checklistMode: parsed.data.checklistMode ?? InspectionChecklistMode.unified,
          happenedAt: parsed.data.happenedAt ? new Date(parsed.data.happenedAt) : undefined,
          authorId: auth.sub,
          status: "draft",
          validatorId: null,
        },
      });

      await writeAudit(fastify, {
        userId: auth.sub,
        action: "inspection.create",
        entityType: "inspection",
        entityId: created.id,
        data: parsed.data,
      });

      return reply.code(201).send(created);
    },
  );

  fastify.post(
    "/inspections/nc",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = addNcSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload non conformita non valido.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({ where: { id: parsed.data.inspectionId } });
      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      if (inspection.status === "validated") {
        return reply.conflict("Il sopralluogo validato e immodificabile.");
      }

      const nc = await fastify.prisma.nonConformity.create({
        data: {
          inspectionId: parsed.data.inspectionId,
          title: parsed.data.title,
          description: parsed.data.description,
          isSanctionable: parsed.data.isSanctionable,
          severity: parsed.data.severity,
        },
      });

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth.sub,
        action: "nc.create",
        entityType: "inspection",
        entityId: parsed.data.inspectionId,
        data: parsed.data,
      });

      return reply.code(201).send(nc);
    },
  );

  fastify.post(
    "/inspections/:id/answers",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      const body = submitAnswersSchema.safeParse(request.body);

      if (!params.success || !body.success) {
        return reply.badRequest("Payload risposte checklist non valido.");
      }

      const inspectionId = params.data.id;
      const inspection = await fastify.prisma.inspection.findUnique({ where: { id: inspectionId } });

      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      if (inspection.status === "validated") {
        return reply.conflict("Sopralluogo validato: risposte non modificabili.");
      }

      const checklistItemIds = [...new Set(body.data.answers.map((answer) => answer.checklistItemId))];
      const checklistItems = await fastify.prisma.checklistItem.findMany({
        where: {
          id: { in: checklistItemIds },
        },
      });

      if (checklistItems.length !== checklistItemIds.length) {
        return reply.badRequest("Uno o piu checklistItemId non esistono.");
      }

      const itemById = new Map(checklistItems.map((item) => [item.id, item]));

      for (const answerPayload of body.data.answers) {
        const item = itemById.get(answerPayload.checklistItemId);
        if (!item) {
          continue;
        }

        const answer = await fastify.prisma.inspectionAnswer.upsert({
          where: {
            inspectionId_checklistItemId: {
              inspectionId,
              checklistItemId: answerPayload.checklistItemId,
            },
          },
          update: {
            value: answerPayload.value,
            note: answerPayload.note,
            severity: answerPayload.severity,
            isSanctionable: answerPayload.isSanctionable,
          },
          create: {
            inspectionId,
            checklistItemId: answerPayload.checklistItemId,
            value: answerPayload.value,
            note: answerPayload.note,
            severity: answerPayload.severity,
            isSanctionable: answerPayload.isSanctionable,
          },
        });

        if (answerPayload.value === ChecklistAnswerValue.no) {
          const guidance = getNcGuidance(item.question, item.area);
          const enrichedDescription = composeNcDescription(answerPayload.note, guidance);

          await fastify.prisma.nonConformity.upsert({
            where: {
              answerId: answer.id,
            },
            update: {
              title: item.question,
              description: enrichedDescription,
              severity: answerPayload.severity ?? item.defaultSeverity,
              isSanctionable: answerPayload.isSanctionable ?? item.defaultSanctionable,
            },
            create: {
              inspectionId,
              answerId: answer.id,
              title: item.question,
              description: enrichedDescription,
              severity: answerPayload.severity ?? item.defaultSeverity,
              isSanctionable: answerPayload.isSanctionable ?? item.defaultSanctionable,
            },
          });
        } else {
          await fastify.prisma.nonConformity.deleteMany({
            where: {
              answerId: answer.id,
            },
          });
        }
      }

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth.sub,
        action: "inspection.answers.upsert",
        entityType: "inspection",
        entityId: inspectionId,
        data: {
          answersCount: body.data.answers.length,
        },
      });

      const refreshed = await fastify.prisma.inspection.findUnique({
        where: { id: inspectionId },
        include: {
          nonConformities: true,
          answers: true,
        },
      });

      return {
        inspectionId,
        answersSaved: body.data.answers.length,
        nonConformities: refreshed?.nonConformities ?? [],
      };
    },
  );

  fastify.get(
    "/inspections/:id/report",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({
        where: { id: params.data.id },
        include: {
          company: true,
          author: { select: { id: true, fullName: true, role: true } },
          validator: { select: { id: true, fullName: true, role: true } },
          nonConformities: true,
          documents: true,
          answers: {
            include: {
              checklistItem: {
                select: {
                  question: true,
                  area: true,
                },
              },
            },
          },
        },
      });

      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      return buildInspectionReport(inspection);
    },
  );

  fastify.get(
    "/inspections/:id/summary",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({
        where: { id: params.data.id },
        include: {
          nonConformities: true,
          documents: true,
          answers: true,
        },
      });

      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      const score = computeInspectionComplianceScore(inspection.nonConformities);
      const hasSanctionableNc = inspection.nonConformities.some((nc) => nc.isSanctionable && !nc.isResolved);
      const attestatoEligible = !hasSanctionableNc && score >= config.attestatoMinScore;
      const reason = hasSanctionableNc
        ? "Presenti NC sanzionabili aperte."
        : score < config.attestatoMinScore
          ? `Punteggio insufficiente (${score}/100, soglia minima ${config.attestatoMinScore}).`
          : "Idonea al rilascio attestato.";

      return {
        inspectionId: inspection.id,
        status: inspection.status,
        totals: {
          answers: inspection.answers.length,
          nonConformities: inspection.nonConformities.length,
          sanctionableNc: inspection.nonConformities.filter((nc) => nc.isSanctionable).length,
          requestedDocuments: inspection.documents.filter((doc) => doc.status === "requested_later").length,
        },
        score,
        stars: starsFromScore(score),
        attestato: {
          eligible: attestatoEligible,
          reason,
          minScore: config.attestatoMinScore,
        },
      };
    },
  );

  fastify.post(
    "/inspections/:id/checklist/pdf",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const auth = request.user;
      try {
        const generated = await generateInspectionChecklistPdf(fastify, params.data.id, auth.sub);
        await writeAudit(fastify, {
          userId: auth.sub,
          action: "inspection.checklist.pdf.generate",
          entityType: "inspection",
          entityId: params.data.id,
          data: { documentId: generated.id },
        });
        return generated;
      } catch (error) {
        return reply.badRequest(
          error instanceof Error ? error.message : "Generazione checklist PDF non riuscita.",
        );
      }
    },
  );

  fastify.post(
    "/inspections/:id/report/pdf",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const auth = request.user;
      try {
        const generated = await generateInspectionReportPdf(fastify, params.data.id, auth.sub);
        await writeAudit(fastify, {
          userId: auth.sub,
          action: "inspection.report.pdf.generate",
          entityType: "inspection",
          entityId: params.data.id,
          data: { documentId: generated.id },
        });
        return generated;
      } catch (error) {
        return reply.badRequest(error instanceof Error ? error.message : "Generazione PDF non riuscita.");
      }
    },
  );

  fastify.post(
    "/inspections/:id/attestato/pdf",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const auth = request.user;
      try {
        const generated = await generateAttestatoPdf(fastify, params.data.id, auth.sub);
        await writeAudit(fastify, {
          userId: auth.sub,
          action: "inspection.attestato.pdf.generate",
          entityType: "inspection",
          entityId: params.data.id,
          data: { documentId: generated.id },
        });
        return generated;
      } catch (error) {
        return reply.badRequest(error instanceof Error ? error.message : "Generazione attestato non riuscita.");
      }
    },
  );

  fastify.get(
    "/inspections/:id/documents",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      return listDocuments(fastify, { inspectionId: params.data.id });
    },
  );

  fastify.post(
    "/inspections/:id/send-to-admin",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({ where: { id: params.data.id } });
      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      const updated = await fastify.prisma.inspection.update({
        where: { id: params.data.id },
        data: { sentToAdminAt: new Date() },
      });

      const auth = request.user;
      await writeAudit(fastify, {
        userId: auth.sub,
        action: "inspection.send_to_admin",
        entityType: "inspection",
        entityId: params.data.id,
      });

      return updated;
    },
  );

  fastify.post(
    "/inspections/validate",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = validateInspectionSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest("Payload validazione non valido.");
      }

      const auth = request.user;
      if (auth.role === UserRole.junior) {
        return reply.forbidden("Un utente junior non puo validare sopralluoghi.");
      }

      const inspection = await fastify.prisma.inspection.findUnique({ where: { id: parsed.data.inspectionId } });
      if (!inspection) {
        return reply.notFound("Sopralluogo non trovato.");
      }

      if (inspection.status === "validated") {
        return reply.conflict("Sopralluogo gia validato.");
      }

      const status = parsed.data.approved ? "validated" : "draft";
      const updated = await fastify.prisma.inspection.update({
        where: { id: parsed.data.inspectionId },
        data: {
          status,
          validatorId: parsed.data.approved ? auth.sub : null,
          finalizedAt: parsed.data.approved ? inspection.finalizedAt ?? new Date() : null,
          notes: parsed.data.notes
            ? `${inspection.notes ?? ""}\n[VALIDATION NOTE] ${parsed.data.notes}`.trim()
            : inspection.notes,
        },
      });

      await writeAudit(fastify, {
        userId: auth.sub,
        action: parsed.data.approved ? "inspection.validate" : "inspection.reject",
        entityType: "inspection",
        entityId: inspection.id,
        data: parsed.data,
      });

      return updated;
    },
  );
};

export default inspectionRoutes;
