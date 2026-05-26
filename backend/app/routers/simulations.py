"""Tio Patinhas — Router de Simulações (Moriarty)."""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, FinancialProfile, Simulation
from app.schemas import SimulationResponse
from app.agents import moriarty

router = APIRouter(prefix="/simulations", tags=["Simulações (Moriarty)"])


@router.post("/{user_id}", response_model=SimulationResponse, status_code=201)
def gerar_simulacoes(user_id: int, db: Session = Depends(get_db)):
    """Gera simulações financeiras do Moriarty."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    perfil = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil financeiro não encontrado.")

    resultado = moriarty.gerar_simulacoes_completas(
        monthly_income=perfil.monthly_income,
        fixed_expenses=perfil.fixed_expenses,
        variable_expenses=perfil.variable_expenses,
        subscriptions=perfil.subscriptions,
        debts=perfil.debts,
        desired_monthly_saving=perfil.desired_monthly_saving,
    )

    reserva = resultado.get("reserva_emergencia", {})
    juros = resultado.get("juros_compostos", {})
    dividas = resultado.get("impacto_dividas", {})

    sim = Simulation(
        user_id=user_id,
        emergency_reserve_target=reserva.get("valor_alvo", 0),
        monthly_saving=reserva.get("aporte_mensal", 0),
        months_to_goal=reserva.get("meses_para_atingir") or 0,
        compound_interest_projection=json.dumps(juros, ensure_ascii=False),
        debt_impact=json.dumps(dividas, ensure_ascii=False),
        content=json.dumps(resultado, ensure_ascii=False),
    )
    db.add(sim)
    db.commit()
    db.refresh(sim)
    return sim


@router.get("/{user_id}", response_model=list[SimulationResponse])
def listar_simulacoes(user_id: int, db: Session = Depends(get_db)):
    """Lista todas as simulações do usuário."""
    return db.query(Simulation).filter(Simulation.user_id == user_id).order_by(Simulation.created_at.desc()).all()
