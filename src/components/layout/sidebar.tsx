'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, Send, PenSquare, BarChart3, User2, CheckSquare, Video, Radio, ShieldCheck, Users, Settings2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { isAdminRole } from '@/lib/roles';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

const baseLinks = [
  { href: '/atividades', label: 'Atividades', icon: PenSquare },
  { href: '/videoaulas', label: 'Videoaulas', icon: Video },
  { href: '/ao-vivo', label: 'Ao vivo', icon: Radio },
  { href: '/perfil', label: 'Perfil', icon: User2 },
];

const studentLinks = [
  { href: '/dashboard/aluno', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/envios', label: 'Envios', icon: Send },
  { href: '/desempenho', label: 'Desempenho', icon: BarChart3 },
];

const teacherLinks = [
  { href: '/dashboard/professor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/correcoes', label: 'Correções', icon: CheckSquare },
];

const adminLinks = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: ShieldCheck },
  { href: '/correcoes', label: 'Correções', icon: CheckSquare },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings2 },
];

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const isAdmin = isAdminRole(role);
  const isTeacher = role === 'TEACHER';
  const isStudent = role === 'STUDENT';

  const links = [...(role === 'STUDENT' ? studentLinks : isAdmin ? adminLinks : teacherLinks), ...baseLinks];

  return (
    <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-48px)]">
      <div
        className={cn(
          'rounded-3xl p-3 backdrop-blur transition-colors sm:p-4 lg:h-full',
          isAdmin
            ? 'border border-[#d9def8] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,243,255,0.92))] shadow-[0_24px_60px_rgba(74,73,140,0.12)] dark:border-slate-700/70 dark:bg-[linear-gradient(180deg,rgba(8,14,28,0.96),rgba(14,21,38,0.92))] dark:shadow-[0_24px_60px_rgba(0,0,0,0.28)]'
            : isTeacher
              ? 'border border-[#d9def8] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,246,255,0.92))] shadow-[0_24px_60px_rgba(74,73,140,0.12)] dark:border-slate-700/70 dark:bg-[linear-gradient(180deg,rgba(8,14,28,0.96),rgba(14,21,38,0.92))] dark:shadow-[0_24px_60px_rgba(0,0,0,0.28)]'
              : isStudent
                ? 'border border-[#d9def8] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,241,255,0.92))] shadow-[0_24px_60px_rgba(74,73,140,0.12)] dark:border-slate-700/70 dark:bg-[linear-gradient(180deg,rgba(8,14,28,0.96),rgba(14,21,38,0.92))] dark:shadow-[0_24px_60px_rgba(0,0,0,0.28)]'
                : 'border border-slate-800/60 bg-slate-900/50 shadow-2xl shadow-black/30',
        )}
      >
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl">
            <Image src="/landing/favicon.svg" alt="Ícone da Escreva Mais" width={40} height={40} unoptimized className="h-10 w-10 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className={cn('text-sm dark:text-slate-400', isAdmin ? 'text-[#6d79a5]' : isTeacher ? 'text-[#6d79a5]' : isStudent ? 'text-[#8a6f9f]' : 'text-slate-400')}>Plataforma</span>
            <span className={cn('text-base font-semibold dark:text-slate-100', isAdmin ? 'text-[#22347e]' : isTeacher ? 'text-[#22347e]' : isStudent ? 'text-[#22347e]' : 'text-white')}>Escreva Mais</span>
          </div>
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:mt-6 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
          {links.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors lg:w-full',
                  active
                    ? isAdmin
                      ? 'border border-[#cfd6ff] bg-[linear-gradient(135deg,#edf1ff_0%,#fff3ea_100%)] text-[#3141bf] dark:border-slate-600 dark:bg-[linear-gradient(135deg,rgba(30,41,59,0.94)_0%,rgba(51,65,85,0.9)_100%)] dark:text-slate-100'
                      : isTeacher
                        ? 'border border-[#cfd6ff] bg-[#edf1ff] text-[#3141bf] dark:border-slate-600 dark:bg-slate-800/84 dark:text-slate-100'
                        : isStudent
                          ? 'border border-[#ffd9cb] bg-[linear-gradient(135deg,#fff1eb_0%,#ffe3ef_100%)] text-[#cf5b34] dark:border-slate-600 dark:bg-[linear-gradient(135deg,rgba(62,35,32,0.94)_0%,rgba(79,36,56,0.92)_100%)] dark:text-[#ffd2b8]'
                          : 'border border-indigo-500/40 bg-indigo-500/20 text-indigo-100'
                    : isAdmin
                      ? 'text-[#51608f] hover:bg-[#f6f1ff] hover:text-[#22347e] dark:text-slate-300 dark:hover:bg-slate-800/84 dark:hover:text-white'
                      : isTeacher
                        ? 'text-[#51608f] hover:bg-[#f2f5ff] hover:text-[#22347e] dark:text-slate-300 dark:hover:bg-slate-800/84 dark:hover:text-white'
                        : isStudent
                          ? 'text-[#6e628e] hover:bg-[#f7efff] hover:text-[#22347e] dark:text-slate-300 dark:hover:bg-slate-800/84 dark:hover:text-white'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(
            'mt-4 rounded-2xl p-3 text-sm lg:mt-6',
            isAdmin
              ? 'border border-[#dde3fb] bg-white/80 text-[#51608f] dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-300'
              : isTeacher
                ? 'border border-[#dde3fb] bg-white/80 text-[#51608f] dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-300'
                : isStudent
                  ? 'border border-[#eadcf8] bg-white/80 text-[#6e628e] dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-300'
                  : 'border border-slate-800/70 bg-slate-900/70 text-slate-300',
          )}
        >
          <p className={cn('font-semibold dark:text-slate-100', isAdmin ? 'text-[#22347e]' : isTeacher ? 'text-[#22347e]' : isStudent ? 'text-[#22347e]' : 'text-white')}>Dica rápida</p>
          <p className={cn('mt-1 text-xs dark:text-slate-400', isAdmin ? 'text-[#6d79a5]' : isTeacher ? 'text-[#6d79a5]' : isStudent ? 'text-[#8a6f9f]' : 'text-slate-400')}>
            {isAdmin
              ? 'Monitore usuários ativos, dados financeiros e canais oficiais antes de abrir novas turmas.'
              : 'Use os feedbacks para planejar a próxima redação. A evolução contínua vale mais do que uma nota isolada.'}
          </p>
        </div>

        <div className="mt-4 lg:mt-6">
          <Button
            onClick={() => signOut({ callbackUrl: '/login' })}
            variant="ghost"
            className={cn(
              'group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(73,84,177,0.16)] active:translate-y-[1px] active:scale-[0.985] active:shadow-[0_10px_18px_rgba(73,84,177,0.12)] focus-visible:outline-[#4a59c6]',
              isAdmin &&
                'border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#eef2ff_100%)] text-[#3141bf] hover:border-[#bcc8ff] hover:text-[#22347e] dark:border-slate-600 dark:bg-[linear-gradient(135deg,#16213c_0%,#1f2a49_100%)] dark:text-slate-100 dark:hover:border-slate-500 dark:hover:text-white',
              isTeacher &&
                'border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#edf2ff_100%)] text-[#3141bf] hover:border-[#bcc8ff] hover:text-[#22347e] dark:border-slate-600 dark:bg-[linear-gradient(135deg,#16213c_0%,#1f2a49_100%)] dark:text-slate-100 dark:hover:border-slate-500 dark:hover:text-white',
              isStudent &&
                'border-[#ffd9cb] bg-[linear-gradient(135deg,#ff7f32_0%,#ff5d6c_100%)] text-white hover:border-[#ffc4b3] hover:brightness-[1.04] hover:shadow-[0_20px_34px_rgba(255,95,108,0.28)] active:shadow-[0_10px_18px_rgba(255,95,108,0.2)]',
            )}
          >
            <span
              className={cn(
                'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-active:opacity-100',
                isAdmin && 'bg-[radial-gradient(circle_at_top_left,rgba(91,108,235,0.16),transparent_48%)]',
                isTeacher && 'bg-[radial-gradient(circle_at_top_left,rgba(91,108,235,0.16),transparent_48%)]',
                isStudent && 'bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_48%)]',
              )}
            />
            <LogOut className="relative h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 group-active:scale-95" />
            <span className="relative">Sair</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
