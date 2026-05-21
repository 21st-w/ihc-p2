"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Shield, Scale, ArrowRight, LineChart as ChartIcon, Plus, X } from "lucide-react";

type SimType = "juros" | "reserva" | "comparar" | "acoes";
type SimParams = Record<string, string>;
type EvoPoint = { mes: number; saldo: number };
type AtivoRow = { ticker: string; tipo: "valor" | "cotas"; montante: string };

type SimResultData =
  | { tipo: "juros"; valor_final: string; total_investido: string; total_juros: string; evolucao: EvoPoint[] }
  | { tipo: "reserva"; valor_alvo: string; gastos_base: string; meses_para_atingir: number | null }
  | { tipo: "comparar"; poupanca: string; cdb: string; tesouro: string }
  | { tipo: "acoes"; valor_final: string; total_investido: string; retorno_projetado: string; evolucao: EvoPoint[] };

const SIM_CARDS: { type: SimType; icon: React.ReactNode; title: string; desc: string }[] = [
  { type: "juros",    icon: <TrendingUp className="w-6 h-6" />, title: "Juros Compostos",        desc: "Simule o crescimento do patrimônio" },
  { type: "reserva",  icon: <Shield     className="w-6 h-6" />, title: "Reserva de Emergência",  desc: "Calcule quanto precisa guardar" },
  { type: "comparar", icon: <Scale      className="w-6 h-6" />, title: "Comparar Rentabilidade", desc: "Poupança vs CDB vs Tesouro Selic" },
  { type: "acoes",    icon: <ChartIcon  className="w-6 h-6" />, title: "Carteira de Ações",      desc: "Simule rentabilidade de múltiplos ativos" },
];

function calcular(tipo: SimType, params: SimParams, ativos: AtivoRow[]): SimResultData {
  if (tipo === "juros") {
    const pv = parseFloat(params.valor_inicial || "0");
    const aporte = parseFloat(params.aporte_mensal || "0");
    const taxa = parseFloat(params.taxa_mensal || "0.01");
    const meses = parseInt(params.meses || "12");
    let saldo = pv;
    let totalInv = pv;
    const evolucao: EvoPoint[] = [{ mes: 0, saldo }];
    for (let i = 1; i <= meses; i++) {
      saldo = saldo * (1 + taxa) + aporte;
      totalInv += aporte;
      evolucao.push({ mes: i, saldo: Math.round(saldo * 100) / 100 });
    }
    return { tipo: "juros", valor_final: saldo.toFixed(2), total_investido: totalInv.toFixed(2), total_juros: (saldo - totalInv).toFixed(2), evolucao };
  }

  if (tipo === "reserva") {
    const gastos = parseFloat(params.gastos || "3000");
    const m = parseInt(params.meses_cobertura || "6");
    const ap = parseFloat(params.aporte || "500");
    const alvo = gastos * m;
    return { tipo: "reserva", valor_alvo: alvo.toFixed(2), gastos_base: gastos.toFixed(2), meses_para_atingir: ap > 0 ? Math.ceil(alvo / ap) : null };
  }

  if (tipo === "acoes") {
    const mockPrices: Record<string, number> = {
      PETR4: 38.50, VALE3: 62.10, ITUB4: 32.40, WEGE3: 45.20, BBDC4: 13.80,
      B3SA3: 11.50, BBAS3: 27.90, ELET3: 40.10, RENT3: 42.00, ABEV3: 12.30,
    };
    let valorInicial = ativos.reduce((acc, a) => {
      const num = parseFloat(a.montante || "0");
      return acc + (a.tipo === "cotas" ? num * (mockPrices[a.ticker.toUpperCase()] ?? 20) : num);
    }, 0);
    const aporte = parseFloat(params.aporte_mensal || "0");
    const meses = parseInt(params.meses || "12");
    const r_anual = parseFloat(params.retorno_anual || "0.15");
    const taxa_mensal = Math.pow(1 + r_anual, 1 / 12) - 1;
    let saldo = valorInicial;
    let totalInv = valorInicial;
    const evolucao: EvoPoint[] = [{ mes: 0, saldo }];
    for (let i = 1; i <= meses; i++) {
      saldo = saldo * (1 + taxa_mensal) + aporte;
      totalInv += aporte;
      evolucao.push({ mes: i, saldo: Math.round(saldo * 100) / 100 });
    }
    return { tipo: "acoes", valor_final: saldo.toFixed(2), total_investido: totalInv.toFixed(2), retorno_projetado: (r_anual * 100).toFixed(1), evolucao };
  }

  // comparar — valores fixos de demonstração
  return { tipo: "comparar", poupanca: "7.392,76", cdb: "7.856,21", tesouro: "7.832,45" };
}

