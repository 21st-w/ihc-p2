import { NextRequest } from "next/server";

type MockResponse = {
  agent: string;
  skill?: string;
  blocked?: boolean;
  content: string;
};

const RESPONSES: Array<{ keys: string[]; resp: MockResponse }> = [
  {
    keys: ["ação", "acao", "comprar", "vender", "ticker", "papel"],
    resp: {
      agent: "athena",
      blocked: true,
      content:
        "Não posso recomendar ativos específicos — isso seria consultoria de valores mobiliários, o que exige credenciamento na CVM (Resolução 20/2021).\n\nPosso te ajudar a **entender classes de ativos**, **comparar rentabilidades** ou **simular cenários** com premissas que você define. O que você gostaria de explorar?",
    },
  },
  {
    keys: ["situação", "situacao", "diagnóstico", "diagnostico", "saúde", "saude", "financeira"],
    resp: {
      agent: "sherlock",
      skill: "diagnostico_gastos + score_saude",
      content:
        "## 📊 Diagnóstico Financeiro\n\nAnalisei seu perfil e aqui está o resumo:\n\n**Score de Saúde:** veja o painel no Dashboard — ele reflete taxa de poupança, relação dívida/renda e cobertura da reserva de emergência.\n\n**Próximos passos sugeridos:**\n1. Confira se sua reserva de emergência cobre 6 meses de gastos essenciais\n2. Avalie se há assinaturas que podem ser canceladas\n3. Tente aumentar a taxa de poupança em pelo menos 5 pontos percentuais\n\n💡 Quer simular um cenário? Acesse **Simulações** ou me diga *\"Simule R$ X/mês por Y anos\"*.",
    },
  },
  {
    keys: ["simul", "juros", "compostos", "crescer", "mês", "mes", "anos"],
    resp: {
      agent: "benjamin",
      skill: "juros_compostos",
      content:
        "## 📈 Simulação de Juros Compostos\n\nVou usar premissas padrão — você pode ajustá-las na página **Simulações**:\n\n| Parâmetro | Valor |  \n|---|---|\n| Aporte mensal | R$ 500 |\n| Taxa | 1% a.m. (≈ 12,68% a.a.) |\n| Prazo | 60 meses (5 anos) |\n\n**Resultado estimado:**\n- Valor final: **R$ 41.029**\n- Total aportado: R$ 30.000\n- Juros acumulados: **R$ 11.029** ✨\n\nO efeito dos juros compostos fica mais visível nos últimos 12 meses — no 5.º ano, os juros superam o valor do aporte mensal.\n\n⚠️ *Simulação educacional com premissas explícitas. Não é recomendação de investimento.*",
    },
  },
  {
    keys: ["reserva", "emergência", "emergencia", "guardar", "poupar"],
    resp: {
      agent: "benjamin",
      skill: "reserva_emergencia",
      content:
        "## 🛡️ Reserva de Emergência\n\n**Quanto guardar?** A regra geral é cobrir **3 a 6 meses** de gastos essenciais (moradia, alimentação, transporte, saúde).\n\n**Onde guardar?** Priorize:\n- Tesouro Selic (liquidez D+1, rendimento próximo ao CDI)\n- CDB com liquidez diária de banco sólido\n- Conta remunerada\n\n**Evite:** poupança (rendimento abaixo do CDI quando Selic > 8,5%), fundos com carência, qualquer produto sem liquidez diária.\n\nAcesse **Simulações → Reserva de Emergência** para calcular com seus números reais.\n\n⚠️ *Conteúdo educacional. Não é recomendação de investimento.*",
    },
  },
  {
    keys: ["tesouro", "selic", "cdb", "renda fixa", "investimento", "rendimento"],
    resp: {
      agent: "educacional",
      content:
        "## 📚 Renda Fixa — Conceitos Básicos\n\n**Tesouro Selic** acompanha a taxa básica de juros (hoje em 10,50% a.a.). Liquidez diária (resgate em D+1). Garantido pelo governo federal. Ideal para reserva de emergência.\n\n**CDB** (Certificado de Depósito Bancário) emitido por bancos. Rentabilidade geralmente expressa em % do CDI (que segue a Selic de perto). Garantido pelo FGC até R$ 250k por CPF por instituição.\n\n**LCI/LCA** isentos de IR para pessoa física. Por isso costumam oferecer rentabilidade bruta menor, mas o líquido pode superar o CDB.\n\n**Atenção ao IR:** alíquota regressiva — 22,5% (até 180 dias) → 15% (acima de 720 dias).\n\nUse **Simulações → Comparar Rentabilidade** para ver o cálculo lado a lado.\n\n⚠️ *Conteúdo educacional. Não é recomendação de investimento.*",
    },
  },
  {
    keys: [
      "investir", "aplicar", "onde colocar", "onde guardar meu dinheiro",
      "classes de ativos", "tipos de investimento", "como comecar", "começar a investir",
      "pesquisa", "me explica", "me fala", "quais são", "quais sao",
    ],
    resp: {
      agent: "educacional",
      content:
        "## 📚 Classes de Ativos — Visão Geral\n\nExistem três grandes grupos, organizados do mais simples/seguro para o mais complexo/volátil:\n\n### 1. Renda Fixa\nVocê empresta dinheiro para o governo ou bancos e recebe juros combinados.\n- **Tesouro Selic** — Referência de segurança, liquidez diária\n- **CDB, LCI, LCA** — Emitidos por bancos, cobertos pelo FGC até R$ 250k\n- **Debêntures** — Emitidas por empresas, maior risco e rendimento\n\n### 2. Fundos de Investimento\nUm gestor profissional monta a carteira. Você compra cotas.\n- **Fundos DI / Renda Fixa** — Conservadores\n- **Fundos Multimercado** — Mix de ativos\n- **FIIs (Fundos Imobiliários)** — Distribuem rendimentos mensais\n\n### 3. Renda Variável\nSem rentabilidade garantida — o preço oscila com o mercado.\n- **Ações** — Você vira sócio de empresas\n- **ETFs** — Fundos que replicam índices (ex: Ibovespa)\n- **Cripto** — Alta volatilidade, sem garantia\n\n---\n\n**Qual passo faz mais sentido para você?**\n- Se ainda não tem reserva de emergência → comece pela **Renda Fixa com liquidez**\n- Se já tem reserva e quer crescer → entenda seu **perfil de risco** (teste no seu Perfil)\n- Se tem dívidas com juros altos → **quite antes** de investir\n\n⚠️ *Conteúdo educacional. Não é recomendação de investimento.*",
    },
  },
  {
    keys: ["dívida", "divida", "cartão", "cartao", "empréstimo", "emprestimo", "endividado"],
    resp: {
      agent: "sherlock",
      skill: "diagnostico_gastos",
      content:
        "## 🔍 Análise de Dívidas\n\nDívidas com juros altos (cartão rotativo ≈ 400% a.a., cheque especial ≈ 200% a.a.) devem ser **prioridade zero** antes de qualquer investimento.\n\n**Estratégia de desendividamento:**\n1. **Pare de usar** o crédito rotativo imediatamente\n2. **Portabilidade:** tente migrar a dívida do cartão para um crédito pessoal com juros menores\n3. **Bola de neve ou avalanche:** pague o mínimo em todas as dívidas e direcione o excedente para a de maior juro (avalanche) ou menor saldo (bola de neve)\n\nQuer que eu calcule quanto tempo levaria para quitar com diferentes aportes mensais?",
    },
  },
];

