import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BookMarked, ClipboardList, Inbox, Users } from 'lucide-react';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSubmissionPdfHref } from '@/lib/submission-pdf';
import { Badge } from '@/components/ui/badge';
import { TeacherActivityChart } from '@/components/dashboard/teacher-activity-chart';
import { demoActivities, demoSubmissions, isDemoTeacherSession } from '@/lib/demo';

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
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4250d4]">{icon}</div>
      </div>
    </div>
  );
}

export default async function TeacherDashboard() {
  const session = await getAuthSession();
  if (!session?.user?.teacherId) redirect('/login');

  const isDemo = isDemoTeacherSession(session);

  const [activities, submissions, enrolledStudents] = isDemo
    ? [
        demoActivities.map((activity) => ({
          ...activity,
          submissions: new Array(activity.submissionsCount).fill(null),
        })),
        demoSubmissions.map((submission) => ({
          ...submission,
          activity: { title: submission.activityTitle },
          student: { user: { name: submission.studentName } },
        })),
        18,
      ]
    : await Promise.all([
        prisma.activity.findMany({
          where: { createdById: session.user.teacherId },
          orderBy: { createdAt: 'desc' },
          include: { submissions: true },
          take: 5,
        }),
        prisma.submission.findMany({
          where: {
            activity: {
              createdById: session.user.teacherId,
            },
          },
          include: {
            activity: true,
            student: { include: { user: true } },
          },
          orderBy: { submittedAt: 'desc' },
          take: 24,
        }),
        prisma.studentProfile.count(),
      ]);

  const pending = submissions.filter((s) => s.status !== 'GRADED').length;
  const studentsReached = new Set(submissions.map((s) => s.studentId)).size;

  const palette = ['#4250d4', '#ff8d34', '#19a186', '#6f5ef0'];
  const activitySeries = activities.slice(0, 4).map((activity, index) => ({
    key: activity.id,
    label: activity.title,
    color: palette[index % palette.length],
  }));

  const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
  const monthMap = new Map<string, Record<string, number>>();

  submissions.forEach((submission) => {
    const date = new Date(submission.submittedAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthMap.has(monthKey)) monthMap.set(monthKey, {});

    const row = monthMap.get(monthKey)!;
    const matchedSeries = activitySeries.find((series) => series.label === submission.activity.title || series.key === submission.activityId);
    if (!matchedSeries) return;
    row[matchedSeries.key] = (row[matchedSeries.key] ?? 0) + 1;
  });

  const monthlyChartData =
    monthMap.size > 0
      ? Array.from(monthMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([monthKey, counts]) => {
            const [, month] = monthKey.split('-');
            const row: { month: string; [key: string]: string | number } = {
              month: monthFormatter.format(new Date(2026, Number(month) - 1, 1)),
            };
            activitySeries.forEach((series) => {
              row[series.key] = counts[series.key] ?? 0;
            });
            return row;
          })
      : [
          activitySeries.reduce(
            (acc, series) => {
              acc[series.key] = 0;
              return acc;
            },
            { month: 'sem dados' } as { month: string; [key: string]: string | number },
          ),
        ];

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-6 shadow-[0_20px_60px_rgba(74,73,140,0.12)] sm:p-8">
        <p className="text-sm font-semibold text-[#5a69a1]">Professor, {session.user.name?.split(' ')[0] ?? 'Professor'}</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#22347e] sm:text-3xl">Painel de acompanhamento</h1>
        <p className="mt-3 max-w-[56rem] text-sm leading-7 text-[#63719c]">
          Veja quantos alunos estao matriculados, acompanhe a adesao mensal das atividades e corrija as redacoes com feedback claro.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatBox title="Atividades criadas" value={activities.length} icon={<BookMarked className="h-5 w-5" />} />
        <StatBox title="Envios recentes" value={submissions.length} icon={<Inbox className="h-5 w-5" />} />
        <StatBox title="Correcoes pendentes" value={pending} icon={<ClipboardList className="h-5 w-5" />} />
        <StatBox title="Alunos matriculados" value={enrolledStudents} icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <TeacherActivityChart data={monthlyChartData} series={activitySeries} />

        <section className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-[#22347e]">Atividades abertas</h2>
            <Link href="/atividades" className="text-sm font-semibold text-[#4250d4]">
              Gerenciar
            </Link>
          </div>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex flex-col gap-3 rounded-2xl border border-[#e4e8f7] bg-white/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#22347e]">{activity.title}</p>
                  <p className="text-xs text-[#6d79a5]">{activity.submissions.length} envios • {activity.status}</p>
                </div>
                <Badge label={activity.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'} variant={activity.status === 'PUBLISHED' ? 'success' : 'muted'} />
              </div>
            ))}
            {activities.length === 0 && <p className="text-sm text-[#6d79a5]">Crie sua primeira atividade.</p>}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-[#22347e]">Redacoes dos alunos</h2>
            <Link href="/correcoes" className="text-sm font-semibold text-[#4250d4]">
              Corrigir agora
            </Link>
          </div>
          <div className="space-y-3">
            {submissions.slice(0, 6).map((submission) => {
              const pdfHref = getSubmissionPdfHref(submission);

              return (
                <div key={submission.id} className="rounded-2xl border border-[#e4e8f7] bg-white/80 px-4 py-4 text-sm text-[#52618f]">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="font-semibold text-[#22347e]">{submission.student.user.name}</span>
                      <p className="text-xs text-[#6d79a5]">Atividade: {submission.activity.title}</p>
                    </div>
                    <Badge label={submission.status === 'GRADED' ? 'Corrigido' : 'Pendente'} variant={submission.status === 'GRADED' ? 'success' : 'warning'} />
                  </div>
                  {pdfHref ? (
                    <a href={pdfHref} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-fit items-center rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4]">
                      Abrir PDF{submission.pdfName ? `: ${submission.pdfName}` : ''}
                    </a>
                  ) : null}
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#52618f]">{submission.content}</p>
                  {'grade' in submission && submission.grade ? <p className="mt-3 text-xs font-semibold text-[#4250d4]">Ultima nota: {submission.grade}/1000</p> : null}
                </div>
              );
            })}
            {submissions.length === 0 && <p className="text-sm text-[#6d79a5]">Nenhum envio recente.</p>}
          </div>
        </section>

        <section className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#22347e]">Resumo da turma</h2>
            <span className="text-xs font-semibold text-[#6d79a5]">{studentsReached} alunos ativos</span>
          </div>
          <p className="text-sm leading-7 text-[#63719c]">
            O total de matriculados mostra o tamanho atual da base. O grafico mensal ajuda a identificar rapidamente quais temas geram mais adesao
            e quais propostas precisam de reforco, reposicionamento ou novo incentivo em sala.
          </p>
        </section>
      </div>
    </div>
  );
}
