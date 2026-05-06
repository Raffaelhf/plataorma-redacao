"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  ListChecks,
  PlayCircle,
  Radio,
  UserRound,
  Users,
  Settings,
  ClipboardCheck,
  GraduationCap,
  PenSquare,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PlatformLogo } from "@/components/branding/platform-logo";
import { cn } from "@/lib/utils";

export type Role = "aluno" | "professor" | "admin";

export type Item = { label: string; icon: LucideIcon; active?: boolean; badge?: string; href: string };

export const MENUS: Record<Role, Item[]> = {
  aluno: [
    { label: "Dashboard", icon: LayoutDashboard, active: true, href: "/dashboard/aluno" },
    { label: "Envios", icon: FileText, href: "/envios" },
    { label: "Desempenho", icon: TrendingUp, href: "/desempenho" },
    { label: "Atividades", icon: ListChecks, href: "/atividades" },
    { label: "Videoaulas", icon: PlayCircle, href: "/videoaulas" },
    { label: "Ao vivo", icon: Radio, badge: "·", href: "/ao-vivo" },
    { label: "Perfil", icon: UserRound, href: "/perfil" },
  ],
  professor: [
    { label: "Dashboard", icon: LayoutDashboard, active: true, href: "/dashboard/professor" },
    { label: "Correções", icon: ClipboardCheck, href: "/correcoes" },
    { label: "Atividades", icon: ListChecks, href: "/atividades" },
    { label: "Alunos", icon: Users, href: "/alunos" },
    { label: "Videoaulas", icon: PlayCircle, href: "/videoaulas" },
    { label: "Ao vivo", icon: Radio, href: "/ao-vivo" },
    { label: "Perfil", icon: UserRound, href: "/perfil" },
  ],
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, active: true, href: "/dashboard/admin" },
    { label: "Correções", icon: ClipboardCheck, href: "/correcoes" },
    { label: "Usuários", icon: Users, href: "/admin/usuarios" },
    { label: "Atividades", icon: ListChecks, href: "/atividades" },
    { label: "Videoaulas", icon: PlayCircle, href: "/videoaulas" },
    { label: "Ao vivo", icon: Radio, href: "/ao-vivo" },
    { label: "Configurações", icon: Settings, href: "/admin/configuracoes" },
    { label: "Perfil", icon: UserRound, href: "/perfil" },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  aluno: "Aluno",
  professor: "Professor",
  admin: "Administrador",
};

