# 💸 FinTrack — Seu Gerenciador Financeiro Pessoal

> Monitore seus gastos, controle suas assinaturas e entenda para onde seu dinheiro vai — tudo em um só lugar.

---

## 📋 Visão Geral do Produto

**FinTrack** é uma aplicação web/mobile que centraliza o controle financeiro pessoal do usuário, dividindo seus gastos em duas grandes categorias:

- **Gastos Fixos** — despesas recorrentes e previsíveis (aluguel, financiamentos, assinaturas de streaming, SaaS, planos de saúde, etc.), com um módulo dedicado de **gerenciador de assinaturas** que alerta sobre renovações e calcula o custo mensal consolidado.
- **Gastos Variáveis** — despesas do dia a dia e imprevistos (supermercado, farmácia, combustível, reparos, lazer), categorizáveis e rastreáveis ao longo do tempo.

O resultado é um **dashboard financeiro pessoal** que mostra o saldo real do usuário, tendências de consumo e, no futuro, recomendações inteligentes de investimento baseadas no que sobrou no mês.

---

## 🎯 Escopo do Projeto

O projeto está dividido em **duas fases** com escopos e horizontes temporais distintos:

### Fase 1 — MVP (Escopo IHC / Entregável Acadêmico)

Foco em UX, usabilidade e funcionalidades essenciais de controle financeiro.

| Módulo | Descrição |
|---|---|
| 🔐 Autenticação | Cadastro e login de usuário |
| 💳 Gastos Fixos | CRUD de despesas recorrentes com data de vencimento |
| 📡 Gerenciador de Assinaturas | Listagem, categorização e alertas de renovação |
| 🛒 Gastos Variáveis | Registro rápido de despesas com categoria, valor e data |
| 📊 Dashboard | Resumo mensal: total gasto, saldo estimado, gráficos por categoria |
| 📁 Histórico | Visualização e filtragem de transações por período |

### Fase 2 — Evolução Inteligente (Pós-IHC / Roadmap Futuro)

Camada de inteligência artificial para análise de perfil e sugestões de investimento.

| Módulo | Descrição |
|---|---|
| 🤖 Motor de IA | Análise do histórico de gastos e perfil do usuário |
| 📈 Perfil de Investidor | Classificação automática (conservador, moderado, arrojado) |
| 💡 Sugestões de Ações | Recomendações de ativos com base no saldo disponível |
| 🔔 Alertas Inteligentes | Notificações preditivas sobre padrões de gasto anômalos |

---

## 🏗️ Arquitetura e Tecnologias

### Fase 1 — Stack Principal

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                      │
│         React + TypeScript + Vite               │
│   (React Query · Recharts · React Hook Form)    │
└─────────────────┬───────────────────────────────┘
                  │ REST / JSON
┌─────────────────▼───────────────────────────────┐
│                   BACKEND                       │
│           Java 21 + Spring Boot 3               │
│  (Spring Security · Spring Data · JWT Auth)     │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│                  BANCO DE DADOS                 │
│               MongoDB (NoSQL)                   │
│  (documentos flexíveis para gastos e perfis)    │
└─────────────────────────────────────────────────┘
```

#### Por que esse stack?

| Tecnologia | Justificativa |
|---|---|
| **React + TypeScript** | Ecossistema maduro, tipagem estática evita bugs de runtime, componentes reutilizáveis para o dashboard |
| **Java + Spring Boot** | Robusto, amplamente adotado no mercado, excelente suporte a segurança (Spring Security + JWT) e testes |
| **MongoDB** | Schema flexível ideal para gastos heterogêneos (cada tipo de gasto tem campos diferentes); escalabilidade horizontal nativa |

---

### Fase 2 — Stack de IA

```
┌─────────────────────────────────────────────────┐
│              SERVIÇO DE IA (Microserviço)        │
│              Python + FastAPI                   │
│  (scikit-learn · pandas · yfinance · LangChain) │
└─────────────────┬───────────────────────────────┘
                  │ REST / gRPC
          Backend Spring Boot (Fase 1)
```

#### Por que Python para IA?

| Tecnologia | Justificativa |
|---|---|
| **Python + FastAPI** | Ecossistema de ML/AI mais maduro disponível; FastAPI entrega performance assíncrona com tipagem |
| **scikit-learn** | Algoritmos clássicos de classificação de perfil de investidor (k-NN, Random Forest) sem overhead de deep learning |
| **yfinance / B3 APIs** | Acesso a dados históricos de ações da bolsa brasileira para sugestões contextualizadas |
| **LangChain** | Orquestração de LLMs para geração de justificativas das recomendações em linguagem natural |

> ⚠️ **Nota Arquitetural:** A IA é isolada como um **microserviço independente** para não acoplar complexidade ao backend principal e permitir evolução independente.

---

## 📁 Estrutura Prevista do Repositório

```
ihc-p2/
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas (Dashboard, Gastos, Assinaturas)
│   │   ├── hooks/          # Custom hooks (useExpenses, useSubscriptions)
│   │   ├── services/       # Camada de API (axios)
│   │   └── types/          # Tipos TypeScript globais
│   └── package.json
│
├── backend/                # Java + Spring Boot
│   ├── src/main/java/
│   │   ├── controller/     # REST Controllers
│   │   ├── service/        # Regras de negócio
│   │   ├── repository/     # Spring Data MongoDB
│   │   ├── model/          # Documentos MongoDB
│   │   └── config/         # Spring Security, CORS, JWT
│   └── pom.xml
│
├── ai-service/             # Python + FastAPI (Fase 2)
│   ├── app/
│   │   ├── routers/        # Endpoints de análise
│   │   ├── models/         # Modelos de ML
│   │   └── services/       # Lógica de recomendação
│   └── requirements.txt
│
├── docs/                   # Documentação e protótipos (Figma exports)
├── CLAUDE.md               # Guia para AI assistants
└── README.md
```

---

## 🗺️ Roadmap

```
[IHC - Fase 1]                          [Pós-IHC - Fase 2]
     │                                         │
     ▼                                         ▼
Semana 1-2: Setup + Auth           Mês 3: Microserviço Python/FastAPI
Semana 3-4: Gastos Fixos           Mês 4: Coleta de dados + treinamento ML
Semana 5-6: Assinaturas           Mês 5: Integração backend ↔ AI service
Semana 7-8: Gastos Variáveis      Mês 6: Sugestões de ações + alertas
Semana 9:   Dashboard + Gráficos  Mês 7: Beta fechado + refinamento
Semana 10:  Testes de usabilidade Mês 8: Lançamento público
```

---

## 🚀 Como Rodar Localmente (Fase 1)

### Pré-requisitos
- Node.js >= 20
- Java 21 (JDK)
- MongoDB rodando localmente ou via Docker
- Docker (opcional, recomendado)

### Com Docker Compose
```bash
docker-compose up --build
```

### Manual

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 👥 Time

Projeto desenvolvido para a disciplina de **Interação Humano-Computador (IHC)**.
Felipe Murilo Ribeiro Ribeiro

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
