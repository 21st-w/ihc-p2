/**
 * Tio Patinhas — Mock data for development without backend.
 */

// 1. PERSONA: RICO (Alta renda, Investidor)
const PERFIL_RICO = {
  user: { id: 1, nome: "Tio Patinhas", email: "patinhas@finbrain.app", criado_em: "2025-01-01T10:00:00Z" },
  income: [
    { id: 1, nome: "Pró-Labore", valor_mensal: 45000, tipo: "salario" },
    { id: 2, nome: "Dividendos", valor_mensal: 12000, tipo: "investimento" }
  ],
  debts: [],
  diagnostico: {
    score: { score: 95, nivel: "Excelente" },
    narrativa: `## 📊 Diagnóstico Financeiro\n\n**Situação Atual**\nExcelente saúde financeira. Renda muito superior aos gastos, permitindo alta capacidade de investimento.\n\n**Pontos Fortes**\n- Sem dívidas\n- Taxa de poupança superior a 60%\n\n**Próximos Passos**\n- Otimizar portfólio de ações\n- Diversificar risco global`,
    diagnostico: {
      por_categoria: { moradia: 8000, alimentacao: 3500, lazer: 4000, assinatura: 300, transporte: 1200, saude: 1500 },
      total_creditos: 57000, total_debitos: 18500,
      fixos: 9800, variaveis: 8700,
      taxa_poupanca: 0.67,
      assinaturas_detectadas: []
    }
  },
  gastosPorCategoria: [
    { categoria: "Moradia", maio: 8000, abril: 8000, marco: 8000, cor: "#6366F1" },
    { categoria: "Lazer", maio: 4000, abril: 3500, marco: 5000, cor: "#F59E0B" }
  ],
  transactions: [
    { id: 1, data: "2025-05-01T00:00:00Z", descricao: "Pró-Labore", valor: 45000, tipo: "credito", categoria: "salario" },
    { id: 2, data: "2025-05-05T00:00:00Z", descricao: "Dividendos FII", valor: 12000, tipo: "credito", categoria: "investimento" },
    { id: 3, data: "2025-05-10T00:00:00Z", descricao: "Restaurante Fasano", valor: 1200, tipo: "debito", categoria: "lazer" },
  ]
};

// 2. PERSONA: ENDIVIDADO (Ganha bem mas gasta mais, dívidas altas)
const PERFIL_ENDIVIDADO = {
  user: { id: 2, nome: "Pato Donald", email: "donald@finbrain.app", criado_em: "2025-02-01T10:00:00Z" },
  income: [
    { id: 1, nome: "Salário CLT", valor_mensal: 8000, tipo: "salario" }
  ],
  debts: [
    { id: 1, nome: "Cartão de Crédito", saldo: 15000, taxa_mensal: 0.12, parcela: 2500 },
    { id: 2, nome: "Empréstimo Pessoal", saldo: 20000, taxa_mensal: 0.05, parcela: 1200 }
  ],
  diagnostico: {
    score: { score: 35, nivel: "Crítico" },
    narrativa: `## 📊 Diagnóstico Financeiro\n\n**Situação Atual**\nSituação crítica. Suas dívidas estão consumindo mais de 40% da sua renda e a rolagem do cartão de crédito é perigosa.\n\n**Pontos Fortes**\n- Renda fixa estável\n\n**Pontos de Atenção**\n- Juros rotativos altíssimos\n- Gastos variáveis fora de controle\n\n**Próximos Passos**\n- Parar de usar o cartão imediatamente\n- Tentar portabilidade da dívida do cartão para um crédito com juros menores`,
    diagnostico: {
      por_categoria: { moradia: 3000, alimentacao: 2500, lazer: 1500, assinatura: 200, transporte: 800, dividas: 3700 },
      total_creditos: 8000, total_debitos: 11700,
      fixos: 3200, variaveis: 4800,
      taxa_poupanca: -0.46,
      assinaturas_detectadas: []
    }
  },
  gastosPorCategoria: [
    { categoria: "Dívidas", maio: 3700, abril: 3500, marco: 3000, cor: "#EF4444" },
    { categoria: "Moradia", maio: 3000, abril: 3000, marco: 3000, cor: "#6366F1" },
    { categoria: "Alimentação", maio: 2500, abril: 2800, marco: 2400, cor: "#10B981" }
  ],
  transactions: [
    { id: 1, data: "2025-05-01T00:00:00Z", descricao: "Salário CLT", valor: 8000, tipo: "credito", categoria: "salario" },
    { id: 2, data: "2025-05-05T00:00:00Z", descricao: "Fatura Cartão", valor: 2500, tipo: "debito", categoria: "dividas" },
    { id: 3, data: "2025-05-10T00:00:00Z", descricao: "Empréstimo (Parcela)", valor: 1200, tipo: "debito", categoria: "dividas" },
    { id: 4, data: "2025-05-12T00:00:00Z", descricao: "Ifood", valor: 150, tipo: "debito", categoria: "alimentacao" },
  ]
};

