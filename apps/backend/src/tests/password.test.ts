import { describe, it } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import argon2 from "argon2";
import {
  consumeDummyVerify,
  hashPassword,
  isArgon2Hash,
  isBcryptHash,
  shouldRehash,
  verifyPassword,
} from "../plugins/password.js";

const PASSWORD = "FedShield-Argon2!";

describe("password plugin", () => {
  it("hashPassword genera un hash argon2id", async () => {
    const hash = await hashPassword(PASSWORD);
    assert.equal(isArgon2Hash(hash), true);
    assert.equal(isBcryptHash(hash), false);
  });

  it("verifyPassword valida un hash argon2id", async () => {
    const hash = await hashPassword(PASSWORD);
    assert.equal(await verifyPassword(PASSWORD, hash), true);
    assert.equal(await verifyPassword("wrong-password", hash), false);
  });

  it("verifyPassword valida hash bcrypt legacy", async () => {
    const legacyHash = bcrypt.hashSync(PASSWORD, 10);
    assert.equal(isBcryptHash(legacyHash), true);
    assert.equal(await verifyPassword(PASSWORD, legacyHash), true);
    assert.equal(await verifyPassword("wrong-password", legacyHash), false);
  });

  it("shouldRehash è true solo per hash bcrypt", async () => {
    const argon2Hash = await argon2.hash(PASSWORD, { type: argon2.argon2id });
    const bcryptHash = bcrypt.hashSync(PASSWORD, 10);
    assert.equal(await shouldRehash(argon2Hash), false);
    assert.equal(await shouldRehash(bcryptHash), true);
  });

  it("verifyPassword ritorna false per hash con prefisso sconosciuto", async () => {
    assert.equal(await verifyPassword(PASSWORD, "not-an-actual-hash"), false);
  });

  it("consumeDummyVerify uniforma la latenza al verify reale (anti-timing M1)", async () => {
    // Warmup per ammortizzare init JIT/cache argon2
    await consumeDummyVerify("warmup-1");
    const realHash = await hashPassword(PASSWORD);
    await verifyPassword("warmup", realHash);

    const t0 = process.hrtime.bigint();
    await consumeDummyVerify("anything");
    const dummyMs = Number(process.hrtime.bigint() - t0) / 1e6;

    const t1 = process.hrtime.bigint();
    await verifyPassword("wrong-password", realHash);
    const realMs = Number(process.hrtime.bigint() - t1) / 1e6;

    // Tolleranza generosa (entrambi devono essere "lenti" — non submillisecond)
    assert.ok(dummyMs > 5, `dummy verify troppo veloce: ${dummyMs}ms`);
    assert.ok(realMs > 5, `real verify troppo veloce: ${realMs}ms`);
    // I tempi devono essere nello stesso ordine di grandezza (rapporto < 4×)
    const ratio = Math.max(dummyMs, realMs) / Math.min(dummyMs, realMs);
    assert.ok(
      ratio < 4,
      `latenza non uniforme: dummy=${dummyMs.toFixed(1)}ms real=${realMs.toFixed(1)}ms (ratio ${ratio.toFixed(2)})`,
    );
  });
});
