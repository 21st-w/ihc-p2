---
domain: subscriptions
agent: subscription_auditor
tags: [moc, assinaturas, recorrência, auditoria]
confidence: high
---

# 📡 Subscriptions MOC

> Map of Content para o **Subscription Auditor Agent**. Conecta notas sobre gestão de assinaturas, detecção de duplicatas e otimização de custos recorrentes.

## Modelos Matemáticos
- **FFT (Fast Fourier Transform)** — Detecção automática de periodicidade em cobranças
- **K-Means por embedding** — Identificação de assinaturas duplicadas ou sobrepostas

## Gestão de Assinaturas

- [[auditoria-de-assinaturas]] — Processo trimestral de revisão de todas as assinaturas
- [[regra-do-uso-real]] — Se não usou nos últimos 30 dias, candidata a cancelamento
- [[custo-anual-consolidado]] — Visão anualizada de quanto custa cada assinatura
- [[assinatura-compartilhada]] — Planos familiares e divisão de custos

## Categorias de Assinaturas

- [[streaming-entretenimento]] — Netflix, Spotify, Disney+, YouTube Premium
- [[ferramentas-produtividade]] — Notion, Todoist, Google Workspace, Microsoft 365
- [[saude-e-bem-estar]] — Academia, apps de meditação, plano de saúde
- [[cloud-e-armazenamento]] — iCloud, Google One, Dropbox
- [[educacao-online]] — Coursera, Udemy, Alura, plataformas de aprendizado

## Armadilhas Comuns

- [[trial-que-vira-cobranca]] — Free trials com cartão cadastrado
- [[upgrade-silencioso]] — Quando o plano muda de preço sem aviso claro
- [[lock-in-contratual]] — Penalidades por cancelamento antecipado
- [[dark-patterns-cancelamento]] — Interfaces que dificultam cancelar

## Tools do Agente
- `list_subscriptions` — Lista todas as assinaturas ativas
- `detect_duplicates` — Encontra serviços redundantes via K-Means
- `estimate_annual_cost` — Projeção de custo anual consolidado
