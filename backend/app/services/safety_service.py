"""Guardrails para manter a IA em escopo educacional."""

import re


RESTRICTED_RESPONSE = (
    "Eu posso te ajudar de forma educacional, explicando conceitos, riscos, prazos, "
    "liquidez, organização financeira e simulações. Mas não posso recomendar compra "
    "ou venda de ações, criptomoedas, fundos, FIIs, CDBs, Tesouro Direto ou qualquer "
    "ativo específico.\n\n"
    "Posso, em vez disso, ajudar a explicar riscos, simular cenários genéricos, revisar "
    "seu orçamento, falar sobre reserva de emergência ou explicar classes de ativos sem "
    "indicar produto."
)

DISCLAIMER = (
    "Esta resposta possui finalidade educacional e não representa recomendação de investimento."
)

REQUEST_PATTERNS = [
    r"qual\s+a[cç][aã]o\s+comprar",
    r"onde\s+investir",
    r"melhor\s+ativo",
    r"\bcompre\b",
    r"\bvenda\b",
    r"carteira\s+ideal",
    r"recomende\s+(uma\s+)?a[cç][aã]o",
    r"qual\s+cripto\s+comprar",
    r"invisto\s+em\s+\w+",
    r"devo\s+comprar\s+\w+",
    r"comprar\s+(bitcoin|btc|petr4|vale3|itub4|bova11)",
]

FORBIDDEN_RESPONSE_PATTERNS = [
    r"\bcompre\s+\w+",
    r"\bvenda\s+\w+",
    r"ativo\s+ideal",
    r"carteira\s+ideal",
    r"garantia\s+de\s+rentabilidade",
    r"melhor\s+a[cç][aã]o",
]


def detect_investment_recommendation_request(text: str) -> bool:
    normalized = (text or "").lower()
    return any(re.search(pattern, normalized) for pattern in REQUEST_PATTERNS)


def sanitize_ai_response(text: str) -> str:
    sanitized = text or ""
    replacements = {
        r"\bcompre\s+([A-Za-z0-9]+)": r"não posso recomendar compra de \1",
        r"\bvenda\s+([A-Za-z0-9]+)": r"não posso recomendar venda de \1",
        r"garantia\s+de\s+rentabilidade": "não há garantia de rentabilidade",
        r"carteira\s+ideal": "carteira hipotética educacional",
        r"ativo\s+ideal": "classe de ativo hipotética educacional",
    }
    for pattern, replacement in replacements.items():
        sanitized = re.sub(pattern, replacement, sanitized, flags=re.IGNORECASE)
    if DISCLAIMER not in sanitized:
        sanitized = sanitized.rstrip() + "\n\n" + DISCLAIMER
    return sanitized


def build_restricted_investment_response() -> str:
    return RESTRICTED_RESPONSE


def validate_ai_answer(text: str) -> dict:
    normalized = (text or "").lower()
    violations = [
        pattern for pattern in FORBIDDEN_RESPONSE_PATTERNS
        if re.search(pattern, normalized)
    ]
    return {
        "safe": len(violations) == 0,
        "violations": violations,
        "sanitized": sanitize_ai_response(text) if violations else text,
    }
