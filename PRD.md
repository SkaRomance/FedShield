# FedShield — Product Requirements Document (PRD)

> Versione: 0.3.0
> Data: 2026-04-25
> Stato: In sviluppo attivo

---

## 1. Visione

FedShield e una piattaforma desktop-first per consulenti HSE (Health, Safety, Environment) e consulenti alimentari. Permette di condurre sopralluoghi, generare attestati antisanzione, gestire checklist settoriali, monitorare formazione dipendenti, tracciare asset aziendali e ricevere consulenza AI normativa in tempo reale — anche durante il sopralluogo.

### Problema
I consulenti HSE lavorano sul campo con clienti diversi, settori diversi, normative complesse. Rischi:
- Dimenticare punti checklist critici → sanzioni
- Non tenere traccia scadenze formazione/asset → responsabilita
- Dubbi normativi durante ispezione → nessun supporto immediato
- Documentazione sparsa → difficile dimostrare due diligence

### Soluzione
FedShield centralizza tutto in un'app desktop offline-first con sync cloud:
- Checklist intelligenti per settore (Horeca, Edilizia, Metalmeccanico, Uffici IT, Sanita, Agricoltura)
- AuditBot AI per dubbi normativi in tempo reale
- Gestione formazione dipendenti con alert scadenze
- Tracciamento asset (macchine, estintori, cassette PS)
- Generazione automatica verbali, attestati, preventivi

---

## 2. Utenti

| Persona | Ruolo | Esigenze |
|---------|-------|----------|
| Consulente Junior | Ispeziona aziende, redige verbali | Guida passo-passo, checklist complete, riferimenti normativi |
| Consulente Senior | Coordina team, valida ispezioni | Dashboard KPI, overview clienti, gestione NC |
| Admin | Gestisce piattaforma, normative | NormSync, configurazione AI, report aggregati |
| Datore di Lavoro (cliente) | Riceve attestati e preventivi | Visualizza stato compliance, risponde a preventivi |

---

## 3. Requisiti Funzionali

### 3.1 Core — Ispezioni e Checklist

| ID | Feature | Priorita | Stato |
|----|---------|----------|-------|
| F-01 | Checklist per settore con domande e gravita default | Alta | ✅ Fatto (6 settori) |
| F-02 | Risposte Sì/No/N/A con note e allegati | Alta | ✅ Fatto |
| F-03 | Generazione NC automatica da risposte "No" | Alta | ✅ Fatto |
| F-04 | Calcolo punteggio compliance (0-100) e stelle | Alta | ✅ Fatto |
| F-05 | Generazione verbale PDF | Alta | ✅ Fatto |
| F-06 | Generazione attestato antisanzione PDF | Alta | ✅ Fatto |

### 3.2 Gestione Clienti

| ID | Feature | Priorita | Stato |
|----|---------|----------|-------|
| F-07 | Anagrafica aziende con dati legali | Alta | ✅ Fatto |
| F-08 | Collegamento ATECO → checklist corretta | Alta | ✅ Fatto |
| F-09 | Storico ispezioni per azienda | Alta | ✅ Fatto |

### 3.3 Formazione Dipendenti — NUOVO

| ID | Feature | Priorita | Stato |
|----|---------|----------|-------|
| F-10 | Anagrafica dipendenti (azienda, ruolo, stato) | Alta | ✅ Fatto |
| F-11 | Catalogo corsi con requisiti ATECO/macro-gruppo | Alta | ✅ Fatto |
| F-12 | Record formazione per dipendente (data, scadenza, attestato) | Alta | ✅ Fatto |
| F-13 | Alert scadenze formazione (rosso <0ggi, arancio <30ggi, giallo <90ggi) | Alta | ✅ Fatto |
| F-14 | Dashboard scadenze con badge notifiche | Media | ✅ Fatto |
| F-15 | CRUD frontend dipendenti | Alta | 🔄 Da fare |
| F-16 | CRUD frontend corsi | Alta | 🔄 Da fare |

### 3.4 Asset e Attrezzature — NUOVO

| ID | Feature | Priorita | Stato |
|----|---------|----------|-------|
| F-17 | Registro asset (nome, tipo, tag, ubicazione, scadenze) | Alta | ✅ Fatto |
| F-18 | Registro macchine (MANUTENZIONE + SICUREZZA) | Alta | ✅ Fatto |
| F-19 | Registro estintori (capacita, agente, scadenze) | Alta | ✅ Fatto |
| F-20 | Registro cassette PS (contenuto, scadenze) | Alta | ✅ Fatto |
| F-21 | Alert scadenze asset | Alta | ✅ Fatto |
| F-22 | QR code per asset stampabile | Media | ✅ Fatto |
| F-23 | Dashboard overview asset | Media | ✅ Fatto |
| F-24 | CRUD frontend asset | Alta | 🔄 Da fare |

