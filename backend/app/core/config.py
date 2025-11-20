from pydantic import AnyHttpUrl, Field, PostgresDsn, computed_field
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Daily Stock API"
    API_V1_STR: str = "/api"

    # SECURITY
    JWT_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    AUTH_COOKIE_SECURE: bool = True

    # Azure Document Intelligence
    # Azure Document Intelligence
    AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT: str | None = Field(
        default=None, validation_alias="AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT"
    )
    AZURE_DOCUMENT_INTELLIGENCE_KEY: str | None = Field(
        default=None, validation_alias="AZURE_DOCUMENT_INTELLIGENCE_KEY"
    )

    # CORS
    CORS_ORIGINS: list[AnyHttpUrl] = []

    @computed_field  # type: ignore[prop-decorator]
    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.CORS_ORIGINS]

    # DATABASE
    POSTGRES_USER: str | None = None
    POSTGRES_PASSWORD: str | None = None
    POSTGRES_DB: str | None = None
    DATABASE_URL: PostgresDsn | None = None

    @computed_field  # type: ignore[prop-decorator]
    @property
    def sqlalchemy_database_uri(self) -> str:
        if self.DATABASE_URL:
            return str(self.DATABASE_URL)

        if not (self.POSTGRES_USER and self.POSTGRES_PASSWORD and self.POSTGRES_DB):
            raise ValueError("Database configuration is incomplete")

        return str(
            MultiHostUrl.build(
                scheme="postgresql+asyncpg",
                username=self.POSTGRES_USER,
                password=self.POSTGRES_PASSWORD,
                host="postgres",
                port=5432,
                path=self.POSTGRES_DB,
            )
        )

    model_config = SettingsConfigDict(
        env_file=[".env", "../.env"], env_prefix="DAILY_STOCK_", case_sensitive=True, extra="ignore"
    )


settings = Settings()  # type: ignore[call-arg]
