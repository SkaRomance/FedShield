import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
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

export function buildApp() {
  const app = Fastify({ logger: true });

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
  app.register(licensingRoutes, { prefix: "/api" });
  app.register(checklistRoutes, { prefix: "/api" });
  app.register(inspectionRoutes, { prefix: "/api" });
  app.register(quotesRoutes, { prefix: "/api" });
  app.register(kpiRoutes, { prefix: "/api" });
  app.register(odvRoutes, { prefix: "/api" });
  app.register(syncRoutes, { prefix: "/api" });

  return app;
}