### 3.5 AI — AuditBot e NormSync — NUOVO

| ID | Feature | Priorita | Stato |
|----|---------|----------|-------|
| F-25 | Chatbot libero per consulente (n8n + Ollama Cloud) | Alta | ✅ Fatto |
| F-26 | Fallback offline knowledge base (40+ risposte HSE/HACCP) | Alta | ✅ Fatto |
| F-27 | NormSync: rilevamento automatico aggiornamenti normativi | Media | ✅ Route pronte, da collegare a n8n |
| F-28 | Proposte normative in admin panel | Media | ✅ Fatto |
| F-29 | Approvazione/rifiuto proposte con applicazione patch | Media | ✅ Fatto |

### 3.6 Preventivi e Malleva

| ID | Feature | Priorita | Stato |
|----|---------|----------|-------|
| F-30 | Generazione preventivi da NC | Alta | ✅ Fatto |
| F-31 | Gestione stati preventivo (accettato, rifiutato, rinnovo) | Alta | ✅ Fatto |
| F-32 | Malleva (delega a terzi) | Media | ✅ Fatto |

### 3.7 KPI e Reporting

| ID | Feature | Priorita | Stato |
|----|---------|----------|-------|
| F-33 | KPI per consulente (ispezioni, NC, conversioni) | Media | ✅ Fatto |
| F-34 | KPI per azienda (compliance score, radar aree) | Media | ✅ Fatto |
| F-35 | Report difensivo ODV (sanzioni vs NC riportate) | Media | ✅ Fatto |
| F-36 | Snapshot periodici | Media | ✅ Fatto |

### 3.8 sync e Licenza

| ID | Feature | Priorita | Stato |
|----|---------|----------|-------|
| F-37 | Sync offline-first (coda locale) | Alta | ✅ Fatto |
| F-38 | Licenza device con grace period | Alta | ✅ Fatto |
| F-39 | Heartbeat e validazione server | Alta | ✅ Fatto |

---

## 4. Requisiti Non Funzionali

| ID | Requisito | Target |
|----|-----------|--------|
| NF-01 | Offline-first | Funziona senza internet, sync quando disponibile |
| NF-02 | Performance | Avvio <3s, caricamento checklist <1s |
| NF-03 | Sicurezza | JWT, argon2 password, nessun dato reale nel repo |
| NF-04 | Portabilita | Windows desktop (Electron), backend locale |
| NF-05 | Backup | SQLite exportabile, sync cloud opzionale |
| NF-06 | Normative accurate | Citare sempre riferimento normativo, non inventare |
| NF-07 | Lingua | Italiano per utente, inglese per codice |
| NF-08 | Estensibilita | Facile aggiungere nuovi settori checklist |

---

## 5. Architettura

```
┌─────────────────────┐
│   Electron Desktop  │  React 19 + Vite 7
│  (apps/desktop/)    │
└──────────┬──────────┘
           │ HTTP localhost:4000/api
┌──────────▼──────────┐
│   Fastify Backend   │  Node.js 18 + Fastify 5
│  (apps/backend/)    │  Prisma 6 + SQLite/PostgreSQL
└──────────┬──────────┘
           │ n8n Webhook
┌──────────▼──────────┐
│   n8n Server (VPS)  │  87.106.168.71:5678
│                     │  AuditBot + NormSync workflows
└──────────┬──────────┘
           │ Ollama API
┌──────────▼──────────┐
│   Ollama Cloud      │  GLM 5.1 / Kimi K2.6
│                     │  Modelli LLM locali
└─────────────────────┘
```

### Database Schema (Prisma)

**Core**: User, Company, Inspection, ChecklistTemplate, ChecklistItem, ChecklistAnswer, NonConformity, Quote, Document, License, DeviceLicense

**Formazione**: Employee, TrainingCourse, TrainingRequirement, EmployeeTrainingRecord, TrainingChecklistTemplate, TrainingChecklistItem

**Asset**: Equipment, Machine, FireExtinguisher, FirstAidKit

**Normative**: NormativeSource, NormativePatchProposal

---

## 6. User Stories

### US-01 — Sopralluogo con checklist
Da consulente junior, voglio aprire una checklist Horeca, rispondere alle domande con Sì/No e generare automaticamente le NC sanzionabili, cosi non dimentico niente e il cliente vede subito cosa rischia.

