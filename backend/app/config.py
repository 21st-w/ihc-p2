"""Tio Patinhas — Configuração central."""

import os
from pathlib import Path

# Diretório raiz do projeto (2 níveis acima deste arquivo)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Banco de dados SQLite
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'tio_patinhas.db'}")

# Obsidian Vault
OBSIDIAN_VAULT_PATH = Path(os.getenv("OBSIDIAN_VAULT_PATH", str(BASE_DIR / "obsidian-vault")))

# IA local via Ollama
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL", "llama3.1:8b")
OLLAMA_EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")
AI_ENABLED = os.getenv("AI_ENABLED", "true").lower() == "true"
RAG_TOP_K = int(os.getenv("RAG_TOP_K", "5"))

# CORS — permitir frontend local
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
