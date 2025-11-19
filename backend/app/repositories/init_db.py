"""Database initialization module using Alembic migrations."""

from __future__ import annotations

import asyncio
import subprocess
from pathlib import Path

from app.core.database import engine


async def init_models(max_attempts: int = 30, delay_seconds: float = 2.0) -> None:
    """
    Initialize database using Alembic migrations with retry logic for Docker startup.

    This approach is preferred over Base.metadata.create_all() because:
    - Supports incremental schema changes in production
    - Maintains migration history
    - Allows rollback if needed
    - Ensures all environments have consistent schema
    """
    last_exc: Exception | None = None
    alembic_ini = Path(__file__).parent.parent.parent / "alembic.ini"

    for attempt in range(1, max_attempts + 1):
        try:
            # Test database connection
            async with engine.begin():
                pass

            # Run alembic migrations
            result = subprocess.run(
                ["alembic", "-c", str(alembic_ini), "upgrade", "head"],
                capture_output=True,
                text=True,
                check=True,
            )
            print(f"✅ Database migrations applied successfully (attempt {attempt}/{max_attempts})")
            if result.stdout:
                print(result.stdout)
            return

        except (subprocess.CalledProcessError, Exception) as exc:  # pragma: no cover
            last_exc = exc
            if attempt == max_attempts:
                if isinstance(exc, subprocess.CalledProcessError):
                    print(f"❌ Alembic error: {exc.stderr}")
                raise
            print(f"⏳ Waiting for database... (attempt {attempt}/{max_attempts})")
            await asyncio.sleep(delay_seconds)

    if last_exc:
        raise last_exc
