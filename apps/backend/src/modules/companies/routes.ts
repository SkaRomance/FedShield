import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
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

const companyRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/companies",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const role = (request.user as { role?: string })?.role;
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
      const auth = request.user as { sub?: string };

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
      const auth = request.user as { sub?: string };

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
};

export default companyRoutes;
