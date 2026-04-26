// Seed minimo idempotente di baseline per i test backend.
//
// I test legacy assumono almeno:
//   - 3 utenti (junior/senior/admin) → seed-users.ts
//   - 1 azienda + 1 checklist template + 1 item + 1 document template
//   - HoReCa (per pastry-split.test e horeca-completeness.test):
//     ATECO 56.10.x con template haccp_only/safety_only e documenti
//
// Lo script è separato da seed.ts (full domain seed, attualmente broken
// su seed-metalmeccanico per enum mismatch). Riusa seed-checklist.ts per
// il dominio HoReCa, che è funzionante.

import { seedChecklistTemplates, seedHoreca } from "./seed-checklist.js";
import { prisma, disconnectPrisma } from "./_client.js";

const COMPANY_ID = "test-baseline-company";
const TEMPLATE_ID = "test-baseline-template";
const ITEM_ID = "test-baseline-item";
const DOC_TEMPLATE_ID = "test-baseline-doc";

async function main() {
  await prisma.company.upsert({
    where: { id: COMPANY_ID },
    update: {},
    create: {
      id: COMPANY_ID,
      name: "Azienda Test Baseline",
      vatNumber: "00000000000",
      atecoCode: "01.11",
      legalAddress: "Via Test 1, 00100 Roma",
    },
  });

  await prisma.checklistTemplate.upsert({
    where: { id: TEMPLATE_ID },
    update: {},
    create: {
      id: TEMPLATE_ID,
      name: "Template baseline test",
      description: "Template minimo per garantire integrità test legacy",
      isGeneral: true,
      isActive: true,
    },
  });

  await prisma.checklistItem.upsert({
    where: { id: ITEM_ID },
    update: {},
    create: {
      id: ITEM_ID,
      templateId: TEMPLATE_ID,
      section: "premises_equipment",
      domain: "both",
      area: "Generale",
      question: "Domanda baseline test",
      orderIndex: 1,
      isRequired: true,
      defaultSeverity: 1,
      defaultSanctionable: false,
    },
  });

  await prisma.documentTemplate.upsert({
    where: { id: DOC_TEMPLATE_ID },
    update: {},
    create: {
      id: DOC_TEMPLATE_ID,
      name: "Documento baseline test",
      domain: "both",
      isGeneral: true,
      isRequired: true,
      isActive: true,
    },
  });

  await seedChecklistTemplates();
  await seedHoreca();

  console.log("✓ baseline test data seeded (company, template, item, doc, HoReCa)");
}

main()
  .catch((err) => {
    console.error("seed-test-baseline failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectPrisma();
  });
