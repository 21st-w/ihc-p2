"""
Insights Agent
Responsável por detectar anomalias (Z-score), tendências (EMA) e sazonalidade.
Analisa o efeito latte e inflação do estilo de vida.
"""
from typing import Dict, Any

def query_transactions(user_id: str, filters: dict) -> Dict[str, Any]:
    """Tool: Consulta transações avançada."""
    return {"status": "success", "data": []}

def compare_periods(user_id: str, period1: str, period2: str) -> Dict[str, Any]:
    """Tool: Compara gastos entre meses/anos."""
    return {"status": "success", "data": "Mock comparison"}

def detect_anomalies(user_id: str) -> Dict[str, Any]:
    """Tool: Z-score para encontrar outliers nos gastos (anomalias)."""
    return {"status": "success", "anomalies": ["Gasto atípico detectado em Lazer"]}

def insights_node(state):
    """Nó do Insights Agent."""
    return state
