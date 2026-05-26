"""Tio Patinhas — Agente Moriarty.

Moriarty é o agente matemático e quantitativo.
Ele realiza cálculos financeiros determinísticos em Python puro:
reserva de emergência, juros compostos, impacto de dívidas, projeções.

Importante: Todos os cálculos são determinísticos (sem IA).
Moriarty NUNCA recomenda compra ou venda de ativos.
"""

import math
from typing import Any


AVISO_EDUCACIONAL = (
    "⚠️ Simulação educacional baseada em premissas simplificadas. "
    "Não é recomendação de investimento. Performance passada não garante "
    "resultados futuros."
)


def calcular_resumo(
    monthly_income: float,
    fixed_expenses: float,
    variable_expenses: float,
    subscriptions: float,
    debts: float,
) -> dict[str, float]:
    """Calcula resumo financeiro básico."""
    gastos_totais = fixed_expenses + variable_expenses + subscriptions + debts
    saldo = monthly_income - gastos_totais
    comprometimento = (gastos_totais / monthly_income * 100) if monthly_income > 0 else 100.0
    peso_dividas = (debts / monthly_income * 100) if monthly_income > 0 else 0.0
    peso_assinaturas = (subscriptions / monthly_income * 100) if monthly_income > 0 else 0.0

    return {
        "renda_mensal": round(monthly_income, 2),
        "gastos_fixos": round(fixed_expenses, 2),
        "gastos_variaveis": round(variable_expenses, 2),
        "assinaturas": round(subscriptions, 2),
        "dividas": round(debts, 2),
        "gastos_totais": round(gastos_totais, 2),
        "saldo_estimado": round(saldo, 2),
        "comprometimento_pct": round(comprometimento, 1),
        "peso_dividas_pct": round(peso_dividas, 1),
        "peso_assinaturas_pct": round(peso_assinaturas, 1),
    }


def simular_reserva_emergencia(
    gastos_essenciais: float,
    meses_cobertura: int = 6,
    aporte_mensal: float = 0,
) -> dict[str, Any]:
    """Simula formação de reserva de emergência.

    A reserva é calculada com base nos gastos essenciais (fixos + variáveis),
    não na renda total.
    """
    valor_alvo = gastos_essenciais * meses_cobertura
    meses_para_atingir = math.ceil(valor_alvo / aporte_mensal) if aporte_mensal > 0 else None

    return {
        "gastos_essenciais_mes": round(gastos_essenciais, 2),
        "meses_cobertura": meses_cobertura,
        "valor_alvo": round(valor_alvo, 2),
        "aporte_mensal": round(aporte_mensal, 2),
        "meses_para_atingir": meses_para_atingir,
        "descricao": (
            f"Sua reserva de emergência ideal seria de R$ {valor_alvo:,.2f}, "
            f"equivalente a {meses_cobertura} meses de gastos essenciais."
            + (f" Com aportes de R$ {aporte_mensal:,.2f}/mês, "
               f"você levaria cerca de {meses_para_atingir} meses para atingi-la, "
               f"desconsiderando rentabilidade."
               if meses_para_atingir else
               " Defina um aporte mensal para calcular o tempo necessário.")
        ),
    }


def simular_economia_mensal(
    saldo_atual: float,
    economia_mensal: float,
    meses: int = 12,
) -> dict[str, Any]:
    """Simula impacto de economizar um valor fixo por mês."""
    acumulado = saldo_atual + (economia_mensal * meses)
    return {
        "economia_mensal": round(economia_mensal, 2),
        "meses": meses,
        "acumulado": round(acumulado, 2),
        "descricao": (
            f"Economizando R$ {economia_mensal:,.2f}/mês durante {meses} meses, "
            f"você acumularia R$ {acumulado:,.2f} (sem considerar rentabilidade)."
        ),
    }


