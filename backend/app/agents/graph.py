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
