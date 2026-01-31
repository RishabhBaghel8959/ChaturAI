from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.auth import (
    verify_password,
    get_password_hash,
    create_access_token
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=schemas.LoginResponse)
async def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    
    if user and verify_password(request.password, user.hashed_password):
        token = create_access_token({"sub": user.email})
        return schemas.LoginResponse(
            token=token,
            user=schemas.User(id=user.id, email=user.email, name=user.name)
        )
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/signup", response_model=schemas.LoginResponse)
async def signup(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == request.email).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(request.password)
    name = request.email.split("@")[0]
    
    new_user = models.User(
        email=request.email,
        hashed_password=hashed_password,
        name=name
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token({"sub": new_user.email})
    return schemas.LoginResponse(
        token=token,
        user=schemas.User(id=new_user.id, email=new_user.email, name=new_user.name)
    )