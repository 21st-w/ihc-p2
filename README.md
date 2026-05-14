💸 tio patinhas
Duas soluções, uma base técnica: controle financeiro pessoal com agentes de IA e observabilidade de custos de IA para empresas.

Produtos
FinTrack Personal FinTrack Enterprise
Público Pessoa física Times e empresas que usam LLMs/APIs de IA
Core Agentes financeiros alimentados por Zettelkasten Observabilidade de custo por prompt, agente e modelo
Diferencial Second brain Obsidian → RAG → decisões financeiras Middleware que intercepta chamadas LLM e captura custo real
Status Fase ativa Módulo Enterprise — inicia após Personal estável
Parte I — FinTrack Personal
Visão Geral
Controle financeiro pessoal orientado a agentes. O usuário escreve no Obsidian usando Zettelkasten — notas atômicas, MOCs por domínio — e esse vault vira o contexto vivo dos agentes. Modelos matemáticos otimizam cada decisão: orçamento via programação linear, anomalias via Z-score, portfólio via Markowitz.

Arquitetura
┌──────────────────────────────────────────────────────┐
│ FRONTEND │
│ React 18 + TypeScript + Vite │
│ (Chat UI · Dashboard · Vault Preview) │
└──────────────────────┬───────────────────────────────┘
│ REST + SSE
┌──────────────────────▼───────────────────────────────┐
│ BACKEND │
│ Python 3.11 + FastAPI │
│ /api/\* → CRUD │ /chat → Agentes │
│ /vault → Ingestion pipeline │
└──────┬───────────────────────────────┬───────────────┘
│ │
┌──────▼──────────────┐ ┌───────────▼───────────────┐
│ PostgreSQL │ │ Redis │
│ + pgvector │ │ cache · filas · pub/sub │
└─────────────────────┘ └───────────────────────────┘
Stack

Camada Tecnologia
Frontend React 18 + TypeScript + Vite
Backend Python 3.11 + FastAPI
Banco PostgreSQL + pgvector
Cache / Filas Redis
Agentes LangGraph + Anthropic SDK
Second Brain Obsidian Vault (Zettelkasten)
🧠 Second Brain — Zettelkasten no Obsidian
Estrutura do Vault
vault/
├── 00-MOCs/ # Maps of Content — índices de domínio
│ ├── Budget MOC.md → Budget Advisor
│ ├── Investment MOC.md → Investment Advisor
│ ├── Spending Patterns MOC.md → Insights Agent
│ ├── Subscriptions MOC.md → Subscription Auditor
│ └── Financial Planning MOC.md → Supervisor
│
├── 10-Permanent/ # Notas atômicas, evergreen
│ ├── regra-50-30-20.md
│ ├── fundo-emergencia.md
│ └── ...
│
├── 20-Literature/
└── 30-Fleeting/
Cada MOC mapeia para um agente especialista. O vault de cada usuário é indexado separadamente no pgvector (WHERE user_id = ?). Usuários e dados transacionais vivem no PostgreSQL — o vault guarda apenas conhecimento conceitual e metas pessoais.

## Frontmatter de nota

domain: budget
agent: budget_advisor
tags: [regra, alocação, renda]
confidence: high

---

Pipeline de Ingestion
Obsidian Vault → watchdog → Parser → Chunker → Embedder → pgvector
Watcher detecta mudanças em tempo real. Chunks respeitam fronteiras de nota atômica. MOCs são indexados inteiros.

RAG Híbrido
Query → BM25 (léxico) + pgvector (semântico)
→ RRF Fusion
→ Cross-encoder reranking
→ Contexto injetado no prompt
🤖 Agentes e Modelos Matemáticos
Agente Modelo Matemático Tools
Categorization Naive Bayes / Regressão Logística (confiança por classe) list_uncategorized, set_category, bulk_categorize
Insights Z-score (anomalia), EMA (tendência), STL (sazonalidade) query_transactions, compare_periods, detect_anomalies
Budget Advisor Programação Linear — scipy.optimize.linprog get_budget, project_month_end, suggest_allocation
Subscription Auditor FFT (periodicidade), K-Means (duplicatas por embedding) list_subscriptions, detect_duplicates, estimate_annual_cost
Investment Advisor Otimização de Markowitz — fronteira eficiente, max Sharpe get_user_profile, fetch_market_data, generate_allocation
Conversational — (orquestra os outros em modo leitura) todas as tools de leitura
Memória
Short-term → Estado da conversa (LangGraph)
Long-term → Vault Zettelkasten (pgvector, por user_id)
Episodic → Resumos mensais embedados
Guardrails
Investment Advisor: apenas sugestões, nunca ordens, sempre com disclaimer
Actions que modificam dados exigem confirmação explícita no chat
Prompt + tools + resposta logados por interação (auditoria / LGPD)
Confiança marcada quando modelo tem incerteza alta
Estrutura — Personal
fintrack/
│
├── vault/ # Obsidian Vault (Zettelkasten)
│ ├── 00-MOCs/
│ ├── 10-Permanent/
│ ├── 20-Literature/
│ └── 30-Fleeting/
│
├── frontend/
│ └── src/
│ ├── components/
│ │ ├── chat/
│ │ ├── dashboard/
│ │ └── vault/ # VaultPreview, NoteGraph (d3)
│ ├── hooks/
│ └── services/
│
├── backend/
│ └── app/
│ ├── api/ # CRUD routes
│ ├── agents/ # Supervisor + especialistas
│ ├── tools/ # Tools tipadas (Pydantic)
│ ├── vault/ # watcher, parser, chunker, embedder
│ ├── rag/ # retriever, reranker, context_builder
│ ├── models_math/ # classifier, anomaly, lp_budget, fft, markowitz
│ ├── memory/
│ ├── guardrails/
│ └── main.py
│
└── eval/
├── golden_dataset.json
└── run_eval.py
Roadmap — Personal
FASE 1 — Vault + Core (3-4 semanas)
├── Estrutura Zettelkasten no Obsidian
├── FastAPI + PostgreSQL + pgvector + Auth
└── CRUD: transações, assinaturas, orçamentos

