"""Tio Patinhas — Agente Freud.

Freud é o agente de análise de perfil financeiro e comportamental.
Ele analisa os dados financeiros do usuário e gera um diagnóstico
educacional com perfil, pontos fortes, pontos de atenção e sugestões.

Importante: Freud NUNCA recomenda compra ou venda de ativos.
Todas as análises possuem finalidade exclusivamente educacional.
"""

from typing import Any


AVISO_EDUCACIONAL = (
    "⚠️ Esta análise possui finalidade exclusivamente educacional. "
    "Não representa recomendação de investimento, consultoria financeira "
    "ou indicação de compra/venda de ativos."
)


def _classificar_perfil(taxa_poupanca: float, divida_renda: float) -> str:
    """Classifica o perfil financeiro do usuário."""
    if divida_renda > 0.5:
        return "Crítico"
    if divida_renda > 0.3:
        return "Atenção"
    if taxa_poupanca <= 0:
        return "Apertado"
    if taxa_poupanca < 0.10:
        return "Justo"
    if taxa_poupanca < 0.20:
        return "Equilibrado"
    return "Saudável"


def _gerar_pontos_fortes(dados: dict) -> list[str]:
    """Identifica pontos positivos na situação financeira."""
    pontos = []
    if dados["saldo_estimado"] > 0:
        pontos.append("Você ainda tem sobra mensal positiva.")
    if dados["debts"] == 0:
        pontos.append("Você não possui dívidas — ótimo ponto de partida!")
    if dados["taxa_poupanca"] >= 0.20:
        pontos.append("Sua taxa de poupança está acima de 20% — excelente!")
    if dados["taxa_poupanca"] >= 0.10:
        pontos.append("Você consegue poupar pelo menos 10% da renda.")
    if dados["subscriptions"] < dados["monthly_income"] * 0.05:
        pontos.append("Suas assinaturas representam pouco da renda.")
    if not pontos:
        pontos.append("Você deu o primeiro passo ao cadastrar seus dados financeiros.")
    return pontos


def _gerar_pontos_atencao(dados: dict) -> list[str]:
    """Identifica pontos que merecem atenção."""
    pontos = []
    if dados["saldo_estimado"] < 0:
        pontos.append("Seus gastos superam sua renda — situação de alerta.")
    if dados["divida_renda"] > 0.3:
        pontos.append(f"Dívidas comprometem {dados['divida_renda']:.0%} da renda — acima do recomendado.")
    if dados["comprometimento"] > 0.8:
        pontos.append(f"Comprometimento da renda em {dados['comprometimento']:.0%} — margem de segurança baixa.")
    if dados["subscriptions"] > dados["monthly_income"] * 0.10:
        pontos.append("Assinaturas representam mais de 10% da renda — vale revisar.")
    if dados["taxa_poupanca"] < 0.10 and dados["saldo_estimado"] > 0:
        pontos.append("Taxa de poupança abaixo de 10% — dificulta construção de reserva.")
    if not pontos:
        pontos.append("Nenhum ponto crítico identificado no momento.")
    return pontos


def _gerar_sugestao(perfil: str, dados: dict) -> str:
    """Gera sugestão educacional baseada no perfil."""
    if perfil == "Crítico":
        return (
            "Priorize a renegociação das dívidas e corte gastos variáveis. "
            "Antes de pensar em investimentos, o foco educacional deve ser "
            "estabilizar as contas e sair da zona de risco."
        )
    if perfil == "Atenção":
        return (
            "Revise seus gastos recorrentes e assinaturas. Tente reduzir o peso "
            "das dívidas negociando taxas menores. O foco educacional é organizar "
            "as finanças antes de qualquer outra decisão."
        )
    if perfil in ("Apertado", "Justo"):
        return (
            "Seu orçamento está justo. Foque em identificar pequenas economias "
            "nos gastos variáveis e comece a construir uma reserva de emergência, "
            "mesmo que com valores pequenos."
        )
    if perfil == "Equilibrado":
        return (
            "Você está no caminho certo! Continue mantendo a disciplina e "
            "considere aumentar gradualmente o valor poupado. O próximo passo "
            "educacional é entender conceitos como reserva de emergência e juros compostos."
        )
    return (
        "Excelente situação! Você tem boa margem de poupança. O foco educacional "
        "agora pode ser entender como proteger e organizar seu patrimônio, estudando "
        "conceitos como diversificação e planejamento de longo prazo."
    )


def analisar(
    monthly_income: float,
    fixed_expenses: float,
    variable_expenses: float,
    subscriptions: float,
    debts: float,
    financial_goal: str,
    desired_monthly_saving: float,
    risk_tolerance: str,
) -> dict[str, Any]:
    """Gera diagnóstico financeiro educacional completo.

    Args:
        monthly_income: Renda mensal (R$).
        fixed_expenses: Gastos fixos (R$).
        variable_expenses: Gastos variáveis (R$).
        subscriptions: Assinaturas (R$).
        debts: Dívidas mensais (R$).
        financial_goal: Objetivo financeiro do usuário.
        desired_monthly_saving: Quanto deseja economizar/mês.
        risk_tolerance: conservador | moderado | arrojado.

    Returns:
        Dicionário com perfil, resumo, pontos fortes/atenção, sugestão e aviso.
    """
    gastos_totais = fixed_expenses + variable_expenses + subscriptions + debts
    saldo_estimado = monthly_income - gastos_totais
    comprometimento = gastos_totais / monthly_income if monthly_income > 0 else 1.0
    taxa_poupanca = saldo_estimado / monthly_income if monthly_income > 0 else 0.0
    divida_renda = debts / monthly_income if monthly_income > 0 else 0.0

    dados = {
        "monthly_income": monthly_income,
        "fixed_expenses": fixed_expenses,
        "variable_expenses": variable_expenses,
        "subscriptions": subscriptions,
        "debts": debts,
        "gastos_totais": gastos_totais,
        "saldo_estimado": saldo_estimado,
        "comprometimento": comprometimento,
        "taxa_poupanca": taxa_poupanca,
        "divida_renda": divida_renda,
    }

    perfil = _classificar_perfil(taxa_poupanca, divida_renda)
    pontos_fortes = _gerar_pontos_fortes(dados)
    pontos_atencao = _gerar_pontos_atencao(dados)
    sugestao = _gerar_sugestao(perfil, dados)

    resumo = (
        f"Com uma renda mensal de R$ {monthly_income:,.2f} e gastos totais de "
        f"R$ {gastos_totais:,.2f}, sua sobra estimada é de R$ {saldo_estimado:,.2f}. "
        f"Isso representa uma taxa de poupança de {taxa_poupanca:.0%} e um "
        f"comprometimento da renda de {comprometimento:.0%}."
    )

    return {
        "perfil_financeiro": perfil,
        "tolerancia_risco": risk_tolerance,
        "objetivo": financial_goal or "Não informado",
        "resumo": resumo,
        "dados": {
            "renda_mensal": round(monthly_income, 2),
            "gastos_fixos": round(fixed_expenses, 2),
            "gastos_variaveis": round(variable_expenses, 2),
            "assinaturas": round(subscriptions, 2),
            "dividas": round(debts, 2),
            "gastos_totais": round(gastos_totais, 2),
            "saldo_estimado": round(saldo_estimado, 2),
            "comprometimento_renda": round(comprometimento * 100, 1),
            "taxa_poupanca": round(taxa_poupanca * 100, 1),
        },
        "pontos_fortes": pontos_fortes,
        "pontos_atencao": pontos_atencao,
        "sugestao_educacional": sugestao,
        "aviso": AVISO_EDUCACIONAL,
    }
