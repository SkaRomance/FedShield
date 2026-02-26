import assert from "node:assert/strict";
import { buildApp } from "../app.js";

async function run() {
  const app = buildApp();
  const deviceId = `fedshield-device-${Date.now()}`;

  const activate = await app.inject({
    method: "POST",
    url: "/api/licensing/activate",
    payload: {
      deviceId,
      deviceName: "Tablet Sala 1",
      platform: "android",
      appVersion: "0.5.0",
      activationCode: "FEDSHIELD-DEMO-KEY",
    },
  });
  assert.equal(activate.statusCode, 200);
  const activated = activate.json();
  assert.ok(activated.heartbeatToken);

  const validate = await app.inject({
    method: "POST",
    url: "/api/licensing/validate",
    payload: {
      deviceId,
      heartbeatToken: activated.heartbeatToken,
    },
  });
  assert.equal(validate.statusCode, 200);
  assert.equal(validate.json().isActive, true);

  const heartbeat = await app.inject({
    method: "POST",
    url: "/api/licensing/heartbeat",
    payload: {
      deviceId,
      heartbeatToken: activated.heartbeatToken,
      appVersion: "0.5.1",
    },
  });
  assert.equal(heartbeat.statusCode, 200);
  assert.equal(heartbeat.json().heartbeatAccepted, true);

  const login = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: {
      email: "admin@fedshield.local",
      password: "fedshield123",
    },
  });
  assert.equal(login.statusCode, 200);
  const token = login.json().token as string;

  const push1 = await app.inject({
    method: "POST",
    url: "/api/sync/push",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      deviceId,
      heartbeatToken: activated.heartbeatToken,
      events: [
        {
          clientEventId: "evt-1",
          eventType: "inspection.created",
          entityType: "inspection",
          entityId: "insp-1",
          payload: { title: "Demo" },
          occurredAt: new Date().toISOString(),
        },
        {
          clientEventId: "evt-2",
          eventType: "quote.updated",
          entityType: "quote",
          entityId: "quote-1",
          payload: { status: "accepted" },
          occurredAt: new Date().toISOString(),
        },
      ],
    },
  });
  assert.equal(push1.statusCode, 200);
  assert.equal(push1.json().accepted, 2);

  const pushDuplicate = await app.inject({
    method: "POST",
    url: "/api/sync/push",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      deviceId,
      heartbeatToken: activated.heartbeatToken,
      events: [
        {
          clientEventId: "evt-1",
          eventType: "inspection.created",
          entityType: "inspection",
          entityId: "insp-1",
          payload: { title: "Demo" },
          occurredAt: new Date().toISOString(),
        },
      ],
    },
  });
  assert.equal(pushDuplicate.statusCode, 200);
  assert.equal(pushDuplicate.json().duplicates, 1);

  const pull = await app.inject({
    method: "POST",
    url: "/api/sync/pull",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      deviceId,
      heartbeatToken: activated.heartbeatToken,
      since: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  });
  assert.equal(pull.statusCode, 200);
  assert.ok(pull.json().data);

  const ack = await app.inject({
    method: "POST",
    url: "/api/sync/ack",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      deviceId,
      heartbeatToken: activated.heartbeatToken,
      cursor: new Date().toISOString(),
    },
  });
  assert.equal(ack.statusCode, 200);
  assert.equal(ack.json().acknowledged, true);

  const revoke = await app.inject({
    method: "POST",
    url: "/api/licensing/revoke",
    headers: { authorization: `Bearer ${token}` },
    payload: {
      deviceId,
      reason: "revoca test",
    },
  });
  assert.equal(revoke.statusCode, 200);

  const validateAfterRevoke = await app.inject({
    method: "POST",
    url: "/api/licensing/validate",
    payload: {
      deviceId,
      heartbeatToken: activated.heartbeatToken,
    },
  });
  assert.equal(validateAfterRevoke.statusCode, 200);
  assert.equal(validateAfterRevoke.json().isActive, false);

  console.log("Licensing and sync test passed");
  await app.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
