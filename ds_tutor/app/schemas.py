from pydantic import BaseModel
from typing import Optional, List, Literal


class QueryRequest(BaseModel):
	question: str
	intent: Optional[Literal["qa", "resources", "code", "explain"]] = None
	topic: Optional[str] = None
	level: Optional[Literal["beginner", "intermediate", "advanced"]] = "beginner"
	framework: Optional[str] = None


class Resource(BaseModel):
	title: str
	url: str
	level: Literal["beginner", "intermediate", "advanced"]
	type: Literal["docs", "course", "book", "article", "reference"]


class QueryResponse(BaseModel):
	intent: Literal["qa", "resources", "code", "explain"]
	answer: Optional[str] = None
	code: Optional[str] = None
	resources: Optional[List[Resource]] = None