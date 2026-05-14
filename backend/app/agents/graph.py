"""
LangGraph Workflow Definition Dinâmico
Conecta o Supervisor Agent no grafo lendo da Agent Factory.
"""
from langgraph.graph import StateGraph, END
from app.agents.supervisor import AgentState, supervisor_node
from app.agents.factory import registry

def build_dynamic_graph():
    """
    Cria e compila o grafo LangGraph dinamicamente no momento da chamada,
    garantindo que se o Agent Factory instanciou um novo nó no tempo
    de execução (on the fly), ele seja incluído no grafo.
    """
    workflow = StateGraph(AgentState)
    
    # Adiciona o nó supervisor (sempre fixo)
    workflow.add_node("supervisor", supervisor_node)
    workflow.set_entry_point("supervisor")
    
    # Busca os nós isolados injetados dinamicamente no Registry
    nodes = registry.get_all_nodes()
    for name, node_func in nodes.items():
        workflow.add_node(name, node_func)
    
    # Roteamento (no MVP ele responde direto, mas a infra suporta nós novos)
    workflow.add_edge("supervisor", END)
    
    # Compila o grafo
    return workflow.compile()
