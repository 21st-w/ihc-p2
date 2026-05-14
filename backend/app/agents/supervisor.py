"""
Supervisor Agent
Orquestra o fluxo conversacional e decide qual agente especialista invocar,
ou responde diretamente ao usuário se for uma pergunta geral.
"""
from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_ollama import ChatOllama

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next_agent: str
    user_id: str

def supervisor_node(state: AgentState):
    """
    Nó principal do LangGraph.
    Para o FinTrack, o Supervisor usa o LLaMA local para responder perguntas.
    Em uma implementação mais complexa, ele usaria tool calling para decidir roteamento.
    """
    # Inicializa o modelo local
    llm = ChatOllama(model="llama3.2", temperature=0.3)
    
    # Prepara as mensagens com um system prompt básico
    system_prompt = AIMessage(content="""
Você é o Tio Patinhas, o "Second Brain" financeiro autônomo do usuário.
Você é incrivelmente astuto com dinheiro, direto, rigoroso e utiliza os princípios da Regra 50/30/20 e Orçamento Base Zero.
Responda sempre em português brasileiro de forma concisa. Se apresente como Tio Patinhas.
""")
    
    all_messages = [system_prompt] + list(state["messages"])
    
    try:
        response = llm.invoke(all_messages)
        # Por enquanto, o Supervisor responde direto (fim do grafo)
        return {"messages": [response], "next_agent": "FINISH"}
    except Exception as e:
        error_msg = AIMessage(content=f"Desculpe, ocorreu um erro de conexão com o Ollama local: {str(e)}")
        return {"messages": [error_msg], "next_agent": "FINISH"}
