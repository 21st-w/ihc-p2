from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.api.schemas.transaction import TransactionCreate, TransactionResponse
from app.models.transaction import Transaction

router = APIRouter()

@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user),
):
    """
    Cria uma transação vinculada ao usuário autenticado.
    O user_id NUNCA vem do request body (Mass Assignment Prevention).
    """
    transaction = Transaction(
        user_id=current_user_id,
        amount=data.amount,
        category=data.category,
        description=data.description,
        date=data.date,
        type=data.type.value,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.get("/", response_model=list[TransactionResponse])
def list_transactions(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user),
    limit: int = 50,
    offset: int = 0,
):
    """
    Lista transações APENAS do usuário autenticado.
    Filtragem obrigatória por user_id (anti-BOLA).
    """
    return (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user_id)
        .order_by(Transaction.date.desc())
        .limit(min(limit, 100))
        .offset(offset)
        .all()
    )


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: str,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user),
):
    """
    Busca transação por ID, SEMPRE validando posse pelo user_id.
    Previne BOLA: usuário A não acessa transação do usuário B.
    """
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user_id,
        )
        .first()
    )
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TRANSACTION_NOT_FOUND",
        )
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: str,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user),
):
    """
    Soft-delete seguro: só apaga se o recurso pertence ao usuário.
    """
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user_id,
        )
        .first()
    )
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TRANSACTION_NOT_FOUND",
        )
    db.delete(transaction)
    db.commit()
