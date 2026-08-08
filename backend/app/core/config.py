from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=os.path.join(BASE_DIR, ".env"),
        extra="ignore"
    )

    gemini_api_key: str | None = None
    groq_api_key: str | None = None
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    model_name: str = "gemini-2.5-flash"
    groq_model_name: str = "llama-3.3-70b-versatile"
    port: int = 8000

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
