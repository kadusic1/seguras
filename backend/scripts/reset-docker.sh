#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Reset the containerized MariaDB (mariadb service in compose.yml):
# DROPS the database, recreates the user and schema, then seeds the
# admin. Destructive - manual only, never runs automatically, requires
# --yes. For the local native MariaDB use reset.sh instead.
#
# DB credentials live in the repo-root .env (single source; docker
# compose interpolates the same file).
set -a
source <(grep -E '^(DB_NAME|DB_ROOT_USER|DB_ROOT_PASSWORD|DB_APP_USER|DB_APP_PASSWORD|DB_PORT)=' "$ROOT/.env")
set +a

if [[ "${1:-}" != "--yes" ]]; then
  echo "Refusing to run: this DROPS database ${DB_NAME} on 127.0.0.1:${DB_PORT:-3306}."
  echo "Re-run with: $0 --yes"
  exit 1
fi

# DB runs in the mariadb compose service; root auth is password-based over
# TCP, so -h/-P replace the unix-socket sudo call used by reset.sh.
MYSQL="mariadb -h 127.0.0.1 -P ${DB_PORT:-3306} -u ${DB_ROOT_USER} --password=${DB_ROOT_PASSWORD:-}"

echo "==> Resetting database ${DB_NAME} and user ${DB_APP_USER}..."
$MYSQL <<SQL
DROP DATABASE IF EXISTS ${DB_NAME};
DROP USER IF EXISTS ${DB_APP_USER}@'%';
DROP USER IF EXISTS ${DB_APP_USER}@'localhost';
CREATE USER ${DB_APP_USER}@'%' IDENTIFIED BY '${DB_APP_PASSWORD}';
CREATE USER ${DB_APP_USER}@'localhost' IDENTIFIED BY '${DB_APP_PASSWORD}';
CREATE DATABASE ${DB_NAME} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO ${DB_APP_USER}@'%';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO ${DB_APP_USER}@'localhost';
FLUSH PRIVILEGES;
SQL

echo "==> Loading schema..."
$MYSQL "${DB_NAME}" < "$ROOT/backend/database/schema.sql"

echo "==> Seeding admin user..."
"$(dirname "${BASH_SOURCE[0]}")/seed-docker.sh"

echo ""
echo "Reset complete. Database ${DB_NAME} is ready."