FASE 2 — Ingestion Pipeline (2 semanas)
├── Vault watcher → parser → chunker → embedder → pgvector
└── Busca híbrida (BM25 + pgvector + RRF)

FASE 3 — Primeiro Agente (2 semanas)
├── Anthropic SDK puro — entender o loop antes do framework
└── SSE streaming no frontend

FASE 4 — Multi-Agente + Modelos Matemáticos (8-10 semanas)
├── LangGraph: Supervisor + 4 especialistas
├── Modelos: Naive Bayes, Z-score, LP, FFT
└── Eval: golden dataset + LLM-as-judge

FASE 5 — Refinamento (2-3 meses)
├── Investment Advisor + Markowitz
├── Memória episódica
├── Guardrails completos + LGPD
└── Open Finance via Pluggy
Parte II — FinTrack Enterprise
AI Cost Intelligence
Empresas que usam LLMs e agentes de IA gastam dinheiro em cada prompt — e a maioria não sabe exatamente quanto, onde ou por quê. O FinTrack Enterprise resolve isso.

Por que encaixa
O Personal já constrói a base técnica completa que o Enterprise precisa:

O que o Personal já tem Como o Enterprise reutiliza
Agentes com tool calling Middleware intercepta as mesmas chamadas
Auditoria de prompt + resposta Base do Cost Collector
PostgreSQL + Redis Mesma infra, novas tabelas
Dashboard financeiro Reaproveitado para custo de IA
Modelos matemáticos Anomalia de custo, projeções, alertas
Custo por interação no roadmap Virar produto, não só métrica interna
Arquitetura Enterprise
Aplicação cliente / API Gateway
│
▼
AI Cost Middleware
captura: prompt · modelo · tokens · latência · resposta · custo
│
▼
Cost Collector API (/enterprise/events)
recebe eventos em tempo real via HTTP ou SDK
│
▼
PostgreSQL + TimescaleDB
armazena api_usage_events como série temporal
│
├── Agentes de análise
│ ├── Report Agent → relatório financeiro/técnico automático
│ ├── Anomaly Agent → detecta picos de custo anômalos
│ └── Budget Alert Agent → alerta estouro de orçamento por projeto
│
▼
Dashboard B2B
custo por prompt · usuário · agente · modelo · período · projeto
Módulo Backend — Enterprise
backend/app/
│
├── b2b/
│ ├── collector.py # recebe e valida eventos de uso
│ ├── pricing.py # tabela de preços por modelo/provider (atualizada)
│ ├── reports.py # geração de relatório periódico (PDF / JSON)
│ ├── alerts.py # regras de alerta de estouro de orçamento
│ └── schemas.py # Pydantic schemas Enterprise
│
└── middleware/
└── ai_cost_tracker.py # interceptor: envolve chamadas LLM e emite eventos
O ai_cost_tracker.py funciona como decorator/wrapper — qualquer chamada LLM do sistema passa por ele antes de chegar à API do provider:

# Uso no agente

@track_ai_cost(agent="budget_advisor", project="fintrack-personal")
async def call_llm(messages, model):
return await anthropic.messages.create(...)

# O middleware captura automaticamente:

# tokens in/out · custo calculado · latência · status · model

# e emite evento para o Cost Collector

