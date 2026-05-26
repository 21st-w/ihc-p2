"""Cliente minimo da brapi.dev para cotacoes educacionais."""

from __future__ import annotations

import os
from datetime import date, datetime
from typing import Any

import requests


BRAPI_TOKEN = os.getenv("BRAPI_TOKEN")
DISCLAIMER = "Cotacao usada apenas para simulacao educacional. Nao representa recomendacao de compra ou venda."


def _quote_date(value: Any) -> str:
    if isinstance(value, (int, float)):
        return datetime.fromtimestamp(value).date().isoformat()
    text = str(value or "")
    return text[:10] if text else date.today().isoformat()


def get_quote(tickers: str) -> dict[str, Any]:
    url = f"https://brapi.dev/api/quote/{tickers}"
    headers = {"Authorization": f"Bearer {BRAPI_TOKEN}"} if BRAPI_TOKEN else {}
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    return response.json()


def get_market_quote(ticker: str) -> dict[str, Any]:
    clean_ticker = ticker.strip().upper()
    try:
        data = get_quote(clean_ticker)
        result = (data.get("results") or [{}])[0]
        value = result.get("regularMarketPrice")
        quote_date = (
            result.get("regularMarketTime")
            or result.get("regularMarketDate")
            or date.today().isoformat()
        )
        return {
            "source": "brapi.dev",
            "indicator": "Cotacao",
            "ticker": clean_ticker,
            "value": float(value) if value is not None else None,
            "unit": result.get("currency") or "BRL",
            "date": _quote_date(quote_date),
            "usage": "educational_simulation",
            "educational_disclaimer": DISCLAIMER,
            "success": value is not None,
            "error": None if value is not None else "Cotacao nao encontrada.",
        }
    except Exception as exc:
        return {
            "source": "fallback local",
            "indicator": "Cotacao",
            "ticker": clean_ticker,
            "value": None,
            "unit": "BRL",
            "date": date.today().isoformat(),
            "usage": "educational_simulation",
            "educational_disclaimer": DISCLAIMER,
            "success": False,
            "error": f"brapi.dev indisponivel: {exc}",
        }
