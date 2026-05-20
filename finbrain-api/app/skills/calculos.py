"""Tio Patinhas — Funções financeiras determinísticas.

Todas as funções são puras (sem I/O, sem LLM), usam Decimal para precisão
monetária e possuem docstrings com fórmula, premissas e exemplo.
"""

from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP
from typing import Any

TWO_PLACES = Decimal("0.01")


def _round(value: Decimal) -> Decimal:
    return value.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)


def juros_compostos(
    pv: Decimal, aporte: Decimal, taxa_mensal: Decimal, meses: int,
) -> dict[str, Any]:
    """Juros compostos com aportes mensais.
    Fórmula: saldo[m] = saldo[m-1] * (1 + taxa) + aporte
    """
    if meses < 0:
        raise ValueError("Meses não pode ser negativo")
    if taxa_mensal < 0:
        raise ValueError("Taxa mensal não pode ser negativa")
    saldo = pv
    total_investido = pv
    evolucao = [{"mes": 0, "saldo": _round(saldo)}]
    for mes in range(1, meses + 1):
        saldo = saldo * (Decimal("1") + taxa_mensal) + aporte
        total_investido += aporte
        evolucao.append({"mes": mes, "saldo": _round(saldo)})
    total_juros = saldo - total_investido
    return {
        "valor_final": _round(saldo),
        "total_investido": _round(total_investido),
        "total_juros": _round(total_juros),
        "evolucao": evolucao,
    }


def reserva_emergencia(
    gastos_essenciais: Decimal, meses: int = 6, aporte_mensal: Decimal = Decimal("0"),
) -> dict[str, Any]:
    """Reserva = gastos essenciais × meses. Baseada em gastos, NÃO em renda."""
    if gastos_essenciais <= 0:
        raise ValueError("Gastos essenciais devem ser positivos")
    if meses <= 0:
        raise ValueError("Meses de cobertura devem ser positivos")
    valor_alvo = gastos_essenciais * Decimal(str(meses))
    meses_para_atingir = None
    if aporte_mensal > 0:
        meses_para_atingir = int(
            (valor_alvo / aporte_mensal).to_integral_value(rounding=ROUND_HALF_UP)
        )
    return {
        "valor_alvo": _round(valor_alvo),
        "meses_para_atingir": meses_para_atingir,
        "gastos_base": _round(gastos_essenciais),
        "meses_cobertura": meses,
        "sugestao": f"Reserva ideal: R$ {_round(valor_alvo):,.2f} ({meses} meses de gastos essenciais).",
    }


def score_saude(
    taxa_poupanca: Decimal, divida_renda: Decimal, meses_reserva: Decimal,
) -> dict[str, Any]:
    """Score 0-100. Pesos: poupança 40%, dívida/renda 30%, reserva 30%."""
    poup = min(max(taxa_poupanca, Decimal("0")), Decimal("0.20"))
    pts_p = int((poup / Decimal("0.20") * 100).to_integral_value())
    div = min(max(divida_renda, Decimal("0")), Decimal("1.0"))
    pts_d = int(((Decimal("1.0") - div) * 100).to_integral_value())
    res = min(max(meses_reserva, Decimal("0")), Decimal("6"))
    pts_r = int((res / Decimal("6") * 100).to_integral_value())
    score = max(0, min(100, int(Decimal("0.40") * pts_p + Decimal("0.30") * pts_d + Decimal("0.30") * pts_r)))
    nivel = "Excelente" if score >= 80 else "Bom" if score >= 60 else "Regular" if score >= 40 else "Atenção" if score >= 20 else "Crítico"
    return {
        "score": score, "nivel": nivel,
        "breakdown": {
            "poupanca": {"pontos": pts_p, "peso": 0.40},
            "divida": {"pontos": pts_d, "peso": 0.30},
            "reserva": {"pontos": pts_r, "peso": 0.30},
        },
    }


