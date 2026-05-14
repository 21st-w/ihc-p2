"""
Dynamic Agent Factory
Padrão de projeto que permite isolar a lógica de agentes em nós dinâmicos
e registrar novos agentes "on the fly" caso padrões novos sejam detectados.
"""
from typing import Callable, Dict, Any
from langgraph.graph import StateGraph
import logging

logger = logging.getLogger(__name__)

class AgentRegistry:
    def __init__(self):
        self._nodes: Dict[str, Callable] = {}
        
    def register(self, name: str, node_func: Callable):
        """Registra um nó isolado na fábrica de agentes."""
        if name in self._nodes:
            logger.warning(f"Agente {name} já está registrado e será sobrescrito.")
        self._nodes[name] = node_func
        logger.info(f"Agente {name} registrado com sucesso.")
        
    def get_all_nodes(self) -> Dict[str, Callable]:
        return self._nodes
        
    def generate_new_agent(self, topic: str):
        """
        Cria um novo nó de agente programaticamente para lidar com um padrão não mapeado.
        Em um sistema real, isso acionaria uma LLM (ex: O1) para escrever o código Python 
        do agente, testar e plugar aqui. Por enquanto, criamos uma função dinamicamente.
        """
        node_name = f"dynamic_{topic.lower().replace(' ', '_')}_agent"
        
        def dynamic_node(state):
            from langchain_core.messages import AIMessage
            from langchain_ollama import ChatOllama
            
            llm = ChatOllama(model="llama3.2", temperature=0)
            messages = list(state["messages"])
            sys_msg = AIMessage(content=f"Você é um agente isolado especialista recém-criado em {topic}.")
            messages.insert(0, sys_msg)
            
            response = llm.invoke(messages)
            return {"messages": [response], "next_agent": "FINISH"}
            
        self.register(node_name, dynamic_node)
        return node_name

# Singleton Registry
registry = AgentRegistry()
