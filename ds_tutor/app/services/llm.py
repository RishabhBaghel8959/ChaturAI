from typing import Optional

from openai import OpenAI

from ..config import get_settings


class LLMClient:
	def __init__(self) -> None:
		self.settings = get_settings()
		self._client: Optional[OpenAI] = None
		if self.settings.use_llm and self.settings.openai_api_key:
			self._client = OpenAI(api_key=self.settings.openai_api_key)

	def generate(self, prompt: str) -> Optional[str]:
		if not self._client:
			return None
		model = self.settings.default_model
		resp = self._client.chat.completions.create(
			model=model,
			messages=[
				{"role": "system", "content": "You are a helpful data science tutor."},
				{"role": "user", "content": prompt},
			],
			temperature=0.2,
		)
		return resp.choices[0].message.content if resp and resp.choices else None