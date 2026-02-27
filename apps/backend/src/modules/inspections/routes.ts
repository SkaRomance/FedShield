import {
  ChecklistAnswerValue,
  ComplianceDomain,
  InspectionChecklistMode,
  InspectionDocumentStatus,
  UserRole,
} from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import {
  generateAttestatoPdf,
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

function buildAtecoVariants(atecoCode?: string | null) {
  if (!atecoCode) {
    return [];
  }

  const normalized = atecoCode.trim();
  const parts = normalized.split(".");
  const variants = new Set<string>([normalized]);

  if (parts.length >= 2) {
    variants.add(`${parts[0]}.${parts[1]}`);
  }

  if (parts.length >= 1) {
    variants.add(parts[0]);
  }

  if (parts[0] === "56") {
    variants.add("HO.RE.CA");
    variants.add("HORECA");
  }

  return [...variants];
}

function buildDomainFilterByChecklistMode(checklistMode: InspectionChecklistMode) {
  if (checklistMode === InspectionChecklistMode.unified) {
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

const inspectionRoutes: FastifyPluginAsync = async (fastify) => {
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
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
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
      const domainFilter = buildDomainFilterByChecklistMode(inspection.checklistMode);
      const templates = await fastify.prisma.documentTemplate.findMany({
        where:
          atecoVariants.length > 0
            ? {
                isActive: true,
                OR: [
                  { isGeneral: true },
                  { atecoCode: { in: atecoVariants } },
                  { macroGroup: { in: atecoVariants } },
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

      const auth = request.user as { sub?: string };
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

      const auth = request.user as { sub: string; role: UserRole };

      const created = await fastify.prisma.inspection.create({
        data: {
          companyId: parsed.data.companyId,
          title: parsed.data.title,
          notes: parsed.data.notes,
          checklistMode: parsed.data.checklistMode ?? InspectionChecklistMode.unified,
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

      const auth = request.user as { sub?: string };
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

      const auth = request.user as { sub?: string };
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
    "/inspections/:id/report/pdf",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const params = z.object({ id: z.string().min(1) }).safeParse(request.params);
      if (!params.success) {
        return reply.badRequest("ID sopralluogo non valido.");
      }

      const auth = request.user as { sub?: string };
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

      const auth = request.user as { sub?: string };
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

      const auth = request.user as { sub?: string };
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

      const auth = request.user as { sub: string; role: UserRole };
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
