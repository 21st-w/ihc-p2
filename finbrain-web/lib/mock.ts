/**
 * FinBrain — Mock data for development without backend.
 */

export const mockUser = {
  id: 1,
  nome: "Felipe",
  email: "demo@finbrain.app",
  criado_em: "2025-03-15T10:00:00Z",
};

export const mockTransactions = [
  // Mês atual
  { id: 1, data: "2025-05-01T00:00:00Z", descricao: "Salário", valor: 12000, tipo: "credito", categoria: "salario" },
  { id: 2, data: "2025-05-02T00:00:00Z", descricao: "Aluguel", valor: 2500, tipo: "debito", categoria: "moradia" },
  { id: 3, data: "2025-05-03T00:00:00Z", descricao: "Mercado Pão de Açúcar", valor: 450, tipo: "debito", categoria: "alimentacao" },
  { id: 4, data: "2025-05-05T00:00:00Z", descricao: "Netflix", valor: 55.90, tipo: "debito", categoria: "assinatura" },
  { id: 5, data: "2025-05-05T00:00:00Z", descricao: "Spotify", valor: 21.90, tipo: "debito", categoria: "assinatura" },
  { id: 6, data: "2025-05-06T00:00:00Z", descricao: "iFood", valor: 89.90, tipo: "debito", categoria: "alimentacao" },
  { id: 7, data: "2025-05-08T00:00:00Z", descricao: "Uber", valor: 45.50, tipo: "debito", categoria: "transporte" },
  { id: 8, data: "2025-05-10T00:00:00Z", descricao: "Conta de Luz", valor: 280, tipo: "debito", categoria: "moradia" },
  { id: 9, data: "2025-05-12T00:00:00Z", descricao: "Farmácia", valor: 120, tipo: "debito", categoria: "saude" },
  { id: 10, data: "2025-05-14T00:00:00Z", descricao: "Happy hour", valor: 180, tipo: "debito", categoria: "lazer" },
  { id: 11, data: "2025-05-15T00:00:00Z", descricao: "Freelance", valor: 3000, tipo: "credito", categoria: "freelance" },
  { id: 12, data: "2025-05-16T00:00:00Z", descricao: "Academia", valor: 149, tipo: "debito", categoria: "saude" },
  { id: 13, data: "2025-05-18T00:00:00Z", descricao: "Restaurante", valor: 210, tipo: "debito", categoria: "alimentacao" },
  // Mês anterior
  { id: 14, data: "2025-04-01T00:00:00Z", descricao: "Salário", valor: 12000, tipo: "credito", categoria: "salario" },
  { id: 15, data: "2025-04-02T00:00:00Z", descricao: "Aluguel", valor: 2500, tipo: "debito", categoria: "moradia" },
  { id: 16, data: "2025-04-04T00:00:00Z", descricao: "Mercado", valor: 520, tipo: "debito", categoria: "alimentacao" },
  { id: 17, data: "2025-04-06T00:00:00Z", descricao: "Netflix", valor: 55.90, tipo: "debito", categoria: "assinatura" },
  { id: 18, data: "2025-04-10T00:00:00Z", descricao: "Uber", valor: 62.30, tipo: "debito", categoria: "transporte" },
  { id: 19, data: "2025-04-12T00:00:00Z", descricao: "Conta de Luz", valor: 310, tipo: "debito", categoria: "moradia" },
  { id: 20, data: "2025-04-18T00:00:00Z", descricao: "Jantar", valor: 250, tipo: "debito", categoria: "lazer" },
  // 2 meses atrás
  { id: 21, data: "2025-03-01T00:00:00Z", descricao: "Salário", valor: 12000, tipo: "credito", categoria: "salario" },
  { id: 22, data: "2025-03-02T00:00:00Z", descricao: "Aluguel", valor: 2500, tipo: "debito", categoria: "moradia" },
  { id: 23, data: "2025-03-05T00:00:00Z", descricao: "Mercado", valor: 480, tipo: "debito", categoria: "alimentacao" },
  { id: 24, data: "2025-03-08T00:00:00Z", descricao: "Viagem", valor: 1200, tipo: "debito", categoria: "lazer" },
  { id: 25, data: "2025-03-15T00:00:00Z", descricao: "Uber", valor: 35.80, tipo: "debito", categoria: "transporte" },
];

export const mockIncome = [
  { id: 1, nome: "Salário CLT", valor_mensal: 12000, tipo: "salario" },
  { id: 2, nome: "Freelance", valor_mensal: 3000, tipo: "freelance" },
];

export const mockDebts = [
  { id: 1, nome: "Financiamento carro", saldo: 45000, taxa_mensal: 0.012, parcela: 1500 },
];

export const mockIndicadores = {
  selic: "14,75",
  ipca_12m: "5,53",
  dolar: "5,6520",
  atualizado_em: new Date().toISOString(),
  fonte: "Banco Central do Brasil (SGS)",
};

export const mockDiagnostico = {
  score: { score: 62, nivel: "Bom" },
  narrativa: `## 📊 Diagnóstico Financeiro

**Situação Atual**
Sua saúde financeira está em **Bom** (score: 62/100). Com renda de R$ 15.000 e gastos em torno de R$ 7.500, você está conseguindo poupar cerca de 50% da renda — excelente!

**Pontos Fortes**
- Taxa de poupança acima de 20% ✅
- Diversificação de renda (CLT + freelance) 💪
- Gastos fixos controlados

**Pontos de Atenção**
- Assinaturas somam quase R$ 80/mês — vale revisar se usa todas ⚠️
- Gastos com alimentação fora de casa estão altos (delivery + restaurantes)
- Financiamento do carro compromete R$ 1.500/mês

**Próximos Passos**
- Monte sua reserva de emergência: 6× seus gastos essenciais (≈ R$ 24.000)
- Revise assinaturas não utilizadas
- Considere acelerar quitação do financiamento do carro

⚠️ Simulação educacional. Não é recomendação de investimento. Performance passada não garante resultados futuros.`,
  diagnostico: {
    por_categoria: { moradia: 2780, alimentacao: 750, lazer: 180, assinatura: 77.80, transporte: 45.50, saude: 269 },
    total_creditos: 15000, total_debitos: 4102.30,
    fixos: 2780, variaveis: 1322.30,
    taxa_poupanca: 0.73,
    assinaturas_detectadas: [
      { nome: "Netflix", valor: 55.90, ocorrencias: 3 },
      { nome: "Spotify", valor: 21.90, ocorrencias: 1 },
    ],
  },
};

export const mockGastosPorCategoria = [
  { categoria: "Moradia", maio: 2780, abril: 2810, marco: 2500, cor: "#6366F1" },
  { categoria: "Alimentação", maio: 750, abril: 520, marco: 480, cor: "#10B981" },
  { categoria: "Lazer", maio: 180, abril: 250, marco: 1200, cor: "#F59E0B" },
  { categoria: "Transporte", maio: 45.50, abril: 62.30, marco: 35.80, cor: "#EF4444" },
  { categoria: "Saúde", maio: 269, abril: 0, marco: 0, cor: "#8B5CF6" },
  { categoria: "Assinaturas", maio: 77.80, abril: 55.90, marco: 0, cor: "#EC4899" },
];
