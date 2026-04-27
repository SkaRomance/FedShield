// apps/backend/scripts/audit-password-hashes.ts
//
// Audit read-only su User.passwordHash: conta gli hash per algoritmo
// (argon2 vs bcrypt vs unknown) e stampa breakdown per role.
//
// Uso:
//   pnpm --filter @fedshield/backend exec tsx scripts/audit-password-hashes.ts
//
// Exit code:
//   0 → tutti argon2 (rimozione bcryptjs SAFE)
//   1 → presenti hash legacy bcrypt o sconosciuti (rimozione NON SAFE)
//
// Read-only: nessuna mutation sul DB.

import { PrismaClient } from "@prisma/client";

type Algo = "argon2" | "bcrypt" | "unknown";

function classify(hash: string): Algo {
  if (hash.startsWith("$argon2")) return "argon2";
  if (/^\$2[aby]\$/.test(hash)) return "bcrypt";
  return "unknown";
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, passwordHash: true },
    });

    const totals: Record<Algo, number> = { argon2: 0, bcrypt: 0, unknown: 0 };
    const byRole: Record<string, Record<Algo, number>> = {};

    for (const u of users) {
      const algo = classify(u.passwordHash);
      totals[algo]++;
      byRole[u.role] ??= { argon2: 0, bcrypt: 0, unknown: 0 };
      byRole[u.role][algo]++;
      if (algo !== "argon2") {
        // Log dettagliato solo per i non-argon2 (utenti che richiedono re-hash)
        console.warn(
          `  legacy: id=${u.id} email=${u.email} role=${u.role} algo=${algo}`,
        );
      }
    }

    console.log("\n=== Password hash audit ===");
    console.log(`Total users:       ${users.length}`);
    console.log(`  argon2:          ${totals.argon2}`);
    console.log(`  bcrypt (legacy): ${totals.bcrypt}`);
    console.log(`  unknown:         ${totals.unknown}`);

    console.log("\n=== Breakdown per role ===");
    for (const [role, c] of Object.entries(byRole).sort()) {
      console.log(
        `  ${role.padEnd(8)}  argon2=${c.argon2}  bcrypt=${c.bcrypt}  unknown=${c.unknown}`,
      );
    }

    const cleanlyMigrated = totals.bcrypt === 0 && totals.unknown === 0;
    if (cleanlyMigrated) {
      console.log("\n[OK] 100% argon2id — SAFE TO REMOVE bcryptjs.");
      process.exit(0);
    } else {
      console.log("\n[FAIL] Hash legacy/unknown ancora presenti — NON rimuovere bcryptjs.");
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("audit-password-hashes failed:", err);
  process.exit(2);
});
