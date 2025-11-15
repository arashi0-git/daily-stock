#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

"$SCRIPT_DIR/run_ruff.sh"
"$SCRIPT_DIR/run_formatter.sh" --check
"$SCRIPT_DIR/run_mypy.sh"
"$SCRIPT_DIR/run_pytest.sh"
"$SCRIPT_DIR/run_architecture_check.sh"
