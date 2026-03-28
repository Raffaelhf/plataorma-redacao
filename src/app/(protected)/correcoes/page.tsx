import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSubmissionPdfHref } from '@/lib/submission-pdf';
import { Badge } from '@/components/ui/badge';
import { CorrectionCard } from '@/components/corrections/correction-card';
import { CorrectionsRefreshBar } from '@/components/corrections/corrections-refresh-bar';
import { demoSubmissions, isDemoTeacherSession } from '@/lib/demo';
import { isAdminRole } from '@/lib/roles';

export default async function CorrecoesPage() {
  const session = await getAuthSession();
  if (!session?.user?.teacherId) redirect('/login');
  const isAdmin = isAdminRole(session.user.role);

  const submissions = isDemoTeacherSession(session)
    ? demoSubmissions
        .filter((submission) => submission.status !== 'GRADED')
        .map((submission) => ({
          ...submission,
          activity: { title: submission.activityTitle },
          student: { user: { name: submission.studentName } },
        }))
    : await prisma.submission.findMany({
        where: {
          status: { not: 'GRADED' },
          ...(isAdmin
            ? {}
            : {
                activity: {
                  createdById: session.user.teacherId,
                },
              }),
        },
        include: {
          activity: true,
          student: { include: { user: true } },
        },
        orderBy: { submittedAt: 'desc' },
      });

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-6 shadow-[0_20px_60px_rgba(74,73,140,0.12)] sm:p-8">
        <p className="text-sm font-semibold text-[#5a69a1]">{isAdmin ? 'Fila administrativa de correcoes' : 'Correcao de redacoes'}</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#22347e] sm:text-3xl">Pendentes de avaliacao</h1>
        <p className="mt-3 max-w-[56rem] text-sm leading-7 text-[#63719c]">
          Cada envio novo do aluno entra aqui automaticamente. Abra o PDF, leia a observacao do aluno e registre a correcao.
        </p>
        <div className="mt-4 inline-flex rounded-full border border-[#d9def8] bg-white/80 px-4 py-2 text-sm font-semibold text-[#4250d4]">
          {submissions.length} {submissions.length === 1 ? 'redacao pendente' : 'redacoes pendentes'}
        </div>
      </div>

      <CorrectionsRefreshBar />

      <div className="space-y-4">
        {submissions.map((submission) => {
          const pdfHref = getSubmissionPdfHref(submission);

          return (
            <section
              key={submission.id}
              className="space-y-4 rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#22347e]">{submission.student.user.name}</p>
                  <p className="text-xs text-[#6d79a5]">Atividade: {submission.activity.title}</p>
                  <p className="text-xs text-[#6d79a5]">Enviado em {new Date(submission.submittedAt).toLocaleString('pt-BR')}</p>
                </div>
                <Badge label="Pendente" variant="warning" />
              </div>
              {pdfHref ? (
                <a href={pdfHref} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4]">
                  Abrir PDF{submission.pdfName ? `: ${submission.pdfName}` : ''}
                </a>
              ) : (
                <span className="inline-flex w-fit items-center rounded-full bg-[#fff3e8] px-3 py-1 text-xs font-semibold text-[#cf5b34]">
                  Envio sem PDF anexado
                </span>
              )}
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#51608f]">{submission.content}</p>
              <CorrectionCard submissionId={submission.id} />
            </section>
          );
        })}
        {submissions.length === 0 && <p className="text-sm text-[#6d79a5]">Nenhuma correcao pendente.</p>}
      </div>
    </div>
  );
}
