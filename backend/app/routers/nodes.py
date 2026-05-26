"""Tio Patinhas — Router de Nodos (Athena / Second Brain)."""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, FinancialProfile, Analysis, Node
from app.schemas import NodeResponse
from app.agents import athena, freud, moriarty
from app.services.obsidian_service import salvar_nodo_obsidian

router = APIRouter(prefix="/nodes", tags=["Nodos (Athena)"])


@router.post("/{user_id}", response_model=list[NodeResponse], status_code=201)
def criar_nodos(user_id: int, db: Session = Depends(get_db)):
    """Cria nodos do Second Brain via Athena (requer análise prévia)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    perfil = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil financeiro não encontrado.")

    # Gerar dados dos agentes
    analise = freud.analisar(
        monthly_income=perfil.monthly_income,
        fixed_expenses=perfil.fixed_expenses,
        variable_expenses=perfil.variable_expenses,
        subscriptions=perfil.subscriptions,
        debts=perfil.debts,
        financial_goal=perfil.financial_goal,
        desired_monthly_saving=perfil.desired_monthly_saving,
        risk_tolerance=perfil.risk_tolerance,
    )

    simulacoes = moriarty.gerar_simulacoes_completas(
        monthly_income=perfil.monthly_income,
        fixed_expenses=perfil.fixed_expenses,
        variable_expenses=perfil.variable_expenses,
        subscriptions=perfil.subscriptions,
        debts=perfil.debts,
        desired_monthly_saving=perfil.desired_monthly_saving,
    )

    # Gerar nodos via Athena
    nodos_data = athena.gerar_todos_nodos(user.name, analise, simulacoes)

    nodes_criados = []
    for nodo_data in nodos_data:
        # Salvar no Obsidian Vault
        file_path = salvar_nodo_obsidian(user_id, nodo_data)

        # Salvar no banco
        node = Node(
            user_id=user_id,
            agent=nodo_data["agent"],
            title=nodo_data["title"],
            type=nodo_data["type"],
            content=nodo_data["content"],
            file_path=file_path,
            tags=nodo_data["tags"],
        )
        db.add(node)
        nodes_criados.append(node)

    db.commit()
    for n in nodes_criados:
        db.refresh(n)

    return nodes_criados


@router.get("/{user_id}", response_model=list[NodeResponse])
def listar_nodos(user_id: int, db: Session = Depends(get_db)):
    """Lista todos os nodos do usuário."""
    return db.query(Node).filter(Node.user_id == user_id).order_by(Node.created_at.desc()).all()


@router.get("/{user_id}/{node_id}", response_model=NodeResponse)
def buscar_nodo(user_id: int, node_id: int, db: Session = Depends(get_db)):
    """Busca um nodo específico."""
    node = db.query(Node).filter(Node.id == node_id, Node.user_id == user_id).first()
    if not node:
        raise HTTPException(status_code=404, detail="Nodo não encontrado.")
    return node
