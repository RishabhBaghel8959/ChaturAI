from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.auth import get_current_user
from app.services.gemini import GeminiService
from datetime import datetime
from typing import List, Optional

router = APIRouter(prefix="/api", tags=["chat"])
gemini_service = GeminiService()

@router.post("/chat/query", response_model=schemas.ChatQueryResponse)
async def query_chat(
    question: str = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        response = await gemini_service.generate_response(question, files)
        return schemas.ChatQueryResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chats")
async def get_chats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chats = db.query(models.Chat).filter(models.Chat.user_id == current_user.id).all()
    return [
        {
            "id": chat.id,
            "title": chat.title,
            "messages": chat.messages or [],
            "created_at": chat.created_at,
            "updated_at": chat.updated_at
        }
        for chat in chats
    ]

@router.post("/chats")
async def create_chat(
    chat: schemas.ChatCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat_id = str(int(datetime.utcnow().timestamp() * 1000))
    new_chat = models.Chat(
        id=chat_id,
        user_id=current_user.id,
        title=chat.title,
        messages=[]
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    
    return {
        "id": new_chat.id,
        "title": new_chat.title,
        "messages": new_chat.messages or [],
        "created_at": new_chat.created_at,
        "updated_at": new_chat.updated_at
    }

@router.put("/chats/{chat_id}")
async def update_chat(
    chat_id: str,
    chat: schemas.ChatUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_chat = db.query(models.Chat).filter(
        models.Chat.id == chat_id,
        models.Chat.user_id == current_user.id
    ).first()
    
    if not db_chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    db_chat.messages = [msg.dict() for msg in chat.messages]
    db_chat.updated_at = datetime.utcnow()
    db.commit()
    
    return {
        "id": db_chat.id,
        "title": db_chat.title,
        "messages": db_chat.messages,
        "created_at": db_chat.created_at,
        "updated_at": db_chat.updated_at
    }

@router.delete("/chats/{chat_id}")
async def delete_chat(
    chat_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_chat = db.query(models.Chat).filter(
        models.Chat.id == chat_id,
        models.Chat.user_id == current_user.id
    ).first()
    
    if not db_chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    db.delete(db_chat)
    db.commit()
    
    return {"message": "Chat deleted successfully"}