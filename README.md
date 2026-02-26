# FedShield

Piattaforma anti-sanzione per FacileSicurezza / FEDINVEST.

## Stato attuale

Questa implementazione include:
- Monorepo `pnpm` con backend, app desktop (Electron + React), app tablet (Expo).
- Backend Fastify + Prisma + SQLite con autenticazione JWT a ruoli (`junior`, `senior`, `admin`).
- Moduli API: health, auth, aziende, checklist, sopralluoghi, non conformita, validazione senior, report JSON.
- Moduli API Sprint 3: preventivi, countdown automatico, malleva, generazione PDF verbale/attestato.
- Moduli API Sprint 4: KPI aziende/consulenti, modulo ODV con confronto automatico sanzioni vs NC pregresse.
- Moduli API Sprint 5: licensing device, heartbeat, sync offline-first push/pull/ack.
- Seed dati demo e database locale pronto.
- Dashboard desktop con login, dati live e compilazione checklist.
- Dashboard desktop con area Preventivi e azioni di output documentale.
- Dashboard desktop con area KPI e ODV.
- Dashboard desktop con stato licenza device, coda sync offline e sync manuale.
- App tablet con login e lista aziende.
- Test backend automatico sul flusso checklist -> NC.

## Struttura

- `apps/backend`: API e logica server
- `apps/desktop`: software Windows (Electron)
- `apps/tablet`: client Android tablet (Expo)
- `packages/shared-types`: tipi condivisi

## Avvio rapido

1. Installa dipendenze:
   - `pnpm install`
2. Configura backend:
   - `Copy-Item apps/backend/.env.example apps/backend/.env`
3. Genera client DB e crea schema:
   - `pnpm --filter @fedshield/backend db:generate`
   - `pnpm --filter @fedshield/backend db:push`
   - `pnpm --filter @fedshield/backend db:seed`
4. Avvia backend:
   - `pnpm --filter @fedshield/backend dev`
5. Avvia desktop (nuovo terminale):
   - `pnpm --filter @fedshield/desktop dev`
6. Avvia tablet (nuovo terminale):
   - `pnpm --filter @fedshield/tablet start`

## Credenziali demo

- Admin: `admin@fedshield.local` / `fedshield123`
- Senior: `senior@fedshield.local` / `fedshield123`
- Junior: `junior@fedshield.local` / `fedshield123`

## Endpoint API implementati

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/companies`
- `POST /api/companies`
- `GET /api/inspections`
- `POST /api/inspections`
- `POST /api/inspections/nc`
- `POST /api/inspections/:id/answers`
- `GET /api/inspections/:id/report`
- `POST /api/inspections/:id/report/pdf`
- `POST /api/inspections/:id/attestato/pdf`
- `GET /api/inspections/:id/documents`
- `POST /api/inspections/validate`
- `GET /api/checklists/templates`
- `GET /api/checklists/templates/:id/items`
- `GET /api/quotes`
- `GET /api/quotes/candidates`
- `POST /api/quotes`
- `PATCH /api/quotes/:id/respond`
- `POST /api/quotes/:id/malleva`
- `POST /api/quotes/process-expired`
- `GET /api/kpi/overview`
- `GET /api/kpi/companies/:id`
- `GET /api/kpi/consultants`
- `POST /api/kpi/snapshots`
- `GET /api/odv/inspections`
- `POST /api/odv/inspections`
- `GET /api/odv/inspections/:id/analysis`
- `GET /api/odv/defensive-report/:companyId`
- `POST /api/licensing/activate`
- `POST /api/licensing/validate`
- `POST /api/licensing/heartbeat`
- `POST /api/licensing/revoke`
- `GET /api/licensing/devices`
- `POST /api/sync/push`
- `POST /api/sync/pull`
- `POST /api/sync/ack`

## Note importanti

- Regola implementata: un utente `junior` non puo validare sopralluoghi.
- Un sopralluogo `validated` non puo ricevere nuove NC (immutabilita base).
- Regola implementata: risposta checklist `NO` crea/aggiorna NC automaticamente.
- Regola implementata: risposta checklist `SI/NA` rimuove la NC collegata.
- Regola implementata: se preventivo e `rejected`, `expired` o `assigned_to_third_party` viene emessa malleva.
- Scheduler backend attivo per controllo countdown preventivi (`QUOTE_SWEEP_SECONDS`).
- KPI consulenti con alert statistico NC su finestra temporale configurabile.
- ODV: matching automatico sanzioni con NC pregresse (matched/partial/unmatched).
- PDF documenti con sigillo hash interno (`sealHash`) anti-manomissione.
- Licensing per device con `expiresAt` + `graceUntil` + revoca amministrativa.
- Sync offline-first: eventi salvati in coda locale client e flush periodico/manuel.
- Alcune build (Vite/Prisma) in ambiente sandbox possono richiedere permessi elevati.

## Variabili ambiente backend (nuove)

- `LICENSE_ACTIVATION_CODE`: codice attivazione device
- `LICENSE_DURATION_DAYS`: durata licenza in giorni
- `LICENSE_GRACE_DAYS`: giorni grace oltre scadenza
- `DOCUMENT_SEAL_SECRET`: secret sigillo hash documenti
- `QUOTE_SWEEP_SECONDS`: frequenza controllo countdown preventivi

## Test rapido

- `pnpm --filter @fedshield/backend test`

## Prossimi step (Sprint 6)

- Firma qualificata remota (provider esterno) sui PDF e invio notifiche automatiche cliente.
- Workflow completo ODV con upload PDF verbale ispettivo e parser assistito.
- Sync avanzata bidirezionale con conflitti per-entita e priorita business rules.
