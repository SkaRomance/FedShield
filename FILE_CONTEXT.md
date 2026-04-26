# FILE_CONTEXT.md — FedShield

## Cos'è questo file
Questo documento serve agli agenti AI per capire **in pochi secondi** come è strutturato il progetto, dove trovare i file importanti e quali sono le convenzioni di sviluppo. Ogni volta che un agente lavora su FedShield, deve leggerlo prima di iniziare.

---

## Panoramica del Progetto

FedShield è una piattaforma **anti-sanzione** per consulenti HSE (salute, sicurezza, igiene). Aiuta a svolgere sopralluoghi digitali, generare verbali PDF anti-manomissione, gestire non conformità (NC), emettere preventivi e monitorare KPI compliance.

---

## Struttura File e Cartelle

```
FedShield/
├── README.md              # Documentazione utente / avvio rapido
├── PRD.md                 # Product Requirements Document
├── FILE_CONTEXT.md        # Questo file (contesto per agenti AI)
├── AGENTS.md              # Istruzioni per agenti AI sul progetto
├── package.json           # Root monorepo
├── pnpm-workspace.yaml    # Definizione workspace pnpm
├── tsconfig.base.json     # Configurazione TypeScript base
│
├── apps/
│   ├── backend/           # Server API (Fastify + Prisma + SQLite)
│   │   ├── src/
│   │   │   ├── app.ts                 # Entry point Fastify (registra plugin e route)
│   │   │   ├── server.ts              # Avvio server
│   │   │   ├── config.ts              # Configurazioni ambiente
│   │   │   ├── plugins/
│   │   │   │   ├── prisma.ts          # Plugin Prisma (connessione DB)
│   │   │   │   ├── auth.ts            # JWT + module augmentation request.user
│   │   │   │   ├── audit.ts           # Audit logging fail-soft
│   │   │   │   ├── password.ts       # argon2id + verifier dual-format (bcrypt legacy)
│   │   │   │   ├── prisma-errors.ts  # Helper P2002 → 409 Conflict
│   │   │   │   └── quote-sweeper.ts   # Scheduler scadenze preventivi
│   │   │   ├── modules/               # Moduli API (ognuno ha routes.ts)
│   │   │   │   ├── auth/
│   │   │   │   ├── companies/
│   │   │   │   ├── employees/
│   │   │   │   ├── equipment/         # Equipment + Machine + FireExtinguisher + FirstAidKit
│   │   │   │   ├── inspections/
│   │   │   │   ├── checklists/
│   │   │   │   ├── quotes/
│   │   │   │   ├── kpi/
│   │   │   │   ├── notifications/
│   │   │   │   ├── norm-sync/         # Chatbot AI proxy + proposte normative
│   │   │   │   ├── odv/
│   │   │   │   ├── licensing/
│   │   │   │   ├── sync/
│   │   │   │   ├── training-courses/
│   │   │   │   └── health/
│   │   │   ├── services/              # Logica di business
│   │   │   │   ├── document.service.ts  # Generazione PDF/DOCX
│   │   │   │   ├── report.service.ts    # Report verbali
│   │   │   │   ├── restaurant-checklist-knowledge.ts  # Conoscenza normativa
│   │   │   │   ├── kpi.service.ts       # Calcolo KPI
│   │   │   │   ├── quote.service.ts     # Gestione preventivi
│   │   │   │   ├── odv.service.ts       # ODV e matching sanzioni
│   │   │   │   ├── licensing.service.ts # Licenze device
│   │   │   │   └── sync.service.ts      # Sync offline-first
│   │   │   ├── types/
│   │   │   │   └── fastify.d.ts         # Tipi custom Fastify
│   │   │   └── tests/                   # Test automatici (28 test, 10 file)
│   │   │       ├── auth-matrix.test.ts        # Role guards 401/403
│   │   │       ├── password.test.ts           # argon2id + verifier
│   │   │       ├── smoke.test.ts              # Boot + regression P0
│   │   │       ├── golden-path.test.ts        # E2E integration cross-modulo
│   │   │       ├── checklists.test.ts
│   │   │       ├── quotes.test.ts
│   │   │       ├── kpi-odv.test.ts
│   │   │       ├── licensing-sync.test.ts
│   │   │       ├── horeca-completeness.test.ts
│   │   │       └── pastry-split.test.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma            # Schema database
│   │   │   ├── seed.ts                  # Orchestrator (HoReCa + verticali)
│   │   │   ├── seed-users.ts            # 3 utenti dev (junior/senior/admin)
│   │   │   ├── seed-test-baseline.ts    # Baseline minima per test
│   │   │   ├── seed-horeca.ts           # 15 categorie ATECO HoReCa
│   │   │   ├── seed-checklist.ts        # Generic + re-export seedHoreca
│   │   │   ├── seed-edilizia.ts         # Settore edilizia
│   │   │   ├── seed-metalmeccanico.ts   # Settore metalmeccanico
│   │   │   ├── seed-sanita.ts           # Settore sanità
│   │   │   ├── seed-uffici.ts           # Settore uffici/IT
│   │   │   ├── seed-agricoltura.ts      # Settore agricoltura
│   │   │   └── seed-training.ts         # Corsi formazione cross-settore
│   │   ├── scripts/
│   │   │   └── fill_attestato_template.py  # Script Python compilazione attestato
│   │   ├── assets/templates/            # Template DOCX/PDF
│   │   └── package.json
│   │
│   ├── desktop/           # App Windows (Electron + React + Vite)
│   │   ├── electron/      # Main process e Preload
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── api.ts
│   │   │   ├── main.tsx
│   │   │   ├── styles.css
│   │   │   ├── pages/     # Pagine React (12 pagine)
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── ChecklistPage.tsx
│   │   │   │   ├── CustomersPage.tsx
│   │   │   │   ├── CustomerRegistryPage.tsx
│   │   │   │   ├── QuotesPage.tsx
│   │   │   │   ├── KpiPage.tsx
│   │   │   │   ├── OdvPage.tsx
│   │   │   │   ├── TrainingPage.tsx        # F-15/F-16 CRUD formazione
│   │   │   │   ├── AssetsPage.tsx          # F-24 CRUD asset (4 tab)
│   │   │   │   ├── AssetQrPage.tsx         # F-22 QR estintori/kits
│   │   │   │   ├── ChatbotPage.tsx         # AI AuditBot consultation
│   │   │   │   └── NormSyncAdminPage.tsx   # Admin proposte normative
│   │   │   ├── lib/
│   │   │   │   ├── markdown.ts             # renderAssistantMarkdown (DOMPurify+marked)
│   │   │   │   └── markdown.test.ts        # 10 test jsdom (XSS sanitization)
│   │   │   ├── hooks/
│   │   │   │   └── useNotificationBadge.ts # Badge alert dashboard
│   │   │   └── services/
│   │   │       └── syncManager.ts          # Gestione coda sync offline
│   │   └── package.json
│   │
│   └── tablet/            # App Android tablet (Expo)
│       ├── src/
│       │   ├── App.tsx
│       │   └── services/
│       │       └── api.ts
│       ├── app.json
│       └── package.json
│
├── packages/
│   └── shared-types/
│       └── src/index.ts   # Tipi TypeScript condivisi tra backend e frontend
│
├── docs/
│   └── prompts/
│       └── sprint-2-codex.md   # Prompt storici sviluppo
│
├── input/
│   ├── ALIMENTARE/        # Documenti normativi di riferimento
│   │   ├── Check list controllo ufficiale degli Operatori Settore Alimentare.pdf
│   │   ├── decdir77_08.pdf
│   │   ├── IFS_Food_v8_standard_IT.pdf
│   │   └── Manuale-HACCP-2020-Copia-Integrale.pdf
│   └── Format per Generazione Attestati/
│       └── Attestato_Antisanzione_TEMPLATE_PLACEHOLDERS.docx
│
└── logo/
    └── fedshield-logo.png
```

