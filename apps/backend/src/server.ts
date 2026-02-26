import { buildApp } from "./app.js";
import { config } from "./config.js";

async function main() {
  const app = buildApp();

  try {
    await app.listen({
      host: config.host,
      port: config.port,
    });
    app.log.info(`FedShield backend in ascolto su ${config.host}:${config.port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

main();
