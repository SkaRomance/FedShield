# Promemoria Operativo: Revisione Sezioni Sopralluogo

Data creazione: 28/09/2026

## Obiettivo
Riorganizzare e adattare le 3 sezioni del wizard di sopralluogo in FedShield:
1. **Check dei Documenti** (`Step 1`)
2. **Locali e Attrezzature di base** (`Step 2`)
3. **Macchine ed Attrezzature / Asset** (`Step 4` + moduli asset)

---

## 1. Sezione Check Documenti (`Step1Documenti.tsx`)
### Stato attuale
- Mostra la tabella dei documenti previsti per il macrosettore/ATECO dell'azienda (DVR, Nomina RSPP, Nomina Medico Competente, Piano Emergenza, Certificato Prevenzione Incendi, Manuale HACCP, ecc.).
- Campi attuali:
  - *Documento* (nome)
  - *Obbligatorio* (Sì / No)
  - *Stato* (Visionato in sede, Richiesto in differita, Non disponibile, Non applicabile)
  - *Note*
### Possibili modifiche da definire con l'utente:
- Aggiunta data di scadenza / ultimo rinnovo del documento.
- Possibilità di caricare foto/file del documento direttamente in sede.
- Possibilità di aggiungere documenti personalizzati o liberi non presenti nel template standard.
- Flag per segnalazione immediata come Non Conformità (NC) con generazione prescrizione/preventivo.

---

## 2. Sezione Locali e Struttura (`Step2LocaliAttrezzature.tsx`)
### Stato attuale
- Tabella domande di verifica sui locali di lavoro (aerazione, illuminazione, uscite di sicurezza, pavimentazione, servizi igienici, spogliatoi, conformità impianti).
- Risposte attuali: Conforme (Sì), Non conforme (No), Non applicabile (N/A) + Gravità + Sanzionabile + Note.
- Possibilità di aggiungere controlli personalizzati per Area/Domanda.
### Possibili modifiche da definire con l'utente:
- Suddivisione per ambienti fisici specifici (es. Uffici, Magazzino, Cucina, Laboratorio, Area Vendita, Esterno).
- Campi per metrature, altezza utile, presenza conformità edilizia/agibilità.
- Inserimento rilievi fotografici dei locali direttamente dal tablet/PC.
- Checklist mirate con domande specifiche richieste dal team HSE di FedInvest.

---

## 3. Sezione Macchine ed Attrezzature (`Step4AssetAttrezzature.tsx`)
### Stato attuale
- Schede separate: Attrezzature generiche, Macchine, Estintori, Cassette di Primo Soccorso.
- Verifica matricola, marcatura CE, conformità all'Allegato V D.Lgs. 81/08.
### Possibili modifiche da definire con l'utente:
- Campi dettagliati: Costruttore, Modello, Anno fabbricazione, Numero Matricola/Telaio, Presenza libretto d'uso/manutenzione.
- Controllo verifiche periodiche di legge (es. ponti sollevatori, apparecchi di sollevamento, impianti a pressione - INAIL/ARPA).
- Registro controlli periodici e scadenze revisione.
- Associazione immediata a operatore abilitato / patentino (es. carrello elevatore, PLE).

---

## Domande di Allineamento per l'Utente
1. Come deve cambiare la check dei documenti? (es. servono date di emissione/scadenza, nuovi stati, caricamento allegati o nuovi documenti da elencare?)
2. Nei locali, preferisci una divisione per ambienti/reparti o una lista di controlli specifici diversa da quella attuale?
3. Sulle macchine e attrezzature, quali campi specifici vuoi inserire (matricola, anno, libretto, verifiche periodiche) e se c'è un modello/tracciato cartaceo o Excel già utilizzato dal tuo team da cui prendere spunto?
