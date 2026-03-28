import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CreditCard, MessageCircle, ShieldCheck, UserCog, Users } from 'lucide-react';
import { getAuthSession } from '@/lib/auth';
import { formatWhatsAppNumber } from '@/lib/phone';
import { prisma } from '@/lib/prisma';

function StatBox({
  title,
  value,
  icon,
}: {
  title: string;
  value: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="admin-card h-full min-h-[168px] rounded-[28px] p-5">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <p className="admin-muted max-w-[12ch] text-sm leading-5">{title}</p>
          <div className="admin-icon-surface flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
            {icon}
          </div>
        </div>
        <div className="mt-auto pt-8">
          <p className="admin-stat-label text-[11px] font-semibold uppercase tracking-[0.18em]">Total</p>
          <p className="admin-title mt-2 text-[clamp(2rem,2.1vw+1.1rem,3rem)] font-extrabold leading-none tracking-[-0.06em]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function WhatsAppStatBox({ whatsappNumber }: { whatsappNumber: string | null | undefined }) {
  const formattedNumber = formatWhatsAppNumber(whatsappNumber);
  const [prefix, mainNumber] = formattedNumber.split(') ');
  const hasNumber = Boolean(formattedNumber);

  return (
    <div className="admin-card relative overflow-hidden rounded-[32px] border border-[#dfe4ff] bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(245,247,255,0.98)_52%,rgba(255,243,234,0.96)_100%)] p-6 shadow-[0_18px_44px_rgba(26,36,96,0.08)] dark:border-slate-700/70 dark:bg-[linear-gradient(145deg,rgba(7,14,27,0.98)_0%,rgba(12,20,35,0.98)_52%,rgba(35,24,36,0.96)_100%)] dark:shadow-[0_18px_44px_rgba(0,0,0,0.28)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(88,109,255,0.08),transparent_32%),radial-gradient(circle_at_0%_100%,rgba(255,170,124,0.12),transparent_30%)] dark:bg-[radial-gradient(circle_at_100%_0%,rgba(88,109,255,0.14),transparent_32%),radial-gradient(circle_at_0%_100%,rgba(255,170,124,0.12),transparent_30%)]" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.3fr)] lg:items-end">
        <div className="flex flex-col justify-between gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="admin-muted text-sm font-semibold leading-5">Contato oficial</p>
              <h2 className="admin-title mt-2 text-[clamp(1.35rem,1vw+1.05rem,1.8rem)] font-extrabold tracking-[-0.04em]">
                WhatsApp da plataforma
              </h2>
              <p className="admin-copy mt-3 max-w-[28rem] text-sm leading-7">
                N\u00FAmero usado para atendimento, suporte comercial e orienta\u00E7\u00F5es administrativas.
              </p>
            </div>
            <div className="admin-icon-surface flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
              <MessageCircle className="h-5 w-5" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="admin-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              Canal principal
            </span>
            <span className="admin-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              Atendimento r\u00E1pido
            </span>
          </div>
        </div>

        {hasNumber ? (
          <div className="admin-subtle-panel rounded-[28px] p-5 backdrop-blur-[8px]">
            <p className="admin-stat-label text-[11px] font-semibold uppercase tracking-[0.24em]">N\u00FAmero configurado</p>
            <div className="mt-4 flex flex-col gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                  <span className="admin-icon-surface rounded-2xl px-3 py-2 font-mono text-[clamp(1rem,0.8vw+0.9rem,1.2rem)] font-semibold tracking-[0.08em]">
                    {mainNumber ? `${prefix})` : formattedNumber}
                  </span>
                  {mainNumber ? (
                    <span className="admin-title font-mono text-[clamp(2rem,2vw+1.1rem,2.9rem)] font-extrabold leading-none tracking-[-0.06em]">
                      {mainNumber}
                    </span>
                  ) : null}
                </div>
                <p className="admin-copy mt-3 text-sm leading-6">
                  Exibi\u00E7\u00E3o otimizada para leitura r\u00E1pida no painel administrativo.
                </p>
              </div>

              <Link
                href="/admin/configuracoes"
                className="admin-action-link inline-flex items-center justify-center self-start rounded-2xl px-4 py-3 text-sm font-semibold transition sm:self-center"
              >
                Atualizar n\u00FAmero
              </Link>
            </div>
          </div>
        ) : (
          <div className="admin-subtle-panel rounded-[28px] border-dashed p-5">
            <p className="admin-stat-label text-[11px] font-semibold uppercase tracking-[0.24em]">N\u00FAmero configurado</p>
            <p className="admin-muted mt-3 text-sm leading-7">Nenhum n\u00FAmero configurado no momento.</p>
            <Link
              href="/admin/configuracoes"
              className="admin-action-link mt-4 inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition"
            >
              Configurar WhatsApp
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login');

  const [students, teachers, pendingCorrections, settings, recentUsers] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
    prisma.user.count({ where: { role: 'TEACHER', isActive: true } }),
    prisma.submission.count({ where: { status: { not: 'GRADED' } } }),
    prisma.platformSettings.findUnique({ where: { id: 'platform' } }),
    prisma.user.findMany({
      where: { role: { in: ['STUDENT', 'TEACHER'] } },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),
  ]);

  const shortcuts = [
    { href: '/atividades', label: 'Gerenciar atividades' },
    { href: '/videoaulas', label: 'Gerenciar videoaulas' },
    { href: '/ao-vivo', label: 'Gerenciar ao vivo' },
    { href: '/correcoes', label: 'Abrir corre\u00E7\u00F5es' },
    { href: '/admin/usuarios', label: 'Cancelar cadastros' },
    { href: '/admin/configuracoes', label: 'Dados banc\u00E1rios e WhatsApp' },
  ];

  const financeDetails = [
    { label: 'Titular', value: settings?.bankRecipientName ?? 'N\u00E3o definido' },
    { label: 'Banco', value: settings?.bankName ?? 'N\u00E3o definido' },
    { label: 'Ag\u00EAncia / Conta', value: [settings?.bankAgency, settings?.bankAccount].filter(Boolean).join(' / ') || 'N\u00E3o definido' },
    { label: 'PIX', value: settings?.pixKey ?? 'N\u00E3o definido' },
    { label: 'WhatsApp', value: formatWhatsAppNumber(settings?.whatsappNumber) || 'N\u00E3o definido' },
  ];

  return (
    <div className="admin-shell space-y-6">
      <section className="admin-hero relative overflow-hidden rounded-[32px] p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(18,24,79,0.92)_0%,rgba(41,44,132,0.82)_38%,rgba(89,67,188,0.5)_66%,rgba(226,151,123,0.16)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(255,255,255,0.14),transparent_18%),radial-gradient(circle_at_82%_18%,rgba(255,224,176,0.18),transparent_14%),radial-gradient(circle_at_78%_62%,rgba(255,164,120,0.14),transparent_20%)]" />
        <div className="relative">
          <div className="admin-chip inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white/90">
            Administra\u00E7\u00E3o central
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-white drop-shadow-[0_10px_28px_rgba(17,19,74,0.22)] sm:text-3xl">
            Painel de controle da plataforma
          </h1>
          <p className="mt-4 max-w-[58rem] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,83,0.16),rgba(17,23,83,0.07))] px-5 py-4 text-sm leading-7 text-white/84 shadow-[0_18px_45px_rgba(18,20,77,0.16)] backdrop-blur-[10px]">
            Aqui voc\u00EA concentra as fun\u00E7\u00F5es do professor e adiciona a gest\u00E3o operacional:
            usu\u00E1rios, dados banc\u00E1rios e o WhatsApp oficial da plataforma.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatBox title="Alunos ativos" value={students} icon={<Users className="h-5 w-5" />} />
          <StatBox title="Professores ativos" value={teachers} icon={<UserCog className="h-5 w-5" />} />
          <StatBox title="Corre\u00E7\u00F5es pendentes" value={pendingCorrections} icon={<ShieldCheck className="h-5 w-5" />} />
        </div>
        <WhatsAppStatBox whatsappNumber={settings?.whatsappNumber} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="admin-card-soft rounded-[30px] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="admin-overline text-sm font-semibold">Opera\u00E7\u00E3o</p>
              <h2 className="admin-title mt-1 text-lg font-semibold">Atalhos administrativos</h2>
            </div>
            <div className="admin-icon-surface flex h-11 w-11 items-center justify-center rounded-2xl">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {shortcuts.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="admin-action-link rounded-2xl px-4 py-3 text-sm font-semibold transition dark:border-slate-700/80 dark:bg-[linear-gradient(135deg,rgba(11,19,36,0.96),rgba(18,27,46,0.92))] dark:text-[#c7d4ff] dark:hover:border-slate-500/90 dark:hover:bg-[linear-gradient(135deg,rgba(16,24,42,0.98),rgba(26,36,58,0.94))] dark:hover:text-[#f3f7ff]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </article>

        <article className="admin-card rounded-[30px] p-5">
          <p className="admin-overline text-sm font-semibold">Financeiro</p>
          <h2 className="admin-title mt-1 text-lg font-semibold">Dados atuais de recebimento</h2>
          <div className="mt-4 grid gap-3">
            {financeDetails.map((item) => (
              <div key={item.label} className="admin-subtle-panel rounded-2xl px-4 py-3">
                <p className="admin-muted text-[11px] font-semibold uppercase tracking-[0.18em]">{item.label}</p>
                <p className="admin-title mt-2 break-words text-sm font-semibold leading-6">{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-card-soft rounded-[30px] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="admin-title text-lg font-semibold">Cadastros recentes</h2>
          <Link href="/admin/usuarios" className="text-sm font-semibold text-[#4250d4] dark:text-[#c7d4ff]">
            Abrir gest\u00E3o completa
          </Link>
        </div>
        <div className="grid gap-3">
          {recentUsers.map((user) => (
            <div
              key={user.id}
              className="admin-list-item flex flex-col gap-2 rounded-2xl px-4 py-4 text-sm dark:border-slate-700/80 dark:bg-[linear-gradient(135deg,rgba(11,19,36,0.96),rgba(18,27,46,0.92))] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="admin-title font-semibold">{user.name || user.email}</p>
                <p className="admin-copy">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="admin-badge-role rounded-full px-3 py-1 text-xs font-semibold dark:bg-[linear-gradient(135deg,rgba(28,42,78,0.92),rgba(45,33,57,0.88))] dark:text-[#c7d4ff]">
                  {user.role === 'TEACHER' ? 'Professor' : 'Aluno'}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    user.isActive
                      ? 'admin-badge-active dark:bg-[rgba(18,56,44,0.9)] dark:text-[#8fe0b7]'
                      : 'admin-badge-inactive dark:bg-[rgba(69,31,37,0.9)] dark:text-[#ffb4b4]'
                  }`}
                >
                  {user.isActive ? 'Ativo' : 'Cancelado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
