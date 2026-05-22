"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ArrowLeftRight, LineChart,
  MessageCircle, User, Brain, X, Menu, Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { mockUser } from "@/lib/mock";


const NAV_ITEMS = [
  { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/transacoes",  label: "Transações",  icon: ArrowLeftRight },
  { href: "/simulacoes",  label: "Simulações",  icon: LineChart },
  { href: "/chat",        label: "Chat",        icon: MessageCircle },
  { href: "/perfil",      label: "Perfil",      icon: User },
];

const PROFILES = [
  { id: "rico",       dot: "bg-emerald-400", label: "Rico (Investidor)" },
  { id: "endividado", dot: "bg-red-400",     label: "Endividado" },
  { id: "minimo",     dot: "bg-yellow-400",  label: "Salário Mínimo" },
] as const;

function switchProfile(profile: string) {
  localStorage.setItem("finbrain_profile", profile);
  window.location.reload();
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState("rico");
  const [isHydrated, setIsHydrated] = useState(false);

  // Sincronizar com localStorage após hidratação
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveProfile(localStorage.getItem("finbrain_profile") || "rico");
    setIsHydrated(true);
  }, []);

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
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
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

        {/* Profile Switcher */}
        <div className="px-4 py-4 border-t border-sidebar-border space-y-2">
          <span className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Trocar Perfil Demo
          </span>
          <div className="flex flex-col gap-0.5">
            {PROFILES.map(({ id, dot, label }) => {
                const isActive = activeProfile === id;
              return (
                <button
                  key={id}
                  suppressHydrationWarning
                  onClick={() => switchProfile(id)}
                  aria-pressed={isActive}
                  className={`text-left text-xs px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-primary/10 hover:text-primary text-sidebar-foreground"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  <span className="flex-1">{label}</span>
                    {isHydrated && isActive && <Check className="w-3 h-3 shrink-0" />}
                </button>
              );
              })}
          </div>
        </div>

        {/* Footer (User Info) */}
        <div className="px-4 py-4 border-t border-sidebar-border bg-sidebar-accent/30">
          <div className="flex items-center gap-3 px-2">
            <div suppressHydrationWarning className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
              {mockUser?.nome?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p suppressHydrationWarning className="text-sm font-medium text-foreground truncate">{mockUser?.nome || "Usuário"}</p>
              <p suppressHydrationWarning className="text-xs text-muted-foreground truncate">{mockUser?.email || "email@finbrain.app"}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
