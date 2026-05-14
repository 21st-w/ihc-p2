"""
Categorization Agent
Processamento em background. Usa Naive Bayes ou LLM para sugerir categorias.
"""
from typing import Dict, Any

def list_uncategorized(user_id: str) -> Dict[str, Any]:
    """Tool: Lista transações sem categoria."""
    return {"status": "success", "data": []}

def set_category(user_id: str, transaction_id: str, category: str) -> Dict[str, Any]:
    """Tool: Modifica a categoria. Requer validação de BOLA."""
    return {"status": "success"}

def bulk_categorize(user_id: str, transaction_ids: list[str], category: str) -> Dict[str, Any]:
    """Tool: Categorização em lote."""
    return {"status": "success"}

def categorization_node(state):
    """Nó do Categorization Agent."""
    return state
