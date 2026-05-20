"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Shield, Scale, ArrowRight } from "lucide-react";

type SimType = "juros" | "reserva" | "comparar";

const SIM_CARDS: { type: SimType; icon: React.ReactNode; title: string; desc: string }[] = [
  { type: "juros", icon: <TrendingUp className="w-6 h-6" />, title: "Juros Compostos", desc: "Simule o crescimento do patrimônio" },
  { type: "reserva", icon: <Shield className="w-6 h-6" />, title: "Reserva de Emergência", desc: "Calcule quanto precisa guardar" },
  { type: "comparar", icon: <Scale className="w-6 h-6" />, title: "Comparar Rentabilidade", desc: "Poupança vs CDB vs Tesouro Selic" },
];

export default function SimulacoesPage() {
  const [selectedSim, setSelectedSim] = useState<SimType | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = (tipo: SimType, params: any) => {
    if (tipo === "juros") {
      const pv = parseFloat(params.valor_inicial || "0");
      const aporte = parseFloat(params.aporte_mensal || "0");
      const taxa = parseFloat(params.taxa_mensal || "0.01");
      const meses = parseInt(params.meses || "12");
      let saldo = pv;
      const evolucao = [{ mes: 0, saldo }];
      let totalInv = pv;
      for (let i = 1; i <= meses; i++) {
        saldo = saldo * (1 + taxa) + aporte;
        totalInv += aporte;
        evolucao.push({ mes: i, saldo: Math.round(saldo * 100) / 100 });
      }
      setResult({
        tipo: "juros",
        valor_final: saldo.toFixed(2),
        total_investido: totalInv.toFixed(2),
        total_juros: (saldo - totalInv).toFixed(2),
        evolucao,
      });
    } else if (tipo === "reserva") {
      const gastos = parseFloat(params.gastos || "3000");
      const m = parseInt(params.meses_cobertura || "6");
      const ap = parseFloat(params.aporte || "500");
      const alvo = gastos * m;
      setResult({
        tipo: "reserva",
        valor_alvo: alvo.toFixed(2),
        meses_para_atingir: ap > 0 ? Math.ceil(alvo / ap) : null,
        gastos_base: gastos.toFixed(2),
      });
    } else {
      setResult({
        tipo: "comparar",
        poupanca: "7,392.76",
        cdb: "7,856.21",
        tesouro: "7,832.45",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Simulações</h1>
        <p className="text-sm text-muted-foreground">Simule cenários educacionais para sua vida financeira</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SIM_CARDS.map(({ type, icon, title, desc }) => (
          <Sheet key={type} onOpenChange={(open) => { if (open) { setSelectedSim(type); setResult(null); } }}>
            <SheetTrigger className="w-full text-left outline-none">
              <Card className="bg-card border-border hover:border-primary/40 transition-colors cursor-pointer group w-full">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    {icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                  <div className="text-primary text-sm font-medium flex items-center justify-center gap-1">
                    Simular <ArrowRight className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent className="bg-card border-border w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <SheetTitle>{title}</SheetTitle>
                  <Badge variant="outline" className="text-[10px]">SIMULAÇÃO EDUCACIONAL</Badge>
                </div>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <SimForm tipo={type} onSimulate={(params) => handleSimulate(type, params)} />
                {result && result.tipo === type && <SimResult result={result} />}
              </div>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
}

function SimForm({ tipo, onSimulate }: { tipo: SimType; onSimulate: (p: any) => void }) {
  const [params, setParams] = useState<any>({});
  const set = (k: string, v: string) => setParams((p: any) => ({ ...p, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSimulate(params); }} className="space-y-4">
      {tipo === "juros" && (
        <>
          <div><label className="text-xs text-muted-foreground">Valor inicial (R$)</label><Input type="number" value={params.valor_inicial || ""} onChange={e => set("valor_inicial", e.target.value)} placeholder="1000" className="bg-muted/30 mt-1" /></div>
          <div><label className="text-xs text-muted-foreground">Aporte mensal (R$)</label><Input type="number" value={params.aporte_mensal || ""} onChange={e => set("aporte_mensal", e.target.value)} placeholder="500" className="bg-muted/30 mt-1" /></div>
          <div><label className="text-xs text-muted-foreground">Taxa mensal (ex: 0.01 = 1%)</label><Input type="number" step="0.001" value={params.taxa_mensal || ""} onChange={e => set("taxa_mensal", e.target.value)} placeholder="0.01" className="bg-muted/30 mt-1" /></div>
          <div><label className="text-xs text-muted-foreground">Meses</label><Input type="number" value={params.meses || ""} onChange={e => set("meses", e.target.value)} placeholder="12" className="bg-muted/30 mt-1" /></div>
        </>
      )}
      {tipo === "reserva" && (
        <>
          <div><label className="text-xs text-muted-foreground">Gastos essenciais mensais (R$)</label><Input type="number" value={params.gastos || ""} onChange={e => set("gastos", e.target.value)} placeholder="3000" className="bg-muted/30 mt-1" /></div>
          <div><label className="text-xs text-muted-foreground">Meses de cobertura</label><Input type="number" value={params.meses_cobertura || ""} onChange={e => set("meses_cobertura", e.target.value)} placeholder="6" className="bg-muted/30 mt-1" /></div>
          <div><label className="text-xs text-muted-foreground">Aporte mensal (R$)</label><Input type="number" value={params.aporte || ""} onChange={e => set("aporte", e.target.value)} placeholder="500" className="bg-muted/30 mt-1" /></div>
        </>
      )}
      {tipo === "comparar" && (
        <>
          <div><label className="text-xs text-muted-foreground">Valor inicial (R$)</label><Input type="number" value={params.valor_inicial || ""} onChange={e => set("valor_inicial", e.target.value)} placeholder="1000" className="bg-muted/30 mt-1" /></div>
          <div><label className="text-xs text-muted-foreground">Aporte mensal (R$)</label><Input type="number" value={params.aporte_mensal || ""} onChange={e => set("aporte_mensal", e.target.value)} placeholder="500" className="bg-muted/30 mt-1" /></div>
          <div><label className="text-xs text-muted-foreground">Meses</label><Input type="number" value={params.meses || ""} onChange={e => set("meses", e.target.value)} placeholder="12" className="bg-muted/30 mt-1" /></div>
        </>
      )}
      <Button type="submit" className="w-full">Simular</Button>
    </form>
  );
}

function SimResult({ result }: { result: any }) {
  return (
    <Card className="bg-muted/20 border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          Resultado
          <Badge variant="outline" className="text-[10px]">📊 EDUCACIONAL</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.tipo === "juros" && (
          <>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><p className="text-xs text-muted-foreground">Valor final</p><p className="text-lg font-bold text-emerald-400">R$ {parseFloat(result.valor_final).toLocaleString("pt-BR")}</p></div>
              <div><p className="text-xs text-muted-foreground">Investido</p><p className="text-lg font-bold">R$ {parseFloat(result.total_investido).toLocaleString("pt-BR")}</p></div>
              <div><p className="text-xs text-muted-foreground">Juros</p><p className="text-lg font-bold text-primary">R$ {parseFloat(result.total_juros).toLocaleString("pt-BR")}</p></div>
            </div>
            {result.evolucao && (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={result.evolucao}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="mes" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#13131A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: 11 }} />
                  <Line type="monotone" dataKey="saldo" stroke="#6366F1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </>
        )}
        {result.tipo === "reserva" && (
          <div className="space-y-2">
            <p><span className="text-muted-foreground">Reserva ideal:</span> <span className="text-lg font-bold text-emerald-400">R$ {parseFloat(result.valor_alvo).toLocaleString("pt-BR")}</span></p>
            <p><span className="text-muted-foreground">Gastos base:</span> R$ {parseFloat(result.gastos_base).toLocaleString("pt-BR")}/mês</p>
            {result.meses_para_atingir && <p><span className="text-muted-foreground">Tempo estimado:</span> <span className="font-semibold">{result.meses_para_atingir} meses</span></p>}
          </div>
        )}
        {result.tipo === "comparar" && (
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Poupança</span><span className="font-mono">R$ {result.poupanca}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">CDB 100% CDI</span><span className="font-mono text-emerald-400">R$ {result.cdb}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tesouro Selic</span><span className="font-mono text-primary">R$ {result.tesouro}</span></div>
          </div>
        )}
        <p className="text-[10px] text-muted-foreground pt-2 border-t border-border">
          ⚠️ Simulação educacional. Não é recomendação de investimento. Performance passada não garante resultados futuros.
        </p>
      </CardContent>
    </Card>
  );
}
