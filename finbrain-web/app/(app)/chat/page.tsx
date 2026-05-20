"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Search, BarChart3, Scale, Radio, Bot, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  agent?: string;
  skill?: string;
  blocked?: boolean;
};

const AGENT_STYLES: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  sherlock: { icon: <Search className="w-3.5 h-3.5" />, color: "bg-amber-500/20 text-amber-400", label: "Sherlock" },
  benjamin: { icon: <BarChart3 className="w-3.5 h-3.5" />, color: "bg-emerald-500/20 text-emerald-400", label: "Benjamin" },
  athena: { icon: <Scale className="w-3.5 h-3.5" />, color: "bg-violet-500/20 text-violet-400", label: "Athena" },
  yuyu: { icon: <Radio className="w-3.5 h-3.5" />, color: "bg-sky-500/20 text-sky-400", label: "Yuyu" },
  educacional: { icon: <Bot className="w-3.5 h-3.5" />, color: "bg-indigo-500/20 text-indigo-400", label: "Educacional" },
  sistema: { icon: <Bot className="w-3.5 h-3.5" />, color: "bg-gray-500/20 text-gray-400", label: "Sistema" },
};

const SUGGESTED_CHIPS = [
  "Qual minha situação financeira atual?",
  "Simule R$ 300/mês por 5 anos",
  "Quanto preciso pra reserva de emergência?",
  "Como funciona o Tesouro Selic?",
];

const MOCK_RESPONSES: Record<string, { agent: string; skill?: string; content: string; blocked?: boolean }> = {
  "qual ação comprar": {
    agent: "athena",
    blocked: true,
    content: "Não posso recomendar ativos específicos — isso seria consultoria de valores mobiliários, o que exige credenciamento na CVM. Mas posso te explicar como avaliar diferentes classes de ativos e como montar uma estratégia diversificada para seus objetivos! O que gostaria de saber?",
  },
  "situação financeira": {
    agent: "sherlock",
    skill: "diagnostico_gastos + score_saude",
    content: "## 📊 Diagnóstico Rápido\n\nSua saúde financeira está em **Bom** (62/100).\n\n- **Taxa de poupança:** ~73% — excelente!\n- **Gastos fixos:** R$ 2.780 (moradia + contas)\n- **Assinaturas:** R$ 77,80/mês\n- **Dívida:** financiamento de R$ 45.000\n\n💡 **Próximo passo:** Monte uma reserva de emergência de 6 meses (≈ R$ 24.000).",
  },
  "simule": {
    agent: "benjamin",
    skill: "juros_compostos",
    content: "## 📈 Simulação de Juros Compostos\n\nCom **R$ 300/mês** durante **5 anos** a **1% a.m.**:\n\n- **Valor final:** R$ 24.671,28\n- **Total investido:** R$ 18.000,00\n- **Juros acumulados:** R$ 6.671,28\n\nÉ como uma bola de neve: nos primeiros meses o efeito é pequeno, mas nos últimos 12 meses os juros sozinhos rendem mais do que um aporte inteiro!",
  },
  "reserva": {
    agent: "benjamin",
    skill: "reserva_emergencia",
    content: "## 🛡️ Reserva de Emergência\n\nBaseado nos seus gastos essenciais de ~R$ 4.000/mês:\n\n- **Reserva ideal:** R$ 24.000 (6 meses)\n- **Se poupar R$ 1.000/mês:** atingiria em **24 meses**\n- **Se poupar R$ 2.000/mês:** atingiria em **12 meses**\n\n💡 Guarde em investimentos com **liquidez diária** (Tesouro Selic ou CDB com liquidez).",
  },
  "tesouro": {
    agent: "educacional",
    content: "## 📚 Tesouro Selic\n\nO **Tesouro Selic** é um título público federal que acompanha a taxa Selic (hoje 14,75% a.a.).\n\n**Características:**\n- ✅ Liquidez diária (resgata em D+1)\n- ✅ Baixa volatilidade (praticamente não perde valor)\n- ✅ Garantido pelo Governo Federal\n- ⚠️ IR regressivo (22,5% a 15% conforme prazo)\n- ⚠️ Taxa B3 de 0,20% a.a.\n\n**Para quem serve:** reserva de emergência e objetivos de curto prazo.\n\nFonte: Tesouro Nacional (tesourodireto.com.br)",
  },
};

function findMockResponse(input: string) {
  const lower = input.toLowerCase();
  for (const [key, resp] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(key)) return resp;
  }
  return {
    agent: "educacional",
    content: "Ótima pergunta! Posso te ajudar com:\n- Diagnóstico financeiro\n- Simulações de juros compostos\n- Reserva de emergência\n- Conceitos de investimento\n\nTente perguntar algo como 'Qual minha situação financeira?' ou 'Simule R$ 500/mês por 10 anos'.",
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const agentMsgId = (Date.now() + 1).toString();
    const agentMsg: Message = {
      id: agentMsgId,
      role: "agent",
      content: "",
      agent: "sistema",
    };
    
    setMessages(prev => [...prev, agentMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: userMsg.content }),
      });

      if (!res.body) throw new Error("No response body");

      setIsTyping(false); 
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || ""; // Keep the incomplete line in the buffer
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "");
            if (!dataStr.trim()) continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.type === "meta") {
                setMessages(prev => prev.map(m => 
                  m.id === agentMsgId 
                    ? { ...m, agent: data.agente_usado, skill: data.skill_chamada } 
                    : m
                ));
              } else if (data.type === "chunk") {
                setMessages(prev => prev.map(m => 
                  m.id === agentMsgId 
                    ? { ...m, content: m.content + data.content } 
                    : m
                ));
              }
            } catch(e) {
              console.error("SSE parse error", e, dataStr);
            }
          }
        }
      }
    } catch (e) {
      setMessages(prev => prev.map(m => 
        m.id === agentMsgId 
          ? { ...m, content: m.content + "\n\n[Erro na comunicação com servidor.]" } 
          : m
      ));
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Como posso ajudar?</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Converse com os agentes do Tio Patinhas sobre sua vida financeira.
              Tudo aqui é educacional — nunca recomendamos ativos.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTED_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => { setInput(chip); }}
                  className="px-3 py-2 text-xs rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div className={`max-w-[85%] sm:max-w-[70%] ${msg.role === "user" ? "order-1" : ""}`}>
              {/* Agent header */}
              {msg.role === "agent" && msg.agent && (
                <div className="flex items-center gap-2 mb-1.5">
                  {(() => {
                    const style = AGENT_STYLES[msg.agent] || AGENT_STYLES.sistema;
                    return (
                      <>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${style.color}`}>
                          {style.icon}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{style.label}</span>
                        {msg.skill && <Badge variant="outline" className="text-[10px] py-0">🧮 {msg.skill}</Badge>}
                        {msg.blocked && <Badge variant="destructive" className="text-[10px] py-0">⚖️ Compliance</Badge>}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Message bubble */}
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : msg.blocked
                    ? "bg-violet-500/10 border border-violet-500/20 rounded-tl-sm"
                    : "bg-card border border-border rounded-tl-sm"
              }`}>
                {msg.role === "agent" ? (
                  <div className="prose prose-invert prose-sm max-w-none [&_h2]:text-base [&_h2]:mt-0 [&_h2]:mb-2 [&_p]:mb-2 [&_ul]:my-1 [&_li]:my-0">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Disclaimer + Input */}
      <div className="border-t border-border pt-3 space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <AlertTriangle className="w-3 h-3" />
          Conteúdo educacional — não é recomendação de investimento.
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre finanças..."
            className="flex-1 bg-muted/30 border-border"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
