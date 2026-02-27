import assert from "node:assert/strict";
import { buildApp } from "../app.js";

type ChecklistItemLite = {
  id: string;
  area: string;
  question: string;
  section: "premises_equipment" | "procedures_hygiene";
  orderIndex: number;
  domain?: "haccp" | "safety" | "both";
  defaultSeverity: number;
};

type DocumentTemplateLite = {
  id: string;
  name: string;
  macroGroup?: string | null;
  domain?: "haccp" | "safety" | "both";
};

type HorecaQualityConfig = {
  ateco: string;
  templateKeyword: string;
  macroGroup: string;
  minimumCategoryDocs: number;
  premisesCoverageMustContain: string[];
  procedureCoverageMustContain: string[];
  documentKeywordsMustContain: string[];
};

async function run() {
  const app = buildApp();

  const login = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: {
      email: "senior@fedshield.local",
      password: "fedshield123",
    },
  });

  assert.equal(login.statusCode, 200);
  const { token } = login.json();
  const headers = { authorization: `Bearer ${token}` };

  const categories: HorecaQualityConfig[] = [
    {
      ateco: "56.10.11",
      templateKeyword: "Ristorante",
      macroGroup: "RISTORANTI",
      minimumCategoryDocs: 15,
      premisesCoverageMustContain: ["Impianti", "Attrezzature", "Stoccaggio", "Infestanti"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Rintracciabilita", "Pulizie", "CCP"],
      documentKeywordsMustContain: ["HACCP", "allergen", "tracciabil", "sanific", "MOCA"],
    },
    {
      ateco: "56.30",
      templateKeyword: "Bar",
      macroGroup: "BAR",
      minimumCategoryDocs: 15,
      premisesCoverageMustContain: ["Impianti", "Attrezzature", "Stoccaggio", "Infestanti"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Rintracciabilita", "Pulizie", "CCP"],
      documentKeywordsMustContain: ["HACCP", "allergen", "tracciabil", "spillatura", "MOCA"],
    },
    {
      ateco: "55.10.00",
      templateKeyword: "Hotel",
      macroGroup: "HOTEL",
      minimumCategoryDocs: 15,
      premisesCoverageMustContain: ["Impianti", "Sicurezza antincendio", "Attrezzature", "Legionella"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Pulizie", "Legionella", "Sicurezza lavoro"],
      documentKeywordsMustContain: ["HACCP", "antincendio", "allergen", "Legionella", "infestanti"],
    },
    {
      ateco: "56.10.30",
      templateKeyword: "Pasticceria/Gelateria",
      macroGroup: "PASTICCERIA_GELATERIA",
      minimumCategoryDocs: 18,
      premisesCoverageMustContain: ["Impianti", "Attrezzature", "Stoccaggio", "MOCA", "Infestanti"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Rintracciabilita", "Shelf-life", "CCP"],
      documentKeywordsMustContain: ["HACCP", "allergen", "tracciabil", "MOCA", "shelf-life"],
    },
    {
      ateco: "56.10.20",
      templateKeyword: "Pizzeria/Asporto",
      macroGroup: "PIZZERIA_ASPORTO",
      minimumCategoryDocs: 13,
      premisesCoverageMustContain: ["Impianti", "Attrezzature", "Consegna", "MOCA", "Infestanti"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Rintracciabilita", "Consegna", "CCP"],
      documentKeywordsMustContain: ["HACCP", "allergen", "tracciabil", "asporto", "MOCA"],
    },
    {
      ateco: "56.29.10",
      templateKeyword: "Mense/Catering",
      macroGroup: "MENSE_CATERING",
      minimumCategoryDocs: 13,
      premisesCoverageMustContain: ["Impianti", "Attrezzature", "Distribuzione pasti", "Trasporto pasti", "MOCA"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Rintracciabilita", "Trasporto pasti", "CCP"],
      documentKeywordsMustContain: ["HACCP", "allergen", "tracciabil", "trasporto pasti", "MOCA"],
    },
    {
      ateco: "56.21.00",
      templateKeyword: "Catering Eventi",
      macroGroup: "CATERING_EVENTI",
      minimumCategoryDocs: 13,
      premisesCoverageMustContain: ["Impianti", "Attrezzature", "Trasporto pasti", "Allestimento evento", "MOCA"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Rintracciabilita", "Trasporto pasti", "CCP"],
      documentKeywordsMustContain: ["HACCP", "allergen", "tracciabil", "evento", "MOCA"],
    },
  ];

  for (const category of categories) {
    const templatesRes = await app.inject({
      method: "GET",
      url: `/api/checklists/templates?atecoCode=${encodeURIComponent(category.ateco)}&checklistMode=unified`,
      headers,
    });
    assert.equal(templatesRes.statusCode, 200, `Templates request failed for ${category.ateco}`);
    const templates = templatesRes.json() as Array<{ id: string; name: string }>;
    const specificTemplates = templates.filter((template) => template.name.includes(category.templateKeyword));
    assert.equal(
      specificTemplates.length,
      2,
      `Expected 2 specific templates for ${category.ateco}, found ${specificTemplates.length}`,
    );

    let premisesItems: ChecklistItemLite[] = [];
    let procedureItems: ChecklistItemLite[] = [];
    for (const template of specificTemplates) {
      const itemsRes = await app.inject({
        method: "GET",
        url: `/api/checklists/templates/${template.id}/items?checklistMode=unified`,
        headers,
      });
      assert.equal(itemsRes.statusCode, 200);
      const items = itemsRes.json().items as ChecklistItemLite[];
      assert.ok(items.length >= 25, `Template ${template.id} has less than 25 items`);

      const indices = items.map((item) => item.orderIndex).sort((a, b) => a - b);
      assert.equal(indices[0], 1, `Template ${template.id} does not start from orderIndex 1`);
      assert.equal(indices[indices.length - 1], 25, `Template ${template.id} does not end at orderIndex 25`);

      for (let i = 1; i <= 25; i += 1) {
        assert.ok(indices.includes(i), `Template ${template.id} missing orderIndex ${i}`);
      }

      for (const item of items) {
        assert.ok(item.defaultSeverity >= 1 && item.defaultSeverity <= 4, `Invalid severity in ${template.id}`);
      }

      if (items[0]?.section === "premises_equipment") {
        premisesItems = items;
      } else {
        procedureItems = items;
      }
    }

    assert.equal(premisesItems.length, 25, `Premises items mismatch for ${category.ateco}`);
    assert.equal(procedureItems.length, 25, `Procedure items mismatch for ${category.ateco}`);

    const premisesCoverageText = premisesItems
      .map((item) => `${item.area} ${item.question}`.toLowerCase())
      .join(" | ");
    const procedureCoverageText = procedureItems
      .map((item) => `${item.area} ${item.question}`.toLowerCase())
      .join(" | ");

    for (const token of category.premisesCoverageMustContain) {
      const needle = token.toLowerCase();
      assert.ok(premisesCoverageText.includes(needle), `Missing premises coverage "${token}" for ${category.ateco}`);
    }
    for (const token of category.procedureCoverageMustContain) {
      const needle = token.toLowerCase();
      assert.ok(procedureCoverageText.includes(needle), `Missing procedure coverage "${token}" for ${category.ateco}`);
    }

    const docsRes = await app.inject({
      method: "GET",
      url: `/api/checklists/document-templates?atecoCode=${encodeURIComponent(category.ateco)}&checklistMode=unified`,
      headers,
    });
    assert.equal(docsRes.statusCode, 200);
    const docs = docsRes.json() as DocumentTemplateLite[];
    const categoryDocs = docs.filter((doc) => doc.macroGroup === category.macroGroup);
    assert.ok(
      categoryDocs.length >= category.minimumCategoryDocs,
      `Insufficient docs for ${category.ateco}: ${categoryDocs.length}`,
    );

    const docsText = categoryDocs.map((doc) => doc.name.toLowerCase()).join(" | ");
    for (const keyword of category.documentKeywordsMustContain) {
      assert.ok(
        docsText.includes(keyword.toLowerCase()),
        `Missing document keyword "${keyword}" for ${category.ateco}`,
      );
    }
  }

  console.log("HoReCa completeness test passed");
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
