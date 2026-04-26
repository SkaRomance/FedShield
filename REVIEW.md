---
phase: sprint-7-8-pre-merge
reviewed: 2026-04-26T20:30:00Z
depth: deep
files_reviewed: 24
files_reviewed_list:
  - apps/backend/prisma/seed-horeca.ts
  - apps/backend/prisma/seed-checklist.ts
  - apps/backend/prisma/seed.ts
  - apps/backend/prisma/seed-test-baseline.ts
  - apps/backend/prisma/seed-metalmeccanico.ts
  - apps/backend/prisma/seed-sanita.ts
  - apps/backend/prisma/seed-uffici.ts
  - apps/backend/prisma/seed-agricoltura.ts
  - apps/backend/prisma/seed-edilizia.ts
  - apps/backend/prisma/seed-training.ts
  - apps/backend/prisma/schema.prisma
  - apps/backend/src/app.ts
  - apps/backend/src/plugins/auth.ts
  - apps/backend/src/modules/companies/routes.ts
  - apps/backend/src/modules/employees/routes.ts
  - apps/backend/src/modules/equipment/routes.ts
  - apps/backend/src/modules/inspections/routes.ts
  - apps/backend/src/modules/quotes/routes.ts
  - apps/backend/src/modules/training-courses/routes.ts
  - apps/backend/src/modules/norm-sync/routes.ts
  - apps/backend/src/modules/norm-sync/stats.ts
  - apps/backend/src/tests/golden-path.test.ts
  - apps/backend/package.json
  - apps/desktop/src/lib/markdown.ts
  - apps/desktop/src/lib/markdown.test.ts
  - apps/desktop/src/pages/ChatbotPage.tsx
  - apps/desktop/src/pages/AssetsPage.tsx
  - apps/desktop/src/api.ts
findings:
  high: 1
  medium: 6
  low: 5
  info: 6
  total: 18
status: issues_found
---

# Code Review Sprint 7 + Sprint 8 — Branch `feat/sprint-9-qa-docs`

**Range commit:** `dea9a22..00beba8` (9 commit + 2 merge)
**Reviewer:** Claude Opus 4.7 (1M context)
**Data:** 2026-04-26

---

## 1. Sintesi Esecutiva

I 9 commit Sprint 7+8 sono complessivamente di **buona qualità**. Le modifiche principali sono:

- **S7-1:** restore monolitico `seed-horeca.ts` (8297 righe) — scope correttamente delimitato
- **S7-2:** rate-limit env-conditional + `cross-env` Windows — fix corretto
- **S7-3:** estensione enum `ChecklistSection` (+18 valori) — sicura per SQLite
- **S7-4:** integration test golden-path end-to-end consulente HSE
- **S8-1:** allineamento 4 seed verticali allo schema corrente (+2 nuovi campi schema)
- **S8-2:** module-augmentation @fastify/jwt — rimossi 28 cast, type-safety migliorata
- **S8-3:** cap take:200 su 4 endpoint asset — prevenzione DoS payload
- **S8-4:** estrazione `markdown.ts` + test jsdom (10 test pass)

**Punti di forza:**
- Module augmentation `@fastify/jwt` correttamente implementato (segue pattern documentato)
- DOMPurify whitelist conservativa ben strutturata
- Test golden-path integra correttamente cross-modulo
- Scope deleteMany seed-horeca preciso (macroGroup OR nomi noti HoReCa)
- Cap parseLimit con clamp default/max sensato

**Aree di rischio principali:**
- **Cascade delete** su `EmployeeTrainingRecord` durante re-seed verticali (HIGH per produzione, accettabile per dev/test)
- **Pattern `request.user as { sub: string }`** ancora presente in 4 punti — type-safety incompleta
- **Cap silenzioso** su endpoint asset senza header pagination — possibile UX confusa
- **12 istanze `new PrismaClient()`** sparse fra i seed (pre-esistente, ma seed-horeca lo replica)

---

## 2. Findings per Severity

### 🔴 HIGH (1)

#### HIGH-01 — Cascade delete `EmployeeTrainingRecord` durante re-seed verticali

**File:** `apps/backend/prisma/seed-metalmeccanico.ts:174-176`, `seed-sanita.ts:169-171`, `seed-uffici.ts:169-171`, `seed-agricoltura.ts:169-171`
**Schema:** `apps/backend/prisma/schema.prisma:534` (`onDelete: Cascade` su `EmployeeTrainingRecord.courseId`)

