#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! [ -d "app" ]; then
  echo "No backend source paths found. Skipping architecture check." >&2
  exit 0
fi

if command -v uv >/dev/null 2>&1; then
  uv run python scripts/check_layers.py
else
  python scripts/check_layers.py
fi
