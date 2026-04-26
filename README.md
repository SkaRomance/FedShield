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

# Push schema + seed dati demo
npx prisma db push --force-reset
npx prisma db seed

# Oppure crea solo utente admin
pnpm tsx prisma/add-user.ts
```

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

##  Test

```bash
# Backend
cd apps/backend
pnpm test

# Singolo test
pnpm tsx src/tests/checklists.test.ts

# Database
npx prisma studio  # GUI Prisma
```

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
