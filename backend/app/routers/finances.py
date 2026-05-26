"""Tio Patinhas — Router de Perfil Financeiro."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, FinancialProfile
from app.schemas import FinancialProfileCreate, FinancialProfileResponse

router = APIRouter(prefix="/financial-profile", tags=["Perfil Financeiro"])


@router.post("/{user_id}", response_model=FinancialProfileResponse, status_code=201)
def criar_ou_atualizar_perfil(
    user_id: int, data: FinancialProfileCreate, db: Session = Depends(get_db)
):
    """Cria ou atualiza o perfil financeiro do usuário."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    perfil = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()

    if perfil:
        # Atualizar
        for field, value in data.model_dump().items():
            setattr(perfil, field, value)
    else:
        # Criar
        perfil = FinancialProfile(user_id=user_id, **data.model_dump())
        db.add(perfil)

    db.commit()
    db.refresh(perfil)
    return perfil


@router.get("/{user_id}", response_model=FinancialProfileResponse)
def buscar_perfil(user_id: int, db: Session = Depends(get_db)):
    """Busca o perfil financeiro do usuário."""
    perfil = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil financeiro não encontrado.")
    return perfil
