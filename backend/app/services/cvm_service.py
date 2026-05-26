"""Servicos para CVM Dados Abertos.

As cotas de fundos retornadas aqui sao historicas e servem somente para
simulacoes educacionais. Nao ha recomendacao de fundos.
"""

from __future__ import annotations

from datetime import date
from io import BytesIO
from typing import Any
import zipfile

import pandas as pd
import requests


DISCLAIMER = "Cota historica usada apenas para simulacao educacional. Nao representa recomendacao de investimento."


def baixar_informe_diario_fundos(ano: int, mes: int) -> pd.DataFrame:
    url = f"https://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS/inf_diario_fi_{ano}{mes:02d}.zip"
    response = requests.get(url, timeout=30)
    response.raise_for_status()

    with zipfile.ZipFile(BytesIO(response.content)) as z:
        csv_name = z.namelist()[0]
        with z.open(csv_name) as file:
            return pd.read_csv(file, sep=";", encoding="latin1")


def get_fund_quota_by_cnpj(cnpj: str, ano: int, mes: int) -> dict[str, Any]:
    try:
        df = baixar_informe_diario_fundos(ano, mes)
        fund_rows = df[df["CNPJ_FUNDO"].astype(str) == cnpj]
        if fund_rows.empty:
            raise ValueError("CNPJ nao encontrado no informe diario selecionado.")

        fund_rows = fund_rows.sort_values("DT_COMPTC")
        last = fund_rows.iloc[-1]
        return {
            "source": "CVM Dados Abertos",
            "indicator": "Cota de fundo",
            "cnpj": cnpj,
            "value": float(last["VL_QUOTA"]),
            "unit": "valor da cota",
            "date": str(last["DT_COMPTC"])[:10],
            "usage": "educational_simulation",
            "educational_disclaimer": DISCLAIMER,
            "success": True,
            "error": None,
        }
    except Exception as exc:
        return {
            "source": "fallback local",
            "indicator": "Cota de fundo",
            "cnpj": cnpj,
            "value": None,
            "unit": "valor da cota",
            "date": date.today().isoformat(),
            "usage": "educational_simulation",
            "educational_disclaimer": DISCLAIMER,
            "success": False,
            "error": f"CVM Dados Abertos indisponivel: {exc}",
        }
