import { execSync } from "node:child_process";

export default async function globalSetup() {
  // Idempotent: seed-users + seed-test-baseline (vedi backend pretest hook).
  // Stesso comando usato da `pnpm test` lato backend, garantisce 3 utenti
  // dev (admin/senior/junior@fedshield.local password fedshield123) e i
  // record minimi per i test legacy. Eseguito 1 volta prima dell'avvio
  // dei browser, prima che webServer parta.
  execSync("pnpm --filter @fedshield/backend db:seed:test", {
    cwd: "../..",
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "test" },
  });
}
