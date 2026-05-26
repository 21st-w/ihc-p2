"""Serviço fino para embeddings locais via Ollama."""

from app.services.llm_service import generate_embedding


def embed_text(text: str) -> list[float]:
    return generate_embedding(text)


def embed_many(texts: list[str]) -> list[list[float]]:
    return [embed_text(text) for text in texts]