def simular_juros_compostos(
    valor_inicial: float,
    aporte_mensal: float,
    taxa_anual: float = 0.10,
    meses: int = 12,
) -> dict[str, Any]:
    """Simula crescimento com juros compostos (educacional).

    Fórmula: FV = PV × (1+i)^n + PMT × [((1+i)^n - 1) / i]
    """
    taxa_mensal = (1 + taxa_anual) ** (1 / 12) - 1
    saldo = valor_inicial
    total_investido = valor_inicial
    evolucao = [{"mes": 0, "saldo": round(saldo, 2)}]

    for mes in range(1, meses + 1):
        saldo = saldo * (1 + taxa_mensal) + aporte_mensal
        total_investido += aporte_mensal
        evolucao.append({"mes": mes, "saldo": round(saldo, 2)})

    juros_ganhos = saldo - total_investido

    return {
        "valor_inicial": round(valor_inicial, 2),
        "aporte_mensal": round(aporte_mensal, 2),
        "taxa_anual_pct": round(taxa_anual * 100, 2),
        "meses": meses,
        "valor_final": round(saldo, 2),
        "total_investido": round(total_investido, 2),
        "juros_ganhos": round(juros_ganhos, 2),
        "evolucao": evolucao,
        "descricao": (
            f"Começando com R$ {valor_inicial:,.2f} e aportando R$ {aporte_mensal:,.2f}/mês "
            f"durante {meses} meses a uma taxa educacional de {taxa_anual*100:.1f}% a.a., "
            f"seu patrimônio chegaria a R$ {saldo:,.2f}. "
            f"Desse total, R$ {juros_ganhos:,.2f} seriam rendimentos."
        ),
    }


def simular_impacto_dividas(
    renda: float,
    dividas: float,
    taxa_juros_mensal: float = 0.05,
) -> dict[str, Any]:
    """Calcula impacto educacional das dívidas na renda."""
    custo_juros_mensal = dividas * taxa_juros_mensal
    custo_juros_anual = custo_juros_mensal * 12
    comprometimento = (dividas / renda * 100) if renda > 0 else 0

    return {
        "divida_total": round(dividas, 2),
        "taxa_juros_mensal_pct": round(taxa_juros_mensal * 100, 2),
        "custo_juros_mensal": round(custo_juros_mensal, 2),
        "custo_juros_anual": round(custo_juros_anual, 2),
        "comprometimento_pct": round(comprometimento, 1),
        "descricao": (
            f"Suas dívidas de R$ {dividas:,.2f} comprometem {comprometimento:.1f}% da renda. "
            f"A uma taxa educacional de {taxa_juros_mensal*100:.1f}%/mês, "
            f"o custo dos juros seria de R$ {custo_juros_mensal:,.2f}/mês "
            f"(R$ {custo_juros_anual:,.2f}/ano)."
        ) if dividas > 0 else "Você não possui dívidas cadastradas — ótima situação!",
    }


def simular_renda_fixa_pos_fixada(
    aporte_mensal: float,
    meses: int,
    percentual_cdi: float,
    cdi_atual: dict[str, Any] | float,
) -> dict[str, Any]:
    """Simula renda fixa pos-fixada como exercicio educacional.

    `cdi_atual` pode ser um dict do Market Data Service ou uma taxa anual
    percentual informada manualmente.
    """
    if isinstance(cdi_atual, dict):
        taxa_base = float(cdi_atual.get("value") or 0)
        fonte = cdi_atual.get("source", "premissa educacional")
        data = cdi_atual.get("date")
    else:
        taxa_base = float(cdi_atual or 0)
        fonte = "premissa educacional manual"
        data = None

    taxa_anual = (taxa_base / 100) * (percentual_cdi / 100)
    taxa_mensal = (1 + taxa_anual) ** (1 / 12) - 1 if taxa_anual > -1 else 0
    saldo = 0.0
    total_aportado = 0.0
    for _ in range(max(meses, 0)):
        saldo = saldo * (1 + taxa_mensal) + aporte_mensal
        total_aportado += aporte_mensal

    return {
        "tipo": "simulacao_educacional",
        "cenario": "Renda fixa pos-fixada",
        "aporte_mensal": round(aporte_mensal, 2),
        "meses": meses,
        "percentual_cdi": round(percentual_cdi, 2),
        "taxa_usada": round(taxa_anual, 6),
        "fonte_taxa": fonte,
        "data_taxa": data,
        "valor_final_estimado": round(saldo, 2),
        "total_aportado": round(total_aportado, 2),
        "rendimento_estimado": round(saldo - total_aportado, 2),
        "premissas": "Taxa constante durante todo o periodo, sem impostos, custos ou oscilacoes.",
        "limitacoes": "Simulacao simplificada; nao garante resultados futuros.",
        "aviso": "Simulacao educacional. Nao representa recomendacao de investimento.",
    }


