"""FinBrain — Yuyu: agente de indicadores de mercado (BCB SGS API).

Busca Selic, IPCA 12m e USD/BRL do Banco Central.
Cache em memória por 1 hora.
"""

from dataclasses import dataclass
from datetime import datetime, timezone, timedelta
from typing import Any

import httpx


@dataclass
class MarketSnapshot:
    """Snapshot dos indicadores de mercado."""
    selic: str
    ipca_12m: str
    dolar: str
    atualizado_em: str


# BCB SGS series codes
SERIES = {
    "selic": 432,       # Selic meta
    "ipca_12m": 13522,  # IPCA acumulado 12 meses
    "dolar": 1,         # USD/BRL (PTAX venda)
}

BCB_BASE_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.{code}/dados/ultimos/1?formato=json"

# In-memory cache
_cache: dict[str, Any] = {"data": None, "expires": None}
CACHE_TTL = timedelta(hours=1)


async def _fetch_indicator(code: int) -> str:
    """Fetch a single indicator from BCB SGS API."""
    url = BCB_BASE_URL.format(code=code)
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
            if data and len(data) > 0:
                return data[0].get("valor", "N/A")
    except Exception:
        pass
    return "N/A"


def _fetch_indicator_sync(code: int) -> str:
    """Fetch a single indicator synchronously (fallback)."""
    url = BCB_BASE_URL.format(code=code)
    try:
        with httpx.Client(timeout=10.0) as client:
            resp = client.get(url)
            resp.raise_for_status()
            data = resp.json()
            if data and len(data) > 0:
                return data[0].get("valor", "N/A")
    except Exception:
        pass
    return "N/A"


def get_indicadores_sync() -> MarketSnapshot:
    """Get market indicators synchronously with 1-hour cache."""
    now = datetime.now(timezone.utc)

    if _cache["data"] and _cache["expires"] and now < _cache["expires"]:
        return _cache["data"]

    selic = _fetch_indicator_sync(SERIES["selic"])
    ipca = _fetch_indicator_sync(SERIES["ipca_12m"])
    dolar = _fetch_indicator_sync(SERIES["dolar"])

    snapshot = MarketSnapshot(
        selic=selic,
        ipca_12m=ipca,
        dolar=dolar,
        atualizado_em=now.isoformat(),
    )

    _cache["data"] = snapshot
    _cache["expires"] = now + CACHE_TTL
    return snapshot


def get_indicadores_mock() -> MarketSnapshot:
    """Return mock data for development without external APIs."""
    return MarketSnapshot(
        selic="14,75",
        ipca_12m="5,53",
        dolar="5,6520",
        atualizado_em=datetime.now(timezone.utc).isoformat(),
    )
