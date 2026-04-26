# DOCS_AUDIT — FedShield

> Audit data: 2026-04-26
> Auditor: agent
> Branch: `fix/audit-p0-runtime-breakers` (40 commit avanti rispetto a `origin/main`)
> Stato repo di riferimento: Sprint 0-8 chiusi, 28 test backend + 10 test desktop pass

---

## Sintesi Esecutiva

| File | Stato | Priority finding |
|------|-------|------------------|
| `README.md` | NEEDS_UPDATE | P0 |
| `QUICKSTART.md` | NEEDS_UPDATE | P0 |
| `AGENTS.md` | NEEDS_UPDATE | P1 |
| `FILE_CONTEXT.md` | NEEDS_UPDATE | P0 |
| `PRD.md` | NEEDS_UPDATE | P1 |
| `PROMPT_PER_CLAUDE.md` | NEEDS_UPDATE | P1 |
| `FEDSHIELD_CONTEXT.md` | UP_TO_DATE | — (referenza dello stato corrente) |

**Pattern comuni di drift:**

1. **Password demo errata** — quasi tutti i doc indicano `fedshield2026`, ma `seed-users.ts` e `add-user.ts` ora usano `fedshield123` (Sprint 5).
2. **Manca documentazione test/seed strategy** — nessun doc menziona `seed-users.ts`, `seed-test-baseline.ts`, `pretest` hook, `cross-env`, o il fatto che `pnpm test` esegue 10 file (28 test).
3. **Nessuna menzione di argon2** — i doc parlano ancora di bcrypt o "bcrypt/argon2 già configurato"; l'unica password hash supportata in scrittura è argon2id (Sprint 3).
4. **Path file obsoleti** — `FILE_CONTEXT.md` cita 6 test file (oggi sono 11), 8 moduli backend (oggi sono 15), 8 pagine desktop (oggi sono 12), e omette le directory `lib/` e `hooks/` desktop.
5. **Assenti riferimenti a Helmet, rate-limit, requireRole, DOMPurify, marked, SSRF allowlist, length cap chatbot, unique constraints, soft-delete** — tutte feature deployate negli Sprint 1-8.
6. **Comandi seed obsoleti** — i doc indicano solo `npx prisma db seed`, mancano `pnpm db:seed:test`, `pnpm db:seed:users`, `pnpm db:push`.

---

## 1. `README.md` — NEEDS_UPDATE (P0)

### Drift identificato

