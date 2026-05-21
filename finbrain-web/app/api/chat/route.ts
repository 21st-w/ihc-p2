import { NextRequest } from "next/server";

type MockResponse = {
  agent: string;
  skill?: string;
  blocked?: boolean;
  content: string;
};

// ---------------------------------------------------------------------------
// Ordem importa: entradas mais específicas primeiro.
// A primeira entrada cujo array `keys` tiver match vence.
// ---------------------------------------------------------------------------
const RESPONSES: Array<{ keys: string[]; resp: MockResponse }> = [

  // ── ATHENA — só bloqueia pedido EXPLÍCITO de recomendação ─────────────────
  {
    keys: [
      "qual ação comprar", "que ação comprar", "me recomend", "me indica",
      "melhor ação", "melhor papel", "qual papel", "o que comprar agora",
      "vai subir", "vai cair", "compra agora", "vende agora",
      "timing", "hora de comprar", "hora de vender",
      "minha carteira deveria ter", "me diz o que investir",
    ],
    resp: {
      agent: "athena",
      blocked: true,
      content:
        "## ⚖️ Guardrail Athena\n\nNão posso recomendar ativos específicos nem sugerir timing de mercado — isso exige credenciamento na CVM (Resolução 20/2021).\n\n**O que posso fazer por você:**\n- Explicar como cada classe de ativo funciona\n- Comparar rentabilidade líquida entre produtos (sem indicar qual escolher)\n- Simular crescimento com taxas que **você** define\n- Ajudar a entender seu perfil de risco\n\nTente: *\"Como funciona renda variável?\"*, *\"Diferença entre PGBL e VGBL\"* ou *\"Simule R$ 500/mês por 10 anos\"*.",
    },
  },

  // ── SHERLOCK — diagnóstico financeiro ────────────────────────────────────
  {
    keys: ["situação", "situacao", "diagnóstico", "diagnostico", "saúde financeira", "saude financeira", "meu perfil"],
    resp: {
      agent: "sherlock",
      skill: "diagnostico_gastos + score_saude",
      content:
        "## 📊 Diagnóstico Financeiro\n\nAnalisei seu perfil financeiro. Aqui estão os pontos principais:\n\n**Score de Saúde** — veja o painel no Dashboard. Ele é composto por:\n| Dimensão | Peso | O que avalia |\n|---|---|---|\n| Taxa de poupança | 40% | % da renda que sobra por mês |\n| Dívida/Renda | 30% | Parcelas vs. renda bruta |\n| Reserva de emergência | 30% | Meses de gastos cobertos |\n\n**Próximos passos por prioridade:**\n1. 🔴 Se dívidas com juros altos existem → quite antes de investir\n2. 🟡 Se não tem reserva → forme 3–6 meses de gastos essenciais\n3. 🟢 Se reserva está ok → comece a investir o excedente\n\n💡 Use a página **Simulações** para calcular prazos com seus números reais.",
    },
  },

  // ── BENJAMIN — simulação de juros compostos ──────────────────────────────
  {
    keys: ["simul", "juros compostos", "crescer", "aportes", "patrimônio", "patrimonio"],
    resp: {
      agent: "benjamin",
      skill: "juros_compostos",
      content:
        "## 📈 Juros Compostos — O Efeito Bola de Neve\n\nExemplo com premissas padrão (ajuste na página Simulações):\n\n| Parâmetro | Valor |\n|---|---|\n| Aporte mensal | R$ 500 |\n| Taxa | 1% a.m. (≈ 12,68% a.a.) |\n| Prazo | 60 meses (5 anos) |\n\n**Resultado:**\n- Valor final: **R$ 41.029**\n- Total aportado: R$ 30.000\n- Juros acumulados: **R$ 11.029** ✨\n\n**Por que o tempo importa tanto?**\nNos primeiros 12 meses os juros rendem ~R$ 330/mês. No 5.º ano, ~R$ 390/mês — mais do que o próprio aporte. Esse é o ponto de inflexão dos juros compostos.\n\n> Acesse **Simulações → Juros Compostos** para rodar com sua taxa e prazo reais.\n\n⚠️ *Simulação educacional. Não é recomendação de investimento.*",
    },
  },

  // ── BENJAMIN — reserva de emergência ─────────────────────────────────────
  {
    keys: ["reserva", "emergência", "emergencia", "guardar", "poupar", "fundo de emergência"],
    resp: {
      agent: "benjamin",
      skill: "reserva_emergencia",
      content:
        "## 🛡️ Reserva de Emergência\n\n**Quanto guardar?** 3 a 6 meses de **gastos essenciais** (não da renda — dos gastos: moradia, alimentação, transporte, saúde).\n\n**Onde guardar? (ordem de prioridade)**\n1. **Tesouro Selic** — liquidez D+1, rende ~Selic, garantia do governo\n2. **CDB com liquidez diária** de banco grande — coberto pelo FGC\n3. **Conta remunerada** (Nubank, Inter etc.) — prática, mas verifique a taxa\n\n**Evite:** Poupança (perde para a inflação quando Selic > 8,5%), fundos com carência, qualquer coisa sem liquidez imediata.\n\n**Regra prática:** Antes de qualquer outro investimento, esta reserva é prioridade.\n\n> Calcule o valor exato em **Simulações → Reserva de Emergência**.\n\n⚠️ *Conteúdo educacional. Não é recomendação de investimento.*",
    },
  },

  // ── EDUCACIONAL — renda fixa ──────────────────────────────────────────────
  {
    keys: ["tesouro direto", "tesouro selic", "tesouro ipca", "cdb", "lci", "lca", "renda fixa", "rendimento", "liquidez"],
    resp: {
      agent: "educacional",
      content:
        "## 📚 Renda Fixa — Guia Completo\n\n### Títulos Públicos (Tesouro Direto)\n| Produto | Indexador | Melhor para |\n|---|---|---|\n| Tesouro Selic | Selic | Reserva de emergência |\n| Tesouro IPCA+ | IPCA + cupom fixo | Objetivos de longo prazo |\n| Tesouro Prefixado | Taxa fixa | Apostas em queda da Selic |\n\n### Títulos Privados\n| Produto | Garantia | IR |\n|---|---|---|\n| CDB | FGC (R$ 250k) | Sim (regressivo) |\n| LCI / LCA | FGC (R$ 250k) | **Isento** (PF) |\n| Debênture | Sem FGC | Depende |\n| CRI / CRA | Sem FGC | **Isento** (PF) |\n\n### IR Regressivo\n| Prazo | Alíquota |\n|---|---|\n| Até 180 dias | 22,5% |\n| 181–360 dias | 20% |\n| 361–720 dias | 17,5% |\n| Acima de 720 dias | **15%** |\n\n💡 LCI/LCA são isentas de IR, então compare sempre o **rendimento líquido**, não o bruto.\n\n> Compare produtos em **Simulações → Comparar Rentabilidade**.\n\n⚠️ *Conteúdo educacional. Não é recomendação de investimento.*",
    },
  },

  // ── EDUCACIONAL — como funciona ações / renda variável (NÃO bloqueado) ───
  {
    keys: [
      "como funciona ação", "como funciona bolsa", "o que é ação", "o que sao acoes",
      "renda variável", "renda variavel", "bolsa de valores", "ibovespa",
      "o que é renda variável", "ações como funciona",
    ],
    resp: {
      agent: "educacional",
      content:
        "## 📈 Renda Variável — Como Funciona\n\nAo comprar uma **ação**, você se torna sócio de uma empresa. Seus ganhos vêm de:\n- **Valorização do papel** — preço sobe se a empresa cresce ou o mercado fica otimista\n- **Dividendos** — parte do lucro distribuída aos acionistas\n\n### Índices de Referência\n- **Ibovespa** — cesta das ações mais negociadas na B3 (~90 empresas)\n- **IFIX** — índice dos FIIs mais negociados\n- **CDI** — benchmark da renda fixa (não é ação, mas é o parâmetro de comparação)\n\n### Riscos que você precisa entender\n| Risco | O que é |\n|---|---|\n| Volatilidade | Preço oscila todo dia — você pode ter -30% antes de recuperar |\n| Concentração | Apostar tudo em 1–2 empresas amplifica perdas |\n| Liquidez | Ações de empresas pequenas podem ser difíceis de vender |\n| Psicológico | Maioria vende na baixa e compra na alta (errado) |\n\n### Horizonte recomendado\nRenda variável só faz sentido para objetivos com **prazo ≥ 5 anos** e após você já ter a reserva de emergência formada.\n\n> Use o teste de perfil no seu **Perfil** para entender sua tolerância a risco.\n\n⚠️ *Conteúdo educacional. Não é recomendação de investimento.*",
    },
  },

  // ── EDUCACIONAL — FIIs ────────────────────────────────────────────────────
  {
    keys: ["fii", "fundo imobiliário", "fundo imobiliario", "ifix", "tijolo", "papel fii", "dividendo mensal"],
    resp: {
      agent: "educacional",
      content:
        "## 🏢 Fundos de Investimento Imobiliário (FIIs)\n\nUm FII é um fundo que investe em imóveis ou papéis do setor imobiliário. Você compra cotas na bolsa e recebe **rendimentos mensais** (isentos de IR para pessoas físicas**).\n\n### Tipos de FIIs\n| Tipo | O que compra | Característica |\n|---|---|---|\n| **Tijolo** | Imóveis físicos (shoppings, galpões, lajes) | Mais estável |\n| **Papel** | CRI, LCI, LCA | Renda variável com renda fixa |\n| **FoF** | Cotas de outros FIIs | Diversificação automática |\n| **Desenvolvimento** | Projetos na planta | Maior risco, maior potencial |\n\n### Vantagens\n- Renda mensal (em geral)\n- Isenção de IR nos rendimentos (PF com < 10% do fundo e < 5k cotas)\n- Acesso ao mercado imobiliário com pouco capital\n\n### Riscos\n- Vacância (imóvel vazio = sem renda)\n- Desvalorização da cota na bolsa\n- Concentração em poucos inquilinos\n- Não tem garantia do FGC\n\n> *Isenção válida para FIIs com ≥ 50 cotistas e negociados em bolsa.*\n\n⚠️ *Conteúdo educacional. Não é recomendação de investimento.*",
    },
  },

  // ── EDUCACIONAL — previdência privada ────────────────────────────────────
  {
    keys: ["previdência", "previdencia", "pgbl", "vgbl", "aposentadoria", "inss", "prev privada"],
    resp: {
      agent: "educacional",
      content:
        "## 🏦 Previdência Privada — PGBL vs VGBL\n\n### Diferença Principal\n| | PGBL | VGBL |\n|---|---|---|\n| Dedução IR | Até 12% da renda bruta anual | Sem dedução |\n| Tributação na saída | Sobre **valor total** | Só sobre o rendimento |\n| Para quem? | Quem faz declaração **completa** | Declaração simplificada ou isento |\n\n### Como Funciona a Tributação na Saída\n**Tabela Progressiva** (como salário) — vantajoso se renda na aposentadoria for baixa\n\n**Tabela Regressiva** (melhor para longo prazo):\n| Prazo de acumulação | Alíquota |\n|---|---|\n| Até 2 anos | 35% |\n| 2–4 anos | 30% |\n| 4–6 anos | 25% |\n| 6–8 anos | 20% |\n| 8–10 anos | 15% |\n| **Acima de 10 anos** | **10%** |\n\n### Quando vale a pena?\n- **PGBL** só faz sentido se você **declara o IR completo** e aporta até 12% da renda bruta\n- Fuja de produtos com taxa de carregamento > 0% ou taxa de administração > 1% a.a.\n- Compare sempre com Tesouro IPCA+ de longo prazo antes de fechar\n\n⚠️ *Conteúdo educacional. Não é recomendação de investimento.*",
    },
  },

  // ── EDUCACIONAL — diversificação ─────────────────────────────────────────
  {
    keys: ["diversif", "carteira", "alocação", "alocacao", "distribuir", "não colocar tudo", "nao colocar tudo", "balancear"],
    resp: {
      agent: "educacional",
      content:
        "## ⚖️ Diversificação — Como Funciona na Prática\n\nDiversificar não é ter muitos ativos — é ter ativos que **não se movem juntos** (baixa correlação).\n\n### Modelo de Carteira por Perfil (educacional, não personalizado)\n\n**Conservador** — Segurança e liquidez\n```\n70% Renda Fixa (Tesouro, CDB)\n20% Reserva (liquidez diária)\n10% Multimercado baixo risco\n```\n\n**Moderado** — Crescimento com proteção\n```\n50% Renda Fixa\n30% Ações / ETFs\n20% FIIs\n```\n\n**Arrojado** — Crescimento no longo prazo\n```\n30% Renda Fixa\n50% Ações / ETFs\n20% Ativos alternativos\n```\n\n### Princípios que sempre valem\n1. **Reserve antes de investir** — sem reserva de emergência, não diversifique\n2. **Não concentre em 1 banco** — distribua entre instituições para cobertura FGC\n3. **Rebalanceie anualmente** — o tempo desbalanceia qualquer carteira\n4. **Entenda o que você compra** — se não sabe explicar, não compre\n\n> Faça o teste de perfil em **Perfil** para entender sua tolerância real.\n\n⚠️ *Modelos ilustrativos. Não são recomendações de investimento.*",
    },
  },

  // ── EDUCACIONAL — ETFs e fundos de índice ────────────────────────────────
  {
    keys: ["etf", "fundo de índice", "fundo de indice", "índice", "indice", "bova11", "ivvb11"],
    resp: {
      agent: "educacional",
      content:
        "## 📊 ETFs — Fundos de Índice\n\nUm **ETF** (Exchange Traded Fund) é um fundo que replica um índice e é negociado na bolsa como se fosse uma ação.\n\n### Vantagens dos ETFs\n- **Diversificação automática** — uma cota = exposição a dezenas/centenas de empresas\n- **Custo baixo** — taxa de administração geralmente abaixo de 0,5% a.a.\n- **Simplicidade** — sem necessidade de escolher ações individuais\n- **Liquidez** — negociados em bolsa, como ações\n\n### Exemplos de ETFs brasileiros (educacional)\n| ETF | O que replica |\n|---|---|\n| BOVA11 | Ibovespa (~90 principais ações B3) |\n| IVVB11 | S&P 500 (500 maiores empresas EUA) |\n| SMAL11 | Índice Small Cap (empresas menores) |\n| HASH11 | Índice de criptoativos |\n\n### ETF vs. Fundo de Investimento\n| | ETF | Fundo Convencional |\n|---|---|---|\n| Negociação | Em tempo real (bolsa) | Uma vez por dia (cota D+1) |\n| Custo | Geralmente menor | Pode ter taxa de performance |\n| Come-cotas | **Não** | Sim (maio e novembro) |\n\n⚠️ *Conteúdo educacional. Não é recomendação de investimento.*",
    },
  },

  // ── EDUCACIONAL — IR sobre investimentos ─────────────────────────────────
  {
    keys: ["imposto de renda", "ir sobre", "tributação", "tributacao", "pagar imposto", "come-cotas", "darf", "isenção", "isencao"],
    resp: {
      agent: "educacional",
      content:
        "## 📋 IR sobre Investimentos — Resumo\n\n### Renda Fixa\n- **Alíquota regressiva**: 22,5% → 15% conforme prazo (retido na fonte)\n- **LCI, LCA, CRI, CRA**: **isento** de IR para pessoa física\n- **Poupança**: isenta de IR (mas rende menos)\n\n### Fundos de Investimento\n- **Come-cotas**: antecipação de IR em maio e novembro (15% ou 20% dependendo do tipo)\n- **ETFs de renda variável**: 15% sobre o ganho, sem come-cotas\n\n### Ações\n- **Isenção até R$ 20.000/mês** em vendas (mercado à vista)\n- Acima disso: **15%** sobre o lucro (Day trade: 20%)\n- **Dividendos**: isentos de IR (empresa já pagou CSLL/IRPJ)\n- **JCP** (Juros sobre Capital Próprio): 15% retido na fonte\n\n### FIIs\n- **Rendimentos mensais**: **isentos** para PF com < 10% do fundo\n- **Ganho de capital** na venda de cotas: 20% sobre o lucro\n\n### Criptomoedas\n- Isenção até R$ 35.000/mês em vendas\n- Acima: 15% a 22,5% conforme valor\n- Obrigação de declarar mesmo sem vender se > R$ 5.000 em custódia\n\n⚠️ *Conteúdo educacional. Consulte um contador para a sua situação específica.*",
    },
  },

  // ── EDUCACIONAL — CDI, Selic, IPCA ───────────────────────────────────────
  {
    keys: ["cdi", "selic", "ipca", "inflação", "inflacao", "taxa básica", "taxa basica", "copom", "juros no brasil"],
    resp: {
      agent: "educacional",
      content:
        "## 📉 CDI, Selic e IPCA — A Tríade dos Investimentos Brasileiros\n\n### Selic\nA **taxa básica de juros** definida pelo Banco Central a cada 45 dias (COPOM). É o custo do dinheiro na economia. Hoje: **10,50% a.a.**\n\n### CDI\n**Certificado de Depósito Interbancário** — taxa de juros dos empréstimos entre bancos. Na prática, **CDI ≈ Selic − 0,10%**. É o benchmark da renda fixa:\n- CDB que rende \"100% do CDI\" = rendimento quase igual à Selic\n- \"120% do CDI\" = banco pagando mais para captar recursos\n\n### IPCA\n**Índice de Preços ao Consumidor Amplo** — inflação oficial do Brasil. Hoje: **~3,93% a.a.**\n\n### A Relação entre os Três\n```\nSelic = 10,50%  →  CDI ≈ 10,40%  →  IPCA = 3,93%\nJuro real = CDI - IPCA ≈ 6,27% a.a.\n```\n\n**Juro real positivo** significa que investindo no CDI você está ganhando acima da inflação. Quando isso acontece, renda fixa se torna muito atrativa.\n\n### Impacto no seu investimento\n| Cenário | O que favorece |\n|---|---|\n| Selic alta | Renda fixa (CDI, Tesouro Selic) |\n| Selic em queda | Prefixados, IPCA+, ações |\n| Inflação alta | Tesouro IPCA+ |\n\n⚠️ *Conteúdo educacional. Não é recomendação de investimento.*",
    },
  },

  // ── EDUCACIONAL — classes de ativos / onde investir ──────────────────────
  {
    keys: [
      "investir", "aplicar", "classes de ativos", "tipos de investimento",
      "como começar", "como comecar", "primeiro investimento", "começar a investir",
      "pesquisa", "me explica", "me fala sobre", "quais são os", "quais sao os",
      "onde colocar", "o que fazer com",
    ],
    resp: {
      agent: "educacional",
      content:
        "## 🗺️ Mapa dos Investimentos\n\nAs classes de ativos do mais seguro/simples para o mais arriscado/complexo:\n\n### 1. Renda Fixa (baixo risco)\nEmpréstimo ao governo ou bancos com retorno previsível.\n- Tesouro Direto, CDB, LCI, LCA, Debêntures\n- Ideal para: reserva de emergência e objetivos de curto/médio prazo\n\n### 2. Fundos de Investimento (variado)\nGestor profissional monta a carteira. Você compra cotas.\n- Fundos DI, Multimercado, Cambiais, de Ações\n- Ideal para: quem quer delegar a gestão\n\n### 3. FIIs — Fundos Imobiliários (médio risco)\nCotas de imóveis negociadas na bolsa. Renda mensal possível.\n- Ideal para: renda passiva e exposição ao setor imobiliário\n\n### 4. Renda Variável — Ações e ETFs (alto risco)\nVolatilidade alta — mas melhor potencial no longo prazo.\n- Ações, ETFs, BDRs\n- Ideal para: prazo ≥ 5 anos, com reserva já formada\n\n### 5. Alternativos (alto risco/complexidade)\n- Criptomoedas, COE, fundos de PE/VC\n- Para carteiras já diversificadas e perfis arrojados\n\n---\n\n**Por onde começar?**\n1. 🛡️ Reserve 3–6 meses de gastos (Tesouro Selic ou CDB com liquidez)\n2. 🧪 Faça o teste de perfil em **Perfil**\n3. 📈 Simule cenários em **Simulações**\n\n⚠️ *Conteúdo educacional. Não é recomendação de investimento.*",
    },
  },

  // ── EDUCACIONAL — poupança ────────────────────────────────────────────────
  {
    keys: ["poupança", "poupanca", "caderneta", "poupar no banco"],
    resp: {
      agent: "educacional",
      content:
        "## 🐷 Poupança — O Que Você Precisa Saber\n\nA poupança é o investimento mais popular do Brasil, mas raramente o mais eficiente.\n\n### Como ela rende\n- **Selic ≤ 8,5%**: 70% da Selic + TR\n- **Selic > 8,5%**: 0,5% a.m. + TR (hoje Selic está em 10,50%, então rende só 0,5%/mês)\n\n### Comparação com CDI (Selic = 10,50%)\n| Produto | Rendimento bruto a.a. | IR | Rendimento líquido |\n|---|---|---|---|\n| Poupança | **6,17%** | Isento | 6,17% |\n| CDB 100% CDI | ~10,40% | 15% (≥ 2 anos) | **8,84%** |\n| Tesouro Selic | ~10,40% | 15% (≥ 2 anos) | **8,84%** |\n\nA poupança rende **30% menos** que o CDI líquido neste cenário.\n\n### Quando a poupança pode fazer sentido\n- Valor abaixo de R$ 5.000 e você não quer abrir conta em corretora\n- Objetivo de curtíssimo prazo (dias)\n\n### Alternativa imediata\n**Conta remunerada** (Nubank, Inter, C6 etc.) — normalmente rende 100% do CDI, isento de come-cotas, com liquidez diária. É a poupança moderna.\n\n⚠️ *Conteúdo educacional. Não é recomendação de investimento.*",
    },
  },

  // ── EDUCACIONAL — FGTS ───────────────────────────────────────────────────
  {
    keys: ["fgts", "fundo de garantia", "saque aniversário", "saque aniversario"],
    resp: {
      agent: "educacional",
      content:
        "## 🏛️ FGTS — O Que Fazer com Ele\n\nO **Fundo de Garantia por Tempo de Serviço** rende **TR + 3% a.a.** — bem abaixo da Selic.\n\n### Modalidades de Saque\n| Modalidade | Quando saca | Perda de direitos |\n|---|---|---|\n| **Saque aniversário** | 1x/ano (% do saldo) | Perde saque total em demissão sem justa causa |\n| **Saque rescisão** | Só em demissão s/ justa causa | Não |\n| **Saque doença grave** | Diagnóstico específico | Não |\n\n### Saque Aniversário — Vale a Pena?\n**Prós:**\n- Acesso ao dinheiro que renderia pouco\n- Pode ser investido a taxas maiores\n\n**Contras:**\n- Perde o saque integral em demissão sem justa causa\n- Se você trabalha CLT com risco de demissão → **cuidado**\n\n### Como Antecipar o Saque Aniversário\nVárias fintechs e bancos oferecem antecipação das parcelas futuras com desconto. Compare as taxas — costumam ficar entre 1,5% e 2,5% a.m., que pode ser vantajoso comparado ao rendimento do FGTS (0,25% a.m.).\n\n⚠️ *Conteúdo educacional. Avalie sua situação empregatícia antes de aderir.*",
    },
  },

  // ── EDUCACIONAL — perfil de investidor ───────────────────────────────────
  {
    keys: ["perfil de investidor", "tolerância a risco", "tolerancia a risco", "conservador", "moderado", "arrojado", "agressivo", "meu perfil de investidor"],
    resp: {
      agent: "educacional",
      content:
        "## 🧭 Perfil de Investidor\n\nConhecer seu perfil é o primeiro passo antes de qualquer decisão de investimento.\n\n### Os Três Perfis\n**Conservador**\n- Prioridade: proteger o patrimônio\n- Tolerância a perdas: muito baixa\n- Horizonte típico: curto/médio prazo\n- Foco: renda fixa, liquidez\n\n**Moderado**\n- Aceita alguma volatilidade por mais retorno\n- Horizonte: médio/longo prazo\n- Foco: mix de renda fixa + variável\n\n**Arrojado**\n- Busca retornos maiores aceitando oscilações fortes\n- Horizonte: longo prazo (≥ 5 anos)\n- Foco: ações, FIIs, ETFs, alternativo\n\n### O Que Determina Seu Perfil?\n1. **Prazo** — quando você vai precisar do dinheiro?\n2. **Renda** — você depende desse dinheiro para viver?\n3. **Psicologia** — você dormiria bem com -30% na carteira?\n4. **Experiência** — já investiu antes? Já viu uma queda forte?\n\n> Faça o teste completo na página **Perfil** do Tio Patinhas — leva 2 minutos.\n\n⚠️ *O perfil indica tendências, não determina o que você deve fazer.*",
    },
  },

  // ── EDUCACIONAL — cripto ──────────────────────────────────────────────────
  {
    keys: ["cripto", "bitcoin", "ethereum", "btc", "eth", "criptomoeda", "blockchain", "web3"],
    resp: {
      agent: "educacional",
      content:
        "## ₿ Criptomoedas — Conceitos e Riscos\n\n**Criptomoedas** são ativos digitais que usam blockchain (registro distribuído imutável). Bitcoin foi o primeiro (2009).\n\n### O Que São\n- **Bitcoin (BTC)**: reserva de valor digital, oferta limitada a 21 milhões\n- **Ethereum (ETH)**: plataforma de contratos inteligentes\n- **Stablecoins (USDC, USDT)**: atreladas ao dólar, menos voláteis\n- **Altcoins**: milhares de projetos, maioria de alto risco\n\n### Riscos Específicos\n| Risco | Descrição |\n|---|---|\n| Volatilidade extrema | -70% a +300% em um ano é comum |\n| Regulatório | Mudanças de regras podem impactar preços |\n| Custódia | Se perder a chave privada, perdeu tudo |\n| Fraude | Muitos projetos são golpes (DYOR) |\n| Liquidez | Altcoins pequenas podem ser difíceis de vender |\n\n### IR sobre Cripto no Brasil\n- Vendas até R$ 35.000/mês: **isento**\n- Acima: 15% a 22,5% sobre o lucro\n- Obrigação de declarar se > R$ 5.000 em custódia\n\n### Proporção Recomendada em Carteiras\nConsensso do mercado educacional: cripto é *especulação*, não investimento base. Geralmente aparece como 5–10% em carteiras arrojadas **depois** que a base está montada.\n\n⚠️ *Conteúdo educacional. Alto risco. Nunca invista mais do que pode perder.*",
    },
  },

  // ── SHERLOCK — dívidas ────────────────────────────────────────────────────
  {
    keys: ["dívida", "divida", "cartão", "cartao", "empréstimo", "emprestimo", "endividado", "juros altos", "rotativo"],
    resp: {
      agent: "sherlock",
      skill: "diagnostico_gastos",
      content:
        "## 🔍 Estratégia de Desendividamento\n\nDívidas com juros altos **destroem patrimônio** — quitar é o melhor 'investimento' que existe nessa situação.\n\n### Custo Real das Dívidas\n| Produto | Taxa típica a.a. |\n|---|---|\n| Cartão rotativo | 300% – 450% |\n| Cheque especial | 150% – 250% |\n| Empréstimo pessoal | 30% – 80% |\n| Crédito consignado | 20% – 35% |\n| Financiamento imobiliário | 9% – 14% |\n\n**Qualquer investimento vai render menos do que você paga no cartão rotativo.**\n\n### Plano de Ação\n1. **Pare** de usar o crédito rotativo imediatamente\n2. **Portabilidade** — migre dívida cara para crédito mais barato (consignado, FGTS, crédito com garantia)\n3. **Método avalanche** — pague o mínimo em todas e ataque a de **maior juro**\n4. **Método bola de neve** — se precisar de motivação, ataque a de **menor saldo** primeiro\n5. **Negocie** — bancos preferem receber menos a não receber; use Serasa Limpa Nome e renegociação direta\n\n### Após Quitar\n- Forme a reserva de emergência **antes** de investir\n- Só comece a investir quando não tiver mais dívidas com juros > CDI\n\n💡 Quer simular quanto tempo para quitar? Fale *\"Simule R$ X/mês por Y anos\"*.",
    },
  },
];

