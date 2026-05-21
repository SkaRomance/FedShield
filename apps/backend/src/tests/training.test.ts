import { test } from "node:test";
import assert from "node:assert";
import { buildApp } from "../app.js";

async function setup() {
  const app = buildApp();
  await app.ready();

  // login admin
  const login = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: { email: "admin@fedshield.local", password: "fedshield123" },
  });
  const token = JSON.parse(login.body).token;

  return { app, token };
}

test("Training Course CRUD", async () => {
  const { app, token } = await setup();

  // Create course
  const create = await app.inject({
    method: "POST",
    url: "/api/training/courses",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      name: "Test Corso",
      targetAudience: "Lavoratori",
      minHours: 4,
      frequencyYears: 5,
      normReference: "D.Lgs. 81/2008",
      domain: "safety",
    },
  });
  assert.strictEqual(create.statusCode, 201);
  const course = JSON.parse(create.body);
  assert.ok(course.id);

  // List courses
  const list = await app.inject({
    method: "GET",
    url: "/api/training/courses",
    headers: { authorization: `Bearer ${token}` },
  });
  assert.strictEqual(list.statusCode, 200);
  const courses = JSON.parse(list.body);
  assert.ok(courses.length > 0);

  // Get single
  const get = await app.inject({
    method: "GET",
    url: `/api/training/courses/${course.id}`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.strictEqual(get.statusCode, 200);
  assert.strictEqual(JSON.parse(get.body).name, "Test Corso");

  await app.close();
});

test("Employee Training Record with expiry", async () => {
  const { app, token } = await setup();

  // Assumes demo company exists
  const company = await app.prisma.company.findFirst({ where: { atecoCode: "56.10.11" } });
  assert.ok(company, "Demo company not found");

  // Create employee
  const empRes = await app.inject({
    method: "POST",
    url: "/api/employees",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      companyId: company.id,
      firstName: "Mario",
      lastName: "Rossi",
      fiscalCode: "RSSMRA80A01F205X",
      role: "Cuoco",
    },
  });
  assert.strictEqual(empRes.statusCode, 201);
  const employee = JSON.parse(empRes.body);

  // Get a course
  const courses = await app.inject({
    method: "GET",
    url: "/api/training/courses",
    headers: { authorization: `Bearer ${token}` },
  });
  const courseList = JSON.parse(courses.body);
  const haccpA = courseList.find((c: any) => c.id === "course-haccp-a");
  assert.ok(haccpA, "HACCP course not seeded");

  // Create training record with expiry
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30); // scade tra 30 giorni

  const recordRes = await app.inject({
    method: "POST",
    url: "/api/training/records",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      employeeId: employee.id,
      courseId: haccpA.id,
      completedAt: new Date().toISOString(),
      expiresAt: expiry.toISOString(),
      hoursDone: 6,
      certificateNumber: "HACCP-12345",
    },
  });
  assert.strictEqual(recordRes.statusCode, 201);

  // Check expiring list
  const expiring = await app.inject({
    method: "GET",
    url: `/api/training/records/expiring?days=60&companyId=${company.id}`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.strictEqual(expiring.statusCode, 200);
  const expList = JSON.parse(expiring.body);
  assert.ok(expList.length >= 1);
  assert.strictEqual(expList[0].certificateNumber, "HACCP-12345");

  await app.close();
});

test("Equipment creation and expiry dashboard", async () => {
  const { app, token } = await setup();

  const company = await app.prisma.company.findFirst();
  assert.ok(company);

  // Create extinguisher
  const extRes = await app.inject({
    method: "POST",
    url: "/api/fire-extinguishers",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      companyId: company.id,
      code: "EST-001",
      type: "Polvere ABC",
      location: "Ingresso magazzino",
      nextCheckAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  });
  assert.strictEqual(extRes.statusCode, 201);

  // Create machine
  const machRes = await app.inject({
    method: "POST",
    url: "/api/machines",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      companyId: company.id,
      name: "Trapano a colonna",
      type: "Macchina utensile",
      location: "Officina A",
      nextMaintenanceAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      nextSafetyCheckAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
  });
  assert.strictEqual(machRes.statusCode, 201);

  // Dashboard overview
  const dash = await app.inject({
    method: "GET",
    url: `/api/equipment/overview?companyId=${company.id}`,
    headers: { authorization: `Bearer ${token}` },
  });
  assert.strictEqual(dash.statusCode, 200);
  const overview = JSON.parse(dash.body);
  assert.strictEqual(overview.extinguishers.total, 1);
  assert.strictEqual(overview.machines.total, 1);

  await app.close();
});

console.log("Training tests loaded.");
