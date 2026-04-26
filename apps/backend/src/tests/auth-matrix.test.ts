// Auth matrix test — Sprint 1
//
// Verifica che la catena di autorizzazione delle route mutating sia coerente:
// - 401 senza JWT
// - 403 con ruolo "junior" su mutazioni di master-data
// - guard passa per "senior" e "admin" sulle stesse route
//
// Genera i token via app.jwt.sign senza passare da /auth/login: NON richiede
// utenti seedati nel DB e mantiene il test isolato dal flow di credenziali.

import { test } from "node:test";
import assert from "node:assert";
import { buildApp } from "../app.js";

type Role = "junior" | "senior" | "admin";

async function setup() {
  const app = buildApp();
  await app.ready();

  const sign = (role: Role, id = `test-user-${role}`) =>
    app.jwt.sign({ sub: id, email: `${role}@fedshield.test`, role });

  return { app, sign };
}

// Casi di test condivisi: route mutating master-data che richiedono
// senior+admin (audit § P1-1).
type Mutation = {
  method: "POST" | "PATCH" | "DELETE";
  url: string;
  payload?: Record<string, unknown>;
};

const masterDataMutations: Mutation[] = [
  {
    method: "POST",
    url: "/api/employees",
    payload: { companyId: "fake-id", firstName: "Test", lastName: "User" },
  },
  {
    method: "POST",
    url: "/api/equipment",
    payload: { companyId: "fake-id", name: "X", type: "Y" },
  },
  {
    method: "POST",
    url: "/api/machines",
    payload: { companyId: "fake-id", name: "X", type: "Y" },
  },
  {
    method: "POST",
    url: "/api/fire-extinguishers",
    payload: { companyId: "fake-id", code: "C1", type: "Polvere", location: "X" },
  },
  {
    method: "POST",
    url: "/api/first-aid-kits",
    payload: { companyId: "fake-id", location: "X" },
  },
  {
    method: "POST",
    url: "/api/training/courses",
    payload: {
      name: "Test",
      targetAudience: "Lavoratori",
      minHours: 1,
      frequencyYears: 1,
      normReference: "X",
    },
  },
  {
    method: "POST",
    url: "/api/training/requirements",
    payload: { courseId: "x", atecoCode: "01" },
  },
  {
    method: "POST",
    url: "/api/companies",
    payload: { name: "Test", vatNumber: "12345678" },
  },
];

test("Auth: 401 senza JWT su tutte le mutazioni master-data", async () => {
  const { app } = await setup();
  try {
    for (const c of masterDataMutations) {
      const res = await app.inject({
        method: c.method,
        url: c.url,
        payload: c.payload,
      });
      assert.strictEqual(
        res.statusCode,
        401,
        `${c.method} ${c.url}: atteso 401, ricevuto ${res.statusCode}`,
      );
    }
  } finally {
    await app.close();
  }
});

test("Auth: 403 per junior su mutazioni master-data", async () => {
  const { app, sign } = await setup();
  try {
    const juniorToken = sign("junior");
    for (const c of masterDataMutations) {
      const res = await app.inject({
        method: c.method,
        url: c.url,
        headers: { authorization: `Bearer ${juniorToken}` },
        payload: c.payload,
      });
      assert.strictEqual(
        res.statusCode,
        403,
        `${c.method} ${c.url}: junior dovrebbe ricevere 403, ricevuto ${res.statusCode}`,
      );
    }
  } finally {
    await app.close();
  }
});

test("Auth: guard passa per senior e admin (no 401/403)", async () => {
  const { app, sign } = await setup();
  try {
    for (const role of ["senior", "admin"] as const) {
      const token = sign(role);
      // Provo solo una route — gli altri payload userebbero companyId fittizi
      // che farebbero fallire la business logic con 5xx prima del nostro
      // controllo. /training/courses non ha FK obbligatori, quindi attraversa
      // tutti i guard puliti.
      const res = await app.inject({
        method: "POST",
        url: "/api/training/courses",
        headers: { authorization: `Bearer ${token}` },
        payload: {
          name: `Test guard ${role}`,
          targetAudience: "Lavoratori",
          minHours: 1,
          frequencyYears: 1,
          normReference: "Test",
        },
      });
      assert.notStrictEqual(
        res.statusCode,
        401,
        `${role}: non doveva essere 401`,
      );
      assert.notStrictEqual(
        res.statusCode,
        403,
        `${role}: non doveva essere 403 (body: ${res.body})`,
      );
    }
  } finally {
    await app.close();
  }
});

test("Auth: GET pubblici (junior può leggere)", async () => {
  const { app, sign } = await setup();
  try {
    const juniorToken = sign("junior");
    const reads = ["/api/companies", "/api/training/courses", "/api/equipment"];
    for (const url of reads) {
      const res = await app.inject({
        method: "GET",
        url,
        headers: { authorization: `Bearer ${juniorToken}` },
      });
      assert.strictEqual(
        res.statusCode,
        200,
        `junior GET ${url}: atteso 200, ricevuto ${res.statusCode}`,
      );
    }
  } finally {
    await app.close();
  }
});

test("Auth: norm-sync proposals admin-only (junior bloccato)", async () => {
  const { app, sign } = await setup();
  try {
    const juniorToken = sign("junior");
    const seniorToken = sign("senior");
    const adminToken = sign("admin");

    // junior → 403
    const j = await app.inject({
      method: "GET",
      url: "/api/norm-sync/proposals",
      headers: { authorization: `Bearer ${juniorToken}` },
    });
    assert.strictEqual(j.statusCode, 403);

    // senior → 403 (proposte sono admin-only)
    const s = await app.inject({
      method: "GET",
      url: "/api/norm-sync/proposals",
      headers: { authorization: `Bearer ${seniorToken}` },
    });
    assert.strictEqual(s.statusCode, 403);

    // admin → 200
    const a = await app.inject({
      method: "GET",
      url: "/api/norm-sync/proposals",
      headers: { authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(a.statusCode, 200);
  } finally {
    await app.close();
  }
});

console.log("Auth matrix tests loaded.");
