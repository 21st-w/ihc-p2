import uuid
from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, Index, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base

class ApiUsageEvent(Base):
    __tablename__ = "api_usage_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    project_id = Column(UUID(as_uuid=True), index=True)
    user_id = Column(UUID(as_uuid=True))
    
    agent_name = Column(String)
    provider = Column(String, nullable=False)
    model = Column(String, nullable=False)
    
    prompt_tokens = Column(Integer, nullable=False)
    completion_tokens = Column(Integer, nullable=False)
    total_tokens = Column(Integer, nullable=False)
    
    input_cost_usd = Column(Numeric(12, 8))
    output_cost_usd = Column(Numeric(12, 8))
    total_cost_usd = Column(Numeric(12, 8))
    
    latency_ms = Column(Integer)
    status = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Índices obrigatórios para B2B e relatórios
    __table_args__ = (
        Index('idx_api_usage_org_created', 'organization_id', 'created_at'),
        Index('idx_api_usage_project_created', 'project_id', 'created_at'),
    )
