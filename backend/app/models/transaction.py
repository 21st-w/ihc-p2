import uuid
from sqlalchemy import Column, String, Numeric, Date, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from .base import Base

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    category = Column(String(80), nullable=False)
    description = Column(String(255))
    date = Column(Date, nullable=False)
    type = Column(String(20), nullable=False)
    
    # Índice obrigatório anti-BOLA e performance
    __table_args__ = (
        Index('idx_transactions_user_date', 'user_id', 'date'),
    )