| Riga | Tipo | Before | After (suggerito) |
|------|------|--------|-------------------|
| 36 | Setup | `Node.js 18+` | `Node.js 20+` (Fastify 5 + Prisma 6 lo richiedono in pratica) |
| 38–43 | Setup | Manca step build nativo `argon2` | Aggiungere nota: "Su Windows può servire `node-gyp` build per `argon2` — `pnpm install` lo gestisce di default, in caso di errore installare Visual Studio Build Tools / Python." |
| 60–69 | DB | `npx prisma db push --force-reset` + `npx prisma db seed` + `pnpm tsx prisma/add-user.ts` | Sostituire con il flusso ufficiale Sprint 5+: `pnpm db:push --force-reset` (o `npx prisma db push --force-reset`), poi `pnpm db:seed:users` (3 utenti dev), poi `pnpm db:seed` (full domain) **oppure** `pnpm db:seed:test` (baseline test). Documentare anche `pnpm db:seed:users` come alternativa rapida ad `add-user.ts`. |
| 73–78 | Credenziali | `admin@fedshield.local` / `fedshield2026` | `admin@fedshield.local` / `fedshield123` (vedi `prisma/seed-users.ts:21` e `add-user.ts:11`). Aggiungere anche `junior@fedshield.local` e `senior@fedshield.local`, stessa password (Sprint 5-S5-1). |
| 90 | Doc index | Manca riferimento a `QUICKSTART.md` come fonte canonica per quick start | OK (presente), ma manca riferimento a `FEDSHIELD_CONTEXT.md` come singolo doc up-to-date con tutti gli sprint. Aggiungere riga: `\| FEDSHIELD_CONTEXT.md \| Stato attuale degli sprint, decisioni di sicurezza, backlog priorizzato \|` |
| 96–116 | Endpoint | Lista incompleta | Aggiungere `/notifications/alerts`, `/auth/login` (presente ma con rate-limit 5/min), `/equipment` (con `?limit=` cap 200/500), `/companies` (junior vede dati redatti). Non serve un dump completo — punta a `docs/README-backend-additions.md`. |
| 142–149 | Checklist | Numeri item Edilizia "25/25" e altri settori "—" | Allineare ai conteggi reali Sprint 8: il `pnpm db:seed` ora produce **100 checklist item sectorial + 20 training item + 31 corsi training + 68 requirements** dai 4 seed verticali (metalmeccanico/sanita/uffici/agricoltura) + HoReCa (15 categorie ATECO 56.10.x) + Edilizia. Sostituire la tabella o linkare al test `horeca-completeness.test.ts`. |
| 187–197 | Test | `cd apps/backend && pnpm test` + `pnpm tsx src/tests/checklists.test.ts` | Aggiungere: `pnpm test` ora ha un hook `pretest` che esegue `pnpm db:seed:test` (seed-users + seed-test-baseline) prima di lanciare i 10 test file. Aggiungere comando frontend: `cd apps/desktop && pnpm test` (10 test jsdom su `markdown.ts`, Sprint 8-S8-4). Rimuovere riferimento `pnpm tsx src/tests/checklists.test.ts` perché ora richiede `cross-env NODE_ENV=test` (vedi `package.json:17`). |
| 41 | Path | `cd C:\Users\Salvatore\FedShield` | Path Windows-specifico hardcoded — non aggiornabile genericamente, accettabile se README è solo per l'utente target. |

### Sezioni mancanti da aggiungere

- **Sezione "Sicurezza"**: helmet (Sprint 1), rate-limit globale 100/min + per-route 5/min su `/auth/login` (Sprint 1), argon2id come unico hash supportato in scrittura (Sprint 3), anti-timing user enumeration (Sprint 6-M1), SSRF allowlist su `N8N_AUDITBOT_WEBHOOK` (Sprint 4-H1), length cap 4000 char chatbot (Sprint 4-H2), DOMPurify whitelist (Sprint 3-S3-2).
- **Sezione "Stato Sprint"**: punto unico per Sprint 0-8. Suggerimento: linkare a `FEDSHIELD_CONTEXT.md` invece di duplicare.
- **Variabili ambiente**: `FEDSHIELD_N8N_API_KEY` (Sprint P0-4), `N8N_AUDITBOT_WEBHOOK` (anche già citato).

---

## 2. `QUICKSTART.md` — NEEDS_UPDATE (P0)

### Drift identificato

| Riga | Tipo | Before | After (suggerito) |
|------|------|--------|-------------------|
| 24–29 | DB | `npx prisma db push --force-reset` + `npx prisma db seed` | Aggiungere flusso completo: `pnpm db:push --force-reset && pnpm db:seed:users && pnpm db:seed`. Spiegare differenza tra `db:seed` (full domain, 31 corsi+100 item), `db:seed:test` (baseline minimale per i test) e `db:seed:users` (solo i 3 utenti dev). |
| Tutto | Credenziali | Mancano credenziali test | Aggiungere: 3 utenti dev `junior/senior/admin@fedshield.local`, password unica `fedshield123` (Sprint 5). Coerentizzare con `README.md`. |
| 38–43 | Prossimi passi | "Importare workflow n8n sul VPS" / "Aggiungere form CRUD in frontend per dipendenti/corsi/asset" | DEPRECATO — Sprint 2 ha chiuso F-15/F-16/F-22/F-24 (CRUD frontend completo con edit/delete in TrainingPage e AssetsPage). Aggiornare a backlog Sprint 9: "HTTPS reverse proxy n8n VPS, Playwright E2E, rimozione bcryptjs legacy, dark mode, migrazione SQLite → Postgres prod". |
| 31 | "Cosa c'è già pronto" | "AuditBot (chat AI) e NormSync (proposte normative)" | Aggiungere: rendering markdown sanitizzato (DOMPurify), SSRF allowlist, length cap 4000 char (Sprint 3-4). |
| Mancante | Setup | Nessuna menzione di `cross-env` (richiesto Windows per `pnpm test`) e dipendenza nativa argon2 | Aggiungere nota "Su Windows: `cross-env` già installato come devDep, nessuna config aggiuntiva richiesta. Argon2 richiede compilazione C — se `pnpm install` fallisce, installare Build Tools." |

