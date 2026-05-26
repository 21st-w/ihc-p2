"""Tio Patinhas — Conexão com o banco de dados (SQLite)."""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.config import DATABASE_URL

# SQLite precisa de check_same_thread=False para FastAPI
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Classe base para todos os modelos SQLAlchemy."""
    pass


def get_db():
    """Dependency do FastAPI — gera sessão do banco."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Cria todas as tabelas no banco (usado na inicialização)."""
    Base.metadata.create_all(bind=engine)
