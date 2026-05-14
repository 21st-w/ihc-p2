---
domain: spending_patterns
agent: insights_agent
tags: [moc, gastos, padrões, anomalias, tendências]
confidence: high
---

# 🔍 Spending Patterns MOC

> Map of Content para o **Insights Agent**. Conecta notas sobre padrões de consumo, detecção de anomalias e análise de tendências financeiras.

## Modelos Matemáticos
- **Z-score** — Detecção de gastos anômalos (outliers estatísticos)
- **EMA (Exponential Moving Average)** — Tendência de gastos suavizada
- **STL (Seasonal-Trend decomposition)** — Sazonalidade nos padrões de consumo

## Categorias de Análise

- [[categorias-de-gasto]] — Taxonomia padrão: moradia, transporte, alimentação, lazer, saúde
- [[gasto-consciente-vs-impulso]] — Distinguir necessidade de desejo
- [[efeito-latte]] — Pequenos gastos recorrentes que acumulam grande impacto
- [[inflacao-do-estilo-de-vida]] — Quando aumento de renda vira aumento de gasto

## Padrões Temporais

- [[sazonalidade-financeira]] — Gastos que variam por época do ano (IPTU, material escolar, natal)
- [[dia-do-pagamento-effect]] — Tendência de gastar mais nos dias após receber
- [[ciclo-semanal-de-gastos]] — Fins de semana vs dias úteis

## Detecção de Problemas

- [[sinais-de-descontrole]] — Red flags no padrão de gastos
- [[gastos-fantasma]] — Cobranças esquecidas ou não reconhecidas
- [[assinatura-esquecida]] — Serviço que continua cobrando sem uso

## Tools do Agente
- `query_transactions` — Consulta transações filtradas
- `compare_periods` — Comparação mês a mês ou ano a ano
- `detect_anomalies` — Identifica gastos fora do padrão via Z-score
