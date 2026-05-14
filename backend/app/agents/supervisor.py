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