### Sezioni mancanti

- **Login first-time**: come testare `pnpm db:seed:users` per ottenere subito i 3 utenti senza eseguire l'intero `seed.ts` (più lento perché esegue HoReCa + 4 verticali).
- **Test**: una riga su `pnpm test` (backend, 28 test) + `pnpm --filter @fedshield/desktop test` (desktop, 10 test markdown).

---

## 3. `AGENTS.md` — NEEDS_UPDATE (P1)

### Drift identificato

| Riga | Tipo | Before | After (suggerito) |
|------|------|--------|-------------------|
| 38 | Test | `cd apps/backend && pnpm test` | OK per backend. Aggiungere: "Per il frontend: `cd apps/desktop && pnpm test`. Tutti i test devono passare PRIMA di committare. Hook `pretest` ricostruisce automaticamente lo stato DB di test." |
| 86–87 | Metadata | `Documento creato da: OpenCode AI / Data: 2026-04-23` | Datato pre-Sprint 0. Considerare aggiornamento data (oggi 2026-04-26) o nota "ultimo audit". |
| Mancante | Sicurezza | Nessuna menzione di "non rimuovere mai il rate-limit, helmet, role guards, audit log" | Aggiungere alla lista "Cosa NON fare": le mutazioni master-data (companies, employees, equipment, training-courses) richiedono `requireSeniorOrAdmin`/`requireAdmin` (Sprint 1-S1-2), tutte loggano via `writeAudit` (Sprint 1-S1-6). Non rimuovere. |
| Mancante | Schema | Nessuna menzione delle convenzioni unique constraints per multi-tenant | Aggiungere: `Employee[companyId,fiscalCode]`, `Equipment[companyId,serialNumber]`, `Machine[companyId,serialNumber]`, `FireExtinguisher[companyId,code]` (Sprint 3-S3-3). Conflitti restituiscono 409 via `replyOnUniqueViolation`. |

---

## 4. `FILE_CONTEXT.md` — NEEDS_UPDATE (P0)

### Drift identificato (sezioni intere obsolete)

