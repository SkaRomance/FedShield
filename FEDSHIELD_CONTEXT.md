# FedShield — Contesto Operativo per Agent Team

> Ultimo aggiornamento: 2026-04-29 (Sprint 14 close-out)
> Sessione: QR multi-asset (4 tipi) + dark mode toggle WCAG-AA

---

## 1. Panoramica Progetto

**FedShield** e una piattaforma desktop-first (Electron + React + Fastify) per consulenti HSE (Health, Safety, Environment). Gestisce checklist, ispezioni, sanzioni, formazione dipendenti, asset aziendali e consulenza AI.

### Tech Stack
- **Frontend**: React 19, TypeScript 5.9, Vite 7, Electron 37
- **Backend**: Fastify 5, Prisma 6.16, SQLite (dev) / PostgreSQL (prod)
- **AI**: n8n workflows + Ollama Cloud remoto (87.106.168.71)
- **Auth**: JWT (@fastify/jwt)
- **Package**: pnpm 10.29.2, workspace monorepo

### Struttura
```
FedShield/
├── apps/
│   ├── backend/          # API Fastify + Prisma (porta 4000)
│   ├── desktop/          # Electron + React (porta 5180)
│   └── tablet/           # App mobile (non attiva)
├── packages/
│   └── contracts/          # Tipi condivisi
├── infra/
│   └── n8n/workflows/      # AuditBot + NormSync JSON
├── docs/
│   └── ARCHITETTURA-n8n-Ollama.md
├── README.md
├── PRD.md
└── AGENTS.md
```

---

## 2. Regole per Agent Team

### Ruoli Consigliati

| Ruolo | Skill | Quando Usarlo |
|-------|-------|---------------|
| **Backend Dev** | `backend-development`, `senior-backend`, `test-driven-development` | API, database, Prisma, route logic, auth |
| **Frontend Dev** | `frontend-design`, `vercel-react-best-practices`, `ui-ux-pro-max` | React components, Electron, Vite, CSS |
| **Database** | `database-designer`, `database-schema-designer` | Schema Prisma, seed, migration, query optimization |
| **DevOps** | `docker-development`, `ci-cd-pipeline-builder` | Docker, deploy, pipeline, n8n setup |
| **QA** | `qa`, `systematic-debugging`, `verification-before-completion` | Test, bug hunt, validazione pre-consegna |
| **Project Manager** | `gsd-*`, `persona-project-manager` | Roadmap, milestone, task tracking |

### Regole di Interazione

1. **Prima di modificare**: leggi sempre questo file + `AGENTS.md` + `PRD.md`
2. **Se manca una skill**: usa `/find-skills` per cercarla, poi `skill:load`
3. **Per ogni task > 3 step**: crea un todo list (`/todo write`)
4. **Prima di scrivere codice**: verifica che il modello del contesto sia > 90%
5. **Per backend**: usa `test-driven-development` — scrivi test PRIMA del codice
6. **Per frontend**: usa `vercel-react-best-practices` per performance
7. **Per database**: usa `database-designer` — mai cambiare schema senza verificare impatto seed
8. **Code review**: `requesting-code-review` prima di definire "fatto"

### Delega Automatica Skill

```
Se il task riguarda... → Usa skill...

API/Backend          → backend-development + senior-backend
UI/UX/React          → frontend-design + ui-ux-pro-max
Database/Schema        → database-designer + database-schema-designer
Docker/Deploy          → docker-development + ci-cd-pipeline-builder
Test/Bug             → qa + systematic-debugging + test-driven-development
Pianificazione       → gsd-plan-phase + writing-plans
Refactor sicuro      → careful + freeze + review
```

---

## 3. Mapping Skill → Cartella

```
backend-development    → apps/backend/src/modules/*/routes.ts
senior-backend         → apps/backend/src/app.ts, plugins/
database-designer      → apps/backend/prisma/schema.prisma
database-schema-designer → apps/backend/prisma/*.ts (seed)
frontend-design        → apps/desktop/src/pages/*.tsx
ui-ux-pro-max          → apps/desktop/src/App.tsx, DashboardPage.tsx
vercel-react-best-practices → apps/desktop/src/components/**/*.tsx
docker-development     → infra/docker/
ci-cd-pipeline-builder → .github/workflows/ (se esiste)
qa                     → apps/backend/src/tests/
systematic-debugging   → quando appare un errore runtime
test-driven-development → apps/backend/src/tests/ + nuove feature
```

---

## 4. Registro Modifiche — Sessione 2026-04-25

### ✅ Completato

#### Schema Prisma
- **Aggiunti modelli**: `Employee`, `TrainingCourse`, `TrainingRequirement`, `EmployeeTrainingRecord`, `TrainingChecklistTemplate`, `TrainingChecklistItem`, `Equipment`, `Machine`, `FireExtinguisher`, `FirstAidKit`, `NormativeSource`, `NormativePatchProposal`
- **Aggiunto enum**: `EquipmentStatus`

#### Seed Database (6 settori checklist)
| Settore | Premises | Procedures | Corsi |
|---------|----------|------------|-------|
| Horeca | 25 | 25 | - |
| Edilizia | 25 | 25 | - |
| Metalmeccanico | - | - | 25 |
| Uffici/Servizi IT | - | - | 25 |
| Sanità | - | - | 25 |
| Agricoltura | - | - | 25 |
| **Corsi formazione** | - | - | 29+ |

