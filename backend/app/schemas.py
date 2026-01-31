from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    email: str
    name: str
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: User

class Message(BaseModel):
    role: str
    content: str
    timestamp: Optional[datetime] = None

class ChatCreate(BaseModel):
    title: str

class ChatUpdate(BaseModel):
    messages: List[Message]

class Chat(BaseModel):
    id: str
    title: str
    messages: List[Message]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ChatQueryResponse(BaseModel):
    response: str
    status: str = "success"