| Riga | Tipo | Before | After (suggerito) |
|------|------|--------|-------------------|
| 38–47 | Path | Lista 9 moduli backend | Mancano: `employees/`, `equipment/`, `training-courses/`, `norm-sync/`, `notifications/`. Lista corrente reale: `auth, checklists, companies, employees, equipment, health, inspections, kpi, licensing, norm-sync, notifications, odv, quotes, sync, training-courses` (15 moduli). |
| 32–37 | Plugin | 4 plugin: `prisma.ts`, `auth.ts`, `audit.ts`, `quote-sweeper.ts` | Mancano: `password.ts` (Sprint 3-S3-7, dual-format verifier argon2/bcrypt + anti-timing dummy verify Sprint 6), `prisma-errors.ts` (helper `replyOnUniqueViolation` Sprint 3-S3-3). |
| 60–65 | Test | 6 test file | Lista corrente reale (11 file): `auth-matrix, checklists, golden-path, horeca-completeness, kpi-odv, licensing-sync, password, pastry-split, quotes, smoke, training`. Manca `golden-path` (Sprint 7), `auth-matrix` (Sprint 1), `password` (Sprint 3), `smoke` (Sprint 4), `training` (file presente in src/tests). |
| 66–69 | Seed | `schema.prisma + seed.ts` | Lista corrente reale prisma/: `add-user.ts, schema.prisma, seed.ts, seed-agricoltura.ts, seed-checklist.ts, seed-edilizia.ts, seed-horeca.ts, seed-metalmeccanico.ts, seed-sanita.ts, seed-test-baseline.ts, seed-training.ts, seed-uffici.ts, seed-users.ts` (12 file seed). |
| 81–91 | Pages | Lista 8 pagine desktop | Lista corrente reale (12 pagine): `LoginPage, DashboardPage, ChecklistPage, CustomersPage, CustomerRegistryPage, QuotesPage, KpiPage, OdvPage` + **mancanti** `AssetsPage` (Sprint 2-S2-3), `AssetQrPage` (Sprint 2-S2-4), `TrainingPage` (Sprint 2-S2-1), `ChatbotPage`, `NormSyncAdminPage`. |
| 90–91 | Services desktop | `services/syncManager.ts` | Aggiungere: directory `lib/` con `markdown.ts` + `markdown.test.ts` (Sprint 8-S8-4); directory `hooks/` con `useNotificationBadge.ts`. |
| 94–100 | Tablet | `apps/tablet/` con `App.tsx + services/api.ts` | OK (presente). Marcare "non attivo" come fa `FEDSHIELD_CONTEXT.md:25`. |
| 102–104 | Packages | `packages/shared-types/src/index.ts` | OK. Notare che `FEDSHIELD_CONTEXT.md:27` chiama erroneamente questa cartella `packages/contracts/` — incoerenza fra i due file. La cartella reale è `shared-types`, va corretto in FEDSHIELD_CONTEXT. |
| 67 | Schema | "Schema database (40 modelli)" | Verificare conteggio: lo schema è cresciuto Sprint 1-8 (aggiunti `NormativeSource`, `NormativePatchProposal`, +4 unique constraints, esteso enum `ChecklistSection` da 2 a 18 valori). Conteggio modelli probabilmente >40. |
| 124–125 | Convenzioni | "Tutti i modelli hanno `id: String @id @default(cuid())`" | OK ma da verificare globalmente con un grep. |
| 162–172 | Env vars | Lista 7 env var | Mancanti: `FEDSHIELD_N8N_API_KEY` (Sprint P0-4, Bearer/X-API-KEY proxy n8n), `N8N_AUDITBOT_WEBHOOK` (Sprint 4-H1 ora con allowlist SSRF). |
| 196–198 | Comandi | `pnpm db:generate; pnpm db:push; pnpm db:seed; pnpm dev` | Mancante: `pnpm db:seed:users`, `pnpm db:seed:test`, `pretest` hook auto-runs su `pnpm test`. |
| 205–212 | Dipendenze critiche | `bcrypt / argon2 — Già configurato` | DEPRECATO: `bcryptjs` è solo legacy reader (Sprint 3-S3-7), il writer è `argon2id`. Sostituire riga: "argon2 — hash password unico (argon2id), `bcryptjs` solo reader legacy in `plugins/password.ts`". |
| Mancante | Sicurezza | Nessuna sezione su helmet, rate-limit, requireRole, DOMPurify, SSRF allowlist | Aggiungere sezione "Sicurezza Built-in (NON RIMUOVERE)". |

### Sezioni mancanti da aggiungere

