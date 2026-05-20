"""FinBrain — SQLAlchemy ORM models."""

from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------

class User(Base):
    """Registered user."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    nome: Mapped[str] = mapped_column(String(255), nullable=False)
    senha_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="user")
    income_sources: Mapped[list["IncomeSource"]] = relationship(back_populates="user")
    debts: Mapped[list["Debt"]] = relationship(back_populates="user")
    simulations: Mapped[list["Simulation"]] = relationship(back_populates="user")
    agent_logs: Mapped[list["AgentLog"]] = relationship(back_populates="user")
    consents: Mapped[list["Consent"]] = relationship(back_populates="user")


# ---------------------------------------------------------------------------
# Financial entities
# ---------------------------------------------------------------------------

class Transaction(Base):
    """A single financial transaction (credit or debit)."""

    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    data: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    descricao: Mapped[str] = mapped_column(String(500), nullable=False)
    valor: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    tipo: Mapped[str] = mapped_column(
        Enum("credito", "debito", name="tipo_transacao"), nullable=False
    )
    categoria: Mapped[str] = mapped_column(String(100), nullable=True)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship(back_populates="transactions")


class IncomeSource(Base):
    """Recurring income source."""

    __tablename__ = "income_sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    nome: Mapped[str] = mapped_column(String(255), nullable=False)
    valor_mensal: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    tipo: Mapped[str] = mapped_column(String(100), default="salario")
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship(back_populates="income_sources")


class Debt(Base):
    """Outstanding debt."""

    __tablename__ = "debts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    nome: Mapped[str] = mapped_column(String(255), nullable=False)
    saldo: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    taxa_mensal: Mapped[Decimal] = mapped_column(Numeric(8, 4), nullable=False)
    parcela: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=True)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship(back_populates="debts")


# ---------------------------------------------------------------------------
# Simulations & Agent logs
# ---------------------------------------------------------------------------

class Simulation(Base):
    """Saved simulation result (Sherlock diagnostics, Benjamin simulations)."""

    __tablename__ = "simulations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    tipo: Mapped[str] = mapped_column(String(100), nullable=False)
    inputs_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    outputs_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship(back_populates="simulations")


class AgentLog(Base):
    """Immutable log of every agent interaction for audit."""

    __tablename__ = "agent_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    agente: Mapped[str] = mapped_column(String(50), nullable=False)
    input_text: Mapped[str] = mapped_column(Text, nullable=False)
    output_text: Mapped[str] = mapped_column(Text, nullable=False)
    guardrail_ok: Mapped[bool] = mapped_column(Boolean, default=True)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship(back_populates="agent_logs")


# ---------------------------------------------------------------------------
# Consent (LGPD)
# ---------------------------------------------------------------------------

class Consent(Base):
    """Record of user consent for terms of use (LGPD compliance)."""

    __tablename__ = "consents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    versao_termos: Mapped[str] = mapped_column(String(50), nullable=False)
    aceito_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    ip_address: Mapped[str] = mapped_column(String(45), nullable=True)

    user: Mapped["User"] = relationship(back_populates="consents")