**Problema:**
I 4 seed verticali fanno `prisma.trainingCourse.deleteMany` per idempotenza:

```ts
await prisma.trainingCourse.deleteMany({
  where: { targetAudience: "Lavoratori", normReference: { contains: "Accordo Stato-Regioni" } },
});
```

Il modello `EmployeeTrainingRecord` ha `course TrainingCourse @relation(... onDelete: Cascade)`. Quindi:

> **Se un consulente esegue `pnpm db:seed` su un DB con dati reali**, TUTTI i record di formazione dei dipendenti agganciati a quei corsi (es: certificazioni "Formazione base sicurezza lavoratori" del settore metalmeccanico) vengono **cancellati a cascata senza warning**. Stessa dinamica su sanita/uffici/agricoltura.

Questa non è una regression introdotta da S8-1 (il pattern di delete-then-recreate esisteva già nel pre-S8 metalmeccanico), ma S8-1 lo ha **stabilizzato e replicato** in 4 file, e l'aggiunta del flow `seed.ts` orchestra (linea 17-20) lo rende eseguibile da chiunque con `pnpm db:seed`.

**Fix proposto (DEFER per Sprint 9 — non bloccante per merge):**

1. **Soluzione minimale (immediata):** aggiungere guard `NODE_ENV !== "production"` all'inizio di `seed.ts`:

```ts
// apps/backend/prisma/seed.ts
async function main() {
  if (process.env.NODE_ENV === "production" && !process.env.FEDSHIELD_ALLOW_PROD_SEED) {
    throw new Error(
      "Refuse to run domain seed in production. Set FEDSHIELD_ALLOW_PROD_SEED=1 to override.",
    );
  }
  await seedChecklistTemplates();
  await seedHoreca();
  // ...
}
```

2. **Soluzione robusta (Sprint 9):** convertire i seed verticali a pattern upsert per `id` deterministico (come fa `seed-edilizia.ts` linea 8-27 con `id: "edilizia-premises-template-seed"`), cosi il delete-then-recreate diventa update-in-place che non triggera cascade.

3. **Alternative (data-loss prevention):** prima di deleteMany, verificare che non esistano `EmployeeTrainingRecord` referenziabili e rifiutare il seed:

```ts
const blockedCount = await prisma.employeeTrainingRecord.count({
  where: { course: { targetAudience: "Lavoratori", normReference: { contains: "Accordo Stato-Regioni" } } },
});
if (blockedCount > 0) {
  throw new Error(`${blockedCount} training records linked to courses to be deleted. Aborting.`);
}
```

**Rationale severity:** in dev/test il rischio è zero (DB vuoto/seed-only). In produzione (anche se MVP single-tenant) un `pnpm db:seed` accidentale comporta perdita irreversibile di certificazioni dipendenti — dati di compliance critici.

---

### 🟠 MEDIUM (6)

#### MEDIUM-01 — Cast `request.user as { sub: string; role: UserRole }` resta su 4 punti senza chiara giustificazione type-safety

**File:** `apps/backend/src/modules/inspections/routes.ts:600`, `:1012`; `apps/backend/src/modules/quotes/routes.ts:135`, `:200`

**Problema:**
Il commit message di S8-2 dichiara: *"Pattern conservato dove il consumer già asseriva sub/role come non-optional ... documenta una contract più forte e funziona perché authenticate guarantisce payload popolato in runtime."*

Tuttavia il cast forza la presenza di `sub` e `role` mentre il type augmentato in `auth.ts:8-12` li dichiara opzionali:

```ts
export interface AuthenticatedUser {
  sub?: string;  // ← optional
  email?: string;
  role?: UserRole;  // ← optional
}
```

Il cast `as { sub: string; role: UserRole }` **mente al type checker**: se per qualunque motivo il JWT carica un payload senza `sub` (es: token corrotto che passa la verifica di firma ma è malformato — improbabile ma non impossibile su JWT custom), `Prisma.inspection.create({ data: { authorId: undefined } })` fallisce con `null` not allowed su `authorId String` (NOT NULL nel modello).

**Fix proposto:**
Aggiungere validazione esplicita run-time invece di cast bugiardo:

```ts
const auth = request.user;
if (!auth.sub || !auth.role) {
  return reply.unauthorized("Token JWT incompleto.");
}
// Ora il narrowing TS è corretto, sub:string e role:UserRole.
const created = await fastify.prisma.inspection.create({
  data: {
    authorId: auth.sub,  // OK, narrowed a string
    // ...
  },
});
```

In alternativa, se si vuole mantenere il cast per brevità, almeno aggiungere un assert una sola volta in `authPlugin`:

```ts
// auth.ts
fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
    if (!request.user.sub || !request.user.role) {
      return reply.unauthorized("Payload JWT incompleto.");
    }
  } catch {
    return reply.unauthorized("Token non valido o assente.");
  }
});
```

…e poi cambiare la augmentation da `sub?: string` a `sub: string` (rendendoli required), eliminando i cast successivi.

**Rationale severity:** non è un bug oggi (il JWT è generato server-side a auth.ts:62-66 con sempre `sub/email/role`), ma il cast nasconde un fail-mode senza fallback se mai un token "diverso" arrivasse — es: rotazione manuale di JWT_SECRET con token vecchi temporaneamente accettati ma con shape diverso.

---

#### MEDIUM-02 — Cap `take:200` silenzioso senza header pagination o flag client

**File:** `apps/backend/src/modules/equipment/routes.ts:120-124`, `:139`, `:184`, `:232`, `:277`

**Problema:**
La funzione `parseLimit` clamp default 200 / max 500, ma il client non sa **se i risultati sono troncati**. Quando una company ha >200 estintori, il client desktop ne mostra 200 silenziosamente:

```ts
// AssetsPage.tsx riga 60
const ex = await fetchFireExtinguishers(token, { companyId: companyFilter });
setExtinguishers(ex); // ← se troncato, l'utente non lo sa
```

Conseguenze: il dashboard mostra "Estintori (200)" ma in realtà ce ne sono 250. Il consulente non sa che 50 sono "fuori vista". Nei contesti HSE multi-tenant questo è UX confusa.

**Fix proposto:**
Aggiungere header response che segnala troncamento:

```ts
// equipment/routes.ts riga 128 esempio per /equipment
fastify.get(
  "/equipment",
  { preHandler: [fastify.authenticate] },
  async (request, reply) => {
    const query = request.query as { companyId?: string; status?: ...; limit?: string };
    const limit = parseLimit(query);
    const total = await fastify.prisma.equipment.count({
      where: { ...(query.companyId ? { companyId: query.companyId } : {}), ... },
    });
    const items = await fastify.prisma.equipment.findMany({
      where: { ...(query.companyId ? { companyId: query.companyId } : {}), ... },
      orderBy: { nextCheckAt: "asc" },
      take: limit,
    });
    reply.header("X-Total-Count", total.toString());
    reply.header("X-Limit", limit.toString());
    if (total > items.length) reply.header("X-Truncated", "true");
    return items;
  },
);
```

E lato client (AssetsPage.tsx): controllare l'header e mostrare warning UI ("Visualizzati primi 200 di 250 — affina il filtro") OPPURE implementare pagination button "Carica altri".

**Rationale severity:** non è un bug funzionale, ma una smell UX nei bordi del realismo (un cliente HSE multi-sede potrebbe avere 250+ estintori). Per MVP attuale single-tenant, severity LOW; per la roadmap multi-tenant, MEDIUM.

---

#### MEDIUM-03 — `request.user.sub` accesso diretto senza optional chaining su 5 punti norm-sync

**File:** `apps/backend/src/modules/norm-sync/routes.ts:132`, `:219`, `:224`, `:246`, `:250`

**Problema:**
Dopo l'augmentation di S8-2, `request.user.sub` ha type `string | undefined`. In norm-sync queste 5 righe accedono direttamente:

```ts
// linea 132 (POST /norm-sync/proposals)
await writeAudit(fastify, {
  userId: request.user.sub,  // ← string | undefined → audit log con userId null
  // ...
});

// linea 219 (PATCH /norm-sync/proposals/:id/approve)
data: {
  status: parsed.data.status,
  reviewedAt: new Date(),
  reviewedById: request.user.sub || null,  // ← OK, fallback null
},
```

Il behavior è inconsistente: linea 219 e 246 usano `|| null`, linea 132/224/250 no. `writeAudit` accetta `userId?: string` quindi non c'è bug runtime, ma il pattern non è uniforme.

**Fix proposto:**

