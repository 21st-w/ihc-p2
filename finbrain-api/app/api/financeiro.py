"""FinBrain — Income Sources and Debts API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.models import Debt, IncomeSource
from app.schemas.schemas import (
    DebtCreate,
    DebtResponse,
    IncomeSourceCreate,
    IncomeSourceResponse,
)

router = APIRouter(prefix="/api/financeiro", tags=["financeiro"])


# ---------------------------------------------------------------------------
# Income sources
# ---------------------------------------------------------------------------

@router.get("/renda", response_model=list[IncomeSourceResponse])
def list_income(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """List user income sources."""
    return db.query(IncomeSource).filter(IncomeSource.user_id == user_id).all()


@router.post("/renda", response_model=IncomeSourceResponse, status_code=status.HTTP_201_CREATED)
def create_income(
    body: IncomeSourceCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Add an income source."""
    src = IncomeSource(
        user_id=user_id,
        nome=body.nome,
        valor_mensal=body.valor_mensal,
        tipo=body.tipo,
    )
    db.add(src)
    db.commit()
    db.refresh(src)
    return src


@router.delete("/renda/{src_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_income(
    src_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Delete an income source."""
    src = db.query(IncomeSource).filter(
        IncomeSource.id == src_id, IncomeSource.user_id == user_id
    ).first()
    if not src:
        raise HTTPException(status_code=404, detail="Fonte de renda não encontrada")
    db.delete(src)
    db.commit()


# ---------------------------------------------------------------------------
# Debts
# ---------------------------------------------------------------------------

@router.get("/dividas", response_model=list[DebtResponse])
def list_debts(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """List user debts."""
    return db.query(Debt).filter(Debt.user_id == user_id).all()


@router.post("/dividas", response_model=DebtResponse, status_code=status.HTTP_201_CREATED)
def create_debt(
    body: DebtCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Add a debt."""
    debt = Debt(
        user_id=user_id,
        nome=body.nome,
        saldo=body.saldo,
        taxa_mensal=body.taxa_mensal,
        parcela=body.parcela,
    )
    db.add(debt)
    db.commit()
    db.refresh(debt)
    return debt


@router.delete("/dividas/{debt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_debt(
    debt_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Delete a debt."""
    debt = db.query(Debt).filter(
        Debt.id == debt_id, Debt.user_id == user_id
    ).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Dívida não encontrada")
    db.delete(debt)
    db.commit()
