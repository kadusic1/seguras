#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Reset the local native MariaDB (unix-socket root auth via sudo).
# For the containerized MariaDB use reset-docker.sh instead.
#
# Load only plain scalar vars - DB_DSN (has parens/@/?) is deliberately
# excluded so the seed below reads it from backend/.env via godotenv.
set -a
source <(grep -E '^(DB_NAME|DB_ROOT_USER|DB_ROOT_PASSWORD|DB_APP_USER|DB_APP_PASSWORD|SEED_NAME|SEED_LASTNAME|SEED_EMAIL|SEED_PASSWORD)=' "$ROOT/backend/.env")
set +a

# Root uses unix_socket auth -> must run as root OS user via sudo, no -h/-P.
# --password= (even empty) avoids falling back to a stale native password.
MYSQL="sudo mariadb -u ${DB_ROOT_USER} --password=${DB_ROOT_PASSWORD:-}"

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
(cd "$ROOT/backend" && go run cmd/seed/main.go \
  -name "${SEED_NAME}" \
  -lastname "${SEED_LASTNAME}" \
  -email "${SEED_EMAIL}" \
  -password "${SEED_PASSWORD}")

echo ""
echo "Reset complete. Database ${DB_NAME} is ready."