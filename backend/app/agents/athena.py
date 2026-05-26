"""Tio Patinhas — Agente Athena.

Athena é a agente organizadora do conhecimento.
Ela transforma diagnósticos, simulações e dados financeiros em nodos
Markdown estruturados para o Second Brain (Obsidian).

Athena NÃO é autônoma no MVP.
Ela é chamada após Freud e Moriarty gerarem seus resultados.
"""

from datetime import datetime, timezone
from typing import Any


def _agora() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")


def _data_hoje() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def gerar_nodo_perfil(user_name: str, analise: dict) -> dict[str, str]:
    """Gera nodo Markdown com o perfil financeiro do usuário."""
    dados = analise.get("dados", {})
    content = f"""# Perfil Financeiro — {user_name}

## Agente
Freud

## Data
{_agora()}

## Perfil
**{analise.get('perfil_financeiro', 'Não classificado')}** | Tolerância: {analise.get('tolerancia_risco', 'moderado')}

## Resumo
{analise.get('resumo', '')}

## Dados Financeiros
| Item | Valor |
|------|-------|
| Renda mensal | R$ {dados.get('renda_mensal', 0):,.2f} |
| Gastos fixos | R$ {dados.get('gastos_fixos', 0):,.2f} |
| Gastos variáveis | R$ {dados.get('gastos_variaveis', 0):,.2f} |
| Assinaturas | R$ {dados.get('assinaturas', 0):,.2f} |
| Dívidas | R$ {dados.get('dividas', 0):,.2f} |
| **Gastos totais** | **R$ {dados.get('gastos_totais', 0):,.2f}** |
| **Saldo estimado** | **R$ {dados.get('saldo_estimado', 0):,.2f}** |
| Comprometimento | {dados.get('comprometimento_renda', 0)}% |

## Pontos Fortes
{chr(10).join('- ' + p for p in analise.get('pontos_fortes', []))}

## Pontos de Atenção
{chr(10).join('- ' + p for p in analise.get('pontos_atencao', []))}

## Sugestão Educacional
{analise.get('sugestao_educacional', '')}

## Aviso
{analise.get('aviso', '')}

---
Tags: #perfil #freud #diagnostico
"""
    return {
        "title": f"Perfil Financeiro — {user_name}",
        "type": "perfil",
        "agent": "freud",
        "content": content.strip(),
        "tags": "perfil,freud,diagnostico",
        "filename": "perfil-financeiro.md",
    }


def gerar_nodo_diagnostico(user_name: str, analise: dict) -> dict[str, str]:
    """Gera nodo Markdown com o diagnóstico inicial."""
    content = f"""# Diagnóstico Financeiro Inicial — {user_name}

## Agente
Freud

## Data
{_agora()}

## Situação
Perfil: **{analise.get('perfil_financeiro', '')}**

{analise.get('resumo', '')}

## Pontos Fortes
{chr(10).join('- ' + p for p in analise.get('pontos_fortes', []))}

## Pontos de Atenção
{chr(10).join('- ' + p for p in analise.get('pontos_atencao', []))}

## Sugestão Educacional
{analise.get('sugestao_educacional', '')}

## Objetivo do Usuário
{analise.get('objetivo', 'Não informado')}

## Aviso
{analise.get('aviso', '')}

---
Tags: #diagnostico #freud #analise
"""
    return {
        "title": f"Diagnóstico Financeiro Inicial — {user_name}",
        "type": "diagnostico",
        "agent": "freud",
        "content": content.strip(),
        "tags": "diagnostico,freud,analise",
        "filename": "diagnostico-inicial.md",
    }


def gerar_nodo_simulacao(user_name: str, simulacoes: dict) -> dict[str, str]:
    """Gera nodo Markdown com as simulações do Moriarty."""
    reserva = simulacoes.get("reserva_emergencia", {})
    juros = simulacoes.get("juros_compostos", {})
    dividas = simulacoes.get("impacto_dividas", {})
    cenarios = simulacoes.get("cenarios", {})
    economia = simulacoes.get("economia_mensal", {})

    content = f"""# Simulações Financeiras — {user_name}

## Agente
Moriarty

## Data
{_agora()}

## Reserva de Emergência
{reserva.get('descricao', '')}

- Valor alvo: R$ {reserva.get('valor_alvo', 0):,.2f}
- Aporte mensal: R$ {reserva.get('aporte_mensal', 0):,.2f}
- Tempo estimado: {reserva.get('meses_para_atingir', 'N/A')} meses

## Economia Mensal
{economia.get('descricao', '')}

## Juros Compostos
{juros.get('descricao', '')}

- Valor final projetado: R$ {juros.get('valor_final', 0):,.2f}
- Total investido: R$ {juros.get('total_investido', 0):,.2f}
- Rendimentos: R$ {juros.get('juros_ganhos', 0):,.2f}

## Impacto das Dívidas
{dividas.get('descricao', '')}

## Cenário Comparativo
{cenarios.get('descricao', '')}

| Cenário | Gastos | Sobra |
|---------|--------|-------|
| Atual | R$ {cenarios.get('cenario_atual', {}).get('gastos_totais', 0):,.2f} | R$ {cenarios.get('cenario_atual', {}).get('saldo', 0):,.2f} |
| Melhorado | R$ {cenarios.get('cenario_melhorado', {}).get('gastos_totais', 0):,.2f} | R$ {cenarios.get('cenario_melhorado', {}).get('saldo', 0):,.2f} |

## Aviso
{simulacoes.get('aviso', '')}

---
Tags: #simulacao #moriarty #projecao
"""
    return {
        "title": f"Simulações Financeiras — {user_name}",
        "type": "simulacao",
        "agent": "moriarty",
        "content": content.strip(),
        "tags": "simulacao,moriarty,projecao",
        "filename": "simulacao-reserva.md",
    }


def gerar_nodo_plano(user_name: str, analise: dict, simulacoes: dict) -> dict[str, str]:
    """Gera nodo Markdown com plano educacional."""
    perfil = analise.get("perfil_financeiro", "")
    sugestao = analise.get("sugestao_educacional", "")
    reserva = simulacoes.get("reserva_emergencia", {})

    content = f"""# Plano Educacional — {user_name}

## Agente
Athena

## Data
{_agora()}

## Perfil
{perfil}

## Próximos Passos Educacionais

### 1. Organizar gastos
Revise seus gastos fixos e variáveis. Identifique oportunidades de redução.

### 2. Reserva de emergência
Meta: R$ {reserva.get('valor_alvo', 0):,.2f} (6 meses de gastos essenciais).

### 3. Educação financeira
{sugestao}

### 4. Acompanhamento
Refaça este diagnóstico mensalmente para acompanhar sua evolução.

## Aviso
⚠️ Este plano possui finalidade exclusivamente educacional.
Não representa recomendação de investimento.

---
Tags: #plano #athena #educacional
"""
    return {
        "title": f"Plano Educacional — {user_name}",
        "type": "plano",
        "agent": "athena",
        "content": content.strip(),
        "tags": "plano,athena,educacional",
        "filename": "plano-educacional.md",
    }


def gerar_todos_nodos(
    user_name: str,
    analise: dict,
    simulacoes: dict,
) -> list[dict[str, str]]:
    """Gera todos os nodos do Second Brain para um usuário."""
    return [
        gerar_nodo_perfil(user_name, analise),
        gerar_nodo_diagnostico(user_name, analise),
        gerar_nodo_simulacao(user_name, simulacoes),
        gerar_nodo_plano(user_name, analise, simulacoes),
    ]
