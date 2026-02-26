import fp from "fastify-plugin";
import { config } from "../config.js";
import { processExpiredQuotes } from "../services/quote.service.js";

export default fp(async (fastify) => {
  const intervalMs = Math.max(10, config.quoteSweepSeconds) * 1000;

  const timer = setInterval(async () => {
    try {
      const result = await processExpiredQuotes(fastify);
      if (result.processed > 0) {
        fastify.log.info({ processed: result.processed }, "Quote expiration sweep completato");
      }
    } catch (error) {
      fastify.log.error({ error }, "Errore quote expiration sweep");
    }
  }, intervalMs);

  timer.unref();

  fastify.addHook("onClose", async () => {
    clearInterval(timer);
  });
});
