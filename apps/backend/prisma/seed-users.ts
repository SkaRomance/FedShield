// Seed idempotente degli utenti di test/dev.
//
// I test backend (`checklists.test.ts`, `quotes.test.ts`, ...) effettuano
// login reale via /api/auth/login con credenziali fisse, quindi gli utenti
// devono esistere nel DB prima dell'esecuzione. Questo script li garantisce
// con un upsert + hash argon2id (PRD NF-03 compliant).
//
// Uso:
//   pnpm db:seed:users
// Idempotente: rieseguibile in sicurezza. Aggiorna sempre l'hash password
// (utile dopo rotazione chiavi o cambio algoritmo).

import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

// Password unificata per dev/test. Combacia con quella usata nei test
// legacy (`junior/senior/admin` tutti con fedshield123) — non usare in
// production.
const DEV_PASSWORD = "fedshield123";

async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, {
    type: argon2.argon2id,
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1,
  });
}

async function upsertUser(params: {
  email: string;
  password: string;
  fullName: string;
  role: "junior" | "senior" | "admin";
}) {
  const passwordHash = await hashPassword(params.password);
  const user = await prisma.user.upsert({
    where: { email: params.email },
    update: { passwordHash, fullName: params.fullName, role: params.role },
    create: {
      email: params.email,
      passwordHash,
      fullName: params.fullName,
      role: params.role,
    },
  });
  return user;
}

async function main() {
  const users = [
    {
      email: "junior@fedshield.local",
      password: DEV_PASSWORD,
      fullName: "Consulente Junior",
      role: "junior" as const,
    },
    {
      email: "senior@fedshield.local",
      password: DEV_PASSWORD,
      fullName: "Consulente Senior",
      role: "senior" as const,
    },
    {
      email: "admin@fedshield.local",
      password: DEV_PASSWORD,
      fullName: "Admin FedShield",
      role: "admin" as const,
    },
  ];

  for (const u of users) {
    const result = await upsertUser(u);
    console.log(`✓ ${result.email} (${result.role})`);
  }
}

main()
  .catch((err) => {
    console.error("seed-users failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
