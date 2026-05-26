"""Tio Patinhas — Serviço de Obsidian (escrita de arquivos Markdown)."""

from pathlib import Path
from app.config import OBSIDIAN_VAULT_PATH


def _garantir_pasta(caminho: Path) -> None:
    """Cria a pasta se não existir."""
    caminho.mkdir(parents=True, exist_ok=True)


def salvar_nodo_obsidian(user_id: int, nodo: dict) -> str:
    """Salva um nodo como arquivo Markdown no Obsidian Vault.

    Args:
        user_id: ID do usuário.
        nodo: Dicionário com title, filename, content.

    Returns:
        Caminho relativo do arquivo criado.
    """
    pasta_usuario = OBSIDIAN_VAULT_PATH / "usuarios" / f"user_{user_id:03d}"
    _garantir_pasta(pasta_usuario)

    filename = nodo.get("filename", "nodo.md")
    filepath = pasta_usuario / filename
    filepath.write_text(nodo["content"], encoding="utf-8")

    return str(filepath.relative_to(OBSIDIAN_VAULT_PATH))


def inicializar_vault() -> None:
    """Cria a estrutura inicial do Obsidian Vault."""
    # Pastas principais
    for pasta in [
        OBSIDIAN_VAULT_PATH,
        OBSIDIAN_VAULT_PATH / "conhecimento-publico",
        OBSIDIAN_VAULT_PATH / "usuarios",
        OBSIDIAN_VAULT_PATH / "agentes",
    ]:
        _garantir_pasta(pasta)

    # README do vault
    readme = OBSIDIAN_VAULT_PATH / "README.md"
    if not readme.exists():
        readme.write_text(
            "# Tio Patinhas — Second Brain Financeiro\n\n"
            "Este vault contém o conhecimento financeiro organizado pelo sistema.\n\n"
            "## Estrutura\n"
            "- `conhecimento-publico/` — Conceitos de educação financeira\n"
            "- `usuarios/` — Dados e análises por usuário\n"
            "- `agentes/` — Informações sobre os agentes\n",
            encoding="utf-8",
        )

    # Conhecimento público
    _criar_conhecimento_publico()

    # Agentes
    _criar_fichas_agentes()


def _criar_conhecimento_publico() -> None:
    """Cria arquivos de conhecimento público."""
    pasta = OBSIDIAN_VAULT_PATH / "conhecimento-publico"

    arquivos = {
        "reserva-de-emergencia.md": """# Reserva de Emergência

## O que é?
Uma reserva de emergência é um valor guardado para cobrir gastos inesperados,
como demissão, problemas de saúde ou reparos urgentes.

## Quanto guardar?
A recomendação educacional é de **3 a 6 meses de gastos essenciais**.

## Onde guardar?
Priorize **liquidez** (poder resgatar rápido) e **segurança**.

## Por que é importante?
Sem reserva, qualquer imprevisto pode gerar dívidas com juros altos.

---
Tags: #educacao #reserva #basico
""",
        "juros-compostos.md": """# Juros Compostos

## O que são?
Juros compostos são juros calculados sobre o valor principal
**mais** os juros acumulados anteriormente. É o efeito "bola de neve".

## Fórmula básica
`M = C × (1 + i)^n`

Onde:
- M = montante final
- C = capital inicial
- i = taxa de juros por período
- n = número de períodos

## Exemplo educacional
R$ 1.000 a 10% a.a. durante 10 anos:
- Juros simples: R$ 2.000
- Juros compostos: R$ 2.593,74

## Importância
O tempo é o fator mais poderoso dos juros compostos.
Quanto antes começar, maior o efeito.

---
Tags: #educacao #juros #basico
""",
        "organizacao-financeira.md": """# Organização Financeira

## Passos básicos

### 1. Saber quanto ganha
Anote todas as fontes de renda mensal.

### 2. Saber quanto gasta
Separe gastos em: fixos, variáveis, assinaturas e dívidas.

### 3. Calcular a sobra
Renda - Gastos = Sobra (ou déficit).

### 4. Definir prioridades
1. Pagar dívidas de juros altos
2. Montar reserva de emergência
3. Definir objetivos de médio/longo prazo

### 5. Acompanhar mensalmente
Refaça o cálculo todo mês para acompanhar a evolução.

## Regra 50-30-20 (educacional)
- 50% para necessidades
- 30% para desejos
- 20% para poupança/investimentos

---
Tags: #educacao #organizacao #basico
""",
    }

    for nome, conteudo in arquivos.items():
        arquivo = pasta / nome
        if not arquivo.exists():
            arquivo.write_text(conteudo.strip(), encoding="utf-8")


def _criar_fichas_agentes() -> None:
    """Cria fichas dos agentes."""
    pasta = OBSIDIAN_VAULT_PATH / "agentes"

    arquivos = {
        "freud.md": """# Agente Freud

## Função
Análise de perfil financeiro e comportamental.

## Responsabilidades
- Analisar renda, gastos, dívidas e objetivos
- Classificar perfil financeiro
- Gerar diagnóstico educacional
- Identificar pontos fortes e de atenção

## Status
✅ Ativo no MVP

---
Tags: #agente #freud
""",
        "moriarty.md": """# Agente Moriarty

## Função
Cálculos financeiros e simulações quantitativas.

## Responsabilidades
- Calcular resumo financeiro
- Simular reserva de emergência
- Projetar juros compostos
- Analisar impacto de dívidas
- Comparar cenários

## Status
✅ Ativo no MVP

---
Tags: #agente #moriarty
""",
        "athena.md": """# Agente Athena

## Função
Organização do conhecimento e Second Brain.

## Responsabilidades
- Criar nodos em Markdown
- Organizar diagnósticos e simulações
- Integrar com Obsidian Vault
- Manter estrutura limpa

## Status
✅ Ativo no MVP

---
Tags: #agente #athena
""",
    }

    for nome, conteudo in arquivos.items():
        arquivo = pasta / nome
        if not arquivo.exists():
            arquivo.write_text(conteudo.strip(), encoding="utf-8")
