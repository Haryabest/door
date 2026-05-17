#!/usr/bin/env bash
# Снимок базы через pg_dump. Для cron: 0 3 * * * /path/to/pg-backup.sh >> /var/log/door-backup.log 2>&1
set -euo pipefail

: "${DATABASE_URL:?Укажите DATABASE_URL}"

BACKUP_DIR="${BACKUP_DIR:-/var/backups/door-postgres}"
RETAIN_DAYS="${RETAIN_DAYS:-14}"

mkdir -p "$BACKUP_DIR"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="$BACKUP_DIR/door-${STAMP}.sql.gz"

pg_dump "$DATABASE_URL" | gzip -c > "$FILE"
echo "[pg-backup] wrote $FILE"

if [[ "$(command -v find)" ]] && [[ "$RETAIN_DAYS" =~ ^[0-9]+$ ]]; then
  find "$BACKUP_DIR" -maxdepth 1 -name 'door-*.sql.gz' -mtime +"$RETAIN_DAYS" -delete || true
  echo "[pg-backup] prune older than ${RETAIN_DAYS}d done"
fi
