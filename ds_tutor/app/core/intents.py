from typing import Literal

INTENT_QA = "qa"
INTENT_RESOURCES = "resources"
INTENT_CODE = "code"
INTENT_EXPLAIN = "explain"

Intent = Literal["qa", "resources", "code", "explain"]


_KEYWORDS = {
	INTENT_CODE: [
		"code", "snippet", "example", "implement", "write", "how to code",
	],
	INTENT_RESOURCES: [
		"resource", "resources", "book", "course", "tutorial", "where to learn",
	],
	INTENT_EXPLAIN: [
		"explain", "what is", "intuitively", "why", "meaning", "concept",
	],
}


def infer_intent(text: str) -> Intent:
	lowered = (text or "").lower()
	for intent, keywords in _KEYWORDS.items():
		for kw in keywords:
			if kw in lowered:
				return intent  # type: ignore[return-value]
	return INTENT_QA  # type: ignore[return-value]