from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, chat

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ChaturAI API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router)

@app.get("/health")
async def health():
    return {"status": "ok", "message": "ChaturAI API is running"}

@app.get("/")
async def root():
    return {"message": "ChaturAI API - Powered by Gemini 2.5 Flash"}