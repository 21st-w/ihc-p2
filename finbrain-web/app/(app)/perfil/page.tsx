"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Trash2 } from "lucide-react";
import { mockUser, mockDiagnostico } from "@/lib/mock";

export default function PerfilPage() {
  const { score, nivel } = mockDiagnostico.score;
  const breakdown = mockDiagnostico.score;

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold">Perfil</h1>

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
              <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Taxa de poupança</span><span>Peso: 40%</span></div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Dívida/Renda</span><span>Peso: 30%</span></div>
              <Progress value={70} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Reserva de emergência</span><span>Peso: 30%</span></div>
              <Progress value={0} className="h-2" />
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
    </div>
  );
}
