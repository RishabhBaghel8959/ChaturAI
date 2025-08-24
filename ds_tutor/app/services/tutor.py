from typing import Optional

from ..core.intents import infer_intent, INTENT_QA, INTENT_RESOURCES, INTENT_CODE, INTENT_EXPLAIN
from ..core.knowledge_base import get_resources, get_code_snippet
from ..schemas import QueryRequest, QueryResponse
from .llm import LLMClient


class TutorService:
	def __init__(self) -> None:
		self.llm = LLMClient()

	def handle_query(self, req: QueryRequest) -> QueryResponse:
		intent = req.intent or infer_intent(req.question or "")
		if intent == INTENT_RESOURCES:
			resources = get_resources(req.topic or req.question, level=req.level or "beginner")
			return QueryResponse(intent=intent, resources=resources)
		if intent == INTENT_CODE:
			code = get_code_snippet(req.topic or req.question, framework=req.framework)
			if code:
				return QueryResponse(intent=intent, code=code)
			# fallback to LLM for code if available
			generated = self._maybe_llm(f"Write a short Python code example for: {req.question}")
			return QueryResponse(intent=intent, code=generated or "# No snippet available.")
		# QA or explain
		prompt = (
			"Explain clearly and briefly for a data science student. "
			f"Question: {req.question}\n"
		)
		answer = self._maybe_llm(prompt) or self._rule_based_answer(req.question)
		return QueryResponse(intent=intent, answer=answer)

	def _maybe_llm(self, prompt: str) -> Optional[str]:
		return self.llm.generate(prompt)

	def _rule_based_answer(self, question: str) -> str:
		lowered = (question or "").lower()
		if "bias-variance" in lowered or "bias variance" in lowered:
			return (
				"Bias is error from overly simple models; variance is error from overly complex models."
				" Use more data or regularization to reduce variance; use richer models to reduce bias."
			)
		if "train test split" in lowered:
			return (
				"Split data into training and testing to estimate generalization. Typical test sizes are 20-30%."
				" Use stratification for imbalanced classification."
			)
		return "I recommend checking the provided resources or enabling LLM for a detailed answer."