def simular_poupanca(
    aporte_mensal: float,
    meses: int,
    taxa_poupanca_mensal: dict[str, Any] | float,
) -> dict[str, Any]:
    """Simula acumulacao usando taxa mensal educacional da poupanca."""
    if isinstance(taxa_poupanca_mensal, dict):
        taxa = float(taxa_poupanca_mensal.get("value") or 0)
        fonte = taxa_poupanca_mensal.get("source", "premissa educacional")
        data = taxa_poupanca_mensal.get("date")
    else:
        taxa = float(taxa_poupanca_mensal or 0)
        fonte = "premissa educacional manual"
        data = None

    saldo = 0.0
    total_aportado = 0.0
    for _ in range(max(meses, 0)):
        saldo = saldo * (1 + taxa) + aporte_mensal
        total_aportado += aporte_mensal

    return {
        "tipo": "simulacao_educacional",
        "cenario": "Poupanca",
        "aporte_mensal": round(aporte_mensal, 2),
        "meses": meses,
        "taxa_usada": round(taxa, 6),
        "fonte_taxa": fonte,
        "data_taxa": data,
        "valor_final_estimado": round(saldo, 2),
        "total_aportado": round(total_aportado, 2),
        "rendimento_estimado": round(saldo - total_aportado, 2),
        "premissas": "Taxa mensal constante, regra simplificada e sem impostos.",
        "limitacoes": "Simulacao educacional simplificada; nao representa rentabilidade garantida.",
        "aviso": "Simulacao educacional. Nao representa recomendacao de investimento.",
    }


def simular_inflacao(valor_atual: float, meses: int, ipca_estimado: dict[str, Any] | float) -> dict[str, Any]:
    """Projeta perda de poder de compra por IPCA estimado."""
    if isinstance(ipca_estimado, dict):
        taxa_mensal = float(ipca_estimado.get("value") or 0) / 100
        fonte = ipca_estimado.get("source", "premissa educacional")
        data = ipca_estimado.get("date")
    else:
        taxa_mensal = float(ipca_estimado or 0) / 100
        fonte = "premissa educacional manual"
        data = None

    valor_corrigido = valor_atual * ((1 + taxa_mensal) ** max(meses, 0))
    return {
        "tipo": "simulacao_educacional",
        "cenario": "Inflacao",
        "valor_atual": round(valor_atual, 2),
        "meses": meses,
        "taxa_usada": round(taxa_mensal, 6),
        "fonte_taxa": fonte,
        "data_taxa": data,
        "valor_corrigido_estimado": round(valor_corrigido, 2),
        "perda_poder_compra_estimado": round(valor_corrigido - valor_atual, 2),
        "premissas": "IPCA mensal constante durante todo o periodo.",
        "limitacoes": "Inflacao futura pode variar; simulacao nao e previsao.",
        "aviso": "Simulacao educacional. Nao representa recomendacao de investimento.",
    }


def simular_cota_historica(valor_aporte: float, cota_inicial: float, cota_final: float) -> dict[str, Any]:
    """Simula variacao historica de uma cota, sem recomendar o ativo."""
    if cota_inicial <= 0:
        quantidade_cotas = 0
        valor_final = 0
    else:
        quantidade_cotas = valor_aporte / cota_inicial
        valor_final = quantidade_cotas * cota_final

    return {
        "tipo": "simulacao_educacional",
        "cenario": "Cota historica",
        "valor_aporte": round(valor_aporte, 2),
        "cota_inicial": round(cota_inicial, 6),
        "cota_final": round(cota_final, 6),
        "quantidade_cotas_simulada": round(quantidade_cotas, 6),
        "valor_final_estimado": round(valor_final, 2),
        "rendimento_estimado": round(valor_final - valor_aporte, 2),
        "premissas": "Comparacao historica simples entre duas cotas.",
        "limitacoes": "Cota historica nao garante resultados futuros e nao indica compra ou venda.",
        "aviso": "Simulacao educacional. Nao representa recomendacao de investimento.",
    }


