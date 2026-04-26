import { seedChecklistTemplates, seedHoreca } from "./seed-checklist.js";
import { seedEdilizia } from "./seed-edilizia.js";
import { seedTrainingData } from "./seed-training.js";
import { seedMetalmeccanico } from "./seed-metalmeccanico.js";
import { seedUffici } from "./seed-uffici.js";
import { seedSanita } from "./seed-sanita.js";
import { seedAgricoltura } from "./seed-agricoltura.js";
import { disconnectPrisma } from "./_client.js";

async function main() {
  // S9 (HIGH-01 mitigation): i seed verticali (metalmeccanico/sanita/uffici/
  // agricoltura) eseguono prisma.trainingCourse.deleteMany scoped per
  // idempotenza. Lo schema ha onDelete: Cascade su EmployeeTrainingRecord,
  // quindi un seed accidentale in production cancellerebbe tutte le
  // certificazioni dei dipendenti collegate a quei corsi. Refuse.
  if (process.env.NODE_ENV === "production" && !process.env.FEDSHIELD_ALLOW_PROD_SEED) {
    throw new Error(
      "Refuse to run domain seed in production: i seed verticali fanno cascade delete su EmployeeTrainingRecord. " +
      "Set FEDSHIELD_ALLOW_PROD_SEED=1 per override esplicito.",
    );
  }

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
    await disconnectPrisma();
  });
