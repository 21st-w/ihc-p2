"""
Investment Advisor Agent
Responsável por portfólio, diversificação e perfil de risco.
Uso de otimização de Markowitz para fronteira eficiente.
"""
from typing import Dict, Any
from app.guardrails.agent_policy import validate_agent_action, INVESTMENT_DISCLAIMER

def get_user_profile(user_id: str) -> Dict[str, Any]:
    """Tool: Recupera perfil de risco do usuário (Conservador, Moderado, Arrojado)."""
    return {"status": "success", "profile": "Moderado"}

def fetch_market_data(assets: list[str]) -> Dict[str, Any]:
    """Tool: Busca dados de mercado atualizados."""
    return {"status": "success", "data": "Mock market data"}

def generate_allocation(user_id: str) -> Dict[str, Any]:
    """
    Tool: Otimização de Markowitz para fronteira eficiente.
    Retorna o disclaimer obrigatório junto com a sugestão.
    """
    validate_agent_action("generate_allocation", user_confirmed=False) # Leitura, permitido
    return {"status": "success", "data": "Mock Markowitz allocation", "disclaimer": INVESTMENT_DISCLAIMER}

def investment_advisor_node(state):
    """Nó do Investment Advisor."""
    return state
