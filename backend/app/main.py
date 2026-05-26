"""Tio Patinhas — API Principal (FastAPI).

Assistente Financeiro Educacional com IA e Second Brain.
Este sistema NÃO recomenda compra ou venda de ativos.
Todas as análises possuem finalidade exclusivamente educacional.
"""

import json
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import CORS_ORIGINS
from app.database import get_db, create_tables
from app.models import User, FinancialProfile
from app.schemas import FullAnalysisResponse, UserResponse, FinancialProfileResponse, NodeResponse
from app.agents import freud, moriarty, athena
from app.services.obsidian_service import salvar_nodo_obsidian, inicializar_vault
from app.routers import users, finances, analyses, simulations, nodes, market_data, ai

# ── App ──────────────────────────────────────────────────

app = FastAPI(
    title="Tio Patinhas API",
    description=(
        "Assistente Financeiro Educacional com IA e Second Brain. "
        "Este sistema não recomenda compra ou venda de ativos. "
        "Todas as análises possuem finalidade exclusivamente educacional."
    ),
    version="1.0.0-mvp",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Startup ──────────────────────────────────────────────

@app.on_event("startup")
def startup():
    """Cria tabelas e inicializa Obsidian Vault na inicialização."""
    create_tables()
    inicializar_vault()


# ── Routers ──────────────────────────────────────────────

app.include_router(users.router)
app.include_router(finances.router)
app.include_router(analyses.router)
app.include_router(simulations.router)
app.include_router(nodes.router)
app.include_router(market_data.router)
app.include_router(ai.router)


# ── Root ─────────────────────────────────────────────────

@app.get("/", tags=["Status"])
def root():
    """Status da API."""
    return {
        "projeto": "Tio Patinhas",
        "versao": "1.0.0-mvp",
        "status": "online",
        "descricao": "Assistente Financeiro Educacional com IA e Second Brain",
        "agentes": {
            "freud": "✅ Ativo — Análise de perfil financeiro",
            "moriarty": "✅ Ativo — Simulações financeiras",
            "athena": "✅ Ativo — Organização do Second Brain",
            "sherlock": "⏸️ Standby — Inteligência de mercado (futuro)",
        },
        "aviso": (
            "Este sistema possui finalidade exclusivamente educacional. "
            "Não é recomendação de investimento."
        ),
        "ia": {
            "status": "preparada",
            "llm": "Ollama",
            "rag": "SQLite embeddings",
            "aviso": "Camada de IA educacional, sem recomendação de investimentos.",
        },
    }


# ── Fluxo Completo ───────────────────────────────────────

@app.post("/run-full-analysis/{user_id}", tags=["Fluxo Completo"])
def executar_analise_completa(user_id: int, db: Session = Depends(get_db)):
    """Executa o fluxo completo do MVP:

    1. Lê perfil financeiro do usuário
    2. Freud gera diagnóstico educacional
    3. Moriarty gera simulações financeiras
    4. Athena cria nodos para o Second Brain
    5. Salva tudo no banco e no Obsidian Vault

    Este é o endpoint principal para demonstração do MVP.
    """
    # 1. Buscar usuário e perfil
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    perfil = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil financeiro não encontrado. Cadastre seus dados primeiro.")

    # 2. Freud — Análise
    analise = freud.analisar(
        monthly_income=perfil.monthly_income,
        fixed_expenses=perfil.fixed_expenses,
        variable_expenses=perfil.variable_expenses,
        subscriptions=perfil.subscriptions,
        debts=perfil.debts,
        financial_goal=perfil.financial_goal,
        desired_monthly_saving=perfil.desired_monthly_saving,
        risk_tolerance=perfil.risk_tolerance,
    )

    # 3. Moriarty — Simulações
    simulacoes = moriarty.gerar_simulacoes_completas(
        monthly_income=perfil.monthly_income,
        fixed_expenses=perfil.fixed_expenses,
        variable_expenses=perfil.variable_expenses,
        subscriptions=perfil.subscriptions,
        debts=perfil.debts,
        desired_monthly_saving=perfil.desired_monthly_saving,
    )

    # 4. Athena — Nodos
    nodos_data = athena.gerar_todos_nodos(user.name, analise, simulacoes)

    # 5. Salvar tudo
    from app.models import Analysis, Simulation, Node

    # Salvar análise
    analise_db = Analysis(
        user_id=user_id,
        agent="freud",
        analysis_type="diagnostico",
        content=json.dumps(analise, ensure_ascii=False),
    )
    db.add(analise_db)

    # Salvar simulação
    reserva = simulacoes.get("reserva_emergencia", {})
    juros = simulacoes.get("juros_compostos", {})
    dividas = simulacoes.get("impacto_dividas", {})

    sim_db = Simulation(
        user_id=user_id,
        emergency_reserve_target=reserva.get("valor_alvo", 0),
        monthly_saving=reserva.get("aporte_mensal", 0),
        months_to_goal=reserva.get("meses_para_atingir") or 0,
        compound_interest_projection=json.dumps(juros, ensure_ascii=False),
        debt_impact=json.dumps(dividas, ensure_ascii=False),
        content=json.dumps(simulacoes, ensure_ascii=False),
    )
    db.add(sim_db)

    # Salvar nodos
    obsidian_files = []
    nodes_criados = []
    for nodo_data in nodos_data:
        file_path = salvar_nodo_obsidian(user_id, nodo_data)
        obsidian_files.append(file_path)

        node = Node(
            user_id=user_id,
            agent=nodo_data["agent"],
            title=nodo_data["title"],
            type=nodo_data["type"],
            content=nodo_data["content"],
            file_path=file_path,
            tags=nodo_data["tags"],
        )
        db.add(node)
        nodes_criados.append(node)

    db.commit()

    ai_indexing = {
        "attempted": True,
        "indexed_chunks": 0,
        "error": None,
    }
    try:
        from app.services.vector_store_service import index_node

        for node in nodes_criados:
            db.refresh(node)
            ai_indexing["indexed_chunks"] += index_node(db, user_id, node)
    except Exception as exc:
        ai_indexing["error"] = str(exc)

    return {
        "status": "sucesso",
        "mensagem": "Análise completa executada com sucesso!",
        "usuario": {"id": user.id, "name": user.name, "email": user.email},
        "analise_freud": analise,
        "simulacoes_moriarty": simulacoes,
        "nodos_athena": [{"title": n["title"], "type": n["type"], "agent": n["agent"]} for n in nodos_data],
        "obsidian_files": obsidian_files,
        "ai_indexing": ai_indexing,
        "aviso": (
            "⚠️ Todas as análises possuem finalidade exclusivamente educacional. "
            "Não representam recomendação de investimento."
        ),
    }