Schema Principal
CREATE TABLE api_usage_events (
id UUID PRIMARY KEY,
organization_id UUID NOT NULL,
project_id UUID,
user_id UUID,
agent_name TEXT,
provider TEXT, -- anthropic, openai, gemini...
model TEXT,
prompt_tokens INTEGER,
completion_tokens INTEGER,
total_tokens INTEGER,
input_cost_usd NUMERIC(12,8),
output_cost_usd NUMERIC(12,8),
total_cost_usd NUMERIC(12,8),
latency_ms INTEGER,
status TEXT, -- success, error, timeout
created_at TIMESTAMPTZ NOT NULL
);
-- TimescaleDB: created_at como coluna de particionamento
SELECT create_hypertable('api_usage_events', 'created_at');
TimescaleDB transforma api_usage_events em hypertable — queries de série temporal (custo por dia, por semana, por agente) ficam ordens de magnitude mais rápidas sem mudar o SQL.

Exemplo de evento capturado
Prompt: "Analise meus gastos do mês"
Agente: Budget Advisor
Modelo: claude-sonnet-4-20250514
Projeto: fintrack-personal

Tokens: Input: 1.240 Output: 580
Custo: Input: $0.0037 Output: $0.0087 Total: $0.0124
Latência: 2.1s
Status: success
Agentes Enterprise
Report Agent Gera relatório financeiro/técnico automático em linguagem natural: custo total do período, breakdown por modelo, agente e projeto, tendência vs período anterior, top 10 prompts mais caros.

Anomaly Agent Aplica Z-score e EMA sobre a série temporal de custos. Detecta picos anômalos e notifica: “custo do GPT-4o subiu 340% nas últimas 2 horas no projeto X.”

Budget Alert Agent Monitora orçamentos por projeto/organização. Alerta em 70%, 90% e 100% do limite. Projeta data de estouro com base na taxa de consumo atual.

Estrutura — Enterprise
fintrack/
│
├── frontend/
│ └── src/
│ └── components/
│ └── enterprise/ # dashboards B2B separados do Personal
│ ├── CostByAgent.tsx
│ ├── CostByModel.tsx
│ ├── CostTimeline.tsx
│ └── BudgetAlerts.tsx
│
├── backend/
│ └── app/
│ ├── b2b/ # collector, pricing, reports, alerts
│ ├── middleware/ # ai_cost_tracker.py
│ └── agents/
│ └── enterprise/ # report_agent, anomaly_agent, budget_alert_agent
│
└── sdk/ # SDK cliente leve para integração
├── python/ # pip install fintrack-sdk
└── typescript/ # npm install @fintrack/sdk
O SDK cliente permite que qualquer empresa integre com poucas linhas:

from fintrack_sdk import FinTrackMiddleware

fintrack = FinTrackMiddleware(api*key="ft*...", project="meu-produto")

@fintrack.track(agent="chat-bot")
async def minha_chamada_llm(prompt):
...
Roadmap — Enterprise
FASE 6 — Fundação Enterprise (início após Personal estável)
├── TimescaleDB adicionado ao Postgres existente
├── Cost Collector API + schema api_usage_events
├── ai_cost_tracker.py interceptando o próprio FinTrack
└── Dashboard básico: custo/dia por modelo e agente

FASE 7 — Agentes Enterprise (4-6 semanas)
├── Report Agent (relatório periódico automático)
├── Anomaly Agent (Z-score sobre série temporal de custos)
└── Budget Alert Agent (estouro de orçamento por projeto)

FASE 8 — SDK + Multi-tenant (2-3 meses)
├── SDK Python + TypeScript para integração externa
├── Multi-tenant com isolamento por organization_id
├── Suporte a múltiplos providers (OpenAI, Gemini, Mistral...)
└── Exportação de relatórios (PDF, CSV, webhook)
Como Rodar
docker-compose up --build

# Backend

cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# Frontend

cd frontend
npm install && npm run dev

# backend/.env

POSTGRES_URL=postgresql://localhost:5432/fintrack
REDIS_URL=redis://localhost:6379
JWT_SECRET=<min 256 bits>
ANTHROPIC_API_KEY=sk-ant-...
VAULT_PATH=/absolute/path/to/vault
Testes e Eval
cd backend
pytest # unitários
pytest eval/ # golden dataset dos agentes
jupyter notebook docs/math-models/
Decisões de Arquitetura
Data Decisão Motivo
2025-05 Zettelkasten como fonte de verdade dos agentes Notas atômicas = chunks coesos para RAG; MOCs mapeiam domínios dos agentes
2025-05 pgvector por user_id Vault pessoal isolado por usuário sem banco separado
2025-05 Busca híbrida (BM25 + dense + RRF) Termos financeiros precisam de match léxico; conceitos precisam de semântica
2025-05 Modelos matemáticos por agente LLMs são ruins em otimização numérica; LP, FFT e Markowitz são determinísticos e auditáveis
2025-05 Enterprise como módulo separado Não contamina o MVP; reutiliza infra sem acoplamento
2025-05 TimescaleDB para api_usage_events Dados de custo são série temporal; hypertables aceleram queries sem mudar o SQL
2025-05 ai_cost_tracker como decorator Intercepta qualquer chamada LLM sem modificar a lógica dos agentes
Time
Felipe Murilo Ribeiro Ribeiro

Licença
MIT License
