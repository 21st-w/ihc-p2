---
domain: spending_patterns
agent: insights_agent
tags: [categorização, gastos, classificação]
confidence: high
---

# Categorias de Gasto

Taxonomia padrão para classificação de despesas. A consistência na categorização é essencial para que o **Insights Agent** detecte padrões e anomalias com precisão.

## Categorias Primárias

| Categoria | Tipo | Exemplos |
|---|---|---|
| 🏠 Moradia | Fixo | Aluguel, condomínio, IPTU, financiamento |
| 🚗 Transporte | Misto | Combustível, Uber, estacionamento, manutenção |
| 🍽️ Alimentação | Variável | Supermercado, feira, restaurantes, delivery |
| 💊 Saúde | Misto | Plano de saúde, farmácia, consultas, academia |
| 📚 Educação | Fixo/Variável | Faculdade, cursos, livros, certificações |
| 🎮 Lazer | Variável | Cinema, jogos, viagens, hobbies |
| 👕 Vestuário | Variável | Roupas, calçados, acessórios |
| 📡 Assinaturas | Fixo | Streaming, SaaS, celular, internet |
| 🐕 Pets | Variável | Ração, veterinário, banho e tosa |
| 🎁 Presentes | Variável | Aniversários, datas comemorativas |
| ⚡ Utilidades | Fixo | Luz, água, gás |

## Subcategorias
Cada categoria primária pode ter subcategorias para análise mais granular. O **Categorization Agent** usa Naive Bayes para sugerir a categoria automaticamente com base na descrição da transação.

## Regras de classificação
- Uma transação pertence a **uma e somente uma** categoria
- Na dúvida, categorizar pelo **propósito principal** da compra
- Manter consistência: "Restaurante" sempre na mesma categoria

## Links
- [[gasto-consciente-vs-impulso]] — Análise qualitativa do gasto
- [[custo-fixo-vs-variavel]] — Distinção essencial para orçamento
- [[efeito-latte]] — Impacto de pequenos gastos recorrentes
