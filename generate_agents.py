import os

AGENTS = {
    "supervisor.py": '''
"""
Supervisor Agent
Orquestra o fluxo conversacional e decide qual agente especialista invocar.
Utiliza o Financial Planning MOC como base de conhecimento mestre.
"""
from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next_agent: str
    user_id: str

def supervisor_node(state: AgentState):
    """
    Nó principal do LangGraph.
    Analisa a última mensagem e decide o roteamento:
    - budget_advisor
    - investment_advisor
    - insights_agent
    - subscription_auditor
    - categorization_agent
    - responder diretamente (se for bate-papo geral)
    """
    # Lógica de LLM para decisão de roteamento (Placeholder)
    return {"next_agent": "budget_advisor"}  # Mock
''',

    "budget_advisor.py": '''
"""
Budget Advisor Agent
Responsável por orçamentos, regra 50/30/20 e orçamento base zero.
Uso de Programação Linear (scipy.optimize.linprog) para otimização.
"""
from typing import Dict, Any

def get_budget(user_id: str) -> Dict[str, Any]:
    """Tool: Consulta o orçamento atual do usuário."""
    return {"status": "success", "data": "Mock budget data"}

def project_month_end(user_id: str) -> Dict[str, Any]:
    """Tool: Projeta os gastos até o fim do mês."""
    return {"status": "success", "data": "Mock projection"}

def suggest_allocation(user_id: str, income: float) -> Dict[str, Any]:
    """
    Tool: Sugere alocação ótima usando LP.
    Exemplo prático de math tool acoplada ao agente.
    """
    # Otimização linear mock
    return {"status": "success", "data": {"necessidades": income * 0.5}}

def budget_advisor_node(state):
    """Nó do Budget Advisor."""
    # LLM avalia tools ou responde
    return state
''',

    "investment_advisor.py": '''
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
''',

    "insights_agent.py": '''
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
''',

    "subscription_auditor.py": '''
"""
Subscription Auditor Agent
Responsável por assinaturas recorrentes, auditoria trimestral.
Uso de FFT (periodicidade) e K-Means (duplicatas).
"""
from typing import Dict, Any

def list_subscriptions(user_id: str) -> Dict[str, Any]:
    """Tool: Lista todas as assinaturas detectadas."""
    return {"status": "success", "data": []}

def detect_duplicates(user_id: str) -> Dict[str, Any]:
    """Tool: K-Means para encontrar assinaturas redundantes (ex: 2 streamings de música)."""
    return {"status": "success", "data": "Mock K-Means duplicates"}

def estimate_annual_cost(user_id: str) -> Dict[str, Any]:
    """Tool: Calcula o impacto anualizado do Efeito Latte em assinaturas."""
    return {"status": "success", "data": "Mock annual cost"}

def subscription_auditor_node(state):
    """Nó do Subscription Auditor."""
    return state
''',

    "categorization_agent.py": '''
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
''',
    
    "graph.py": '''
"""
LangGraph Workflow Definition
Conecta todos os nós (agentes) em um grafo de roteamento condicional.
"""
# from langgraph.graph import StateGraph, END
from app.agents.supervisor import AgentState, supervisor_node
from app.agents.budget_advisor import budget_advisor_node
from app.agents.investment_advisor import investment_advisor_node
from app.agents.insights_agent import insights_node
from app.agents.subscription_auditor import subscription_auditor_node
from app.agents.categorization_agent import categorization_node

def create_fintrack_graph():
    """
    Cria e compila o grafo LangGraph.
    O Supervisor decide para qual nó rotear com base no estado atual.
    """
    # graph = StateGraph(AgentState)
    
    # graph.add_node("supervisor", supervisor_node)
    # graph.add_node("budget_advisor", budget_advisor_node)
    # graph.add_node("investment_advisor", investment_advisor_node)
    # graph.add_node("insights_agent", insights_node)
    # graph.add_node("subscription_auditor", subscription_auditor_node)
    # graph.add_node("categorization_agent", categorization_node)
    
    # graph.set_entry_point("supervisor")
    # ... configuração de roteamento condicional ...
    
    # return graph.compile()
    pass
'''
}

def create_files(base_dir, notes_dict):
    os.makedirs(base_dir, exist_ok=True)
    for filename, content in notes_dict.items():
        with open(os.path.join(base_dir, filename), "w", encoding="utf-8") as f:
            f.write(content.strip() + "\n")

if __name__ == "__main__":
    create_files("backend/app/agents", AGENTS)
    print("✅ Agent skeletons generated successfully.")
