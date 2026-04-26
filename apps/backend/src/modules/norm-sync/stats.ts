import { FastifyPluginAsync } from "fastify";

const normSyncStatsRoutes: FastifyPluginAsync = async (fastify) => {
  async function requireAdmin(request: any, reply: any) {
    const user = request.user;
    if (user?.role !== "admin") {
      return reply.forbidden("Solo admin.");
    }
  }

  fastify.get(
    "/norm-sync/stats",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async () => {
      const total = await fastify.prisma.normativePatchProposal.count();
      const pending = await fastify.prisma.normativePatchProposal.count({ where: { status: "pending" } });
      const approved = await fastify.prisma.normativePatchProposal.count({ where: { status: "approved" } });
      const rejected = await fastify.prisma.normativePatchProposal.count({ where: { status: "rejected" } });

      const byMonth = await fastify.prisma.normativePatchProposal.groupBy({
        by: ["status"],
        _count: { id: true },
      });

      const recentProposals = await fastify.prisma.normativePatchProposal.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, normTitle: true, normReference: true, changeSummary: true, createdAt: true },
      });

      return {
        totals: { total, pending, approved, rejected },
        byStatus: byMonth.map((g) => ({ status: g.status, count: g._count.id })),
        recentPending: recentProposals,
      };
    },
  );
};

export default normSyncStatsRoutes;
