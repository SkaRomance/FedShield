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
    {
      ateco: "93.13",
      macroGroup: "SPORT_FITNESS",
      expectedTemplate: "Sport, Fitness e Piscine",
      expectedText: ["Defibrillatore", "Legionellosi", "fitness"],
      minDocs: 6,
    },
    {
      ateco: "49.32",
      macroGroup: "TRASPORTO_PERSONE",
      expectedTemplate: "Trasporto Persone",
      expectedText: ["Alcol", "veicoli", "guida"],
      minDocs: 6,
    },
    {
      ateco: "16.23",
      macroGroup: "FALEGNAMERIA_LEGNO",
      expectedTemplate: "Falegnameria",
      expectedText: ["Polveri", "aspirazione", "circolari"],
      minDocs: 6,
    },
    {
      ateco: "41.20",
      macroGroup: "EDILIZIA",
      expectedTemplate: "Edilizia",
      expectedText: ["Ponteggi", "DPI", "cadute"],
      minDocs: 6,
    },
    {
      ateco: "25.62",
      macroGroup: "metalmechanics",
      expectedTemplate: "Metalmeccanico",
      expectedText: ["Macchine", "saldatura", "DPI"],
      minDocs: 6,
    },
    {
      ateco: "86.21",
      macroGroup: "healthcare",
      expectedTemplate: "Sanita",
      expectedText: ["locali", "biologico", "DPI"],
      minDocs: 6,
    },
    {
      ateco: "62.01",
      macroGroup: "office-it",
      expectedTemplate: "Uffici",
      expectedText: ["postazioni", "ergonomia", "emergenza"],
      minDocs: 6,
    },
    {
      ateco: "01.11",
      macroGroup: "agriculture",
      expectedTemplate: "Agricoltura",
      expectedText: ["Trattori", "fitosanitari", "sicurezza"],
      minDocs: 6,
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

  const foodRetailResponse = await app.inject({
    method: "GET",
    url: "/api/checklists/templates?atecoCode=47.21&checklistMode=unified",
    headers,
  });
  assert.equal(foodRetailResponse.statusCode, 200);
  const foodRetailTemplates = foodRetailResponse.json() as Array<{ macroGroup?: string | null }>;
  assert.equal(
    foodRetailTemplates.some((template) => template.macroGroup === "COMMERCIO_NON_FOOD"),
    false,
    "Food retail (47.21) must not receive non-food retail checklist",
  );

  // =========================================================================
  // Deep verification ATECO 47.71 (Commercio al Dettaglio Non Alimentare / Negozi Abbigliamento)
  // =========================================================================
  const retailNonFoodVariants = [
    "47.71",
    "47.71.1",
    "47.71.2",
    "47.72",
    "47.5",
    "47.7",
    "4771",
    "477110",
    "COMMERCIO_NON_FOOD",
    "COMMERCIO_NON_ALIMENTARE",
    "RETAIL_NON_FOOD",
  ];

  for (const variant of retailNonFoodVariants) {
    // 1. Unified mode: template + document templates
    const unifiedTmplRes = await app.inject({
      method: "GET",
      url: `/api/checklists/templates?atecoCode=${encodeURIComponent(variant)}&checklistMode=unified`,
      headers,
    });
    assert.equal(unifiedTmplRes.statusCode, 200, `Unified template request failed for variant ${variant}`);
    const unifiedTemplates = unifiedTmplRes.json() as Array<{ id: string; name: string; macroGroup?: string | null }>;
    const unifiedMatch = unifiedTemplates.find((t) => t.macroGroup === "COMMERCIO_NON_FOOD");
    assert.ok(unifiedMatch, `Missing COMMERCIO_NON_FOOD template in unified mode for variant ${variant}`);

    const unifiedDocsRes = await app.inject({
      method: "GET",
      url: `/api/checklists/document-templates?atecoCode=${encodeURIComponent(variant)}&checklistMode=unified`,
      headers,
    });
    assert.equal(unifiedDocsRes.statusCode, 200, `Unified doc template request failed for variant ${variant}`);
    const unifiedDocs = unifiedDocsRes.json() as Array<{ name: string; macroGroup?: string | null }>;
    const unifiedNonFoodDocs = unifiedDocs.filter((d) => d.macroGroup === "COMMERCIO_NON_FOOD");
    assert.ok(
      unifiedNonFoodDocs.length >= 6,
      `Expected >= 6 non-food docs in unified mode for variant ${variant}, found ${unifiedNonFoodDocs.length}`,
    );

    // 2. Safety_only mode: template + document templates
    const safetyTmplRes = await app.inject({
      method: "GET",
      url: `/api/checklists/templates?atecoCode=${encodeURIComponent(variant)}&checklistMode=safety_only`,
      headers,
    });
    assert.equal(safetyTmplRes.statusCode, 200, `Safety_only template request failed for variant ${variant}`);
    const safetyTemplates = safetyTmplRes.json() as Array<{ id: string; name: string; macroGroup?: string | null }>;
    const safetyMatch = safetyTemplates.find((t) => t.macroGroup === "COMMERCIO_NON_FOOD");
    assert.ok(safetyMatch, `Missing COMMERCIO_NON_FOOD template in safety_only mode for variant ${variant}`);

    const safetyDocsRes = await app.inject({
      method: "GET",
      url: `/api/checklists/document-templates?atecoCode=${encodeURIComponent(variant)}&checklistMode=safety_only`,
      headers,
    });
    assert.equal(safetyDocsRes.statusCode, 200, `Safety_only doc template request failed for variant ${variant}`);
    const safetyDocs = safetyDocsRes.json() as Array<{ name: string; macroGroup?: string | null }>;
    const safetyNonFoodDocs = safetyDocs.filter((d) => d.macroGroup === "COMMERCIO_NON_FOOD");
    assert.ok(
      safetyNonFoodDocs.length >= 6,
      `Expected >= 6 non-food docs in safety_only mode for variant ${variant}, found ${safetyNonFoodDocs.length}`,
    );
  }

  // 3. Specialist items verification on template items
  const nonFoodTmpl = (
    await app.inject({
      method: "GET",
      url: `/api/checklists/templates?atecoCode=47.71&checklistMode=unified`,
      headers,
    })
  )
    .json()
    .find((t: { macroGroup?: string | null }) => t.macroGroup === "COMMERCIO_NON_FOOD");
  assert.ok(nonFoodTmpl, "Template COMMERCIO_NON_FOOD non trovato per 47.71");

  const nonFoodItemsRes = await app.inject({
    method: "GET",
    url: `/api/checklists/templates/${nonFoodTmpl.id}/items?checklistMode=unified`,
    headers,
  });
  assert.equal(nonFoodItemsRes.statusCode, 200);
  const nonFoodItems = nonFoodItemsRes.json().items as Array<{ area: string; question: string; normReference?: string }>;
  const fullChecklistText = nonFoodItems
    .map((item) => `${item.area} ${item.question} ${item.normReference ?? ""}`.toLowerCase())
    .join(" | ");

  const requiredSpecialistTokens = [
    "vie d'esodo",
    "scale a castello",
    "parapetti soppalchi",
    "barriera antitaccheggio",
    "pressa compattatrice",
    "16500",
    "vav",
    "videosorveglianza gdpr",
  ];
  for (const token of requiredSpecialistTokens) {
    assert.ok(
      fullChecklistText.includes(token.toLowerCase()),
      `Controlli specialistici non-food privi del requisito: "${token}"`,
    );
  }

  // 4. Verification of required documents
  const nonFoodDocListRes = await app.inject({
    method: "GET",
    url: `/api/checklists/document-templates?atecoCode=47.71&checklistMode=unified`,
    headers,
  });
  assert.equal(nonFoodDocListRes.statusCode, 200);
  const nonFoodDocNames = (nonFoodDocListRes.json() as Array<{ name: string }>)
    .map((doc) => doc.name.toLowerCase())
    .join(" | ");

  const requiredDocTokens = [
    "dvr",
    "piano emergenza",
    "462/01",
    "15635",
    "03/09/2021",
  ];
  for (const docToken of requiredDocTokens) {
    assert.ok(
      nonFoodDocNames.includes(docToken.toLowerCase()),
      `Documenti non-food privi del documento atteso: "${docToken}"`,
    );
  }

  // 5. Creazione azienda di test con ATECO 477110, avvio ispezione e verifica requisiti documentali
  const testCompanyVat = `IT${Date.now().toString().slice(-11)}`;
  const nonFoodCompany = await app.prisma.company.create({
    data: {
      name: "Boutique Abbigliamento & Calzature FedShield Test",
      vatNumber: testCompanyVat,
      atecoCode: "477110",
      legalAddress: "Via del Corso 120, Roma",
    },
  });

  const inspectionRes = await app.inject({
    method: "POST",
    url: "/api/inspections",
    headers,
    payload: {
      companyId: nonFoodCompany.id,
      title: "Sopralluogo Negozio Abbigliamento ATECO 477110 Test",
      checklistMode: "safety_only",
    },
  });
  assert.equal(inspectionRes.statusCode, 201, "Creazione ispezione 477110 fallita");
  const inspectionId = inspectionRes.json().id as string;

  const inspectionDocsRes = await app.inject({
    method: "GET",
    url: `/api/inspections/${inspectionId}/documents/requirements`,
    headers,
  });
  assert.equal(inspectionDocsRes.statusCode, 200, "Recupero requisiti documentali fallito");
  const inspectionDocs = inspectionDocsRes.json() as Array<{ name: string; documentTemplateId: string }>;
  const matchedNonFoodRequirements = inspectionDocs.filter(
    (doc) =>
      doc.name.toLowerCase().includes("commercio") ||
      doc.name.toLowerCase().includes("scaffalature") ||
      doc.name.toLowerCase().includes("antincendio") ||
      doc.name.toLowerCase().includes("462/01") ||
      doc.name.toLowerCase().includes("piano emergenza") ||
      doc.name.toLowerCase().includes("dvr"),
  );
  assert.ok(
    matchedNonFoodRequirements.length >= 5,
    `Attesi almeno 5 requisiti documentali per ATECO 477110, trovati ${matchedNonFoodRequirements.length}`,
  );

    console.log("Macro sectors checklist test passed");
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
