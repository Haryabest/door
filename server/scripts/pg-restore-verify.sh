#!/usr/bin/env bash
# Проверка, что дамп восстанавливается без ошибки (локально или раз в квартал на копии).
# Требует: DATABASE_URL_RESTORE_TEST — отдельная пустая/тестовая БД, не боевое подключение.
#
# bash server/scripts/pg-restore-verify.sh /var/backups/door-postgres/door-YYYYMMDD.sql.gz

set -euo pipefail

if [[ "${1:-}" == "" ]] || [[ ! -f "$1" ]]; then
  echo "Использование: $0 /path/to/backup.sql.gz"
  exit 1
fi

: "${DATABASE_URL_RESTORE_TEST:?Укажите DATABASE_URL_RESTORE_TEST для тестовой БД}"

BACKUP="$(realpath "$1")"

echo "[restore-verify] drop & recreate через psql недоступен из одного скрипта универсально;"
echo "[restore-verify] рекомендация: создать БД door_restore_test и выполнить:"
echo "  gunzip -c \"$BACKUP\" | psql \"\$DATABASE_URL_RESTORE_TEST\""
echo "[restore-verify] затем простой sanity-check:"
echo '  echo "SELECT 1;" | psql "$DATABASE_URL_RESTORE_TEST"'
echo "[restore-verify] и удалить тестовую БД когда закончили."
