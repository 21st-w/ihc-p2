"""Vector store simples em SQLite com embeddings JSON."""

import json
import math

from sqlalchemy.orm import Session

from app.config import RAG_TOP_K
from app.models import KnowledgeChunk, Node
from app.services.chunk_service import chunk_node
from app.services.embedding_service import embed_text


def cosine_similarity(a: list[float], b: list[float]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def save_chunk(
    db: Session,
    user_id: int,
    node_id: int | None,
    source_title: str,
    source_path: str,
    source_type: str,
    chunk_index: int,
    content: str,
    embedding: list[float],
) -> KnowledgeChunk | None:
    if not embedding:
        return None
    chunk = KnowledgeChunk(
        user_id=user_id,
        node_id=node_id,
        source_title=source_title,
        source_path=source_path or "",
        source_type=source_type or "node",
        chunk_index=chunk_index,
        content=content,
        embedding_json=json.dumps(embedding),
    )
    db.add(chunk)
    return chunk


def index_node(db: Session, user_id: int, node) -> int:
    prepared = []
    for item in chunk_node(node):
        embedding = embed_text(item["content"])
        if not embedding:
            continue
        prepared.append((item, embedding))

    if not prepared:
        return 0

    db.query(KnowledgeChunk).filter(KnowledgeChunk.node_id == node.id).delete()
    for item, embedding in prepared:
        save_chunk(
            db=db,
            user_id=user_id,
            node_id=node.id,
            source_title=item["source_title"],
            source_path=item["source_path"],
            source_type=item["source_type"],
            chunk_index=item["chunk_index"],
            content=item["content"],
            embedding=embedding,
        )
    db.commit()
    return len(prepared)


def reindex_user_nodes(db: Session, user_id: int) -> int:
    indexed = 0
    nodes = db.query(Node).filter(Node.user_id == user_id).all()
    for node in nodes:
        indexed += index_node(db, user_id, node)
    return indexed


def search_similar_chunks(db: Session, user_id: int, query: str, top_k: int = RAG_TOP_K) -> list[dict]:
    query_embedding = embed_text(query)
    if not query_embedding:
        return []

    chunks = db.query(KnowledgeChunk).filter(KnowledgeChunk.user_id == user_id).all()
    scored: list[dict] = []
    for chunk in chunks:
        try:
            embedding = json.loads(chunk.embedding_json)
        except json.JSONDecodeError:
            continue
        score = cosine_similarity(query_embedding, embedding)
        if score <= 0:
            continue
        scored.append({
            "chunk_id": chunk.id,
            "node_id": chunk.node_id,
            "source_title": chunk.source_title,
            "source_path": chunk.source_path,
            "source_type": chunk.source_type,
            "score": round(score, 4),
            "content": chunk.content,
        })

    scored.sort(key=lambda item: item["score"], reverse=True)
    return scored[:top_k]
