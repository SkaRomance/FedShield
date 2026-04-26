// Golden-path integration test (S7-6).
//
// Esercita end-to-end il flusso operativo principale del consulente HSE:
//   login senior → create company → create employee → create training
//   course → record formazione → list records.
//
// È un test di copertura cross-modulo: incrocia auth, companies, employees,
// training-courses e employee-training-records in un'unica run. Catches
// regression che i test per-modulo isolati non vedrebbero (es: schema
// drift fra companyId nel body e nel path, audit FK, datetime parsing).

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../app.js";

test("Golden path: login senior → company → employee → corso → record", async () => {
  const app = buildApp();
  await app.ready();

  // S9 (MEDIUM-04): traccia entità create per cleanup finale e prevenire
  // accumulo righe DB su run multipli (CI usa db file persistente).
  const cleanup: { companyId?: string } = {};

  try {
    // 1. Login senior
    const loginRes = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: "senior@fedshield.local",
        password: "fedshield123",
      },
    });
    assert.strictEqual(loginRes.statusCode, 200, "login senior deve passare");
    const { token } = loginRes.json();
    const headers = { authorization: `Bearer ${token}` };

    const stamp = Date.now();

    // 2. Create company
    const companyRes = await app.inject({
      method: "POST",
      url: "/api/companies",
      headers,
      payload: {
        name: `Golden Path SRL ${stamp}`,
        vatNumber: `GP-${stamp}`,
        atecoCode: "56.10.11",
        city: "Milano",
      },
    });
    assert.strictEqual(companyRes.statusCode, 201, `create company: ${companyRes.body}`);
    const company = companyRes.json() as { id: string; name: string };
    assert.ok(company.id, "company.id deve esistere");
    cleanup.companyId = company.id;

    // 3. Create employee
    const employeeRes = await app.inject({
      method: "POST",
      url: "/api/employees",
      headers,
      payload: {
        companyId: company.id,
        firstName: "Mario",
        lastName: "Rossi",
        fiscalCode: `RSSMRA80A01F205X-${stamp}`,
        role: "Cuoco",
        department: "Cucina",
        hireDate: "2024-01-15T00:00:00.000Z",
      },
    });
    assert.strictEqual(employeeRes.statusCode, 201, `create employee: ${employeeRes.body}`);
    const employee = employeeRes.json() as { id: string; firstName: string };
    assert.strictEqual(employee.firstName, "Mario");

    // 4. Create training course
    const courseRes = await app.inject({
      method: "POST",
      url: "/api/training/courses",
      headers,
      payload: {
        name: `Sicurezza Generale ${stamp}`,
        targetAudience: "Lavoratori",
        minHours: 4,
        frequencyYears: 5,
        normReference: "D.Lgs. 81/2008, art. 37",
        domain: "safety",
      },
    });
    assert.strictEqual(courseRes.statusCode, 201, `create course: ${courseRes.body}`);
    const course = courseRes.json() as { id: string; name: string };
    assert.ok(course.id);

    // 5. Record formazione
    const recordRes = await app.inject({
      method: "POST",
      url: "/api/training/records",
      headers,
      payload: {
        employeeId: employee.id,
        courseId: course.id,
        completedAt: "2025-03-10T09:00:00.000Z",
        expiresAt: "2030-03-10T09:00:00.000Z",
        hoursDone: 4,
        certificateNumber: `CERT-${stamp}`,
      },
    });
    assert.strictEqual(recordRes.statusCode, 201, `create record: ${recordRes.body}`);
    const record = recordRes.json() as { id: string; employeeId: string; courseId: string };
    assert.strictEqual(record.employeeId, employee.id);
    assert.strictEqual(record.courseId, course.id);

    // 6. Verifica employee list mostra il record
    const empListRes = await app.inject({
      method: "GET",
      url: `/api/employees?companyId=${company.id}`,
      headers,
    });
    assert.strictEqual(empListRes.statusCode, 200);
    const empList = empListRes.json() as Array<{
      id: string;
      trainingRecords: Array<{ id: string }>;
    }>;
    const emp = empList.find((e) => e.id === employee.id);
    assert.ok(emp, "employee deve apparire nella list company-scoped");
    assert.ok(
      emp!.trainingRecords.some((r) => r.id === record.id),
      "training record deve essere incluso nell'employee",
    );

    // 7. Verifica records by employeeId
    const recordsRes = await app.inject({
      method: "GET",
      url: `/api/training/records?employeeId=${employee.id}`,
      headers,
    });
    assert.strictEqual(recordsRes.statusCode, 200);
    const records = recordsRes.json() as Array<{ id: string }>;
    assert.ok(
      records.some((r) => r.id === record.id),
      "record deve apparire nella list per employeeId",
    );

    console.log("✓ Golden path completato:", {
      companyId: company.id,
      employeeId: employee.id,
      courseId: course.id,
      recordId: record.id,
    });

    // S9: cleanup espliciti del corso (no FK company → cancella manualmente).
    // Employee + training records seguono via cascade da company.delete.
    await app.prisma.trainingCourse.delete({ where: { id: course.id } }).catch(() => {});
  } finally {
    if (cleanup.companyId) {
      await app.prisma.company.delete({ where: { id: cleanup.companyId } }).catch(() => {});
    }
    await app.close();
  }
});

test("Golden path: junior NON può creare company/employee/course (403)", async () => {
  const app = buildApp();
  await app.ready();

  try {
    const loginRes = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: "junior@fedshield.local",
        password: "fedshield123",
      },
    });
    assert.strictEqual(loginRes.statusCode, 200);
    const { token } = loginRes.json();
    const headers = { authorization: `Bearer ${token}` };

    const cases = [
      { method: "POST" as const, url: "/api/companies", payload: { name: "X", vatNumber: "12345678" } },
      {
        method: "POST" as const,
        url: "/api/employees",
        payload: { companyId: "fake", firstName: "X", lastName: "Y" },
      },
      {
        method: "POST" as const,
        url: "/api/training/courses",
        payload: {
          name: "X",
          targetAudience: "Y",
          minHours: 1,
          frequencyYears: 1,
          normReference: "Z",
        },
      },
    ];

    for (const c of cases) {
      const res = await app.inject({ method: c.method, url: c.url, headers, payload: c.payload });
      assert.strictEqual(res.statusCode, 403, `junior ${c.method} ${c.url} atteso 403, ricevuto ${res.statusCode}`);
    }
  } finally {
    await app.close();
  }
});

console.log("Golden path tests loaded.");
