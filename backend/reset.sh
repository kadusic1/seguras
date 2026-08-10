#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Load only plain scalar vars — DB_DSN (has parens/@/?) is deliberately excluded
set -a
source <(grep -E '^(DB_NAME|DB_ROOT_USER|DB_ROOT_PASSWORD|DB_APP_USER|DB_APP_PASSWORD|SEED_NAME|SEED_LASTNAME|SEED_EMAIL|SEED_PASSWORD)=' .env)
set +a

# Root uses unix_socket auth -> must run as root OS user via sudo, no -h/-P.
# --password= (even empty) avoids falling back to a stale native password.
MYSQL="sudo mariadb -u ${DB_ROOT_USER} --password=${DB_ROOT_PASSWORD:-}"

echo "==> Resetting database ${DB_NAME} and user ${DB_APP_USER}..."
$MYSQL <<SQL
-- Store and return timestamps in UTC; the app parses DB times as UTC
-- (DSN loc=UTC) so wall-clock values must not be shifted to local time.
SET GLOBAL time_zone = '+00:00';
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
$MYSQL "${DB_NAME}" < database/schema.sql

echo "==> Seeding admin user..."
go run cmd/seed/main.go \
  -name "${SEED_NAME}" \
  -lastname "${SEED_LASTNAME}" \
  -email "${SEED_EMAIL}" \
  -password "${SEED_PASSWORD}"

echo ""
echo "Reset complete. Database ${DB_NAME} is ready."
