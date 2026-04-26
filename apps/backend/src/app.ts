import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import prismaPlugin from "./plugins/prisma.js";
import authPlugin from "./plugins/auth.js";
import quoteSweeperPlugin from "./plugins/quote-sweeper.js";
import healthRoutes from "./modules/health/routes.js";
import authRoutes from "./modules/auth/routes.js";
import companyRoutes from "./modules/companies/routes.js";
import inspectionRoutes from "./modules/inspections/routes.js";
import checklistRoutes from "./modules/checklists/routes.js";
import quotesRoutes from "./modules/quotes/routes.js";
import kpiRoutes from "./modules/kpi/routes.js";
import odvRoutes from "./modules/odv/routes.js";
import licensingRoutes from "./modules/licensing/routes.js";
import syncRoutes from "./modules/sync/routes.js";
import equipmentRoutes from "./modules/equipment/routes.js";
import employeeRoutes from "./modules/employees/routes.js";
import trainingCourseRoutes from "./modules/training-courses/routes.js";
import normSyncRoutes from "./modules/norm-sync/routes.js";
import notificationsRoutes from "./modules/notifications/routes.js";
import normSyncStatsRoutes from "./modules/norm-sync/stats.js";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(helmet, {
    // Su Electron desktop la maggior parte degli header HTML non si applica;
    // li registriamo lo stesso per pulizia e in vista di un eventuale
    // deploy web del backend.
    contentSecurityPolicy: false, // CSP custom non necessaria per API JSON
  });
  // Rate limit disabilitato in test env: i test legacy fanno centinaia di
  // request rapidi via inject e sforerebbero soglia globale, restituendo
  // 429 invece dei codici di risposta business. In prod/dev rimane attivo.
  if (process.env.NODE_ENV !== "test") {
    app.register(rateLimit, {
      global: true,
      max: 100,
      timeWindow: "1 minute",
      // L'app desktop in dev può sforare facilmente: alziamo un po' la finestra.
      // Override aggressivo su /auth/login configurato a livello di route.
      cache: 10000,
    });
  }
  app.register(cors, {
    origin: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  app.register(sensible);
  app.register(prismaPlugin);
  app.register(authPlugin);
  app.register(quoteSweeperPlugin);

  app.register(healthRoutes, { prefix: "/api" });
  app.register(authRoutes, { prefix: "/api" });
  app.register(companyRoutes, { prefix: "/api" });
  app.register(employeeRoutes, { prefix: "/api" });
  app.register(equipmentRoutes, { prefix: "/api" });
  app.register(trainingCourseRoutes, { prefix: "/api" });
  app.register(normSyncRoutes, { prefix: "/api" });
  app.register(notificationsRoutes, { prefix: "/api" });
  app.register(normSyncStatsRoutes, { prefix: "/api" });
  app.register(licensingRoutes, { prefix: "/api" });
  app.register(checklistRoutes, { prefix: "/api" });
  app.register(inspectionRoutes, { prefix: "/api" });
  app.register(quotesRoutes, { prefix: "/api" });
  app.register(kpiRoutes, { prefix: "/api" });
  app.register(odvRoutes, { prefix: "/api" });
  app.register(syncRoutes, { prefix: "/api" });

  return app;
}
