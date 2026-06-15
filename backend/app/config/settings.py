import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    SQLALCHEMY_DATABASE_URI: str = os.getenv(
        "DATABASE_URL",
        "postgresql://oficina:oficina@localhost:5432/oficina_db",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "jwt-secret-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 86400))


class TestingConfig(Config):
    TESTING: bool = True
    SQLALCHEMY_DATABASE_URI: str = os.getenv(
        "TEST_DATABASE_URL",
        "sqlite:///test_oficina.db",
    )
    JWT_ACCESS_TOKEN_EXPIRES: int = 3600


config_map: dict[str, type[Config]] = {
    "development": Config,
    "testing": TestingConfig,
    "production": Config,
}