function findResponse(input: string): MockResponse {
  const lower = input.toLowerCase();
  for (const { keys, resp } of RESPONSES) {
    if (keys.some((k) => lower.includes(k))) return resp;
  }
  return {
    agent: "educacional",
    content:
      "Não entendi exatamente o que você quis dizer — pode reformular? 😊\n\nAqui está o que consigo responder:\n\n| Pergunta | Exemplo |\n|---|---|\n| Situação financeira | *\"Qual meu diagnóstico?\"* |\n| Simular crescimento | *\"Simule R$ 500/mês por 10 anos\"* |\n| Reserva de emergência | *\"Quanto preciso guardar?\"* |\n| Classes de ativos | *\"No que posso investir?\"* |\n| Renda fixa | *\"Como funciona o Tesouro Selic?\"* |\n| Dívidas | *\"Como sair das dívidas?\"* |\n\n⚠️ *Não recomendo ativos específicos — apenas educação financeira.*",
  };
}

async function* streamWords(text: string, delayMs = 40) {
  // Stream token by token with a small delay to simulate LLM streaming
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

      // 1. Send metadata so the frontend can update the agent badge
      send({
        type: "meta",
        agente_usado: mock.agent,
        skill_chamada: mock.skill ?? null,
        blocked: mock.blocked ?? false,
      });

      // Small pause before first chunk (simulates LLM "thinking")
      await new Promise((r) => setTimeout(r, 300));

      // 2. Stream content token by token
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
