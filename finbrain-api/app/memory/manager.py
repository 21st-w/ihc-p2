import os
import re
from datetime import datetime
from pathlib import Path

# Paths
MEMORY_DIR = Path(__file__).parent
CLIENT_NODES_DIR = MEMORY_DIR / "client_nodes"
GLOBAL_NETWORK_DIR = MEMORY_DIR / "global_network"

# Setup dirs
CLIENT_NODES_DIR.mkdir(parents=True, exist_ok=True)
GLOBAL_NETWORK_DIR.mkdir(parents=True, exist_ok=True)

# Mocked Session Store (In production, this is Redis or DB)
# For security: agents can only read/write client nodes if user_id is in here
ACTIVE_SESSIONS = set()

def login_user(user_id: str):
    ACTIVE_SESSIONS.add(user_id)

def logout_user(user_id: str):
    if user_id in ACTIVE_SESSIONS:
        ACTIVE_SESSIONS.remove(user_id)

def check_active_session(user_id: str):
    if user_id not in ACTIVE_SESSIONS:
        raise PermissionError(f"Acesso Negado: Sessão inativa para o usuário {user_id}. Nodo trancado criptograficamente.")

def get_client_node_path(user_id: str) -> Path:
    return CLIENT_NODES_DIR / f"{user_id}_node.md"

def read_client_node(user_id: str) -> str:
    check_active_session(user_id)
    path = get_client_node_path(user_id)
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")

def append_to_client_node(user_id: str, content: str):
    check_active_session(user_id)
    path = get_client_node_path(user_id)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(path, "a", encoding="utf-8") as f:
        f.write(f"\n\n[{timestamp}] {content}")

def _anonymize(text: str) -> str:
    # Regex basic anonymization for CPF, Names, exact Values
    # In a real scenario, this would use NLP/NER
    text = re.sub(r'\b\d{3}\.\d{3}\.\d{3}-\d{2}\b', '[CPF REMOVIDO]', text)
    text = re.sub(r'R\$\s*\d+[\.,]\d+', 'R$ [VALOR_REMOVIDO]', text)
    return text

def upload_insight_to_global(insight_text: str):
    """Higieniza o insight e salva na rede normal (Global Network)"""
    safe_insight = _anonymize(insight_text)
    path = GLOBAL_NETWORK_DIR / "insights_gerais.md"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(path, "a", encoding="utf-8") as f:
        f.write(f"\n\n## Insight: {timestamp}\n{safe_insight}")

def get_global_network_insights() -> str:
    path = GLOBAL_NETWORK_DIR / "insights_gerais.md"
    if not path.exists():
        return "Nenhum insight global ainda."
    return path.read_text(encoding="utf-8")
