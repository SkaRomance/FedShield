# FedShield PostgreSQL Migration Plan

## Obiettivo

Portare la memoria applicativa da SQLite su file VPS a PostgreSQL centrale, mantenendo:

- dati operativi esistenti;
- PDF/file generati in `STORAGE_DIR`;
- rollback rapido;
- downtime controllato.

## Stato attuale

- Prisma usa `provider = "sqlite"` in `apps/backend/prisma/schema.prisma`.
- `DATABASE_URL` default documentata: `file:./prisma/dev.db`.
- File generati salvati sotto `STORAGE_DIR`, default `storage`.
- Le API backend sono montate sotto `/api`.
- Frontend salva solo dati locali leggeri:
  - sessione;
  - tema;
  - coda sync;
  - cursore sync;
  - preferenze attività/retail locali.

## Dove finiscono oggi i dati

| Area | Persistenza attuale | Nota operativa |
| --- | --- | --- |
| Clienti | `Company` via Prisma | Oggi su SQLite; target PostgreSQL. |
| Sopralluoghi/checklist | `Inspection`, `InspectionAnswer`, `InspectionDocument`, `NonConformity` | Da migrare in blocco con relazioni integre. |
| Preventivi/malleva | `Quote`, `Malleva`, `GeneratedDocument` | I metadati stanno nel DB, i PDF stanno su file system. |
| PDF e documenti generati | `STORAGE_DIR/documents/YYYY-MM/*.pdf` | Backup obbligatorio insieme al DB. |
| Licenze/sync | `DeviceLicense`, `SyncEvent` | Lo stato locale del device resta nel browser finche' non viene spinto al backend. |
| KPI/ODV/formazione/asset | Tabelle Prisma dedicate | Nessun file binario salvo path allegati ODV. |

## Gap localStorage da eliminare

Questi dati non devono restare solo nel browser, perche' cambiano il comportamento operativo:

- `fedshield.companyActivities.{companyId}`: attivita' aziendali scelte manualmente;
- `fedshield.retailScopes.{companyId}`: reparti retail/supermercato che filtrano checklist e documenti;
- `fedshield_sync_queue`: eventi non ancora inviati al backend;
- `fedshield_sync_cursor`: cursore delta sync.

Intervento applicativo consigliato:

1. aggiungere campi server-side per attivita' e retail scope su `Company` o su profilo operativo azienda;
2. salvare le modifiche tramite API `/api/companies/:id`;
3. usare `localStorage` solo come cache temporanea;
4. mostrare stato "non sincronizzato" se la coda locale contiene eventi non ancora accettati dal server.

## Target

- PostgreSQL su VPS, container o servizio gestito.
- `DATABASE_URL=postgresql://fedshield:<password>@<host>:5432/fedshield?schema=public`
- Backup giornaliero DB.
- Backup incrementale o snapshot di `STORAGE_DIR`.
- SQLite mantenuto come backup di rollback.

## Checkpoint repo

Gia' predisposto:

- `apps/backend/.env.example`: variabili runtime produzione;
- `infra/fedshield-postgres/compose.yaml`: PostgreSQL 16 legato a `127.0.0.1`;
- `infra/fedshield-postgres/backup.sh`: backup DB + `STORAGE_DIR`;
- `infra/fedshield-postgres/README.md`: uso VPS e cron;
- script Prisma `db:migrate:*` in `apps/backend/package.json`;
- campi `Company.activityTypesJson` e `Company.retailScopesJson` per togliere scelte operative da solo `localStorage`.

Non ancora eseguito:

- cambio provider Prisma da `sqlite` a `postgresql`;
- migrazione dati reali VPS;
- deploy backend con `DATABASE_URL` PostgreSQL.

Motivo: serve prima backup verificato del DB SQLite e dello `STORAGE_DIR` reali sulla VPS.

## Fase 0 - Freeze

1. Annunciare finestra manutenzione.
2. Bloccare nuove scritture:
   - fermare backend FedShield; oppure
   - mettere Nginx in maintenance per `/fedshield/api` se esposto via proxy.
3. Verificare nessun processo backend scrive sul DB.

## Fase 1 - Inventario VPS

Raccogliere:

- path repo/backend, visto in precedenza come `/opt/fedshield-src`;
- processo backend attivo;
- env runtime:
  - `DATABASE_URL`;
  - `STORAGE_DIR`;
  - `JWT_SECRET`;
  - `DOCUMENT_SEAL_SECRET`;
- path DB SQLite reale;
- path storage reale;
- versione Node/pnpm/Prisma.

Output atteso:

```text
backend_dir=
sqlite_db=
storage_dir=
service_manager=pm2|systemd|docker|manual
```

## Fase 2 - Backup

Backup obbligatori prima di ogni modifica:

```bash
mkdir -p /opt/fedshield-backups/YYYYMMDD-HHMMSS
cp -a <sqlite_db> /opt/fedshield-backups/YYYYMMDD-HHMMSS/
cp -a <storage_dir> /opt/fedshield-backups/YYYYMMDD-HHMMSS/storage
tar -czf /opt/fedshield-backups/YYYYMMDD-HHMMSS/fedshield-src.tgz /opt/fedshield-src
```

Verifica:

```bash
ls -lh /opt/fedshield-backups/YYYYMMDD-HHMMSS
sqlite3 <backup-db> "PRAGMA integrity_check;"
```

## Fase 3 - PostgreSQL

Provisioning consigliato VPS Docker:

```yaml
services:
  fedshield-postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: fedshield
      POSTGRES_USER: fedshield
      POSTGRES_PASSWORD: <strong-password>
    volumes:
      - fedshield-postgres-data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"

volumes:
  fedshield-postgres-data:
```

Regole:

- non esporre PostgreSQL pubblicamente;
- bind solo `127.0.0.1`;
- password forte;
- backup `pg_dump`.

## Fase 4 - Schema PostgreSQL

Prisma provider target:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Creare schema nel DB target:

```bash
DATABASE_URL="postgresql://..." pnpm --filter @fedshield/backend db:generate
DATABASE_URL="postgresql://..." pnpm --filter @fedshield/backend db:migrate:deploy
```

Nota: `db:push` resta accettabile solo su DB PostgreSQL vuoto e non produttivo.

## Fase 5 - Migrazione dati

Percorso raccomandato:

1. Generare client SQLite dal provider attuale.
2. Generare client PostgreSQL da schema temporaneo Postgres.
3. Script Node TypeScript migra in ordine FK:
   - `User`
   - `Company`
   - template checklist/documenti/formazione
   - `Inspection`
   - `InspectionDocument`
   - `InspectionAnswer`
   - `NonConformity`
   - `Quote`
   - `GeneratedDocument`
   - `Malleva`
   - licenze/sync/audit/KPI/ODV/asset/formazione/normsync
4. Preservare `id`, `createdAt`, `updatedAt`.
5. Validare conteggi tabella per tabella.

Fallback semplice se dati reali sono pochi:

- export JSON da SQLite;
- import JSON in PostgreSQL via Prisma;
- validazione conteggi.

## Fase 6 - Switch backend

1. Aggiornare env backend:

```bash
DATABASE_URL="postgresql://fedshield:<password>@127.0.0.1:5432/fedshield?schema=public"
```

2. Rigenerare Prisma client.
3. Avviare backend.
4. Smoke test API:

```bash
curl -f http://127.0.0.1:4000/api/health
```

5. Smoke test funzionali:

- login admin;
- lista clienti;
- crea cliente test;
- crea sopralluogo test;
- salva checklist;
- genera PDF;
- verifica download PDF.

## Fase 7 - Backup automatici

Cron minimo:

```bash
pg_dump "$DATABASE_URL" | gzip > /opt/fedshield-backups/postgres/fedshield-$(date +%F-%H%M).sql.gz
tar -czf /opt/fedshield-backups/storage/storage-$(date +%F-%H%M).tgz <storage_dir>
```

Retention:

- giornalieri: 14 giorni;
- settimanali: 8 settimane;
- mensili: 12 mesi.

Restore test mensile obbligatorio.

## Rollback

Se fallisce prima dello switch:

- lasciare backend SQLite;
- eliminare DB PostgreSQL target;
- nessun dato perso.

Se fallisce dopo switch:

1. Fermare backend.
2. Ripristinare vecchio `DATABASE_URL=file:...`.
3. Ripristinare codice/schema SQLite se già cambiato.
4. Avviare backend.
5. Verificare login/lista clienti.

## Rischi

- `STORAGE_DIR` non migrato: PDF presenti nel DB ma file mancanti.
- Env VPS non tracciato nel repo.
- Prisma provider non parametrico: SQLite/Postgres richiedono client coerente.
- `localStorage` contiene preferenze non nel DB: attività/retail scope oggi non sono persistite server-side.
- Downtime necessario per evitare divergenze durante export/import.

## Criterio successo

- App live usa PostgreSQL.
- Conteggi record SQLite = PostgreSQL per tabelle migrate.
- Nuovo cliente creato su VPS persiste dopo restart backend.
- PDF generato e scaricabile.
- Backup DB e storage esistono e sono ripristinabili.