```ts
// linea 132
const auth = request.user;
await writeAudit(fastify, {
  userId: auth.sub,  // tipo già string|undefined, OK
  action: "normProposal.create",
  // ...
});
```

E uniformare tutti i 5 accessi a una `const auth = request.user;` all'inizio della handler. Marginale ma migliora leggibilità.

**Rationale severity:** non bug, ma type-safety inconsistente — il refactor S8-2 non ha completato il cleanup. Adatto al tipico patch follow-up.

---

#### MEDIUM-04 — Golden-path test accumula righe DB senza cleanup

**File:** `apps/backend/src/tests/golden-path.test.ts:16-148`

**Problema:**
Il test `Golden path: login senior → company → employee → corso → record` crea 4 entità (Company, Employee, TrainingCourse, EmployeeTrainingRecord) per ogni run, identificate con `Date.now()` stamp. Mai pulite via `afterAll` / `finally`:

```ts
test("Golden path: ...", async () => {
  // ... crea entità ...
} finally {
  await app.close();  // ← chiude solo l'app, NON pulisce DB
});
```

Conseguenze:
1. Ogni `pnpm test` lascia 4 righe orfane nel DB (CI: linear growth)
2. Il `pretest` (linea 16 di package.json) esegue `db:seed:test` ma `seed-test-baseline.ts` è additivo (upsert per id), non wipe. Quindi le entità golden-path si accumulano.
3. L'audit log cresce monotonicamente.

Il commit message dichiara `Idempotenza: ogni seed ora wipa scoped` ma ciò vale solo per i seed verticali, non per il golden-path test.

**Fix proposto:**
Aggiungere cleanup in `finally`:

```ts
test("Golden path: ...", async () => {
  const stamp = Date.now();
  // ...
  try {
    // ... esegue il flusso ...
  } finally {
    // Cleanup: PrismaClient direct per non passare per fastify (potrebbe essere chiuso)
    const cleanup = new (await import("@prisma/client")).PrismaClient();
    try {
      await cleanup.employeeTrainingRecord.deleteMany({
        where: { course: { name: { startsWith: "Sicurezza Generale " } } },
      });
      await cleanup.trainingCourse.deleteMany({
        where: { name: { startsWith: "Sicurezza Generale " } },
      });
      await cleanup.employee.deleteMany({
        where: { fiscalCode: { startsWith: "RSSMRA80A01F205X-" } },
      });
      await cleanup.company.deleteMany({
        where: { vatNumber: { startsWith: "GP-" } },
      });
    } finally {
      await cleanup.$disconnect();
    }
    await app.close();
  }
});
```

Alternativa: usare `app.prisma.$transaction` con rollback (necessita di refactor: ogni request HTTP partecipa alla transaction, complesso con `app.inject`).

**Rationale severity:** non bloccante per MVP, ma il test in CI grow indefinitely the test database. Su SQLite locale è marginal; su Postgres prod-like in CI, non lo è.

---

#### MEDIUM-05 — `seed-horeca.ts` istanzia `new PrismaClient()` a top-level (12 connessioni totali)

**File:** `apps/backend/prisma/seed-horeca.ts:34`

**Problema:**
Il refactor di S7-1 separa `seed-horeca.ts` da `seed-checklist.ts` (che già aveva il proprio PrismaClient). Tuttavia il nuovo file istanzia ancora a top-level:

```ts
const prisma = new PrismaClient();
```

Combinato con tutti gli altri seed:
- `seed.ts`, `seed-checklist.ts`, `seed-horeca.ts`, `seed-edilizia.ts`, `seed-training.ts`, `seed-metalmeccanico.ts`, `seed-sanita.ts`, `seed-uffici.ts`, `seed-agricoltura.ts`, `seed-test-baseline.ts`, `seed-users.ts`, `add-user.ts` = **12 PrismaClient instances** quando `pnpm db:seed` esegue.

Su SQLite si aprono 12 connessioni allo stesso file DB. In dev funziona, ma:
1. SQLite ha limiti di concurrent reader (default 1 writer) — i deleteMany consecutive potrebbero attendere un lock
2. Solo 1 disconnect (`prisma.$disconnect()` in seed.ts riga 31) — gli altri 11 client restano "leaked" finché Node exit
3. Su Postgres in produzione (PRD-NF-04), 12 connessioni sono spreco

