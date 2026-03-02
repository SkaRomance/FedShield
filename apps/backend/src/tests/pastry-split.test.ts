import assert from "node:assert/strict";
import { buildApp } from "../app.js";

type ChecklistDomain = "haccp" | "safety" | "both";
type HorecaCategory = {
  ateco: string;
  templateKeyword: string;
  minHaccpItems: number;
  minSafetyItems: number;
  minDocsPerMode: number;
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
  const categories: HorecaCategory[] = [
    { ateco: "56.10.11", templateKeyword: "Ristorante", minHaccpItems: 24, minSafetyItems: 24, minDocsPerMode: 10 },
    { ateco: "56.30", templateKeyword: "Bar", minHaccpItems: 24, minSafetyItems: 24, minDocsPerMode: 9 },
    { ateco: "55.10.00", templateKeyword: "Hotel", minHaccpItems: 20, minSafetyItems: 20, minDocsPerMode: 8 },
    {
      ateco: "55.20.51",
      templateKeyword: "B&B/Affittacamere",
      minHaccpItems: 20,
      minSafetyItems: 20,
      minDocsPerMode: 8,
    },
    {
      ateco: "55.20.20",
      templateKeyword: "Ostelli/Residence",
      minHaccpItems: 20,
      minSafetyItems: 20,
      minDocsPerMode: 8,
    },
    {
      ateco: "55.30.00",
      templateKeyword: "Campeggi/Villaggi",
      minHaccpItems: 20,
      minSafetyItems: 20,
      minDocsPerMode: 8,
    },
    {
      ateco: "56.10.30",
      templateKeyword: "Pasticceria/Gelateria",
      minHaccpItems: 24,
      minSafetyItems: 24,
      minDocsPerMode: 10,
    },
    {
      ateco: "56.10.20",
      templateKeyword: "Pizzeria/Asporto",
      minHaccpItems: 24,
      minSafetyItems: 24,
      minDocsPerMode: 9,
    },
    {
      ateco: "56.29.10",
      templateKeyword: "Mense/Catering",
      minHaccpItems: 24,
      minSafetyItems: 24,
      minDocsPerMode: 9,
    },
    {
      ateco: "56.21.00",
      templateKeyword: "Catering Eventi",
      minHaccpItems: 24,
      minSafetyItems: 24,
      minDocsPerMode: 9,
    },
    {
      ateco: "56.10.42",
      templateKeyword: "Food Truck/Ristorazione Ambulante",
      minHaccpItems: 24,
      minSafetyItems: 24,
      minDocsPerMode: 9,
    },
    {
      ateco: "56.10.41",
      templateKeyword: "Gelateria/Pasticceria Ambulante",
      minHaccpItems: 24,
      minSafetyItems: 24,
      minDocsPerMode: 9,
    },
    {
      ateco: "10.85",
      templateKeyword: "Gastronomia/Produzione Alimentare",
      minHaccpItems: 24,
      minSafetyItems: 24,
      minDocsPerMode: 10,
    },
    {
      ateco: "93.29.20",
      templateKeyword: "Stabilimenti Balneari",
      minHaccpItems: 24,
      minSafetyItems: 24,
      minDocsPerMode: 9,
    },
    {
      ateco: "93.29.10",
      templateKeyword: "Locali Serali/Discoteca",
      minHaccpItems: 24,
      minSafetyItems: 24,
      minDocsPerMode: 9,
    },
  ];

  for (const category of categories) {
    const haccpTemplatesRes = await app.inject({
      method: "GET",
      url: `/api/checklists/templates?atecoCode=${encodeURIComponent(category.ateco)}&checklistMode=haccp_only`,
      headers,
    });
    assert.equal(haccpTemplatesRes.statusCode, 200);
    const haccpTemplates = haccpTemplatesRes.json() as Array<{ id: string; name: string }>;
    assert.ok(
      haccpTemplates.some((template) => template.name.includes(category.templateKeyword)),
      `Template HACCP mancante per ${category.ateco}`,
    );

    const safetyTemplatesRes = await app.inject({
      method: "GET",
      url: `/api/checklists/templates?atecoCode=${encodeURIComponent(category.ateco)}&checklistMode=safety_only`,
      headers,
    });
    assert.equal(safetyTemplatesRes.statusCode, 200);
    const safetyTemplates = safetyTemplatesRes.json() as Array<{ id: string; name: string }>;
    assert.ok(
      safetyTemplates.some((template) => template.name.includes(category.templateKeyword)),
      `Template safety mancante per ${category.ateco}`,
    );

    let haccpItemsCount = 0;
    for (const template of haccpTemplates) {
      const itemsRes = await app.inject({
        method: "GET",
        url: `/api/checklists/templates/${template.id}/items?checklistMode=haccp_only`,
        headers,
      });
      assert.equal(itemsRes.statusCode, 200);
      const items = itemsRes.json().items as Array<{ domain?: ChecklistDomain }>;
      for (const item of items) {
        assert.notEqual(item.domain, "safety");
      }
      haccpItemsCount += items.length;
    }

    let safetyItemsCount = 0;
    for (const template of safetyTemplates) {
      const itemsRes = await app.inject({
        method: "GET",
        url: `/api/checklists/templates/${template.id}/items?checklistMode=safety_only`,
        headers,
      });
      assert.equal(itemsRes.statusCode, 200);
      const items = itemsRes.json().items as Array<{ domain?: ChecklistDomain }>;
      for (const item of items) {
        assert.notEqual(item.domain, "haccp");
      }
      safetyItemsCount += items.length;
    }

    assert.ok(
      haccpItemsCount >= category.minHaccpItems,
      `HACCP items insufficienti per ${category.ateco}: ${haccpItemsCount}`,
    );
    assert.ok(
      safetyItemsCount >= category.minSafetyItems,
      `Safety items insufficienti per ${category.ateco}: ${safetyItemsCount}`,
    );

    const haccpDocsRes = await app.inject({
      method: "GET",
      url: `/api/checklists/document-templates?atecoCode=${encodeURIComponent(category.ateco)}&checklistMode=haccp_only`,
      headers,
    });
    assert.equal(haccpDocsRes.statusCode, 200);
    const haccpDocs = haccpDocsRes.json() as Array<{ domain?: ChecklistDomain }>;
    assert.ok(haccpDocs.length >= category.minDocsPerMode);
    for (const doc of haccpDocs) {
      assert.notEqual(doc.domain, "safety");
    }

    const safetyDocsRes = await app.inject({
      method: "GET",
      url: `/api/checklists/document-templates?atecoCode=${encodeURIComponent(category.ateco)}&checklistMode=safety_only`,
      headers,
    });
    assert.equal(safetyDocsRes.statusCode, 200);
    const safetyDocs = safetyDocsRes.json() as Array<{ domain?: ChecklistDomain }>;
    assert.ok(safetyDocs.length >= category.minDocsPerMode);
    for (const doc of safetyDocs) {
      assert.notEqual(doc.domain, "haccp");
    }
  }

  console.log("HoReCa split test passed");
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
