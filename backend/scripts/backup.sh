#!/bin/sh
# Runs as its own short-lived container (via ofelia job-run), connecting to
# the mariadb service over the compose network.
# Dumps the database, and only keeps the dump if its content actually
# changed since the last backup (compared via sha256 checksum).
set -eu

BACKUP_DIR="/backups"
DB_HOST="${DB_HOST:-mariadb}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${MARIADB_DATABASE}"
CHECKSUM_FILE="$BACKUP_DIR/.last_checksum"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
TMP_DUMP="$(mktemp)"

mkdir -p "$BACKUP_DIR"

cleanup() {
  rm -f "$TMP_DUMP"
}
trap cleanup EXIT

# --skip-dump-date removes the "-- Dump completed on <date>" comment so the
# checksum only changes when the actual data/schema changes, not every run.
mariadb-dump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --user=root \
  --password="${MARIADB_ROOT_PASSWORD}" \
  --single-transaction \
  --routines \
  --triggers \
  --skip-dump-date \
  "$DB_NAME" > "$TMP_DUMP"

NEW_CHECKSUM="$(sha256sum "$TMP_DUMP" | awk '{print $1}')"

if [ -f "$CHECKSUM_FILE" ] && [ "$(cat "$CHECKSUM_FILE")" = "$NEW_CHECKSUM" ]; then
  echo "[backup] No changes since last backup, skipping."
  exit 0
fi

OUT_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"
gzip -c "$TMP_DUMP" > "$OUT_FILE"
echo "$NEW_CHECKSUM" > "$CHECKSUM_FILE"
echo "[backup] Changes detected, wrote $OUT_FILE"

# Prune backups older than RETENTION_DAYS
find "$BACKUP_DIR" -maxdepth 1 -name "${DB_NAME}_*.sql.gz" -mtime +"$RETENTION_DAYS" -delete
