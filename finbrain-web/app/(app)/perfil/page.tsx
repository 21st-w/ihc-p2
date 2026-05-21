"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User, Mail, Shield, Trash2, PieChart, ArrowRight } from "lucide-react";
import { mockUser, mockDiagnostico, mockDebts } from "@/lib/mock";

const PERFIL_QUIZ = [
  { p: "Qual o seu principal objetivo ao investir?", resp: [{ t: "Preservar meu dinheiro", pts: 1 }, { t: "Fazer o dinheiro crescer a médio prazo", pts: 2 }, { t: "Maximizar ganhos, assumindo riscos", pts: 3 }] },
  { p: "Por quanto tempo pretende deixar o dinheiro investido?", resp: [{ t: "Menos de 1 ano", pts: 1 }, { t: "Entre 1 e 5 anos", pts: 2 }, { t: "Mais de 5 anos", pts: 3 }] },
  { p: "Como você reagiria se seus investimentos caíssem 20% em um mês?", resp: [{ t: "Tiraria tudo na hora, não suporto perder", pts: 1 }, { t: "Ficaria preocupado, mas esperaria recuperar", pts: 2 }, { t: "Aproveitaria para investir mais (comprar na baixa)", pts: 3 }] }
];

export default function PerfilPage() {
  const { score, nivel } = mockDiagnostico.score;

  const [quizOpen, setQuizOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [pontos, setPontos] = useState(0);
  const [resultado, setResultado] = useState<string | null>(null);

  const handleAnswer = (pts: number) => {
    const novosPontos = pontos + pts;
    if (step < PERFIL_QUIZ.length - 1) {
      setPontos(novosPontos);
      setStep(step + 1);
    } else {
      let r = "Conservador";
      if (novosPontos >= 5 && novosPontos <= 7) r = "Moderado";
      else if (novosPontos >= 8) r = "Arrojado";
      setResultado(r);
      setStep(step + 1); // final
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setPontos(0);
    setResultado(null);
  };

  // Compute breakdown from mock data so it reflects the active persona
  const taxa = mockDiagnostico.diagnostico.taxa_poupanca;
  const totalDebitos = mockDiagnostico.diagnostico.total_debitos;
  const totalCreditos = mockDiagnostico.diagnostico.total_creditos;
  const dividas = mockDebts?.reduce((s: number, d: { saldo: number }) => s + d.saldo, 0) ?? 0;
  const poupancaScore = Math.min(100, Math.round(Math.max(0, taxa) * 150));
  const dividaRendaScore = totalCreditos > 0 ? Math.min(100, Math.round(Math.max(0, 1 - totalDebitos / totalCreditos) * 100)) : 100;
  const reservaScore = dividas === 0 && taxa > 0 ? Math.min(100, Math.round(taxa * 200)) : 0;

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold">Perfil</h1>

      {/* Suitability */}
      <Card className="bg-card border-border hover:border-primary/40 transition-colors cursor-pointer" onClick={() => setQuizOpen(true)}>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <PieChart className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Perfil de Investidor</h3>
            <p className="text-sm text-muted-foreground">
              {resultado ? `Seu perfil atual é: ${resultado}` : "Faça o teste rápido para descobrir seu nível de risco."}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </CardContent>
      </Card>

      {/* User info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Informações pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
              {mockUser.nome[0]}
            </div>
            <div>
              <p className="font-semibold text-lg">{mockUser.nome}</p>
              <p className="text-sm text-muted-foreground">{mockUser.email}</p>
              <Badge variant="secondary" className="mt-1 text-xs">MVP Beta</Badge>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> Nome</label>
              <Input defaultValue={mockUser.nome} className="mt-1 bg-muted/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
              <Input defaultValue={mockUser.email} className="mt-1 bg-muted/30" />
            </div>
          </div>
          <Button variant="outline" size="sm">Salvar alterações</Button>
        </CardContent>
      </Card>

      {/* Health Score */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Score de Saúde Financeira</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${score >= 80 ? "text-emerald-400" : score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
              {score}
            </div>
            <div>
              <Badge variant="outline">{nivel}</Badge>
              <p className="text-xs text-muted-foreground mt-1">Baseado nos últimos 90 dias</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Taxa de poupança</span>
                <span>{poupancaScore}/100 · Peso 40%</span>
              </div>
              <Progress value={poupancaScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Dívida/Renda</span>
                <span>{dividaRendaScore}/100 · Peso 30%</span>
              </div>
              <Progress value={dividaRendaScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Reserva de emergência</span>
                <span>{reservaScore}/100 · Peso 30%</span>
              </div>
              <Progress value={reservaScore} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LGPD */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4" /> Privacidade e dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Seus dados financeiros são tratados com rigor. Você tem direito a portabilidade e exclusão conforme a LGPD.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Exportar meus dados</Button>
            <Button variant="destructive" size="sm" className="gap-1"><Trash2 className="w-3 h-3" /> Excluir minha conta</Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal Quiz */}
      <Dialog open={quizOpen} onOpenChange={(open) => { setQuizOpen(open); if(!open) resetQuiz(); }}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Teste de Perfil</DialogTitle>
            <DialogDescription>Descubra sua tolerância a risco.</DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {step < PERFIL_QUIZ.length ? (
              <div className="space-y-4">
                <Progress value={((step + 1) / PERFIL_QUIZ.length) * 100} className="h-1 mb-6" />
                <h3 className="font-medium text-lg leading-tight mb-4">{PERFIL_QUIZ[step].p}</h3>
                <div className="space-y-2">
                  {PERFIL_QUIZ[step].resp.map((r, i) => (
                    <Button 
                      key={i} variant="outline" 
                      className="w-full justify-start text-left h-auto py-3 font-normal hover:bg-primary/20 hover:border-primary/50" 
                      onClick={() => handleAnswer(r.pts)}
                    >
                      {r.t}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-6 animate-fade-in">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PieChart className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Você é {resultado}!</h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {resultado === "Conservador" && "Foco total na segurança e liquidez (Tesouro Direto, CDBs)."}
                    {resultado === "Moderado" && "Busca algum ganho, equilibrando risco e segurança (Fundos Multi, pequena parte em ações)."}
                    {resultado === "Arrojado" && "Foco em retornos maiores no longo prazo, tolerando volatilidade (Ações, Cripto)."}
                  </p>
                </div>
                <Button onClick={() => setQuizOpen(false)} className="w-full">Concluir</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