**Criteri di accettazione**:
- Checklist carica in <1s
- Risposta "No" genera NC con gravita e sanzionabilita predefinite
- Posso aggiungere note e foto per ogni risposta
- Punteggio finale 0-100 calcolato in automatico

### US-02 — Dubbio durante il sopralluogo
Da consulente, durante un sopralluogo ho un dubbio sui DPI. Voglio chiedere al chatbot "I lavoratori DEVono usare il casco in cantiere?" e ricevere subito la risposta con articolo del D.Lgs. 81, senza dover cercare su internet o chiamare il senior.

**Criteri di accettazione**:
- Chatbot accessibile in <2 click
- Risposta in <3 secondi
- Cita sempre riferimento normativo
- Funziona offline (knowledge base locale)

### US-03 — Scadenza formazione
Da consulente, voglio vedere in dashboard quali dipendenti hanno la formazione in scadenza nei prossimi 30 giorni, cosi posso avvisare il cliente prima che scadi.

**Criteri di accettazione**:
- Badge rosso sulle scadenze <0ggi
- Badge arancione <30ggi
- Badge giallo <90ggi
- Click sul badge apre lista dettagliata

### US-04 — NormSync
Da admin, voglio che il sistema monitori automaticamente le nuove normative e mi proponga aggiornamenti alle checklist, cosi restiamo sempre compliant senza dover manualmente controllare ogni settimana.

**Criteri di accettazione**:
- Proposta automatica quando c'e nuova norma
- Posso approvare/rifiutare con un click
- Approvazione applica patch alle checklist
- Storico modifiche normative

---

## 7. Flussi Utente

### Flusso 1 — Nuova Ispezione
```
Login → Seleziona Azienda → Crea Ispezione
  → Scegli tipo checklist (unified/safety/haccp)
  → Rispondi domande Sì/No/NA
  → Aggiungi note/foto
  → Genera verbale PDF
  → Genera attestato (se punteggio >= 75)
  → Chiudi ispezione
```

### Flusso 2 — Chatbot durante sopralluogo
```
Naviga → 🤖 AuditBot
  → Scrivi domanda (es. "DPI obbligatori in cantiere?")
  → Ricevi risposta con articolo normativo
  → Continua ispezione
```

### Flusso 3 — Alert scadenze
```
Dashboard → Badge notifiche rosso
  → Click badge → vedi lista alert
  → Click alert formazione → pagina training
  → Click alert asset → pagina asset
```

---

## 8. Roadmap

### Fase 1 — MVP (Completato)
- [x] Checklist base (Horeca)
- [x] Ispezioni e verbali
- [x] Login e licenze
- [x] sync offline-first

### Fase 2 — Piattaforma Completa (In corso)
- [x] 6 settori checklist
- [x] Formazione dipendenti
- [x] Asset tracking
- [x] AuditBot AI
- [x] NormSync admin
- [ ] Form CRUD frontend (dipendenti, corsi, asset)
- [ ] Import workflow n8n su VPS
- [ ] Test E2E

### Fase 3 — Scale (Futuro)
- [ ] App mobile/tablet
- [ ] Integrazione INAIL/INL
- [ ] Cliente self-service portal
- [ ] AI predictive (previsione rischi)
- [ ] Multi-tenant cloud

---

## 9. Metriche di Successo

| Metrica | Target | Strumento |
|---------|--------|-----------|
| Tempo sopralluogo | -30% | Confronto con/c senza app |
| NC dimenticate | 0 | Confronto checklist vs verbali |
| Scadenze saltate | 0 | Alert e badge |
| Adozione consulenti | >80% | Login attivi |
| Tempo risposta chatbot | <3s | Log backend |
| Soddisfazione cliente | >4/5 | Survey post-ispezione |

---

## 10. Glossario

| Termine | Significato |
|---------|-------------|
| HSE | Health, Safety, Environment (salute, sicurezza, ambiente) |
| DVR | Documento di Valutazione dei Rischi |
| DPI | Dispositivi di Protezione Individuale |
| NC | Non Conformita |
| D.Lgs. 81/08 | Testo Unico Sicurezza |
| HACCP | Hazard Analysis Critical Control Point |
| ATECO | Codice classificazione attivita economica |
| n8n | Workflow automation tool |
| Ollama | Piattaforma LLM open source |
| NormSync | Sistema aggiornamento normativo automatico |
| AuditBot | Chatbot AI per consulenti HSE |

---

*Documento gestito dal team. Aggiornare a ogni release significativa.*