def simular_cenario_educacional_com_market_data(
    aporte_mensal: float,
    meses: int,
    market_data: dict[str, Any],
) -> dict[str, Any]:
    """Agrupa simulacoes opcionais que usam dados externos padronizados."""
    poupanca_data = market_data.get("poupanca")
    ipca_data = market_data.get("ipca")
    cdi_data = market_data.get("cdi")
    return {
        "tipo": "simulacao_educacional",
        "poupanca": simular_poupanca(aporte_mensal, meses, poupanca_data) if poupanca_data else None,
        "inflacao": simular_inflacao(aporte_mensal * meses, meses, ipca_data) if ipca_data else None,
        "renda_fixa_pos_fixada": simular_renda_fixa_pos_fixada(aporte_mensal, meses, 100, cdi_data) if cdi_data else None,
        "fontes": {
            key: {
                "source": value.get("source"),
                "date": value.get("date"),
                "educational_disclaimer": value.get("educational_disclaimer"),
            }
            for key, value in market_data.items()
            if isinstance(value, dict)
        },
        "aviso": "Simulacoes educacionais. Nao representam recomendacao de investimento.",
    }


def simular_cenarios(
    monthly_income: float,
    fixed_expenses: float,
    variable_expenses: float,
    subscriptions: float,
    debts: float,
    desired_monthly_saving: float,
) -> dict[str, Any]:
    """Compara cenário atual com cenário de redução de gastos."""
    gastos_atuais = fixed_expenses + variable_expenses + subscriptions + debts
    saldo_atual = monthly_income - gastos_atuais

    # Cenário melhorado: reduz variáveis em 20% e assinaturas em 50%
    var_reduzido = variable_expenses * 0.80
    assin_reduzida = subscriptions * 0.50
    gastos_melhorados = fixed_expenses + var_reduzido + assin_reduzida + debts
    saldo_melhorado = monthly_income - gastos_melhorados
    economia_gerada = saldo_melhorado - saldo_atual

    return {
        "cenario_atual": {
            "gastos_totais": round(gastos_atuais, 2),
            "saldo": round(saldo_atual, 2),
        },
        "cenario_melhorado": {
            "gastos_totais": round(gastos_melhorados, 2),
            "saldo": round(saldo_melhorado, 2),
            "economia_gerada": round(economia_gerada, 2),
            "premissas": "Redução de 20% nos gastos variáveis e 50% nas assinaturas.",
        },
        "meta_mensal": round(desired_monthly_saving, 2),
        "meta_viavel": saldo_melhorado >= desired_monthly_saving,
        "descricao": (
            f"No cenário atual, sua sobra é de R$ {saldo_atual:,.2f}/mês. "
            f"Reduzindo 20% dos gastos variáveis e 50% das assinaturas, "
            f"sua sobra subiria para R$ {saldo_melhorado:,.2f}/mês — "
            f"uma economia de R$ {economia_gerada:,.2f}."
        ),
    }


def gerar_simulacoes_completas(
    monthly_income: float,
    fixed_expenses: float,
    variable_expenses: float,
    subscriptions: float,
    debts: float,
    desired_monthly_saving: float,
) -> dict[str, Any]:
    """Executa todas as simulações do Moriarty de uma vez."""
    gastos_essenciais = fixed_expenses + variable_expenses
    saldo = monthly_income - (fixed_expenses + variable_expenses + subscriptions + debts)
    aporte = desired_monthly_saving if desired_monthly_saving > 0 else max(saldo * 0.5, 0)

    return {
        "resumo": calcular_resumo(monthly_income, fixed_expenses, variable_expenses, subscriptions, debts),
        "reserva_emergencia": simular_reserva_emergencia(gastos_essenciais, 6, aporte),
        "economia_mensal": simular_economia_mensal(0, aporte, 12),
        "juros_compostos": simular_juros_compostos(0, aporte, 0.10, 24),
        "impacto_dividas": simular_impacto_dividas(monthly_income, debts),
        "cenarios": simular_cenarios(
            monthly_income, fixed_expenses, variable_expenses,
            subscriptions, debts, desired_monthly_saving,
        ),
        "aviso": AVISO_EDUCACIONAL,
    }
