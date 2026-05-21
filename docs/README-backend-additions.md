# Aggiornamenti Backend e Frontend — FedShield

Data: 2026-04-24

---

## 1. Database — Nuovi Modelli Prisma

| Modello | Scopo |
|---------|-------|
| `Employee` | Dipendenti aziendali con CF, ruolo, dipartimento |
| `TrainingCourse` | Catalogo corsi per settore ATECO |
| `TrainingRequirement` | Associa corso → settore/frequenza/obbligatorietà |
| `EmployeeTrainingRecord` | Storico corsi sostenuti con scadenze |
| `TrainingChecklistTemplate` | Template checklist formazione |
| `TrainingChecklistItem` | Domande specifiche per la formazione |
| `Equipment` | Asset generici (tag, stato, scadenza, QR code) |
| `Machine` | Macchinari collegati ad Equipment |
| `FireExtinguisher` | Estintori collegati ad Equipment |
| `FirstAidKit` | Cassette pronto soccorso collegate |
| `NormativeSource` | Fonti normative (Normattiva, EUR-Lex, INAIL) |
| `NormativePatchProposal` | Proposte di modifica checklist da approvare |

### Enum Aggiunti
- `EquipmentStatus` (active | maintenance | expired | decommissioned)
- `TrainingChecklistSection` (safety_training | health_surveillance | documentation)

---

## 2. API Endpoints

### Dipendenti
```
GET    /api/employees?companyId=&isActive=
POST   /api/employees
PATCH  /api/employees/:id
DELETE /api/employees/:id
GET    /api/employees/:id/training-records
```

### Corsi e Formazione
```
GET    /api/training/courses
POST   /api/training/courses
GET    /api/training/requirements
POST   /api/training/records
GET    /api/training/alerts?companyId=
```

### Asset (Equipment)
```
GET    /api/equipment?companyId=&type=&status=
POST   /api/equipment
PATCH  /api/equipment/:id
GET    /api/equipment/dashboard?companyId=
POST   /api/equipment/:id/qr
```

### Norm-Sync (Admin + n8n)
```
POST   /api/norm-sync/proposals          # Crea proposta (API key o admin)
GET    /api/norm-sync/proposals          # Lista (admin)
GET    /api/norm-sync/proposals/:id      # Dettaglio (admin)
PATCH  /api/norm-sync/proposals/:id/approve # Applica patch (admin)
PATCH  /api/norm-sync/proposals/:id/reject  # Rifiuta (admin)
POST   /api/chatbot/query                # AuditBot proxy
```

---

## 3. Seed Dati

Eseguire dopo `db:push`:

```bash
pnpm --filter @fedshield/backend db:seed
```

### Settori coperti
| Settore | Corsi | Item Checklist | Training Items |
|---------|-------|---------------|----------------|
| Horeca  | 7     | 50+          | 5              |
| Edilizia | 5    | 50           | 5              |
| Metalmeccanico | 7 | 25       | 5              |
| Uffici/Servizi IT | 7 | 25    | 5              |
| Sanita e Farmacie | 7 | 25    | 5              |
| Agricoltura e Cantine | 7 | 25    | 5              |

---

## 4. Frontend — Nuove Pagine

| Pagina | Percorso | Ruolo |
|--------|----------|-------|
| TrainingPage | `/` (tab "Formazione") | Tutti |
| ChatbotPage | `/` (tab "🤖 AuditBot") | Tutti |
| NormSyncAdminPage | `/` (tab "📜 NormSync") | Admin |

### Tabs aggiunti in DashboardPage:
- **Formazione** — Monitora scadenze corsi per dipendente
- **🤖 AuditBot** — Chatbot AI integrato (richiede n8n + Ollama)
- **📜 NormSync** (solo admin) — Approva patch normative rilevate dall'AI

---

## 5. Configurazione Ambiente

### Variabili .env backend
```env
DATABASE_URL="file:./dev.db"
FEDSHIELD_N8N_API_KEY="la-tua-api-key-segreta"
N8N_AUDITBOT_WEBHOOK="https://tuoi-n8n.webhook.site/chatbot-query"
```

### Variabili .env desktop
```env
VITE_API_BASE_URL="http://localhost:4000/api"
```

---

## 6. Test

```bash
# Backend
cd apps/backend
pnpm test

# Singoli test
pnpm vitest run src/tests/training.test.ts
```

---

## 7. Prossimi Passi Suggeriti

1. **Workflow n8n** — Importare `normsync-workflow.json` e `auditbot-workflow.json` in n8n
2. **Ollama Cloud** — Configurare endpoint e benchmark modelli (GLM 5.1, Kimi K2.6)
3. **Sincronizzazione** — Verificare che syncManager tratti i nuovi modelli
4. **Notifiche** — Aggiungere email/Slack per scadenze formazione e asset

---

*Documento aggiornato: 2026-04-24*
