from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal
from datetime import date
from enum import Enum
import uuid

class TransactionType(str, Enum):
    fixed = "fixed"
    variable = "variable"
    subscription = "subscription"

class TransactionCreate(BaseModel):
    # Rejeita campos desconhecidos (ex: se o front enviar 'user_id' ou 'is_admin' maliciosamente)
    model_config = ConfigDict(extra='forbid')
    
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2, description="Valor positivo maior que zero")
    category: str = Field(min_length=1, max_length=80)
    description: str | None = Field(default=None, max_length=255)
    date: date
    type: TransactionType

class TransactionResponse(TransactionCreate):
    id: uuid.UUID
    user_id: uuid.UUID
    
    model_config = ConfigDict(from_attributes=True)
