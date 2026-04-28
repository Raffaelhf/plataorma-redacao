'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, HelpCircle, Search } from 'lucide-react';
import { PlatformLogo } from '@/components/branding/platform-logo';
import { MENUS, ROLE_LABEL, Sidebar } from '@/components/mockups/escreva-mais/_shared/Sidebar';
import type { Role as AppRole } from '@/components/mockups/escreva-mais/_shared/Sidebar';
import { cn } from '@/lib/utils';
import '@/components/mockups/escreva-mais/_group.css';

type SessionRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

const roleMap: Record<SessionRole, AppRole> = {
  STUDENT: 'aluno',
  TEACHER: 'professor',
  ADMIN: 'admin',
};

const mockupScreenPaths = new Set([
  '/dashboard/admin',
  '/dashboard/aluno',
  '/dashboard/professor',
  '/admin/configuracoes',
  '/admin/usuarios',
  '/ao-vivo',
  '/atividades',
  '/correcoes',
  '/desempenho',
  '/envios',
  '/perfil',
  '/videoaulas',
]);

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ProtectedChrome({
  children,
  role,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  role: SessionRole;
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const appRole = roleMap[role];

  if (mockupScreenPaths.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="em-root flex min-h-screen overflow-x-hidden bg-[var(--em-bg)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,#eef2ff,transparent_60%)] opacity-50 blur-3xl" />
        <div className="absolute -right-40 top-[40%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,#ffe8da,transparent_60%)] opacity-40 blur-3xl" />
      </div>

      <Sidebar role={appRole} userName={userName} userEmail={userEmail} />

      <main className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 border-b border-[var(--em-border)] bg-white/82 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Link href="/" className="block">
                <PlatformLogo className="w-[128px] sm:w-[150px]" sizes="(max-width: 639px) 128px, 150px" variant="light" />
              </Link>
              <div className="mt-0.5 text-[11px] font-semibold text-[var(--em-text-mute)]">Área {ROLE_LABEL[appRole]}</div>
            </div>
          </div>

          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MENUS[appRole].map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-bold transition-all',
                    active ? 'border-transparent text-white shadow-[var(--em-shadow-soft)]' : 'border-[var(--em-border)] bg-white/76 text-[var(--em-text-soft)]',
                  )}
                  style={active ? { background: 'var(--em-grad-hero)' } : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <header className="sticky top-[105px] z-20 flex items-center gap-3 border-b border-[var(--em-border)] bg-white/65 px-4 py-3 backdrop-blur-xl sm:gap-4 sm:px-6 lg:top-0 lg:px-8 lg:py-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--em-text-mute)]" />
            <input
              placeholder="Buscar atividades, envios, alunos..."
              className="w-full rounded-xl border border-transparent bg-[var(--em-bg-alt)] py-2.5 pl-10 pr-3 text-[13px] text-[var(--em-deep)] outline-none transition-all placeholder:text-[var(--em-text-mute)] focus:border-[var(--em-indigo)] focus:bg-white"
            />
          </div>
          <button className="hidden items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-[var(--em-text-soft)] hover:bg-[var(--em-bg-alt)] md:flex">
            <HelpCircle className="h-4 w-4" /> Ajuda
          </button>
          <button className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-transparent bg-[var(--em-bg-alt)] text-[var(--em-deep)] transition-all hover:border-[var(--em-border)] hover:bg-white">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--em-coral)]" />
          </button>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
