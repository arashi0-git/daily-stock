from __future__ import annotations

import ast
import sys
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
APP_DIR = ROOT / "app"

LAYER_RULES: dict[str, set[str]] = {
    "api": {"api", "services", "schemas", "core"},
    "services": {"services", "repositories", "schemas", "models", "core"},
    "repositories": {"repositories", "models", "core"},
    "schemas": {"schemas", "models"},
    "models": {"models"},
    "core": {"core"},
}


def detect_layer(file_path: Path) -> str | None:
    try:
        relative = file_path.relative_to(APP_DIR)
    except ValueError:
        return None
    parts = relative.parts
    return parts[0] if parts and parts[0] in LAYER_RULES else None


def iter_imports(path: Path) -> Iterable[str]:
    tree = ast.parse(path.read_text(encoding="utf-8"))
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                yield alias.name
        elif isinstance(node, ast.ImportFrom) and node.module:
            yield node.module


def validate_file(path: Path) -> list[str]:
    layer = detect_layer(path)
    if layer is None:
        return []

    violations: list[str] = []
    for module in iter_imports(path):
        if not module.startswith("app."):
            continue
        target = module.split(".")[1]
        allowed = LAYER_RULES[layer]
        if target not in allowed:
            violations.append(
                f"{path.relative_to(ROOT)} imports {module} (layer '{target}') "
                f"from '{layer}', allowed: {sorted(allowed)}"
            )
    return violations


def main() -> int:
    python_files = APP_DIR.rglob("*.py")
    violations = []
    for file_path in python_files:
        violations.extend(validate_file(file_path))

    if violations:
        print("Layer violations detected:", file=sys.stderr)
        for violation in violations:
            print(f" - {violation}", file=sys.stderr)
        return 1

    print("Backend layer checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
