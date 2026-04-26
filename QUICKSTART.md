# FedShield — Guida Rapida per Riprendere il Lavoro

## Prerequisiti
- Node.js 24+ (testato con 24.x)
- pnpm 10.29.2 installato (`pnpm --version`)
- Git
- Su Windows: Visual Studio Build Tools per `argon2` (vedi sotto se errore install)

## Setup iniziale (prima volta)

```bash
cd C:\Users\Salvatore\FedShield

# 1. Install deps (5-10 min cold cache, argon2 nativo richiede compile)
pnpm install

# 2. Genera Prisma client + push schema a SQLite vuoto
pnpm --filter @fedshield/backend db:generate
pnpm --filter @fedshield/backend db:push

# 3. Seed iniziale: 3 utenti dev + dati demo
pnpm --filter @fedshield/backend db:seed:users   # solo utenti (junior/senior/admin)
pnpm --filter @fedshield/backend db:seed         # opzionale: settori HoReCa + verticali
```

> Se `pnpm install` fallisce su `argon2`: assicurati di aver Visual Studio Build Tools (Windows) o `build-essential` (Linux). Il fallback prebuilt binary di solito funziona ma richiede Node 24 + arch x64.

## Avvio sviluppo (2 terminali)

**Terminale 1 — Backend API:**
```bash
cd C:\Users\Salvatore\FedShield
pnpm --filter @fedshield/backend dev
```
Backend: http://localhost:4000

**Terminale 2 — Desktop App:**
```bash
cd C:\Users\Salvatore\FedShield
pnpm --filter @fedshield/desktop dev
```
Electron si apre automaticamente (renderer su http://localhost:5180).

## Login dev

Tutti e 3 gli utenti hanno la stessa password (Sprint 5 unificata):
| Email | Ruolo |
|-------|-------|
| `admin@fedshield.local` | Admin |
| `senior@fedshield.local` | Senior consulente |
| `junior@fedshield.local` | Junior consulente |

**Password**: `fedshield123` (in `apps/backend/prisma/seed-users.ts`).

## Ricostruzione database da zero

```bash
cd apps/backend
pnpm db:push --force-reset   # cancella tutto + ricrea schema
pnpm db:seed:users           # ri-seeda utenti
pnpm db:seed                 # opzionale: dati demo settori
```

## Test

```bash
# Backend (28 test, ~15s + pretest seed automatico)
cd apps/backend
pnpm test

# Desktop (10 test jsdom, ~2s)
cd apps/desktop
pnpm test

# Singolo test backend (richiede NODE_ENV=test per skippare rate-limit)
cd apps/backend
pnpm exec cross-env NODE_ENV=test tsx src/tests/golden-path.test.ts

# Type check (entrambi)
pnpm --filter @fedshield/backend exec tsc --noEmit -p tsconfig.json
pnpm --filter @fedshield/desktop exec tsc --noEmit -p tsconfig.json
```

> `cross-env NODE_ENV=test` è REQUIRED nei test backend: il rate-limit (100/min globale + 5/min su /auth/login) è attivo in dev/prod ma skippa quando NODE_ENV=test. Il `pretest` hook auto-esegue `db:seed:test` (utenti + baseline + HoReCa) prima di `pnpm test`.

## Cosa c'è già pronto (Sprint 0-9)

- **Auth**: JWT + argon2id, role guards (junior/senior/admin), anti-timing user enumeration
- **6 settori checklist**: HoReCa (15 categorie ATECO), Edilizia, Metalmeccanico, Uffici IT, Sanità, Agricoltura
- **Modulo formazione**: 31 corsi + 68 requisiti ATECO + record dipendente con scadenze
- **Modulo asset**: Equipment + Machines + FireExtinguishers + FirstAidKits con QR (frontend + API)
- **AuditBot AI**: chatbot normativo con DOMPurify XSS sanitization, knowledge base offline, n8n proxy SSRF-safe
- **NormSync**: proposte normative admin-only con approve/reject
- **Notifiche**: alert scadenze formazione + asset in dashboard
- **CI**: workflow GitHub Actions in `.github/workflows/ci.yml` (non ancora pushato)

## File chiave

| File | Scopo |
|------|-------|
| `apps/backend/src/app.ts` | Registrazione plugin/route + rate-limit conditional |
| `apps/backend/src/plugins/auth.ts` | JWT + module augmentation `request.user` |
| `apps/backend/src/plugins/password.ts` | argon2id verifier dual-format |
| `apps/backend/prisma/schema.prisma` | Modelli DB (40+) |
| `apps/backend/prisma/seed.ts` | Orchestrator seed (rifiuta in production) |
| `apps/desktop/src/pages/DashboardPage.tsx` | Router pagine + nav |
| `apps/desktop/src/api.ts` | Helper fetch tipizzati |
| `apps/desktop/src/lib/markdown.ts` | renderAssistantMarkdown XSS-safe |
| `FEDSHIELD_CONTEXT.md` | Storia sprint + decisioni architetturali |
| `FILE_CONTEXT.md` | Albero file + convenzioni |

## Prossimi passi consigliati

1. **Test login + nav**: avvia entrambi terminali, login con qualsiasi account, naviga tutte le pagine
2. **Push CI to origin**: il workflow `.github/workflows/ci.yml` è pronto ma non ancora attivo (richiede push)
3. **HTTPS reverse proxy n8n VPS**: il chatbot va via `87.106.168.71:5678` HTTP — serve reverse proxy con TLS
4. **Playwright E2E**: aggiungere test browser-level oltre il golden-path API
5. **Dark mode + Postgres migration**: nice-to-have post-MVP

## Troubleshooting

| Sintomo | Causa probabile | Fix |
|---------|----------------|-----|
| `pnpm install` fallisce su argon2 | Build tools mancanti | `apt install build-essential python3` (Linux) o Visual Studio Build Tools (Win) |
| Backend test → 429 Rate limit | NODE_ENV non è `test` | Usa `pnpm test` (cross-env auto) o prefix manualmente |
| Test login → 401 "Credenziali non valide" | Utenti non seedati | `pnpm db:seed:users` |
| `prisma db push` chiede conferma data-loss | Schema breaking change | `--accept-data-loss` se in dev (cancella dati) |
| Electron non apre | Vite renderer non pronto | Aspetta che vite stampi "ready in Xms", poi `wait-on tcp:5180` parte |
| Backend boot → `FST_ERR_DUPLICATED_ROUTE` | Regression P0-1 | Verifica `apps/backend/src/modules/norm-sync/routes.ts` non registri /chatbot 2 volte |
