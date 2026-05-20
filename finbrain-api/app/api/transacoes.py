"""Tio Patinhas — Transaction API routes."""

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.models import Transaction
from app.schemas.schemas import TransactionCreate, TransactionResponse

router = APIRouter(prefix="/api/transacoes", tags=["transações"])


@router.get("/", response_model=list[TransactionResponse])
def list_transactions(
    dias: int = Query(default=90, ge=1, le=365),
    categoria: str | None = None,
    tipo: str | None = None,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """List user transactions with optional filters."""
    since = datetime.now(timezone.utc) - timedelta(days=dias)
    q = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.data >= since,
    )
    if categoria:
        q = q.filter(Transaction.categoria == categoria)
    if tipo:
        q = q.filter(Transaction.tipo == tipo)
    return q.order_by(Transaction.data.desc()).all()


@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    body: TransactionCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Create a new transaction."""
    tx = Transaction(
        user_id=user_id,
        data=body.data,
        descricao=body.descricao,
        valor=body.valor,
        tipo=body.tipo,
        categoria=body.categoria,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


@router.delete("/{tx_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    tx_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Delete a transaction."""
    tx = db.query(Transaction).filter(
        Transaction.id == tx_id, Transaction.user_id == user_id
    ).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    db.delete(tx)
    db.commit()
