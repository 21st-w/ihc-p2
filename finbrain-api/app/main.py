"""FinBrain API — Main FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.transacoes import router as transacoes_router
from app.api.financeiro import router as financeiro_router
from app.api.agentes import router as agentes_router

app = FastAPI(
    title="FinBrain API",
    description="Laboratório financeiro pessoal com IA — backend.",
    version="0.1.0",
)

# CORS
origins = [o.strip() for o in settings.cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(transacoes_router)
app.include_router(financeiro_router)
app.include_router(agentes_router)


@app.get("/health", tags=["infra"])
def health():
    """Healthcheck endpoint."""
    from sqlalchemy import text
    from app.core.database import SessionLocal

    status_db = "ok"
    try:
        with SessionLocal() as session:
            session.execute(text("SELECT 1"))
    except Exception:
        status_db = "error"

    status_redis = "ok"
    try:
        import redis

        r = redis.from_url(settings.redis_url)
        r.ping()
    except Exception:
        status_redis = "error"

    return {
        "status": "ok" if status_db == "ok" else "degraded",
        "db": status_db,
        "redis": status_redis,
        "version": "0.1.0",
    }
