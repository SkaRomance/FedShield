// Smoke test pre-merge — Sprint 4
//
// Boot l'intera app con buildApp() e verifica che gli endpoint critici
// (post Sprint 0/1/2/3) rispondano. Usa fastify.inject (no rete esterna),
// nessun seed richiesto: i dati esistenti nel dev.db sono sufficienti.
// Verifica:
// - boot senza FST_ERR_DUPLICATED_ROUTE (regressione fix P0-1)
// - /api/health
// - /api/companies con admin → 200
// - /api/notifications/alerts → 400 senza companyId (regressione fix P0-2)
// - /api/norm-sync/proposals → admin OK (regressione fix P0-3)
// - /api/chatbot/query con question vuota → 400
// - /api/chatbot/query con question troppo lunga → 400 (S4-7 H2)

import { test } from "node:test";
import assert from "node:assert";
import { buildApp } from "../app.js";

async function setup() {
  const app = buildApp();
  await app.ready();
  const adminUser = await app.prisma.user.findUnique({ where: { email: "admin@fedshield.local" } });
  const adminToken = app.jwt.sign({
    sub: adminUser?.id ?? "smoke-admin",
    email: adminUser?.email ?? "smoke@fedshield.test",
    role: "admin",
  });
  return { app, adminToken };
}

test("Smoke: boot dell'app senza errori di routing", async () => {
  const { app } = await setup();
  await app.close();
});

test("Smoke: /api/health risponde", async () => {
  const { app } = await setup();
  try {
    const res = await app.inject({ method: "GET", url: "/api/health" });
    assert.strictEqual(res.statusCode, 200);
  } finally {
    await app.close();
  }
});

test("Smoke: /api/companies admin → 200", async () => {
  const { app, adminToken } = await setup();
  try {
    const res = await app.inject({
      method: "GET",
      url: "/api/companies",
      headers: { authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.ok(Array.isArray(body), "atteso array di aziende");
  } finally {
    await app.close();
  }
});

test("Smoke: /api/notifications/alerts senza companyId → 200 su tutte le aziende", async () => {
  // La campanella in testata non ha un'azienda selezionata: senza companyId
  // l'endpoint aggrega le scadenze di tutte le aziende seguite.
  const { app, adminToken } = await setup();
  try {
    const res = await app.inject({
      method: "GET",
      url: "/api/notifications/alerts",
      headers: { authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.ok(Array.isArray(body.alerts), "atteso array di scadenze");
    assert.ok(body.summary, "atteso riepilogo per gravita");
    for (const chiave of ["red", "orange", "yellow"]) {
      assert.strictEqual(
        typeof body.summary[chiave],
        "number",
        `riepilogo senza conteggio ${chiave}`,
      );
    }
  } finally {
    await app.close();
  }
});

test("Smoke: /api/notifications/alerts con companyId inesistente → 404", async () => {
  const { app, adminToken } = await setup();
  try {
    const res = await app.inject({
      method: "GET",
      url: "/api/notifications/alerts?companyId=azienda-che-non-esiste",
      headers: { authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.statusCode, 404);
  } finally {
    await app.close();
  }
});

test("Smoke: /api/norm-sync/proposals admin → 200", async () => {
  const { app, adminToken } = await setup();
  try {
    const res = await app.inject({
      method: "GET",
      url: "/api/norm-sync/proposals",
      headers: { authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.statusCode, 200);
  } finally {
    await app.close();
  }
});

test("Smoke: /api/chatbot/query risponde con knowledge-base sui prompt noti", async () => {
  const { app, adminToken } = await setup();
  try {
    const res = await app.inject({
      method: "POST",
      url: "/api/chatbot/query",
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { question: "Quali sanzioni per mancanza DPI?" },
    });
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.ok(typeof body.answer === "string" && body.answer.length > 0);
  } finally {
    await app.close();
  }
});

test("Smoke: /api/chatbot/query rifiuta question troppo lunga (H2)", async () => {
  const { app, adminToken } = await setup();
  try {
    const res = await app.inject({
      method: "POST",
      url: "/api/chatbot/query",
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { question: "x".repeat(4001) },
    });
    assert.strictEqual(res.statusCode, 400);
  } finally {
    await app.close();
  }
});

test("Smoke: /api/chatbot/query rifiuta question vuota", async () => {
  const { app, adminToken } = await setup();
  try {
    const res = await app.inject({
      method: "POST",
      url: "/api/chatbot/query",
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { question: "   " },
    });
    assert.strictEqual(res.statusCode, 400);
  } finally {
    await app.close();
  }
});

test("Smoke: POST /api/companies supporta tutti i campi da Clienti.xlsx", async () => {
  const { app, adminToken } = await setup();
  try {
    const vat = `IT${Date.now()}`;
    const payload = {
      code: "TEST01",
      name: "Azienda Test Clienti Excel Srl",
      vatNumber: vat,
      fiscalCode: "AZNDTST01A01H501Z",
      sdiCode: "M5UXCR1",
      city: "Vibo Valentia",
      province: "VV",
      cap: "89900",
      legalAddress: "Via Roma 1",
      localUnitAddress: "Corso Umberto 2",
      phone: "096312345",
      mobilePhone: "3331234567",
      email: "test@azienda.it",
      pec: "test@pec.azienda.it",
      bankCoordinates: "IT60X0542811101000000123456",
      atecoCode: "56.10.11",
      riskLevel: "Basso",
      legalForm: "S.r.l.",
      reaNumber: "VV-99999",
      employeesInfo: "10 dipendenti",
      description: "Test anagrafica completa",
    };

    const res = await app.inject({
      method: "POST",
      url: "/api/companies",
      headers: { authorization: `Bearer ${adminToken}` },
      payload,
    });

    assert.strictEqual(res.statusCode, 201);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.code, "TEST01");
    assert.strictEqual(body.fiscalCode, "AZNDTST01A01H501Z");
    assert.strictEqual(body.sdiCode, "M5UXCR1");
    assert.strictEqual(body.province, "VV");
    assert.strictEqual(body.cap, "89900");
    assert.strictEqual(body.mobilePhone, "3331234567");
    assert.strictEqual(body.bankCoordinates, "IT60X0542811101000000123456");
  } finally {
    await app.close();
  }
});

console.log("Smoke tests loaded.");
