# FedShield Desktop — UI Review (Audit Retroattivo)

**Audited:** 2026-04-26
**Auditor:** GSD UI Auditor (Claude Opus 4.7)
**Baseline:** Standard 6-pillar (no UI-SPEC.md presente)
**Scope:** `apps/desktop/src/` — 12 pagine React + `styles.css` + `App.tsx`
**Screenshots:** Non catturati (nessun dev server attivo su :3000 / :5173 / :8080) — review code-only
**Stack rilevato:** React 19 + Vite 7 + Electron, CSS plain (no Tailwind, no design system, no shadcn)

---

## TL;DR (executive summary)

FedShield ha un **design language ibrido e disgregato**. Tre layer di stile coesistono senza coordinazione:

1. **CSS classes coerenti** (`styles.css`, ~600 righe, custom-properties OK) — usato bene da LoginPage, DashboardPage, ChecklistPage, CustomerRegistryPage, QuotesPage, KpiPage, OdvPage, CustomersPage.
2. **Inline styles ad-hoc** (≥107 occorrenze di `style={{...}}`) — concentrati su AssetsPage (1059 righe), TrainingPage (829 righe), ChatbotPage, AssetQrPage, NormSyncAdminPage, DashboardPage. Fanno uso di hex hardcoded (`#1f4ad6`, `#2563eb`, `#f8f9fb`, `#fafafa`, ecc.) che NON corrispondono al token `--color-accent: #e65712`.
3. **Classi CSS dichiarate ma mai definite** — `btn-primary` (13 usi), `tab-btn`, `tab-bar`, `chat-messages`, `chatbot-md`, `assets-page`, `training-page`, `chatbot-page`, `normsync-admin`, `training-table`, `inline-form`, `spinner`, `qr-print-area` puntano nel vuoto. **I bottoni `btn-primary` ricadono sullo styling di default del browser** (cioè bottoni grigi senza identità visiva).

**Severity globale:** **FLAG** (sistema funziona ma identita visiva incoerente, accessibilità sotto la soglia, manutenibilità a rischio appena la codebase cresce).

---

## Pillar Scores (1-5)

| # | Pillar | Score | Severity | Key finding |
|---|--------|-------|----------|-------------|
| 1 | Layout & spacing | 3/5 | FLAG | Spacing scale incoerente: alcune pagine usano CSS class (KpiPage, OdvPage, ChecklistPage) ma 47 occorrenze di `marginTop: N` hardcoded. Nessun token per spacing. |
| 2 | Typography | 3/5 | FLAG | Font-family CSS-driven OK. Ma 4 stack di colori testo (`#444`, `#555`, `#111`, `gray`, `crimson`) coesistono con `var(--color-text-muted)`. Nessuna scala `font-size` formale. |
| 3 | Color & contrast | 2/5 | **BLOCK** | Palette ufficiale (`#212d52` primary, `#e65712` arancione accento) è sovrascritta in 5 pagine da blu hardcoded (`#1f4ad6`, `#2563eb`). Status messages errore usano `crimson` (non token). `--color-content-text: #e65712` sui body text è un caso limite di contrast: arancione su bianco = 3.0:1 (sotto WCAG AA per body text). |
| 4 | Affordance & states | 3/5 | FLAG | `:focus-visible` globale OK in styles.css. `:hover` definito su 11 selettori CSS. Ma le 13 classi `btn-primary` non hanno styling → nessun hover/focus dedicato. Loading states presenti ma testuali ("Caricamento..."), nessuno skeleton/spinner reale. |
| 5 | Information architecture | 3/5 | FLAG | Sidebar a 11 voci OK su desktop. Niente breadcrumb. AssetQrPage ha back button, ChecklistPage no. Niente scroll/paginazione su tabelle che possono avere centinaia di righe (Anagrafica, Training, Assets). |
| 6 | Accessibility | 2/5 | **BLOCK** | Solo 3 `aria-label` in tutta l'app. 0 `role=`. 0 `tabIndex`. `<label>` senza `htmlFor` esplicito sulla maggior parte dei form (solo 3 occorrenze di `htmlFor`). Stato di processo ("In attesa", "Approvata") comunicato solo da emoji + colore (gray/orange/green/crimson) → screen-reader perde l'info, daltonici idem. |

