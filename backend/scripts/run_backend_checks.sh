#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -d "$SCRIPT_DIR/../app" ] || [ -d "$SCRIPT_DIR/../tests" ]; then
  "$SCRIPT_DIR/run_ruff.sh"
  "$SCRIPT_DIR/run_formatter.sh" --check
  "$SCRIPT_DIR/run_mypy.sh"
  "$SCRIPT_DIR/run_pytest.sh"
  "$SCRIPT_DIR/run_architecture_check.sh"
else
  echo "No backend source paths found. Skipping backend checks." >&2
fi
