"""Tio Patinhas — Configuração central."""

import os
from pathlib import Path

# Diretório raiz do projeto (2 níveis acima deste arquivo)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Banco de dados SQLite
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'tio_patinhas.db'}")

# Obsidian Vault
OBSIDIAN_VAULT_PATH = Path(os.getenv("OBSIDIAN_VAULT_PATH", str(BASE_DIR / "obsidian-vault")))

# CORS — permitir frontend local
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
