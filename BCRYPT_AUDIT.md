# BCRYPT_AUDIT — Plan rimozione `bcryptjs` legacy

**Data**: 2026-04-26
**Auditor**: senior-backend agent (read-only)
**Branch corrente**: `fix/audit-p0-runtime-breakers`
**Riferimenti**:
- Sprint 3 commit `a253b9e` (`feat(security): migrazione bcryptjs → argon2id (S3-7, PRD NF-03)`)
- PRD requisito NF-03 (argon2 strict)
- Plugin: `apps/backend/src/plugins/password.ts`

---

## 1. Inventario codice — occorrenze `bcrypt` / `bcryptjs`

Scansione fatta con Grep su tutto il repo, escludendo `node_modules` e lock file
(citati a parte). Le occorrenze nei doc Markdown (`AUDIT_2026-04-25.md`,
`FILE_CONTEXT.md`, `FEDSHIELD_CONTEXT.md`, `DOCS_AUDIT.md`, `README.md`) sono
puramente narrative e non producono import/runtime — non sono incluse qui.

### 1.1 Runtime usage (chiamate vere a `bcrypt.*`)

| File | Linea | Codice | Scopo | Categoria |
|---|---|---|---|---|
| `apps/backend/src/plugins/password.ts` | 2 | `import bcrypt from "bcryptjs";` | Import del verifier legacy | Runtime (production) |
| `apps/backend/src/plugins/password.ts` | 41 | `return bcrypt.compare(plain, hash);` | Verifica hash legacy `$2a$/$2b$/$2y$` quando `verifyPassword()` riconosce il prefix bcrypt | Runtime (production) |
| `apps/backend/src/tests/password.test.ts` | 3 | `import bcrypt from "bcryptjs";` | Import nei test | Runtime (test only) |
| `apps/backend/src/tests/password.test.ts` | 30 | `bcrypt.hashSync(PASSWORD, 10)` | Genera hash legacy in `verifyPassword valida hash bcrypt legacy` | Runtime (test fixture) |
| `apps/backend/src/tests/password.test.ts` | 38 | `bcrypt.hashSync(PASSWORD, 10)` | Genera hash legacy in `shouldRehash è true solo per hash bcrypt` | Runtime (test fixture) |

**Tot. import bcrypt**: 2 file source (`password.ts` + `password.test.ts`).
**Tot. callsites runtime**: 1 in production (`bcrypt.compare`) + 2 in test (`bcrypt.hashSync`).

### 1.2 Type-only / config / package metadata

| File | Linea | Voce | Note |
|---|---|---|---|
| `apps/backend/package.json` | 27 | `"bcryptjs": "^3.0.2"` (dependencies) | Dipendenza runtime ancora installata |
| `apps/backend/package.json` | 35 | `"@types/bcryptjs": "^2.4.6"` (devDependencies) | Type-only, eliminabile contestualmente |
| `pnpm-lock.yaml` | 38 / 57 / 1377 / 1647 / 5497 / 5834 | Risoluzione versioni `bcryptjs@3.0.3`, `@types/bcryptjs@2.4.6` | Auto-generato — si aggiorna da solo dopo `pnpm install` |

### 1.3 Riferimenti documentali (no codice)

- `apps/backend/src/modules/auth/routes.ts:48,56` — solo log/commenti `Password rehashed bcrypt → argon2id` (nessun import bcrypt). NON tocca runtime bcrypt. **NON-BLOCKING** per la rimozione.
- `apps/backend/prisma/seed-horeca.ts:4,138` — commenti che documentano "rimosso user seeding bcrypt". NON tocca runtime. **NON-BLOCKING**.

### 1.4 File esplicitamente confermati free di bcrypt

