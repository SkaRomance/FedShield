import { FastifyPluginAsync } from "fastify";

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/health", async () => ({ status: "ok", service: "fedshield-backend" }));
};

export default healthRoutes;
