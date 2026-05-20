"""FinBrain — Sherlock: agente de diagnóstico de perfil financeiro.

Carrega transações, chama skills determinísticas, usa LLM para narrar diagnóstico.
"""

from decimal import Decimal
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.models import Transaction, IncomeSource, Debt, Simulation
from app.skills.calculos import diagnostico_gastos, score_saude
from app.guardrails.athena import validar


SHERLOCK_SYSTEM_PROMPT = """Você é Sherlock, especialista em perfil financeiro do FinBrain.
Analise os dados abaixo e gere um diagnóstico honesto em 4 blocos:
1. **Situação Atual** — resumo objetivo dos números.
2. **Pontos Fortes** — o que o usuário está fazendo bem.
3. **Pontos de Atenção** — onde há risco ou desperdício.
4. **Próximos Passos** — sugestões educacionais concretas (sem recomendar ativos).

Tom: direto, sem jargão, sem drama. Máximo 300 palavras.
NUNCA recomende ativos ou investimentos específicos. Só comportamento financeiro.
Use emojis com moderação para tornar a leitura agradável."""


def _load_user_context(db: Session, user_id: int) -> dict:
    """Load last 90 days of financial context for a user."""
    since = datetime.now(timezone.utc) - timedelta(days=90)

    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.data >= since,
    ).all()

    income_sources = db.query(IncomeSource).filter(
        IncomeSource.user_id == user_id
    ).all()

    debts = db.query(Debt).filter(Debt.user_id == user_id).all()

    renda_mensal = sum(i.valor_mensal for i in income_sources)
    divida_total = sum(d.saldo for d in debts)

    tx_dicts = [
        {
            "valor": str(t.valor),
            "tipo": t.tipo,
            "categoria": t.categoria,
            "descricao": t.descricao,
        }
        for t in transactions
    ]

    return {
        "transactions": tx_dicts,
        "renda_mensal": renda_mensal,
        "divida_total": divida_total,
        "num_fontes_renda": len(income_sources),
        "num_dividas": len(debts),
        "dividas": [{"nome": d.nome, "saldo": str(d.saldo), "taxa": str(d.taxa_mensal)} for d in debts],
    }


def analisar(db: Session, user_id: int, anthropic_client=None) -> dict:
    """Run Sherlock analysis: deterministic skills + LLM narrative.

    Args:
        db: Database session.
        user_id: User ID to analyze.
        anthropic_client: Optional Anthropic client (None = skip LLM, return data only).

    Returns:
        Dict with diagnostico data and optional LLM narrative.
    """
    ctx = _load_user_context(db, user_id)

    # Run deterministic analysis
    diag = diagnostico_gastos(ctx["transactions"], Decimal(str(ctx["renda_mensal"])))

    renda = ctx["renda_mensal"]
    divida_renda = Decimal(str(ctx["divida_total"])) / Decimal(str(renda)) if renda > 0 else Decimal("0")
    meses_reserva = Decimal("0")  # Will be calculated from actual savings

    health = score_saude(
        taxa_poupanca=diag["taxa_poupanca"],
        divida_renda=divida_renda,
        meses_reserva=meses_reserva,
    )

    result = {
        "diagnostico": diag,
        "score": health,
        "contexto": {
            "renda_mensal": str(ctx["renda_mensal"]),
            "divida_total": str(ctx["divida_total"]),
            "num_transacoes": len(ctx["transactions"]),
            "periodo": "últimos 90 dias",
        },
    }

    # LLM narrative (optional — skip if no client)
    if anthropic_client:
        user_data = (
            f"Renda mensal: R$ {ctx['renda_mensal']}\n"
            f"Total gastos: R$ {diag['total_debitos']}\n"
            f"Taxa de poupança: {diag['taxa_poupanca']}\n"
            f"Gastos fixos: R$ {diag['fixos']}\n"
            f"Gastos variáveis: R$ {diag['variaveis']}\n"
            f"Categorias: {diag['por_categoria']}\n"
            f"Score de saúde: {health['score']}/100 ({health['nivel']})\n"
            f"Dívidas: {ctx['dividas']}\n"
            f"Assinaturas detectadas: {diag['assinaturas_detectadas']}\n"
        )
        try:
            response = anthropic_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=800,
                system=SHERLOCK_SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_data}],
            )
            narrative = response.content[0].text
            athena_result = validar(narrative)
            result["narrativa"] = athena_result.texto_final
            result["guardrail_ok"] = athena_result.ok
            result["bloqueios"] = athena_result.bloqueios
        except Exception as e:
            result["narrativa"] = f"Erro ao gerar diagnóstico narrativo: {str(e)}"
            result["guardrail_ok"] = True
            result["bloqueios"] = []
    else:
        # Fallback: generate a simple narrative from data
        result["narrativa"] = _generate_fallback_narrative(diag, health, ctx)
        result["guardrail_ok"] = True
        result["bloqueios"] = []

    # Save simulation
    sim = Simulation(
        user_id=user_id,
        tipo="diagnostico_sherlock",
        inputs_json={"periodo": "90d"},
        outputs_json=result,
    )
    db.add(sim)
    db.commit()

    return result


def _generate_fallback_narrative(diag: dict, health: dict, ctx: dict) -> str:
    """Generate a simple narrative when LLM is not available."""
    score = health["score"]
    nivel = health["nivel"]
    taxa = diag["taxa_poupanca"]

    text = f"""## 📊 Diagnóstico Financeiro

**Situação Atual**
Sua saúde financeira está em **{nivel}** (score: {score}/100).
Nos últimos 90 dias, sua taxa de poupança foi de {taxa:.0%}.

**Pontos Fortes**
{"- Você está conseguindo poupar parte da sua renda." if taxa > 0 else "- Identificamos oportunidades de melhoria."}

**Pontos de Atenção**
- Gastos fixos: R$ {diag['fixos']}
- Gastos variáveis: R$ {diag['variaveis']}
{"- " + str(len(diag['assinaturas_detectadas'])) + " assinaturas detectadas — vale revisar." if diag['assinaturas_detectadas'] else ""}

**Próximos Passos**
- Revise suas assinaturas e cancele as que não usa.
- Estabeleça uma meta de poupança de pelo menos 20% da renda.
- Monte sua reserva de emergência (6 meses de gastos essenciais).

⚠️ Simulação educacional. Não é recomendação de investimento. Performance passada não garante resultados futuros."""
    return text
