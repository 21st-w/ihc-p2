"""Tio Patinhas — Schemas Pydantic para validação de dados."""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# ── Usuário ──────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, examples=["João Silva"])
    email: EmailStr = Field(..., examples=["joao@email.com"])


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Perfil Financeiro ────────────────────────────────────

class FinancialProfileCreate(BaseModel):
    monthly_income: float = Field(..., ge=0, description="Renda mensal em R$")
    fixed_expenses: float = Field(0, ge=0, description="Gastos fixos em R$")
    variable_expenses: float = Field(0, ge=0, description="Gastos variáveis em R$")
    subscriptions: float = Field(0, ge=0, description="Assinaturas em R$")
    debts: float = Field(0, ge=0, description="Dívidas em R$")
    financial_goal: str = Field("", max_length=300, description="Objetivo financeiro")
    desired_monthly_saving: float = Field(0, ge=0, description="Quanto deseja economizar por mês")
    risk_tolerance: str = Field("moderado", pattern="^(conservador|moderado|arrojado)$")


class FinancialProfileResponse(BaseModel):
    id: int
    user_id: int
    monthly_income: float
    fixed_expenses: float
    variable_expenses: float
    subscriptions: float
    debts: float
    financial_goal: str
    desired_monthly_saving: float
    risk_tolerance: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ── Análise (Freud) ─────────────────────────────────────

class AnalysisResponse(BaseModel):
    id: int
    user_id: int
    agent: str
    analysis_type: str
    content: str  # JSON string
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Simulação (Moriarty) ────────────────────────────────

class SimulationResponse(BaseModel):
    id: int
    user_id: int
    emergency_reserve_target: float
    monthly_saving: float
    months_to_goal: int
    compound_interest_projection: str
    debt_impact: str
    content: str  # JSON string
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Nodo (Athena) ────────────────────────────────────────

class NodeResponse(BaseModel):
    id: int
    user_id: int
    agent: str
    title: str
    type: str
    content: str
    file_path: str
    tags: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Fluxo Completo ───────────────────────────────────────

class FullAnalysisResponse(BaseModel):
    """Resposta do endpoint /run-full-analysis/{user_id}."""
    user: UserResponse
    profile: FinancialProfileResponse
    analysis: dict
    simulations: dict
    nodes_created: list[NodeResponse]
    obsidian_files: list[str]


# ── IA / RAG ──────────────────────────────────────────────

class AIChatRequest(BaseModel):
    question: str


class AIChatResponse(BaseModel):
    success: bool
    answer: str
    sources: list = []
    confidence: str = "baixa"
    fallback_used: bool = False
    educational_disclaimer: str


class AIReindexResponse(BaseModel):
    success: bool
    indexed_chunks: int
    message: str