**Fix proposto:**
Refactor: `seed.ts` accetta un singleton condiviso, e tutti i seed-*.ts ricevono il client come parametro:

```ts
// seed-horeca.ts
import { PrismaClient } from "@prisma/client";
export async function seedHoreca(prisma: PrismaClient) {
  // usa il prisma passato dal caller, non più const prisma = new PrismaClient()
}

// seed.ts
const prisma = new PrismaClient();
await seedHoreca(prisma);
await seedEdilizia(prisma);
// ...
await prisma.$disconnect();
```

**Rationale severity:** pre-esistente, non introdotto da S7-1, ma il nuovo file mantiene l'anti-pattern. Refactor più pulito è low-effort e migliora hygiene. DEFER a Sprint 9.

---

#### MEDIUM-06 — `documentTemplate.deleteMany` scope HoReCa non protegge da rinomina futura

**File:** `apps/backend/prisma/seed-horeca.ts:6817-6837`

**Problema:**
La whitelist di nomi `HORECA_GENERIC_DOC_NAMES` è una lista **letterale di 11 stringhe** che corrispondono ai nomi seedati dallo stesso file. Se un futuro PR rinomina (es: "Visura camerale aggiornata" → "Visura camerale (DM 2025)"), succede:

1. La nuova run di `seedHoreca` NON cancella la riga vecchia (nome non in whitelist)
2. Crea la nuova riga con nuovo nome
3. Risultato: duplicato nel DB

Stesso rischio se viene rinominato un macroGroup. La protezione è **fragile rispetto al refactor**.

**Fix proposto:**
Aggiungere flag di tagging discriminante (es: `seedSource` String?) al modello `DocumentTemplate`, popolato dai seed, e wipe per `seedSource: "horeca"`:

```prisma
// schema.prisma
model DocumentTemplate {
  // ...
  seedSource String?  // null per record creati via API, "horeca"/"edilizia"/etc. per seed
}
```

```ts
// seed-horeca.ts
await prisma.documentTemplate.deleteMany({
  where: { seedSource: "horeca" },
});
// ...
await prisma.documentTemplate.createMany({
  data: allDocumentTemplates.map((doc) => ({
    name: doc.name,
    // ...
    seedSource: "horeca",
  })),
});
```

**Rationale severity:** la whitelist attuale funziona OGGI, ma è un trap per future modifiche. Non bloccante. DEFER a Sprint 9 (insieme a HIGH-01 visto che entrambi toccano lo stesso problem space).

---

### 🟡 LOW (5)

#### LOW-01 — Module augmentation conflict risk: niente verifica del campo `payload` formato

**File:** `apps/backend/src/plugins/auth.ts:17-22`

```ts
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: AuthenticatedUser;
    user: AuthenticatedUser;
  }
}
```

Il campo `payload` viene usato da `reply.jwtSign()` (auth/routes.ts:62-66) e deve corrispondere allo shape passato. Ora dichiarato `AuthenticatedUser` con `sub?: string` opzionale. Se un domani il login carica un payload diverso (es: aggiunge `tenantId`), TS non vede l'errore perché `AuthenticatedUser` accetta proprietà extra (interface).

**Fix proposto (defensive):** allineare `AuthenticatedUser` con esatto shape sign-side, e aggiungere unit test che firma+verifica un token:

```ts
// auth.ts
export interface AuthenticatedUser {
  sub: string;     // required
  email: string;
  role: UserRole;
  // tenantId?: string;  // future: aggiungere qui se cambia
}
```

E poi gestire i casi `optional` solo nelle augmentation se serve compatibilità retro su token vecchi.

**Severity LOW:** non è un bug oggi, è un'osservazione di robustezza tipologica.

---

#### LOW-02 — `markdown.ts` hookRegistered flag non thread-safe (concorrenza nei test)

**File:** `apps/desktop/src/lib/markdown.ts:16-32`

```ts
let hookRegistered = false;
export function ensureDomPurifyHook(): void {
  if (hookRegistered) return;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => { ... });
  hookRegistered = true;
}
ensureDomPurifyHook();  // chiamato a module-load
```

In Node single-thread non c'è race. Ma in un test runner che fa `import` paralleli (esnext + tsx + concurrent jest workers), il flag potrebbe essere bypassato. Caso reale qui: `markdown.test.ts:31` fa `await import("./markdown.js")` — si esegue 1 sola volta, il modulo cachea. Hook registrato 1 volta. ✓

