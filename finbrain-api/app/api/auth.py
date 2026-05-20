"""FinBrain — Auth API routes."""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    get_current_user_id,
    hash_password,
    verify_password,
)
from app.models.models import Consent, User
from app.schemas.schemas import (
    ConsentCreate,
    ConsentResponse,
    LoginRequest,
    SignupRequest,
    TokenResponse,
    UserResponse,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    """Register a new user."""
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    user = User(
        nome=body.nome,
        email=body.email,
        senha_hash=hash_password(body.senha),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate and return a JWT token."""
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.senha, user.senha_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
def get_me(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Return the authenticated user's profile."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@router.post("/consent", response_model=ConsentResponse, status_code=status.HTTP_201_CREATED)
def register_consent(
    body: ConsentCreate,
    request: Request,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Record user consent for terms of use (LGPD compliance)."""
    consent = Consent(
        user_id=user_id,
        versao_termos=body.versao_termos,
        ip_address=request.client.host if request.client else None,
    )
    db.add(consent)
    db.commit()
    db.refresh(consent)
    return consent
