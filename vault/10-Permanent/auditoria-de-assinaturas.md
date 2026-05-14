---
domain: subscriptions
agent: subscription_auditor
tags: [assinaturas, auditoria, revisão, economia]
confidence: high
---

# Auditoria de Assinaturas

Processo sistemático de revisar todas as assinaturas ativas para eliminar desperdício. Deve ser feito **trimestralmente**.

## Checklist de Auditoria

Para cada assinatura, responda:

1. **Usei nos últimos 30 dias?** → Se não, candidata a cancelamento
2. **Existe alternativa gratuita?** → Avaliar trade-off custo vs conveniência
3. **Posso compartilhar o plano?** → Planos familiares reduzem custo per capita
4. **O plano atual é adequado?** → Talvez um plano menor atenda
5. **Há cobrança duplicada?** → Dois serviços de streaming de música, por exemplo

## Cálculo de Impacto

```
Assinatura mensal × 12 = custo anual real
```

Exemplo: Netflix R$ 39,90/mês = R$ 478,80/ano

Se a pessoa tem 8 assinaturas de R$ 30 em média:
```
8 × R$ 30 × 12 = R$ 2.880/ano
```

## Red Flags
- Mais de 5 assinaturas de entretenimento
- Custo total de assinaturas > 10% da renda
- Assinaturas que não lembra de ter contratado
- Free trial que virou cobrança

## Automação via FinTrack
O **Subscription Auditor** usa FFT para detectar periodicidade em cobranças no extrato e K-Means para encontrar serviços duplicados por semelhança semântica.

## Links
- [[regra-do-uso-real]] — Critério objetivo de cancelamento
- [[custo-anual-consolidado]] — Visão do impacto total
- [[streaming-entretenimento]] — Categoria mais propensa a acúmulo
