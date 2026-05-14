"""
Audit Logger — Registro seguro de auditoria.

Regra 27: Registra ações críticas (login, CRUD, agentes, API keys).
Regra 13: Nunca loga senha, token, prompt sensível ou conteúdo de nota.
"""
import logging
import hashlib
from datetime import datetime, timezone
from uuid import uuid4

logger = logging.getLogger("audit")

# Campos que NUNCA devem aparecer em logs de auditoria
FORBIDDEN_FIELDS = frozenset([
    "password", "hashed_password", "token", "refresh_token",
    "api_key", "secret_key", "jwt", "prompt", "response",
    "raw_request", "raw_response", "note_content", "embedding",
])

def _hash_value(value: str) -> str:
    """Hash para anonimizar dados sensíveis como IP e User-Agent."""
    return hashlib.sha256(value.encode()).hexdigest()[:16]

def audit_log(
    actor_id: str,
    action: str,
    resource_type: str,
    resource_id: str | None = None,
    organization_id: str | None = None,
    status: str = "success",
    ip: str | None = None,
    user_agent: str | None = None,
    extra: dict | None = None,
):
    """
    Emite evento de auditoria seguro.
    
    Segue as regras:
    - Hash de IP e User-Agent (nunca em texto puro)
    - Nunca inclui senha, token, prompt ou conteúdo sensível
    - Formato padronizado para centralização de logs
    """
    # Sanitizar extras: remover campos proibidos
    safe_extra = {}
    if extra:
        for key, value in extra.items():
            if key.lower() not in FORBIDDEN_FIELDS:
                safe_extra[key] = value
            else:
                safe_extra[key] = "[REDACTED]"
    
    event = {
        "audit_id": str(uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "actor_id": actor_id,
        "organization_id": organization_id,
        "action": action,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "status": status,
        "ip_hash": _hash_value(ip) if ip else None,
        "user_agent_hash": _hash_value(user_agent) if user_agent else None,
        **safe_extra,
    }
    
    logger.info(f"AUDIT: {event}")
