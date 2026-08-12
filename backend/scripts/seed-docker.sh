#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Seeds a user into the containerized MariaDB (mariadb service in
# compose.yml). Target DSN comes from the repo-root .env; defaults come
# from the SEED_* vars in backend/.env. Non-destructive - no reset.
# For the local native MariaDB use reset.sh instead.
set -a
source <(grep -E '^(DB_NAME|DB_APP_USER|DB_APP_PASSWORD|DB_PORT)=' "$ROOT/.env")
source <(grep -E '^(SEED_NAME|SEED_LASTNAME|SEED_EMAIL|SEED_PASSWORD)=' "$ROOT/backend/.env")
set +a

export DB_DSN="${DB_APP_USER}:${DB_APP_PASSWORD}@tcp(127.0.0.1:${DB_PORT:-3306})/${DB_NAME}"

# go run must run with CWD=backend: cmd/seed hard-fails when godotenv.Load()
# cannot find backend/.env there.
if [ $# -eq 0 ]; then
  (cd "$ROOT/backend" && go run cmd/seed/main.go \
    -name "${SEED_NAME}" \
    -lastname "${SEED_LASTNAME}" \
    -email "${SEED_EMAIL}" \
    -password "${SEED_PASSWORD}")
else
  (cd "$ROOT/backend" && go run cmd/seed/main.go "$@")
fi