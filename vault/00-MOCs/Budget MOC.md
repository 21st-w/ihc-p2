---
domain: budget
agent: budget_advisor
tags: [moc, orçamento, alocação, renda]
confidence: high
---

# 💰 Budget MOC

> Map of Content para o **Budget Advisor Agent**. Este índice conecta todas as notas atômicas relacionadas a orçamento, alocação de renda e planejamento mensal.

## Modelo Matemático
O Budget Advisor utiliza **Programação Linear** (`scipy.optimize.linprog`) para otimizar a alocação de recursos entre categorias de gastos, maximizando a economia respeitando restrições mínimas por categoria.

## Princípios Fundamentais

- [[regra-50-30-20]] — Framework base de alocação de renda
- [[orcamento-base-zero]] — Metodologia alternativa: cada real precisa de destino
- [[envelope-digital]] — Estratégia de envelopes adaptada para o digital
- [[custo-fixo-vs-variavel]] — Classificação essencial para otimização

## Estratégias de Otimização

- [[renegociacao-de-contratos]] — Quando e como renegociar gastos fixos
- [[automacao-de-poupanca]] — Pay yourself first automatizado
- [[revisao-mensal-orcamento]] — Processo de revisão e ajuste

## Métricas e Indicadores

- [[taxa-de-poupanca]] — % da renda que sobra após gastos
- [[comprometimento-de-renda]] — % da renda em gastos fixos
- [[margem-de-seguranca-mensal]] — Buffer para imprevistos

## Tools do Agente
- `get_budget` — Consulta orçamento vigente
- `project_month_end` — Projeção de fim de mês
- `suggest_allocation` — Sugere alocação otimizada via LP
