# 🔒 SECURITY.md — Política de Cibersegurança do FinTrack

> Este documento define as regras de segurança obrigatórias para **FinTrack Personal** e **FinTrack Enterprise**.
> Deve ser consultado por todo colaborador antes de implementar qualquer funcionalidade.

---

## 1. Regra Principal — Anti-BOLA

**Nenhum dado pode ser acessado apenas pelo ID do recurso. Toda consulta valida o dono.**

```python
# ✅ Correto
transaction = (
    db.query(Transaction)
    .filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id)
    .first()
)

# ❌ Errado
transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
```

No Enterprise:
```sql
WHERE id = :event_id AND organization_id = :current_organization_id
```

Referência: [OWASP API Security Top 10 — BOLA](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)

---

## 2. Autenticação

1. Senha nunca em texto puro — usar `argon2id` ou `bcrypt`.
2. Access token: 15–30 minutos.
3. Refresh token com rotação e revogação.
4. Erro de login genérico: "Credenciais inválidas".
5. Não revelar se o e-mail existe.
6. Recuperação de senha com token de uso único.

---

## 3. JWT — Mínimo de Informação

**Aceito no payload:**
```json
{ "sub": "user_123", "role": "user", "iat": 1710000000, "exp": 1710001800 }
```

**Proibido no payload:** CPF, saldo, renda, perfil de investidor, dados da organização.

- Preferir cookie `HttpOnly`, `Secure`, `SameSite=Lax`.
- Refresh token salvo com hash no banco.
- Rotação obrigatória do refresh token.
- `JWT_SECRET` nunca no repositório.

---

## 4. Autorização por Camada

| Personal | Enterprise |
|---|---|
| `USER` | `ORG_OWNER` |
| `ADMIN` | `ORG_ADMIN` |
| — | `PROJECT_MANAGER` |
| — | `VIEWER` |

Regra: permissão checada **no backend**, nunca apenas no frontend.

---

## 5. Isolamento por `user_id` (Personal)

Todas as tabelas pessoais obrigatoriamente possuem `user_id`:
`transactions`, `subscriptions`, `budgets`, `vault_notes`, `vault_chunks`, `agent_interactions`, `monthly_summaries`.

```sql
-- RAG seguro
SELECT * FROM vault_chunks
WHERE user_id = :user_id
ORDER BY embedding <=> :query_embedding LIMIT 10;
```

---

## 6. Isolamento por `organization_id` (Enterprise)

```sql
-- ✅ Correto
SELECT * FROM api_usage_events
WHERE organization_id = :org_id AND project_id = :project_id;

-- ❌ Errado (falta org_id)
SELECT * FROM api_usage_events WHERE project_id = :project_id;
```

---

## 7. Validação de Entrada (Pydantic)

- Dinheiro: `Decimal`, nunca `float`.
- Categorias e descrições: `max_length`.
- IDs: `UUID`.
- Tipo: `Enum`.
- Nunca aceitar `user_id` vindo do frontend.
- `model_config = ConfigDict(extra='forbid')` para rejeitar campos desconhecidos.

---

## 8. Proteção contra Mass Assignment

```python
# ✅ Correto — campos controlados manualmente
transaction = Transaction(
    user_id=current_user.id,
    amount=request.amount,
    category=request.category,
)

# ❌ Errado — spreads perigosos
transaction = Transaction(**request.json())
```

---

## 9. PostgreSQL

- Banco nunca exposto publicamente.
- Usuário da aplicação com menor privilégio.
- Migrações com Alembic.
- TLS em produção.
- Índices obrigatórios por `user_id`, `organization_id`, `created_at`.

---

## 10. pgvector e RAG

- Toda busca vetorial filtra por `user_id`.
- Notas do Obsidian **não** são instrução de sistema.
- Conteúdo recuperado entra como **contexto**, nunca como **comando**.
- Prompt do sistema declara que notas podem conter instruções não confiáveis.
- Actions destrutivas exigem confirmação explícita.
- Registrar quais chunks foram usados em cada resposta.

---

## 11. Agentes de IA

- Agente **não pode** modificar/deletar dados sem confirmação.
- Agente **não pode** dar "ordem de investimento".
- Toda chamada de tool auditada.
- Tools validam autorização internamente.

---

## 12. Logs Seguros

**Personal — logar:**
`interaction_id`, `user_id`, `agent_name`, `tool_calls`, `chunk_ids`, `latency_ms`, `model`, `token_count`, `created_at`.

**Personal — NÃO logar por padrão:**
prompt completo, resposta completa, dados pessoais, conteúdo de notas.

**Enterprise — logar APENAS:**
`organization_id`, `project_id`, `agent_name`, `provider`, `model`, `prompt_tokens`, `completion_tokens`, `total_cost_usd`, `latency_ms`, `status`, `created_at`.

**Enterprise — NUNCA logar:**
prompt, resposta, documentos, mensagens, embeddings, raw request/response.

---

## 13. Zero-Data Retention (Enterprise)

O middleware pode ver prompt e resposta **em memória** para calcular métricas, mas **nunca persiste conteúdo**.

---

## 14. Redis

- Nunca público. Senha/TLS em produção.
- TTL em todas as chaves.
- Namespaces separados: `auth:`, `cache:`, `queue:`, `rate_limit:`.
- Chave de cache sempre inclui `user_id` ou `organization_id`.

---

## 15. Rate Limiting

Obrigatório em: login, register, forgot-password, chat, vault/ingest, enterprise/events, enterprise/reports.
Retornar `429 Too Many Requests`.

---

## 16. API Keys (Enterprise)

- Alta entropia. Mostrar uma única vez.
- Salvar **hash** da chave, não a chave pura.
- Escopos: `events:write`, `reports:read`, `projects:read`.
- Prefixo: `ft_live_xxx`, `ft_test_xxx`.
- Nunca logar API key.

---

## 17. CORS

- Apenas domínio do frontend permitido.
- Nunca `allow_origins=["*"]` com credenciais.
- Métodos e headers limitados.

---

## 18. LGPD

- Coletar o mínimo. Explicar finalidade.
- Permitir exportação e exclusão de dados.
- Consentimento separado para IA e embeddings externos.
- Política de retenção definida.

---

## 19. Checklist MVP

### Personal
```
[ ] Auth com JWT ou cookie seguro
[ ] Senha com argon2id/bcrypt
[ ] Refresh token rotacionável
[ ] Todas as tabelas com user_id
[ ] Toda query filtrando por user_id
[ ] pgvector filtrado por user_id
[ ] Pydantic em todo request
[ ] Decimal para dinheiro
[ ] Rate limit em login e chat
[ ] CORS restrito
[ ] Actions dos agentes com confirmação
[ ] Tools com autorização interna
```

### Enterprise
```
[ ] organization_id em todos os eventos
[ ] API key com hash no banco
[ ] Escopos por API key
[ ] Rate limit por organização
[ ] Não salvar prompt/resposta
[ ] Dashboard filtrado por organization_id
[ ] Multi-tenant testado
[ ] Revogação de API key
[ ] Auditoria de acesso
```

---

## 20. Prioridade de Implementação

1. Autenticação
2. Autorização por `user_id`
3. Validação com Pydantic
4. Proteção do PostgreSQL
5. Proteção do Redis
6. Rate limit
7. Logs seguros
8. Segurança do RAG/pgvector
9. Confirmação em actions dos agentes
10. Multi-tenant do Enterprise
11. API keys
12. Auditoria
13. Backup
14. Monitoramento
15. LGPD
