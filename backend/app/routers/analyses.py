"""Tio Patinhas — Router de Análises (Freud)."""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, FinancialProfile, Analysis
from app.schemas import AnalysisResponse
from app.agents import freud

router = APIRouter(prefix="/analysis", tags=["Análises (Freud)"])


@router.post("/{user_id}", response_model=AnalysisResponse, status_code=201)
def gerar_analise(user_id: int, db: Session = Depends(get_db)):
    """Gera análise do Freud a partir do perfil financeiro do usuário."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    perfil = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil financeiro não encontrado. Cadastre seus dados primeiro.")

    resultado = freud.analisar(
        monthly_income=perfil.monthly_income,
        fixed_expenses=perfil.fixed_expenses,
        variable_expenses=perfil.variable_expenses,
        subscriptions=perfil.subscriptions,
        debts=perfil.debts,
        financial_goal=perfil.financial_goal,
        desired_monthly_saving=perfil.desired_monthly_saving,
        risk_tolerance=perfil.risk_tolerance,
    )

    analise = Analysis(
        user_id=user_id,
        agent="freud",
        analysis_type="diagnostico",
        content=json.dumps(resultado, ensure_ascii=False),
    )
    db.add(analise)
    db.commit()
    db.refresh(analise)
    return analise


@router.get("/{user_id}", response_model=list[AnalysisResponse])
def listar_analises(user_id: int, db: Session = Depends(get_db)):
    """Lista todas as análises do usuário."""
    return db.query(Analysis).filter(Analysis.user_id == user_id).order_by(Analysis.created_at.desc()).all()
