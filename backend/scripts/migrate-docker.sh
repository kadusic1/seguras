#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Applies ONLY the schema to the containerized MariaDB (mariadb service
# in compose.yml) - no DROP, no user changes, no seed. Safe to re-run.
# Constraint: schema.sql must stay additive (CREATE TABLE IF NOT EXISTS,
# ALTER ... ADD COLUMN IF NOT EXISTS); destructive changes still require
# reset-docker.sh --yes.
set -a
source <(grep -E '^(DB_NAME|DB_ROOT_USER|DB_ROOT_PASSWORD|DB_PORT)=' "$ROOT/.env")
set +a

MYSQL="mariadb -h 127.0.0.1 -P ${DB_PORT:-3306} -u ${DB_ROOT_USER} --password=${DB_ROOT_PASSWORD:-}"

echo "==> Applying schema to ${DB_NAME}..."
$MYSQL "${DB_NAME}" < "$ROOT/backend/database/schema.sql"

echo ""
echo "Schema applied. Database ${DB_NAME} is up to date."