def diagnostico_gastos(
    transactions: list[dict[str, Any]], renda_mensal: Decimal = Decimal("0"),
) -> dict[str, Any]:
    """Analisa transações e gera diagnóstico agregado por categoria."""
    por_categoria: dict[str, Decimal] = defaultdict(Decimal)
    total_creditos = Decimal("0")
    total_debitos = Decimal("0")
    cats_fixas = {"moradia", "aluguel", "condominio", "luz", "agua", "gas",
                  "internet", "telefone", "plano_saude", "escola", "faculdade"}
    fixos = Decimal("0")
    variaveis = Decimal("0")
    merchant_counter: dict[str, list[Decimal]] = defaultdict(list)

    for tx in transactions:
        valor = Decimal(str(tx.get("valor", 0)))
        tipo = tx.get("tipo", "debito")
        categoria = tx.get("categoria", "outros") or "outros"
        descricao = tx.get("descricao", "")
        if tipo == "credito":
            total_creditos += valor
        else:
            total_debitos += valor
            por_categoria[categoria] += valor
            if categoria.lower() in cats_fixas:
                fixos += valor
            else:
                variaveis += valor
            if descricao:
                merchant_counter[descricao.lower()].append(valor)

    assinaturas = []
    for merchant, valores in merchant_counter.items():
        if len(valores) >= 2:
            valor_mode = max(set(valores), key=valores.count)
            if valores.count(valor_mode) >= 2:
                assinaturas.append({"nome": merchant, "valor": _round(valor_mode), "ocorrencias": valores.count(valor_mode)})

    renda = renda_mensal if renda_mensal > 0 else total_creditos
    taxa_poup = (renda - total_debitos) / renda if renda > 0 else Decimal("0")
    return {
        "por_categoria": {k: _round(v) for k, v in sorted(por_categoria.items(), key=lambda x: x[1], reverse=True)},
        "total_creditos": _round(total_creditos), "total_debitos": _round(total_debitos),
        "fixos": _round(fixos), "variaveis": _round(variaveis),
        "taxa_poupanca": _round(taxa_poup), "assinaturas_detectadas": assinaturas,
    }


def equivalencia_taxa(taxa: Decimal, de: str, para: str) -> Decimal:
    """Converte taxa: mensal ↔ anual ↔ cdi_pct. CDI ref = 14.75% a.a."""
    valid = {"mensal", "anual", "cdi_pct"}
    if de not in valid or para not in valid:
        raise ValueError(f"Periodicidade deve ser: {valid}")
    if de == para:
        return taxa
    CDI = Decimal("0.1475")
    if de == "mensal":
        mensal = taxa
    elif de == "anual":
        mensal = (Decimal("1") + taxa) ** (Decimal("1") / Decimal("12")) - Decimal("1")
    else:
        mensal = (Decimal("1") + CDI * taxa / Decimal("100")) ** (Decimal("1") / Decimal("12")) - Decimal("1")
    if para == "mensal":
        return _round(mensal)
    elif para == "anual":
        return _round((Decimal("1") + mensal) ** Decimal("12") - Decimal("1"))
    else:
        anual = (Decimal("1") + mensal) ** Decimal("12") - Decimal("1")
        return _round(anual / CDI * Decimal("100"))


