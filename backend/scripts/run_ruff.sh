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

RUN_ARGS=()
if [ ${#FLAGS[@]} -gt 0 ]; then
  RUN_ARGS+=("${FLAGS[@]}")
fi
RUN_ARGS+=("${ARGS[@]}")

if command -v uv >/dev/null 2>&1; then
  uv run ruff check "${RUN_ARGS[@]}"
else
  python -m ruff check "${RUN_ARGS[@]}"
fi