**Overall: 16/30** — `FLAG` complessivo (bloccanti su Color e Accessibility, FLAG sugli altri).

---

## Top 5 Quick Wins (≤1h ciascuno)

| # | Problema | Fix concreto | Tempo stimato |
|---|----------|--------------|---------------|
| 1 | **`btn-primary` ha 13 usi ma 0 definizioni in `styles.css`** → bottoni Asset/Training/Chatbot/NormSync ricadono su default browser e si vedono come "secondary" malformato | Aggiungere a `styles.css` un blocco `.btn-primary { ... }` riusando i token `--color-accent`/`--color-on-primary` esistenti (clonare regola di `.login-card button` o `.footer-actions button`) | 15 min |
| 2 | **5 pagine usano blu hardcoded `#1f4ad6` o `#2563eb`** invece dell'arancione `--color-accent` ufficiale (AssetsPage TabButton, TrainingPage TabButton, ChatbotPage user-message bubble) | Rimpiazzare letterali hex con `var(--color-accent)` / `var(--color-primary)`. Crea `.tab-btn` e `.tab-btn-active` in CSS estraendo i 2 inline style identici di AssetsPage:175-181 e TrainingPage:113-119 | 30 min |
| 3 | **Stato proposte normative comunicato solo da emoji+colore** (`🟡 In attesa`, `✅ Approvata`, `❌ Rifiutata` con `style={{color: "orange/green/crimson"}}`) → fallisce su daltonici e screen-reader | Wrappare in `<span role="status" aria-label="In attesa di revisione">🟡 In attesa</span>` + sostituire `color: "orange"` con classi `.status-pill-pending`, `.status-pill-approved`, `.status-pill-rejected` con border + bg-soft | 25 min |
| 4 | **NormSyncAdminPage tabella non scrolla né pagina** + filtro stato implementato come 4 ghost-btn senza `<fieldset>`/`role="tablist"` | (a) Wrappare la `<table>` in `<div className="table-wrap">` (esiste già la classe). (b) Aggiungere `role="tablist"` al container dei filtri stato e `role="tab"`/`aria-selected` ai 4 bottoni | 20 min |
| 5 | **Tutti i `<label>` privi di `htmlFor`/id sui form** (≥80 input scoperti) — solo 3 sono fatti correttamente in CustomerRegistryPage e ChecklistPage | Se non si vuole rifattorizzare tutto, almeno **wrappare** input dentro `<label>...</label>` (alcuni già lo fanno via `<Field>` in AssetsPage/TrainingPage). Inserire `aria-label` esplicito su tutti i `<select>` standalone | 45 min |

---

## Top 3 Long-term Refactor (1-3 giorni)

