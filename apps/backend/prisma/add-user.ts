import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@fedshield.local";
  // Allineata alla convention dei test legacy (junior/senior/admin tutti con
  // questa stessa password in dev). Per production cambiare via /auth/* admin.
  const password = "fedshield123";
  const hash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1,
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash },
    create: {
      email,
      passwordHash: hash,
      fullName: "Admin FedShield",
      role: "admin",
    },
  });

  console.log("Utente creato/aggiornato:", {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    password: password,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
