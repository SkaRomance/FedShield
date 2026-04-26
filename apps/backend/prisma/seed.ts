import { PrismaClient } from "@prisma/client";
import { seedChecklistTemplates, seedHoreca } from "./seed-checklist.js";
import { seedEdilizia } from "./seed-edilizia.js";
import { seedTrainingData } from "./seed-training.js";
import { seedMetalmeccanico } from "./seed-metalmeccanico.js";
import { seedUffici } from "./seed-uffici.js";
import { seedSanita } from "./seed-sanita.js";
import { seedAgricoltura } from "./seed-agricoltura.js";

const prisma = new PrismaClient();

async function main() {
  await seedChecklistTemplates();
  await seedHoreca();
  await seedEdilizia();
  await seedTrainingData();
  await seedMetalmeccanico();
  await seedUffici();
  await seedSanita();
  await seedAgricoltura();

  console.log("Seeding completed successfully!");
}

main()
  .catch((error) => {
    console.error("Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
