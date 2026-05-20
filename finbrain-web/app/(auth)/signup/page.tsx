"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Brain, Check, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary flex items-center justify-center">
            <Brain className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Criar conta</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Passo {step} de 3</p>
          </div>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 w-12 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Nome completo</label>
                <Input placeholder="Seu nome" className="mt-1 bg-muted/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <Input type="email" placeholder="seu@email.com" className="mt-1 bg-muted/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Senha</label>
                <Input type="password" placeholder="Mínimo 6 caracteres" className="mt-1 bg-muted/30" />
              </div>
              <Button type="submit" className="w-full">Continuar</Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Já tem conta? </span>
                <Link href="/login" className="text-primary hover:underline">Entrar</Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Alert className="bg-muted/30 border-primary/20">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <AlertDescription className="text-sm">
                  <strong className="block mb-2">Termos de Uso — Pontos em destaque:</strong>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Este produto é uma <strong className="text-foreground">ferramenta educacional</strong>.</li>
                    <li><strong className="text-foreground">Não é recomendação de investimento</strong> em nenhuma circunstância.</li>
                    <li>Simulações usam premissas simplificadas e dados públicos.</li>
                    <li>Seus dados financeiros são tratados com rigor (LGPD).</li>
                    <li>Você pode exportar ou excluir seus dados a qualquer momento.</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={e => setAccepted(e.target.checked)}
                  className="mt-1 accent-primary"
                />
                <span className="text-sm text-muted-foreground">
                  Li e aceito os <span className="text-primary">Termos de Uso</span> e a{" "}
                  <span className="text-primary">Política de Privacidade</span>. Entendo que este produto não oferece recomendações de investimento.
                </span>
              </label>
              <Button onClick={() => setStep(3)} disabled={!accepted} className="w-full">
                Aceitar e continuar
              </Button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={(e) => { e.preventDefault(); router.push("/dashboard"); }} className="space-y-4">
              <p className="text-sm text-muted-foreground">Cadastre sua renda para começar (opcional):</p>
              <div>
                <label className="text-xs text-muted-foreground">Renda mensal líquida (R$)</label>
                <Input type="number" placeholder="8000" className="mt-1 bg-muted/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Maior gasto fixo (ex: aluguel)</label>
                <Input type="number" placeholder="2500" className="mt-1 bg-muted/30" />
              </div>
              <p className="text-xs text-muted-foreground">Você pode adicionar mais depois.</p>
              <Button type="submit" className="w-full gap-2">
                <Check className="w-4 h-4" /> Começar a usar o Tio Patinhas
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