- **Sicurezza built-in**: helmet (Sprint 1-S1-5), rate-limit globale 100/min + login 5/min, argon2id, anti-timing dummy verify, SSRF allowlist, length cap chatbot 4000 char, DOMPurify hook globale `noopener noreferrer`, `parseLimit` cap 200/500 su GET asset (Sprint 8-S8-3).
- **Soft-delete pattern**: `status=decommissioned` su Equipment/Machine/FireExtinguisher/FirstAidKit (Sprint 3-S3-4), gli endpoint DELETE non cancellano fisicamente.
- **Test strategy**: `pretest` hook → `db:seed:test`, `cross-env NODE_ENV=test`, rate-limit off in test, 28 backend + 10 desktop = 38 test totali.

---

## 5. `PRD.md` — NEEDS_UPDATE (P1)

### Drift identificato

| Riga | Tipo | Before | After (suggerito) |
|------|------|--------|-------------------|
| 3 | Versione | `0.3.0` / `2026-04-25` | Bumpare a 0.4.0 con data 2026-04-26 (Sprint 6-7-8 completati dopo il 25). |
| 71–73 | Stato F-15/F-16 | "🔄 Da fare" (CRUD frontend dipendenti/corsi) | ✅ Fatto Sprint 2-S2-1 — `TrainingPage.tsx` ha 3 tab con Scadenze + Dipendenti CRUD (con soft-delete) + Catalogo corsi CRUD. |
| 85 | Stato F-24 | "🔄 Da fare" (CRUD frontend asset) | ✅ Fatto Sprint 2-S2-3 + Sprint 4-S4-2 — `AssetsPage.tsx` ha 4 tab (Attrezzature/Macchine/Estintori/Cassette PS) con form create + edit + delete (soft). |
| 130 | NF-03 Sicurezza | "JWT, argon2 password" | OK (compliant da Sprint 3-S3-7). Aggiungere note: "anche helmet, rate-limit, anti-timing user enumeration (Sprint 1-6)". |
| 252–263 | Roadmap Fase 2 | "Form CRUD frontend (dipendenti, corsi, asset) — Da fare" | DEPRECATO — checked. Aggiornare a "✅ Sprint 2 chiuso", spostare in Fase 1. |
| 254 | Fase 2 | "Test E2E — Da fare" | Aggiornare: golden-path test cross-modulo (Sprint 7-S7-4) e smoke test (Sprint 4-S4-3) presenti; Playwright browser-level rimane backlog (Sprint 9+). |
| 262 | Fase 2 | "Import workflow n8n su VPS — Da fare" | Stato: rimasto backlog Sprint 9+ (richiede accesso infra). Marcare come "Bloccato — accesso infra". |
| Mancante | F-XX | F-25 fallback offline knowledge base | Aggiungere: anti-XSS markdown (DOMPurify) Sprint 3, length cap 4000 char Sprint 4, SSRF allowlist Sprint 4. |
| 168–172 | Schema | "Normative: NormativeSource, NormativePatchProposal" | OK già presente. Aggiungere note: "+ 2 enum: NormativePatchStatus, NormativeSourceType" (Sprint 0-P0-3). |
| Mancante | Backlog | Backlog post-MVP | Già coperto ma incompleto. Aggiungere riferimento a `FEDSHIELD_CONTEXT.md:329-336` (backlog residuo Sprint 9+). |

### Sezioni mancanti da aggiungere

- **Sezione "Stato Sicurezza"** con compliance NF-03: argon2id (Sprint 3-S3-7), helmet (Sprint 1-S1-5), rate-limit (Sprint 1-S1-5), role guards (Sprint 1-S1-2), audit log fail-soft (Sprint 1-S1-6), JWT non leak verso n8n (Sprint P0-4), redazione PII junior (Sprint 6-M3), unique constraints multi-tenant (Sprint 3-S3-3).
- **Sezione "Stato Test"**: 28 backend (auth-matrix, password, smoke, golden-path, ...) + 10 desktop (markdown.test).

---

## 6. `PROMPT_PER_CLAUDE.md` — NEEDS_UPDATE (P1)

### Drift identificato

