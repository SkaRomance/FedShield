# FedShield — Architettura Multi-Agente n8n + Ollama Cloud

## Documento di Architettura

---

## 1. Visione Generale

FedShield deve diventare **autonomamente aggiornabile** dalle fonti normative e fornire **assistenza intelligente** al consulente in tempo reale. Questo obiettivo richiede due agenti autonomi orchestrati da n8n e alimentati da modelli AI cloud (Ollama).

### Agente 1: NormSync
> Monitora fonti normative, rileva cambiamenti, propone patch alle checklist, attende approvazione umana.

### Agente 2: AuditBot
> Chatbot esperto che risponde in tempo reale durante gli audit, citando norme, suggerendo gravita e servizi.

---

## 2. Infrastruttura

```
+-------------------------------------------------+
|                 FONTE NORMATIVE                  |
|  Normattiva   EUR-Lex   INAIL   Ministero       |
+----------+---------+---------+------------------+
           |         |         |
           v         v         v
+-------------------------------------------------+
|              SCRAPER / HTTP Polling             |
|        (n8n HTTP Request nodes, n8n schedule)   |
+----------+--------------------------------------+
           |
           v
+-------------------------------------------------+
|              AI AGENT (Ollama Cloud)            |
|  Modello: Mistral Large / GLM 5.1 / Kimi K2.6   |
|  Compito: Analizzare testo normativa e          |
|           determinare impatto sulle checklist   |
+----------+--------------------------------------+
           |
           v
+-------------------------------------------------+
|              DATABASE PATCH PROPOSAL              |
|  Tabella: NormativePatchProposal                 |
|  Stato: pending / approved / rejected           |
+----------+--------------------------------------+
           |
           v
+-------------------------------------------------+
|         ADMIN DASHBOARD (FedShield desktop)     |
|  Notifica: "Nuovo D.M. disponibile. Applica?"   |
|  Admin clicca APPROVA -> patch automatica DB    |
+-------------------------------------------------+
```

### Per AuditBot (chatbot durante l'audit)
```
+-------------------------------------------------+
|   Consulente durante audit (desktop/tablet)     |
|   Scrivi: "Ho trovato frigo a 8 gradi, rischio?" |
+----------+--------------------------------------+
           |
           v (WebSocket / HTTP POST)
+-------------------------------------------------+
|              n8n Webhook Endpoint                |
|  /webhook/chatbot-query                         |
+----------+--------------------------------------+
           |
           v
+-------------------------------------------------+
|          AI Agent (Ollama Cloud) + Memory        |
|  - Contesto azienda (ATECO, settore, storico)   |
|  - Knowledge base normativa caricata in context  |
|  - Storico conversazione (window buffer)         |
+----------+--------------------------------------+
           |
           v
+-------------------------------------------------+
|              Risposta al consulente              |
|  "Rischio: conservazione alimenti.              |
|   Riferimento: Reg. CE 852/2004, art.5.         |
|   Gravita: 4/4. Sanzionabile.                   |
|   Servizio consigliato: verifica catena fredda."  |
+-------------------------------------------------+
```

---

## 3. Schema Database per NormSync

```prisma
model NormativeSource {
  id          String   @id @default(cuid())
  name        String   // "Normattiva", "EUR-Lex", "INAIL"
  url         String
  lastCheckAt DateTime?
  lastContentHash String? // per evitare reprocessare
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model NormativePatchProposal {
  id            String   @id @default(cuid())
  sourceId      String
  normTitle     String
  normReference String
  normText      String?  // testo estratto
  changeSummary String
  proposedChanges Json // array di oggetti: { checklistType, area, question, severity, sanctionable }
  status        String   @default("pending") // pending, approved, rejected
  reviewedById  String?
  reviewedAt    DateTime?
  createdAt     DateTime @default(now())
}
```

---

## 4. Benchmark Modelli AI Cloud (Ollama)

Il team di provisioning valuta questi modelli in base ai benchmark HSE/legale:

| Modello | Contesto (tokens) | Italiano | Normativa | Costo | Raccomandazione |
|---------|-------------------|----------|-----------|-------|-----------------|
| **GLM 5.1** | 128K | Eccellente | Buono | Medio | Candidato principale |
| **Kimi K2.6** | 256K | Eccellente | Molto buono | Medio-alto | Raccomandato per NormSync |
| **GPT OSS 120B** | 128K | Buono | Buono | Medio | Alternativa valida |
| **Mistral Large 2** | 128K | Buono | Buono | Medio | Fallback affidabile |
| **Llama 3.3 70B** | 128K | Discreto | Da verificare | Basso | Solo se budget ristretto |

