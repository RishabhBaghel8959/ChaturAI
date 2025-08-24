from fastapi import FastAPI
from .routers.tutor import router as tutor_router

app = FastAPI(title="DS Tutor API", version="0.1.0")

@app.get("/health")
def health() -> dict:
	return {"status": "ok"}

app.include_router(tutor_router, prefix="/api/tutor")