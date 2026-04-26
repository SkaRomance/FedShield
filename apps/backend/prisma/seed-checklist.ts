import { ChecklistSection, ComplianceDomain } from "@prisma/client";
import { prisma } from "./_client.js";

export async function seedChecklistTemplates() {
  // Crea il template generico se manca, altrimenti aggiorna
  const generic = await prisma.checklistTemplate.upsert({
    where: { id: "tmpl-generic-v1" },
    update: { name: "Checklist Generica", description: "Checklist di base applicabile a tutte le aziende.", isGeneral: true, isActive: true },
    create: {
      id: "tmpl-generic-v1",
      name: "Checklist Generica",
      description: "Checklist di base applicabile a tutte le aziende.",
      isGeneral: true,
      isActive: true,
    },
  });

  // Se il template e appena creato (non c'era), seeda gli item
  const existingCount = await prisma.checklistItem.count({ where: { templateId: generic.id } });
  if (existingCount === 0) {
    const items = [
      { orderIndex: 1, section: ChecklistSection.premises_equipment, domain: ComplianceDomain.safety, area: "Locali e strutture", defaultSeverity: 2, defaultSanctionable: false, question: "I locali sono puliti, ordinati e privi di ostacoli che possano favorire inciampi o cadute?" },
      { orderIndex: 2, section: ChecklistSection.premises_equipment, domain: ComplianceDomain.safety, area: "Locali e strutture", defaultSeverity: 3, defaultSanctionable: true, question: "Le scale, i corridoi e le uscite di sicurezza sono sgombre, illuminate e segnalate?" },
      { orderIndex: 3, section: ChecklistSection.procedures_hygiene, domain: ComplianceDomain.both, area: "Procedure e igiene", defaultSeverity: 3, defaultSanctionable: true, question: "Sono presenti e aggiornate le procedure operative per la gestione della sicurezza e dell'igiene?" },
      { orderIndex: 4, section: ChecklistSection.procedures_hygiene, domain: ComplianceDomain.both, area: "Procedure e igiene", defaultSeverity: 2, defaultSanctionable: false, question: "Il personale e formato sulla corretta igiene delle mani e sull'uso dei DPI?" },
    ];
    await prisma.checklistItem.createMany({
      data: items.map((i) => ({ ...i, templateId: generic.id })),
    });
  }

  console.log("Seed checklist generici completato.");
}

// S7: il seed HoReCa monolitico è ora in seed-horeca.ts. Re-export per
// mantenere la API esistente (seed.ts e seed-test-baseline.ts importano
// seedHoreca da qui).
export { seedHoreca } from "./seed-horeca.js";
