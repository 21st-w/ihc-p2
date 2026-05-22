# FinBrain API — Tio Patinhas
Sistema de agentes financeiros educacionais com simulações realistas e memória estruturada do usuário.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.14+
- Node.js 18+

### Setup

```bash
# Backend
cd finbrain-api
docker-compose up -d
.venv/bin/pip install -r requirements.txt
PYTHONPATH=$(pwd) .venv/bin/python -m uvicorn app.main:app --reload --port 8000

# Frontend
cd ../finbrain-web
npm install
npm run dev
```

**URLs:**
- API: `http://localhost:8000`
- Frontend: `http://localhost:3000`
- API Docs: `http://localhost:8000/docs`

---

## 👥 Test Users

Três usuários pré-criados para testes com perfis diferentes:

| Email | Senha | Perfil |
|-------|-------|--------|
| `joao@finbrain.com` | `senha123` | Rico (Investidor) |
| `maria@finbrain.com` | `senha123` | Endividado |
| `carlos@finbrain.com` | `senha123` | Salário Mínimo |

---

## 📋 Usage Examples

### 1️⃣ **Query: "Qual minha situação financeira atual?"**

**Agent:** Sherlock (Diagnóstico Financeiro)

**Request:**
```bash
curl -X POST "http://localhost:3000/chat" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mensagem": "Qual minha situação financeira atual?"
  }'
```

**Response (SSE Stream):**
```json
{
  "type": "meta",
  "agente_usado": "sherlock",
  "skill_chamada": "diagnostico_gastos + score_saude",
  "indicadores": {
    "selic": 10.5,
    "ipca_12m": 4.2,
    "dolar": 5.15
  }
}
```

Sherlock analisa:
- Histórico de transações
- Gastos por categoria
- Score de saúde financeira (0-100)
- Recomendações personalizadas

---

### 2️⃣ **Query: "Simule R$ 300/mês por 5 anos"**

**Agent:** Benjamin (Simulador de Investimentos)

**Request:**
```bash
curl -X POST "http://localhost:3000/chat" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mensagem": "Simule R$ 300/mês por 5 anos"
  }'
```

**Parameters Auto-Extracted:**
- `aporte_mensal`: 300
- `retorno_anual`: 0.15 (15% ao ano - Tesouro Selic aproximado)
- `meses`: 60
- `valor_inicial`: 0

**Response:**
```json
{
  "tipo": "simulacao_juros",
  "valor_final": 24_348.52,
  "total_investido": 18_000.00,
  "total_juros": 6_348.52,
  "taxa_mensal_utilizada": 1.17,
  "taxa_anual_efetiva": 15.0,
  "evolucao": [
    {"mes": 0, "saldo": 0.00, "aporte": 300.00},
    {"mes": 1, "saldo": 303.51, "aporte": 300.00},
    {"mes": 60, "saldo": 24_348.52, "aporte": 300.00}
  ]
}
```

**Explicação de Benjamin:**
> "Com R$ 300 por mês durante 5 anos a uma rentabilidade de 15% ao ano (aproximando Tesouro Selic), você teria R$ 24.348,52. É como plantar sementes que crescem enquanto você dorme! Dos R$ 18.000 investidos, R$ 6.348 vieram apenas do juro composto."

---

### 3️⃣ **Query: "Quanto preciso pra reserva de emergência?"**

**Agent:** Benjamin (Simulador de Reserva)

**Request:**
```bash
curl -X POST "http://localhost:3000/chat" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mensagem": "Quanto preciso pra reserva de emergência?"
  }'
```

**Benjamin asks for context (Interactive):**
- Manda Sherlock analisar transações para extrair gastos essenciais
- Calcula reserva = gastos_essenciais × 6 meses (ou valor customizado)

**Response:**
```json
{
  "tipo": "simulacao_reserva",
  "valor_alvo": 18_000.00,
  "gastos_base": 3_000.00,
  "meses_cobertura": 6,
  "meses_para_atingir": 60,
  "sugestao": "Reserva ideal: R$ 18.000,00 (6 meses de gastos essenciais)."
}
```

