# AGENTS.md — Istruzioni per Agenti AI su FedShield

## Benvenuto Agente AI

Questo file ti dice come lavorare su FedShield in modo sicuro, coerente e utile per l'utente.

---

## Chi è l'utente

L'utente non è un informatico. È un imprenditore nel settore consulenza HSE (salute, sicurezza, igiene alimentare) con un team di consulenti tecnici. Quando parli, usa parole semplici e spiega il "perché" delle cose.

---

## Le Priorità

1. **Non rompere mai il flusso checklist → NC → preventivi → documenti.**
2. **La sicurezza dei dati dei clienti è sacra.** Non committare mai dati reali.
3. **I test devono passare.** Se modifichi una regola business, aggiorna i test.
4. **Prima di creare nuovo codice, riusa quello esistente.**

---

## Come Lavorare su questo Progetto

### Prima di iniziare
1. Leggi `FILE_CONTEXT.md` per capire dove sono i file
2. Leggi `PRD.md` per capire cosa deve fare il prodotto
3. Se la modifica riguarda normativa (D.Lgs. 81, Reg. CE 852, allergeni, etc.), consulta gli agenti specializzati in `.claude/agents/`

### Durante lo sviluppo
- Fai **commit piccoli** e chiari (descrivi "cosa" e "perché" in italiano)
- Se modifichi il database, aggiorna lo schema Prisma, il seed e i tipi condivisi
- Se aggiungi una nuova API, aggiorna la lista endpoint in `README.md`
- Se aggiungi una nuova pagina desktop, aggiorna `App.tsx`

### Dopo aver finito
- Esegui i test: `cd apps/backend && pnpm test`
- Verifica che il backend si avvii senza errori
- Non committare `node_modules`, `.db`, file `.env` reali

---

## Gli Agenti del Team (in `.claude/agents/`)

| Agente | File | Quando usarlo |
|--------|------|---------------|
| **Sicurezza Lavoro** | `AGENT-Sicurezza-Lavoro.md` | Per D.Lgs. 81/08, DPI, formazione, antincendio, RSPP |
| **HACCP** | `AGENT-HACCP.md` | Per Reg. CE 852/04, CCP, allergeni, igiene alimentare |
| **Normativa Italiana** | `AGENT-Normativa-Italiana.md` | Per D.Lgs. 231, privacy, appalti, ambientale, INAIL, fatturazione |
| **Compliance Alimentare** | `AGENT-Compliance-Alimentare.md` | Per settore alimentare operativo, OSA, NAS, tracciabilità |

---

## Domande Frequenti da Fare all'Utente

L'utente ha detto: "**Se hai bisogno di contesto, non inventare ma chiedi a me.**"

Quindi, quando:
- Non conosci il settore specifico del cliente (es. "È un ristorante o un catering?")
- Non sei sicuro di un riferimento normativo (es. "Confermi che questa azienda ha più di 15 dipendenti?")
- Serve sapere un dato operativo (es. "La checklist riguarda anche il magazzino o solo la cucina?")

→ **Chiedi subito**, non inventare risposte.

---

## Linee Guida Normative (NON INVENTARE)

Quando generi contenuti normativi (NC, riferimenti, sanzioni):
- **Cita la norma esatta** (es. "D.Lgs. 81/2008, art. 17")
- **Indica l'ammontare della sanzione** se lo conosci con certezza
- **Se non sei sicuro, dillo**: "Per il reato X, l'ammontare esatto della sanzione dipende dalla gravità; serve verifica specifica"

---

## Lingua

- **Codice**: inglese (nomi variabili, funzioni, file)
- **Commenti nel codice**: italiano o inglese, a discrezione
- **Documentazione utente**: italiano (l'utente non capisce l'inglese tecnico)
- **Messaggi all'utente**: italiano, semplice, diretto

---

*Documento creato da: OpenCode AI*
*Data: 2026-04-23*
