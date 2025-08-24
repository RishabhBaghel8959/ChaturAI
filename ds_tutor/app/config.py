from pydantic import BaseModel
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
	openai_api_key: Optional[str] = None
	default_model: str = "gpt-4o-mini"
	use_llm: bool = True

	class Config:
		env_file = ".env"
		case_sensitive = False


class AppInfo(BaseModel):
	name: str = "DS Tutor"
	version: str = "0.1.0"


def get_settings() -> Settings:
	return Settings()  # type: ignore[call-arg]