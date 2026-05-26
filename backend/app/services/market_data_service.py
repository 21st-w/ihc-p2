"""Camada central de dados de mercado para simulacoes educacionais."""

from __future__ import annotations

from datetime import date, datetime
from time import time
from typing import Any, Callable

from app.services import bcb_service, brapi_service, cvm_service


CACHE_TTL_SECONDS = 900
DISCLAIMER = "Dado usado apenas para simulacao educacional. Nao representa recomendacao de investimento."
_CACHE: dict[str, tuple[float, dict[str, Any]]] = {}


def _cached(key: str, loader: Callable[[], dict[str, Any]]) -> dict[str, Any]:
    now = time()
    cached = _CACHE.get(key)
    if cached and now - cached[0] < CACHE_TTL_SECONDS:
        return {**cached[1], "cached": True}

    result = loader()
    normalized = _normalize(result)
    _CACHE[key] = (now, normalized)
    return {**normalized, "cached": False}


def _normalize(payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "source": payload.get("source", "fallback local"),
        "indicator": payload.get("indicator", "Indicador"),
        "value": payload.get("value"),
        "unit": payload.get("unit", ""),
        "date": payload.get("date") or date.today().isoformat(),
        "usage": payload.get("usage", "educational_simulation"),
        "educational_disclaimer": payload.get("educational_disclaimer", DISCLAIMER),
        "success": bool(payload.get("success")),
        "error": payload.get("error"),
        **({"ticker": payload["ticker"]} if "ticker" in payload else {}),
        **({"cnpj": payload["cnpj"]} if "cnpj" in payload else {}),
    }


def _decimal_monthly_from_annual_percent(annual_percent: float) -> float:
    annual_decimal = annual_percent / 100
    return (1 + annual_decimal) ** (1 / 12) - 1


def simulate_poupanca_rate(selic_meta_annual: float, tr_monthly: float) -> dict[str, Any]:
    if selic_meta_annual > 8.5:
        monthly_rate = (tr_monthly / 100) + 0.005
    else:
        monthly_rate = (tr_monthly / 100) + (_decimal_monthly_from_annual_percent(selic_meta_annual) * 0.70)

    return {
        "source": "Regra da poupanca + dados publicos",
        "indicator": "Poupanca",
        "value": round(monthly_rate, 6),
        "unit": "ao mes",
        "date": date.today().isoformat(),
        "usage": "educational_simulation",
        "educational_disclaimer": "Estimativa educacional simplificada. Nao representa recomendacao de investimento.",
        "success": True,
        "error": None,
    }


def get_selic() -> dict[str, Any]:
    return _cached("selic", bcb_service.get_selic)


def get_ipca() -> dict[str, Any]:
    return _cached("ipca", bcb_service.get_ipca)


def get_cdi() -> dict[str, Any]:
    return _cached("cdi", bcb_service.get_cdi)


def get_tr() -> dict[str, Any]:
    return _cached("tr", bcb_service.get_tr)


def get_poupanca() -> dict[str, Any]:
    def load() -> dict[str, Any]:
        selic_meta = bcb_service.get_selic_meta()
        tr = bcb_service.get_tr()
        if not selic_meta.get("success") or not tr.get("success"):
            return {
                "source": "fallback local",
                "indicator": "Poupanca",
                "value": None,
                "unit": "ao mes",
                "date": date.today().isoformat(),
                "usage": "educational_simulation",
                "educational_disclaimer": "Estimativa educacional simplificada. Nao representa recomendacao de investimento.",
                "success": False,
                "error": "Nao foi possivel carregar Selic Meta e TR para simular a poupanca.",
            }
        return simulate_poupanca_rate(float(selic_meta["value"]), float(tr["value"]))

    return _cached("poupanca", load)


def get_quote(ticker: str) -> dict[str, Any]:
    return _cached(f"quote:{ticker.upper()}", lambda: brapi_service.get_market_quote(ticker))


def get_fund_quota(cnpj: str, ano: int | None = None, mes: int | None = None) -> dict[str, Any]:
    today = datetime.today()
    year = ano or today.year
    month = mes or today.month
    return _cached(f"fund:{cnpj}:{year}:{month}", lambda: cvm_service.get_fund_quota_by_cnpj(cnpj, year, month))


def get_market_snapshot() -> dict[str, Any]:
    indicators = {
        "selic": get_selic(),
        "cdi": get_cdi(),
        "ipca": get_ipca(),
        "tr": get_tr(),
        "poupanca": get_poupanca(),
    }
    return {
        "source": "Market Data Service",
        "usage": "educational_simulation",
        "educational_disclaimer": DISCLAIMER,
        "success": any(item.get("success") for item in indicators.values()),
        "indicators": indicators,
    }
