"""Tio Patinhas — Modelos SQLAlchemy.

Tabelas:
- users: dados básicos do usuário
- financial_profiles: renda, gastos, dívidas, objetivos
- analyses: diagnósticos gerados pelo Freud
- simulations: simulações geradas pelo Moriarty
- nodes: nodos do Second Brain (Athena)
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


def _utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    """Usuário do sistema."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=_utcnow)

    # Relacionamentos
    financial_profile = relationship("FinancialProfile", back_populates="user", uselist=False)
    analyses = relationship("Analysis", back_populates="user")
    simulations = relationship("Simulation", back_populates="user")
    nodes = relationship("Node", back_populates="user")


class FinancialProfile(Base):
    """Perfil financeiro do usuário — dados de entrada para os agentes."""
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    monthly_income = Column(Float, default=0.0)       # Renda mensal
    fixed_expenses = Column(Float, default=0.0)        # Gastos fixos
    variable_expenses = Column(Float, default=0.0)     # Gastos variáveis
    subscriptions = Column(Float, default=0.0)         # Assinaturas
    debts = Column(Float, default=0.0)                 # Dívidas
    financial_goal = Column(String(300), default="")   # Objetivo financeiro
    desired_monthly_saving = Column(Float, default=0.0)  # Quanto quer economizar/mês
    risk_tolerance = Column(String(20), default="moderado")  # conservador, moderado, arrojado

    created_at = Column(DateTime, default=_utcnow)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow)

    user = relationship("User", back_populates="financial_profile")


class Analysis(Base):
    """Análise/diagnóstico gerado pelo Freud."""
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    agent = Column(String(50), default="freud")
    analysis_type = Column(String(50), default="diagnostico")
    content = Column(Text, nullable=False)             # Conteúdo JSON da análise
    created_at = Column(DateTime, default=_utcnow)

    user = relationship("User", back_populates="analyses")


class Simulation(Base):
    """Simulação financeira gerada pelo Moriarty."""
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    emergency_reserve_target = Column(Float, default=0.0)
    monthly_saving = Column(Float, default=0.0)
    months_to_goal = Column(Integer, default=0)
    compound_interest_projection = Column(Text, default="")  # JSON
    debt_impact = Column(Text, default="")                   # JSON
    content = Column(Text, nullable=False)                   # Resumo completo JSON
    created_at = Column(DateTime, default=_utcnow)

    user = relationship("User", back_populates="simulations")


class Node(Base):
    """Nodo do Second Brain — gerado pela Athena."""
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    agent = Column(String(50), default="athena")
    title = Column(String(200), nullable=False)
    type = Column(String(50), default="geral")          # diagnostico, simulacao, perfil, plano
    content = Column(Text, nullable=False)                # Markdown
    file_path = Column(String(500), default="")          # Caminho no Obsidian Vault
    tags = Column(String(500), default="")               # Tags separadas por vírgula
    created_at = Column(DateTime, default=_utcnow)

    user = relationship("User", back_populates="nodes")
