"""
AI Cost Tracker — Decorator para interceptar chamadas LLM.

Captura tokens, latência e custo por chamada.
NUNCA persiste prompt ou resposta (Zero-Data Retention).
Apenas métricas quantitativas são salvas.

Uso:
    @track_ai_cost(agent="budget_advisor", project="fintrack-personal")
    async def call_llm(messages, model):
        return await anthropic.messages.create(...)
"""
import time
import functools
import logging
from uuid import uuid4
from decimal import Decimal

logger = logging.getLogger(__name__)

# Tabela de preços por modelo (USD por 1K tokens)
PRICING = {
    "claude-sonnet-4-20250514": {"input": Decimal("0.003"), "output": Decimal("0.015")},
    "claude-3-5-sonnet-20241022": {"input": Decimal("0.003"), "output": Decimal("0.015")},
    "gpt-4o": {"input": Decimal("0.005"), "output": Decimal("0.015")},
    "gpt-4o-mini": {"input": Decimal("0.00015"), "output": Decimal("0.0006")},
    "gemini-1.5-pro": {"input": Decimal("0.00125"), "output": Decimal("0.005")},
}

def calculate_cost(model: str, prompt_tokens: int, completion_tokens: int) -> dict:
    """Calcula custo em USD baseado no modelo e tokens."""
    prices = PRICING.get(model, {"input": Decimal("0.01"), "output": Decimal("0.03")})
    input_cost = (Decimal(prompt_tokens) / 1000) * prices["input"]
    output_cost = (Decimal(completion_tokens) / 1000) * prices["output"]
    return {
        "input_cost_usd": input_cost,
        "output_cost_usd": output_cost,
        "total_cost_usd": input_cost + output_cost,
    }


def track_ai_cost(agent: str, project: str | None = None):
    """
    Decorator que envolve chamadas LLM e emite eventos de custo.
    
    Regra 14 (Zero-Data Retention): O conteúdo do prompt e da resposta
    é visto APENAS em memória para extrair métricas. Nunca é persistido.
    """
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.perf_counter()
            status = "success"
            
            try:
                result = await func(*args, **kwargs)
            except Exception as e:
                status = "error"
                logger.warning(f"LLM call failed for agent={agent}: {type(e).__name__}")
                raise
            finally:
                latency_ms = int((time.perf_counter() - start_time) * 1000)
            
            # Extrair métricas do resultado (formato Anthropic SDK)
            usage = getattr(result, "usage", None)
            model_name = getattr(result, "model", "unknown")
            prompt_tokens = getattr(usage, "input_tokens", 0) if usage else 0
            completion_tokens = getattr(usage, "output_tokens", 0) if usage else 0
            
            costs = calculate_cost(model_name, prompt_tokens, completion_tokens)
            
            # Emitir evento (log seguro — SEM prompt/resposta)
            event = {
                "id": str(uuid4()),
                "agent_name": agent,
                "project": project,
                "provider": "anthropic",
                "model": model_name,
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "total_tokens": prompt_tokens + completion_tokens,
                "latency_ms": latency_ms,
                "status": status,
                **{k: str(v) for k, v in costs.items()},
            }
            
            logger.info(f"AI_COST_EVENT: {event}")
            
            # TODO: Persistir no PostgreSQL via Cost Collector (Fase 6)
            
            return result
        return wrapper
    return decorator
