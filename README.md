# Tio Patinhas

Controle financeiro pessoal com foco em IHC, Obsidian/Zettelkasten e agentes de IA.

O projeto comeca pelo produto B2C, porque ele e a base para estudar usuarios, desenhar a interface, implementar agentes e validar a experiencia. O modulo B2B/Enterprise fica como evolucao posterior, reaproveitando a mesma base tecnica para observabilidade de custos de IA.

## Visao do produto

Tio Patinhas ajuda uma pessoa a entender e melhorar sua vida financeira usando:

- interface simples para gastos, orcamentos, assinaturas e metas;
- um vault Obsidian como second brain financeiro;
- agentes de IA especializados;
- modelos matematicos para apoio a decisoes;
- avaliacao de usabilidade como parte central do projeto.

## Prioridade atual: B2C / Personal

O foco principal e o uso pessoal.

### Objetivo

Criar uma experiencia em que o usuario consiga:

- registrar e revisar gastos;
- entender padroes de consumo;
- receber alertas sobre assinaturas e anomalias;
- conversar com agentes financeiros;
- usar suas proprias notas do Obsidian como contexto;
- tomar decisoes melhores sem perder controle sobre as acoes.

### Por que isso e importante para IHC

O problema nao e apenas tecnico. O desafio e desenhar uma interface que ajude o usuario a confiar, entender e controlar agentes de IA.

Pontos de estudo:

- clareza das recomendacoes;
- confirmacao antes de alterar dados;
- explicabilidade das sugestoes;
- feedback de erro e incerteza;
- visualizacao de gastos e metas;
- relacao entre chat, dashboard e vault;
- avaliacao de usabilidade com usuarios.

## Second Brain no Obsidian

O vault do usuario guarda conhecimento financeiro, metas e regras pessoais.

Estrutura sugerida:

```text
vault/
  00-MOCs/
    Budget MOC.md
    Investment MOC.md
    Spending Patterns MOC.md
    Subscriptions MOC.md
    Financial Planning MOC.md

  10-Permanent/
    regra-50-30-20.md
    fundo-emergencia.md
    categorias-de-gasto.md

  20-Literature/
  30-Fleeting/
```

Cada MOC pode alimentar um agente especialista. O vault vira contexto para RAG, mas os dados transacionais continuam no banco da aplicacao.

## Agentes principais

| Agente | Funcao |
|---|---|
| Categorization Agent | Sugere categorias para transacoes |
| Insights Agent | Encontra padroes, tendencias e anomalias |
| Budget Advisor | Ajuda a montar e revisar orcamentos |
| Subscription Auditor | Detecta assinaturas, duplicatas e custos recorrentes |
| Investment Advisor | Gera sugestoes educacionais, sem executar ordens |
| Conversational Agent | Orquestra perguntas do usuario e chama os especialistas |

## Modelos e tecnicas

O projeto combina LLMs com modelos deterministas quando fizer sentido:

- classificacao de gastos: Naive Bayes ou regressao logistica;
- anomalias: Z-score, media movel e tendencias;
- orcamento: programacao linear;
- assinaturas: periodicidade e agrupamento;
- investimentos: Markowitz como estudo educacional;
- RAG: busca no vault Obsidian.

## Arquitetura inicial

```text
frontend/
  HTML + CSS + JavaScript
  prototipo simples para chat, dashboard e fluxos de IHC

backend/
  Python + FastAPI
  APIs, agentes, RAG, tools, guardrails e modelos matematicos

database/
  PostgreSQL + pgvector
  usuarios, transacoes, embeddings e historico

cache/
  Redis
  filas, cache e streaming

vault/
  Obsidian Zettelkasten
  notas, MOCs e contexto pessoal
```

## Roadmap B2C

### Fase 1 - IHC e base do produto

- Definir usuarios, dores e tarefas principais.
- Mapear jornadas: registrar gasto, revisar mes, conversar com agente.
- Criar prototipo inicial.
- Implementar CRUD financeiro basico.

### Fase 2 - Vault e RAG

- Estruturar vault Obsidian.
- Criar pipeline de ingestao.
- Indexar notas com pgvector.
- Permitir que agentes usem contexto do vault.

### Fase 3 - Primeiro agente

- Implementar um agente simples antes de usar orquestracao complexa.
- Criar streaming no chat.
- Registrar prompt, resposta e acao sugerida.
- Exigir confirmacao para qualquer alteracao de dados.

### Fase 4 - Agentes especialistas

- Categorization Agent.
- Insights Agent.
- Budget Advisor.
- Subscription Auditor.
- Avaliacao com cenarios reais.

### Fase 5 - Refinamento e avaliacao

- Melhorar interface com base em testes de usabilidade.
- Adicionar guardrails.
- Criar metricas de qualidade dos agentes.
- Documentar decisoes de arquitetura e IHC.

## Evolucao posterior: B2B / Enterprise

Depois que o Personal estiver estavel, o Tio Patinhas pode evoluir para um modulo Enterprise.

Esse modulo transforma a infraestrutura de agentes em observabilidade de custos de IA para times e empresas.

### Ideia

Empresas que usam LLMs gastam dinheiro a cada chamada. O modulo Enterprise registra:

- prompt;
- modelo;
- agente;
- tokens;
- latencia;
- custo;
- status;
- projeto ou organizacao.

### Componentes futuros

```text
backend/app/
  b2b/
    collector.py
    pricing.py
    reports.py
    alerts.py
    schemas.py

  middleware/
    ai_cost_tracker.py

sdk/
  python/
  typescript/
```

### Agentes Enterprise

- Report Agent: gera relatorios de custo.
- Anomaly Agent: detecta picos anormais.
- Budget Alert Agent: alerta quando um projeto se aproxima do limite.

## Como rodar

```bash
docker-compose up --build
```

Backend:

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
python -m http.server 5173
```

Depois acesse `http://localhost:5173`.

Variaveis principais:

```bash
POSTGRES_URL=postgresql://localhost:5432/fintrack
REDIS_URL=redis://localhost:6379
JWT_SECRET=<min 256 bits>
ANTHROPIC_API_KEY=sk-ant-...
VAULT_PATH=/absolute/path/to/vault
```

## Testes e avaliacao

```bash
cd backend
pytest
pytest eval/
```

## Decisoes principais

- B2C vem primeiro porque e onde IHC, agentes e produto sao validados.
- B2B fica separado para nao contaminar o MVP.
- Obsidian/Zettelkasten e a memoria de longo prazo conceitual.
- PostgreSQL guarda dados transacionais.
- pgvector permite RAG por usuario.
- Agentes devem explicar, sugerir e pedir confirmacao antes de agir.
- Custo por interacao deve ser registrado desde cedo para preparar o modulo Enterprise.

## Autor

Felipe Murilo Ribeiro Ribeiro

## Licenca

MIT License
