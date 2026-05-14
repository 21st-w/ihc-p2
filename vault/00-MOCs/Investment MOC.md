---
domain: investment
agent: investment_advisor
tags: [moc, investimento, portfólio, risco]
confidence: high
---

# 📈 Investment MOC

> Map of Content para o **Investment Advisor Agent**. Conecta notas sobre perfil de investidor, classes de ativos e estratégias de alocação de portfólio.

## Modelo Matemático
O Investment Advisor utiliza a **Otimização de Markowitz** — fronteira eficiente e maximização do índice de Sharpe — para sugerir alocações baseadas no perfil do usuário.

## ⚠️ Disclaimer Obrigatório
> Este conteúdo é educacional. Não constitui recomendação individual de investimento. Rentabilidade passada não garante rentabilidade futura. Consulte um profissional credenciado.

## Perfis de Investidor

- [[perfil-conservador]] — Prioriza segurança e liquidez
- [[perfil-moderado]] — Equilíbrio entre risco e retorno
- [[perfil-arrojado]] — Aceita volatilidade em troca de retorno potencial

## Classes de Ativos

- [[renda-fixa-brasil]] — Tesouro Direto, CDBs, LCIs/LCAs
- [[renda-variavel-brasil]] — Ações, FIIs, ETFs na B3
- [[fundos-de-investimento]] — Classificação ANBIMA e taxa de administração
- [[investimentos-internacionais]] — BDRs, ETFs globais, diversificação cambial

## Conceitos Fundamentais

- [[diversificacao]] — "Não coloque todos os ovos na mesma cesta"
- [[fronteira-eficiente]] — Markowitz: máximo retorno para dado nível de risco
- [[indice-sharpe]] — Retorno ajustado pelo risco
- [[fundo-emergencia]] — Pré-requisito antes de qualquer investimento

## Tools do Agente
- `get_user_profile` — Consulta perfil de investidor
- `fetch_market_data` — Dados de mercado atualizados
- `generate_allocation` — Alocação otimizada via Markowitz
