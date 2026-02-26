import assert from "node:assert/strict";
import { buildApp } from "../app.js";

async function run() {
  const app = buildApp();

  const login = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: {
      email: "admin@fedshield.local",
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
  const company = companies.json()[0];

  const inspectionRes = await app.inject({
    method: "POST",
    url: "/api/inspections",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      companyId: company.id,
      title: "Inspection for quote test",
    },
  });
  assert.equal(inspectionRes.statusCode, 201);
  const inspection = inspectionRes.json();

  const templatesRes = await app.inject({
    method: "GET",
    url: "/api/checklists/templates",
    headers: { authorization: `Bearer ${token}` },
  });
  const templateId = templatesRes.json()[0].id as string;

  const itemsRes = await app.inject({
    method: "GET",
    url: `/api/checklists/templates/${templateId}/items`,
    headers: { authorization: `Bearer ${token}` },
  });

  const checklistItemId = itemsRes.json().items[0].id as string;

  const answerRes = await app.inject({
    method: "POST",
    url: `/api/inspections/${inspection.id}/answers`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      answers: [
        {
          checklistItemId,
          value: "no",
          note: "NC sanzionabile test",
          severity: 3,
          isSanctionable: true,
        },
      ],
    },
  });
  assert.equal(answerRes.statusCode, 200);

  const nc = answerRes.json().nonConformities[0];
  assert.ok(nc?.id);

  const quoteRes = await app.inject({
    method: "POST",
    url: "/api/quotes",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      nonConformityId: nc.id,
      serviceName: "Adeguamento formazione sicurezza",
      amount: 900,
      dueDays: 14,
    },
  });
  assert.equal(quoteRes.statusCode, 201);
  const quote = quoteRes.json();

  const rejectRes = await app.inject({
    method: "PATCH",
    url: `/api/quotes/${quote.id}/respond`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      action: "rejected",
      note: "Cliente non interessato",
    },
  });
  assert.equal(rejectRes.statusCode, 200);

  const quotesList = await app.inject({
    method: "GET",
    url: "/api/quotes",
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(quotesList.statusCode, 200);

  const savedQuote = quotesList.json().find((item: { id: string }) => item.id === quote.id);
  assert.ok(savedQuote);
  assert.equal(savedQuote.status, "rejected");
  assert.ok(savedQuote.malleva);

  const reportPdf = await app.inject({
    method: "POST",
    url: `/api/inspections/${inspection.id}/report/pdf`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(reportPdf.statusCode, 200);

  console.log("Quotes and documents test passed");
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
