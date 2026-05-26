# Documentação de Engenharia de Software

## Visão Geral

O projeto **Tio Patinhas** foi desenvolvido com foco em **Arquitetura Limpa** e **Desacoplamento**. A aplicação é dividida em dois grandes blocos independentes: o backend (FastAPI) e o frontend (Next.js).

A decisão de adotar um modelo *cliente-servidor* puro via APIs RESTful garante que o sistema possa escalar horizontalmente e que as regras de negócio fiquem inteiramente concentradas no backend.

## Arquitetura do Backend (FastAPI)

A arquitetura do backend segue os princípios de separação de responsabilidades (Separation of Concerns).

### Estrutura de Pastas

```text
backend/app/
├── main.py         # Ponto de entrada e rotas principais
├── config.py       # Configurações centralizadas (BD, CORS, caminhos)
├── database.py     # Conexão com o SQLite e criação de tabelas
├── models.py       # Modelos de domínio (SQLAlchemy)
├── schemas.py      # Contratos de validação de dados (Pydantic)
├── agents/         # Módulos isolados com lógicas de negócio específicas
│   ├── freud.py    # Agente de diagnóstico comportamental
│   ├── moriarty.py # Agente de cálculos matemáticos
│   └── athena.py   # Agente orquestrador de conhecimento (Obsidian)
├── routers/        # Controladores de rotas
│   ├── users.py
│   ├── finances.py
│   ├── analyses.py
│   ├── simulations.py
│   └── nodes.py
└── services/       # Serviços de infraestrutura
    └── obsidian_service.py # Interação com o File System
```

### Decisões Arquiteturais

1. **Agentes como Módulos**: Ao invés de usar LLMs reais (o que aumentaria a latência e o custo para o MVP), os "agentes" foram construídos como funções determinísticas puras em Python. Isso garante previsibilidade, testes fáceis e execução síncrona rápida.
2. **SQLite como Banco Padrão**: Para o MVP e propósitos universitários, o SQLite elimina a necessidade de infraestrutura extra (como Docker para PostgreSQL), mantendo o banco em um único arquivo local.
3. **Pydantic**: Garante que nenhum dado inválido chegue aos controladores ou aos agentes.

## Arquitetura do Frontend (Next.js)

O frontend foi desenvolvido utilizando Next.js no padrão *App Router*, garantindo renderização rápida e código moderno.

### Estrutura de Pastas

```text
frontend/src/
├── app/
│   ├── layout.tsx       # Estrutura base da página (HTML/Body)
│   ├── globals.css      # Sistema de design (Tokens, Classes utilitárias)
│   ├── page.tsx         # Landing Page
│   ├── cadastro/        # Fluxo de entrada
│   ├── dashboard/       # Resumo gerencial
│   ├── diagnostico/     # Visualização do Freud
│   ├── simulacoes/      # Visualização do Moriarty
│   └── second-brain/    # Visualização da Athena (Obsidian Render)
└── lib/
    └── api.ts           # Wrapper para o fetch() centralizando chamadas
```

### Decisões Arquiteturais

1. **Client Components (`use client`)**: Como o aplicativo é altamente interativo e dependente do `localStorage` para manter o estado da sessão local no MVP, as páginas foram marcadas como client components.
2. **Vanilla CSS e Tokens**: Em vez de frameworks pesados, optamos por um `globals.css` rigoroso baseado em tokens de design CSS Variables. Isso mantém o bundle minúsculo e facilita manutenções temáticas (ex: dark mode puro).
3. **Fetch API centralizado**: Uma única função `api()` em `lib/api.ts` lida com as requisições para o backend, embutindo tratamento de erros globais.

## Fluxo de Dados (Full Analysis)

O ponto crítico do sistema é a rota `/run-full-analysis/{user_id}`. O fluxo é orquestrado de forma linear:

1. O cliente envia um `POST` com os dados financeiros.
2. O sistema persiste o `User` e o `FinancialProfile`.
3. O controlador invoca o agente **Freud** (função pura), passando o perfil financeiro.
4. O controlador invoca o agente **Moriarty** (função pura), também passando o perfil financeiro.
5. O controlador invoca a agente **Athena**, passando as saídas de *Freud* e *Moriarty*.
6. *Athena* gera a estrutura Markdown (Nodos).
7. O `obsidian_service` grava fisicamente os arquivos na pasta `/obsidian-vault`.
8. O controlador persiste as entidades (`Analysis`, `Simulation`, `Node`) no banco relacional.
9. A resposta combinada é enviada de volta ao frontend, que armazena no `localStorage` e redireciona para o `/dashboard`.