| Riga | Tipo | Before | After (suggerito) |
|------|------|--------|-------------------|
| 13–19 | "Leggi questi file" | `cat FEDSHIELD_CONTEXT.md / PRD.md / README.md / AGENTS.md` | OK. Aggiungere `FILE_CONTEXT.md` (struttura) e `DOCS_AUDIT.md` (questo file, se viene mantenuto). Su Windows `cat` funziona via Git Bash. |
| 35–41 | Task priorità | "Form CRUD dipendenti — Da fare" / "Form CRUD corsi" / "Form CRUD asset" | DEPRECATO — Sprint 2 ha chiuso. Sostituire con priorità Sprint 9+ del backlog di FEDSHIELD_CONTEXT.md:329-336. |
| 53–56 | Credenziali | `Email: admin@fedshield.local / Password: fedshield2026` | ERRATO — la password è `fedshield123` da Sprint 5-S5-1 (vedi `seed-users.ts:21` e `add-user.ts:11`). |
| 64–66 | "TrainingPage.tsx (da completare) / AssetQrPage.tsx (da completare)" | DEPRECATO — ambedue completate Sprint 2. Aggiornare a "TrainingPage.tsx (3 tab CRUD), AssetsPage.tsx (4 tab CRUD), AssetQrPage.tsx (QR rendering)". |
| 78–80 | Comandi | `npx prisma db push --force-reset && npx prisma db seed` / `pnpm --filter @fedshield/backend tsx prisma/add-user.ts` | Aggiungere `pnpm db:seed:users` (più rapido di `add-user.ts`); allineare comando a `pnpm db:push --force-reset && pnpm db:seed`. |
| 88–92 | "Cosa NON fare" | Lista 4 punti | Aggiungere: "non rimuovere helmet, rate-limit, role guards (`requireRole`/`requireSeniorOrAdmin`), `writeAudit` su mutazioni, DOMPurify hook chatbot, SSRF allowlist, length cap 4000". |

---

## 7. `FEDSHIELD_CONTEXT.md` — UP_TO_DATE

Stato corrente. Riferimento autoritativo per gli altri doc. Unica nota:

| Riga | Note |
|------|------|
| 25–35 | `packages/contracts/` è un nome obsoleto — la cartella reale è `packages/shared-types/`. Allineare con `FILE_CONTEXT.md:102-104` (che usa il nome corretto). Drift minore P2. |

---

## Priority Ranking & Action Plan

### P0 (correggere subito — drift critico per onboarding/dev)

1. **Password demo** in `README.md:77` e `PROMPT_PER_CLAUDE.md:55` — `fedshield2026` → `fedshield123`. Bloccante per chiunque tenti di loggarsi seguendo le istruzioni.
2. **Comandi seed** in `README.md:62`, `QUICKSTART.md:25`, `FILE_CONTEXT.md:178` — aggiungere `pnpm db:seed:users` e `pnpm db:seed:test` (Sprint 5).
3. **Lista test/moduli/pagine** in `FILE_CONTEXT.md:38, 60, 81` — disallineata di 5+ entry per ciascuna lista.
4. **CRUD frontend "Da fare"** in `PRD.md:71, 85`, `PROMPT_PER_CLAUDE.md:35-41`, `QUICKSTART.md:42` — DEPRECATO Sprint 2.

### P1 (correggere a breve — drift di feature/sicurezza)

1. **Sezione sicurezza mancante** in `README.md`, `FILE_CONTEXT.md`, `AGENTS.md`, `PRD.md` — helmet, rate-limit, argon2id, role guards, SSRF, DOMPurify, length cap, anti-timing.
2. **Variabili ambiente** mancanti (`FEDSHIELD_N8N_API_KEY`, `N8N_AUDITBOT_WEBHOOK`) in `FILE_CONTEXT.md:162`.
3. **PRD versione/data** — bumpare a 0.4.0 e marcare Sprint 6-8 completati.
4. **Test strategy section** — pretest hook, cross-env, NODE_ENV=test, rate-limit off in test, 28+10 test count.
5. **Bcrypt → argon2id** in `FILE_CONTEXT.md:212` (riga "bcrypt/argon2") — il writer è solo argon2id, bcryptjs è legacy reader.

