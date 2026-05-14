"""
Guardrails dos Agentes de IA.

Regra 11: Agentes NÃO podem modificar dados sem confirmação explícita.
Regra 12: Tools devem validar autorização internamente.

Este módulo define as políticas de segurança dos agentes.
"""

class ActionRequiresConfirmation(Exception):
    """Levantada quando o agente tenta executar ação destrutiva sem confirmação."""
    def __init__(self, action: str, description: str):
        self.action = action
        self.description = description
        super().__init__(f"Ação requer confirmação: {description}")


# Ações que SEMPRE exigem confirmação explícita do usuário
DESTRUCTIVE_ACTIONS = frozenset([
    "delete_transaction",
    "delete_subscription",
    "cancel_subscription",
    "update_budget",
    "create_budget",
    "modify_allocation",
])

# Ações de SOMENTE LEITURA que não precisam de confirmação
READ_ONLY_ACTIONS = frozenset([
    "list_transactions",
    "list_subscriptions",
    "get_budget",
    "query_transactions",
    "compare_periods",
    "detect_anomalies",
    "get_user_profile",
    "fetch_market_data",
    "estimate_annual_cost",
])


def validate_agent_action(action: str, user_confirmed: bool = False) -> bool:
    """
    Valida se o agente pode executar uma ação.
    
    Regras:
    - Ações de leitura: sempre permitidas.
    - Ações destrutivas: só com confirmação explícita do usuário.
    - Ações desconhecidas: bloqueadas por padrão.
    """
    if action in READ_ONLY_ACTIONS:
        return True
    
    if action in DESTRUCTIVE_ACTIONS:
        if not user_confirmed:
            raise ActionRequiresConfirmation(
                action=action,
                description=f"O agente precisa da sua confirmação para executar: {action}"
            )
        return True
    
    # Ação desconhecida — bloquear por segurança
    raise ActionRequiresConfirmation(
        action=action,
        description=f"Ação não reconhecida: {action}. Bloqueada por política de segurança."
    )


# Disclaimer obrigatório para recomendações de investimento (Regra 23)
INVESTMENT_DISCLAIMER = (
    "Isso não é recomendação individual de investimento. "
    "Consulte um profissional credenciado antes de tomar decisões financeiras. "
    "Rentabilidade passada não garante rentabilidade futura."
)