**Scelta consigliata:**
- **NormSync**: Kimi K2.6 (contesto lunghissimo per leggere decreti interi + alta precisione su normativa)
- **AuditBot**: GLM 5.1 (bilanciamento velocita/precisione/costo per risposte rapide)

---

## 5. Workflow n8n NormSync (dettaglio)

```
[1] Schedule Trigger (ogni Lunedi 6:00)
  |
  v
[2] HTTP Request -> Normattiva (nuovi decreti)
[3] HTTP Request -> EUR-Lex (nuovi regolamenti)
[4] HTTP Request -> INAIL (circolari)
  |
  v (raggruppa in array)
[5] Code Node: filtra solo nuovi (compara hash)
  |
  v
[6] Loop (SplitInBatches, batchSize=1)
  |
  v
[7] AI Agent (Ollama Cloud - Kimi K2.6)
    System prompt: "Sei un esperto normativo HSE italiano. 
    Leggi questo testo normativo e identifica se introduce, modifica o elimina 
    obblighi per le checklist di sicurezza sul lavoro o igiene alimentare.
    Per ogni modifica rilevante, restituisci un JSON con:
    { checklistType: 'safety'|'haccp'|'both', 
      area: string, question: string, 
      severity: 1-4, sanctionable: boolean }"
  |
  v
[8] IF (changes detected?)
  | si
  v
[9] HTTP POST -> FedShield API /api/norm-sync/proposals
[10] Slack/Email -> Notifica admin con riepilogo
```

---

## 6. Workflow n8n AuditBot (dettaglio)

```
[1] Webhook Trigger (POST /webhook/chatbot-query)
    Body: { companyId, question, inspectionId?, history[] }
  |
  v
[2] HTTP Request -> FedShield API
    GET /api/companies/:id (context azienda: ATECO, settore)
    GET /api/inspections/:id (dati audit in corso, se presente)
  |
  v
[3] AI Agent (Ollama Cloud - GLM 5.1)
    System prompt: "Sei un consulente HSE esperto italiano. 
    Rispondi alla domanda del consulente basandoti su:
    1. Normativa vigente (D.Lgs. 81/08, Reg. CE 852/04, etc.)
    2. Contesto aziendale
    3. Stato audit in corso
    Cita sempre la norma esatta. Suggerisci gravita (1-4) e sanzionabilita."
  |
  v
[4] Webhook Response -> JSON con { answer, normReference, severity?, suggestedService? }
```

---

## 7. Integrazione con FedShield Backend

Nuovi endpoint API da creare:

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/api/norm-sync/proposals` | GET | Lista proposte in attesa |
| `/api/norm-sync/proposals` | POST | Ricevi nuova proposta da n8n |
| `/api/norm-sync/proposals/:id/approve` | PATCH | Admin approva -> applica patch |
| `/api/norm-sync/proposals/:id/reject` | PATCH | Admin rifiuta |
| `/api/chatbot/query` | POST | Proxy interno per AuditBot (chiama n8n) |

---

## 8. Sicurezza

- n8n comunica con FedShield via API key dedicata
- Ollama Cloud usa API key separata
- Nessun dato cliente sensibile esce dal sistema FedShield (solo testo normativo e domande generiche)
- Audit log per ogni azione NormSync e ogni query AuditBot

---

## 9. Prossimi Passi Implementazione

| # | Task | Stima |
|---|------|-------|
| C.1.1 | Installare n8n (locale o cloud) e connettere MCP | 1-2 giorni |
| C.1.2 | Configurare account Ollama Cloud + API key | 1 giorno |
| C.1.3 | Creare schema Prisma NormativePatchProposal | 2 ore |
| C.1.4 | Sviluppare API norm-sync (proposals CRUD) | 1 giorno |
| C.2.1 | Creare workflow n8n NormSync (scraper + AI) | 2-3 giorni |
| C.2.2 | Creare pagina admin "Aggiornamenti Normativi" | 1-2 giorni |
| C.3.1 | Creare workflow n8n AuditBot | 1-2 giorni |
| C.3.2 | Integrare chatbot nella pagina Checklist | 1-2 giorni |

---

*Architettura redatta da: OpenCode AI Agent*
*Data: 2026-04-23*
*Versione: 1.0*
