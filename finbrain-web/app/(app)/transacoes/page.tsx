"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { mockTransactions } from "@/lib/mock";

const CATEGORIES: Record<string, { label: string; color: string }> = {
  salario: { label: "Salário", color: "bg-emerald-500/20 text-emerald-400" },
  freelance: { label: "Freelance", color: "bg-teal-500/20 text-teal-400" },
  moradia: { label: "Moradia", color: "bg-indigo-500/20 text-indigo-400" },
  alimentacao: { label: "Alimentação", color: "bg-amber-500/20 text-amber-400" },
  transporte: { label: "Transporte", color: "bg-sky-500/20 text-sky-400" },
  saude: { label: "Saúde", color: "bg-rose-500/20 text-rose-400" },
  lazer: { label: "Lazer", color: "bg-purple-500/20 text-purple-400" },
  assinatura: { label: "Assinatura", color: "bg-pink-500/20 text-pink-400" },
  outros: { label: "Outros", color: "bg-gray-500/20 text-gray-400" },
};

export default function TransacoesPage() {
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterTipo, setFilterTipo] = useState<string>("all");

  const filtered = mockTransactions.filter((tx) => {
    if (filterCat !== "all" && tx.categoria !== filterCat) return false;
    if (filterTipo !== "all" && tx.tipo !== filterTipo) return false;
    return true;
  });

  const totalCreditos = filtered.filter(t => t.tipo === "credito").reduce((s, t) => s + t.valor, 0);
  const totalDebitos = filtered.filter(t => t.tipo === "debito").reduce((s, t) => s + t.valor, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transações</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} transações encontradas</p>
        </div>
        <Dialog>
          <DialogTrigger render={
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Adicionar</Button>
          } />
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <Input placeholder="Descrição" className="bg-muted/30" />
              <Input type="number" placeholder="Valor (R$)" step="0.01" className="bg-muted/30" />
              <Select>
                <SelectTrigger className="bg-muted/30"><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="credito">Crédito</SelectItem>
                  <SelectItem value="debito">Débito</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="bg-muted/30"><SelectValue placeholder="Categoria" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="date" className="bg-muted/30" />
              <Button type="button" className="w-full">Salvar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={filterCat} onValueChange={(val) => setFilterCat(val || "all")}>
          <SelectTrigger className="w-40 bg-muted/30"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterTipo} onValueChange={(val) => setFilterTipo(val || "all")}>
          <SelectTrigger className="w-40 bg-muted/30"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="credito">Créditos</SelectItem>
            <SelectItem value="debito">Débitos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Data</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Descrição</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Categoria</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Valor</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const cat = CATEGORIES[tx.categoria] || CATEGORIES.outros;
                return (
                  <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-3 text-muted-foreground">
                      {new Date(tx.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      {tx.tipo === "credito"
                        ? <ArrowUpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        : <ArrowDownCircle className="w-4 h-4 text-red-400 shrink-0" />
                      }
                      {tx.descricao}
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary" className={`text-xs ${cat.color}`}>{cat.label}</Badge>
                    </td>
                    <td className={`p-3 text-right font-mono font-medium ${tx.tipo === "credito" ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.tipo === "credito" ? "+" : "-"} R$ {tx.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between px-4 py-3 text-sm border-t border-border bg-muted/20">
          <span>Créditos: <span className="text-emerald-400 font-semibold">R$ {totalCreditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span></span>
          <span>Débitos: <span className="text-red-400 font-semibold">R$ {totalDebitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span></span>
          <span>Saldo: <span className="font-semibold">R$ {(totalCreditos - totalDebitos).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span></span>
        </div>
      </Card>
    </div>
  );
}