**Explicação:**
> "A regra de ouro é: SEMPRE ter 6 meses de despesas guardadas numa conta que rende algo. Se você gasta R$ 3.000/mês, precisa de R$ 18.000. Com R$ 300/mês aportando, leva 5 anos. Mas qualquer valor começa!"

---

### 4️⃣ **Query: "Como funciona o Tesouro Selic?"**

**Agent:** Educacional (LLM educativo)

**Request:**
```bash
curl -X POST "http://localhost:3000/chat" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mensagem": "Como funciona o Tesouro Selic?"
  }'
```

**Response (Educational):**
```json
{
  "type": "chunk",
  "content": "O Tesouro Selic é o investimento mais seguro do Brasil...",
  "agente": "educacional",
  "skill_chamada": "pergunta_educacional",
  "indicadores": {
    "selic": 10.5
  }
}
```

---

## 🏗️ Architecture

### Agents
- **Sherlock**: Profile diagnosis & expense analysis
- **Benjamin**: Financial simulations (compound interest, emergency fund, asset comparison)
- **Yuyu**: Market indicators (Selic, IPCA, USD/BRL)
- **Athena**: Guardrails (guardrail executor, compliance, safety checks)

### Deterministic Skills
All calculations use `Decimal` for monetary precision:
- `juros_compostos()`: Compound interest with monthly deposits
- `reserva_emergencia()`: Emergency fund calculator
- `comparar_rentabilidade()`: Compare return across modalities
- `score_saude()`: Financial health score (0-100)

### Database Models
- `User`: User accounts with JWT auth
- `Transaction`: User transactions (categorized)
- `Simulation`: Stored simulation results
- `AgentLog`: Chat history & agent decisions
- `IncomeSource`, `Debt`: User financial profile

### Memory System
- **Vault**: Obsidian-like markdown storage (indexable via RAG)
- **Client Nodes**: Per-user memory snapshots
- **Global Network**: Shared financial knowledge

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/signup          — Register user
POST   /api/auth/login           — Login & get JWT token
GET    /api/auth/me              — Get authenticated user
POST   /api/auth/consent         — Record LGPD consent
```

### Chat & Agents
```
POST   /api/chat                 — Unified chat (SSE streaming)
POST   /api/agentes/sherlock/analisar    — Direct Sherlock analysis
POST   /api/agentes/benjamin/simular     — Direct Benjamin simulation
GET    /api/mercado/indicadores         — Market indicators
```

### User Data
```
GET    /api/transacoes           — User transactions
POST   /api/transacoes           — Create transaction
GET    /api/simulacoes           — Stored simulations
```

---

## 🛡️ Features

✅ **SSE Streaming**: Real-time agent responses
✅ **Compound Interest**: Realistic simulation with annual returns (0.15 = 15%)
✅ **JWT Auth**: Stateless session management
✅ **Guardrails**: Athena prevents harmful outputs
✅ **Decimal Precision**: No float rounding errors
✅ **LGPD Compliance**: Consent tracking & audit logs
✅ **Demo Profiles**: Switch between 3 personas (Rico, Endividado, Mínimo)
✅ **Market Integration**: Real Selic, IPCA, USD/BRL rates

---

## 📚 Educational Mode

All financial advice is framed as **educational simulation only**:
- ⚠️ No personalized investment recommendations
- ⚠️ No promises of future returns
- ⚠️ Premises are simplified for learning
- ✅ Risk disclaimers in every response
- ✅ Directed to professional advisors when needed

---

## 🔧 Environment

```bash
# .env
POSTGRES_URL=postgresql+psycopg://finbrain:finbrain@localhost:5432/finbrain
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-me-to-a-256-bit-secret-in-production
ANTHROPIC_API_KEY=sk-...
```

---

## 📝 Development

```bash
# Run tests
pytest -v --cov=app

# Format code
ruff format app/

# Type check
mypy app/ --strict

# Lint
ruff check app/
```

---

## 📄 License

See [LICENSE](./LICENSE)

---

**Made with ❤️ by the FinBrain team** — Educating Brazil, one simulation at a time.