- `apps/backend/prisma/seed-users.ts` — solo argon2id
- `apps/backend/prisma/add-user.ts` — solo argon2id
- `apps/backend/prisma/seed-{horeca,agricoltura,edilizia,metalmeccanico,sanita,uffici,training,checklist,test-baseline}.ts` — non hashano password (delegato a `seed-users.ts`)
- `apps/desktop/src/**` — nessun import bcrypt né argon2 (delega `/auth/login` al backend)
- `apps/tablet/src/**` — nessun import bcrypt né argon2 (Expo client, delega autenticazione al backend HTTP)
- `apps/backend/src/server.ts` + tutti gli altri moduli backend — nessun import diretto

### 1.5 Sintesi inventario

```
Source files che importano bcryptjs runtime:   2
  - apps/backend/src/plugins/password.ts      (production fallback)
  - apps/backend/src/tests/password.test.ts   (test fixture per legacy)

Production runtime callsites:                  1  (bcrypt.compare)
Test fixture callsites:                        2  (bcrypt.hashSync x2)

package.json declarations:                     2  (bcryptjs + @types/bcryptjs)
Lock file entries:                            6  (auto-managed)
```

---

## 2. DB audit query plan — script `audit-password-hashes.ts`

**Path proposto**: `apps/backend/scripts/audit-password-hashes.ts`
**Stato**: NON committato. Codice incluso solo come allegato in questo report.
**Esecuzione**: `pnpm --filter @fedshield/backend exec tsx scripts/audit-password-hashes.ts`

### 2.1 Comportamento

