"""Database initialization module."""

from __future__ import annotations

import asyncio

from app.core.database import engine
from app.models.user import Base  # Import Base from models layer


async def init_models(max_attempts: int = 30, delay_seconds: float = 2.0) -> None:
    """Initialize database models with retry logic for Docker startup."""
    last_exc: Exception | None = None
    for attempt in range(1, max_attempts + 1):
        try:
            async with engine.begin() as connection:
                await connection.run_sync(Base.metadata.create_all)
            print(f"✅ Database initialized successfully (attempt {attempt}/{max_attempts})")
            return
        except Exception as exc:  # pragma: no cover - best-effort startup guard
            last_exc = exc
            if attempt == max_attempts:
                raise
            print(f"⏳ Waiting for database... (attempt {attempt}/{max_attempts})")
            await asyncio.sleep(delay_seconds)

    if last_exc:
        raise last_exc
