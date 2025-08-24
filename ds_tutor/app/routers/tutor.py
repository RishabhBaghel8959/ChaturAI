from fastapi import APIRouter

from ..schemas import QueryRequest, QueryResponse
from ..services.tutor import TutorService

router = APIRouter(tags=["tutor"])

_service = TutorService()


@router.post("/query", response_model=QueryResponse)
def query(req: QueryRequest) -> QueryResponse:
	return _service.handle_query(req)