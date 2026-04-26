# FedShield

> Piattaforma desktop-first per consulenti HSE e alimentari. Checklist, ispezioni, formazione, asset, AI — offline-first, sync cloud.

---

##  Panoramica

**FedShield** aiuta consulenti HSE a condurre sopralluoghi, generare attestati antisanzione, monitorare formazione dipendenti, tracciare asset aziendali e risolvere dubbi normativi in tempo reale — anche offline.

### Funzionalita Chiave
-  **6 settori checklist** (Horeca, Edilizia, Metalmeccanico, Uffici IT, Sanita, Agricoltura)
-  **AuditBot AI** — chatbot normativo per dubbi durante il sopralluogo, offline o con n8n + Ollama
-  **Formazione dipendenti** — catalogo corsi, record, alert scadenze automatici
-  **Asset tracking** — macchine, estintori, cassette PS, QR code
-  **NormSync** — rilevamento e applicazione aggiornamenti normativi
-  **Offline-first** — funziona senza internet, sync quando disponibile

---

##  Stack Tecnologico

| Livello | Tecnologia |
|---------|------------|
| Frontend | React 19 + TypeScript 5.9 + Vite 7 + Electron 37 |
| Backend | Fastify 5 + Prisma 6.16 + JWT |
| Database | SQLite (dev) / PostgreSQL (prod) |
| AI | n8n + Ollama Cloud (GLM 5.1 / Kimi K2.6) |
| Package | pnpm 10.29.2 (workspace monorepo) |

---

##  Avvio Rapido

### Prerequisiti
- Node.js 18+
- pnpm `npm install -g pnpm`

### Installazione
```bash
cd C:\Users\Salvatore\FedShield
pnpm install
```

### Avvio Sviluppo

**Terminale 1 — Backend API:**
```bash
pnpm --filter @fedshield/backend dev
```
Backend: http://localhost:4000

