import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSubmissionPdfHref } from '@/lib/submission-pdf';
import { Badge } from '@/components/ui/badge';
import { demoSubmissions, isDemoStudentSession } from '@/lib/demo';

type PageProps = {
  searchParams?: Promise<{ sent?: string }>;
};

export default async function EnviosPage({ searchParams }: PageProps) {
  const session = await getAuthSession();
  if (!session?.user?.studentId) redirect('/login');

  const sent = searchParams ? (await searchParams).sent === '1' : false;

  const submissions = isDemoStudentSession(session)
    ? demoSubmissions
        .slice()
        .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
        .map((submission) => ({
          ...submission,
          activity: { title: submission.activityTitle },
          corrections: submission.correctionComment
            ? [{ comments: submission.correctionComment, strengths: submission.strengths ?? [], improvements: submission.improvements ?? [] }]
            : [],
        }))
    : await prisma.submission.findMany({
        where: { studentId: session.user.studentId },
        include: { activity: true, corrections: true },
        orderBy: { submittedAt: 'desc' },
      });

  return (
    <div className="space-y-4">
      <div className="rounded-[32px] border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-6 shadow-[0_20px_60px_rgba(74,73,140,0.12)] sm:p-8">
        <p className="text-sm font-semibold text-[#8a6f9f]">Historico</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#22347e] sm:text-3xl">Meus envios</h1>
        {sent ? (
          <div className="mt-4 rounded-2xl border border-[#cfe6d7] bg-[#effaf2] px-4 py-3 text-sm font-medium text-[#23533c]">
            PDF enviado com sucesso. Agora ele ja aparece na sua lista e na fila de correcoes do professor.
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => {
          const pdfHref = getSubmissionPdfHref(submission);

          return (
            <section key={submission.id} className="space-y-3 rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#22347e]">{submission.activity.title}</p>
                  <p className="text-xs text-[#6d79a5]">{new Date(submission.submittedAt).toLocaleString('pt-BR')}</p>
                </div>
                <Badge label={submission.status === 'GRADED' ? `Nota ${submission.grade ?? '-'}` : 'Aguardando correcao'} variant={submission.status === 'GRADED' ? 'success' : 'warning'} />
              </div>
              {pdfHref ? (
                <a href={pdfHref} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4]">
                  Ver PDF{submission.pdfName ? `: ${submission.pdfName}` : ''}
                </a>
              ) : null}
              <p className="line-clamp-3 break-words text-sm leading-7 text-[#52618f]">{submission.content}</p>
              {submission.feedback && (
                <div className="rounded-2xl border border-[#cfe6d7] bg-[#effaf2] p-4 text-sm text-[#3e6a53]">
                  <p className="font-semibold text-[#23533c]">Feedback</p>
                  <p className="mt-1">{submission.feedback}</p>
                  {submission.corrections?.[0]?.strengths?.length ? (
                    <div className="mt-3">
                      <p className="font-semibold text-[#23533c]">Pontos fortes</p>
                      <ul className="mt-1 list-disc pl-4">
                        {submission.corrections[0].strengths.map((item: string) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {submission.corrections?.[0]?.improvements?.length ? (
                    <div className="mt-3">
                      <p className="font-semibold text-[#23533c]">O que melhorar</p>
                      <ul className="mt-1 list-disc pl-4">
                        {submission.corrections[0].improvements.map((item: string) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )}
            </section>
          );
        })}
        {submissions.length === 0 && <p className="text-sm text-[#6d79a5]">Nenhum envio realizado ainda.</p>}
      </div>
    </div>
  );
}