// ---------------------------------------------------------------------------

function findResponse(input: string): MockResponse {
  const lower = input.toLowerCase();
  for (const { keys, resp } of RESPONSES) {
    if (keys.some((k) => lower.includes(k))) return resp;
  }
  return {
    agent: "educacional",
    content:
      "Não entendi exatamente — pode reformular? 😊\n\nTópicos que respondo:\n\n| Pergunta | Exemplo |\n|---|---|\n| Situação financeira | *\"Qual meu diagnóstico?\"* |\n| Simular crescimento | *\"Simule R$ 500/mês por 10 anos\"* |\n| Reserva de emergência | *\"Quanto preciso guardar?\"* |\n| Classes de ativos | *\"No que posso investir?\"* |\n| Renda fixa | *\"Como funciona o Tesouro Selic?\"* |\n| CDI e inflação | *\"O que é CDI?\"* |\n| FIIs | *\"Como funcionam fundos imobiliários?\"* |\n| Previdência | *\"PGBL ou VGBL?\"* |\n| IR | *\"Quanto de IR pago em ações?\"* |\n| Diversificação | *\"Como montar uma carteira?\"* |\n| Dívidas | *\"Como sair das dívidas?\"* |\n| Poupança | *\"Poupança ainda vale?\"* |\n\n⚠️ *Não recomendo ativos específicos — apenas educação financeira.*",
  };
}

async function* streamWords(text: string, delayMs = 35) {
  const tokens = text.split(/(?<=\s)|(?=\s)/);
  for (const token of tokens) {
    yield token;
    await new Promise((r) => setTimeout(r, delayMs));
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const mensagem: string = body.mensagem ?? "";

  const mock = findResponse(mensagem);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      send({
        type: "meta",
        agente_usado: mock.agent,
        skill_chamada: mock.skill ?? null,
        blocked: mock.blocked ?? false,
      });

      await new Promise((r) => setTimeout(r, 250));

      for await (const token of streamWords(mock.content)) {
        send({ type: "chunk", content: token });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
