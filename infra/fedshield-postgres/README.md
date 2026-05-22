# FedShield PostgreSQL VPS Runtime

Questa cartella prepara il database centrale per FedShield su VPS.

## Uso previsto

1. Copiare la cartella su VPS, ad esempio in `/opt/fedshield-postgres`.
2. Creare `.env` partendo da `.env.example`.
3. Avviare PostgreSQL:

```bash
docker compose -f /opt/fedshield-postgres/compose.yaml up -d
```

4. Verificare che il database sia locale alla VPS:

```bash
docker compose -f /opt/fedshield-postgres/compose.yaml ps
ss -ltnp | grep 5432
```

La porta deve risultare legata a `127.0.0.1:5432`, non a `0.0.0.0:5432`.

## Backup manuale

```bash
sh /opt/fedshield-postgres/backup.sh
```

Il backup include:

- dump PostgreSQL compresso;
- archivio `STORAGE_DIR`, se presente;
- retention locale di 14 giorni.

## Cron consigliato

```cron
15 2 * * * /bin/sh /opt/fedshield-postgres/backup.sh >> /var/log/fedshield-postgres-backup.log 2>&1
```

## Note importanti

- Non puntare il backend a PostgreSQL prima di aver migrato i dati SQLite.
- Non esporre PostgreSQL su IP pubblico.
- `STORAGE_DIR` e database devono essere ripristinabili insieme: i record `GeneratedDocument` puntano a file fisici.
- Lo schema Prisma principale oggi resta SQLite finche' la finestra di migrazione VPS non e' pronta.
