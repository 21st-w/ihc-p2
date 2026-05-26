"""Tio Patinhas — Router de Usuários."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Usuários"])


@router.post("", response_model=UserResponse, status_code=201)
def criar_usuario(data: UserCreate, db: Session = Depends(get_db)):
    """Cria um novo usuário ou retorna o existente se o e-mail já estiver cadastrado."""
    existente = db.query(User).filter(User.email == data.email).first()
    if existente:
        return existente

    user = User(name=data.name, email=data.email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/{user_id}", response_model=UserResponse)
def buscar_usuario(user_id: int, db: Session = Depends(get_db)):
    """Busca um usuário pelo ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    return user
