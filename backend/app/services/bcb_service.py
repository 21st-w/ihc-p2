"""Servicos para series publicas do Banco Central do Brasil (SGS).

Os codigos abaixo ficam centralizados para facilitar ajuste futuro:
- 11: Selic diaria
- 12: CDI diario
- 433: IPCA mensal
- 226: TR mensal
- 432: Selic Meta anual

Dados sao usados apenas em simulacoes educacionais.
"""

from __future__ import annotations

from datetime import date
from typing import Any

import requests


BCB_BASE_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs"
SERIES = {
    "selic": 11,
    "cdi": 12,
    "ipca": 433,
    "tr": 226,
    "selic_meta": 432,
}
DISCLAIMER = "Dado usado apenas para simulacao educacional. Nao representa recomendacao de investimento."


def _parse_bcb_value(value: Any) -> float:
    return float(str(value).replace(",", "."))


def _parse_bcb_date(value: Any) -> str:
    text = str(value or "")
    parts = text.split("/")
    if len(parts) == 3:
        return f"{parts[2]}-{parts[1]}-{parts[0]}"
    return text or date.today().isoformat()


def get_bcb_sgs_last_values(series_id: int, n: int = 10) -> list[dict[str, Any]]:
    """Busca ultimos valores de uma serie SGS."""
    url = f"{BCB_BASE_URL}.{series_id}/dados/ultimos/{n}"
    response = requests.get(url, params={"formato": "json"}, timeout=10)
    response.raise_for_status()
    return response.json()


def get_indicator(indicator: str, unit: str, n: int = 10) -> dict[str, Any]:
    """Retorna o ultimo valor disponivel de uma serie SGS em formato padronizado."""
    series_id = SERIES[indicator]
    label = indicator.upper() if indicator != "selic" else "Selic"
    try:
        values = get_bcb_sgs_last_values(series_id, n)
        if not values:
            raise ValueError("Serie SGS retornou lista vazia.")
        last = values[-1]
        return {
            "source": "Banco Central do Brasil",
            "indicator": label,
            "value": _parse_bcb_value(last.get("valor")),
            "unit": unit,
            "date": _parse_bcb_date(last.get("data")),
            "usage": "educational_simulation",
            "educational_disclaimer": DISCLAIMER,
            "success": True,
            "error": None,
        }
    except Exception as exc:
        return {
            "source": "fallback local",
            "indicator": label,
            "value": None,
            "unit": unit,
            "date": date.today().isoformat(),
            "usage": "educational_simulation",
            "educational_disclaimer": DISCLAIMER,
            "success": False,
            "error": f"Banco Central indisponivel: {exc}",
        }


def get_selic() -> dict[str, Any]:
    return get_indicator("selic", "% ao dia")


def get_cdi() -> dict[str, Any]:
    return get_indicator("cdi", "% ao dia")


def get_ipca() -> dict[str, Any]:
    return get_indicator("ipca", "% ao mes")


def get_tr() -> dict[str, Any]:
    return get_indicator("tr", "% ao mes")


def get_selic_meta() -> dict[str, Any]:
    return get_indicator("selic_meta", "% ao ano")
