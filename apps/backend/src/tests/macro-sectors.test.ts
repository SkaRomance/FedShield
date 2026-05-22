import assert from "node:assert/strict";
import { buildApp } from "../app.js";

type SectorConfig = {
  ateco: string;
  macroGroup: string;
  expectedTemplate: string;
  expectedText: string[];
  minDocs: number;
};

async function run() {
  const app = buildApp();
  await app.ready();

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

  const sectors: SectorConfig[] = [
    {
      ateco: "47.71",
      macroGroup: "COMMERCIO_NON_FOOD",
      expectedTemplate: "Commercio Non Food",
      expectedText: ["Scaffalature", "Privacy", "Antincendio"],
      minDocs: 6,
    },
    {
      ateco: "52.10",
      macroGroup: "LOGISTICA_MAGAZZINO",
      expectedTemplate: "Logistica e Magazzino",
      expectedText: ["Carrelli elevatori", "Baie di carico", "DUVRI"],
      minDocs: 6,
    },
    {
      ateco: "81.21",
      macroGroup: "PULIZIE_SANIFICAZIONE",
      expectedTemplate: "Pulizie e Sanificazione",
      expectedText: ["Prodotti chimici", "DUVRI", "sanificazione"],
      minDocs: 6,
    },
    {
      ateco: "96.02",
      macroGroup: "SERVIZI_PERSONA",
      expectedTemplate: "Servizi alla Persona",
      expectedText: ["Igiene strumenti", "Cosmetici", "Privacy"],
      minDocs: 6,
    },
    {
      ateco: "85.59",
      macroGroup: "ISTRUZIONE_FORMAZIONE",
      expectedTemplate: "Istruzione e Formazione",
      expectedText: ["Aule", "Privacy minori", "Laboratori"],
      minDocs: 6,
    },
    {
      ateco: "45.20",
      macroGroup: "AUTORIPARAZIONE",
      expectedTemplate: "Autoriparazioni",
      expectedText: ["Ponti sollevatori", "Rifiuti", "Gas di scarico"],
      minDocs: 6,
    },
    {
      ateco: "10.71",
      macroGroup: "INDUSTRIA_ALIMENTARE",
      expectedTemplate: "Industria Alimentare",
      expectedText: ["HACCP", "Allergeni", "Catena freddo"],
      minDocs: 8,
    },
  ];

  for (const sector of sectors) {
    const templatesResponse = await app.inject({
      method: "GET",
      url: `/api/checklists/templates?atecoCode=${encodeURIComponent(sector.ateco)}&checklistMode=unified`,
      headers,
    });
    assert.equal(templatesResponse.statusCode, 200, `Template request failed for ${sector.ateco}`);
    const templates = templatesResponse.json() as Array<{ id: string; name: string; macroGroup?: string | null }>;
    const sectorTemplate = templates.find(
      (template) => template.macroGroup === sector.macroGroup && template.name.includes(sector.expectedTemplate),
    );
    assert.ok(sectorTemplate, `Missing macrosector template for ${sector.ateco}`);

    const itemsResponse = await app.inject({
      method: "GET",
      url: `/api/checklists/templates/${sectorTemplate.id}/items?checklistMode=unified`,
      headers,
    });
    assert.equal(itemsResponse.statusCode, 200);
    const items = itemsResponse.json().items as Array<{ area: string; question: string; orderIndex: number }>;
    assert.ok(items.length >= 10, `Too few macrosector items for ${sector.ateco}: ${items.length}`);
    assert.deepEqual(
      items.map((entry) => entry.orderIndex),
      Array.from({ length: items.length }, (_entry, index) => index + 1),
      `Order index gap for ${sector.ateco}`,
    );

    const itemText = items.map((entry) => `${entry.area} ${entry.question}`.toLowerCase()).join(" | ");
    for (const token of sector.expectedText) {
      assert.ok(itemText.includes(token.toLowerCase()), `Missing "${token}" coverage for ${sector.ateco}`);
    }

    const docsResponse = await app.inject({
      method: "GET",
      url: `/api/checklists/document-templates?atecoCode=${encodeURIComponent(sector.ateco)}&checklistMode=unified`,
      headers,
    });
    assert.equal(docsResponse.statusCode, 200);
    const docs = docsResponse.json() as Array<{ name: string; macroGroup?: string | null }>;
    const sectorDocs = docs.filter((doc) => doc.macroGroup === sector.macroGroup);
    assert.ok(sectorDocs.length >= sector.minDocs, `Too few macrosector docs for ${sector.ateco}`);
  }

  const supermarketResponse = await app.inject({
    method: "GET",
    url: "/api/checklists/templates?atecoCode=47.11.2&checklistMode=unified",
    headers,
  });
  assert.equal(supermarketResponse.statusCode, 200);
  const supermarketTemplates = supermarketResponse.json() as Array<{ macroGroup?: string | null }>;
  assert.equal(
    supermarketTemplates.some((template) => template.macroGroup === "COMMERCIO_NON_FOOD"),
    false,
    "Food retail must not receive non-food retail checklist",
  );

  console.log("Macro sectors checklist test passed");
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
