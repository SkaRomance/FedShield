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

  const companiesRes = await app.inject({
    method: "GET",
    url: "/api/companies",
    headers: { authorization: `Bearer ${token}` },
  });
  const company = companiesRes.json()[0];
  assert.ok(company?.id);

  const inspectionRes = await app.inject({
    method: "POST",
    url: "/api/inspections",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      companyId: company.id,
      title: "Inspection for ODV KPI test",
    },
  });
  assert.equal(inspectionRes.statusCode, 201);
  const inspectionId = inspectionRes.json().id as string;

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
  const firstItemId = itemsRes.json().items[0].id as string;

  const answersRes = await app.inject({
    method: "POST",
    url: `/api/inspections/${inspectionId}/answers`,
    headers: { authorization: `Bearer ${token}` },
    payload: {
      answers: [
        {
          checklistItemId: firstItemId,
          value: "no",
          note: "Manca DVR aggiornato",
          severity: 3,
          isSanctionable: true,
        },
      ],
    },
  });
  assert.equal(answersRes.statusCode, 200);

  const odvCreate = await app.inject({
    method: "POST",
    url: "/api/odv/inspections",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      companyId: company.id,
      authorityName: "ASL Milano",
      inspectedAt: new Date().toISOString(),
      sanctions: [
        {
          violationTitle: "Mancanza DVR aggiornato",
          violationNorm: "D.Lgs. 81/08",
          amount: 2500,
        },
      ],
    },
  });
  assert.equal(odvCreate.statusCode, 200);
  const createdOdv = odvCreate.json();
  assert.equal(createdOdv.sanctions.length, 1);

  const defensive = await app.inject({
    method: "GET",
    url: `/api/odv/defensive-report/${company.id}`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(defensive.statusCode, 200);
  assert.ok(defensive.json().sanctions >= 1);

  const overview = await app.inject({
    method: "GET",
    url: "/api/kpi/overview",
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(overview.statusCode, 200);
  assert.ok(typeof overview.json().averageComplianceScore === "number");

  const companyKpi = await app.inject({
    method: "GET",
    url: `/api/kpi/companies/${company.id}`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(companyKpi.statusCode, 200);
  assert.ok(companyKpi.json().totals.nc >= 1);

  const consultantsKpi = await app.inject({
    method: "GET",
    url: "/api/kpi/consultants",
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(consultantsKpi.statusCode, 200);
  assert.ok(Array.isArray(consultantsKpi.json()));

  console.log("KPI and ODV test passed");
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
