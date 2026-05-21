import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// ATHENA — guardrails determinísticos (nunca passam pelo LLM)
// Bloqueia qualquer pedido explícito de recomendação de ativo.
// ---------------------------------------------------------------------------
const ATHENA_PATTERNS = [
  /qual\s+(a[cç][aã]o|papel|ativo|fundo|etf)\s+(comprar|vender|investir)/i,
  /me\s+(recomend|indica|sugere|diz\s+o\s+que)/i,
  /melhor\s+(a[cç][aã]o|papel|ativo|fundo|etf|investimento\s+pra\s+mim)/i,
  /o\s+que\s+comprar\s+agora/i,
  /vai\s+(subir|cair|valorizar|desvalorizar)/i,
  /compra\s+agora|vende\s+agora/i,
  /hora\s+de\s+(comprar|vender|entrar|sair)/i,
  /timing\s+de\s+mercado/i,
  /minha\s+carteira\s+deveria\s+ter/i,
  /para\s+o\s+meu\s+perfil.*comprar/i,
];

const ATHENA_RESPONSE = `## ⚖️ Guardrail de Compliance

Não posso recomendar ativos específicos nem sugerir timing de mercado — isso exige credenciamento na CVM (Resolução 20/2021 e 19/2021).

**O que posso fazer:**
- Explicar como qualquer classe de ativo funciona
- Comparar rentabilidade líquida entre produtos (sem indicar qual escolher)
- Simular crescimento com taxas que **você** define
- Ajudar a entender seu perfil de risco

Tente: *"Como funciona renda variável?"*, *"Diferença entre PGBL e VGBL"* ou *"Simule R$ 500/mês por 10 anos"*.`;

function isAthenaBlock(input: string): boolean {
  return ATHENA_PATTERNS.some((re) => re.test(input));
}

// ---------------------------------------------------------------------------
// System prompt enviado ao Ollama
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `Você é o assistente educacional do **Tio Patinhas**, um laboratório financeiro pessoal brasileiro.

## Identidade
- Seu nome é "Assistente Tio Patinhas"
- Responda sempre em português brasileiro, de forma clara, direta e acolhedora
- Use formatação Markdown (negrito, listas, tabelas) para organizar informações
- Seja preciso com números e taxas; quando citar taxas, mencione que são exemplos educacionais

## Regras absolutas (NUNCA viole)
1. **Nunca recomende ativos específicos** (ações, ETFs, FIIs, criptomoedas etc.)
2. **Nunca sugira timing de mercado** ("agora é hora de comprar/vender")
3. **Nunca prometa rentabilidade** ("você vai ganhar X%")
4. **Nunca personalize a ponto de virar conselho** ("para o seu caso, compre X")
5. Toda resposta com dado financeiro deve terminar com: *⚠️ Conteúdo educacional. Não é recomendação de investimento.*

## O que você pode fazer
- Explicar conceitos financeiros (juros compostos, renda fixa, renda variável, FIIs, previdência, FGTS etc.)
- Comparar classes de ativos de forma genérica
- Explicar como funciona a tributação de investimentos no Brasil
- Fazer simulações com premissas que o usuário definir
- Ajudar o usuário a entender seu perfil de risco
- Explicar estratégias de desendividamento
- Esclarecer dúvidas sobre CDI, Selic, IPCA e sua relação

## Contexto da plataforma
- Usuários são brasileiros de classe média-alta, 28–42 anos
- Muitos têm dívidas ou sobra mensal inconsistente
- Já tentaram planilhas, consomem conteúdo financeiro mas não têm método
- A plataforma tem: Dashboard de saúde financeira, Simulações, e este Chat

## Tom
- Confiante mas humilde: "segundo estudos / regra geral / costuma-se dizer"
- Não seja excessivamente entusiasmado nem seco
- Quando não souber algo com certeza, diga isso claramente
- Respostas devem ser completas mas concisas — prefira tabelas a parágrafos longos`;

// ---------------------------------------------------------------------------
// Ollama streaming
// ---------------------------------------------------------------------------
const OLLAMA_URL =
  process.env.OLLAMA_URL ?? "http://localhost:11434";
const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ?? "llama3.2";

async function* ollamaStream(mensagem: string) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: mensagem },
      ],
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Ollama error: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const obj = JSON.parse(line);
        const token: string = obj?.message?.content ?? "";
        if (token) yield token;
      } catch {
        // malformed line — skip
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const mensagem: string = (body.mensagem ?? "").trim();

  const encoder = new TextEncoder();
  const send = (ctrl: ReadableStreamDefaultController, data: object) =>
    ctrl.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

  // ── Athena layer (determinístico) ────────────────────────────────────────
  if (isAthenaBlock(mensagem)) {
    const stream = new ReadableStream({
      async start(ctrl) {
        send(ctrl, { type: "meta", agente_usado: "athena", skill_chamada: null, blocked: true });
        await new Promise((r) => setTimeout(r, 200));
        for (const token of ATHENA_RESPONSE.split(/(?<=\s)|(?=\s)/)) {
          send(ctrl, { type: "chunk", content: token });
          await new Promise((r) => setTimeout(r, 25));
        }
        ctrl.close();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  }

  // ── Ollama layer ─────────────────────────────────────────────────────────
  const stream = new ReadableStream({
    async start(ctrl) {
      send(ctrl, { type: "meta", agente_usado: "educacional", skill_chamada: null, blocked: false });
      await new Promise((r) => setTimeout(r, 150));

      try {
        for await (const token of ollamaStream(mensagem)) {
          send(ctrl, { type: "chunk", content: token });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        send(ctrl, {
          type: "chunk",
          content: `\n\n*[Erro ao conectar com o modelo local: ${msg}. Verifique se o Ollama está rodando: \`ollama serve\`]*`,
        });
      }

      ctrl.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
