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

  // Verifica filtraggio checklistMode su GET /inspections/:id/documents/requirements
  const createHaccpInspection = await app.inject({
    method: "POST",
    url: "/api/inspections",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      companyId,
      title: "Test inspection HACCP only",
      checklistMode: "haccp_only",
    },
  });
  assert.equal(createHaccpInspection.statusCode, 201);
  const haccpInspectionId = createHaccpInspection.json().id as string;

  const haccpDocsRes = await app.inject({
    method: "GET",
    url: `/api/inspections/${haccpInspectionId}/documents/requirements`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(haccpDocsRes.statusCode, 200);
  const haccpRequirements = haccpDocsRes.json();
  const haccpTemplateIds = haccpRequirements.map((r: { documentTemplateId: string }) => r.documentTemplateId);
  const haccpTemplates = await app.prisma.documentTemplate.findMany({
    where: { id: { in: haccpTemplateIds } },
  });
  for (const t of haccpTemplates) {
    assert.notEqual(t.domain, "safety", `Template ${t.name} non deve avere domain 'safety' in haccp_only`);
    assert.ok(t.domain === "haccp" || t.domain === "both");
  }

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

  // ---- Verifica ATECO 56.10.41 (Gelateria/Pasticceria Ambulante) ----
  const ambulantPastryCompany = await app.prisma.company.upsert({
    where: { vatNumber: "IT99956104101" },
    update: { atecoCode: "56.10.41" },
    create: {
      name: "Gelateria & Pasticceria Ambulante Da Mario",
      vatNumber: "IT99956104101",
      atecoCode: "56.10.41",
      legalAddress: "Piazza Garibaldi 1, 80142 Napoli",
    },
  });

  // 1. ChecklistMode haccp_only su inspection ATECO 56.10.41
  const ambulantHaccpInspection = await app.inject({
    method: "POST",
    url: "/api/inspections",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      companyId: ambulantPastryCompany.id,
      title: "Sopralluogo HACCP Gelateria Ambulante",
      checklistMode: "haccp_only",
    },
  });
  assert.equal(ambulantHaccpInspection.statusCode, 201);
  const ambulantHaccpId = ambulantHaccpInspection.json().id as string;

  const ambulantHaccpDocsRes = await app.inject({
    method: "GET",
    url: `/api/inspections/${ambulantHaccpId}/documents/requirements`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(ambulantHaccpDocsRes.statusCode, 200);
  const ambulantHaccpDocs = ambulantHaccpDocsRes.json() as Array<{
    documentTemplateId: string;
    name: string;
    isRequired: boolean;
  }>;
  assert.ok(ambulantHaccpDocs.length >= 12, `Attesi almeno 12 documenti HACCP/both per 56.10.41, trovati ${ambulantHaccpDocs.length}`);

  const ambulantHaccpDocIds = ambulantHaccpDocs.map((d) => d.documentTemplateId);
  const ambulantHaccpTemplates = await app.prisma.documentTemplate.findMany({
    where: { id: { in: ambulantHaccpDocIds } },
  });
  for (const t of ambulantHaccpTemplates) {
    assert.notEqual(t.domain, "safety", `Template ${t.name} non deve avere domain 'safety' in haccp_only per 56.10.41`);
    assert.ok(t.domain === "haccp" || t.domain === "both");
  }

  // Verifica presenza documenti chiave settore alimentare ambulante
  const docNames = ambulantHaccpDocs.map((d) => d.name.toLowerCase());
  assert.ok(docNames.some((n) => n.includes("scia") || n.includes("notifica sanitaria")), "Manca SCIA sanitaria per 56.10.41");
  assert.ok(docNames.some((n) => n.includes("manuale haccp")), "Manca Manuale HACCP per 56.10.41");
  assert.ok(docNames.some((n) => n.includes("catena del freddo") || n.includes("ccp")), "Manca procedura CCP/freddo per 56.10.41");
  assert.ok(docNames.some((n) => n.includes("allergeni")), "Manca matrice allergeni per 56.10.41");
  assert.ok(docNames.some((n) => n.includes("moca")), "Manca dichiarazione MOCA per 56.10.41");

  // 2. ChecklistMode safety_only su inspection ATECO 56.10.41
  const ambulantSafetyInspection = await app.inject({
    method: "POST",
    url: "/api/inspections",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      companyId: ambulantPastryCompany.id,
      title: "Sopralluogo Sicurezza Gelateria Ambulante",
      checklistMode: "safety_only",
    },
  });
  assert.equal(ambulantSafetyInspection.statusCode, 201);
  const ambulantSafetyId = ambulantSafetyInspection.json().id as string;

  const ambulantSafetyDocsRes = await app.inject({
    method: "GET",
    url: `/api/inspections/${ambulantSafetyId}/documents/requirements`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(ambulantSafetyDocsRes.statusCode, 200);
  const ambulantSafetyDocs = ambulantSafetyDocsRes.json() as Array<{
    documentTemplateId: string;
    name: string;
  }>;
  const ambulantSafetyDocIds = ambulantSafetyDocs.map((d) => d.documentTemplateId);
  const ambulantSafetyTemplates = await app.prisma.documentTemplate.findMany({
    where: { id: { in: ambulantSafetyDocIds } },
  });
  for (const t of ambulantSafetyTemplates) {
    assert.notEqual(t.domain, "haccp", `Template ${t.name} non deve avere domain 'haccp' in safety_only per 56.10.41`);
    assert.ok(t.domain === "safety" || t.domain === "both");
  }

  // 3. ChecklistMode unified su inspection ATECO 56.10.41
  const ambulantUnifiedInspection = await app.inject({
    method: "POST",
    url: "/api/inspections",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      companyId: ambulantPastryCompany.id,
      title: "Sopralluogo Unificato Gelateria Ambulante",
      checklistMode: "unified",
    },
  });
  assert.equal(ambulantUnifiedInspection.statusCode, 201);
  const ambulantUnifiedId = ambulantUnifiedInspection.json().id as string;

  const ambulantUnifiedDocsRes = await app.inject({
    method: "GET",
    url: `/api/inspections/${ambulantUnifiedId}/documents/requirements`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(ambulantUnifiedDocsRes.statusCode, 200);
  const ambulantUnifiedDocs = ambulantUnifiedDocsRes.json() as Array<{
    documentTemplateId: string;
    name: string;
  }>;
  // Deve contenere tutti i 14 documenti specifici di categoria per PASTICCERIA_AMBULANTE
  const unifiedDocIds = ambulantUnifiedDocs.map((d) => d.documentTemplateId);
  const unifiedSpecificDocs = await app.prisma.documentTemplate.findMany({
    where: {
      id: { in: unifiedDocIds },
      atecoCode: "56.10.41",
    },
  });
  assert.equal(unifiedSpecificDocs.length, 14, "Tutti i 14 documenti specifici per 56.10.41 devono essere presenti nel modo unificato");

  console.log("Checklist routes test passed (inclusa verifica ATECO 56.10.41 Gelateria/Pasticceria Ambulante)");
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