---

## Convenzioni di Codice

### Linguaggio
- I nomi di file e variabili sono in **inglese** (tech standard)
- I commenti e la documentazione possono essere in **italiano**
- I testi utente sono in **italiano**

### Database (Prisma)
- Nomi model in **PascalCase** (es. `Inspection`, `NonConformity`)
- Nomi campo in **camelCase** (es. `companyId`, `createdAt`)
- Enum in **PascalCase + snake_case valori** (es. `InspectionStatus.draft`)
- Tutti i modelli hanno `id: String @id @default(cuid())`
- Tutti i modelli hanno `createdAt` e `updatedAt`

### API (Fastify)
- Route registrate in `modules/<nome>/routes.ts`
- Prefisso comune `/api`
- Plugin in `plugins/`
- Servizi in `services/`

### Errori
- Usa `@fastify/sensible` per risposte HTTP standard
- Lancia `throw app.httpErrors.unauthorized()` per 401
- Lancia `throw app.httpErrors.forbidden()` per 403
- Lancia `throw app.httpErrors.badRequest()` per 400
- `500` solo per errori server non gestiti

### Regole Business Importanti (NON MODIFICARE)
1. **Junior non può validare**: solo `senior` e `admin` possono validare sopralluoghi
2. **Immutabilità post-validazione**: `status === 'validated'` → nessuna nuova NC
3. **NC automatiche**: risposta `no` crea/aggiorna NC; `yes`/`na` rimuove la NC collegata
4. **Preventivi**: se stato `rejected`/`expired`/`assigned_to_third_party` → emette malleva automaticamente
5. **Sigillo PDF**: ogni documento generato ha `sealHash` calcolato sui metadati
6. **Licenza device**: `expiresAt` + `graceUntil` → se oltre `graceUntil`, il device è bloccato

