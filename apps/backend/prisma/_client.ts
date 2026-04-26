// Singleton PrismaClient condiviso dai seed scripts (S11, MEDIUM-05).
//
// Pre-refactor: 12 file seed-*.ts istanziavano ognuno un proprio
// `new PrismaClient()` a top-level → 12 connessioni allo stesso DB
// quando `pnpm db:seed` esegue, di cui solo 1 esplicitamente disconnessa.
//
// Post-refactor: 1 sola istanza condivisa via questo modulo. Cleanup
// centralizzato via `disconnectPrisma()` chiamato dagli entry-point
// (`seed.ts`, `seed-users.ts`, `seed-test-baseline.ts`, `add-user.ts`).
//
// **NON IMPORTARE da `apps/backend/src/`** — la backend Fastify usa
// `plugins/prisma.ts` con lifecycle decorato (1 connessione gestita
// dal framework). Questo file è scope seed-only.

import { PrismaClient } from "@prisma/client";

let _instance: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (!_instance) {
    _instance = new PrismaClient();
  }
  return _instance;
}

export const prisma = getPrisma();

export async function disconnectPrisma(): Promise<void> {
  if (_instance) {
    await _instance.$disconnect();
    _instance = null;
  }
}
