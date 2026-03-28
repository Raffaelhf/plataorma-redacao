import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PerformanceChart } from '@/components/performance/performance-chart';
import { Card } from '@/components/ui/card';
import { demoSubmissions, isDemoStudentSession } from '@/lib/demo';

export default async function DesempenhoPage() {
  const session = await getAuthSession();
  if (!session?.user?.studentId) redirect('/login');

  const submissions = isDemoStudentSession(session)
    ? demoSubmissions.filter((submission) => submission.grade !== null).sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime())
    : await prisma.submission.findMany({
        where: { studentId: session.user.studentId, grade: { not: null } },
        orderBy: { submittedAt: 'asc' },
      });

  const data = submissions.map((s, idx) => ({
    label: `Envio ${idx + 1}`,
    score: s.grade ?? 0,
  }));

  const avg = submissions.length ? Math.round(submissions.reduce((a, s) => a + (s.grade ?? 0), 0) / submissions.length) : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-[32px] border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-6 shadow-[0_20px_60px_rgba(74,73,140,0.12)] sm:p-8">
        <p className="text-sm font-semibold text-[#8a6f9f]">Indicadores</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#22347e] sm:text-3xl">Desempenho</h1>
      </div>
      <PerformanceChart data={data} light />
      <Card className="border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
        <p className="text-sm font-semibold text-[#22347e]">Media geral</p>
        <p className="text-2xl font-extrabold text-[#5d50d8]">{avg ? `${avg}/1000` : 'Sem notas ainda'}</p>
      </Card>
    </div>
  );
}
