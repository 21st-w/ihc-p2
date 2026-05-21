# Tio Patinhas

> Laboratório financeiro pessoal com IA: organiza seus gastos, mede sua saúde financeira e simula cenários educacionais — sem recomendar investimentos.

---

## Visão do produto

O FinBrain ajuda profissionais brasileiros de classe média-alta a entender e melhorar sua vida financeira usando:

- cadastro de renda, gastos, assinaturas e dívidas;
- diagnóstico em linguagem natural via agente **Sherlock**;
- simulações educacionais de reserva de emergência e juros compostos;
- chat com guardrails que responde dúvidas financeiras sem recomendar ativos;
- avaliação de usabilidade como parte central do projeto IHC.

### Hipótese central

> "Brasileiros de classe média-alta endividados ou com sobra mensal inconsistente pagariam R$ X/mês por uma ferramenta que organiza finanças e simula cenários, desde que não recomende ativos."

### Persona-âncora

Profissional de 28–42 anos, renda R$ 8k–25k, tem app de banco mas não tem clareza sobre sobra real, já tentou planilha e desistiu, consome conteúdo de finanças mas não opera com método.

### Métricas de sucesso (90 dias)

| Métrica | Definição |
|---|---|
| **Ativação** | % usuários que completam cadastro de gastos em ≤ 7 dias |
| **Retenção D30** | % que voltam após 30 dias |
| **Aha moment** | % que rodam ≥ 1 simulação após ver diagnóstico do Sherlock |
| **NPS qualitativo** | Top-2-box ≥ 40% |

---

## Escopo do MVP — Onda 0 (4–6 semanas)

O MVP real são **3 fluxos**, não 8 features:

1. **Cadastro de gastos + diagnóstico do Sherlock.**
2. **Simulação de 1 cenário** (reserva de emergência OU juros compostos — não os dois no dia 1).
3. **Chat educacional** com guardrails que responde dúvidas financeiras.

> Yuyu, Morpheus visível ao usuário, Obsidian como produto final, exportação PDF → **Fase 2.**
> Morpheus existe internamente como orquestrador, mas não é feature exposta.

### Funcionalidades do MVP

1. Auth + onboarding com aceite de termos registrado em log.
2. Cadastro manual de renda, gastos fixos, variáveis, assinaturas, dívidas.
3. Dashboard com sobra mensal, taxa de poupança, score de saúde financeira.
4. **Sherlock**: diagnóstico de perfil em linguagem natural.
5. **Benjamin (simplificado)**: simulador de reserva de emergência + juros compostos com aportes.
6. **Athena**: guardrails determinísticos + LLM judge em 3 camadas.
7. Chat educacional com tool calls determinísticas.
8. Exportação básica (Markdown).

---

## Roadmap em ondas

| Onda | Prazo | O que entra |
|---|---|---|
| **Onda 0** | 4–6 semanas | Cadastro manual + Sherlock + 1 simulação + Athena + chat básico |
| **Onda 1** | +6 semanas | Benjamin completo + Yuyu como widget de mercado |
| **Onda 2** | +8 semanas | Obsidian como UI, exportação completa, Open Finance (via parceiro autorizado) |

---

## Arquitetura

```text
frontend/
  Next.js 15 (App Router) + TypeScript strict
  Tailwind 4 + shadcn/ui
  React Query (Tanstack) + Zod + react-hook-form
  Recharts para visualizações
  KaTeX para fórmulas matemáticas

backend/
  FastAPI (Python 3.12) + SQLAlchemy 2.0 + Alembic
  app/
    api/          → endpoints REST
    core/         → config, deps, segurança
    models/       → SQLAlchemy ORM
    schemas/      → Pydantic schemas
    services/     → regras de negócio
    agents/       → Planner, Explicador, Sherlock, orquestrador
    skills/       → funções financeiras determinísticas (sem LLM)
    guardrails/   → Athena (3 camadas)
    workers/      → tarefas RQ (jobs de mercado, eval)
  prompts/        → prompts versionados por hash

database/
  PostgreSQL 16 + pgvector
  corpus de conhecimento financeiro (~200 chunks curados)
  memória por usuário

cache/
  Redis + RQ (filas e jobs)

infra/
  Docker Compose (dev)
  Railway ou Fly.io (produção)
  GitHub Actions (CI: lint, testes, eval, coverage gate)
  Langfuse (observabilidade de LLM)
  Promptfoo (eval contínua em CI)
```

### Stack de IA

| Papel | Modelo |
|---|---|
| Planner (decide qual skill chamar) | Claude Sonnet |
| Explicador (verbaliza resultado) | Claude Sonnet |
| Classificação de gastos | Claude Haiku |
| LLM judge (Athena camada 2) | Claude Haiku |
| Embeddings | `text-embedding-3-small` ou `bge-m3` self-hosted |

> **Regra fundamental:** cálculo financeiro **nunca** passa pelo LLM. Sempre por função determinística testada em `app/skills/`.

---

## Agentes

