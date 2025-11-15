#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

FIX=false
ARGS=("$@")
FLAGS=()

if [ ${#ARGS[@]} -eq 0 ]; then
  ARGS=("app" "tests")
else
  FIX=true
fi

if [ "${FIX}" = true ]; then
  FLAGS+=("--fix")
fi

EXISTING_PATHS=()
for target in "${ARGS[@]}"; do
  if [ -e "$target" ]; then
    EXISTING_PATHS+=("$target")
  fi
done

if [ ${#EXISTING_PATHS[@]} -eq 0 ]; then
  echo "No backend source paths found. Skipping ruff." >&2
  exit 0
fi

RUN_ARGS=()
if [ ${#FLAGS[@]} -gt 0 ]; then
  RUN_ARGS+=("${FLAGS[@]}")
fi
RUN_ARGS+=("${EXISTING_PATHS[@]}")

if command -v uv >/dev/null 2>&1; then
  uv run ruff check "${RUN_ARGS[@]}"
else
  python -m ruff check "${RUN_ARGS[@]}"
fi
