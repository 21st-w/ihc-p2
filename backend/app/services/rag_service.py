"""RAG educacional sobre dados estruturados e nodos do usuário."""

import json
from typing import Any

from sqlalchemy.orm import Session

from app.config import RAG_TOP_K
from app.models import Analysis, FinancialProfile, Simulation, User
from app.services.llm_service import safe_generate_text
from app.services.prompt_service import load_prompt, render_prompt
from app.services.safety_service import DISCLAIMER, sanitize_ai_response, validate_ai_answer
from app.services.vector_store_service import search_similar_chunks


def _parse_json(raw: str | None) -> Any:
    if not raw:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return raw


def build_financial_context(db: Session, user_id: int) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    analysis = (
        db.query(Analysis)
        .filter(Analysis.user_id == user_id)
        .order_by(Analysis.created_at.desc())
        .first()
    )
    simulation = (
        db.query(Simulation)
        .filter(Simulation.user_id == user_id)
        .order_by(Simulation.created_at.desc())
        .first()
    )

    return {
        "user": {"id": user.id, "name": user.name, "email": user.email} if user else None,
        "profile": {
            "monthly_income": profile.monthly_income,
            "fixed_expenses": profile.fixed_expenses,
            "variable_expenses": profile.variable_expenses,
            "subscriptions": profile.subscriptions,
            "debts": profile.debts,
            "financial_goal": profile.financial_goal,
            "desired_monthly_saving": profile.desired_monthly_saving,
            "risk_tolerance": profile.risk_tolerance,
        } if profile else None,
        "latest_analysis": _parse_json(analysis.content) if analysis else None,
        "latest_simulation": _parse_json(simulation.content) if simulation else None,
    }


def retrieve_context(db: Session, user_id: int, question: str) -> dict:
    chunks = search_similar_chunks(db, user_id, question, top_k=RAG_TOP_K)
    confidence = "baixa"
    if chunks and chunks[0]["score"] >= 0.75:
        confidence = "alta"
    elif chunks:
        confidence = "média"
    return {
        "query": question,
        "retrieved_chunks": chunks,
        "confidence": confidence,
    }


def build_rag_prompt(question: str, financial_context: dict, retrieved_chunks: list[dict]) -> str:
    template = load_prompt("rag_answer")
    sources = [
        {
            "title": chunk["source_title"],
            "path": chunk["source_path"],
            "type": chunk["source_type"],
            "score": chunk["score"],
            "content": chunk["content"],
        }
        for chunk in retrieved_chunks
    ]
    context = (
        f"{template}\n\n"
        "Pergunta do usuário:\n{{question}}\n\n"
        "Contexto financeiro estruturado:\n{{financial_context}}\n\n"
        "Nodos recuperados:\n{{retrieved_chunks}}\n"
    )
    return render_prompt(context, {
        "question": question,
        "financial_context": json.dumps(financial_context, ensure_ascii=False, indent=2),
        "retrieved_chunks": json.dumps(sources, ensure_ascii=False, indent=2),
    })


def _build_structured_fallback(question: str, financial_context: dict) -> str:
    profile = financial_context.get("profile") or {}
    income = float(profile.get("monthly_income") or 0)
    fixed = float(profile.get("fixed_expenses") or 0)
    variable = float(profile.get("variable_expenses") or 0)
    subscriptions = float(profile.get("subscriptions") or 0)
    debts = float(profile.get("debts") or 0)
    total = fixed + variable + subscriptions + debts
    balance = income - total
    return (
        "## Resposta\n"
        f"Não consegui acionar a IA local agora. Com base nos dados estruturados, a renda mensal é R$ {income:,.2f}, "
        f"os gastos totais são R$ {total:,.2f} e o saldo estimado é R$ {balance:,.2f}. "
        "Use isso como leitura inicial para revisar gastos recorrentes, dívidas e meta de reserva.\n\n"
        "## Base usada\n"
        "- Dados financeiros: perfil cadastrado no backend.\n"
        "- Nodos recuperados: indisponíveis no fallback.\n\n"
        "## Próxima ação educacional\n"
        "Revise as maiores categorias de gasto e rode novamente a análise completa para atualizar os nodos.\n\n"
        "## Confiança\n"
        "baixa\n\n"
        "## Aviso educacional\n"
        f"{DISCLAIMER}"
    )


def answer_with_rag(db: Session, user_id: int, question: str) -> dict:
    financial_context = build_financial_context(db, user_id)
    retrieved = retrieve_context(db, user_id, question)
    chunks = retrieved["retrieved_chunks"]
    prompt = build_rag_prompt(question, financial_context, chunks)
    fallback = _build_structured_fallback(question, financial_context)
    result = safe_generate_text(prompt, fallback=fallback)
    answer = sanitize_ai_response(result.get("response") or fallback)
    validation = validate_ai_answer(answer)
    if not validation["safe"]:
        answer = validation["sanitized"]

    return {
        "success": True,
        "user_id": user_id,
        "question": question,
        "answer": answer,
        "sources": [
            {
                "title": chunk["source_title"],
                "path": chunk["source_path"],
                "type": chunk["source_type"],
                "score": chunk["score"],
            }
            for chunk in chunks
        ],
        "confidence": retrieved["confidence"] if chunks else "baixa",
        "fallback_used": bool(result.get("fallback_used")),
        "educational_disclaimer": DISCLAIMER,
    }