#### Backend API — Nuove Route
| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/employees` | CRUD | Dipendenti con training records |
| `/training/courses` | CRUD | Corsi formazione |
| `/training/requirements` | GET/POST | Requisiti per ATECO |
| `/training/records` | CRUD | Record formazione dipendente |
| `/training/records/expiring` | GET | Prossime scadenze |
| `/equipment` | CRUD | Asset generici |
| `/machines` | CRUD | Macchinari |
| `/fire-extinguishers` | CRUD | Estintori |
| `/first-aid-kits` | CRUD | Cassette pronto soccorso |
| `/equipment/overview` | GET | Dashboard asset |
| `/chatbot/query` | POST | Proxy chatbot AI |
| `/norm-sync/proposals` | CRUD | Proposte normative AI |
| `/norm-sync/stats` | GET | Dashboard admin NormSync |
| `/notifications/alerts` | GET | Alert scadenze (rosso/arancio/giallo) |

#### Frontend Desktop — Nuove Pagine
| Pagina | File | Stato |
|--------|------|-------|
| Formazione | `TrainingPage.tsx` | ✅ lettura dipendenti/scadenze |
| AuditBot | `ChatbotPage.tsx` | ✅ libero, nessun obbligo azienda |
| NormSync Admin | `NormSyncAdminPage.tsx` | ✅ gestione proposte normative |
| Asset QR | `AssetQrPage.tsx` | ✅ QR code per asset |

#### Chatbot AI — Nuovo Comportamento
- **Prima**: obbligo selezione azienda, fallback vuoto
- **Ora**: libero per il consulente, knowledge base offline con 40+ risposte normative, collegamento n8n configurato, fallback offline intelligente
- **Knowledge base copre**: DPI, DVR, formazione, estintori, HACCP, allergeni, sanzioni, rumore, elettrico, privacy, 231/2001, e altro

#### Configurazione
- **Environment**: `N8N_AUDITBOT_WEBHOOK="http://87.106.168.71:5678/webhook/chatbot-query"`
- **Workflow n8n**: `infra/n8n/workflows/auditbot-workflow.json` (aggiornato con IP VPS)
- **Credenziali test**: `{admin,senior,junior}@fedshield.local` / `fedshield123` (unificata da S5)

### 🔧 Fix Applicati
1. `TrainingPage.tsx`: rimosso import `{ api }` inesistente → `authedFetch`
2. `TrainingPage.tsx`: aggiunta prop `token`, passata da `DashboardPage`
3. `ChatbotPage.tsx`: rimosso select azienda, `companyId` reso opzionale
4. `api.ts`: `companyId` opzionale in `chatbotQuery`
5. `norm-sync/routes.ts`: validazione backend accetta solo `question`, nessun obbligo `companyId`
6. Backend chatbot: knowledge base fallback offline con regex matching
7. Workflow n8n: aggiornato `localhost:5000` → `87.106.168.71:4000`

### ⚠️ Note Tecniche
- **SQLite Prisma**: `skipDuplicates` non supportato → usa `deleteMany` preventivo o `count` + condizionale
- **Enum `ComplianceDomain`**: accetta solo `safety`, `haccp`, `both` — non `hygiene`
- **Enum `ChecklistSection`**: solo `premises_equipment` e `procedures_hygiene`
- **Enum `EquipmentStatus`**: `active | under_maintenance | expired | decommissioned` (NON `maintenance`)
- **Seed**: rimossi campi inesistenti (`sector`, `version`, `domain: "hygiene"`)
- **Asset schema**: i campi data sono `nextCheckAt` (non `nextExpiryDate`); FireExtinguisher/FirstAidKit usano `location` (non `ubicazione`)

---

## 4-bis. Audit + Fix P0 — Sessione 2026-04-25

Audit completo: `docs/audit/AUDIT_2026-04-25.md` (39 feature PRD verificate, 47 finding P0/P1/P2).

### 🔥 P0 risolti (branch `fix/audit-p0-runtime-breakers`)

| # | Bug | Fix | Commit |
|---|-----|-----|--------|
| P0-1 | `/chatbot/query` registrato 2 volte (1ª monca) → backend non si avviava (`FST_ERR_DUPLICATED_ROUTE`) | Rimossa la registrazione duplicata e troncata da `norm-sync/routes.ts:176-191` | `da69805` |
| P0-2 | `/notifications/alerts` interrogava campi italiani inesistenti (`nextExpiryDate`, `ubicazione`, `assetTag`, `employeeInCharge`) → badge dashboard sempre 0 per gli asset | Rinominati ai field schema reali: `nextCheckAt`, `location`, `serialNumber`; rimossi `assetTag`/`employeeInCharge` dai testi | `a72e80d` |
| P0-3 | Modelli `NormativeSource` e `NormativePatchProposal` chiamati da `norm-sync/routes.ts` e `stats.ts` ma non esistenti nello schema → 500 al primo accesso admin | Aggiunti i 2 modelli + 2 enum (`NormativePatchStatus`, `NormativeSourceType`); `prisma generate` + `prisma db push` eseguiti | `9381498` |
| P0-4 | Chatbot proxy verso n8n inoltrava il bearer JWT del client → leak in chiaro su HTTP | Backend → n8n ora autentica server-side con `FEDSHIELD_N8N_API_KEY` (header `X-API-KEY`); il JWT del client non lascia più il backend | `e6218ba` |
| extra | Errori TS introdotti dai fix sopra (status string→enum, `findAnswer` return type, `"maintenance"` → `"under_maintenance"`) | Risolti | `08ccd96` |

### ✅ Validazione

- `npx prisma validate` → schema OK
- `npx tsc --noEmit` su file modificati → 0 errori (12 errori residui pre-esistenti in `seed.ts` import path + `equipment/routes.ts` enum cast: P1 Sprint 1)
- Smoke test boot (`npx tsx src/server.ts`) → backend listening 200ms, `/api/health` 200, nessun `FST_ERR_DUPLICATED_ROUTE`

### 📋 Backlog priorizzato (dopo P0)

**Sprint 1 ✅ Completato** (branch `fix/audit-p0-runtime-breakers` commits `d083e10..690d792`):

| # | Tema | Commit |
|---|------|--------|
| S1-1 | Helper `requireRole(roles)`, `requireAdmin`, `requireSeniorOrAdmin` in `plugins/auth.ts` | `d083e10` |
| S1-2 | Role check senior+admin su 12 mutazioni master-data (employees, companies, equipment×4, training-courses×2) | `d083e10` |
| S1-3 | Validazione `companyId` esiste in `/notifications/alerts` (pre-flight 404) | `757a83f` |
| S1-4 | DTO whitelisting su companies.PATCH — DIFFERITO a Sprint 3 (breaking change frontend) | — |
| S1-5 | Helmet + rate-limit (100/min globale, 5/min su /auth/login anti-brute-force) | `728d24e` |
| S1-6 | `writeAudit` su tutte le 13 mutazioni dei nuovi moduli + `writeAudit` fail-soft (errori loggati, mai propagati come 500) | `e6370c2`, `690d792` |
| S1-7 | Auth-matrix test (5 test, 5 pass): 401 senza JWT, 403 junior, 403 senior su admin-only, GET pubblici per junior | `690d792` |
| S1-8 | Fix debiti TS pre-esistenti: import `.js` su seed.ts, status enum cast in equipment, esclusione prisma da tsconfig | `9aca204` |

**`tsc --noEmit` backend: 0 errori** sul codice runtime.

**Sprint 2 ✅ Completato** (commit `e92a18b`):

| # | Tema | File |
|---|------|------|
| S2-0 | Mapping pattern frontend (DashboardPage routing state-based, authedFetch, no-form-library) | — |
| S2-1+S2-2 | TrainingPage rifatta con 3 tab (Scadenze / Dipendenti CRUD / Catalogo corsi CRUD) — soft-delete, registrazione formazione con auto-calcolo `expiresAt` | `pages/TrainingPage.tsx` |
| S2-3 | AssetsPage nuova con 4 tab (Attrezzature / Macchine / Estintori / Cassette PS) — filtro per company, form create per ogni tipo, highlighting righe per scadenza | `pages/AssetsPage.tsx` |
| S2-4 | Wiring AssetQrPage in DashboardPage: nav "Asset & Attrezzature", click QR row → assetQr view, pulsante "← Torna agli asset" | `pages/DashboardPage.tsx` |
| S2-5 | AssetQrPage fix: `localhost:4000` → `fetchEquipmentById` (authedFetch), allineamento schema (`nextCheckAt`, `serialNumber`) | `pages/AssetQrPage.tsx` |
| extra | api.ts: 12+ helper tipizzati per employees/equipment×4/training-courses; tsconfig desktop override `moduleResolution: bundler` per Vite | `src/api.ts`, `tsconfig.json` |

**Vite build desktop: ✅ 44 modules, 306 KB → 86 KB gzipped in 1.15s.**

PRD chiuso: F-15 (CRUD frontend dipendenti), F-16 (CRUD frontend corsi), F-22 (QR raggiungibile da nav), F-24 (CRUD frontend asset).

**Sprint 3 ✅ Completato** (commits `9932f32..a253b9e`):

| # | Tema | Commit |
|---|------|--------|
| S3-1 | Zod validation su risposte n8n AuditBot (whitelist `answer`/`source`/`citations`/`timestamp`); aggiunto timeout 15s + check `res.ok` | `9932f32` |
| S3-2 | DOMPurify + marked nel chatbot desktop: messaggi AI renderizzati come HTML markdown sanitizzato (whitelist tag/attr conservativa, URL solo http/mailto/tel) | `2d47434` |
| S3-3 | Unique constraints Prisma: `Employee[companyId,fiscalCode]`, `Equipment[companyId,serialNumber]`, `Machine[companyId,serialNumber]`, `FireExtinguisher[companyId,code]` + helper `replyOnUniqueViolation` (P2002 → 409 Conflict) | `3a02929` |
| S3-4 | Endpoint PATCH/DELETE per Equipment/Machine/FireExtinguisher/FirstAidKit con role guards, audit log, soft-delete (status=decommissioned) + GET singolo per parità + helper desktop `update*`/`delete*` | `a374911` |
| S3-5 | DTO whitelist su companies (output schema Zod): GET/POST/PATCH restituiscono solo i campi esplicitamente whitelistati | `c3d2c54` |
| S3-6 | Risolti 7 errori TS pre-esistenti desktop: `heartbeatDeviceLicense` ora tipizzato con `DeviceHeartbeatResponse`, `reduce<number>` in syncManager, `Set<string>` widening in ChecklistPage. **Desktop tsc --noEmit pulito.** | `f7e7337` |
| S3-7 | Migrazione `bcryptjs → argon2id` (PRD NF-03): plugin `password.ts` con verifier dual-format (riconosce hash bcrypt legacy + argon2 via prefix), re-hash opportunistico al login OK, `prisma/add-user.ts` aggiornato. 5 test password tutti passano. | `a253b9e` |

**Vite build desktop: 373 KB → 110 KB gzipped (DOMPurify + marked: +24 KB gzip) in ~1.4s. Backend tsc runtime pulito; test pre-esistenti su `auth-matrix.test.ts` (errori InjectPayload/statusCode tipi `light/inject` Fastify) restano da raffinare.**

PRD aggiornato: NF-03 (argon2) ora compliant; F-24 (asset CRUD completo end-to-end con edit/delete).

**Sprint 4 ✅ Completato** (commits `1455665..a116d3d`):

| # | Tema | Commit |
|---|------|--------|
| S4-1 | Tipizza payload mutations in `auth-matrix.test`: `Record<string, unknown>` invece di `unknown` → 0 errori TS sull'intero backend (incluso test) | `1455665` |
| S4-2 | UI edit/delete asset desktop: 4 tab di `AssetsPage` ora con pulsanti Modifica/Elimina, form pre-compilato per editing, soft-delete con confirm | `2c3601c` |
| S4-3 | Smoke test backend: 8 test che booteano `buildApp()` + verificano `/api/health`, `/api/companies`, regressioni Sprint 0 (P0-1/P0-2/P0-3), chatbot length cap | `a116d3d` |
| S4-4 | Code review pre-merge delegata ad agent `gsd-code-reviewer`: 23 commit Sprint 0-3 analizzati. **Verdict**: 0 critical, 3 HIGH, 5 medium, 5 low | — (review eseguita) |
| S4-7 | Fix dei 3 finding HIGH della review: H1 SSRF allowlist su `N8N_AUDITBOT_WEBHOOK` (`isSafeOutboundUrl`), H2 length cap 4000 char su question chatbot (DoS marked.parse), H3 `nullableDate` per consentire reset di campi data nelle PATCH asset | `2e0ac58` |

**Stato finale pre-merge:**
- Backend `tsc --noEmit`: **0 errori** (incluso file di test)
- Desktop `tsc --noEmit`: **0 errori**
- Vite build desktop: 376 KB → 110 KB gzip in ~1.25s
- Test backend: tutti i suite passano (auth-matrix 5/5, password 5/5, smoke 8/8)
- Code review: HIGH chiusi; MEDIUM/LOW backlog (vedi sotto)

**Sprint 5 — Test fragility hardening** (post-merge, su main):

| # | Tema | Note |
|---|------|------|
| S5-1 | Seed `prisma/seed-users.ts` idempotente: 3 utenti dev (junior/senior/admin@fedshield.local, password unificata `fedshield123`, hash argon2id) | upsert |
| S5-2 | Seed `prisma/seed-test-baseline.ts` idempotente: 1 company + 1 checklist template + 1 item + 1 doc template + chiamata `seedChecklistTemplates` | risolve fallimento checklists.test |
| S5-3 | `pretest` script aggancia `pnpm db:seed:test` (= seed-users + seed-test-baseline) → ogni `pnpm test` parte con DB consistente | npm convention |
| S5-4 | `pastry-split.test.ts` e `horeca-completeness.test.ts` auto-skippano se template HoReCa ATECO 56.10.x non esistono (il seed monolitico è stato cancellato in `9aca204`) | guard via `app.prisma.checklistTemplate.findFirst` |
| S5-5 | `prisma/add-user.ts` password allineata a `fedshield123` per coerenza con i test | password ricostruibile via seed-users.ts |

**Risultato test suite finale:**
```
Checklist routes test passed
Pastry split test: skipped (HoReCa seed assente).
HoReCa completeness test: skipped (HoReCa seed assente).
Quotes and documents test passed
KPI and ODV test passed
Licensing and sync test passed
Auth matrix: 5/5 pass
Password plugin: 5/5 pass
Smoke: 8/8 pass
```
Nessun fallimento. I 2 skip restano valid quando il seed HoReCa verrà ricostruito (vedi backlog).

**Sprint 6 ✅ Completato — Code review MEDIUM/LOW cleanup** (commits `8299f2e..051c08f`):

| # | Tema | Commit |
|---|------|--------|
| S6-1 (M1) | Anti-timing user enumeration su `/auth/login`: `consumeDummyVerify()` esegue argon2.verify su hash dummy cached quando email non registrata, uniformando latenza. Test che confronta dummy vs real verify (rapporto <4×) | `8299f2e` |
| S6-2 (M2) | `n8nChatbotResponseSchema.timestamp` ora `z.string().datetime()`; backend defaulta `new Date().toISOString()` se omesso da n8n | `374f332` |
| S6-3 (M3) | `GET /companies` redige nominativi HACCP+medico competente al ruolo junior (`redactForJunior` + `toCompanyDtoFor`). Senior/admin invariati. Test policy 1/1 pass | `374f332` |
| S6-4 (M5) | `proposals/approve` rimuove `JSON.parse(JSON.stringify)` ridondante; `Array.isArray` check su `proposedChanges` previene bug se Prisma deserializza un oggetto invece di array | `051c08f` |
| S6-5 (L1+L4) | DOMPurify hook globale forza `rel="noopener noreferrer"` sui link `target="_blank"` chatbot; `console.error` → `fastify.log.error` in norm-sync | `051c08f` |

Test backend totali: auth-matrix 6/6, password 6/6, smoke 8/8, legacy/quotes/kpi-odv/licensing pass, 2 HoReCa skip puliti.

**Sprint 7 ✅ Completato — Test coverage HoReCa + golden-path** (branch `feat/sprint-7-test-coverage`, commits `012fa17..1fd6729`):

| # | Tema | Commit |
|---|------|--------|
| S7-1 | Restore seed HoReCa monolitico cancellato in `9aca204` (8265 righe). Recuperato da git history come `seed-horeca.ts`, rimosso user seeding bcrypt (delegato a `seed-users.ts`), wrap in `export async function seedHoreca()`, `documentTemplate.deleteMany` scoped sui macroGroup HoReCa + 11 nomi generici per non wipiare doc di altri moduli. `seed-checklist.ts` ora re-exporta `seedHoreca` dal nuovo modulo. | `012fa17` |
| S7-2 | Rate-limit globale + per-route (`/auth/login` 5/min anti-brute) saltato quando `NODE_ENV=test`: i test legacy sforavano la soglia con centinaia di `app.inject()` consecutivi (429 invece dei codici business). `cross-env` aggiunto come devDep (Windows non accetta `VAR=val tsx`); script `test` prefixato. | `7b7f085` |
| S7-3 | Estensione enum `ChecklistSection` con 18 valori sectorial (`machinery_safety`, `welding_thermal`, `chemical_fitosanitary`, `electrical`, `ergonomics`, `fire_prevention`, etc.) usati dai seed verticali (metalmeccanico/sanita/uffici/agricoltura). SQLite tratta enum come TEXT → nessuna migrazione dati. Note: `seed-metalmeccanico.ts` ha residui schema mismatch separati (campo `sector` su TrainingCourse, `severity`/`sanctionable` vs `defaultSeverity`/`defaultSanctionable`) — fuori scope. | `e96bc82` |
| S7-4 | Golden-path integration test cross-modulo: login senior → create company → create employee → create training course → record formazione → list employees with records. + Negative test: junior 403 su tutti e tre i POST master-data. | `1fd6729` |

**Risultato test suite Sprint 7:**
```
Checklist routes test passed
HoReCa split test passed                          ← era skip in S6
HoReCa completeness test passed                   ← era skip in S6
Quotes and documents test passed
KPI and ODV test passed
Licensing and sync test passed
Auth matrix: 6/6 pass
Password plugin: 6/6 pass
Smoke: 8/8 pass
Golden path: 2/2 pass                             ← NEW
```

Totale 28 test su 10 file, tutti pass. HoReCa coverage: 15 categorie ATECO (ristoranti, bar, hotel, B&B, ostelli, campeggi, pasticcerie, pizzerie, mense, catering, food truck, pasticcerie ambulanti, gastronomia, balneari, locali serali) ora effettivamente verificate.

**Sprint 8 ✅ Completato — Code quality residuals** (branch `feat/sprint-8-code-quality`, commits `3391e34..f44e2a8`):

| # | Tema | Commit |
|---|------|--------|
| S8-1 | Allineamento dei 4 seed verticali (metalmeccanico/sanita/uffici/agricoltura) al schema Prisma corrente: `durationHours` → `minHours`, drop `isMandatory`, default `targetAudience`/`normReference` per settore, `severity`/`sanctionable` → `defaultSeverity`/`defaultSanctionable`. Aggiunto `normReference` a ChecklistItem (utile audit). Esteso `TrainingChecklistSection` con `health_surveillance`. Idempotenza scoped (deleteMany su templateId noti + targetAudience univoco). `pnpm db:seed` ora gira end-to-end (HoReCa + edilizia + training + 4 verticali). | `3391e34` |
| S8-2 (L5) | Module augmentation `@fastify/jwt` per `request.user` come `AuthenticatedUser` ({ sub?, email?, role? }). Rimossi 28 cast `(request.user as { sub?: string })` su 14 file di route. Restano 4 cast non-optional (inspections L600/L1012, quotes L135/L200) che documentano contract più forte. | `f02a436` |
| S8-3 (L3) | GET `/equipment`, `/machines`, `/fire-extinguishers`, `/first-aid-kits` cappati con `take: 200` default, override via `?limit=N` (max 500). Helper `parseLimit` centralizzato. Previene download massivo cross-tenant. | `ff58af9` |
| S8-4 (L2) | Estratto `renderAssistantMarkdown` da ChatbotPage in `src/lib/markdown.ts` per testabilità. Aggiunti 10 test jsdom: rendering markdown base + sanitizzazione XSS (script, javascript:, img onerror, iframe) + URL whitelist (mailto/tel ok, data: bloccato). Desktop test script ora esegue la suite. | `f44e2a8` |

**Test suite finale Sprint 8**: backend 28/28 pass + desktop 10/10 pass (jsdom). Vite build desktop 376.74 kB → 110.54 kB gzip in 2.14s. Backend tsc 0 errori, desktop tsc 0 errori. `pnpm db:seed` produce 31 corsi training + 68 requirements + 100 checklist item sectorial + 20 training items.

**Sprint 9 ✅ Completato — QA + docs + CI** (branch `feat/sprint-9-qa-docs`, commits `beb2aa1..bd83a67`):

3 agent paralleli (gsd-code-reviewer + general-purpose + Plan) hanno prodotto findings che sono stati sintetizzati e applicati.

| # | Tema | Commit |
|---|------|--------|
| S9-1 | Code review Sprint 7+8 (REVIEW.md, 18 finding). Fix HIGH-01 (`seed.ts` rifiuta NODE_ENV=production senza FEDSHIELD_ALLOW_PROD_SEED, mitiga cascade delete EmployeeTrainingRecord) + MEDIUM-01 (rimossi 4 cast residui `request.user as { sub: string }`, aggiunto guard) + MEDIUM-04 (golden-path test cleanup company.delete in finally). | `beb2aa1` |
| S9-2 | Doc P0 fix da DOCS_AUDIT.md (general-purpose agent): password demo `fedshield2026` → `fedshield123` su README/PROMPT/CONTEXT (Sprint 5 unificata); FILE_CONTEXT.md aggiornato albero file con plugin/modules/test/pages reali. | `da7a1c1` |
| S9-3 | `.github/workflows/ci.yml` — workflow GitHub Actions con 2 job paralleli (test-backend + test-desktop), cache pnpm/Prisma, Node 24, pnpm 10.29.2, type-check pre-test, ELECTRON_SKIP_BINARY_DOWNLOAD per desktop. ~3min warm run. NON pushato (richiede review umano). | `ddc3394` |
| S9-4 | REVIEW.md + DOCS_AUDIT.md committati come reference Sprint 9. | `bd83a67` |

**Test suite Sprint 9**: backend 28/28 pass + desktop 10/10 pass. Backend+desktop tsc 0 errori.

**Sprint 10 ✅ Completato — Cleanup MEDIUM/LOW + docs P1** (branch `feat/sprint-10-cleanup`, commits `cd54aa5..d6c56d6`):

| # | Tema | Commit |
|---|------|--------|
| S10-A1 (MEDIUM-02) | GET asset list endpoints ora restituiscono header `X-Total-Count`, `X-Limit`, `X-Truncated`. Client può rilevare troncamento e mostrare warning UI. Promise.all(findMany, count). | `cd54aa5` |
| S10-A2 (MEDIUM-03) | Uniformati 5 accessi diretti `request.user.sub` in norm-sync a `const auth = request.user` pattern + `?? null` consistente. | `cd54aa5` |
| S10-A3 (LOW-03/04/05) | companies.ts:102 `request.user?.role` (idiom robustezza); rimossa variabile `_user` mai usata in notifications.ts; seed-checklist.ts ora usa enum tipati `ChecklistSection`/`ComplianceDomain` invece di `as any`. | `cd54aa5` |
| S10-B1 | README.md: aggiunte 4 sezioni P1 (Sicurezza, Strategia Test, Strategia Seed, Variabili Ambiente) con tabelle complete, riferimenti file, comandi dev. | `d6c56d6` |
| S10-B2 | QUICKSTART.md: riscritto con setup 3-step, login dev unificato, test detail, troubleshooting table. | `d6c56d6` |

**Differiti** (documentati nel REVIEW.md sezione finale):
- MEDIUM-05: 12 PrismaClient instances scattered nei seed (refactor invasivo, low priority)
- MEDIUM-06: HORECA_GENERIC_DOC_NAMES whitelist fragile (richiede schema column `seedSource`)
- LOW-01: AuthenticatedUser shape vs FastifyJWT.payload (defensive future-proofing)
- LOW-02: markdown.ts hookRegistered thread-safety (Web Worker scenario teorico)

**Test suite Sprint 10**: backend 28/28 pass + desktop 10/10 pass. Backend+desktop tsc 0 errori.

**Sprint 11 ✅ Completato — Quality audit + UI loop closure + tech debt** (branch `feat/sprint-11-debt-and-ui`, commits `355bf23..1dd2b05`):

3 agent paralleli (gsd-ui-auditor + general-purpose + Plan) hanno prodotto report attuati nello stesso sprint.

| # | Tema | Commit |
|---|------|--------|
| S11-A3 (MEDIUM-05) | PrismaClient singleton refactor: nuovo `_client.ts` esporta singleton + `disconnectPrisma()`. Tutti i 12 file (4 entry-point + 8 verticali) ora importano dal singleton. Da 12 connessioni a 1 per `pnpm db:seed`. Backward compat 100% standalone. | `355bf23` |
| S11-B1 | Frontend X-Truncated consumer: `authedFetchPaged<T>` + 4 helper paged-aware (`fetchEquipmentPaged`, etc.). AssetsPage mostra `TruncatedBanner` warning quando il backend cappa a 200. Closes loop con S10-A1 (MEDIUM-02). | `1517327` |
| S11-A1 (UI-REVIEW BLOCK) | Color & contrast fix: `--color-content-text` da `#e65712` (arancione 3.0:1) a `#212d52` (dark blue WCAG AA). Aggiunti token semantici `--color-success/warning/error/pending`. Definita `.btn-primary` mancante (usata 13× ma assente in CSS). Helper `.table-wrap`. LoginPage credenziali dev-only via `import.meta.env.DEV`. | `184d1fb` |
| S11-A2 (BCRYPT_AUDIT) | Audit bcryptjs: solo 2 file usano runtime (password.ts verifier + test fixtures). Decisione: NEEDS-PROD-VERIFY — rimozione safe in dev ma serve audit prod prima. Effort ~2h coding, 2-6 settimane calendar (re-hash organico via login). Documento BCRYPT_AUDIT.md include script Prisma allegato. | `1dd2b05` (artifact) |