**Terminale 2 — Desktop App:**
```bash
pnpm --filter @fedshield/desktop dev
```
Electron si apre automaticamente (renderer su http://localhost:5180)

### Database e Seed

```bash
cd apps/backend

# 1. Applica schema a SQLite vuoto
pnpm db:push

# 2. Seed completo (HoReCa + verticali + corsi formazione)
pnpm db:seed

# 3. Solo utenti dev (idempotente, da solo)
pnpm db:seed:users

# 4. Setup minimo per i test (utenti + baseline + HoReCa)
pnpm db:seed:test
```

**Strategia seed** (dettagli sotto): `db:seed:test` è idempotente e veloce (~5s), pensato per girare prima dei test (`pretest` hook). `db:seed` esegue tutti i settori (~30s) ed è bloccato in `NODE_ENV=production` per evitare cascade delete (vedi S9 HIGH-01).

---

##  Credenziali Demo

| Email | Password | Ruolo |
|-------|----------|-------|
| `admin@fedshield.local` | `fedshield123` | Admin |
| `senior@fedshield.local` | `fedshield123` | Senior consulente |
| `junior@fedshield.local` | `fedshield123` | Junior consulente |

> Password unificata in dev: la stessa per i 3 ruoli, configurata in `apps/backend/prisma/seed-users.ts` (Sprint 5). Cambiata in `fedshield123` con la migrazione argon2id (Sprint 3).

---

##  Documentazione

| Documento | Scopo |
|-----------|-------|
| `AGENTS.md` | Istruzioni per agenti AI che lavorano sul progetto |
| `PRD.md` | Product Requirements Document — requisiti funzionali e roadmap |
| `FEDSHIELD_CONTEXT.md` | Contesto operativo per team di agenti (modifiche, skill, regole) |
| `docs/ARCHITETTURA-n8n-Ollama.md` | Architettura AI multi-agente (n8n + Ollama) |
| `docs/README-backend-additions.md` | Elenco endpoint API aggiunti |
| `QUICKSTART.md` | Guida rapida per riprendere il lavoro |

---

##  API Backend (Selezione)

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/auth/login` | POST | Login JWT |
| `/companies` | CRUD | Anagrafica clienti |
| `/inspections` | CRUD | Ispezioni |
| `/checklists/templates` | GET | Template checklist per ATECO |
| `/employees` | CRUD | Dipendenti e formazione |
| `/training/courses` | CRUD | Catalogo corsi |
| `/training/records` | CRUD | Record formazione dipendente |
| `/training/records/expiring` | GET | Prossime scadenze formazione |
| `/equipment` | CRUD | Asset generici |
| `/machines` | CRUD | Macchinari |
| `/fire-extinguishers` | CRUD | Estintori |
| `/first-aid-kits` | CRUD | Cassette PS |
| `/equipment/overview` | GET | Dashboard asset |
| `/chatbot/query` | POST | AuditBot AI — libero per il consulente |
| `/norm-sync/proposals` | CRUD | Proposte normative (admin) |
| `/norm-sync/stats` | GET | Dashboard NormSync |
| `/notifications/alerts` | GET | Alert scadenze (formazione + asset) |

Per l'elenco completo: `docs/README-backend-additions.md`

---

##  AI — AuditBot

Il chatbot e **libero per il consulente**: nessun obbligo di selezionare azienda, si puo usare durante il sopralluogo per qualsiasi dubbio normativo.

### Knowledge Base Offline
40+ risposte normative pre-caricate (D.Lgs. 81/08, HACCP, GDPR, etc.):
```
"DPI obbligatori?" → Citazione art. 74 + sanzioni
"DVR mancante?" → Reato art. 55, come redigerlo
"Estintore scaduto?" → DM 10/03/1998, NC sanzionabile
...
```

### Configurazione n8n + Ollama
1. Importa `infra/n8n/workflows/auditbot-workflow.json` in n8n
2. Configura `N8N_AUDITBOT_WEBHOOK` in `apps/backend/.env`
3. Se n8n e offline, il fallback knowledge base risponde comunque

---

##  Checklist Settoriali

| Settore | Codice | Item Premises | Item Procedures | Corsi |
|---------|--------|---------------|-----------------|-------|
| Horeca | 56 | 25 | 25 | 5 |
| Edilizia | 41-43 | 25 | 25 | 8 |
| Metalmeccanico | 25-28 | - | - | 5 |
| Uffici/Servizi IT | 62-63 | - | - | 4 |
| Sanita | 86 | - | - | 4 |
| Agricoltura | 01-03 | - | - | 3 |

---

##  Asset Tracking

Traccia 4 tipologie di asset:
- **Attrezzature generiche** (id, tipo, tag, scadenze)
- **Macchine** (costruttore, rischio, manutenzione, sicurezza)
- **Estintori** (capacita, agente, ricarica, collaudo)
- **Cassette PS** (contenuto, scadenza, addetto)

Alert automatici: rosso (<0ggi), arancione (<30ggi), giallo (<90ggi).

---

##  Formazione

- Catalogo corsi con requisiti per settore/rischio
- Record per dipendente con scadenza e attestato
- Dashboard scadenze con badge notifiche
- ATECO collegato → corsi consigliati automaticamente

---

##  NormSync

Sistema aggiornamento normativo:
1. n8n monitora fonti normative (Gazzetta Ufficiale, INAIL)
2. AI rileva modifiche rilevanti → crea proposta
3. Admin riceve proposta in pagina **NormSync**
4. Approva → patch applicata automaticamente alle checklist
5. Rifiuta → proposta archiviata

---

## Sicurezza

| Layer | Implementazione |
|-------|-----------------|
| Password | `argon2id` (Sprint 3, NF-03), verifier dual-format con re-hash opportunistico per hash bcrypt legacy |
| JWT | `@fastify/jwt` con secret env `JWT_SECRET`; payload tipato via module augmentation (Sprint 8 L5) |
| Rate limit | `@fastify/rate-limit` 100/min globale + 5/min su `/auth/login` (anti-brute force); skippato in `NODE_ENV=test` |
| Anti-timing | `consumeDummyVerify` su login con email non registrata (Sprint 6 M1) — uniforma latency response |
| HTTP headers | `@fastify/helmet` (CSP off su API JSON) |
| RBAC | `requireRole(roles)` / `requireSeniorOrAdmin` / `requireAdmin` — 401 senza JWT, 403 ruolo insufficiente |
| Output PII | DTO whitelist Zod su `/companies` (Sprint 3 S3-5); ruolo junior redige nominativi HACCP (Sprint 6 M3) |
| Markdown XSS | DOMPurify allowlist su risposte chatbot AI (`apps/desktop/src/lib/markdown.ts`); link `target=_blank` ottengono `rel=noopener noreferrer` |
| SSRF | `isSafeOutboundUrl` allowlist su `N8N_AUDITBOT_WEBHOOK` (Sprint 4 H1) |
| Audit log | `writeAudit` fail-soft su tutte le mutazioni (insert in `AuditLog`, errori loggati ma mai propagati) |
| Pagination cap | GET asset list cappati `take:200` default, max 500 via `?limit=N` (Sprint 8 L3); header `X-Total-Count` + `X-Truncated` (Sprint 10 MEDIUM-02) |

Per dettagli vedi `apps/backend/src/plugins/auth.ts`, `password.ts`, `apps/desktop/src/lib/markdown.ts`.

---

## Strategia Test

| Tipo | Tool | File | Coverage |
|------|------|------|----------|
| Backend integration | `node:test` + `app.inject()` | `apps/backend/src/tests/*.test.ts` | 28 test su 10 file |
| Backend pretest seed | `tsx prisma/seed-users.ts` + `seed-test-baseline.ts` | npm `pretest` hook | idempotente, ~5s |
| Desktop unit | `node:test` + `jsdom` | `apps/desktop/src/lib/*.test.ts` | 10 test markdown XSS sanitization |
| TypeScript | `tsc --noEmit` | `tsconfig.json` per ogni app | 0 errori backend + desktop |

```bash
# Backend completo (28 test)
cd apps/backend && pnpm test

# Desktop (10 test jsdom)
cd apps/desktop && pnpm test

# Singolo test backend
cd apps/backend && pnpm exec cross-env NODE_ENV=test tsx src/tests/golden-path.test.ts

# Type check
pnpm --filter @fedshield/backend exec tsc --noEmit -p tsconfig.json
pnpm --filter @fedshield/desktop exec tsc --noEmit -p tsconfig.json

# DB GUI
cd apps/backend && pnpm exec prisma studio
```

**Note importanti**:
- `cross-env NODE_ENV=test` è REQUIRED per skippare rate-limit nei test (Sprint 7 S7-2)
- `pretest` hook auto-esegue `db:seed:test` prima di `pnpm test` — DB sempre consistente
- I test HoReCa (`pastry-split.test.ts`, `horeca-completeness.test.ts`) verificano 15 categorie ATECO

---

## Strategia Seed

| Comando | Cosa fa | Quando usarlo |
|---------|---------|---------------|
| `pnpm db:seed` | Orchestrator: HoReCa + 5 settori verticali + training cross-settore | Setup ambiente dev completo |
| `pnpm db:seed:users` | Solo 3 utenti dev (junior/senior/admin@fedshield.local) | Reset password / onboarding rapido |
| `pnpm db:seed:test` | Users + baseline minima + HoReCa | Auto-eseguito dal `pretest` hook |

**File di seed** (`apps/backend/prisma/`):
- `seed.ts` — orchestrator (rifiuta NODE_ENV=production senza FEDSHIELD_ALLOW_PROD_SEED)
- `seed-users.ts` — 3 utenti idempotenti, password `fedshield123` argon2id
- `seed-test-baseline.ts` — 1 company + template + item + doc minimi
- `seed-horeca.ts` — 15 categorie ATECO HoReCa (8200+ righe)
- `seed-checklist.ts` — checklist generica + re-export seedHoreca
- `seed-edilizia.ts`, `seed-metalmeccanico.ts`, `seed-sanita.ts`, `seed-uffici.ts`, `seed-agricoltura.ts` — settori verticali (idempotenti)
- `seed-training.ts` — 31 corsi formazione + 68 requisiti ATECO

**Sicurezza seed**: HIGH-01 (Sprint 9) — `db:seed` rifiuta esecuzione in produzione perché i seed verticali fanno cascade delete su `EmployeeTrainingRecord`. Override esplicito: `FEDSHIELD_ALLOW_PROD_SEED=1`.

---

## Variabili d'Ambiente

`apps/backend/.env`:

| Variabile | Required | Default | Scopo |
|-----------|----------|---------|-------|
| `DATABASE_URL` | ✅ | `file:./prisma/dev.db` | Connection string Prisma (SQLite dev / Postgres prod) |
| `JWT_SECRET` | ✅ | — | Secret firma JWT (cambia in prod, min 32 char random) |
| `NODE_ENV` | ⬜ | `development` | `test` skippa rate-limit; `production` blocca seed |
| `N8N_AUDITBOT_WEBHOOK` | ⬜ | — | URL webhook n8n per AuditBot AI; se assente fallback knowledge base |
| `FEDSHIELD_N8N_API_KEY` | ⬜ | — | Header `X-API-KEY` server-side a n8n (sostituisce JWT client, Sprint 0 P0-4) |
| `FEDSHIELD_N8N_ALLOWED_HOSTS` | ⬜ | `87.106.168.71` | Allowlist host SSRF (Sprint 4 H1) |
| `FEDSHIELD_ALLOW_PROD_SEED` | ⬜ | — | Override per `db:seed` in `NODE_ENV=production` (rischio data-loss) |

`apps/desktop/.env` (renderer Vite, prefix `VITE_`):

| Variabile | Required | Default | Scopo |
|-----------|----------|---------|-------|
| `VITE_DEV_SERVER_URL` | ⬜ | `http://localhost:5180` | URL renderer per Electron in dev |

---

##  Test rapido

```bash
# Backend
cd apps/backend
pnpm test

# Singolo test
pnpm exec cross-env NODE_ENV=test tsx src/tests/checklists.test.ts

# Database GUI
pnpm exec prisma studio
```

Vedi sopra "Strategia Test" per il dettaglio.

---

##  Deploy

### Desktop (Windows)
```bash
cd apps/desktop
pnpm build
electron-forge make  # opzionale, per installer
```

### Backend (Docker)
```bash
# Vedi infra/docker/
docker compose up -d
```

---

##  Contribuire

1. Leggi `AGENTS.md` per le regole del progetto
2. Leggi `PRD.md` per i requisiti
3. Usa `FEDSHIELD_CONTEXT.md` per capire cosa e gia fatto
4. Per backend: usa `/skill load backend-development`
5. Per frontend: usa `/skill load frontend-design`

---

##  Licenza

Proprietaria — FedShield Team. Nessun dato reale deve essere committato.

---

**Contatti:** Per supporto tecnico o domande sul progetto, consulta la documentazione in `docs/`.
