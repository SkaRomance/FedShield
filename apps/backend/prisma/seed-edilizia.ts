import { prisma } from "./_client.js";

const LEGACY_EDILIZIA_TEMPLATE_IDS = [
  "edilizia-premises-template-seed",
  "edilizia-procedures-template-seed",
];

export async function seedEdilizia() {
  console.log("Seeding checklist Edilizia legacy...");

  await prisma.checklistTemplate.updateMany({
    where: { id: { in: LEGACY_EDILIZIA_TEMPLATE_IDS } },
    data: {
      isActive: false,
      description:
        "Template legacy disattivato: usare le checklist verticali edilizia/costruzioni in seed-macrosettori.",
    },
  });

  console.log("Seed Edilizia legacy completato: template monolitici disattivati se presenti.");
}
