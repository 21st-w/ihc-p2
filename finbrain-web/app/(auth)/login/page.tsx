"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary flex items-center justify-center">
            <Brain className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Entrar no Tio Patinhas</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Seu laboratório financeiro pessoal</p>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => { e.preventDefault(); router.push("/dashboard"); }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <Input type="email" placeholder="demo@finbrain.app" defaultValue="demo@finbrain.app" className="mt-1 bg-muted/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Senha</label>
              <Input type="password" placeholder="••••••••" defaultValue="demo123" className="mt-1 bg-muted/30" />
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Não tem conta? </span>
              <Link href="/signup" className="text-primary hover:underline">Criar conta</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
