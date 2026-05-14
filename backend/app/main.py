from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings
from app.api.endpoints import auth

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title=settings.PROJECT_NAME)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 18. Regras de CORS Rigorosas
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", # Dev Front-end
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Registra endpoints
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])

@app.get("/")
@limiter.limit("5/minute")
def health_check(request):
    """
    Health check simples com Rate Limit severo, 
    sem expor dados sensíveis.
    """
    return {"status": "healthy"}
