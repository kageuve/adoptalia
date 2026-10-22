#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")/.."
compose=(docker compose --env-file "${ADOPTALIA_ENV_FILE:-.env}" -p adoptalia-dev -f compose.dev.yaml)
mkdir -p data/development/uploads/{imagenes,perfiles}
if [[ $EUID -eq 0 ]]; then chown -R 1000:1000 data/development/uploads; fi
case "${1:-up}" in
  build) "${compose[@]}" build backend; "${compose[@]}" build frontend ;;
  deps)
    "${compose[@]}" run --rm --no-deps --user 0 backend npm ci
    "${compose[@]}" run --rm --no-deps --user 0 frontend npm ci
    "${compose[@]}" restart backend frontend ;;
  up) "${compose[@]}" up -d --no-build --wait --wait-timeout 180 ;;
  down) "${compose[@]}" down ;;
  logs) "${compose[@]}" logs -f --tail 100 ;;
  *) echo 'Usage: scripts/dev.sh {build|up|deps|logs|down}' >&2; exit 2 ;;
esac