---

## Variabili Ambiente Backend

| Variabile | Descrizione | Default |
|-----------|-------------|---------|
| `DATABASE_URL` | Path SQLite | `file:./dev.db` |
| `JWT_SECRET` | Secret firma token | — |
| `DOCUMENT_SEAL_SECRET` | Secret sigillo hash documenti | — |
| `LICENSE_ACTIVATION_CODE` | Codice attivazione device | — |
| `LICENSE_DURATION_DAYS` | Durata licenza | 365 |
| `LICENSE_GRACE_DAYS` | Giorni grace | 7 |
| `QUOTE_SWEEP_SECONDS` | Frequenza controllo preventivi | 60 |

---

## Comandi Utili

```bash
# Installa tutto
pnpm install

# Avvia backend
cd apps/backend
cp .env.example .env
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev

# Avvia desktop (altro terminale)
pnpm --filter @fedshield/desktop dev

# Avvia tablet (altro terminale)
pnpm --filter @fedshield/tablet start

# Test
cd apps/backend
pnpm test
```

---

## Dipendenze Critiche

| Pacchetto | Uso | Attenzione |
|-----------|-----|------------|
| `fastify` | Server HTTP | Non usare Express per coerenza |
| `@prisma/client` | ORM DB | Ricordare `db:generate` dopo modifiche schema |
| `jsonwebtoken` | Auth JWT | Verifica sempre `role` nei handler |
| `puppeteer` / `pdfkit` | PDF | Usare template DOCX + conversione se possibile |
| `bcrypt` / `argon2` | Password | Già configurato nel sistema |
| `sqlite` | Database locale | Non committare `.db` nel repo |

---

## Note per Agenti AI

1. **Prima di modificare**: leggi sempre il modello Prisma interessato (`schema.prisma`)
2. **Quando modifichi una route**: verifica che i ruoli siano controllati (`req.user.role`)
3. **Quando modifichi un servizio**: controlla se c'è un test esistente e aggiornalo
4. **Non rimuovere mai** la logica di audit logging (`plugins/audit.ts`)
5. **Se aggiungi un nuovo modulo**: segui il pattern `modules/<nome>/routes.ts` + registra in `app.ts`
6. **Se aggiungi conoscenza normativa**: usa `restaurant-checklist-knowledge.ts` come riferimento
7. **Per domande su normativa**: usa gli agenti in `.claude/agents/`