**Concern teorico:** se in futuro markdown.ts viene importato anche da un Web Worker (offline rendering), ogni worker ha proprio module cache → hook registrato N volte sui rispettivi DOMPurify. Marginale.

**Fix proposto (preventivo):** usare la API DOMPurify per check idempotenza interna invece di flag esterno:

```ts
export function ensureDomPurifyHook(): void {
  // DOMPurify.removeHook + addHook è idempotente:
  DOMPurify.removeHook("afterSanitizeAttributes");
  DOMPurify.addHook("afterSanitizeAttributes", (node) => { ... });
}
```

**Severity LOW:** osservazione futurista, non rilevante per app desktop monothread.

---

#### LOW-03 — `apps/backend/src/modules/companies/routes.ts:102` accede `request.user.role` senza optional chaining

**File:** `apps/backend/src/modules/companies/routes.ts:102`

```ts
const role = request.user.role;
```

Il route ha `preHandler: [fastify.authenticate]` quindi `request.user` è popolato. Ma dopo l'augmentation, `request.user.role` ha type `UserRole | undefined`. `role` è quindi `UserRole | undefined` — propagato correttamente al chained `toCompanyDtoFor(r, role)`. Nessun bug.

Inconsistenza stile con `auth.ts:48` che usa `user?.role`. Suggerisco uniformare a `request.user?.role` come idiom di robustezza.

**Severity LOW:** stile, non bug.

---

#### LOW-04 — `notifications/routes.ts:19` variabile `_user` non usata

**File:** `apps/backend/src/modules/notifications/routes.ts:19`

```ts
const _user = request.user;  // ← assegnata, mai usata
```

L'underscore prefix indica intent "ignored" ma occupa la riga. Pre-esistente (non introdotto da S7+8) — il refactor S8-2 NON ha rimosso. Non era nello scope.

**Fix proposto:** rimuovere la riga.

**Severity LOW:** dead code minore.

---

#### LOW-05 — `seed-checklist.ts:23-26` casts `as any` su enum Prisma

**File:** `apps/backend/prisma/seed-checklist.ts:23-26`

```ts
{ orderIndex: 1, section: "premises_equipment" as any, domain: "safety" as any, ... }
```

Pre-esistente, non introdotto da S7+8. Ma quando l'enum `ChecklistSection` è stato esteso in S7-3, il `as any` ha mascherato la possibilità di usare `ChecklistSection.premises_equipment` enum-typed. Il fatto che ora `seed-horeca.ts` importi correttamente `ChecklistSection` (riga 9) mostra il pattern preferibile.

**Fix proposto:**

```ts
import { PrismaClient, ChecklistSection, ComplianceDomain } from "@prisma/client";

const items = [
  {
    orderIndex: 1,
    section: ChecklistSection.premises_equipment,
    domain: ComplianceDomain.safety,
    // ...
  },
  // ...
];
```

**Severity LOW:** stile, no impact runtime.

---

### ℹ️ INFO (6)

#### INFO-01 — Test L1 hook (rel=noopener) non coperto end-to-end

**File:** `apps/desktop/src/lib/markdown.test.ts:85-90`

