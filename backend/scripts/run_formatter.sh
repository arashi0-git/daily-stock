#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

CHECK=false

if [ "${1:-}" = "--check" ]; then
  CHECK=true
  shift
fi

ARGS=("$@")
if [ ${#ARGS[@]} -eq 0 ]; then
  ARGS=("app" "tests")
fi

FLAGS=()
if [ "$CHECK" = true ]; then
  FLAGS+=("--check")
fi

if command -v uv >/dev/null 2>&1; then
  uv run ruff format "${FLAGS[@]}" "${ARGS[@]}"
else
  python -m ruff format "${FLAGS[@]}" "${ARGS[@]}"
fi