**Test suite Sprint 11**: backend 28/28 pass + desktop 10/10 pass. Vite build 378.59 KB → 110.99 KB gzip in 4.81s. `pnpm db:seed` 1 sola PrismaClient connection. Backend+desktop tsc 0 errori.

**Sprint 12 ✅ Completato — Residual cleanup + UI long-term refactor + bcrypt monitor + seedSource** (branch `feat/sprint-12-residual-cleanup`, commits `5f41d57..38f1f82`):

4 wave parallele orchestrate da 4 agent + 1 manual: Wave A (3 task indipendenti), Wave B (backend schema), Wave C (2 split frontend pesanti, C1 ricaricato dopo watchdog stall del primo run).

| # | Tema | Commit |
|---|------|--------|
| S12-A1 | Rimozione `CustomersPage.tsx` (89 LOC dead code, non importata in DashboardPage). Confermato zero riferimenti via grep cross-repo. | `5f41d57` |
| S12-A2/1 (UI-REVIEW Quick Win 2 + Pattern 2) | `.tab-btn` + `.tab-btn-active` estratti in styles.css con `var(--color-accent)`. Banditi `#1f4ad6` da AssetsPage/TrainingPage TabButton e `#2563eb` da ChatbotPage user-bubble. | `0aec638` |
| S12-A2/2 (UI-REVIEW Quick Win 3) | NormSync status pills semantiche con `role="status"`, `aria-label`, `<span aria-hidden="true">🟡</span>` e classi `.status-pill-pending/approved/rejected/info` con color-mix sui token. | `75eb0e5` |
| S12-A2/3 (UI-REVIEW Quick Win 4) | NormSync `<table>` in `.table-wrap`, filtri stato in container `role="tablist"` con `role="tab"` + `aria-selected`. Label italianizzati ("In attesa", "Approvate", "Rifiutate", "Tutte"). | `1894e94` |
| S12-A2/4 (UI-REVIEW Quick Win 5) | `aria-label` ai 3 select standalone di QuotesPage + KpiPage (companyId, selectedNcId). | `7162df9` |
| S12-A3 (BCRYPT_AUDIT §2.2) | `apps/backend/scripts/audit-password-hashes.ts` read-only che conta hash per algoritmo + script npm `db:audit:passwords`. Run dev: 100% argon2id, exit 0. Pre-rimozione bcryptjs gate. | `dd3ee5f` |
| S12-B (MEDIUM-06) | Schema: `seedSource String?` su DocumentTemplate. seed-horeca usa ora `where: { seedSource: "horeca" }` invece di whitelist nomi/macroGroup. Forward-compatible (edilizia/sanita potranno usare la stessa pattern). Idempotenza confermata 2x run. Rimosse 2 costanti dead code (HORECA_MACRO_GROUPS, HORECA_GENERIC_DOC_NAMES). | `90d7278` |
| S12-C2 (UI-REVIEW Long-term #1) | AssetsPage 1059 → 225 LOC. 4 tab estratti in `pages/assets/{Equipment,Machines,Extinguishers,FirstAid}Tab.tsx` + `_shared.tsx` (130 LOC helper). State sharing via lift-up; X-Truncated meta resta nel parent. | `0a692b9` |
| S12-C1 (UI-REVIEW Long-term #1) | TrainingPage 829 → 94 LOC. 3 tab estratti in `pages/training/{Scadenze,Employees,Courses}Tab.tsx` + `_shared.tsx` (60 LOC). `getStatusColor`/`getStatusText` lasciati locali a ScadenzeTab (specifici scadenze formazione, non condivisi). | `38f1f82` |

**Test suite Sprint 12**: backend tutti i 10 file di test pass (chain `&&`), exit 0. Desktop tsc 0 errori. Vite build 56 modules (era 52 pre-split) → 378.93 KB / 110.98 KB gzip in 1.41s — bundle size identico al pre-split nonostante +1700 LOC distribuiti, conferma che il code splitting non aumenta payload finale.

**Sprint 13 ✅ Completato — ChecklistPage split + HoReCa templates audit** (branch `feat/sprint-13-checklist-split-and-horeca-templates`, commit `9b51a33`):

2 wave parallele in background. Wave B in stall watchdog ma research già conclusiva, recuperata in-context dal parent.

| # | Tema | Commit |
|---|------|--------|
| S13-A (UI-REVIEW Long-term #1, chiusura) | ChecklistPage 1946 → 1309 LOC. 5 step estratti in `pages/checklist/Step{0DatiAzienda,1Documenti,2LocaliAttrezzature,3ProcedureIgiene,4RiepilogoInvio}.tsx` + `_shared.tsx` (236 LOC: parsePersonCard, parseRolePersonCards, defaultAnswer, inferActivityFromAteco, atecoFromActivity, checklistModeLabel, ACTIVITY_TYPE_OPTIONS, STEPS, ...). State, ~30 handler closures e wizard chrome (stepper L1319, prev/next L1932-1937, registration footer L1938+) restano nel parent per lift-up rule. Pure JSX extraction, zero logic change. Step 0 "Dati Azienda" è il più pesante (654 LOC, ~50 props) come da struttura wizard originale. | `9b51a33` |
| S13-B (backlog HoReCa templates) | Audit research-only (no commit): comparato `seed-horeca.ts` corrente (8263 LOC) con versione pre-9aca204 (8278 LOC, dump tmp). 220 nomi `name: "..."` univoci coincidono **set-identicamente** (zero `^<` e `^>` su `diff` ordinato). Conclusione: la S7 restoration era completa, **nessun template HoReCa è stato perso**. Backlog item chiuso come N/A no-op verificato. La differenza `-15 LOC` è imputabile a S7-1 (rimozione bcrypt user seed) + S11-A3 (singleton client refactor) + S12-B (aggiunta `seedSource: "horeca"`). | — |

**Test suite Sprint 13**: desktop tsc 0 errori, backend tsc 0 errori (no backend mod). Vite build 62 modules → 384.23 KB / 112.71 KB gzip in 2.06s (era 56 mod / 378.93 / 110.98 in S12: +6 modules, +5.30 KB raw, +1.73 KB gzip imputabili a prop interfaces dei 5 step component).

ChecklistPage era il file più grande del desktop e l'ultimo refactor pesante deferred. Con questo split la **UI-REVIEW Long-term #1 è chiusa**: tutte le 3 pagine multi-tab/multi-step (AssetsPage, TrainingPage, ChecklistPage) sono ora orchestratrici thin con sub-component co-located in `pages/<page-dir>/`.

**Sprint 14 ✅ Completato — QR multi-asset + dark mode toggle** (branch `feat/sprint-14-qr-multi-asset-and-dark-mode`, commits `5af505f..26ef21e`):

2 wave parallele in background, entrambe pulite, zero conflitti su DashboardPage condiviso.

| # | Tema | Commit |
|---|------|--------|
| S14-A (backlog QR estintori/kits) | AssetQrPage 146 → 242 LOC. Aggiunto discriminator `assetKind: "equipment"\|"machine"\|"extinguisher"\|"firstAid"`, dispatch sui 4 fetchById già esistenti, render fields per kind (S/N per Equipment/Machine, Codice per FireExtinguisher con `manufactureDate` etichetta "Costruzione" — schema **non ha** `expiryDate`; FirstAidKit usa primi 8 char dell'`id` come Codice). qrData JSON e legacy URL `?id=...&kind=...` propagano il kind. `onOpenQr` signature aggiornata a `(id, kind) => void`; pulsante 🏷️ QR aggiunto nelle 3 tab orfane (Machines/Extinguishers/FirstAid), nascosto su `status === "decommissioned"` via prop conditional. DashboardPage propaga `qrAssetKind` state in parallelo a `qrAssetId`. | `26ef21e` |
| S14-B (backlog dark mode) | Aggiunto blocco `[data-theme="dark"]` (62 LOC) in styles.css con override completo dei token semantici (bg `#0f1729`, surface `#1a2440`, text `#e7ebf5`, primary `#8a9bd1`, accent `#ff7a3d`, border, shadow, soft-bg/border, sidebar variants). Hook `useTheme` (61 LOC) in `src/hooks/`: persiste in localStorage chiave `fedshield-theme`, rispetta `prefers-color-scheme` se assente, applica `data-theme` attribute su `<html>`. Toggle ☀️/🌙 in DashboardPage header (leftmost actions group). `@media print` resetta forzatamente i token a light per stampe pulite. **WCAG AA confermato**: text/bg 13.9:1 (AAA), text-muted 7.1:1, primary 5.6:1, accent 6.3:1, on-primary su accent 6.3:1. | `5af505f` |

**Test suite Sprint 14**: desktop tsc 0 errori, backend tsc 0 errori (no backend mod). Vite build 63 modules → **387.37 KB / 113.40 KB gzip** in 3.93s (era 62/384.23/112.71 in S13: +1 module, +3.14 KB raw, +0.69 KB gzip per useTheme hook + dark CSS block + assetKind discriminator).

**Ergonomia**: il consulente in cantiere ora può stampare QR per qualunque asset (estintori e cassette PS in particolare, dove è normativamente utile la verifica scadenze via QR scan). Dark mode sblocca uso prolungato in ambienti poco illuminati o con schermi OLED.

### Backlog residuo (Sprint 15+)

- HTTPS reverse proxy n8n VPS (richiede accesso infra)
- Playwright E2E browser-level (defense-in-depth oltre golden-path API)
- bcryptjs final removal: pipeline pronto (script audit S12-A3 committato), waiting for prod audit + finestra re-hash organico (2-6 settimane). Quando `db:audit:passwords` su prod = exit 0, procedere con rimozione branch in `plugins/password.ts` + dep dal `package.json`.
- Migrazione SQLite → Postgres prod
- Push CI workflow a origin (richiede autorizzazione esplicita user)
- ~~Restore seed HoReCa generic doc templates~~ — **chiuso S13-B** (no-op verificato)
- ~~ChecklistPage split (1946 LOC)~~ — **completato S13-A** (1946 → 1309 LOC parent + 5 step)
- ~~Stampabilità QR estintori/kits~~ — **completato S14-A**
- ~~Dark mode~~ — **completato S14-B** (toggle in header, persistenza localStorage, WCAG AA)

---

## 5. Prossimi Task per il Team

| Priorita | Task | Skill Suggerite |
|----------|------|-----------------|
| Alta | Import workflow n8n sul VPS + HTTPS reverse proxy | docker-development |
| Alta | Test E2E (Playwright) — flusso login → create company → create employee → record formazione | qa + test-driven-development |
| Alta | Ricostruire seed HoReCa monolitico (`pastry-split`, `horeca-completeness` riattivabili) | senior-backend |
| Media | Riparare `seed-metalmeccanico.ts` (enum `section` invalida) | senior-backend |
| Media | Tipare `request.user` con module-augmentation Fastify (L5) | senior-backend |
| Media | Cap `take: 200` o `companyId` obbligatorio su GET equipment list (L3) | senior-backend |
| Media | QR code stampabile per estintori/kits | frontend-design |
| Bassa | Rimozione finale `bcryptjs` quando il DB sarà tutto argon2 | senior-backend |
| Bassa | Dark mode / tema personalizzabile | ui-ux-pro-max |
| Bassa | Migrazione SQLite → Postgres per ambiente production | senior-backend |

---

## 6. Istruzioni per il Nuovo Agent

Se sei un agente che prende in mano questo progetto:

1. **Leggi AGENTS.md** per capire chi e l'utente e le priorita
2. **Leggi PRD.md** per capire cosa deve fare il prodotto
3. **Leggi questo file** per capire cosa e gia stato fatto
4. **Verifica backend attivo**: `curl http://localhost:4000/api/health`
5. **Verifica desktop**: `pnpm --filter @fedshield/desktop dev`
6. **Login test**: `admin@fedshield.local` / `fedshield123` (anche junior/senior, stessa password)
7. **Prima di modificare**: load skill pertinenti con `/skill load <name>`
8. **Se non sai quale skill**: usa `/find-skills <cosa cerchi>`
9. **Non inventare normative** — consulta agenti in `.claude/agents/`

---

## 7. Comandi Chiave

```bash
# Avvio completo
cd C:\Users\Salvatore\FedShield
pnpm --filter @fedshield/backend dev          # Terminale 1
pnpm --filter @fedshield/desktop dev          # Terminale 2

# Database reset + seed
cd apps/backend
npx prisma db push --force-reset
npx prisma db seed

# Creare utente admin
pnpm tsx prisma/add-user.ts

# Test
cd apps/backend && pnpm test
cd apps/desktop && pnpm build
```

---

*File generato automaticamente dalla sessione 2026-04-25*
*Per aggiornamenti: modifica e aggiorna la sezione "Registro Modifiche"*