// 3. PERSONA: SALÁRIO MÍNIMO (Orçamento justo, sem dívidas)
const PERFIL_MINIMO = {
  user: { id: 3, nome: "Huguinho", email: "huguinho@finbrain.app", criado_em: "2025-03-01T10:00:00Z" },
  income: [
    { id: 1, nome: "Salário Mínimo", valor_mensal: 1412, tipo: "salario" }
  ],
  debts: [],
  diagnostico: {
    score: { score: 65, nivel: "Justo" },
    narrativa: `## 📊 Diagnóstico Financeiro\n\n**Situação Atual**\nSeu orçamento está muito justo, mas o lado positivo é que você não possui dívidas!\n\n**Pontos Fortes**\n- Controle absoluto de gastos\n- Zero endividamento\n\n**Pontos de Atenção**\n- Qualquer imprevisto pode gerar uma dívida\n\n**Próximos Passos**\n- Focar em aumentar a renda (renda extra)\n- Tentar guardar R$ 50/mês para pequenas emergências`,
    diagnostico: {
      por_categoria: { moradia: 600, alimentacao: 500, transporte: 200, contas: 112 },
      total_creditos: 1412, total_debitos: 1412,
      fixos: 712, variaveis: 700,
      taxa_poupanca: 0.0,
      assinaturas_detectadas: []
    }
  },
  gastosPorCategoria: [
    { categoria: "Moradia", maio: 600, abril: 600, marco: 600, cor: "#6366F1" },
    { categoria: "Alimentação", maio: 500, abril: 500, marco: 500, cor: "#10B981" },
    { categoria: "Transporte", maio: 200, abril: 200, marco: 200, cor: "#EF4444" }
  ],
  transactions: [
    { id: 1, data: "2025-05-05T00:00:00Z", descricao: "Salário Mínimo", valor: 1412, tipo: "credito", categoria: "salario" },
    { id: 2, data: "2025-05-06T00:00:00Z", descricao: "Aluguel Quarto", valor: 600, tipo: "debito", categoria: "moradia" },
    { id: 3, data: "2025-05-07T00:00:00Z", descricao: "Mercado", valor: 500, tipo: "debito", categoria: "alimentacao" },
    { id: 4, data: "2025-05-08T00:00:00Z", descricao: "Passe Ônibus", valor: 200, tipo: "debito", categoria: "transporte" },
  ]
};

const PROFILES: Record<string, any> = {
  rico: PERFIL_RICO,
  endividado: PERFIL_ENDIVIDADO,
  minimo: PERFIL_MINIMO
};

const getProfileId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("finbrain_profile") || "rico";
  }
  return "rico";
};

const selectedProfile = PROFILES[getProfileId()] || PERFIL_RICO;

export const mockUser = selectedProfile.user;
export const mockTransactions = selectedProfile.transactions;
export const mockIncome = selectedProfile.income;
export const mockDebts = selectedProfile.debts;
export const mockDiagnostico = selectedProfile.diagnostico;
export const mockGastosPorCategoria = selectedProfile.gastosPorCategoria;

export const mockIndicadores = {
  selic: "10,50",
  ipca_12m: "3,93",
  dolar: "5,0520",
  atualizado_em: new Date().toISOString(),
  fonte: "Banco Central do Brasil (SGS)",
};
