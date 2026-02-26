import assert from "node:assert/strict";
import { buildApp } from "../app.js";

async function run() {
  const app = buildApp();

  const health = await app.inject({ method: "GET", url: "/api/health" });
  assert.equal(health.statusCode, 200);

  const login = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: {
      email: "junior@fedshield.local",
      password: "fedshield123",
    },
  });
  assert.equal(login.statusCode, 200);
  const { token } = login.json();

  const companies = await app.inject({
    method: "GET",
    url: "/api/companies",
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(companies.statusCode, 200);
  const companyId = companies.json()[0].id as string;

  const createInspection = await app.inject({
    method: "POST",
    url: "/api/inspections",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      companyId,
      title: "Test checklist flow",
    },
  });
  assert.equal(createInspection.statusCode, 201);
  const inspectionId = createInspection.json().id as string;

  const templatesResponse = await app.inject({
    method: "GET",
    url: "/api/checklists/templates",
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(templatesResponse.statusCode, 200);
  const templates = templatesResponse.json();
  assert.ok(Array.isArray(templates) && templates.length > 0);

  const templateId = templates[0].id as string;
  const itemsResponse = await app.inject({
    method: "GET",
    url: `/api/checklists/templates/${templateId}/items`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(itemsResponse.statusCode, 200);
  const items = itemsResponse.json().items;
  assert.ok(Array.isArray(items) && items.length > 0);

  const firstItemId = items[0].id as string;

  const answerNo = await app.inject({
    method: "POST",
    url: `/api/inspections/${inspectionId}/answers`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      answers: [
        {
          checklistItemId: firstItemId,
          value: "no",
          note: "Manca documento",
          severity: 3,
          isSanctionable: true,
        },
      ],
    },
  });
  assert.equal(answerNo.statusCode, 200);
  assert.equal(answerNo.json().nonConformities.length, 1);

  const answerYes = await app.inject({
    method: "POST",
    url: `/api/inspections/${inspectionId}/answers`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      answers: [
        {
          checklistItemId: firstItemId,
          value: "yes",
        },
      ],
    },
  });
  assert.equal(answerYes.statusCode, 200);
  assert.equal(answerYes.json().nonConformities.length, 0);

  const docsRequirements = await app.inject({
    method: "GET",
    url: `/api/inspections/${inspectionId}/documents/requirements`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(docsRequirements.statusCode, 200);
  const requirements = docsRequirements.json();
  assert.ok(Array.isArray(requirements) && requirements.length > 0);

  const saveDocs = await app.inject({
    method: "PUT",
    url: `/api/inspections/${inspectionId}/documents`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      documents: [
        {
          documentTemplateId: requirements[0].documentTemplateId,
          name: requirements[0].name,
          status: "requested_later",
          note: "Inviare via mail entro 48h",
        },
      ],
    },
  });
  assert.equal(saveDocs.statusCode, 200);

  const summary = await app.inject({
    method: "GET",
    url: `/api/inspections/${inspectionId}/summary`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(summary.statusCode, 200);
  assert.equal(summary.json().totals.requestedDocuments, 1);

  const sendToAdmin = await app.inject({
    method: "POST",
    url: `/api/inspections/${inspectionId}/send-to-admin`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(sendToAdmin.statusCode, 200);

  console.log("Checklist routes test passed");
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