export default function SimulacoesPage() {
  const [result, setResult] = useState<SimResultData | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Simulações</h1>
        <p className="text-sm text-muted-foreground">Simule cenários educacionais para sua vida financeira</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SIM_CARDS.map(({ type, icon, title, desc }) => (
          <Sheet key={type} onOpenChange={(open) => { if (open) setResult(null); }}>
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
                <SimForm tipo={type} onSimulate={(p, a) => setResult(calcular(type, p, a))} />
                {result && result.tipo === type && <SimResult result={result} />}
              </div>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
}

function SimForm({ tipo, onSimulate }: { tipo: SimType; onSimulate: (p: SimParams, a: AtivoRow[]) => void }) {
  const [params, setParams] = useState<SimParams>({});
  const [ativos, setAtivos] = useState<AtivoRow[]>([{ ticker: "", tipo: "valor", montante: "" }]);

  const set = (k: string, v: string) => setParams((p) => ({ ...p, [k]: v }));

  const updateAtivo = (idx: number, field: keyof AtivoRow, value: string) => {
    setAtivos((prev) => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  };

  return (
    <form onSubmit={(ev) => { ev.preventDefault(); onSimulate(params, ativos); }} className="space-y-4">
      {tipo === "juros" && (<>
        <div><label className="text-xs text-muted-foreground">Valor inicial (R$)</label><Input type="number" value={params.valor_inicial ?? ""} onChange={e => set("valor_inicial", e.target.value)} placeholder="1000" className="bg-muted/30 mt-1" /></div>
        <div><label className="text-xs text-muted-foreground">Aporte mensal (R$)</label><Input type="number" value={params.aporte_mensal ?? ""} onChange={e => set("aporte_mensal", e.target.value)} placeholder="500" className="bg-muted/30 mt-1" /></div>
        <div><label className="text-xs text-muted-foreground">Taxa mensal (ex: 0.01 = 1%)</label><Input type="number" step="0.001" value={params.taxa_mensal ?? ""} onChange={e => set("taxa_mensal", e.target.value)} placeholder="0.01" className="bg-muted/30 mt-1" /></div>
        <div><label className="text-xs text-muted-foreground">Meses</label><Input type="number" value={params.meses ?? ""} onChange={e => set("meses", e.target.value)} placeholder="12" className="bg-muted/30 mt-1" /></div>
      </>)}

      {tipo === "reserva" && (<>
        <div><label className="text-xs text-muted-foreground">Gastos essenciais mensais (R$)</label><Input type="number" value={params.gastos ?? ""} onChange={e => set("gastos", e.target.value)} placeholder="3000" className="bg-muted/30 mt-1" /></div>
        <div><label className="text-xs text-muted-foreground">Meses de cobertura</label><Input type="number" value={params.meses_cobertura ?? ""} onChange={e => set("meses_cobertura", e.target.value)} placeholder="6" className="bg-muted/30 mt-1" /></div>
        <div><label className="text-xs text-muted-foreground">Aporte mensal (R$)</label><Input type="number" value={params.aporte ?? ""} onChange={e => set("aporte", e.target.value)} placeholder="500" className="bg-muted/30 mt-1" /></div>
      </>)}

      {tipo === "comparar" && (<>
        <div><label className="text-xs text-muted-foreground">Valor inicial (R$)</label><Input type="number" value={params.valor_inicial ?? ""} onChange={e => set("valor_inicial", e.target.value)} placeholder="1000" className="bg-muted/30 mt-1" /></div>
        <div><label className="text-xs text-muted-foreground">Aporte mensal (R$)</label><Input type="number" value={params.aporte_mensal ?? ""} onChange={e => set("aporte_mensal", e.target.value)} placeholder="500" className="bg-muted/30 mt-1" /></div>
        <div><label className="text-xs text-muted-foreground">Meses</label><Input type="number" value={params.meses ?? ""} onChange={e => set("meses", e.target.value)} placeholder="12" className="bg-muted/30 mt-1" /></div>
      </>)}

      {tipo === "acoes" && (<>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold">Ativos da Carteira</label>
            <Button type="button" variant="outline" size="sm" className="h-7 text-xs"
              onClick={() => setAtivos(prev => [...prev, { ticker: "", tipo: "valor", montante: "" }])}>
              <Plus className="w-3 h-3 mr-1" /> Adicionar
            </Button>
          </div>
          {ativos.map((ativo, idx) => (
            <div key={idx} className="flex gap-2 items-end p-2 bg-muted/20 rounded-md border border-border">
              <div className="flex-1">
                <label className="text-[10px] text-muted-foreground">Ticker</label>
                <select className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
                  value={ativo.ticker} onChange={e => updateAtivo(idx, "ticker", e.target.value)}>
                  <option value="" disabled>Selecione</option>
                  <option value="PETR4">PETR4 - Petrobras</option>
                  <option value="VALE3">VALE3 - Vale</option>
                  <option value="ITUB4">ITUB4 - Itaú Unibanco</option>
                  <option value="WEGE3">WEGE3 - WEG</option>
                  <option value="BBDC4">BBDC4 - Bradesco</option>
                  <option value="B3SA3">B3SA3 - B3</option>
                  <option value="BBAS3">BBAS3 - Banco do Brasil</option>
                  <option value="ELET3">ELET3 - Eletrobras</option>
                  <option value="RENT3">RENT3 - Localiza</option>
                  <option value="ABEV3">ABEV3 - Ambev</option>
                </select>
              </div>
              <div className="w-20">
                <label className="text-[10px] text-muted-foreground">Entrada</label>
                <select className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
                  value={ativo.tipo} onChange={e => updateAtivo(idx, "tipo", e.target.value)}>
                  <option value="valor">R$</option>
                  <option value="cotas">Cotas</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-muted-foreground">{ativo.tipo === "valor" ? "Valor (R$)" : "Qtd Cotas"}</label>
                <Input type="number" className="h-8 text-xs bg-background"
                  placeholder={ativo.tipo === "valor" ? "1000" : "100"}
                  value={ativo.montante}
                  onChange={e => updateAtivo(idx, "montante", e.target.value)} />
              </div>
              {ativos.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={() => setAtivos(prev => prev.filter((_, i) => i !== idx))}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Retorno anual esperado (ex: 0.15 = 15%)</label>
          <Input type="number" step="0.01" value={params.retorno_anual ?? ""} onChange={e => set("retorno_anual", e.target.value)} placeholder="0.15" className="bg-muted/30 mt-1" />
          <p className="text-[10px] text-muted-foreground mt-1">Premissa que você define — não é previsão.</p>
        </div>
        <div><label className="text-xs text-muted-foreground">Aporte mensal total (R$)</label><Input type="number" value={params.aporte_mensal ?? ""} onChange={e => set("aporte_mensal", e.target.value)} placeholder="200" className="bg-muted/30 mt-1" /></div>
        <div><label className="text-xs text-muted-foreground">Prazo (Meses)</label><Input type="number" value={params.meses ?? ""} onChange={e => set("meses", e.target.value)} placeholder="24" className="bg-muted/30 mt-1" /></div>
      </>)}

      <Button type="submit" className="w-full">Simular</Button>
    </form>
  );
}

function SimResult({ result }: { result: SimResultData }) {
  return (
    <Card className="bg-muted/20 border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          Resultado
          <Badge variant="outline" className="text-[10px]">📊 EDUCACIONAL</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.tipo === "juros" && (<>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><p className="text-xs text-muted-foreground">Valor final</p><p className="text-lg font-bold text-emerald-400">R$ {parseFloat(result.valor_final).toLocaleString("pt-BR")}</p></div>
            <div><p className="text-xs text-muted-foreground">Investido</p><p className="text-lg font-bold">R$ {parseFloat(result.total_investido).toLocaleString("pt-BR")}</p></div>
            <div><p className="text-xs text-muted-foreground">Juros</p><p className="text-lg font-bold text-primary">R$ {parseFloat(result.total_juros).toLocaleString("pt-BR")}</p></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={result.evolucao}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="mes" tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#13131A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: 11 }} />
              <Line type="monotone" dataKey="saldo" stroke="#6366F1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </>)}

        {result.tipo === "reserva" && (
          <div className="space-y-2">
            <p><span className="text-muted-foreground">Reserva ideal:</span> <span className="text-lg font-bold text-emerald-400">R$ {parseFloat(result.valor_alvo).toLocaleString("pt-BR")}</span></p>
            <p><span className="text-muted-foreground">Gastos base:</span> R$ {parseFloat(result.gastos_base).toLocaleString("pt-BR")}/mês</p>
            {result.meses_para_atingir !== null && <p><span className="text-muted-foreground">Tempo estimado:</span> <span className="font-semibold">{result.meses_para_atingir} meses</span></p>}
          </div>
        )}

        {result.tipo === "comparar" && (
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Poupança</span><span className="font-mono">R$ {result.poupanca}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">CDB 100% CDI</span><span className="font-mono text-emerald-400">R$ {result.cdb}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tesouro Selic</span><span className="font-mono text-primary">R$ {result.tesouro}</span></div>
          </div>
        )}

        {result.tipo === "acoes" && (<>
          <div className="grid grid-cols-3 gap-2 text-center mb-2">
            <div><p className="text-xs text-muted-foreground">Valor final</p><p className="text-lg font-bold text-emerald-400">R$ {parseFloat(result.valor_final).toLocaleString("pt-BR")}</p></div>
            <div><p className="text-xs text-muted-foreground">Investido</p><p className="text-lg font-bold">R$ {parseFloat(result.total_investido).toLocaleString("pt-BR")}</p></div>
            <div><p className="text-xs text-muted-foreground">Retorno a.a.</p><p className="text-lg font-bold text-primary">{result.retorno_projetado}%</p></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={result.evolucao}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="mes" tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#13131A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: 11 }} />
              <Line type="monotone" dataKey="saldo" stroke="#F59E0B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </>)}

        <p className="text-[10px] text-muted-foreground pt-2 border-t border-border">
          ⚠️ Simulação educacional com premissas explícitas. Não é recomendação de investimento. Performance passada não garante resultados futuros.
        </p>
      </CardContent>
    </Card>
  );
}
