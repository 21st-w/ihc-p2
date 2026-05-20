"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ArrowLeftRight, LineChart,
  MessageCircle, User, Settings, Brain, X, Menu,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transacoes", label: "Transações", icon: ArrowLeftRight },
  { href: "/simulacoes", label: "Simulações", icon: LineChart },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-card border border-border"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border
          flex flex-col transition-transform duration-300
          md:translate-x-0 md:static md:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">Tio Patinhas</span>
          </Link>
          <button onClick={() => setOpen(false)} className="md:hidden p-1 hover:bg-accent rounded">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer with Profile Switcher */}
        <div className="px-4 py-4 border-t border-sidebar-border space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trocar Perfil</span>
          </div>
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => { localStorage.setItem("finbrain_profile", "rico"); window.location.reload(); }}
              className="text-left text-xs px-3 py-2 rounded hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              Rico (Investidor)
            </button>
            <button 
              onClick={() => { localStorage.setItem("finbrain_profile", "endividado"); window.location.reload(); }}
              className="text-left text-xs px-3 py-2 rounded hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              Endividado
            </button>
            <button 
              onClick={() => { localStorage.setItem("finbrain_profile", "minimo"); window.location.reload(); }}
              className="text-left text-xs px-3 py-2 rounded hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              Salário Mínimo
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
