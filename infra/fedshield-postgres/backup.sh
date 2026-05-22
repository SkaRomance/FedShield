#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

if [ -f "$SCRIPT_DIR/.env" ]; then
  set -a
  . "$SCRIPT_DIR/.env"
  set +a
fi

POSTGRES_DB=${POSTGRES_DB:-fedshield}
POSTGRES_USER=${POSTGRES_USER:-fedshield}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:?Set POSTGRES_PASSWORD in .env}
BACKUP_ROOT=${BACKUP_ROOT:-/opt/fedshield-backups}
STORAGE_DIR=${STORAGE_DIR:-/opt/fedshield-storage}
COMPOSE_FILE=${COMPOSE_FILE:-$SCRIPT_DIR/compose.yaml}
POSTGRES_SERVICE=${POSTGRES_SERVICE:-postgres}

STAMP=$(date +%Y%m%d-%H%M%S)
TARGET_DIR="$BACKUP_ROOT/$STAMP"

mkdir -p "$TARGET_DIR"

docker compose -f "$COMPOSE_FILE" exec -T -e PGPASSWORD="$POSTGRES_PASSWORD" "$POSTGRES_SERVICE" \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$TARGET_DIR/fedshield.sql.gz"

if [ -d "$STORAGE_DIR" ]; then
  tar -czf "$TARGET_DIR/storage.tgz" -C "$(dirname "$STORAGE_DIR")" "$(basename "$STORAGE_DIR")"
fi

find "$BACKUP_ROOT" -mindepth 1 -maxdepth 1 -type d -mtime +14 -exec rm -rf {} \;

printf 'Backup written to %s\n' "$TARGET_DIR"