| Agente | Função | Fase |
|---|---|---|
| **Sherlock** | Diagnóstico de perfil financeiro em linguagem natural | Onda 0 |
| **Benjamin** | Simulações educacionais (juros compostos, reserva, carteira) | Onda 0–1 |
| **Athena** | Guardrails: bloqueia recomendações, injeta disclaimers | Onda 0 |
| **Planner** | Decide qual skill chamar com base no input do usuário | Interno |
| **Explicador** | Verbaliza resultado da skill com guardrails | Interno |
| **Yuyu** | Widget de mercado: Selic, IPCA, USD, Ibovespa | Onda 1 |
| **Morpheus** | Orquestrador de agentes (interno, não exposto ao usuário) | Interno |

### Arquitetura de agentes (MVP)

O MVP usa **2 agentes LLM reais + skills determinísticas** (funções Python puras):

```
Input do usuário
    ↓
Planner (LLM) → decide skill a chamar + args
    ↓
Skill determinística (Python puro, sem LLM)
    ↓
Explicador (LLM) → verbaliza resultado
    ↓
Athena (guardrails 3 camadas)
    ↓
Resposta ao usuário + log em agent_logs
```

### Athena — Guardrails em 3 camadas

1. **Regex/keyword** (determinístico): bloqueia tickers, "compre", "venda", "vai subir", promessas de rentabilidade.
2. **LLM judge (Haiku)**: avalia 5 dimensões (recomendação direta, promessa de rentabilidade, personalização excessiva, falta de disclaimer, ticker específico). Score > 6 bloqueia.
3. **Disclaimer injection** (não desabilitável): toda resposta com dado financeiro recebe:
   > ⚠️ Esta é uma simulação educacional baseada em premissas explícitas. Não é recomendação de investimento. Performance passada não garante futura.

---

## Skills determinísticas (`app/skills/financial.py`)

Funções puras, tipadas com `Decimal`, cobertura de testes ≥ 95%:

| Função | O que calcula |
|---|---|
| `juros_compostos_com_aportes` | FV, juros totais, aportes totais |
| `equivalencia_taxas` | a.m. ↔ a.a. ↔ CDI% |
| `reserva_emergencia` | Baseada em gastos essenciais (não renda) |
| `taxa_poupanca` | Renda líquida vs. gastos totais |
| `score_saude_financeira` | Score 0–100 com breakdown por dimensão |
| `tributacao_renda_fixa` | Alíquota regressiva, IR, retorno líquido |
| `tributacao_acoes_pf` | Day trade, isenção até R$ 20k/mês |
| `simulacao_carteira` | Retorno esperado, vol, Sharpe, drawdown estimado |

> Usar `Decimal`, nunca `float`. Toda função com docstring de fórmula, premissas e exemplo numérico.

---

## Modelo de dados

```sql
users           (id, email, perfil_aceite_em, ...)
transactions    (id, user_id, data, valor, categoria, tipo, fonte)
subscriptions   (id, user_id, nome, valor, recorrencia, ultima_cobranca)
income_sources  (id, user_id, nome, valor_mensal, tipo)
debts           (id, user_id, credor, saldo, taxa_aa, parcela)
goals           (id, user_id, nome, valor_alvo, prazo)
simulations     (id, user_id, tipo, inputs_json, outputs_json, criada_em)
agent_logs      (id, user_id, agente, prompt, resposta, guardrail_status, criada_em)
consents        (id, user_id, tipo, versao, aceito_em, ip)
market_data     (id, indicador, valor, data_ref, stale)
knowledge_chunks(id, titulo, topico, conteudo, embedding, tags)
```

### Migrations Alembic (incrementais)

```
001_users_and_auth
002_consents_and_audit
003_financial_entities
004_simulations
005_agent_logs
006_market_data
007_vector_extension
```

---

## Dados de mercado (APIs oficiais)

| Indicador | Fonte |
|---|---|
| Selic meta (cód. 432) | BCB SGS API |
| IPCA (cód. 433) | BCB SGS API |
| CDI (cód. 12) | BCB SGS API |
| USD/BRL (cód. 1) | BCB SGS API |
| Tesouro Direto | Tesouro Transparente API |
| Cotações B3 / Ibovespa | Brapi (free tier) |

> Job diário às 19h BRT. Cache Redis 1h. Fallback com flag `stale` se API cair.
> Widget no dashboard exibe apenas índices e indicadores macro — **nunca tickers individuais**.

---

## Compliance e jurídico

### Linha vermelha — nunca cruzar

- Mencionar ticker específico como sugestão.
- Prometer rentabilidade ("você vai render X%").
- Personalizar simulação a ponto de virar conselho ("para você, com seu perfil, compre...").
- Sugerir timing de mercado.

### Documentos obrigatórios no MVP

1. Termos de Uso com cláusula de **não-recomendação** em destaque.
2. Política de Privacidade LGPD-compliant.
3. Aviso pré-uso com aceite registrado em log.
4. Política de cookies.
5. Canal de atendimento ao titular de dados.
6. Registro de operações de tratamento (ROPA).

### Mitigantes técnicos

