"""Integração tolerante a falhas com Ollama."""

from typing import Any

import httpx

from app.config import AI_ENABLED, OLLAMA_BASE_URL, OLLAMA_CHAT_MODEL, OLLAMA_EMBED_MODEL


TIMEOUT_SECONDS = 20.0


def is_ollama_available() -> bool:
    if not AI_ENABLED:
        return False
    try:
        with httpx.Client(timeout=3.0) as client:
            response = client.get(f"{OLLAMA_BASE_URL}/api/tags")
        return response.status_code == 200
    except Exception:
        return False


def generate_text(prompt: str, model: str | None = None) -> dict[str, Any]:
    selected_model = model or OLLAMA_CHAT_MODEL
    if not AI_ENABLED:
        return {
            "success": False,
            "model": selected_model,
            "response": "",
            "error": "AI_ENABLED=false",
            "fallback_used": False,
        }

    try:
        payload = {"model": selected_model, "prompt": prompt, "stream": False}
        with httpx.Client(timeout=TIMEOUT_SECONDS) as client:
            response = client.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload)
        response.raise_for_status()
        data = response.json()
        return {
            "success": True,
            "model": selected_model,
            "response": data.get("response", ""),
            "error": None,
            "fallback_used": False,
        }
    except Exception as exc:
        return {
            "success": False,
            "model": selected_model,
            "response": "",
            "error": str(exc),
            "fallback_used": False,
        }


def generate_embedding(text: str, model: str | None = None) -> list[float]:
    selected_model = model or OLLAMA_EMBED_MODEL
    if not AI_ENABLED or not text.strip():
        return []

    try:
        payload = {"model": selected_model, "prompt": text}
        with httpx.Client(timeout=TIMEOUT_SECONDS) as client:
            response = client.post(f"{OLLAMA_BASE_URL}/api/embeddings", json=payload)
        response.raise_for_status()
        embedding = response.json().get("embedding", [])
        return [float(value) for value in embedding]
    except Exception:
        return []


def safe_generate_text(prompt: str, fallback: str) -> dict[str, Any]:
    result = generate_text(prompt)
    if result.get("success") and result.get("response"):
        return result
    return {
        "success": False,
        "model": result.get("model", OLLAMA_CHAT_MODEL),
        "response": fallback,
        "error": result.get("error"),
        "fallback_used": True,
    }
