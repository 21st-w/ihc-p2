"""FinBrain — API routes for agents (Sherlock, Benjamin, Yuyu) and unified chat."""

import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.agents import sherlock, benjamin
from app.agents.yuyu import get_indicadores_sync, get_indicadores_mock
from app.guardrails.athena import validar
from app.models.models import AgentLog, Simulation
from app.schemas.schemas import ChatRequest, ChatResponse, SimulationResponse

router = APIRouter(prefix="/api", tags=["agentes"])


# ---------------------------------------------------------------------------
# Yuyu — Market indicators
# ---------------------------------------------------------------------------

@router.get("/mercado/indicadores")
def market_indicators():
    """Return latest market indicators (Selic, IPCA, USD/BRL)."""
    try:
        snapshot = get_indicadores_sync()
    except Exception:
        snapshot = get_indicadores_mock()
    return {
        "selic": snapshot.selic,
        "ipca_12m": snapshot.ipca_12m,
        "dolar": snapshot.dolar,
        "atualizado_em": snapshot.atualizado_em,
        "fonte": "Banco Central do Brasil (SGS)",
    }


# ---------------------------------------------------------------------------
# Sherlock — Profile diagnosis
# ---------------------------------------------------------------------------

@router.post("/agentes/sherlock/analisar")
def sherlock_analyze(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Run Sherlock financial profile analysis."""
    client = _get_anthropic_client()
    result = sherlock.analisar(db, user_id, anthropic_client=client)
    return result


# ---------------------------------------------------------------------------
# Benjamin — Simulations
# ---------------------------------------------------------------------------

@router.post("/agentes/benjamin/simular")
def benjamin_simulate(
    tipo: str,
    params: dict,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Run a Benjamin financial simulation."""
    client = _get_anthropic_client()
    result = benjamin.simular(tipo, params, anthropic_client=client)

    if "erro" not in result:
        sim = Simulation(
            user_id=user_id,
            tipo=f"simulacao_{tipo}",
            inputs_json=params,
            outputs_json=result,
        )
        db.add(sim)
        db.commit()

    return result


# ---------------------------------------------------------------------------
# Unified chat
# ---------------------------------------------------------------------------

PLANNER_PROMPT = """Classifique a intenção do usuário em UMA das categorias:
- diagnostico: o usuário quer análise do seu perfil financeiro
- simulacao_juros: quer simular juros compostos ou rendimento
- simulacao_reserva: quer calcular reserva de emergência
- simulacao_comparar: quer comparar rentabilidade entre modalidades
- pergunta_educacional: pergunta sobre conceito financeiro
- fora_do_escopo: não é sobre finanças

Responda APENAS com JSON válido: {"intencao": "...", "params": {...}}

Exemplos de params:
- simulacao_juros: {"valor_inicial": 1000, "aporte_mensal": 500, "taxa_mensal": 0.01, "meses": 12}
- simulacao_reserva: {"gastos_essenciais": 3000, "meses_cobertura": 6, "aporte_mensal": 500}
- simulacao_comparar: {"valor_inicial": 1000, "aporte_mensal": 500, "meses": 12}

Extraia parâmetros numéricos da mensagem quando possível."""


@router.post("/chat", response_model=ChatResponse)
def chat(
    body: ChatRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Unified chat endpoint — routes to the appropriate agent."""
    client = _get_anthropic_client()
    mensagem = body.mensagem

    # Step 1: Classify intent
    intent = _classify_intent(mensagem, client)
    intencao = intent.get("intencao", "pergunta_educacional")
    params = intent.get("params", {})

    # Step 2: Route to agent
    agente = "sistema"
    skill_chamada = None
    resposta = ""

    if intencao == "diagnostico":
        agente = "sherlock"
        result = sherlock.analisar(db, user_id, anthropic_client=client)
        resposta = result.get("narrativa", "Não foi possível gerar diagnóstico.")
        skill_chamada = "diagnostico_gastos + score_saude"

    elif intencao.startswith("simulacao_"):
        agente = "benjamin"
        tipo_map = {
            "simulacao_juros": "juros_compostos",
            "simulacao_reserva": "reserva_emergencia",
            "simulacao_comparar": "comparar_rentabilidade",
        }
        tipo = tipo_map.get(intencao, "juros_compostos")
        result = benjamin.simular(tipo, params, anthropic_client=client)
        resposta = result.get("explicacao", "Simulação concluída.")
        skill_chamada = tipo

        if "erro" not in result:
            sim = Simulation(
                user_id=user_id, tipo=f"chat_{tipo}",
                inputs_json=params, outputs_json=result,
            )
            db.add(sim)

    elif intencao == "pergunta_educacional":
        agente = "educacional"
        resposta = _answer_educational(mensagem, client)

    else:
        agente = "sistema"
        resposta = (
            "Desculpe, só posso ajudar com questões financeiras educacionais. "
            "Tente perguntar sobre reserva de emergência, juros compostos ou "
            "conceitos de investimento!"
        )

    # Step 3: Guardrails
    athena = validar(resposta)

    # Step 4: Get indicators
    try:
        indicators = get_indicadores_sync()
        indicadores = {"selic": indicators.selic, "ipca_12m": indicators.ipca_12m, "dolar": indicators.dolar}
    except Exception:
        indicadores = None

    # Step 5: Log
    log = AgentLog(
        user_id=user_id,
        agente=agente,
        input_text=mensagem,
        output_text=athena.texto_final,
        guardrail_ok=athena.ok,
    )
    db.add(log)
    db.commit()

    return ChatResponse(
        resposta=athena.texto_final,
        agente_usado=agente,
        skill_chamada=skill_chamada,
        indicadores=indicadores,
    )


# ---------------------------------------------------------------------------
# Simulations history
# ---------------------------------------------------------------------------

@router.get("/simulacoes", response_model=list[SimulationResponse])
def list_simulations(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """List saved simulations for the user."""
    return db.query(Simulation).filter(
        Simulation.user_id == user_id
    ).order_by(Simulation.criado_em.desc()).limit(50).all()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_anthropic_client():
    """Get Anthropic client if API key is configured."""
    if settings.anthropic_api_key and settings.anthropic_api_key != "sk-ant-...":
        try:
            import anthropic
            return anthropic.Anthropic(api_key=settings.anthropic_api_key)
        except Exception:
            return None
    return None


def _classify_intent(message: str, client) -> dict:
    """Use LLM to classify user intent, or fallback to keyword matching."""
    if client:
        try:
            response = client.messages.create(
                model="claude-haiku-4-20250514",
                max_tokens=200,
                system=PLANNER_PROMPT,
                messages=[{"role": "user", "content": message}],
            )
            text = response.content[0].text.strip()
            # Extract JSON from response
            if "{" in text:
                json_str = text[text.index("{"):text.rindex("}") + 1]
                return json.loads(json_str)
        except Exception:
            pass

    # Fallback: keyword matching
    msg_lower = message.lower()
    if any(w in msg_lower for w in ["diagnóstico", "diagnostico", "situação", "perfil", "saúde financeira"]):
        return {"intencao": "diagnostico", "params": {}}
    if any(w in msg_lower for w in ["juros compostos", "rendimento", "render", "investir r$", "por mês"]):
        return {"intencao": "simulacao_juros", "params": _extract_numbers(message)}
    if any(w in msg_lower for w in ["reserva", "emergência", "emergencia"]):
        return {"intencao": "simulacao_reserva", "params": _extract_numbers(message)}
    if any(w in msg_lower for w in ["comparar", "poupança", "cdb", "tesouro"]):
        return {"intencao": "simulacao_comparar", "params": _extract_numbers(message)}
    if any(w in msg_lower for w in ["como funciona", "o que é", "explique", "diferença"]):
        return {"intencao": "pergunta_educacional", "params": {}}
    return {"intencao": "pergunta_educacional", "params": {}}


def _extract_numbers(text: str) -> dict:
    """Simple number extraction from text."""
    import re
    numbers = re.findall(r"[\d.,]+", text.replace(".", "").replace(",", "."))
    nums = []
    for n in numbers:
        try:
            nums.append(float(n))
        except ValueError:
            pass
    params = {}
    if nums:
        params["valor_inicial"] = nums[0] if len(nums) >= 1 else 1000
        params["aporte_mensal"] = nums[1] if len(nums) >= 2 else 500
        params["meses"] = int(nums[2]) if len(nums) >= 3 else 12
    return params


def _answer_educational(message: str, client) -> str:
    """Answer an educational question about finance."""
    if client:
        try:
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=600,
                system=(
                    "Você é um educador financeiro do FinBrain. Responda de forma clara e didática. "
                    "NUNCA recomende ativos específicos. NUNCA diga para comprar ou vender. "
                    "Cite fontes oficiais quando relevante (BCB, CVM, Anbima). "
                    "Máximo 250 palavras."
                ),
                messages=[{"role": "user", "content": message}],
            )
            return response.content[0].text
        except Exception:
            pass
    return (
        "Ótima pergunta! Infelizmente, não consigo gerar uma resposta detalhada agora. "
        "Tente novamente em alguns instantes ou consulte fontes como o site do Banco Central "
        "(bcb.gov.br) e da CVM (cvm.gov.br) para informações confiáveis."
    )
