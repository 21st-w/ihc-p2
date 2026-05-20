"""FinBrain — Benjamin: agente de simulações financeiras educacionais.

Chama skills determinísticas e usa LLM para explicar os resultados.
"""

from decimal import Decimal
from app.skills.calculos import juros_compostos, reserva_emergencia, comparar_rentabilidade
from app.guardrails.athena import validar


BENJAMIN_SYSTEM_PROMPT = """Você é Benjamin, simulador financeiro educacional do FinBrain.
Explique os resultados da simulação de forma clara para alguém sem experiência em finanças.
Use analogias do cotidiano quando possível.
NUNCA prometa rentabilidade futura.
SEMPRE mencione que é simulação educacional com premissas simplificadas.
NUNCA recomende ativos específicos ou diga para comprar/vender qualquer coisa.
Mantenha a resposta em até 250 palavras."""


SIMULATION_TYPES = {
    "juros_compostos": {
        "required": ["valor_inicial", "aporte_mensal", "taxa_mensal", "meses"],
        "skill": "juros_compostos",
    },
    "reserva_emergencia": {
        "required": ["gastos_essenciais"],
        "skill": "reserva_emergencia",
    },
    "comparar_rentabilidade": {
        "required": ["valor_inicial", "aporte_mensal", "meses"],
        "skill": "comparar_rentabilidade",
    },
}


def simular(tipo: str, params: dict, anthropic_client=None) -> dict:
    """Run a financial simulation.

    Args:
        tipo: Simulation type (juros_compostos, reserva_emergencia, comparar_rentabilidade).
        params: Parameters for the simulation.
        anthropic_client: Optional Anthropic client for explanation.

    Returns:
        Dict with simulation results, explanation, and guardrail status.
    """
    if tipo not in SIMULATION_TYPES:
        return {"erro": f"Tipo de simulação não suportado: {tipo}. Use: {list(SIMULATION_TYPES.keys())}"}

    # Execute deterministic skill
    try:
        if tipo == "juros_compostos":
            result = juros_compostos(
                pv=Decimal(str(params.get("valor_inicial", 0))),
                aporte=Decimal(str(params.get("aporte_mensal", 0))),
                taxa_mensal=Decimal(str(params.get("taxa_mensal", "0.01"))),
                meses=int(params.get("meses", 12)),
            )
        elif tipo == "reserva_emergencia":
            result = reserva_emergencia(
                gastos_essenciais=Decimal(str(params.get("gastos_essenciais", 3000))),
                meses=int(params.get("meses_cobertura", 6)),
                aporte_mensal=Decimal(str(params.get("aporte_mensal", 0))),
            )
        elif tipo == "comparar_rentabilidade":
            result = comparar_rentabilidade(
                valor_inicial=Decimal(str(params.get("valor_inicial", 1000))),
                aporte_mensal=Decimal(str(params.get("aporte_mensal", 500))),
                meses=int(params.get("meses", 12)),
            )
        else:
            result = {}
    except (ValueError, ArithmeticError) as e:
        return {"erro": f"Erro no cálculo: {str(e)}"}

    # Serialize Decimals for JSON
    result_serialized = _serialize(result)

    # Generate explanation
    if anthropic_client:
        try:
            explanation_input = f"Tipo: {tipo}\nParâmetros: {params}\nResultado: {result_serialized}"
            response = anthropic_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=600,
                system=BENJAMIN_SYSTEM_PROMPT,
                messages=[{"role": "user", "content": explanation_input}],
            )
            explicacao = response.content[0].text
        except Exception as e:
            explicacao = f"Não foi possível gerar explicação: {str(e)}"
    else:
        explicacao = _fallback_explanation(tipo, result_serialized)

    # Guardrails
    athena = validar(explicacao)

    return {
        "tipo": tipo,
        "params": params,
        "resultado": result_serialized,
        "explicacao": athena.texto_final,
        "guardrail_ok": athena.ok,
        "bloqueios": athena.bloqueios,
    }


def _serialize(obj):
    """Recursively convert Decimals to strings for JSON."""
    if isinstance(obj, Decimal):
        return str(obj)
    if isinstance(obj, dict):
        return {k: _serialize(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_serialize(i) for i in obj]
    return obj


def _fallback_explanation(tipo: str, result: dict) -> str:
    """Simple explanation when LLM is not available."""
    if tipo == "juros_compostos":
        return (
            f"📈 **Simulação de Juros Compostos**\n\n"
            f"Com os parâmetros informados, seu patrimônio chegaria a "
            f"**R$ {result.get('valor_final', '?')}**.\n"
            f"Desse total, R$ {result.get('total_investido', '?')} seriam aportes seus "
            f"e R$ {result.get('total_juros', '?')} seriam juros acumulados.\n\n"
            f"Os juros compostos funcionam como uma bola de neve: "
            f"quanto mais tempo, maior o efeito."
        )
    elif tipo == "reserva_emergencia":
        return (
            f"🛡️ **Reserva de Emergência**\n\n"
            f"Sua reserva ideal seria de **R$ {result.get('valor_alvo', '?')}**, "
            f"equivalente a {result.get('meses_cobertura', 6)} meses de gastos essenciais.\n"
            f"{('Poupando mensalmente, você atingiria em ' + str(result.get('meses_para_atingir', '?')) + ' meses.') if result.get('meses_para_atingir') else ''}"
        )
    elif tipo == "comparar_rentabilidade":
        return (
            f"⚖️ **Comparativo de Rentabilidade**\n\n"
            f"Poupança: R$ {result.get('poupanca', {}).get('valor_final', '?')} (isento de IR)\n"
            f"CDB 100% CDI: R$ {result.get('cdb_100_cdi', {}).get('valor_final_liquido', '?')} (líquido de IR)\n"
            f"Tesouro Selic: R$ {result.get('tesouro_selic', {}).get('valor_final_liquido', '?')} (líquido de IR)\n\n"
            f"Cada modalidade tem características diferentes de liquidez, risco e tributação."
        )
    return "Simulação concluída. Verifique os dados numéricos acima."
