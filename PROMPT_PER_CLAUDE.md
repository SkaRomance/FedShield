# Prompt per Nuovo Agente Claude — Handoff FedShield

> Incolla questo in una nuova conversazione con Claude. Include tutto il contesto necessario per continuare.

---

##  Ciao Claude, continua il lavoro su FedShield

**Non reinventare nulla. Usa i file di contesto esistenti.**

### Passo 1 — Leggi i file di contesto
Esegui questi comandi subito:
```bash
cd C:\Users\Salvatore\FedShield
cat FEDSHIELD_CONTEXT.md
cat PRD.md
cat README.md
cat AGENTS.md
```

### Passo 2 — Verifica stato corrente
```bash
# Backend dev gia attivo su porta 4000?
curl http://localhost:4000/api/health

# Desktop dev gia attivo?
# Se no: pnpm --filter @fedshield/desktop dev

# Database seedato?
cd apps/backend && npx prisma studio
```

### Passo 3 — Cosa fare PRIMA (priorita dal PRD)
| Priorita | Task | File da modificare | Skill |
|----------|------|-------------------|-------|
| Alta | Form CRUD dipendenti in TrainingPage | `apps/desktop/src/pages/TrainingPage.tsx` | frontend-design |
| Alta | Form CRUD corsi in TrainingPage | `apps/desktop/src/pages/TrainingPage.tsx` | frontend-design |
| Alta | Form CRUD asset in AssetQrPage | `apps/desktop/src/pages/AssetQrPage.tsx` | frontend-design |
| Media | Import workflow n8n sul VPS | `infra/n8n/workflows/*.json` | docker-development |
| Media | QR code stampabile per estintori | `apps/desktop/src/pages/AssetQrPage.tsx` | frontend-design |
| Bassa | Test E2E training + asset | `apps/backend/src/tests/` | qa |

### Passo 4 — Regole
- **Backend**: usa `/skill load backend-development`
- **Frontend**: usa `/skill load frontend-design`
- **Database**: usa `/skill load database-designer`
- **Non committare mai** `.env`, file `.db`, dati reali
- **Non inventare normative** — consulta `.claude/agents/`
- **Prima di modificare**: leggi file e capisci convenzioni esistenti
- **Se il contesto <90%**: fai domande all'utente

### Passo 5 — Credenziali Test
```
Email:    admin@fedshield.local | senior@fedshield.local | junior@fedshield.local
Password: fedshield123  (unificata, gestita da seed-users.ts dal Sprint 5)
```

### File Chiave da Conoscere
| File | Scopo |
|------|-------|
| `apps/backend/src/app.ts` | Registrazione route |
| `apps/desktop/src/pages/DashboardPage.tsx` | Router pagine |
| `apps/desktop/src/api.ts` | Chiamate API frontend |
| `apps/desktop/src/pages/TrainingPage.tsx` | Formazione (da completare) |
| `apps/desktop/src/pages/ChatbotPage.tsx` | AuditBot (gia funzionante) |
| `apps/desktop/src/pages/AssetQrPage.tsx` | Asset (da completare) |
| `apps/backend/prisma/schema.prisma` | Database |
| `apps/backend/prisma/seed.ts` | Seed demo |

### Comandi Utili
```bash
# Avvio completo
cd C:\Users\Salvatore\FedShield
pnpm --filter @fedshield/backend dev      # Terminale 1
pnpm --filter @fedshield/desktop dev      # Terminale 2

# Database reset
npx prisma db push --force-reset && npx prisma db seed

# Test
pnpm --filter @fedshield/backend test

# Nuovo utente
pnpm --filter @fedshield/backend tsx prisma/add-user.ts
```

### Cosa NON fare
- Non rimuovere il fallback offline del chatbot — e la funzionalita principale
- Non aggiungere obbligo `companyId` al chatbot — deve restare libero
- Non rompere lo schema Prisma senza aggiornare seed
- Non usare `skipDuplicates` con SQLite Prisma

---

**Chiedi all'utente se vuoi subito far partire il backend/desktop o se preferisce vedere prima i file esistenti.**

**Prima di scrivere codice: usa `/skill load` per caricare le skill pertinenti.**
