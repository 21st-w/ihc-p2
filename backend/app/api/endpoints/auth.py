from fastapi import APIRouter, Request, HTTPException, status
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(request: Request, data: LoginRequest):
    # TODO: Implementar integração com banco e bcrypt real.
    # Exemplo: erro genérico obrigatório conforme as regras
    if data.email != "test@test.com" or data.password != "12345":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas" # Nunca revelar se o e-mail existe
        )
    
    return {"access_token": "mocked_token_for_now", "token_type": "bearer"}