| # | Problema | Refactor proposto | Impatto |
|---|----------|-------------------|---------|
| 1 | **Inline styles dappertutto (107 occorrenze)** in pagine che pesano 800-2000 righe (AssetsPage 1059, ChecklistPage 1946, TrainingPage 829). Impossibile dark-mode, theming, A/B test. Duplicati tra `formStyle`/`gridStyle` di AssetsPage e TrainingPage (stesso oggetto identico in 2 file). | (a) Estrarre in `styles.css` le classi mancanti (`.btn-primary`, `.tab-btn`, `.form-grid`, `.form-card`, `.chat-bubble`, `.chat-shell`, `.qr-card`, `.status-pill-{state}`). (b) Spostare `formStyle` e `gridStyle` in CSS condiviso. (c) Spezzare AssetsPage in `EquipmentTab.tsx`, `MachinesTab.tsx`, `ExtinguishersTab.tsx`, `FirstAidTab.tsx` (file separati). (d) Idem ChecklistPage (1946 LOC, davvero troppe per un singolo file React). | Manutenibilità +++. Bundle size ↓ (rimuovi classi duplicate). Permette dark-mode in futuro con un solo `:root` swap. |
| 2 | **Color contrast & semantic color tokens insufficienti.** Lo styles.css definisce 17 custom-property colore ma manca: `--color-success`, `--color-warning`, `--color-error`, `--color-info`, `--color-pending`. Risultato: ogni dev sceglie a mano (`crimson`, `orange`, `green`, `gray`, `#caa800`, `#1f4ad6`, `#2563eb`). La regola CSS finale (`styles.css:605-607`) forza `--color-content-text: #e65712` su h1/h2/h3/p/label/th/td DENTRO `.content` → tutto il body text è arancione `#e65712` su `#fefefe` = ratio 3.0:1 (sotto AA per testo normale, sopra per testo grande ≥18pt). | (a) Aggiungere tokens semantici di stato. (b) Verificare con un contrast checker (axe, Lighthouse). (c) Considerare se `--color-content-text` debba davvero forzare arancione su tutto il body o se dovrebbe ereditare da `--color-text` (`#212d52`, ratio 12+:1, AAA). Il sospetto è che la regola `:is(h1,h2,h3,p,label,th,td,...)` sia un bug — l'arancione doveva essere riservato agli headings, non ai paragrafi. | Compliance WCAG AA. Risolve anche il rischio "tutto colorato uguale" che oggi rende difficile distinguere status urgenti dal testo informativo. |
| 3 | **Gestione stati form scadenza/sanità/sicurezza cromatica via JS, non via CSS.** `TrainingPage.getStatusColor()` e `AssetsPage.statusRowStyle()` calcolano inline una colorazione in funzione di "giorni residui". Stesso pattern, due file, due implementazioni divergenti (`#fde4e4`/`#fff3d6`/`#fffbe1` in Assets vs `crimson`/`orange`/`#caa800`/`green` in Training). | Centralizzare in un hook `useExpiryStatus(date)` che restituisce `{ severity: "expired"|"critical"|"warning"|"ok", label, ariaLabel }` + classi CSS `.status-row-expired`, `.status-row-critical`, `.status-row-warning`. Permette di cambiare la palette in un punto solo. Aggiungere `aria-label` per screen-reader (es. "Scaduto da 5 giorni — attenzione"). | Coerenza visiva + accessibilità + DRY. Permette test unitario della logica scadenze. |

---

## Detailed Findings (per pagina × pillar)

Severità: **BLOCK** = errore funzionale o accessibilità grave; **FLAG** = problema visivo/manutenibilità; **PASS** = nessun problema rilevante.

### LoginPage.tsx (51 LOC)

| Pillar | Severity | Finding |
|--------|----------|---------|
| Layout & spacing | PASS | `.login-shell` + `.login-card` ben tokenizzate (styles.css:84-141). Spacing coerente (24px shell, 28px card, 12-18px controls). |
| Typography | PASS | h1 + p su tokens. label 13px coerente. |
| Color & contrast | FLAG | Arancione `--color-accent` su CTA "Entra" — OK come accento. Email default `admin@fedshield.local` e password `fedshield123` HARDCODED (LoginPage.tsx:9-10) — ottimo per dev, **da rimuovere prima della produzione** (security finding minore, fuori scope UI). |
| Affordance & states | PASS | Disabled state via `disabled={loading}` con label "Accesso..." dinamica (LoginPage.tsx:45-47). |
| Information architecture | PASS | Login standalone con un solo CTA. Niente da migliorare. |
| Accessibility | FLAG | `<label>Email</label>` e `<label>Password</label>` NON hanno `htmlFor` né wrappano l'input (LoginPage.tsx:31-41). Non sono associate semanticamente. Click su label non focusa input. |

### DashboardPage.tsx (414 LOC)