def comparar_rentabilidade(
    valor_inicial: Decimal, aporte_mensal: Decimal, meses: int,
    selic_anual: Decimal = Decimal("0.1475"),
) -> dict[str, Any]:
    """Compara poupança vs CDB 100% CDI vs Tesouro Selic, com IR regressivo."""
    if meses <= 0:
        raise ValueError("Meses deve ser positivo")
    # Poupança
    taxa_poup = Decimal("0.005") if selic_anual > Decimal("0.085") else selic_anual * Decimal("0.70") / Decimal("12")
    r_poup = juros_compostos(valor_inicial, aporte_mensal, taxa_poup, meses)
    # CDB
    taxa_cdi = (Decimal("1") + selic_anual) ** (Decimal("1") / Decimal("12")) - Decimal("1")
    r_cdb = juros_compostos(valor_inicial, aporte_mensal, taxa_cdi, meses)
    dias = meses * 30
    aliq = Decimal("0.225") if dias <= 180 else Decimal("0.20") if dias <= 360 else Decimal("0.175") if dias <= 720 else Decimal("0.15")
    ir_cdb = r_cdb["total_juros"] * aliq
    # Tesouro
    taxa_tes = (Decimal("1") + selic_anual - Decimal("0.002")) ** (Decimal("1") / Decimal("12")) - Decimal("1")
    r_tes = juros_compostos(valor_inicial, aporte_mensal, taxa_tes, meses)
    ir_tes = r_tes["total_juros"] * aliq
    return {
        "poupanca": {"valor_final": r_poup["valor_final"], "juros": r_poup["total_juros"], "isento_ir": True},
        "cdb_100_cdi": {"valor_final_liquido": _round(r_cdb["valor_final"] - ir_cdb), "ir": _round(ir_cdb), "aliquota": str(aliq)},
        "tesouro_selic": {"valor_final_liquido": _round(r_tes["valor_final"] - ir_tes), "ir": _round(ir_tes), "aliquota": str(aliq)},
        "premissas": {"selic_anual": str(selic_anual), "meses": meses},
    }


def simular_carteira_acoes(
    valor_inicial: Decimal,
    aporte_mensal: Decimal,
    meses: int,
    tickers_pesos: list[dict[str, Any]],
) -> dict[str, Any]:
    """Simula uma carteira de ações. Usa premissas educacionais baseadas nos pesos.
    tickers_pesos = [{"ticker": "PETR4", "peso": 0.4}, {"ticker": "VALE3", "peso": 0.6}]
    """
    if meses <= 0:
        raise ValueError("Meses deve ser positivo")
    if not tickers_pesos:
        raise ValueError("Ao menos um ticker deve ser informado")
        
    # Mock de retornos anuais educacionais (apenas para a simulação)
    # Na vida real isso buscaria de uma API como YFinance
    historico_mock = {
        "PETR4": Decimal("0.18"),
        "VALE3": Decimal("0.12"),
        "ITUB4": Decimal("0.15"),
        "WEGE3": Decimal("0.25"),
        "BBDC4": Decimal("0.08"),
        "B3SA3": Decimal("0.10"),
    }
    
    retorno_carteira_anual = Decimal("0")
    for t in tickers_pesos:
        ticker = str(t["ticker"]).upper()
        peso = Decimal(str(t["peso"]))
        # Se não tiver o ticker no mock, assume 10% a.a
        retorno = historico_mock.get(ticker, Decimal("0.10"))
        retorno_carteira_anual += retorno * peso
        
    # Converte retorno anual esperado da carteira para mensal
    taxa_mensal = (Decimal("1") + retorno_carteira_anual) ** (Decimal("1") / Decimal("12")) - Decimal("1")
    
    saldo = valor_inicial
    total_investido = valor_inicial
    evolucao = [{"mes": 0, "saldo": _round(saldo)}]
    for mes in range(1, meses + 1):
        saldo = saldo * (Decimal("1") + taxa_mensal) + aporte_mensal
        total_investido += aporte_mensal
        evolucao.append({"mes": mes, "saldo": _round(saldo)})
        
    total_lucro = saldo - total_investido
    
    return {
        "valor_final": _round(saldo),
        "total_investido": _round(total_investido),
        "total_lucro": _round(total_lucro),
        "retorno_anual_projetado": _round(retorno_carteira_anual * Decimal("100")),
        "evolucao": evolucao,
        "premissas": "Simulação baseada em retornos históricos médios fictícios. Não é garantia de rentabilidade futura."
    }

