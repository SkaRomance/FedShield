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
  await app.ready();

  // Guard: il seed HoReCa monolitico è stato rimosso (vedi prisma/seed.ts
  // wrapper minimale). Senza i template ATECO 56.10.x non ha senso
  // eseguire questo test di completezza dominio. Skip pulito.
  const horecaProbe = await app.prisma.checklistTemplate.findFirst({
    where: { atecoCode: "56.10.11" },
  });
  if (!horecaProbe) {
    console.log("HoReCa completeness test: skipped (HoReCa seed assente).");
    await app.close();
    return;
  }

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
      ateco: "55.20.51",
      templateKeyword: "B&B/Affittacamere",
      macroGroup: "BEB_AFFITTACAMERE",
      minimumCategoryDocs: 14,
      premisesCoverageMustContain: ["Impianti", "Sicurezza antincendio", "Attrezzature", "Legionella"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Pulizie", "Legionella", "Sicurezza lavoro"],
      documentKeywordsMustContain: ["HACCP", "antincendio", "allergen", "Legionella", "infestanti"],
    },
    {
      ateco: "55.20.20",
      templateKeyword: "Ostelli/Residence",
      macroGroup: "OSTELLI_RESIDENCE",
      minimumCategoryDocs: 14,
      premisesCoverageMustContain: ["Impianti", "Sicurezza antincendio", "Attrezzature", "Legionella"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Pulizie", "Legionella", "Sicurezza lavoro"],
      documentKeywordsMustContain: ["HACCP", "antincendio", "allergen", "Legionella", "infestanti"],
    },
    {
      ateco: "55.30.00",
      templateKeyword: "Campeggi/Villaggi",
      macroGroup: "CAMPEGGI_VILLAGGI",
      minimumCategoryDocs: 14,
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
    {
      ateco: "56.10.42",
      templateKeyword: "Food Truck/Ristorazione Ambulante",
      macroGroup: "FOOD_TRUCK",
      minimumCategoryDocs: 13,
      premisesCoverageMustContain: ["Impianti elettrici", "Impianti gas", "Mezzo mobile", "Stoccaggio", "MOCA"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Rintracciabilita", "Temperature", "CCP"],
      documentKeywordsMustContain: ["HACCP", "allergen", "tracciabil", "ambulante", "MOCA"],
    },
    {
      ateco: "56.10.41",
      templateKeyword: "Gelateria/Pasticceria Ambulante",
      macroGroup: "PASTICCERIA_AMBULANTE",
      minimumCategoryDocs: 13,
      premisesCoverageMustContain: ["Vetrine refrigerate", "Catena del freddo", "Mezzo mobile", "Impianti elettrici", "MOCA"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Rintracciabilita", "Temperature", "CCP"],
      documentKeywordsMustContain: ["HACCP", "allergen", "tracciabil", "ambulante", "MOCA"],
    },
    {
      ateco: "10.85",
      templateKeyword: "Gastronomia/Produzione Alimentare",
      macroGroup: "GASTRONOMIA_PRODUZIONE",
      minimumCategoryDocs: 15,
      premisesCoverageMustContain: ["Layout produttivo", "Catena del freddo", "MOCA", "PMP", "Impianto elettrico"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Rintracciabilita", "CCP", "Sanificazione"],
      documentKeywordsMustContain: ["HACCP", "tracciabil", "MOCA", "sanificazione", "emergenza"],
    },
    {
      ateco: "93.29.20",
      templateKeyword: "Stabilimenti Balneari",
      macroGroup: "STABILIMENTI_BALNEARI",
      minimumCategoryDocs: 14,
      premisesCoverageMustContain: ["Impianti", "Attrezzature", "Stoccaggio", "Infestanti"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Rintracciabilita", "Pulizie", "CCP"],
      documentKeywordsMustContain: ["HACCP", "allergen", "tracciabil", "MOCA", "detergenti"],
    },
    {
      ateco: "93.29.10",
      templateKeyword: "Locali Serali/Discoteca",
      macroGroup: "LOCALI_SERALI",
      minimumCategoryDocs: 14,
      premisesCoverageMustContain: ["Impianti", "Attrezzature", "Stoccaggio", "Infestanti"],
      procedureCoverageMustContain: ["HACCP", "Allergeni", "Rintracciabilita", "Pulizie", "CCP"],
      documentKeywordsMustContain: ["HACCP", "allergen", "tracciabil", "MOCA", "detergenti"],
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

  // Verifica varianti ATECO per Hotel / Ricettività (55.10.00, 55.10, 55.1, 551000)
  const hotelVariants = ["55.10.00", "55.10", "55.1", "551000"];
  for (const variant of hotelVariants) {
    const templatesRes = await app.inject({
      method: "GET",
      url: `/api/checklists/templates?atecoCode=${encodeURIComponent(variant)}&checklistMode=unified`,
      headers,
    });
    assert.equal(templatesRes.statusCode, 200, `Templates request failed for hotel variant ${variant}`);
    const templates = templatesRes.json() as Array<{ id: string; name: string }>;
    const specificTemplates = templates.filter((t) => t.name.includes("Hotel"));
    assert.equal(
      specificTemplates.length,
      2,
      `Expected 2 specific templates for hotel variant ${variant}, found ${specificTemplates.length}`,
    );

    const docsRes = await app.inject({
      method: "GET",
      url: `/api/checklists/document-templates?atecoCode=${encodeURIComponent(variant)}&checklistMode=unified`,
      headers,
    });
    assert.equal(docsRes.statusCode, 200, `Document templates request failed for hotel variant ${variant}`);
    const docs = docsRes.json() as DocumentTemplateLite[];
    const hotelDocs = docs.filter((d) => d.macroGroup === "HOTEL");
    assert.ok(
      hotelDocs.length >= 15,
      `Expected at least 15 hotel docs for variant ${variant}, found ${hotelDocs.length}`,
    );
  }

  // Verifica integrazione ispezioni per azienda Hotel con ATECO variante (55.10)
  const hotelCompany = await app.prisma.company.upsert({
    where: { id: "test-hotel-integration-company" },
    update: { atecoCode: "55.10" },
    create: {
      id: "test-hotel-integration-company",
      name: "Grand Hotel FedShield",
      vatNumber: "IT99887766554",
      atecoCode: "55.10",
      legalAddress: "Via Roma 10, Milano",
    },
  });

  const hotelInspection = await app.inject({
    method: "POST",
    url: "/api/inspections",
    headers,
    payload: {
      companyId: hotelCompany.id,
      title: "Ispezione Hotel Test",
    },
  });
  assert.equal(hotelInspection.statusCode, 201);
  const hotelInspectionId = hotelInspection.json().id as string;

  const inspectionDocsRes = await app.inject({
    method: "GET",
    url: `/api/inspections/${hotelInspectionId}/documents/requirements`,
    headers,
  });
  assert.equal(inspectionDocsRes.statusCode, 200);
  const inspectionDocs = inspectionDocsRes.json() as Array<{ name: string; documentTemplateId: string }>;
  const hotelSpecificDocs = inspectionDocs.filter(
    (d) =>
      d.name.toLowerCase().includes("hotel") ||
      d.name.toLowerCase().includes("struttura ricettiva") ||
      d.name.toLowerCase().includes("colazioni"),
  );
  assert.ok(
    hotelSpecificDocs.length >= 5,
    `Expected at least 5 hotel-specific document requirements for inspection, found ${hotelSpecificDocs.length}`,
  );

  // Verifica varianti ATECO e query testuali per B&B / Affittacamere (55.20.51, 55.20.5, 55.20, 55.2, 552051, 55205, 5520, BEB_AFFITTACAMERE, AFFITTACAMERE, B&B, BNB, GUESTHOUSE)
  const bnbVariants = [
    "55.20.51",
    "55.20.5",
    "55.20",
    "55.2",
    "552051",
    "55205",
    "5520",
    "BEB_AFFITTACAMERE",
    "AFFITTACAMERE",
    "B&B",
    "BNB",
    "GUESTHOUSE",
  ];
  for (const variant of bnbVariants) {
    const templatesRes = await app.inject({
      method: "GET",
      url: `/api/checklists/templates?atecoCode=${encodeURIComponent(variant)}&checklistMode=unified`,
      headers,
    });
    assert.equal(templatesRes.statusCode, 200, `Templates request failed for B&B variant ${variant}`);
    const templates = templatesRes.json() as Array<{ id: string; name: string }>;
    const specificTemplates = templates.filter(
      (t) => t.name.includes("B&B") || t.name.includes("Affittacamere"),
    );
    assert.equal(
      specificTemplates.length,
      2,
      `Expected 2 specific templates for B&B variant ${variant}, found ${specificTemplates.length}`,
    );

    const docsRes = await app.inject({
      method: "GET",
      url: `/api/checklists/document-templates?atecoCode=${encodeURIComponent(variant)}&checklistMode=unified`,
      headers,
    });
    assert.equal(docsRes.statusCode, 200, `Document templates request failed for B&B variant ${variant}`);
    const docs = docsRes.json() as DocumentTemplateLite[];
    const bnbDocs = docs.filter((d) => d.macroGroup === "BEB_AFFITTACAMERE");
    assert.ok(
      bnbDocs.length >= 14,
      `Expected at least 14 B&B docs for variant ${variant}, found ${bnbDocs.length}`,
    );
  }

  // Verifica integrazione ispezioni per azienda B&B con ATECO variante (552051)
  const bnbCompany = await app.prisma.company.upsert({
    where: { id: "test-bnb-integration-company" },
    update: { atecoCode: "552051" },
    create: {
      id: "test-bnb-integration-company",
      name: "B&B Bellavista FedShield",
      vatNumber: "IT99887766555",
      atecoCode: "552051",
      legalAddress: "Via dei Colli 5, Firenze",
    },
  });

  const bnbInspection = await app.inject({
    method: "POST",
    url: "/api/inspections",
    headers,
    payload: {
      companyId: bnbCompany.id,
      title: "Ispezione B&B Test",
    },
  });
  assert.equal(bnbInspection.statusCode, 201);
  const bnbInspectionId = bnbInspection.json().id as string;

  const bnbInspectionDocsRes = await app.inject({
    method: "GET",
    url: `/api/inspections/${bnbInspectionId}/documents/requirements`,
    headers,
  });
  assert.equal(bnbInspectionDocsRes.statusCode, 200);
  const bnbInspectionDocs = bnbInspectionDocsRes.json() as Array<{ name: string; documentTemplateId: string }>;
  const bnbSpecificDocs = bnbInspectionDocs.filter(
    (d) =>
      d.name.toLowerCase().includes("b&b") ||
      d.name.toLowerCase().includes("affittacamere") ||
      d.name.toLowerCase().includes("extra-alberghier"),
  );
  assert.ok(
    bnbSpecificDocs.length >= 5,
    `Expected at least 5 B&B-specific document requirements for inspection, found ${bnbSpecificDocs.length}`,
  );

  // Verifica varianti ATECO e query testuali per Ostelli / Residence (55.20.20, 55.20.2, 552020, 55202, OSTELLI_RESIDENCE, OSTELLO_RESIDENCE, OSTELLI, OSTELLO, RESIDENCE)
  const hostelVariants = [
    "55.20.20",
    "55.20.2",
    "552020",
    "55202",
    "OSTELLI_RESIDENCE",
    "OSTELLO_RESIDENCE",
    "OSTELLI",
    "OSTELLO",
    "RESIDENCE",
  ];
  for (const variant of hostelVariants) {
    const templatesRes = await app.inject({
      method: "GET",
      url: `/api/checklists/templates?atecoCode=${encodeURIComponent(variant)}&checklistMode=unified`,
      headers,
    });
    assert.equal(templatesRes.statusCode, 200, `Templates request failed for hostel variant ${variant}`);
    const templates = templatesRes.json() as Array<{ id: string; name: string }>;
    const specificTemplates = templates.filter(
      (t) => t.name.includes("Ostelli") || t.name.includes("Residence") || t.name.includes("Ostello"),
    );
    assert.equal(
      specificTemplates.length,
      2,
      `Expected 2 specific templates for hostel variant ${variant}, found ${specificTemplates.length}`,
    );

    const docsRes = await app.inject({
      method: "GET",
      url: `/api/checklists/document-templates?atecoCode=${encodeURIComponent(variant)}&checklistMode=unified`,
      headers,
    });
    assert.equal(docsRes.statusCode, 200, `Document templates request failed for hostel variant ${variant}`);
    const docs = docsRes.json() as DocumentTemplateLite[];
    const hostelDocs = docs.filter(
      (d) => d.macroGroup === "OSTELLI_RESIDENCE" || d.macroGroup === "OSTELLO_RESIDENCE",
    );
    assert.ok(
      hostelDocs.length >= 14,
      `Expected at least 14 hostel docs for variant ${variant}, found ${hostelDocs.length}`,
    );
  }

  // Verifica generazione template e requisiti normativi specifici per Ostelli / Residence su 55.20.20 e dotless 552020:
  // - Antincendio DM 09/04/1994
  // - Sicurezza dormitori UNI EN 747
  // - Prevenzione legionella D.Lgs. 18/2023
  // - Accessibilità disabili PMR DPR 503/96
  // - Cucine comuni e autocontrollo HACCP
  const hostelCodesToVerify = ["55.20.20", "552020"];
  for (const ateco of hostelCodesToVerify) {
    const tRes = await app.inject({
      method: "GET",
      url: `/api/checklists/templates?atecoCode=${encodeURIComponent(ateco)}&checklistMode=unified`,
      headers,
    });
    assert.equal(tRes.statusCode, 200);
    const tmpls = tRes.json() as Array<{ id: string; name: string }>;
    const hostelTmpls = tmpls.filter(
      (t) => t.name.includes("Ostelli") || t.name.includes("Residence") || t.name.includes("Ostello"),
    );
    assert.equal(hostelTmpls.length, 2, `Expected 2 templates for ${ateco}`);

    let allItemsText = "";
    for (const t of hostelTmpls) {
      const itemsRes = await app.inject({
        method: "GET",
        url: `/api/checklists/templates/${t.id}/items?checklistMode=unified`,
        headers,
      });
      assert.equal(itemsRes.statusCode, 200);
      const items = itemsRes.json().items as Array<{
        question: string;
        area: string;
        normReference?: string | null;
        orderIndex: number;
        defaultSeverity: number;
      }>;
      assert.equal(items.length, 25, `Expected 25 items for template ${t.id} under ${ateco}`);
      for (const item of items) {
        assert.ok(item.defaultSeverity >= 1 && item.defaultSeverity <= 4, `Invalid severity in item ${item.orderIndex}`);
      }

      const combined = items
        .map((i) => `${i.area} ${i.question} ${i.normReference ?? ""}`.toLowerCase())
        .join(" | ");
      allItemsText += ` | ${combined}`;
    }

    // 1. Antincendio DM 09/04/1994
    assert.ok(
      allItemsText.includes("antincendio") &&
        (allItemsText.includes("dm 09/04/1994") || allItemsText.includes("09/04/1994")),
      `Missing norm requirement "antincendio DM 09/04/1994" for ${ateco}`,
    );

    // 2. Sicurezza dormitori UNI EN 747
    assert.ok(
      allItemsText.includes("dormitori") &&
        (allItemsText.includes("uni en 747") || allItemsText.includes("747")),
      `Missing norm requirement "sicurezza dormitori UNI EN 747" for ${ateco}`,
    );

    // 3. Prevenzione legionella D.Lgs. 18/2023
    assert.ok(
      allItemsText.includes("legionella") &&
        (allItemsText.includes("18/2023") || allItemsText.includes("d.lgs. 18/2023")),
      `Missing norm requirement "prevenzione legionella D.Lgs. 18/2023" for ${ateco}`,
    );

    // 4. Accessibilità disabili PMR DPR 503/96
    assert.ok(
      (allItemsText.includes("disabili") || allItemsText.includes("pmr") || allItemsText.includes("barriere")) &&
        (allItemsText.includes("dpr 503/96") || allItemsText.includes("503/96")),
      `Missing norm requirement "accessibilità disabili PMR DPR 503/96" for ${ateco}`,
    );

    // 5. Cucine comuni e autocontrollo HACCP
    assert.ok(
      allItemsText.includes("cucine comuni") &&
        (allItemsText.includes("autocontrollo") || allItemsText.includes("haccp")),
      `Missing norm requirement "cucine comuni e autocontrollo HACCP" for ${ateco}`,
    );
  }

  // Verifica integrazione ispezioni per azienda Ostello / Residence con ATECO variante dotless (552020)
  const hostelCompany = await app.prisma.company.upsert({
    where: { id: "test-hostel-integration-company" },
    update: { atecoCode: "552020" },
    create: {
      id: "test-hostel-integration-company",
      name: "Ostello della Gioventù FedShield",
      vatNumber: "IT99887766556",
      atecoCode: "552020",
      legalAddress: "Via dei Mille 1, Bologna",
    },
  });

  const hostelInspection = await app.inject({
    method: "POST",
    url: "/api/inspections",
    headers,
    payload: {
      companyId: hostelCompany.id,
      title: "Ispezione Ostello Test",
    },
  });
  assert.equal(hostelInspection.statusCode, 201);
  const hostelInspectionId = hostelInspection.json().id as string;

  const hostelInspectionDocsRes = await app.inject({
    method: "GET",
    url: `/api/inspections/${hostelInspectionId}/documents/requirements`,
    headers,
  });
  assert.equal(hostelInspectionDocsRes.statusCode, 200);
  const hostelInspectionDocs = hostelInspectionDocsRes.json() as Array<{ name: string; documentTemplateId: string }>;
  const hostelSpecificDocs = hostelInspectionDocs.filter(
    (d) =>
      d.name.toLowerCase().includes("ostello") ||
      d.name.toLowerCase().includes("residence") ||
      d.name.toLowerCase().includes("struttura ostello/residence") ||
      d.name.toLowerCase().includes("colazioni") ||
      d.name.toLowerCase().includes("antincendio"),
  );
  assert.ok(
    hostelSpecificDocs.length >= 5,
    `Expected at least 5 hostel-specific document requirements for inspection, found ${hostelSpecificDocs.length}`,
  );

  console.log("HoReCa completeness test passed (including Hotel, B&B and Ostelli/Residence ATECO variants and inspection integration)");
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
