import assert from "node:assert/strict";
import { buildApp } from "../app.js";

async function run() {
  const app = buildApp();

  // 1. Login come consulente senior
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

  // 2. Prendi una template esistente
  const templatesRes = await app.inject({
    method: "GET",
    url: "/api/checklists/templates",
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(templatesRes.statusCode, 200);
  const templates = templatesRes.json();
  assert.ok(templates.length > 0);
  const templateId = templates[0].id;

  // 3. Creazione requisito specifico singolo
  const createItemRes = await app.inject({
    method: "POST",
    url: "/api/checklists/custom-items",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      templateId,
      section: "premises_equipment",
      domain: "safety",
      area: "Attrezzatura Personalizzata",
      question: "La macchina speciale dispone di arresto di emergenza e protezione organi in movimento?",
      normReference: "D.Lgs. 81/2008, art. 70-71",
      defaultSeverity: 3,
      defaultSanctionable: true,
    },
  });
  assert.equal(createItemRes.statusCode, 201);
  const createdItem = createItemRes.json();
  assert.ok(createdItem.id);
  assert.equal(createdItem.area, "Attrezzatura Personalizzata");
  assert.equal(createdItem.normReference, "D.Lgs. 81/2008, art. 70-71");
  assert.equal(createdItem.defaultSanctionable, true);
  assert.equal(createdItem.isRequired, false);

  // 4. Creazione requisiti specifici massivi (bulk, ad es. generati per macchina)
  const bulkRes = await app.inject({
    method: "POST",
    url: "/api/checklists/custom-items/bulk",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      templateId,
      items: [
        {
          section: "premises_equipment",
          domain: "safety",
          area: "Sicurezza Macchine - Affettatrice",
          question: "L'affettatrice presenta marcatura CE e targa costruttore leggibile?",
          normReference: "D.Lgs. 81/2008, art. 70 c. 1",
          defaultSeverity: 3,
          defaultSanctionable: true,
        },
        {
          section: "premises_equipment",
          domain: "safety",
          area: "Sicurezza Macchine - Affettatrice",
          question: "Il manuale d'uso e manutenzione in lingua italiana è disponibile agli operatori?",
          normReference: "D.Lgs. 81/2008, art. 70 c. 2",
          defaultSeverity: 2,
          defaultSanctionable: true,
        },
      ],
    },
  });
  assert.equal(bulkRes.statusCode, 201);
  const bulkItems = bulkRes.json();
  assert.equal(bulkItems.length, 2);
  assert.ok(bulkItems[0].orderIndex < bulkItems[1].orderIndex);

  // 5. Verifica che gli item appaiano nella lista item della template
  const itemsRes = await app.inject({
    method: "GET",
    url: `/api/checklists/templates/${templateId}/items`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(itemsRes.statusCode, 200);
  const allItems = itemsRes.json().items;
  const foundSingle = allItems.find((it: any) => it.id === createdItem.id);
  assert.ok(foundSingle, "Requisito custom non trovato nella template");

  // 6. Cancellazione requisito custom
  const deleteRes = await app.inject({
    method: "DELETE",
    url: `/api/checklists/custom-items/${createdItem.id}`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(deleteRes.statusCode, 200);

  // Pulizia bulk
  for (const b of bulkItems) {
    await app.inject({
      method: "DELETE",
      url: `/api/checklists/custom-items/${b.id}`,
      headers: { authorization: `Bearer ${token}` },
    });
  }

  await app.close();
  console.log("✓ Test custom checklist items superato con successo!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
