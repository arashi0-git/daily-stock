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

EXISTING_PATHS=()
for target in "${ARGS[@]}"; do
  if [ -e "$target" ]; then
    EXISTING_PATHS+=("$target")
  fi
done

if [ ${#EXISTING_PATHS[@]} -eq 0 ]; then
  echo "No backend source paths found. Skipping formatter." >&2
  exit 0
fi

FLAGS=()
if [ "$CHECK" = true ]; then
  FLAGS+=("--check")
fi

if command -v uv >/dev/null 2>&1; then
  uv run ruff format "${FLAGS[@]}" "${EXISTING_PATHS[@]}"
else
  python -m ruff format "${FLAGS[@]}" "${EXISTING_PATHS[@]}"
fi
