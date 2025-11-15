#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

ARGS=("$@")
if [ ${#ARGS[@]} -eq 0 ]; then
  ARGS=("app")
fi

EXISTING_PATHS=()
for target in "${ARGS[@]}"; do
  if [ -e "$target" ]; then
    EXISTING_PATHS+=("$target")
  fi
done

if [ ${#EXISTING_PATHS[@]} -eq 0 ]; then
  echo "No backend source paths found. Skipping mypy." >&2
  exit 0
fi

if command -v uv >/dev/null 2>&1; then
  uv run mypy "${EXISTING_PATHS[@]}"
else
  python -m mypy "${EXISTING_PATHS[@]}"
fi
