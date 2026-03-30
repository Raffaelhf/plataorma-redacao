import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Award, BarChart3, CalendarClock, Clock3, PenSquare, Radio } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { demoActivities, demoLiveClasses, demoSubmissions, isDemoStudentSession } from '@/lib/demo';

function StatBox({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#6d79a5]">{title}</p>
          <p className="text-2xl font-extrabold tracking-[-0.04em] text-[#22347e]">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fff1eb_0%,#ffe3ef_100%)] text-[#cf5b34]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function formatLiveDate(value: Date | string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default async function StudentDashboard() {
  const session = await getAuthSession();
  if (!session?.user?.studentId) redirect('/login');

  const isDemo = isDemoStudentSession(session);
  const now = new Date();

  const [totals, recentSubmissions, activities, liveClasses] = isDemo
    ? [
        {
          _count: demoSubmissions.length,
          _avg: {
            grade:
              demoSubmissions.filter((item) => item.grade !== null).reduce((acc, item) => acc + (item.grade ?? 0), 0) /
              Math.max(1, demoSubmissions.filter((item) => item.grade !== null).length),
          },
        },
        demoSubmissions
          .slice()
          .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
          .map((submission) => ({
            ...submission,
            activity: { title: submission.activityTitle },
            corrections: submission.correctionComment ? [{ comments: submission.correctionComment }] : [],
          })),
        demoActivities.slice(0, 4),
        demoLiveClasses.slice().sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime()),
      ]
    : await Promise.all([
        prisma.submission.aggregate({
          where: { studentId: session.user.studentId },
          _count: true,
          _avg: { grade: true },
        }),
        prisma.submission.findMany({
          where: { studentId: session.user.studentId },
          include: { activity: true, corrections: true },
          orderBy: { submittedAt: 'desc' },
          take: 5,
        }),
        prisma.activity.findMany({
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
          take: 4,
        }),
        prisma.liveClass.findMany({
          orderBy: { scheduledAt: 'asc' },
          take: 6,
        }),
      ]);

  const avg = Math.round(totals._avg.grade ?? 0);
  const happeningNow =
    liveClasses.find((liveClass) => {
      const start = new Date(liveClass.scheduledAt).getTime();
      const end = start + 2 * 60 * 60 * 1000;
      const current = now.getTime();
      return current >= start && current <= end;
    }) ?? null;
  const nextLiveClass = happeningNow ?? liveClasses.find((liveClass) => new Date(liveClass.scheduledAt).getTime() > now.getTime()) ?? null;

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-6 shadow-[0_20px_60px_rgba(74,73,140,0.12)] sm:p-8">
        <p className="text-sm font-semibold text-[#8a6f9f]">Bem-vindo, {session.user.name?.split(' ')[0] ?? 'Aluno'}</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#22347e] sm:text-3xl">Seu painel de evolução</h1>
        <p className="mt-3 max-w-[56rem] text-sm leading-7 text-[#63719c]">
          Acompanhe seus envios, veja o que já foi corrigido e avance com base no feedback detalhado das suas redações.
        </p>
        <div className="mt-5 inline-flex rounded-full border border-[#ffd9cb] bg-white/80 px-4 py-2 text-sm font-semibold text-[#cf5b34]">
          Para enviar sua redação em PDF, abra uma atividade e use o botão Enviar PDF.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatBox title="Envios" value={totals._count} icon={<PenSquare className="h-5 w-5" />} />
        <StatBox title="Nota média" value={avg ? `${avg}/1000` : '-'} icon={<Award className="h-5 w-5" />} />
        <StatBox title="Em correção" value={recentSubmissions.filter((s) => s.status === 'UNDER_REVIEW').length} icon={<Clock3 className="h-5 w-5" />} />
        <StatBox title="Atividades novas" value={activities.length} icon={<BarChart3 className="h-5 w-5" />} />
      </div>

      <section className="rounded-[28px] border border-[#dde3fb] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(244,242,255,0.94),rgba(255,242,234,0.92))] p-4 shadow-[0_20px_50px_rgba(74,73,140,0.1)] dark:border-slate-700/80 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(23,32,59,0.94),rgba(42,31,56,0.92))] dark:shadow-[0_24px_56px_rgba(0,0,0,0.34)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                happeningNow
                  ? 'bg-[#eef9f4] text-[#1b7f62] dark:bg-emerald-500/18 dark:text-emerald-300'
                  : 'bg-[#eef2ff] text-[#4250d4] dark:bg-indigo-500/18 dark:text-indigo-200'
              }`}
            >
              {happeningNow ? <Radio className="h-5 w-5" /> : <CalendarClock className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#5a69a1] dark:text-[#acb8ff]">{happeningNow ? 'Aula ao vivo agora' : 'Próxima aula ao vivo'}</p>
              {nextLiveClass ? (
                <>
                  <p className="mt-1 text-base font-semibold text-[#22347e] dark:text-slate-100">{nextLiveClass.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#63719c] dark:text-slate-300">{formatLiveDate(nextLiveClass.scheduledAt)}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6d79a5] dark:text-slate-400">{nextLiveClass.description}</p>
                </>
              ) : (
                <p className="mt-1 text-sm leading-6 text-[#6d79a5] dark:text-slate-400">Nenhuma aula ao vivo agendada no momento.</p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            {nextLiveClass?.meetingUrl ? (
              <Link
                href={nextLiveClass.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-[0_14px_26px_rgba(74,73,140,0.12)] ${
                  happeningNow
                    ? 'bg-[#1b7f62] text-white dark:bg-emerald-500 dark:text-slate-950'
                    : 'bg-[#eef2ff] text-[#4250d4] dark:bg-indigo-500/18 dark:text-indigo-100'
                }`}
              >
                {happeningNow ? <Radio className="h-4 w-4" /> : <CalendarClock className="h-4 w-4" />}
                {happeningNow ? 'Entrar agora' : 'Abrir sala'}
              </Link>
            ) : null}
            <Link
              href="/ao-vivo"
              className="inline-flex items-center gap-2 rounded-full border border-[#d9def8] bg-white/80 px-4 py-2 text-sm font-semibold text-[#4250d4] dark:border-slate-600/80 dark:bg-slate-800/88 dark:text-slate-100"
            >
              Ver agenda
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-[#22347e]">Envios recentes</h2>
            <Link href="/envios" className="text-sm font-semibold text-[#4250d4]">
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {recentSubmissions.length === 0 && <p className="text-sm text-[#6d79a5]">Você ainda não enviou atividades.</p>}
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="flex flex-col gap-3 rounded-2xl border border-[#e4e8f7] bg-white/80 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#22347e]">{submission.activity.title}</p>
                  <p className="text-xs text-[#6d79a5]">{new Date(submission.submittedAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <Badge
                  label={
                    submission.status === 'GRADED'
                      ? `Nota ${submission.grade ?? '-'}`
                      : submission.status === 'UNDER_REVIEW'
                        ? 'Em correção'
                        : 'Enviado'
                  }
                  variant={submission.status === 'GRADED' ? 'success' : 'warning'}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-[#22347e]">Atividades em destaque</h2>
            <Link href="/atividades" className="text-sm font-semibold text-[#4250d4]">
              Abrir lista
            </Link>
          </div>
          <div className="space-y-3">
            {activities.map((activity) => (
              <Link
                key={activity.id}
                href={`/atividades/${activity.id}`}
                className="block rounded-2xl border border-[#e4e8f7] bg-white/80 px-4 py-4 transition hover:border-[#cfd6ff] hover:bg-[#fbf9ff]"
              >
                <p className="text-sm font-semibold text-[#22347e]">{activity.title}</p>
                <p className="line-clamp-2 text-xs leading-6 text-[#6d79a5]">{activity.description}</p>
              </Link>
            ))}
            {activities.length === 0 && <p className="text-sm text-[#6d79a5]">Nenhuma atividade publicada ainda.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
