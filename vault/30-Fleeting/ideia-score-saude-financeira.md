---
domain: spending_patterns
agent: insights_agent
tags: [fleeting, ideia, reflexão]
confidence: low
---

# Ideia: Score de Saúde Financeira

E se criássemos um "score" interno (não SERASA) que combine várias métricas para dar ao usuário uma nota de 0 a 100 sobre sua saúde financeira?

## Possíveis componentes
- Taxa de poupança (peso alto)
- Comprometimento de renda com fixos (peso alto)
- Tendência de gastos (subindo ou caindo?)
- Presença de fundo de emergência
- Diversificação de investimentos
- Regularidade no registro de transações

## Implementação
- Cada métrica poderia ser normalizada de 0 a 1
- Pesos definidos pelo Supervisor Agent
- Score atualizado mensalmente
- Gamificação: "Suba seu score de 68 para 75 este mês!"

## Próximos passos
- Pesquisar se existe literatura acadêmica sobre financial health scores
- Definir se é nota atômica ou MOC novo
- Validar com o Budget Advisor se LP pode otimizar com base no score
