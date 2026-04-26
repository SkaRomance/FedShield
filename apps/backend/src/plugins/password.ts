import argon2 from "argon2";
import bcrypt from "bcryptjs";

/**
 * Hashing password con argon2id (PRD NF-03 strict).
 *
 * Backward-compatible con hash bcrypt esistenti: verifyPassword detecta
 * il prefisso ($2a$/$2b$/$2y$ = bcrypt, $argon2 = argon2) e usa il
 * verifier corretto. Quando un login con bcrypt va a buon fine il
 * chiamante è incoraggiato a re-hashare la password con argon2id.
 */

const ARGON2_OPTS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, ARGON2_OPTS);
}

export function isBcryptHash(hash: string): boolean {
  return /^\$2[aby]\$/.test(hash);
}

export function isArgon2Hash(hash: string): boolean {
  return hash.startsWith("$argon2");
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (isArgon2Hash(hash)) {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }
  if (isBcryptHash(hash)) {
    return bcrypt.compare(plain, hash);
  }
  return false;
}

/**
 * Da chiamare dopo un login andato a buon fine quando l'hash in DB
 * è ancora in formato bcrypt: produce un hash argon2id pronto per la
 * persistenza (la PATCH del record User è responsabilità del chiamante).
 */
export async function shouldRehash(currentHash: string): Promise<boolean> {
  return isBcryptHash(currentHash);
}
