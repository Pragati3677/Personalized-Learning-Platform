from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralized configuration for the ML microservice.

    Values are loaded from environment variables / a local .env file.
    See .env.example for the full list of supported variables.
    """

    environment: str = "development"
    host: str = "0.0.0.0"
    port: int = 8001

    model_artifact_dir: str = "./app/artifacts"
    allowed_origin: str = "http://127.0.0.1:5000"
    log_level: str = "info"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)


settings = Settings()