const ROLE_ICON: Record<Role, LucideIcon> = {
  aluno: GraduationCap,
  professor: PenSquare,
  admin: Settings,
};

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function useMenuItems(role: Role, enabled = true) {
  const [pendingCorrections, setPendingCorrections] = useState<number | null>(null);
  const [studentActivities, setStudentActivities] = useState<number | null>(null);
  const [studentSubmissions, setStudentSubmissions] = useState<number | null>(null);
  const hasCorrectionsQueue = enabled && (role === "professor" || role === "admin");
  const hasStudentCounters = enabled && role === "aluno";

  useEffect(() => {
    if (!hasCorrectionsQueue) {
      return;
    }

    let cancelled = false;

    async function loadPendingCorrections() {
      try {
        const response = await fetch("/api/corrections", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as { pending?: unknown };
        if (!cancelled && typeof data.pending === "number") {
          setPendingCorrections(data.pending);
        }
      } catch {
        if (!cancelled) setPendingCorrections(null);
      }
    }

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void loadPendingCorrections();
    };

    void loadPendingCorrections();
    window.addEventListener("focus", loadPendingCorrections);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", loadPendingCorrections);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [hasCorrectionsQueue]);

  useEffect(() => {
    if (!hasStudentCounters) {
      return;
    }

    let cancelled = false;

    async function loadStudentCounters() {
      try {
        const [activitiesResponse, submissionsResponse] = await Promise.all([
          fetch("/api/activities?summary=1", { cache: "no-store" }),
          fetch("/api/submissions?summary=1", { cache: "no-store" }),
        ]);

        if (activitiesResponse.ok) {
          const data = (await activitiesResponse.json()) as { available?: unknown };
          if (!cancelled && typeof data.available === "number") setStudentActivities(data.available);
        }

        if (submissionsResponse.ok) {
          const data = (await submissionsResponse.json()) as { total?: unknown };
          if (!cancelled && typeof data.total === "number") setStudentSubmissions(data.total);
        }
      } catch {
        if (!cancelled) {
          setStudentActivities(null);
          setStudentSubmissions(null);
        }
      }
    }

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void loadStudentCounters();
    };

    void loadStudentCounters();
    window.addEventListener("focus", loadStudentCounters);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", loadStudentCounters);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [hasStudentCounters]);

  return useMemo(
    () =>
      MENUS[role].map((item) => {
        if (hasCorrectionsQueue && item.href === "/correcoes") {
          return {
            ...item,
            badge: pendingCorrections === null ? undefined : String(pendingCorrections),
          };
        }

        if (hasStudentCounters && item.href === "/atividades") {
          return {
            ...item,
            badge: studentActivities === null ? undefined : String(studentActivities),
          };
        }

        if (hasStudentCounters && item.href === "/envios") {
          return {
            ...item,
            badge: studentSubmissions === null ? undefined : String(studentSubmissions),
          };
        }

        return item;
      }),
    [hasCorrectionsQueue, hasStudentCounters, pendingCorrections, role, studentActivities, studentSubmissions],
  );
}

export function Sidebar({ role, userName, userEmail }: { role: Role; userName: string; userEmail: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const items = useMenuItems(role);
  const RoleIcon = ROLE_ICON[role];
  const displayName = session?.user?.name?.trim() || userName || "Usuário Escreva Mais";
  const displayEmail = session?.user?.email?.trim() || userEmail || "conta@escrevamais.com";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="hidden lg:flex w-[256px] shrink-0 h-screen sticky top-0 flex-col border-r border-[var(--em-border)] bg-white/70 backdrop-blur-xl">
      <div className="px-6 pt-7 pb-5">
        <Link href="/" className="flex items-center">
          <PlatformLogo className="w-[170px]" sizes="170px" variant="light" />
        </Link>
        <div className="mt-2 text-[11px] text-[var(--em-text-mute)] leading-none">Plataforma de redação</div>
        <div className="hidden items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl grid place-items-center text-white shadow-[var(--em-shadow-soft)]" style={{ background: "var(--em-grad-hero)" }}>
            <PenSquare className="w-4.5 h-4.5" strokeWidth={2.4} />
          </div>
          <div>
            <div className="text-[15px] font-extrabold tracking-tight leading-none text-[var(--em-deep)]">Escreva Mais</div>
            <div className="text-[11px] text-[var(--em-text-mute)] mt-1 leading-none">Plataforma de redação</div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--em-bg-alt)] border border-[var(--em-border)]">
          <div className="w-7 h-7 rounded-lg bg-white grid place-items-center text-[var(--em-indigo)]">
            <RoleIcon className="w-3.5 h-3.5" />
          </div>
          <div className="text-[12px] font-semibold text-[var(--em-deep)] leading-none">Área {ROLE_LABEL[role]}</div>
        </div>
      </div>

      <nav className="px-3 flex-1 overflow-y-auto">
        <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold tracking-[0.16em] text-[var(--em-text-mute)] uppercase">Menu</div>
        <ul className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            const active = isActivePath(pathname, it.href);
            return (
              <li key={it.label}>
                <a
                  href={it.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all",
                    active ? "text-white shadow-[var(--em-shadow-soft)]" : "text-[var(--em-text-soft)] hover:bg-[var(--em-bg-alt)] hover:text-[var(--em-deep)]",
                  )}
                  style={active ? { background: "var(--em-grad-hero)" } : undefined}
                >
                  <Icon className={cn("h-4 w-4", active ? "text-white" : "text-[var(--em-text-mute)] group-hover:text-[var(--em-indigo)]")} strokeWidth={2.2} />
                  <span className="flex-1">{it.label}</span>
                  {it.badge && (
                    <span
                      className={
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center " +
                        (active ? "bg-white/25 text-white" : "bg-[var(--em-coral)] text-white")
                      }
                    >
                      {it.badge}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="px-3 pt-6 pb-1.5 text-[10px] font-bold tracking-[0.16em] text-[var(--em-text-mute)] uppercase">Atalhos</div>
        <a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer" className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] text-[var(--em-text-soft)] hover:bg-[var(--em-bg-alt)]">
          <span>Suporte</span>
          <span className="text-[10px] text-[var(--em-text-mute)]">WhatsApp</span>
        </a>
      </nav>

      <div className="m-3 mt-2 p-3 rounded-2xl border border-[var(--em-border)] bg-white/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full grid place-items-center text-white text-[12px] font-bold shadow" style={{ background: "var(--em-grad-deep)" }}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-semibold text-[var(--em-deep)] truncate leading-tight">{displayName}</div>
            <div className="text-[10.5px] text-[var(--em-text-mute)] truncate">{displayEmail}</div>
          </div>
          <Link href="/sair?callbackUrl=/login" prefetch={false} className="w-7 h-7 rounded-lg grid place-items-center text-[var(--em-text-mute)] hover:bg-[var(--em-bg-alt)] hover:text-[var(--em-deep)]" aria-label="Sair">
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
