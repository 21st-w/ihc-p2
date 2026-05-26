"""Quebra de nodos Markdown em chunks pequenos para RAG."""

import re


def _clean(text: str) -> str:
    return re.sub(r"\n{3,}", "\n\n", re.sub(r"[ \t]+", " ", text or "")).strip()


def chunk_text(text: str, max_chars: int = 1200, overlap: int = 150) -> list[str]:
    clean = _clean(text)
    if not clean:
        return []

    paragraphs = [p.strip() for p in clean.split("\n\n") if p.strip()]
    chunks: list[str] = []
    current = ""

    for paragraph in paragraphs:
        if len(paragraph) > max_chars:
            if current:
                chunks.append(current.strip())
                current = ""
            start = 0
            while start < len(paragraph):
                part = paragraph[start:start + max_chars].strip()
                if part:
                    chunks.append(part)
                start += max_chars - overlap
            continue

        candidate = f"{current}\n\n{paragraph}".strip() if current else paragraph
        if len(candidate) <= max_chars:
            current = candidate
        else:
            chunks.append(current.strip())
            tail = current[-overlap:].strip() if overlap and current else ""
            current = f"{tail}\n\n{paragraph}".strip() if tail else paragraph

    if current.strip():
        chunks.append(current.strip())

    return [chunk for chunk in chunks if chunk.strip()]


def chunk_node(node) -> list[dict]:
    return [
        {
            "source_title": node.title,
            "source_path": node.file_path,
            "source_type": node.type,
            "chunk_index": i,
            "content": chunk,
        }
        for i, chunk in enumerate(chunk_text(node.content))
    ]
