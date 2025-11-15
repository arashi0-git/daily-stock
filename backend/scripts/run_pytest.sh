#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

ARGS=("$@")

if command -v uv >/dev/null 2>&1; then
  uv run pytest "${ARGS[@]}"
else
  python -m pytest "${ARGS[@]}"
fi