- Watermark `SIMULAÇÃO EDUCACIONAL` em toda resposta com dado financeiro.
- Log imutável de toda resposta do agente.
- Versioning de prompts com hash para auditoria.
- Disclaimer dinâmico injetado pela Athena (não opcional).
- Endpoint de portabilidade e exclusão de dados (LGPD) desde o MVP.

### Referências regulatórias

- CVM Resolução 20/2021 (analistas de valores mobiliários).
- CVM Resolução 19/2021 (consultores de valores mobiliários).
- LGPD — dados financeiros tratados com rigor de dados sensíveis.
- Open Finance: entrar como receptor exige autorização do Bacen ou parceria → **fora do MVP**. Usuário faz upload de CSV/OFX.

---

## IHC — pontos de estudo

O desafio central não é técnico. É desenhar uma interface que ajude o usuário a **confiar, entender e controlar** agentes de IA.

- Clareza das respostas dos agentes.
- Confirmação antes de alterar dados.
- Explicabilidade das simulações (premissas explícitas).
- Feedback de erro e incerteza.
- Visualização de gastos, metas e score de saúde.
- Bloqueio visível e explicado quando Athena age.
- Relação entre chat, dashboard e diagnóstico.
- Avaliação de usabilidade com usuários reais.

---

## Como rodar

### Pré-requisitos

- Docker e Docker Compose
- Node.js 20+
- Python 3.12+

### Subir ambiente completo

```bash
make up
```

### Apenas backend

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Apenas frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:3000`.

### Variáveis de ambiente (`.env.example`)

```bash
# Banco de dados
POSTGRES_URL=postgresql://localhost:5432/finbrain
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=<min 256 bits>
CLERK_SECRET_KEY=

# LLM
ANTHROPIC_API_KEY=sk-ant-...

# Observabilidade
LANGFUSE_SECRET_KEY=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_HOST=https://cloud.langfuse.com

# APIs de mercado
BRAPI_TOKEN=

# Vault (Fase 2)
VAULT_PATH=/absolute/path/to/vault
```

---

## Testes e avaliação

```bash
# Testes unitários + integração
cd backend && pytest

# Com cobertura
pytest --cov=app --cov-report=term-missing

# Eval de guardrails (50 casos adversariais)
pytest tests/guardrails/

# Eval contínua (Promptfoo — roda em CI)
promptfoo eval
```

### Gates de cobertura (CI bloqueia PR se cair)

| Módulo | Cobertura mínima |
|---|---|
| `app/skills/` | ≥ 95% |
| `app/guardrails/` | ≥ 90% |
| `app/agents/` | ≥ 75% |
| Global | ≥ 85% |

---

## Makefile

```bash
make up        # sobe Docker Compose
make down      # derruba
make migrate   # alembic upgrade head
make test      # pytest
make lint      # ruff + mypy strict
make format    # ruff format
make seed      # seed de dev (nunca em produção)
```

---

## Organização de prompts no repositório

Todos os prompts dos agentes são versionados:

```text
prompts/
  claude-code/
    01-setup-backend.md
    02-skills-financeiras.md
    03-orquestracao-agentes.md
    04-athena-guardrails.md
    05-sherlock.md
  antigravity/
    01-frontend-setup.md
    02-dashboard.md
    03-chat.md
    04-mercado-yuyu.md
    05-testes-e2e.md
  codex/
    01-suite-testes.md
    02-scripts-utilitarios.md
    03-documentacao.md
    04-migrations-seeds.md
  gemini/
    01-corpus-conhecimento.md
    02-eval-dataset.md
    03-parsing-extratos.md
    04-resumo-mercado.md
    05-llm-judge-offline.md
```

Cada prompt carregado com hash para rastreabilidade em `agent_logs`.

---

## Ordem de execução

| Semana | Ferramenta | Entregáveis |
|---|---|---|
| 1–2 | Claude Code + Codex | Setup, modelo de dados, migrations, skills determinísticas |
| 2–3 | Claude Code + Gemini | Agentes (Planner, Sherlock, Athena) + corpus + eval set |
| 3–4 | Antigravity + Codex | Frontend, integrações de mercado, testes unitários |
| 4–5 | Antigravity + Gemini | Chat integrado ao backend, parsing de extratos |
| 5–6 | Todos | Hardening, eval em produção, beta fechado |

---

## Decisões de arquitetura

- **B2C primeiro** — é onde IHC, agentes e produto são validados.
- **LLM só onde linguagem natural é insubstituível** — cálculo financeiro sempre em função Python pura.
- **2 agentes LLM + skills determinísticas** — não 5 agentes em LangGraph (overkill para MVP).
- **Postgres + pgvector** — memória de usuário e RAG no mesmo banco.
- **~200 chunks curados manualmente** — mais qualidade que indexar 50 livros.
- **Eval set de 50 casos adversariais** antes do primeiro usuário real.
- **Langfuse desde o dia 1** — observabilidade de custo e qualidade por conversa.
- **Custo por interação logado** — prepara o módulo Enterprise futuro.
- **Open Finance fora do MVP** — usuário faz upload de CSV/OFX.
- **Obsidian como produto** — Fase 2, não MVP.

---

## Autor

Felipe Murilo Ribeiro Ribeiro

## Licença

MIT License
