from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
# from app.api.deps import get_current_user # Comentado para o teste local
from app.agents.graph import build_dynamic_graph
from langchain_core.messages import HumanMessage
import logging
import json
from langchain.globals import set_llm_cache
from langchain.cache import InMemoryCache

# Implementa Cache de Memória para acelerar respostas repetidas para 0ms
set_llm_cache(InMemoryCache())

logger = logging.getLogger(__name__)
router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/")
async def chat_endpoint(
    request: Request,
    chat_request: ChatRequest
):
    """
    Endpoint de Streaming para o Tio Patinhas usando SSE (Server-Sent Events).
    """
    try:
        inputs = {
            "messages": [HumanMessage(content=chat_request.message)],
            "user_id": "mock_user_123"
        }
        
        # O Grafo agora é construído dinamicamente a cada requisição
        # para incorporar possíveis agentes criados on-the-fly
        graph = build_dynamic_graph()
        
        async def event_generator():
            try:
                # Usa astream_events ou astream para processar chunk a chunk
                # Isso faz com que a latência no frontend seja ínfima.
                async for event in graph.astream_events(inputs, version="v1"):
                    kind = event["event"]
                    # Queremos enviar tokens conforme são gerados pela LLM
                    if kind == "on_chat_model_stream":
                        content = event["data"]["chunk"].content
                        if content:
                            yield f"data: {json.dumps({'chunk': content})}\n\n"
            except Exception as stream_err:
                logger.error(f"Stream error: {stream_err}")
                
            yield "data: [DONE]\n\n"

        return StreamingResponse(event_generator(), media_type="text/event-stream")
        
    except Exception as e:
        logger.error(f"Erro no chat LangGraph: {e}")
        raise HTTPException(status_code=500, detail="INTERNAL_ERROR")
