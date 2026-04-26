# FedShield — Contesto Operativo per Agent Team

> Ultimo aggiornamento: 2026-04-25 (sessione P0 fix)
> Sessione: chatbot + backend + training + normsync + audit P0

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
- **Credenziali test**: `admin@fedshield.local` / `fedshield2026`

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

Sprint 3 — Production hardening: HTTPS reverse proxy n8n VPS, schema validation risposte n8n, sanitization HTML chatbot, unique constraints schema, E2E test, eventuale migrazione `bcryptjs → argon2`, DTO whitelisting companies.PATCH (breaking + frontend coordinato), risolvere 7 errori TS pre-esistenti in ChecklistPage/syncManager.

---

## 5. Prossimi Task per il Team

| Priorita | Task | Skill Suggerite |
|----------|------|-----------------|
| Alta | Import workflow n8n sul VPS + HTTPS reverse proxy | docker-development |
| Alta | Schema validation risposte n8n + sanitization HTML chatbot | senior-backend |
| Alta | Risolvere 7 errori TS pre-esistenti in ChecklistPage/syncManager | senior-backend |
| Media | Edit/delete macchine/estintori/cassette PS (Sprint 2 ha solo create) | frontend-design |
| Media | QR code stampabile per estintori/kits | frontend-design |
| Media | Test E2E (Playwright) — flusso login → create company → create employee → record formazione | qa + test-driven-development |
| Media | DTO whitelisting companies.PATCH (breaking, coordinato col frontend) | senior-backend |
| Bassa | Dark mode / tema personalizzabile | ui-ux-pro-max |
| Bassa | Migrazione bcryptjs → argon2 (PRD NF-03 strict compliance) | senior-backend |

---

## 6. Istruzioni per il Nuovo Agent

Se sei un agente che prende in mano questo progetto:

1. **Leggi AGENTS.md** per capire chi e l'utente e le priorita
2. **Leggi PRD.md** per capire cosa deve fare il prodotto
3. **Leggi questo file** per capire cosa e gia stato fatto
4. **Verifica backend attivo**: `curl http://localhost:4000/api/health`
5. **Verifica desktop**: `pnpm --filter @fedshield/desktop dev`
6. **Login test**: `admin@fedshield.local` / `fedshield2026`
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
