"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, HelpCircle, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PlatformLogo } from "@/components/branding/platform-logo";
import { isActivePath, MENUS, ROLE_LABEL, Sidebar } from "./Sidebar";
import type { Role } from "./Sidebar";
import "../_group.css";

export function AppLayout({
  role,
  userName,
  userEmail,
  pageTitle,
  pageKicker,
  primaryAction,
  children,
}: {
  role: Role;
  userName: string;
  userEmail: string;
  pageTitle: string;
  pageKicker?: string;
  primaryAction?: { label: string; icon?: ReactNode; href?: string; onClick?: () => void };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const mobileItems = MENUS[role];
  const [query, setQuery] = useState("");
  const [openPanel, setOpenPanel] = useState<"help" | "notifications" | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return [
      ...mobileItems,
      { label: "Planos", href: "/#planos", icon: Plus },
      { label: "Suporte", href: "https://wa.me/5500000000000", icon: HelpCircle },
    ]
      .filter((item) => item.label.toLowerCase().includes(normalizedQuery) || item.href.toLowerCase().includes(normalizedQuery))
      .slice(0, 5);
  }, [mobileItems, query]);

  function showActionFeedback(label: string) {
    setActionFeedback(`${label}: ação registrada nesta tela.`);
    window.setTimeout(() => setActionFeedback(null), 3200);
  }

  function renderPrimaryAction(className: string, iconClassName: string, labelClassName?: string) {
    if (!primaryAction) return null;

    const icon = primaryAction.icon ?? <Plus className={iconClassName} />;
    const label = labelClassName ? <span className={labelClassName}>{primaryAction.label}</span> : primaryAction.label;

    if (primaryAction.onClick) {
      return (
        <button type="button" onClick={primaryAction.onClick} className={className} style={{ background: "var(--em-grad-hero)" }}>
          {icon}
          {label}
        </button>
      );
    }

    if (primaryAction.href) {
      return (
        <a href={primaryAction.href} className={className} style={{ background: "var(--em-grad-hero)" }}>
          {icon}
          {label}
        </a>
      );
    }

    return (
      <button type="button" onClick={() => showActionFeedback(primaryAction.label)} className={className} style={{ background: "var(--em-grad-hero)" }}>
        {icon}
        {label}
      </button>
    );
  }

  return (
    <div className="em-root flex min-h-screen overflow-x-hidden" style={{ background: "var(--em-bg)" }}>
      {/* ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(circle, #EEF2FF, transparent 60%)" }} />
        <div className="absolute top-[40%] -right-40 w-[480px] h-[480px] rounded-full blur-3xl opacity-40" style={{ background: "radial-gradient(circle, #FFE8DA, transparent 60%)" }} />
      </div>

      <Sidebar role={role} userName={userName} userEmail={userEmail} />

      <main className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 border-b border-[var(--em-border)] bg-white/82 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Link href="/" className="block">
                <PlatformLogo className="w-[128px] sm:w-[150px]" sizes="(max-width: 639px) 128px, 150px" variant="light" />
              </Link>
              <div className="mt-0.5 text-[11px] font-semibold text-[var(--em-text-mute)]">Área {ROLE_LABEL[role]}</div>
            </div>
            {renderPrimaryAction(
              "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-bold text-white shadow-[var(--em-shadow-soft)]",
              "h-4 w-4",
              "max-w-[6.8rem] truncate sm:max-w-[9rem]",
            )}
          </div>

          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mobileItems.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={
                    "inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-bold " +
                    (active
                      ? "border-transparent text-white shadow-[var(--em-shadow-soft)]"
                      : "border-[var(--em-border)] bg-white/76 text-[var(--em-text-soft)]")
                  }
                  style={active ? { background: "var(--em-grad-hero)" } : {}}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Topbar */}
        <header className="sticky top-[105px] z-20 flex items-center gap-3 border-b border-[var(--em-border)] bg-white/65 px-4 py-3 backdrop-blur-xl sm:gap-4 sm:px-6 lg:top-0 lg:px-8 lg:py-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar atividades, envios, alunos…"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--em-bg-alt)] border border-transparent focus:bg-white focus:border-[var(--em-indigo)] text-[13px] text-[var(--em-deep)] placeholder:text-[var(--em-text-mute)] outline-none transition-all"
            />
            {query.trim() ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-[var(--em-ink)] bg-white shadow-[4px_4px_0_0_#0E0F12]">
                {searchResults.length ? (
                  searchResults.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={`${item.href}-${item.label}`}
                        href={item.href}
                        className="flex items-center gap-3 border-b border-[var(--em-border)] px-4 py-3 text-[13px] font-bold text-[var(--em-ink)] last:border-b-0 hover:bg-[var(--em-bg-alt)]"
                        onClick={() => setQuery("")}
                      >
                        <Icon className="h-4 w-4 text-[var(--em-indigo)]" />
                        <span className="flex-1">{item.label}</span>
                        <span className="text-[11px] font-semibold text-[var(--em-text-mute)]">{item.href}</span>
                      </a>
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-[13px] font-semibold text-[var(--em-text-soft)]">Nenhum atalho encontrado.</div>
                )}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setOpenPanel((current) => (current === "help" ? null : "help"))}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium text-[var(--em-text-soft)] hover:bg-[var(--em-bg-alt)]"
          >
            <HelpCircle className="w-4 h-4" /> Ajuda
          </button>
          <button
            type="button"
            onClick={() => setOpenPanel((current) => (current === "notifications" ? null : "notifications"))}
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-transparent bg-[var(--em-bg-alt)] text-[var(--em-deep)] transition-all hover:border-[var(--em-border)] hover:bg-white"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--em-coral)]" />
          </button>
          {renderPrimaryAction(
            "hidden md:inline-flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-xl text-white text-[13px] font-semibold shadow-[var(--em-shadow-soft)] hover:translate-y-[-1px] transition-all",
            "w-4 h-4",
          )}
        </header>

        {openPanel ? (
          <div className="fixed right-4 top-[126px] z-50 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-[var(--em-ink)] bg-white p-4 shadow-[6px_6px_0_0_#0E0F12] lg:top-[76px]">
            {openPanel === "help" ? (
              <div className="space-y-3">
                <div className="text-[14px] font-extrabold text-[var(--em-ink)]">Ajuda rápida</div>
                <a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer" className="block rounded-xl border border-[var(--em-border-strong)] px-3 py-2 text-[13px] font-bold text-[var(--em-ink)] hover:bg-[var(--em-bg-alt)]">
                  Falar com suporte no WhatsApp
                </a>
                <Link href="/termos-de-servico" className="block rounded-xl border border-[var(--em-border-strong)] px-3 py-2 text-[13px] font-bold text-[var(--em-ink)] hover:bg-[var(--em-bg-alt)]">
                  Ver termos e políticas
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-[14px] font-extrabold text-[var(--em-ink)]">Notificações</div>
                {["Nova correção disponível.", "Aula ao vivo começa em breve.", "Seu painel foi atualizado."].map((item) => (
                  <div key={item} className="rounded-xl border border-[var(--em-border-strong)] px-3 py-2 text-[13px] font-bold text-[var(--em-ink)]">
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Page header */}
        <div className="px-4 pb-2 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          {actionFeedback ? (
            <div className="mb-4 rounded-xl border border-[var(--em-ink)] bg-[var(--em-mint)] px-4 py-3 text-[13px] font-extrabold text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
              {actionFeedback}
            </div>
          ) : null}
          {pageKicker && (
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--em-indigo)] mb-3">
              <span className="w-6 h-px bg-[var(--em-indigo)]" />
              {pageKicker}
            </div>
          )}
          <h1 className="em-display text-[28px] leading-tight text-[var(--em-deep)] sm:text-[34px]">{pageTitle}</h1>
        </div>

        <div className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-12">{children}</div>
      </main>
    </div>
  );
}
