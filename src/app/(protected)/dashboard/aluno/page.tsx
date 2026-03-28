import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Award, BarChart3, Clock3, PenSquare } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { demoActivities, demoSubmissions, isDemoStudentSession } from '@/lib/demo';

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

export default async function StudentDashboard() {
  const session = await getAuthSession();
  if (!session?.user?.studentId) redirect('/login');

  const isDemo = isDemoStudentSession(session);

  const [totals, recentSubmissions, activities] = isDemo
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
      ]);

  const avg = Math.round(totals._avg.grade ?? 0);

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
