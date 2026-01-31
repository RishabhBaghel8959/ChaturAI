import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import DATABASE_URL

DATA_DIR = "/app/data"

# ✅ SAFELY ensure directory exists
if DATABASE_URL.startswith("sqlite"):
    if os.path.exists(DATA_DIR) and not os.path.isdir(DATA_DIR):
        os.remove(DATA_DIR)          # <-- THIS IS KEY
    os.makedirs(DATA_DIR, exist_ok=True)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