### P2 (cleanup — drift minore)

1. `FEDSHIELD_CONTEXT.md:25` — `packages/contracts/` → `packages/shared-types/`.
2. `AGENTS.md:86-87` — data documento `2026-04-23` ormai > 3 giorni vecchia, considerare update.
3. `FILE_CONTEXT.md:67` — "40 modelli" da verificare con grep aggiornato.
4. `README.md:36` — `Node.js 18+` → `Node.js 20+` (sebbene 18 funzioni ancora con warning).

---

## Sezioni Trasversali Mancanti (da aggiungere a README + FILE_CONTEXT)

### Testing Strategy

```
Backend (apps/backend):
  pnpm test                     → pretest hook (db:seed:test) + 10 file (28 test)
  pretest                       → pnpm db:seed:users && tsx seed-test-baseline.ts
  cross-env NODE_ENV=test tsx … → ogni test wrapppato (rate-limit off, log silent)

Desktop (apps/desktop):
  pnpm test                     → tsx src/lib/markdown.test.ts (10 test jsdom)

Test files backend:
  - smoke (8): boot + health + regressioni P0-1/P0-2/P0-3 + chatbot length cap
  - auth-matrix (6): 401 senza JWT, 403 junior, 403 senior su admin-only, GET pubblici
  - password (6): argon2 hash, dual-format verify, anti-timing dummy verify
  - golden-path (2): senior cross-modulo + junior negative
  - checklists, quotes, kpi-odv, licensing-sync (legacy, vari)
  - pastry-split, horeca-completeness (HoReCa, dipendono da seed-horeca)
```

### Seed Strategy

```
seed-users.ts             → 3 utenti dev (junior/senior/admin@fedshield.local), pwd fedshield123, hash argon2id (idempotente upsert)
seed-test-baseline.ts     → 1 company + 1 template + 1 item + 1 doc template + chiamata seedChecklistTemplates
seed-checklist.ts         → re-export di seedHoreca (15 categorie ATECO 56.10.x)
seed-horeca.ts            → 8265 righe, restored Sprint 7 (ristoranti, bar, hotel, B&B, ostelli, campeggi, pasticcerie, pizzerie, mense, catering, food truck, gastronomia, balneari, locali)
seed-edilizia.ts          → cantieri, ATECO 41-43
seed-metalmeccanico.ts    → ATECO 25-28 (Sprint 8-S8-1 fix schema)
seed-uffici.ts            → ATECO 62-63
seed-sanita.ts            → ATECO 86
seed-agricoltura.ts       → ATECO 01-03
seed-training.ts          → 31 corsi + 68 requirements
seed.ts                   → orchestratore (chiama tutti gli 8 seed sopra)

Comandi:
  pnpm db:seed             → full domain (~10s)
  pnpm db:seed:test        → solo baseline test (~1s)
  pnpm db:seed:users       → solo 3 utenti (~0.5s)
  pnpm db:push             → applica schema senza seed
```

### Security Model

