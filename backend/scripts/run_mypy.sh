#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

ARGS=("$@")
if [ ${#ARGS[@]} -eq 0 ]; then
  ARGS=("app")
fi

if command -v uv >/dev/null 2>&1; then
  uv run mypy "${ARGS[@]}"
else
  python -m mypy "${ARGS[@]}"
fi
