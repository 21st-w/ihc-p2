"""Tio Patinhas — Pydantic schemas for API request/response validation."""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, EmailStr, Field


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

class SignupRequest(BaseModel):
    nome: str = Field(min_length=2, max_length=255)
    email: EmailStr
    senha: str = Field(min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    senha: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    nome: str
    email: str
    criado_em: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Transactions
# ---------------------------------------------------------------------------

class TransactionCreate(BaseModel):
    data: datetime
    descricao: str = Field(min_length=1, max_length=500)
    valor: Decimal = Field(gt=0)
    tipo: str = Field(pattern="^(credito|debito)$")
    categoria: str | None = None


class TransactionResponse(BaseModel):
    id: int
    data: datetime
    descricao: str
    valor: Decimal
    tipo: str
    categoria: str | None
    criado_em: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Income Sources
# ---------------------------------------------------------------------------

class IncomeSourceCreate(BaseModel):
    nome: str = Field(min_length=1, max_length=255)
    valor_mensal: Decimal = Field(gt=0)
    tipo: str = "salario"


class IncomeSourceResponse(BaseModel):
    id: int
    nome: str
    valor_mensal: Decimal
    tipo: str

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Debts
# ---------------------------------------------------------------------------

class DebtCreate(BaseModel):
    nome: str = Field(min_length=1, max_length=255)
    saldo: Decimal = Field(gt=0)
    taxa_mensal: Decimal = Field(ge=0)
    parcela: Decimal | None = None


class DebtResponse(BaseModel):
    id: int
    nome: str
    saldo: Decimal
    taxa_mensal: Decimal
    parcela: Decimal | None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Simulations
# ---------------------------------------------------------------------------

class SimulationResponse(BaseModel):
    id: int
    tipo: str
    inputs_json: dict
    outputs_json: dict
    criado_em: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Chat
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    mensagem: str = Field(min_length=1, max_length=2000)
    historico: list[dict] = Field(default_factory=list)


class ChatResponse(BaseModel):
    resposta: str
    agente_usado: str
    skill_chamada: str | None = None
    indicadores: dict | None = None


# ---------------------------------------------------------------------------
# Consent
# ---------------------------------------------------------------------------

class ConsentCreate(BaseModel):
    versao_termos: str = "1.0"


class ConsentResponse(BaseModel):
    id: int
    versao_termos: str
    aceito_em: datetime

    model_config = {"from_attributes": True}