```
Auth:
  - JWT @fastify/jwt, role-based (junior/senior/admin)
  - Hash password: argon2id (memoryCost 19456, timeCost 2)
  - Reader dual-format: argon2 (writer) + bcryptjs (legacy only)
  - Anti-timing: consumeDummyVerify() su email non registrate
  - Rate-limit /auth/login: 5/min anti-brute-force

Authorization:
  - requireRole(roles[]) helper in plugins/auth.ts
  - requireAdmin / requireSeniorOrAdmin helper aliases
  - 12+ mutazioni master-data protette (companies, employees, equipment×4, training-courses)
  - Audit log fail-soft via writeAudit (errore loggato, mai propagato come 500)

Dati:
  - Junior: nominativi HACCP/medico competente redatti su GET /companies (Sprint 6-M3)
  - Multi-tenant unique constraints: Employee[companyId,fiscalCode], Equipment[companyId,serialNumber], Machine[companyId,serialNumber], FireExtinguisher[companyId,code]
  - Soft-delete su asset (status=decommissioned)
  - GET asset cap take:200, override ?limit=N max 500

Outbound:
  - SSRF allowlist su N8N_AUDITBOT_WEBHOOK (isSafeOutboundUrl)
  - JWT client NON inoltrato a n8n; backend autentica server-side con FEDSHIELD_N8N_API_KEY
  - Length cap 4000 char su question chatbot (DoS protection)
  - Zod validation su risposte n8n (whitelist answer/source/citations/timestamp)
  - Timeout 15s su chiamate n8n

Frontend:
  - DOMPurify + marked: rendering markdown chatbot sanitizzato
  - Hook globale DOMPurify forza rel="noopener noreferrer" su <a target="_blank">
  - URL whitelist: solo http(s)/mailto/tel; data: bloccato

Network:
  - Helmet headers (CSP off per API JSON)
  - Rate-limit globale 100/min, override 5/min su /auth/login
  - Rate-limit DISABLED in NODE_ENV=test

Credenziali:
  - admin@fedshield.local / fedshield123
  - senior@fedshield.local / fedshield123
  - junior@fedshield.local / fedshield123
```

---

## Inconsistenze Cross-Doc

| Inconsistenza | Doc A | Doc B | Suggested fix |
|---------------|-------|-------|---------------|
| Password demo | README.md:77 (`fedshield2026`) | seed-users.ts:21 (`fedshield123`) | Allineare README + PROMPT_PER_CLAUDE a `fedshield123` |
| Nome cartella tipi | FILE_CONTEXT.md:102 (`shared-types`) | FEDSHIELD_CONTEXT.md:27 (`contracts`) | Allineare FEDSHIELD_CONTEXT a `shared-types` (è il nome reale su filesystem) |
| Conteggio test backend | docs taciono | FEDSHIELD_CONTEXT.md:316 (28 test) | Aggiungere "28 test" a README sezione Test |
| Comandi seed | README/QUICKSTART (`prisma db seed`) | package.json (`pnpm db:seed:users` / `pnpm db:seed:test`) | Aggiornare README/QUICKSTART con i 3 comandi |
| Status CRUD frontend | PRD.md:71-85 ("Da fare") | FEDSHIELD_CONTEXT.md:222 ("PRD chiuso F-15/F-16/F-22/F-24") | Allineare PRD a stato Sprint 2 chiuso |

---

## Note Operative per il Fix

- **Non riscrivere `FEDSHIELD_CONTEXT.md`** — è la fonte di verità.
- **`README.md` e `QUICKSTART.md` hanno target diverso**: README per chi entra da zero (più completo), QUICKSTART per chi riprende il lavoro (sintetico). Mantenere il taglio attuale, solo correggere drift.
- **`FILE_CONTEXT.md`** è quello che richiede più lavoro (P0): probabilmente conviene rigenerarlo da zero leggendo l'attuale struttura `apps/`.
- **`PRD.md`** può rimanere alto-livello, ma serve coerenza Stato `✅`/`🔄` con Sprint chiusi.
- **`AGENTS.md` e `PROMPT_PER_CLAUDE.md`** sono prompt per agenti AI: focus sulla password (P0) e sui task DEPRECATI (Sprint 2 closed). Si possono ridurre molto se gli agenti leggono `FEDSHIELD_CONTEXT.md` per il dettaglio.

---

*Audit eseguito leggendo: README.md, QUICKSTART.md, AGENTS.md, FILE_CONTEXT.md, PRD.md, PROMPT_PER_CLAUDE.md, FEDSHIELD_CONTEXT.md + struttura repo (`apps/`, `packages/`, `prisma/`, `tests/`) + `package.json` backend/desktop + `schema.prisma` + 4 file seed campione.*
