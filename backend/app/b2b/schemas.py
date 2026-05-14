"""
Schemas Pydantic para o módulo Enterprise (B2B).
Regra 14: Zero-Data Retention — nunca aceitar prompt/resposta nos schemas.
"""
from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal
from datetime import datetime
from uuid import UUID
from enum import Enum

class EventStatus(str, Enum):
    success = "success"
    error = "error"
    timeout = "timeout"

class ApiUsageEventCreate(BaseModel):
    """
    Schema de entrada para eventos de uso de IA.
    Campos de prompt/resposta/raw_request são PROIBIDOS.
    """
    model_config = ConfigDict(extra='forbid')
    
    project_id: UUID | None = None
    agent_name: str | None = Field(default=None, max_length=100)
    provider: str = Field(max_length=50)
    model: str = Field(max_length=100)
    prompt_tokens: int = Field(ge=0)
    completion_tokens: int = Field(ge=0)
    total_tokens: int = Field(ge=0)
    input_cost_usd: Decimal = Field(ge=0, max_digits=12, decimal_places=8)
    output_cost_usd: Decimal = Field(ge=0, max_digits=12, decimal_places=8)
    total_cost_usd: Decimal = Field(ge=0, max_digits=12, decimal_places=8)
    latency_ms: int | None = Field(default=None, ge=0)
    status: EventStatus

class ApiUsageEventResponse(ApiUsageEventCreate):
    id: UUID
    organization_id: UUID
    user_id: UUID | None = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
