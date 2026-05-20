"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign, TrendingDown, TrendingUp, Activity,
  RefreshCw, ArrowRight, Search, Landmark,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { mockUser, mockIndicadores, mockDiagnostico, mockGastosPorCategoria, mockIncome } from "@/lib/mock";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const rendaMensal = mockIncome.reduce((acc: number, item: any) => acc + item.valor_mensal, 0);
  const gastosMes = mockDiagnostico.diagnostico.total_debitos;
  const sobra = rendaMensal - gastosMes;
  const score = mockDiagnostico.score.score;

  const scoreColor = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-yellow-400" : score >= 40 ? "text-orange-400" : "text-red-400";
  const scoreBarColor = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-yellow-500" : score >= 40 ? "bg-orange-500" : "bg-red-500";

  const today = new Date();
  const dateStr = today.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Olá, {mockUser.nome} 👋</h1>
          <p className="text-sm text-muted-foreground capitalize">{dateStr}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 self-start">
          <RefreshCw className="w-4 h-4" />
          Atualizar diagnóstico
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="bg-card border-border animate-fade-in">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Renda mensal</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-emerald-400">
                  R$ {rendaMensal.toLocaleString("pt-BR")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border animate-fade-in animation-delay-100">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Gastos do mês</span>
                  <TrendingDown className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-2xl font-bold">
                  R$ {gastosMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((gastosMes / rendaMensal) * 100).toFixed(0)}% da renda
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border animate-fade-in animation-delay-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Sobra projetada</span>
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-2xl font-bold text-indigo-400">
                  R$ {sobra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border animate-fade-in animation-delay-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Score de Saúde</span>
                  <Activity className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${scoreColor}`}>{score}</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                  <Badge variant="secondary" className="ml-auto text-xs">{mockDiagnostico.score.nivel}</Badge>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${scoreBarColor} transition-all duration-1000`} style={{ width: `${score}%` }} />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Sherlock Diagnosis + Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sherlock Card */}
        <Card className="bg-card border-border animate-fade-in animation-delay-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Search className="w-4 h-4 text-amber-400" />
                </div>
                <CardTitle className="text-base">Diagnóstico do Sherlock</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs text-muted-foreground">Última análise: 2h atrás</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground leading-relaxed max-h-60 overflow-y-auto prose prose-invert prose-sm">
                  <p><strong>Situação:</strong> Score {score}/100 ({mockDiagnostico.score.nivel}). Taxa de poupança de ~73%.</p>
                  <p><strong>Fortes:</strong> Boa taxa de poupança, renda diversificada.</p>
                  <p><strong>Atenção:</strong> Assinaturas somam R$ 77,80/mês. Financiamento compromete R$ 1.500/mês.</p>
                  <p><strong>Próximos passos:</strong> Montar reserva de emergência e revisar assinaturas.</p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary gap-1">
                  Ver análise completa <ArrowRight className="w-3 h-3" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="bg-card border-border animate-fade-in animation-delay-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Gastos por Categoria</CardTitle>
            <p className="text-xs text-muted-foreground">Últimos 3 meses (R$)</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={mockGastosPorCategoria} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="categoria" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#13131A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: 12 }}
                    labelStyle={{ color: "#F1F5F9" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="marco" name="Março" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="abril" name="Abril" fill="#6366F1" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="maio" name="Maio" fill="#10B981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Market Widget + CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Yuyu Market Widget */}
        <Card className="bg-card border-border lg:col-span-2 animate-fade-in animation-delay-400">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-sky-400" />
              <CardTitle className="text-base">Indicadores de Mercado</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Fonte: Banco Central do Brasil</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                <span className="text-xs text-muted-foreground">Selic</span>
                <span className="text-sm font-semibold">{mockIndicadores.selic}%</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                <span className="text-xs text-muted-foreground">IPCA 12m</span>
                <span className="text-sm font-semibold">{mockIndicadores.ipca_12m}%</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                <span className="text-xs text-muted-foreground">Dólar</span>
                <span className="text-sm font-semibold">R$ {mockIndicadores.dolar}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 animate-fade-in animation-delay-400">
          <CardContent className="p-5 flex flex-col justify-center h-full">
            <h3 className="font-semibold mb-2">Simule um cenário 📈</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Veja como seu dinheiro pode crescer com juros compostos.
            </p>
            <Link href="/simulacoes">
              <Button size="sm" className="gap-2 w-full">
                Simular agora <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
