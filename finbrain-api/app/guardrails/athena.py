"""Tio Patinhas — Athena: sistema de guardrails em 2 camadas.

Camada 1: regex/keyword (determinístico, instantâneo).
Camada 2: disclaimer injection (obrigatório, não desabilitável).
"""

import re
from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class AthenaResult:
    """Resultado da validação de guardrails."""
    texto_final: str
    bloqueios: list[str] = field(default_factory=list)
    ok: bool = True
    validado_em: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# Palavras e padrões bloqueados
BLOCKED_PHRASES = [
    "compre", "venda", "invista em", "vai subir", "vai cair",
    "rentabilidade garantida", "retorno garantido", "não perca",
    "oportunidade única", "oportunidade de compra", "hora de entrar",
    "hora de comprar", "hora de vender", "recomendo comprar",
    "recomendo vender", "sugiro comprar", "sugiro investir",
]

# Regex para tickers brasileiros (PETR4, VALE3, BBAS3, etc.)
TICKER_PATTERN = re.compile(r"\b[A-Z]{4}\d{1,2}\b")

# Compile phrase patterns for efficiency
PHRASE_PATTERNS = [
    re.compile(re.escape(phrase), re.IGNORECASE) for phrase in BLOCKED_PHRASES
]

DISCLAIMER = (
    "\n\n⚠️ Simulação educacional. Não é recomendação de investimento. "
    "Performance passada não garante resultados futuros."
)


def _check_blocked_phrases(text: str) -> list[str]:
    """Check for blocked phrases in text."""
    found = []
    for pattern in PHRASE_PATTERNS:
        matches = pattern.findall(text)
        if matches:
            found.extend(matches)
    return found


def _check_tickers(text: str) -> list[str]:
    """Check for stock tickers in text."""
    return TICKER_PATTERN.findall(text)


def _sanitize(text: str, blocked: list[str]) -> str:
    """Replace blocked content with [bloqueado por compliance]."""
    result = text
    for phrase in blocked:
        result = re.sub(
            re.escape(phrase),
            "[bloqueado por compliance]",
            result,
            flags=re.IGNORECASE,
        )
    return result


def validar(texto: str, allow_tickers: bool = False) -> AthenaResult:
    """Valida uma resposta de agente através das camadas de guardrail.

    Camada 1: Bloqueia frases proibidas e tickers.
    Camada 2: Injeta disclaimer obrigatório.

    Args:
        texto: Texto da resposta do agente a ser validado.

    Returns:
        AthenaResult com texto_final processado, lista de bloqueios e status.
    """
    bloqueios: list[str] = []

    # Camada 1 — Palavras/frases bloqueadas
    phrases_found = _check_blocked_phrases(texto)
    if phrases_found:
        bloqueios.extend([f"Frase bloqueada: '{p}'" for p in phrases_found])

    # Camada 1 — Tickers
    tickers_found = []
    if not allow_tickers:
        tickers_found = _check_tickers(texto)
        if tickers_found:
            bloqueios.extend([f"Ticker bloqueado: {t}" for t in tickers_found])

    # Sanitize if needed
    all_blocked = phrases_found + tickers_found
    if all_blocked:
        texto_limpo = _sanitize(texto, all_blocked)
    else:
        texto_limpo = texto

    # Camada 2 — Disclaimer injection (sempre)
    if DISCLAIMER.strip() not in texto_limpo:
        texto_limpo += DISCLAIMER

    ok = len(bloqueios) == 0
    return AthenaResult(texto_final=texto_limpo, bloqueios=bloqueios, ok=ok)


async def validar_stream(generator, allow_tickers: bool = False):
    """Valida uma resposta de agente que está sendo gerada em streaming.
    
    Aplica a sanitização por chunk e injeta o disclaimer obrigatório no final.
    """
    full_text = ""
    try:
        if hasattr(generator, "__aiter__"):
            async for chunk in generator:
                sanitized_chunk = _sanitize(chunk, BLOCKED_PHRASES)
                full_text += sanitized_chunk
                yield sanitized_chunk
        else:
            for chunk in generator:
                sanitized_chunk = _sanitize(chunk, BLOCKED_PHRASES)
                full_text += sanitized_chunk
                yield sanitized_chunk
    except Exception as e:
        yield f"\n\n[Erro na geração: {str(e)}]"

    if DISCLAIMER.strip() not in full_text:
        yield DISCLAIMER
