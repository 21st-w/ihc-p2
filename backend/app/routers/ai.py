"""Router da camada de IA local: Ollama, RAG e guardrails."""

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.agents import freud
from app.config import AI_ENABLED, OLLAMA_CHAT_MODEL, OLLAMA_EMBED_MODEL
from app.database import get_db
from app.models import FinancialProfile, Node, User
from app.schemas import AIChatRequest, AIChatResponse, AIReindexResponse
from app.services.llm_service import is_ollama_available, safe_generate_text
from app.services.prompt_service import load_prompt
from app.services.rag_service import answer_with_rag, build_financial_context, retrieve_context
from app.services.safety_service import (
    DISCLAIMER,
    build_restricted_investment_response,
    detect_investment_recommendation_request,
    sanitize_ai_response,
)
from app.services.vector_store_service import index_node, reindex_user_nodes


router = APIRouter(prefix="/ai", tags=["IA Financeira"])


@router.get("/status")
def ai_status():
    ollama_available = is_ollama_available()
    return {
        "ai_enabled": AI_ENABLED,
        "ollama_available": ollama_available,
        "chat_model": OLLAMA_CHAT_MODEL,
        "embed_model": OLLAMA_EMBED_MODEL,
        "message": (
            "IA local disponível."
            if AI_ENABLED and ollama_available
            else "IA local indisponível, fallback determinístico ativo."
        ),
    }


@router.post("/chat/{user_id}", response_model=AIChatResponse)
def ai_chat(user_id: int, request: AIChatRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    if detect_investment_recommendation_request(request.question):
        return AIChatResponse(
            success=True,
            answer=build_restricted_investment_response(),
            sources=[],
            confidence="alta",
            fallback_used=False,
            educational_disclaimer=DISCLAIMER,
        )

    try:
        result = answer_with_rag(db, user_id, request.question)
        return AIChatResponse(
            success=result["success"],
            answer=result["answer"],
            sources=result["sources"],
            confidence=result["confidence"],
            fallback_used=result["fallback_used"],
            educational_disclaimer=result["educational_disclaimer"],
        )
    except Exception:
        context = build_financial_context(db, user_id)
        profile = context.get("profile") or {}
        income = float(profile.get("monthly_income") or 0)
        total = sum(float(profile.get(key) or 0) for key in [
            "fixed_expenses", "variable_expenses", "subscriptions", "debts"
        ])
        balance = income - total
        answer = (
            f"A IA está indisponível no momento. Pelos dados cadastrados, sua renda é R$ {income:,.2f}, "
            f"seus gastos totais são R$ {total:,.2f} e o saldo estimado é R$ {balance:,.2f}. "
            "Esta é uma leitura local simplificada para apoiar organização e revisão de orçamento.\n\n"
            f"{DISCLAIMER}"
        )
        return AIChatResponse(
            success=True,
            answer=answer,
            sources=[],
            confidence="baixa",
            fallback_used=True,
            educational_disclaimer=DISCLAIMER,
        )


@router.post("/index-node/{node_id}", response_model=AIReindexResponse)
def ai_index_node(node_id: int, db: Session = Depends(get_db)):
    node = db.query(Node).filter(Node.id == node_id).first()
    if not node:
        raise HTTPException(status_code=404, detail="Nodo não encontrado.")
    indexed = index_node(db, node.user_id, node)
    return AIReindexResponse(
        success=True,
        indexed_chunks=indexed,
        message=f"Nodo {node_id} indexado com {indexed} chunk(s).",
    )


@router.post("/reindex/{user_id}", response_model=AIReindexResponse)
def ai_reindex_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    indexed = reindex_user_nodes(db, user_id)
    return AIReindexResponse(
        success=True,
        indexed_chunks=indexed,
        message=f"Reindexação concluída com {indexed} chunk(s).",
    )


@router.post("/freud/analyze/{user_id}")
def ai_freud_analyze(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil financeiro não encontrado.")

    deterministic = freud.analisar(
        monthly_income=profile.monthly_income,
        fixed_expenses=profile.fixed_expenses,
        variable_expenses=profile.variable_expenses,
        subscriptions=profile.subscriptions,
        debts=profile.debts,
        financial_goal=profile.financial_goal,
        desired_monthly_saving=profile.desired_monthly_saving,
        risk_tolerance=profile.risk_tolerance,
    )
    retrieved = retrieve_context(db, user_id, "diagnóstico financeiro do usuário")
    prompt = (
        f"{load_prompt('freud')}\n\n"
        "Dados determinísticos do Freud:\n"
        f"{json.dumps(deterministic, ensure_ascii=False, indent=2)}\n\n"
        "Contexto recuperado dos nodos:\n"
        f"{json.dumps(retrieved['retrieved_chunks'], ensure_ascii=False, indent=2)}\n"
    )
    fallback = deterministic.get("resumo", "") + "\n\n" + deterministic.get("aviso", DISCLAIMER)
    result = safe_generate_text(prompt, fallback=fallback)
    return {
        "success": True,
        "user_id": user_id,
        "deterministic_analysis": deterministic,
        "llm_analysis": sanitize_ai_response(result["response"]),
        "sources": [
            {
                "title": chunk["source_title"],
                "path": chunk["source_path"],
                "type": chunk["source_type"],
                "score": chunk["score"],
            }
            for chunk in retrieved["retrieved_chunks"]
        ],
        "fallback_used": result["fallback_used"],
        "educational_disclaimer": DISCLAIMER,
    }