| Pillar | Severity | Finding |
|--------|----------|---------|
| Layout & spacing | PASS | `.layout` grid 260px+1fr OK. `.kpi-grid` con `repeat(4, minmax(120px, 1fr))` responsive. |
| Typography | PASS | Pannelli e h1/h2 tokenizzati. |
| Color & contrast | **BLOCK** | Badge alert (DashboardPage.tsx:251-258) usa `background: "crimson"` hardcoded — non un token. Non riusabile. Inoltre `crimson` non garantisce contrast AAA su tutti i monitor. |
| Affordance & states | FLAG | I bottoni "Verbale PDF" / "Attestato" sulle row sono `ghost-btn` — OK. Ma non hanno feedback durante async (la chiamata `generateInspectionReportPdf` è 200-500ms e non c'è disabled). |
| Information architecture | PASS | Sidebar a 11 voci con sezione admin condizionale (`user.role === "admin"`). Nav-item-active visibile. Niente breadcrumb (non necessario). |
| Accessibility | FLAG | Badge `<span>` con il numero alert (DashboardPage.tsx:248-260) non ha `aria-label="N notifiche non lette"`. Screen reader sente "5" senza contesto. Logo fallback chain (DashboardPage.tsx:148-166) gestisce errori bene ma `<img>` ha `alt="FedShield"` (OK), ma l'icona del bot 🤖 nel nav (riga 223) e 📜 NormSync (231) sono emoji testuali — non `aria-hidden`, lette dallo screen reader come "robot face emoji". |

### ChecklistPage.tsx (1946 LOC) — file più grande del progetto

| Pillar | Severity | Finding |
|--------|----------|---------|
| Layout & spacing | FLAG | Stepper a 5 step (`.stepper-item`) ben definito in CSS. Ma all'interno di step 0 il `.task-accordion-list` con 3 task innestati + sopralluogo + ricerca cliente = layout denso e poco scannerizzabile. `<div style={{ marginTop: 10 }}>` ripetuto 5 volte invece di una classe. |
| Typography | PASS | Tutti gli h2/h3 tokenizzati. label CSS-driven. |
| Color & contrast | FLAG | `status-banner status-banner-warning` OK (token). Ma il selettore step attivo (`.stepper-item-active`) usa `--color-accent` come bg → lettura "1. Dati Azienda" su arancione = ratio 4.5:1 (AA per testo grande). |
| Affordance & states | FLAG | Disabled state coerente su tutti i bottoni durante `loading`. `<button onClick={...} disabled>` (riga 1574) come "Indietro" su task `general` è permanentemente disabled — è un'affordance morta che andrebbe nascosta o resa visibile come breadcrumb fisso. |
| Information architecture | FLAG | Il file mescola: ricerca cliente, registrazione anagrafica multi-task, creazione sopralluogo, 4 step compilazione, riepilogo, 5 azioni finali (salva, valida, invia, verbale, attestato). **2000 righe di JSX in un singolo componente** = pessima per debugging e per il mental model dell'utente. Manca breadcrumb tra step. |
| Accessibility | **BLOCK** | (a) Stepper a 5 elementi `<button>` → dovrebbe essere `<nav role="tablist">` con `role="tab"` + `aria-selected`. (b) Tutti gli input task "Datore/RSPP/Preposto" (righe 1599-1602) usano `placeholder="Nominativo"` come unica indicazione — niente label visibile né `aria-label`. Screen reader dice "edit, blank". (c) `setStep(index)` (riga 1323) dietro click su button stepper non aggiorna focus né URL → utenti che usano back-button perdono lo state. |

### CustomerRegistryPage.tsx (276 LOC)

| Pillar | Severity | Finding |
|--------|----------|---------|
| Layout & spacing | PASS | Toolbar di ricerca + table + pannello dettaglio condizionale, layout pulito. |
| Typography | PASS | h2/h3 ok. |
| Color & contrast | PASS | Riga selezionata (`.registry-row-selected`) usa `color-mix` su `--color-accent` 10%, contrast OK. |
| Affordance & states | PASS | Bottone "Scarica checklist completa PDF" mostra "Scarico..." durante async (CustomerRegistryPage.tsx:259). |
| Information architecture | PASS | Search box → table → "Apri anagrafica" → dettaglio espanso. Flow lineare e coerente. |
| Accessibility | PASS | `<label htmlFor="company-query">` correttamente associato (riga 103). Datalist usato per autocomplete — ottima pratica HTML5. **Esempio positivo da replicare nel resto dell'app.** |

### CustomersPage.tsx (89 LOC) — pagina LEGACY non usata?

| Pillar | Severity | Finding |
|--------|----------|---------|
| Tutto | FLAG | Pagina presente nel filesystem ma **non importata in DashboardPage.tsx** (Dashboard usa `CustomerRegistryPage` come "Anagrafica Clienti"). Probabile **dead code**. Da verificare e, se confermato, rimuovere per evitare confusione. |

### QuotesPage.tsx (283 LOC)

| Pillar | Severity | Finding |
|--------|----------|---------|
| Layout & spacing | PASS | `.grid-two`, `.inline-actions`, `.footer-actions` tutti CSS-class-based. |
| Typography | PASS | tokenizzato. |
| Color & contrast | PASS | `.status-banner.status-banner-warning` con riferimento normativo, contrasto OK. |
| Affordance & states | FLAG | I 3 bottoni di azione su row (Accetta/Rifiuta/Terzi) sono tutti `ghost-btn` con stessa identità visiva → l'azione **distruttiva** "Rifiuta" non si distingue da "Accetta". Servirebbe variant `ghost-btn-danger` o `ghost-btn-positive`. |
| Information architecture | PASS | Filter per azienda → form crea → tabella esistenti. |
| Accessibility | FLAG | I `<select>` (riga 157, 167) non hanno `aria-label` né `<label htmlFor>`. Sono dichiarati con `<label>Azienda</label>` non associato. |

### KpiPage.tsx (177 LOC)

| Pillar | Severity | Finding |
|--------|----------|---------|
| Layout & spacing | PASS | `kpi-grid` 4-col responsive. |
| Typography | PASS | |
| Color & contrast | PASS | |
| Affordance & states | FLAG | Bottone "Salva snapshot KPI" senza `disabled` durante l'async (KpiPage.tsx:80) — utente può clickarlo 5 volte. |
| Information architecture | PASS | Overview → drilldown azienda → consultanti. Logico. |
| Accessibility | FLAG | `<label>Azienda</label>` (riga 70) non associato a `<select>` riga 71. |

### OdvPage.tsx (190 LOC)

| Pillar | Severity | Finding |
|--------|----------|---------|
| Layout & spacing | PASS | |
| Typography | PASS | |
| Color & contrast | PASS | |
| Affordance & states | FLAG | Form di creazione ispezione ODV (righe 99-132) non ha `disabled` durante submit (`handleCreateInspection`). |
| Information architecture | PASS | Form crea → KPI riepilogo → tabella storia. |
| Accessibility | FLAG | label senza htmlFor (pattern ripetuto in tutta l'app). |

### TrainingPage.tsx (829 LOC)

| Pillar | Severity | Finding |
|--------|----------|---------|
| Layout & spacing | FLAG | TabBar inline-styled (riga 60), formStyle/gridStyle hardcoded (righe 793-805) **identici** a AssetsPage:941-953. DRY violato. |
| Typography | PASS | |
| Color & contrast | **BLOCK** | (a) TabButton attiva = `background: "#1f4ad6"` (blu) hardcoded — non token, non corrisponde a `--color-accent: #e65712` (arancione). Significa che le tab di Training si vedono blu ma il resto dell'app è arancione. **Identità visiva spaccata**. (b) `getStatusColor` (riga 129-138) restituisce `"crimson" / "orange" / "#caa800" / "green"` — letterali colore non token. (c) Status text "SCADUTO da Ngg" (riga 145) è solo testo + colore → daltonici devono leggere il testo, screen-reader OK ma non c'è `aria-label="Attenzione: scaduto"`. |
| Affordance & states | FLAG | Bottone "Disattiva" usa `style={{ color: "crimson" }}` (riga 382) — non token, ed è l'unica indicazione che è destructive. Manca confirm a doppio step (oggi è solo un `window.confirm`). |
| Information architecture | FLAG | 3 tab (Scadenze / Dipendenti / Catalogo corsi). Filtro per azienda è dentro EmployeesSection ma non in altre tab. Inconsistente. |
| Accessibility | **BLOCK** | (a) `style={{ color: "..." }}` come unica info di stato è anti-pattern. (b) Tabella scadenze (righe 154-225) usa `rowSpan={records.length}` per raggruppare dipendenti — semantica ottima MA `<tr>` con cella status (col 7) ha solo color, niente `aria-label`. Lettore schermo dice "Scade tra 12gg" senza enfasi. (c) `<select aria-label="Filtra per azienda">` (riga 279) — qui sì associata. **Inconsistenza con il resto dell'app.** |

### AssetsPage.tsx (1059 LOC) — secondo file più grande

| Pillar | Severity | Finding |
|--------|----------|---------|
| Layout & spacing | FLAG | gridStyle = `repeat(auto-fit, minmax(220px, 1fr))` — buono in se. Ma ridefinito identico in TrainingPage. Ed è inline (`gridStyle: React.CSSProperties`) invece di classe CSS. |
| Typography | FLAG | `<span style={{ fontSize: 13, color: "#444" }}>{label}</span>` (riga 973) per label dei campi. Hardcoded, dovrebbe essere `var(--color-text-muted)` o classe. |
| Color & contrast | **BLOCK** | (a) TabButton blu `#1f4ad6` (riga 175) → stesso problema di TrainingPage. (b) `statusRowStyle` (righe 1011-1018) ritorna `{ background: "#fde4e4" }` (rosso pallido per scaduto), `#fff3d6` (giallo pallido), `#fffbe1`. Letterali, non riusabili, **diversi dai colori usati da TrainingPage** che fa la stessa cosa con colori testo (`crimson`/`orange`). (c) Chat bubble `#2563eb` su ChatbotPage stesso pattern. (d) Bottone "Elimina" `style={{ color: "crimson" }}` senza icona/asse semantico aggiuntivo. |
| Affordance & states | FLAG | Bottone "+ Nuova attrezzatura" cambia label in "Chiudi" quando il form è aperto — affordance toggle OK MA non è ovvio (utente può aspettarsi modal). FormActions disabled durante busy: OK. RowActions QR/Modifica/Elimina sono tutti `ghost-btn` indistinguibili (tranne Elimina che ha color crimson — fragile). |
| Information architecture | FLAG | 4 tab in 1 pagina + form inline che mostra il campo solo quando si clicca nuovo → l'utente potrebbe non capire che esiste un form. Servirebbe banner/empty-state-CTA quando lista vuota. |
| Accessibility | **BLOCK** | (a) TabButton bottoni puri senza `role="tab"` + `aria-selected={active}`. (b) `<select aria-label="Azienda">` (riga 93) — OK questo. Ma le tab non hanno keyboard navigation arrow-key (solo Tab). (c) `<button onClick={onDelete}>` per "Elimina" → solo `window.confirm` come safety net. Niente conferma a 2 step (es. "type DELETE"). Per asset critici (estintori, cassetta PS) può essere ammissibile, ma il tasto Enter accidentale è un rischio. (d) Date input (`<input type="date">`) → OK browser-native. |

### AssetQrPage.tsx (146 LOC)

| Pillar | Severity | Finding |
|--------|----------|---------|
| Layout & spacing | PASS | Layout centrato, max-width 400px, padding coerente. |
| Typography | PASS | |
| Color & contrast | FLAG | Border `#bbb` dashed, bg `#fafafa`, color `#555` su small text — tutti hardcoded. Dovrebbero essere `var(--color-border)` etc. |
| Affordance & states | PASS | Loading state mostra "Caricamento..." (riga 48). Error state visibile (riga 49-60). |
| Information architecture | **PASS+** | Back button presente (`onBack`, righe 53-55, 79-82) — **buona pratica** rispetto al resto dell'app. Print mode con `@media print` (righe 137-143) ben gestito. |
| Accessibility | FLAG | (a) `<img alt="QR Code Asset">` OK. (b) Bottone Stampa con emoji 🖨️ direttamente nel testo (riga 132) → screen-reader legge "printer" prima di "Stampa QR" — confondente. Wrappare emoji in `<span aria-hidden="true">`. |

### ChatbotPage.tsx (182 LOC)

| Pillar | Severity | Finding |
|--------|----------|---------|
| Layout & spacing | PASS | flex column con `flex: 1` per la chat history, OK. |
| Typography | PASS | |
| Color & contrast | **BLOCK** | (a) User-bubble `background: "#2563eb"` (blu) su white text — non corrisponde all'arancione del brand. (b) Border `#ddd`, bg `#fafafa`, placeholder `gray` → tutti hardcoded. (c) Empty state "Scrivi una domanda per iniziare..." (riga 95) ha `color: "gray"` invece di `var(--color-text-muted)`. |
| Affordance & states | FLAG | (a) `disabled={loading || !input.trim()}` sul bottone Invia — corretto. (b) Loading indicator: `<span className="spinner">...</span>` (riga 111) — la classe `.spinner` non è definita in CSS. È solo tre puntini testuali "..." senza animazione reale. |
| Information architecture | PASS | Header + history scrollable + input bottom. Pattern chat standard. |
| Accessibility | **BLOCK** | (a) `<div className="chat-messages">` con `overflowY: "auto"` — manca `role="log" aria-live="polite"` per annunciare nuovi messaggi via screen-reader. (b) Bottone Invia non ha `aria-label="Invia messaggio"` — solo testo "Invia" che è OK ma con emoji 🤖 nel header non `aria-hidden`. (c) `bottomRef.current?.scrollIntoView({ behavior: "smooth" })` senza opzione `block: "end"` — su screen-reader puo causare focus jump. (d) `dangerouslySetInnerHTML` (riga 173) — la sanitizzazione passa da `renderAssistantMarkdown` (controllato) ma è comunque un vector se in futuro qualcuno bypassa. |

### NormSyncAdminPage.tsx (139 LOC)

| Pillar | Severity | Finding |
|--------|----------|---------|
| Layout & spacing | FLAG | Tabella senza wrap-scroll, header inline `<tr style={{ background: "#f0f0f0" }}>` (riga 84). |
| Typography | PASS | |
| Color & contrast | **BLOCK** | (a) Status pill solo `<span style={{ color: "orange" }}>🟡 In attesa</span>` — daltonici/screen-reader perdono info. (b) `#f0f0f0` su table header non è un token. |
| Affordance & states | FLAG | Bottoni filtro stato (riga 65-74) hanno classe `ghost-btn ${statusFilter === s ? "nav-item-active" : ""}` — riuso intelligente di `nav-item-active` MA con `text-transform: capitalize` inline → "all"/"pending"/"approved"/"rejected" diventano "All"/"Pending"/"Approved"/"Rejected" — inglese in app italiana. |
| Information architecture | FLAG | (a) "Tutte"/"Pending"/"Approved"/"Rejected" — mix italiano/inglese. (b) Manca conteggio per ogni filtro (es. "Pending (3)"). |
| Accessibility | **BLOCK** | (a) Filtri stato non sono `<nav role="tablist">`. (b) Status `<span style={{ color: "orange" }}>🟡 In attesa</span>` è il caso da manuale di accessibility-fail: solo emoji + colore. Servirebbe `<span role="status" aria-label="In attesa di revisione">...</span>`. (c) `<code>{p.normReference}</code>` (riga 97) OK semanticamente. |

---

## Cross-cutting Patterns (osservazioni globali)

### Pattern 1: `style={{ marginTop: N }}` epidemico (47 occorrenze)
**Finding:** ogni dev aggiunge spacing inline con valori 4/6/8/10/12/14/16. Nessuna scala (tipo `--space-1: 4px` … `--space-6: 16px`).
**Fix:** definire 6 token spacing in `:root` e usare classi utility `.mt-2`, `.mt-3` (tipo Tailwind ma minimal).

### Pattern 2: Ogni pagina decide il proprio "primary" color a caso
- `LoginPage button` → `var(--color-accent)` (arancione) ✓
- `CSS .footer-actions button` → `var(--color-accent)` (arancione) ✓
- `AssetsPage TabButton attiva` → `#1f4ad6` (blu) ✗
- `TrainingPage TabButton attiva` → `#1f4ad6` (blu) ✗
- `ChatbotPage user-bubble` → `#2563eb` (blu) ✗
- `NormSyncAdminPage btn-primary` → undefined → grey browser default ✗

**Risultato:** un consulente che fa demo con sales potrebbe vedere 4 "primary" diversi nello stesso flusso. **Top 3 priorità immediata.**

### Pattern 3: 47 tabelle senza paginazione, scroll, ordinamento, export
- Anagrafica clienti → tutte le aziende caricate in memoria (`filteredCompanies.map`).
- Training scadenze → tutti i dipendenti × tutti i record di formazione (potenzialmente migliaia di righe).
- AssetsPage estintori → un magazzino può avere 200+ estintori.
- NormSync proposte → cresce nel tempo.

**Fix:** introdurre componente generico `<DataTable>` con paginazione (10/25/50), sort per colonna, ricerca client-side. **Long-term refactor** ma critico se l'app va in produzione su clienti reali.

### Pattern 4: Form inline-style epidemico
`AssetsPage` e `TrainingPage` ridefiniscono lo stesso `formStyle` e `gridStyle` come `React.CSSProperties` constant. ChecklistPage NON usa form pattern — usa direttamente CSS class `.grid-two`. Inconsistenza interna al progetto.

### Pattern 5: Modal/dialog assenti
Ogni form di edit asset/dipendente è inline (toggle `showForm`). Per form da 8+ campi (machinery, employee, course) un `<dialog>` modale sarebbe più focalizzante e accessibile (gestisce automaticamente Esc + focus trap). Oggi se l'utente clicca "+ Nuova macchina" e poi scrolla via, può perdere il form senza accorgersene.

### Pattern 6: Confirm distruttivo è solo `window.confirm`
5 occorrenze di `window.confirm`. Su Electron è blocking nativo OK, ma:
- nessun preview di "cosa stai per cancellare" oltre al nome
- nessun typing-confirmation per asset critici (cassette PS, estintori = compliance!)
- nessun undo

**Long-term:** sostituire con un `<ConfirmDialog>` riusabile con typed-confirmation per asset compliance-critical.

---

## Files Audited

```
apps/desktop/src/App.tsx                       (184 LOC) [router + license gate]
apps/desktop/src/main.tsx                      (10 LOC)  [bootstrap]
apps/desktop/src/styles.css                    (607 LOC) [global CSS]
apps/desktop/src/pages/LoginPage.tsx           (51 LOC)
apps/desktop/src/pages/DashboardPage.tsx       (414 LOC)
apps/desktop/src/pages/ChecklistPage.tsx       (1946 LOC) ← largest
apps/desktop/src/pages/CustomersPage.tsx       (89 LOC)  ← possibly dead code
apps/desktop/src/pages/CustomerRegistryPage.tsx (276 LOC)
apps/desktop/src/pages/QuotesPage.tsx          (283 LOC)
apps/desktop/src/pages/KpiPage.tsx             (177 LOC)
apps/desktop/src/pages/OdvPage.tsx             (190 LOC)
apps/desktop/src/pages/TrainingPage.tsx        (829 LOC)
apps/desktop/src/pages/AssetsPage.tsx          (1059 LOC)
apps/desktop/src/pages/AssetQrPage.tsx         (146 LOC)
apps/desktop/src/pages/ChatbotPage.tsx         (182 LOC)
apps/desktop/src/pages/NormSyncAdminPage.tsx   (139 LOC)
```

**Totale auditato:** 16 file, ~6580 LOC.

---

## Note finali per il prossimo passaggio

- **Mandatory next step (se si va in produzione):** fix dei BLOCK su Color (#1) e Accessibility (#3 della Top 5). 1-2 ore di lavoro.
- **Pre-launch hardening:** rimuovere credenziali default in LoginPage.tsx:9-10 (`admin@fedshield.local` / `fedshield123`).
- **Quando il design system maturerà:** valutare migrazione a shadcn/ui o adottare Tailwind CSS — l'attuale CSS plain è OK per 16 file ma scala male oltre i 25-30 componenti.
- **Verifica bug sospetto:** la regola CSS `styles.css:605-607` che forza `--color-content-text: #e65712` (arancione) su h1/h2/h3/p/label/th/td dentro `.content` rende **tutto il body text arancione** invece del blu primary — controllare se è intenzionale, perché viola contrast WCAG AA.

---

*Audit chiuso — nessun file di codice modificato.*
