import { FastifyPluginAsync } from "fastify";
import prismaPlugin from "../../plugins/prisma.js";

interface Alert {
  entityType: "training" | "equipment" | "fireExtinguisher" | "firstAidKit";
  entityId: string;
  title: string;
  description: string;
  dueDate: string | null;
  severity: "red" | "orange" | "yellow";
  daysLeft: number;
}

const notificationsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/notifications/alerts",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { companyId } = request.query as { companyId?: string };

      // companyId assente = scadenze di tutte le aziende seguite. Serve alla
      // campanella in testata, che non ha un'azienda selezionata. (Il modello
      // attuale non ha relation User→Company: tutti i consulenti accedono a
      // tutte le aziende, è strumento interno della società di consulenza.
      // Quando in futuro si introdurrà un filtro ownership a livello User,
      // l'enforcement va aggiunto qui.)
      if (companyId) {
        const company = await fastify.prisma.company.findUnique({
          where: { id: companyId },
          select: { id: true },
        });
        if (!company) {
          return reply.notFound("Azienda non trovata.");
        }
      }

      const filtroAzienda = companyId ? { companyId } : {};

      const alerts: Alert[] = [];
      const now = new Date();
      const RED_DAYS = 0;
      const ORANGE_DAYS = 30;
      const YELLOW_DAYS = 90;

      // 1. Scadenze formazione dipendenti
      const records = await fastify.prisma.employeeTrainingRecord.findMany({
        where: {
          employee: { ...filtroAzienda, isActive: true },
          expiresAt: { not: null },
        },
        include: { employee: true, course: true },
      });

      for (const r of records) {
        if (!r.expiresAt) continue;
        const days = Math.ceil((r.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= YELLOW_DAYS) {
          let severity: Alert["severity"] = "yellow";
          if (days <= ORANGE_DAYS) severity = "orange";
          if (days <= RED_DAYS) severity = "red";
          alerts.push({
            entityType: "training",
            entityId: r.id,
            title: `Formazione: ${r.course.name}`,
            description: `Dipendente ${r.employee.firstName} ${r.employee.lastName} — scade il ${r.expiresAt.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" })}`,
            dueDate: r.expiresAt.toISOString(),
            severity,
            daysLeft: days,
          });
        }
      }

      // 2. Scadenze asset generici
      const equipment = await fastify.prisma.equipment.findMany({
        where: { ...filtroAzienda, status: { in: ["active", "under_maintenance"] } },
      });
      for (const e of equipment) {
        if (!e.nextCheckAt) continue;
        const days = Math.ceil((e.nextCheckAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= YELLOW_DAYS) {
          let severity: Alert["severity"] = "yellow";
          if (days <= ORANGE_DAYS) severity = "orange";
          if (days <= RED_DAYS) severity = "red";
          alerts.push({
            entityType: "equipment",
            entityId: e.id,
            title: `Attrezzatura: ${e.name}`,
            description: `${e.type} — s/n: ${e.serialNumber || "n/d"} — prossimo controllo il ${e.nextCheckAt.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" })}`,
            dueDate: e.nextCheckAt.toISOString(),
            severity,
            daysLeft: days,
          });
        }
      }

      // 3. Estintori
      const extinguishers = await fastify.prisma.fireExtinguisher.findMany({
        where: { ...filtroAzienda, status: { in: ["active", "under_maintenance"] } },
      });
      for (const ex of extinguishers) {
        if (!ex.nextCheckAt) continue;
        const days = Math.ceil((ex.nextCheckAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= YELLOW_DAYS) {
          let severity: Alert["severity"] = "yellow";
          if (days <= ORANGE_DAYS) severity = "orange";
          if (days <= RED_DAYS) severity = "red";
          alerts.push({
            entityType: "fireExtinguisher",
            entityId: ex.id,
            title: `Estintore ${ex.code}: ${ex.capacity ?? ""} ${ex.type}`.trim(),
            description: `Ubicazione: ${ex.location} — prossimo controllo il ${ex.nextCheckAt.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" })}`,
            dueDate: ex.nextCheckAt.toISOString(),
            severity,
            daysLeft: days,
          });
        }
      }

      // 4. Cassette PS
      const kits = await fastify.prisma.firstAidKit.findMany({
        where: { ...filtroAzienda, status: { in: ["active", "under_maintenance"] } },
      });
      for (const k of kits) {
        if (!k.nextCheckAt) continue;
        const days = Math.ceil((k.nextCheckAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= YELLOW_DAYS) {
          let severity: Alert["severity"] = "yellow";
          if (days <= ORANGE_DAYS) severity = "orange";
          if (days <= RED_DAYS) severity = "red";
          alerts.push({
            entityType: "firstAidKit",
            entityId: k.id,
            title: `Cassetta PS — ${k.location}`,
            description: `Prossimo controllo il ${k.nextCheckAt.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" })}`,
            dueDate: k.nextCheckAt.toISOString(),
            severity,
            daysLeft: days,
          });
        }
      }

      // Ordina: prima i più urgenti (giorni rimanenti)
      alerts.sort((a, b) => a.daysLeft - b.daysLeft);

      return {
        alerts,
        summary: {
          red: alerts.filter((a) => a.severity === "red").length,
          orange: alerts.filter((a) => a.severity === "orange").length,
          yellow: alerts.filter((a) => a.severity === "yellow").length,
        },
      };
    },
  );
};

export default notificationsRoutes;
