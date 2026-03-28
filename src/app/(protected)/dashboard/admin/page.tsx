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
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="admin-card h-full min-h-[168px] rounded-[28px] p-5">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <p className="max-w-[12ch] text-sm leading-5 text-[#6d79a5]">{title}</p>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#eef2ff_0%,#fff0e8_100%)] text-[#4250d4]">
            {icon}
          </div>
        </div>
        <div className="mt-auto pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b95bf]">Total</p>
          <p className="mt-2 text-[clamp(2rem,2.1vw+1.1rem,3rem)] font-extrabold leading-none tracking-[-0.06em] text-[#22347e]">
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
    <div className="admin-card relative overflow-hidden rounded-[32px] border border-[#dfe4ff] bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(245,247,255,0.98)_52%,rgba(255,243,234,0.96)_100%)] p-6 shadow-[0_18px_44px_rgba(26,36,96,0.08)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(88,109,255,0.08),transparent_32%),radial-gradient(circle_at_0%_100%,rgba(255,170,124,0.12),transparent_30%)]" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.3fr)] lg:items-end">
        <div className="flex flex-col justify-between gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold leading-5 text-[#6d79a5]">Contato oficial</p>
              <h2 className="mt-2 text-[clamp(1.35rem,1vw+1.05rem,1.8rem)] font-extrabold tracking-[-0.04em] text-[#22347e]">
                WhatsApp da plataforma
              </h2>
              <p className="mt-3 max-w-[28rem] text-sm leading-7 text-[#61709e]">
                Número usado para atendimento, suporte comercial e orientações administrativas.
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#eef2ff_0%,#fff0e8_100%)] text-[#4250d4]">
              <MessageCircle className="h-5 w-5" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#d9def8] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b77aa]">
              Canal principal
            </span>
            <span className="rounded-full border border-[#d9def8] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b77aa]">
              Atendimento rápido
            </span>
          </div>
        </div>

        {hasNumber ? (
          <div className="rounded-[28px] border border-white/70 bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-[8px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7d87b6]">Número configurado</p>
            <div className="mt-4 flex flex-col gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                  <span className="rounded-2xl bg-[linear-gradient(135deg,#eef2ff_0%,#f6f0ff_100%)] px-3 py-2 font-mono text-[clamp(1rem,0.8vw+0.9rem,1.2rem)] font-semibold tracking-[0.08em] text-[#5160d7]">
                    {mainNumber ? `${prefix})` : formattedNumber}
                  </span>
                  {mainNumber ? (
                    <span className="font-mono text-[clamp(2rem,2vw+1.1rem,2.9rem)] font-extrabold leading-none tracking-[-0.06em] text-[#22347e]">
                      {mainNumber}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-[#61709e]">
                  Exibição otimizada para leitura rápida no painel administrativo.
                </p>
              </div>

              <Link
                href="/admin/configuracoes"
                className="inline-flex items-center justify-center self-start rounded-2xl border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f7f2ff_100%)] px-4 py-3 text-sm font-semibold text-[#3141bf] transition hover:border-[#cfd6ff] hover:text-[#22347e] sm:self-center"
              >
                Atualizar número
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#d7defd] bg-white/76 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7d87b6]">Número configurado</p>
            <p className="mt-3 text-sm leading-7 text-[#6d79a5]">Nenhum número configurado no momento.</p>
            <Link
              href="/admin/configuracoes"
              className="mt-4 inline-flex items-center justify-center rounded-2xl border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f7f2ff_100%)] px-4 py-3 text-sm font-semibold text-[#3141bf] transition hover:border-[#cfd6ff] hover:text-[#22347e]"
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

  return (
    <div className="admin-shell space-y-6">
      <section className="admin-hero relative overflow-hidden rounded-[32px] p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(18,24,79,0.92)_0%,rgba(41,44,132,0.82)_38%,rgba(89,67,188,0.5)_66%,rgba(226,151,123,0.16)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(255,255,255,0.14),transparent_18%),radial-gradient(circle_at_82%_18%,rgba(255,224,176,0.18),transparent_14%),radial-gradient(circle_at_78%_62%,rgba(255,164,120,0.14),transparent_20%)]" />
        <div className="relative">
          <div className="admin-chip inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white/90">
            Administração central
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-white drop-shadow-[0_10px_28px_rgba(17,19,74,0.22)] sm:text-3xl">
            Painel de controle da plataforma
          </h1>
          <p className="mt-4 max-w-[58rem] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,83,0.16),rgba(17,23,83,0.07))] px-5 py-4 text-sm leading-7 text-white/84 shadow-[0_18px_45px_rgba(18,20,77,0.16)] backdrop-blur-[10px]">
            Aqui você concentra as funções do professor e adiciona a gestão operacional: usuários, dados bancários e o WhatsApp oficial da plataforma.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatBox title="Alunos ativos" value={students} icon={<Users className="h-5 w-5" />} />
          <StatBox title="Professores ativos" value={teachers} icon={<UserCog className="h-5 w-5" />} />
          <StatBox title="Correções pendentes" value={pendingCorrections} icon={<ShieldCheck className="h-5 w-5" />} />
        </div>
        <WhatsAppStatBox whatsappNumber={settings?.whatsappNumber} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="admin-card-soft rounded-[30px] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#5a69a1]">Operação</p>
              <h2 className="mt-1 text-lg font-semibold text-[#22347e]">Atalhos administrativos</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#eef2ff_0%,#fff0e8_100%)] text-[#4250d4]">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: '/atividades', label: 'Gerenciar atividades' },
              { href: '/videoaulas', label: 'Gerenciar videoaulas' },
              { href: '/ao-vivo', label: 'Gerenciar ao vivo' },
              { href: '/correcoes', label: 'Abrir correções' },
              { href: '/admin/usuarios', label: 'Cancelar cadastros' },
              { href: '/admin/configuracoes', label: 'Dados bancários e WhatsApp' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl border border-[#dde3fb] bg-[linear-gradient(135deg,#ffffff_0%,#f8f5ff_100%)] px-4 py-3 text-sm font-semibold text-[#3141bf] transition hover:border-[#cfd6ff] hover:bg-[linear-gradient(135deg,#fbfcff_0%,#fff3ea_100%)] hover:text-[#22347e]">
                {item.label}
              </Link>
            ))}
          </div>
        </article>

        <article className="admin-card rounded-[30px] p-5">
          <p className="text-sm font-semibold text-[#5a69a1]">Financeiro</p>
          <h2 className="mt-1 text-lg font-semibold text-[#22347e]">Dados atuais de recebimento</h2>
          <div className="mt-4 space-y-2 text-sm text-[#52618f]">
            <p><span className="font-semibold text-[#22347e]">Titular:</span> {settings?.bankRecipientName ?? 'Não definido'}</p>
            <p><span className="font-semibold text-[#22347e]">Banco:</span> {settings?.bankName ?? 'Não definido'}</p>
            <p><span className="font-semibold text-[#22347e]">Agência / Conta:</span> {[settings?.bankAgency, settings?.bankAccount].filter(Boolean).join(' / ') || 'Não definido'}</p>
            <p><span className="font-semibold text-[#22347e]">PIX:</span> {settings?.pixKey ?? 'Não definido'}</p>
            <p><span className="font-semibold text-[#22347e]">WhatsApp:</span> {formatWhatsAppNumber(settings?.whatsappNumber) || 'Não definido'}</p>
          </div>
        </article>
      </section>

      <section className="admin-card-soft rounded-[30px] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#22347e]">Cadastros recentes</h2>
          <Link href="/admin/usuarios" className="text-sm font-semibold text-[#4250d4]">
            Abrir gestão completa
          </Link>
        </div>
        <div className="grid gap-3">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex flex-col gap-2 rounded-2xl border border-[#dde3fb] bg-[linear-gradient(135deg,#ffffff_0%,#f8f7ff_100%)] px-4 py-4 text-sm text-[#52618f] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-[#22347e]">{user.name || user.email}</p>
                <p>{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[linear-gradient(135deg,#eef2ff_0%,#fff0e8_100%)] px-3 py-1 text-xs font-semibold text-[#4250d4]">{user.role === 'TEACHER' ? 'Professor' : 'Aluno'}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isActive ? 'bg-[#edf8f2] text-[#1b7f62]' : 'bg-[#fff1f1] text-[#b14545]'}`}>
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