1. Apre Prisma client (riusa `DATABASE_URL` da `.env`)
2. Conta `User.passwordHash` separati per prefix:
   - `$argon2id$` / `$argon2i$` / `$argon2d$` → `argon2`
   - `$2a$` / `$2b$` / `$2y$` → `bcrypt`
   - altro → `unknown` (dovrebbe essere 0; se >0 è un'anomalia da investigare)
3. Stampa breakdown globale + per role (`junior` / `senior` / `admin`)
4. Exit code:
   - `0` → 100% argon2 (rimozione SAFE)
   - `1` → almeno 1 hash bcrypt o unknown (NEEDS-MIGRATION)

### 2.2 Codice (allegato — NON committato)

```typescript
// apps/backend/scripts/audit-password-hashes.ts
//
// Audit read-only su User.passwordHash: conta gli hash per algoritmo
// (argon2 vs bcrypt vs unknown) e stampa breakdown per role.
//
// Uso:
//   pnpm --filter @fedshield/backend exec tsx scripts/audit-password-hashes.ts
//
// Exit code:
//   0 → tutti argon2 (rimozione bcryptjs SAFE)
//   1 → presenti hash legacy bcrypt o sconosciuti (rimozione NON SAFE)
//
// Read-only: nessuna mutation sul DB.

import { PrismaClient } from "@prisma/client";

type Algo = "argon2" | "bcrypt" | "unknown";

function classify(hash: string): Algo {
  if (hash.startsWith("$argon2")) return "argon2";
  if (/^\$2[aby]\$/.test(hash)) return "bcrypt";
  return "unknown";
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, passwordHash: true },
    });

    const totals: Record<Algo, number> = { argon2: 0, bcrypt: 0, unknown: 0 };
    const byRole: Record<string, Record<Algo, number>> = {};

    for (const u of users) {
      const algo = classify(u.passwordHash);
      totals[algo]++;
      byRole[u.role] ??= { argon2: 0, bcrypt: 0, unknown: 0 };
      byRole[u.role][algo]++;
      if (algo !== "argon2") {
        // Log dettagliato solo per i non-argon2 (utenti che richiedono re-hash)
        console.warn(
          `  legacy: id=${u.id} email=${u.email} role=${u.role} algo=${algo}`,
        );
      }
    }

    console.log("\n=== Password hash audit ===");
    console.log(`Total users:       ${users.length}`);
    console.log(`  argon2:          ${totals.argon2}`);
    console.log(`  bcrypt (legacy): ${totals.bcrypt}`);
    console.log(`  unknown:         ${totals.unknown}`);

    console.log("\n=== Breakdown per role ===");
    for (const [role, c] of Object.entries(byRole).sort()) {
      console.log(
        `  ${role.padEnd(8)}  argon2=${c.argon2}  bcrypt=${c.bcrypt}  unknown=${c.unknown}`,
      );
    }

    const cleanlyMigrated = totals.bcrypt === 0 && totals.unknown === 0;
    if (cleanlyMigrated) {
      console.log("\n[OK] 100% argon2id — SAFE TO REMOVE bcryptjs.");
      process.exit(0);
    } else {
      console.log("\n[FAIL] Hash legacy/unknown ancora presenti — NON rimuovere bcryptjs.");
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("audit-password-hashes failed:", err);
  process.exit(2);
});
```

### 2.3 Note di sicurezza

- Read-only: nessuna `update`/`delete`/`upsert`. Anche se eseguito su prod non muta dati.
- Logga email di utenti con hash legacy: in prod va eseguito su VPS via SSH, l'output non deve uscire da quel canale (PII).
- Non logga mai il `passwordHash` completo (sarebbe materiale offline-attaccabile per le password bcrypt).

---

## 3. Removal feasibility matrix

| Step | Action | Blocking | Risk | Note |
|------|--------|----------|------|------|
| 1 | Eseguire `audit-password-hashes.ts` su DB dev | — | nessuno | Read-only. In dev tutti gli utenti sono creati con argon2 da `seed-users.ts` Sprint 3+, ci si aspetta exit 0 immediato. |
| 2 | Eseguire `audit-password-hashes.ts` su DB prod | richiede VPS access (SSH + `DATABASE_URL` prod) | basso | Read-only. È l'unico step che dipende da accesso prod. Se prod usa SQLite locale al VPS bisogna runnarlo direttamente lì; con Postgres pronto si può fare anche da remoto via tunnel SSH. |
| 3 | Forzare re-hash su login per utenti bcrypt residui | — | medio (UX) | Già implementato in `auth/routes.ts:48-60`. Richiede solo che ogni utente bcrypt si autentichi almeno una volta. Per accelerare: comunicazione a utenti con hash legacy + monitor log `Password rehashed bcrypt → argon2id`. Step alternativo: reset password forzato (ma rompe UX). |
| 4 | Rimuovere il branch `isBcryptHash` da `verifyPassword` (`plugins/password.ts:40-42`), rimuovere `import bcrypt`, rimuovere `isBcryptHash`/`shouldRehash` (o mantenere solo come deprecato), rimuovere il blocco `if (await shouldRehash...)` da `auth/routes.ts:49-60` | step 2 = exit 0 (100% argon2) | medio | Dopo questo step, qualsiasi hash legacy residuo causa **login impossibile** per quel-utente: l'admin dovrà resettare password manualmente (`add-user.ts` + invio nuova password OTP). Tenere `add-user.ts` come escape hatch documentata. |
| 5 | Rimuovere `bcryptjs` da `apps/backend/package.json` deps | step 4 done | basso | Solo dopo che `import bcrypt from "bcryptjs"` non esiste più nel sorgente, altrimenti `tsc` fallisce. Aggiornare `apps/backend/src/tests/password.test.ts` rimuovendo i 2 test legacy bcrypt (`verifyPassword valida hash bcrypt legacy`, `shouldRehash è true solo per hash bcrypt`) — restano i test argon2 + dummy verify. |
| 6 | Rimuovere `@types/bcryptjs` da `apps/backend/package.json` devDeps | step 5 done | nessuno | Pulizia finale. `pnpm install` rigenera lock file senza voci bcryptjs. |
| 7 (consigliato) | Aggiornare doc (`README.md` riga 201, `FEDSHIELD_CONTEXT.md` backlog, `DOCS_AUDIT.md`, `FILE_CONTEXT.md`) per riflettere "argon2id only, no fallback legacy" | step 6 done | nessuno | Cambio narrativo, aggiornare anche `AUDIT_2026-04-25.md` se viene riprocessato. |

---

## 4. Decisione

**`NEEDS-PROD-VERIFY`**

Motivazione:
- In **dev** la rimozione è quasi certamente safe (tutti i seed Sprint 5+ usano argon2id, `seed-users.ts` ha hash argon2 garantito ad ogni `pnpm db:seed:users`).
- In **prod** non c'è alcun audit confermato. Il commit `a253b9e` (Sprint 3) data 2026-04-26 — quasi tutti gli utenti reali sono stati creati DOPO la migrazione, però:
  - non c'è accesso al VPS in questo audit (read-only)
  - non si conosce il numero di utenti pre-Sprint-3 che potrebbero non aver ancora fatto un login post-migrazione
  - il rischio è basso ma non nullo: anche un singolo utente bcrypt residuo viene escluso dal login dopo lo step 4
- La feature di re-hash opportunistico (`shouldRehash` + branch in `auth/routes.ts`) è già attiva da Sprint 3, quindi il rischio è già in calo monotonico — basta eseguire lo script di audit prima di procedere.

**Quando passare a `SAFE-TO-REMOVE-NOW`**: dopo che `audit-password-hashes.ts` su DB prod ritorna exit code 0 (totals.bcrypt = 0 AND totals.unknown = 0).

---

## 5. Tempi stimati

| Step | Effort | Calendar time | Note |
|---|---|---|---|
| 1 — audit dev DB | 5 min | < 1 h | Solo `pnpm exec tsx scripts/audit-password-hashes.ts` su dev. |
| 2 — audit prod DB | 15 min | 1 giorno (dipende da finestra accesso VPS) | SSH + run script. Se prod è Postgres remoto: tunnel + run locale. |
| 3 — finestra di re-hash organico | 0 min lavoro | 1–4 settimane | Aspettare che gli utenti facciano login. Monitor log Fastify per `Password rehashed bcrypt → argon2id` con grep. Alternativa accelerata: forzare password reset agli utenti bcrypt residui (decisione di prodotto). |
| 4 — rimuovere branch bcrypt da `password.ts` + `auth/routes.ts` + 2 test | 1 h | 1 PR | Toccare 3 file: `password.ts`, `routes.ts`, `password.test.ts`. Lasciare `isBcryptHash` come export deprecato è opzionale; preferito rimuoverlo per non lasciare codice morto. |
| 5 — rimuovere `bcryptjs` da deps | 10 min | stesso PR di step 4 | `pnpm remove bcryptjs --filter @fedshield/backend`. |
| 6 — rimuovere `@types/bcryptjs` | 5 min | stesso PR | `pnpm remove @types/bcryptjs --filter @fedshield/backend -D`. |
| 7 — doc update | 30 min | stesso PR | README, FEDSHIELD_CONTEXT, DOCS_AUDIT, FILE_CONTEXT. |
| **Totale lavoro attivo** | **~2h** | | |
| **Totale calendar (incluso wait re-hash)** | | **2–6 settimane** | Domina il wait di step 3, non il coding. |

Suggerimento workflow:
1. Subito: PR (a) `chore(audit): aggiungi script audit-password-hashes` con il file `apps/backend/scripts/audit-password-hashes.ts` + entry in `package.json` script `db:audit:passwords`. Costo: 30 min.
2. Run audit dev → run audit prod → monitorare drift bcrypt→argon2 settimanalmente.
3. Quando audit prod = 0 bcrypt: PR (b) `chore(security): rimuovi fallback bcryptjs (DB 100% argon2id)` con step 4-5-6-7. Costo: 2h.

---

## 6. Note ulteriori — dipendenze e considerazioni collaterali

### 6.1 Tablet app (`apps/tablet/`)
Verificato: **NESSUN import** di `bcryptjs`/`argon2`. L'app tablet (Expo) si autentica solo via HTTP `POST /auth/login` al backend, riceve un JWT e lo persiste localmente. La rimozione di bcryptjs lato backend è **trasparente** al tablet purché la migration argon2 sia completa lato server.

### 6.2 Desktop app (`apps/desktop/`)
Verificato: nessun riferimento a hashing. La desktop chiama `/auth/login` esattamente come il tablet (`apps/desktop/src/api.ts`, `LoginPage.tsx`). Stessa conclusione: trasparente alla migrazione.

### 6.3 Test suite (`apps/backend/src/tests/password.test.ts`)
2 test verranno **eliminati** allo step 4:
- `verifyPassword valida hash bcrypt legacy` (linee 29–34)
- `shouldRehash è true solo per hash bcrypt` (linee 36–41)

Restano: `hashPassword genera argon2id`, `verifyPassword valida argon2id`, `verifyPassword false su prefisso sconosciuto`, `consumeDummyVerify uniforma latenza`. Coverage password resta robusta.

### 6.4 `add-user.ts` come escape hatch
Tenere `apps/backend/prisma/add-user.ts` documentato come "in caso un utente legacy non riesca a fare login post-rimozione bcrypt, ricreargli l'hash con argon2id". Già usa argon2 — nessuna modifica.

### 6.5 PRD e doc
- `PRD NF-03` chiede argon2 strict — la rimozione di bcryptjs porta il backend in **conformità piena** con NF-03 (oggi è "argon2 + fallback bcrypt").
- `AUDIT_2026-04-25.md` linee 114, 234, 301 vanno aggiornate (P1-14 attualmente flagged come PARTIAL/discrepanza) — diventeranno OK.
- `DOCS_AUDIT.md` linee 26, 65, 96, 107, 182, 243 menzionano la situazione duale: vanno semplificate.
- `FEDSHIELD_CONTEXT.md` linee 364, 384 descrivono già "rimozione bcryptjs quando DB tutto argon2" come backlog priorità Bassa: con questo report si può promuoverlo a una task concreta del prossimo Sprint.
- `FILE_CONTEXT.md` linee 36, 242 e `README.md` linea 201 vanno aggiornate post-rimozione.

### 6.6 `package.json` root
Verificato: `pnpm.onlyBuiltDependencies` lista `argon2` (necessario per il modulo nativo). **NON serve modifica** — bcryptjs è pure-JS, non era in `onlyBuiltDependencies`. Niente cleanup richiesto.

### 6.7 CI/CD
Il GitHub Actions workflow `ci-backend-desktop.yml` (Sprint 9, commit `ddc3394`) esegue `pnpm test` che gira `password.test.ts`: dopo la rimozione bcrypt, i 2 test legacy spariscono ma gli altri 5 continuano a passare. Da verificare che il pipeline non abbia step espliciti `pnpm list bcryptjs`.

### 6.8 Prisma migrations
Nessuna migration coinvolta: la colonna `User.passwordHash` resta `String`. Il cambio è puramente runtime, non schema-level.

---

## TL;DR

- **2 file source** importano `bcryptjs`: `plugins/password.ts` (1 chiamata `bcrypt.compare`) e `tests/password.test.ts` (2 fixture).
- **Tablet e desktop** NON dipendono da bcrypt.
- **Decisione**: `NEEDS-PROD-VERIFY` — eseguire prima `apps/backend/scripts/audit-password-hashes.ts` su DB prod e verificare exit 0.
- **Effort coding**: ~2h totali in 1 PR, ma serve **2–6 settimane di calendar** per attendere il re-hash organico via login (oppure forzare reset password).
- **Step ordinati**: audit dev → audit prod → wait re-hash → rimuovi branch bcrypt nel codice → rimuovi dep + types → aggiorna doc.
- **Output del PR finale**: `apps/backend/package.json` perde 2 voci, `plugins/password.ts` scende a ~50 righe, NF-03 raggiunge conformità strict.
