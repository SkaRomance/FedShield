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

// Hash dummy precomputato di una password che NON corrisponde a nessun utente,
// usato solo per uniformare i tempi di risposta nel ramo "user not found"
// di /auth/login (anti user-enumeration timing-side, OWASP). Ricomputarlo
// ogni volta sarebbe costoso e darebbe latenza diversa.
let cachedDummyHash: string | null = null;
async function getDummyHash(): Promise<string> {
  if (!cachedDummyHash) {
    cachedDummyHash = await argon2.hash("not-a-real-password", ARGON2_OPTS);
  }
  return cachedDummyHash;
}

/**
 * Esegue argon2.verify su un hash dummy noto-non-matching così che il tempo
 * speso nel ramo "email non registrata" di /auth/login sia indistinguibile
 * da una verifica reale fallita. Sempre ritorna false. Errori soppressi
 * (verify può lanciare se l'hash è malformato — qui non succede).
 */
export async function consumeDummyVerify(plain: string): Promise<false> {
  try {
    const dummy = await getDummyHash();
    await argon2.verify(dummy, plain);
  } catch {
    /* swallow: non vogliamo che la verifica dummy sollevi 500 */
  }
  return false;
}