Il test esplicitamente skippa la verifica del hook `rel=noopener noreferrer` perché *"marked v18 non produce target=_blank dal markdown standard"*. Documentato nel commit message. Acceptable defense-in-depth, ma worth noting per la futura roadmap (se mai si aggiunge un'extension marked che produce target).

**Suggerimento:** aggiungere unit test diretto su `DOMPurify.sanitize` con HTML pre-injected:

```ts
test("DOMPurify hook: target=_blank → rel=noopener", () => {
  const html = DOMPurify.sanitize('<a href="https://x.com" target="_blank">x</a>', {
    ALLOWED_TAGS: ["a"], ALLOWED_ATTR: ["href", "target", "rel"],
  });
  assert.match(html, /rel="noopener noreferrer"/);
});
```

---

#### INFO-02 — `chatbot/query` ha variabile `q` (line 282) non utilizzata

**File:** `apps/backend/src/modules/norm-sync/routes.ts:282`

```ts
const q = question.toLowerCase();  // mai usata
```

`findAnswer(question)` lowercase internamente. Pre-esistente.

---

#### INFO-03 — `seed-horeca.ts` 8297 righe in un singolo file

**File:** `apps/backend/prisma/seed-horeca.ts`

Mostro design di S7-1 (intenzionale: restore monolitico from git history). Per Sprint futuri valutare split per categoria ATECO (15 verticali HoReCa → 15 file da ~500 righe ciascuno) per reviewability. Non bloccante.

---

#### INFO-04 — `package.json` test script con 10 invocazioni `cross-env` consecutive

**File:** `apps/backend/package.json:17`

```json
"test": "cross-env NODE_ENV=test tsx src/tests/checklists.test.ts && cross-env NODE_ENV=test tsx src/tests/pastry-split.test.ts && ..."
```

10 esecuzioni di tsx (10 cold start). Tempo totale ~30-60s. Per un MVP è OK, ma per CI sarebbe più snappy un test runner unificato (Vitest) che avvia tsx 1 sola volta.

**Severity INFO:** ottimizzazione futura, non bloccante.

---

#### INFO-05 — Schema Prisma: enum `ChecklistSection` ora ha 20 valori, alcuni quasi-duplicati

**File:** `apps/backend/prisma/schema.prisma:28-52`

Esistono `environment` e `environmental` come due valori separati nell'enum esteso da S7-3. È intenzionale o errore tipografico? In `seed-metalmeccanico.ts:131` si usa `environmental`, ma `environment` è anche presente nell'enum.

Verificare se entrambi servono o se ne basta uno (preferibilmente `environment`, è più universalmente usato).

---

#### INFO-06 — Seed verticali non coprono campo `domain` di `TrainingCourse`

**File:** `apps/backend/prisma/seed-metalmeccanico.ts:197-204` e equivalenti

```ts
data: trainingCourses.map((c) => ({
  name: c.name,
  description: c.description,
  minHours: c.durationHours,
  frequencyYears: c.frequencyYears,
  targetAudience: "Lavoratori",
  normReference: "D.Lgs. 81/2008, art. 37; Accordo Stato-Regioni 22/02/2012",
  // domain mancante → default ComplianceDomain.safety dal schema
})),
```

`schema.prisma:499` ha `domain ComplianceDomain @default(safety)`. Quindi tutti i corsi sectorial sono safety-only. Per metalmeccanico/sanita questo è coerente; per i corsi `Formazione tracciabilita alimentare e HACCP` (agricoltura) e `Formazione gestione rifiuti sanitari` (sanita) il domain dovrebbe essere `haccp` o `both` per visibilità nella search di sopralluoghi haccp_only.

**Suggerimento:** aggiungere `domain` esplicito ai corsi, soprattutto agricoltura e sanita.

---

## 3. Verifica Specifica vs Prompt

| # | Concern del Prompt | Esito |
|---|---|---|
| 1 | Bug funzionali post-rimozione casts (es: `request.user.sub` vs `?.sub`) | **OK** – tutti i punti rimossi usano `?.sub` correttamente; i 4 cast rimasti documentati MEDIUM-01 |
| 2 | Security: `documentTemplate.deleteMany` scope HoReCa | **OK con caveat** – scope per macroGroup HoReCa + nomi noti, non collide con test-baseline-doc né altri seed; ma fragile a rinomina (MEDIUM-06) |
| 3 | Test fragility: golden-path idempotenza | **MEDIUM-04** – test crea entità ma non pulisce; OK su SQLite locale, può accumulare in CI |
| 4 | Schema migration enum SQLite add-only | **OK** – SQLite tratta enum come TEXT, no migration richiesta. Pre-existing record validi (commit message conferma) |
| 5 | Cap take:200 client desktop | **MEDIUM-02** – AssetsPage sempre passa companyId, ma se una company ha >200 assets, troncamento silenzioso |
| 6 | Module augmentation `@fastify/jwt` conflict node_modules | **OK** – la augmentation segue la pattern documentata in `node_modules/@fastify/jwt/types/jwt.d.ts:96-99` (interface vuota di default), no conflict |
| 7 | `markdown.ts hookRegistered` flag fra moduli | **OK** – ES modules cachea l'istanza, `hookRegistered` è singleton. `ensureDomPurifyHook` è idempotente. Esposta API esplicita per re-init in test (LOW-02 osservazione futura) |

---

## 4. Verdetto Pre-Merge

### **✅ OK — Procedere con merge in `main`**

Nessuna delle issue HIGH è bloccante per il merge:

- **HIGH-01** è un rischio operativo per chi esegue `pnpm db:seed` su DB con dati reali. Mitigation: aggiungere guard `NODE_ENV !== "production"` in seed.ts come **pre-merge requirement minimo** (10 righe di codice, low-risk). DEFER refactor robusto a Sprint 9.

Le 6 MEDIUM sono **DEFER a Sprint 9 / Sprint 10** (technical debt accettabile per MVP):
- MEDIUM-01: type-safety casts → cleanup post-merge
- MEDIUM-02: header pagination → quando si introduce multi-tenant
- MEDIUM-03: uniformazione `auth.sub` accesso → patch follow-up
- MEDIUM-04: cleanup golden-path test → dopo conferma CI green per N run
- MEDIUM-05: PrismaClient singleton → refactor seed orchestration
- MEDIUM-06: seedSource flag → quando si stabilizza il pattern di seed

Le 5 LOW sono **stylistic / hygiene**, gestibili in tickets backlog.

**Pre-merge action items minimi:**

1. **(opzionale ma consigliato)** Aggiungere guard prod a `seed.ts`:
   ```ts
   if (process.env.NODE_ENV === "production" && !process.env.FEDSHIELD_ALLOW_PROD_SEED) {
     throw new Error("Refuse domain seed in production.");
   }
   ```
   Mitiga HIGH-01 in 10 secondi.

2. **(opzionale)** Verificare INFO-05 (enum `environment` vs `environmental`): se è un typo unificare ora che siamo ancora pre-merge, evita data drift.

**Criteri di merge:**
- ✅ Test pass (commit message dichiara 28 test backend pass + 10 test desktop pass)
- ✅ Type-check pass (commit message: 0 errori tsc backend+desktop)
- ✅ Sicurezza: cap query, no SQL injection, no XSS introduzione, no secret hardcoded
- ✅ Backwards-compat: enum SQLite extensible add-only, schema additive (normReference + health_surveillance optional/nuovo)
- ⚠️ Gestione operativa seed (HIGH-01): documentare nelle release notes "non eseguire `pnpm db:seed` su DB con record reali"

---

## 5. Estratti di Riferimento (per quick navigation)

| Severity | File | Riga | Issue summary |
|---|---|---|---|
| HIGH | seed-metalmeccanico.ts | 174-176 | TrainingCourse delete cascade EmployeeTrainingRecord |
| HIGH | seed-sanita.ts | 169-171 | Idem |
| HIGH | seed-uffici.ts | 169-171 | Idem |
| HIGH | seed-agricoltura.ts | 169-171 | Idem |
| MEDIUM-01 | inspections/routes.ts | 600 | `request.user as { sub: string; role: UserRole }` |
| MEDIUM-01 | inspections/routes.ts | 1012 | Idem |
| MEDIUM-01 | quotes/routes.ts | 135 | Idem |
| MEDIUM-01 | quotes/routes.ts | 200 | `request.user as { sub: string }` |
| MEDIUM-02 | equipment/routes.ts | 139,184,232,277 | take cap silenzioso |
| MEDIUM-03 | norm-sync/routes.ts | 132,224,250 | `request.user.sub` no fallback |
| MEDIUM-04 | golden-path.test.ts | 16-148 | nessun cleanup DB |
| MEDIUM-05 | seed-horeca.ts | 34 | `new PrismaClient()` top-level |
| MEDIUM-06 | seed-horeca.ts | 6817-6837 | whitelist nomi fragile |
| LOW-01 | auth.ts | 17-22 | augmentation `payload` shape |
| LOW-02 | markdown.ts | 16-32 | hookRegistered flag |
| LOW-03 | companies/routes.ts | 102 | `request.user.role` no `?.` |
| LOW-04 | notifications/routes.ts | 19 | `_user` unused |
| LOW-05 | seed-checklist.ts | 23-26 | `as any` casts |
| INFO-01 | markdown.test.ts | 85-90 | L1 hook coverage |
| INFO-05 | schema.prisma | 38-39 | environment vs environmental |
| INFO-06 | seed-*.ts | many | TrainingCourse domain default |

---

_Reviewed: 2026-04-26_
_Reviewer: Claude (gsd-code-reviewer Opus 4.7 1M context)_
_Depth: deep (cross-file analysis, schema FK trace, type augmentation verify)_
