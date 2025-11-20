#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

ARGS=("$@")

if ! [ -d "tests" ] && [ ${#ARGS[@]} -eq 0 ]; then
  echo "No backend tests found. Skipping pytest." >&2
  exit 0
fi

if command -v uv >/dev/null 2>&1; then
  uv run pytest "${ARGS[@]:-}"
else
  python -m pytest "${ARGS[@]:-}"
fi
