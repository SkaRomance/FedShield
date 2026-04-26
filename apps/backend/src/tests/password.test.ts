import { describe, it } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import argon2 from "argon2";
import {
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
});
