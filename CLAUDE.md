# CLAUDE.md — FinTrack AI Assistant Guide

> Este arquivo fornece contexto para AI assistants (Claude, Copilot, etc.) trabalhando neste repositório.
> **Sujeito a modificações** conforme o projeto evolui.

---

## 🧭 O que é este projeto?

**FinTrack** é uma aplicação de controle financeiro pessoal com dois módulos principais:
- **Gastos Fixos** — despesas recorrentes e gerenciador de assinaturas
- **Gastos Variáveis** — registro de despesas do dia a dia e imprevistos

Para detalhes completos de produto e arquitetura, consulte o [README.md](./README.md).

---

## 🏗️ Estrutura do Monorepo

```
ihc-p2/
├── frontend/     → React + TypeScript (Vite)
├── backend/      → Java 21 + Spring Boot 3
├── ai-service/   → Python + FastAPI (Fase 2, ainda não implementado)
└── docs/         → Documentação, wireframes, decisões de design
```

---

## ⚙️ Stack e Convenções

### Frontend (`/frontend`)

- **Framework:** React 18 + TypeScript (modo strict)
- **Build tool:** Vite
- **Estilo:** CSS Modules ou Styled Components — **não usar Tailwind**
- **Requisições HTTP:** `axios` com interceptors para token JWT
- **Estado server-side:** React Query (`@tanstack/react-query`)
- **Formulários:** React Hook Form + Zod para validação
- **Gráficos:** Recharts
- **Roteamento:** React Router v6

**Convenções de código:**
- Componentes: PascalCase (`ExpenseCard.tsx`)
- Hooks: camelCase com prefixo `use` (`useExpenses.ts`)
- Serviços de API: sufixo `.service.ts` (`expenses.service.ts`)
- Tipos globais em `src/types/`
- Evitar `any` — preferir tipos explícitos ou `unknown`

---

### Backend (`/backend`)

- **Linguagem:** Java 21
- **Framework:** Spring Boot 3.x
- **Banco de dados:** MongoDB via Spring Data MongoDB
- **Autenticação:** Spring Security + JWT (stateless)
- **Build:** Maven (`pom.xml`)

**Convenções de código:**
- Pacote raiz: `com.fintrack`
- Controllers mapeados em `/api/v1/...`
- DTOs separados de Models de domínio (nunca expor documentos MongoDB diretamente)
- Validação com Bean Validation (`@Valid`, `@NotNull`, etc.)
- Tratamento centralizado de erros com `@ControllerAdvice`
- Logs com SLF4J (`LoggerFactory.getLogger`)

**Estrutura de pacotes:**
```
com.fintrack/
├── controller/    # @RestController — apenas roteamento e validação de entrada
├── service/       # Regras de negócio — nunca acessar repository direto no controller
├── repository/    # @Repository — interfaces Spring Data MongoDB
├── model/         # @Document — documentos MongoDB
├── dto/           # Request/Response DTOs
├── config/        # SecurityConfig, CorsConfig, JwtConfig
└── exception/     # Exceções de domínio e GlobalExceptionHandler
```

---

### Banco de Dados (MongoDB)

- **Collections principais:**
  - `users` — perfil e configurações do usuário
  - `fixed_expenses` — gastos fixos e assinaturas
  - `variable_expenses` — gastos variáveis com categoria e data
  - `categories` — categorias customizáveis por usuário

- **Schema flexível:** documentos podem ter campos opcionais por tipo de gasto
- **Índices obrigatórios:** `userId` em todas as collections de despesas
- **Não usar joins** — embeddar dados quando fizer sentido (ex: categoria dentro do documento de gasto)

---

### AI Service (`/ai-service`) — Fase 2

> ⚠️ **Ainda não implementado.** Este módulo está no roadmap pós-IHC.

- **Linguagem:** Python 3.11+
- **Framework:** FastAPI
- **ML:** scikit-learn para classificação de perfil
- **Dados de mercado:** yfinance / APIs da B3
- **LLM:** LangChain para justificativas em linguagem natural
- Comunicará com o backend via REST

---

## 🔐 Variáveis de Ambiente

### Backend (`backend/.env` ou `application.yml`)
```yaml
spring:
  data:
    mongodb:
      uri: ${MONGODB_URI:mongodb://localhost:27017/fintrack}

jwt:
  secret: ${JWT_SECRET}          # Mínimo 256 bits
  expiration: ${JWT_EXPIRATION:86400000}  # 24h em ms

cors:
  allowed-origins: ${CORS_ORIGINS:http://localhost:5173}
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

> ⚠️ **Nunca commitar `.env` com segredos reais.** Use `.env.example` como template.

---

## 🧪 Testes

### Frontend
```bash
cd frontend
npm run test        # Vitest
npm run test:ui     # Interface visual dos testes
```

### Backend
```bash
cd backend
./mvnw test         # JUnit 5 + Mockito
./mvnw verify       # Inclui testes de integração
```

---

## 🚦 Fluxo de Git

- Branch principal: `main`
- Features: `feat/<nome-curto>` (ex: `feat/subscription-manager`)
- Correções: `fix/<nome-curto>`
- Commits: seguir [Conventional Commits](https://www.conventionalcommits.org/)
  ```
  feat: adiciona módulo de assinaturas
  fix: corrige cálculo de saldo mensal
  docs: atualiza CLAUDE.md com convenções de BD
  ```

---

## 📌 Decisões de Design Registradas

| Data | Decisão | Motivo |
|---|---|---|
| 2025-05 | MongoDB como banco principal | Schema flexível para tipos heterogêneos de gastos |
| 2025-05 | IA isolada como microserviço Python | Não acoplar complexidade de ML ao backend Spring |
| 2025-05 | JWT stateless | Simplicidade para MVP; sem necessidade de sessão server-side |
| 2025-05 | React Query para estado server | Evita Redux; cache automático e revalidação simplificam muito |

---

## 🤖 Instruções para AI Assistants

Ao trabalhar neste repositório:

1. **Siga as convenções de pacotes e nomenclatura** definidas acima antes de criar qualquer arquivo
2. **Não use `any` no TypeScript** — prefira tipos explícitos
3. **Nunca exponha documentos MongoDB diretamente** — sempre use DTOs nas respostas da API
4. **Consulte este arquivo** antes de sugerir mudanças arquiteturais
5. **A Fase 2 (IA) não deve ser implementada ainda** — apenas documente e planeje
6. **Priorize usabilidade e UX** — o projeto nasce de uma disciplina de IHC
7. **Atualize este arquivo** quando houver decisões arquiteturais novas

---

*Última atualização: Maio 2025 — sujeito a modificações conforme o projeto avança.*
