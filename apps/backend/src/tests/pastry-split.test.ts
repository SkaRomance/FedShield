import assert from "node:assert/strict";
import { buildApp } from "../app.js";

type ChecklistDomain = "haccp" | "safety" | "both";

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
  const ateco = "56.10.30";

  const haccpTemplatesRes = await app.inject({
    method: "GET",
    url: `/api/checklists/templates?atecoCode=${encodeURIComponent(ateco)}&checklistMode=haccp_only`,
    headers,
  });
  assert.equal(haccpTemplatesRes.statusCode, 200);
  const haccpTemplates = haccpTemplatesRes.json() as Array<{ id: string; name: string }>;
  assert.ok(haccpTemplates.some((template) => template.name.includes("Pasticceria/Gelateria")));

  const safetyTemplatesRes = await app.inject({
    method: "GET",
    url: `/api/checklists/templates?atecoCode=${encodeURIComponent(ateco)}&checklistMode=safety_only`,
    headers,
  });
  assert.equal(safetyTemplatesRes.statusCode, 200);
  const safetyTemplates = safetyTemplatesRes.json() as Array<{ id: string; name: string }>;
  assert.ok(safetyTemplates.some((template) => template.name.includes("Pasticceria/Gelateria")));

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

  assert.ok(haccpItemsCount >= 20);
  assert.ok(safetyItemsCount >= 20);

  const haccpDocsRes = await app.inject({
    method: "GET",
    url: `/api/checklists/document-templates?atecoCode=${encodeURIComponent(ateco)}&checklistMode=haccp_only`,
    headers,
  });
  assert.equal(haccpDocsRes.statusCode, 200);
  const haccpDocs = haccpDocsRes.json() as Array<{ domain?: ChecklistDomain }>;
  assert.ok(haccpDocs.length > 0);
  for (const doc of haccpDocs) {
    assert.notEqual(doc.domain, "safety");
  }

  const safetyDocsRes = await app.inject({
    method: "GET",
    url: `/api/checklists/document-templates?atecoCode=${encodeURIComponent(ateco)}&checklistMode=safety_only`,
    headers,
  });
  assert.equal(safetyDocsRes.statusCode, 200);
  const safetyDocs = safetyDocsRes.json() as Array<{ domain?: ChecklistDomain }>;
  assert.ok(safetyDocs.length > 0);
  for (const doc of safetyDocs) {
    assert.notEqual(doc.domain, "haccp");
  }

  console.log("Pastry split test passed");
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

