import { redirect } from 'next/navigation';
import { AlunoEnvios } from '@/components/mockups/escreva-mais/AlunoEnvios';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSubmissionPdfHref } from '@/lib/submission-pdf';

export default async function EnviosPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role !== 'STUDENT') redirect('/correcoes');

  const studentId = session.user.studentId;
  if (!studentId) redirect('/dashboard/aluno');

  const [submissions, awaitingSubmissionCount] = await Promise.all([
    prisma.submission.findMany({
      where: { studentId },
      orderBy: { submittedAt: 'desc' },
      include: {
        activity: {
          select: { title: true },
        },
        corrections: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            teacher: {
              include: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
        },
      },
    }),
    prisma.activity.count({
      where: {
        status: 'PUBLISHED',
        submissions: {
          none: { studentId },
        },
      },
    }),
  ]);

  return (
    <AlunoEnvios
      viewer={{
        name: session.user.name ?? 'Aluno Escreva Mais',
        email: session.user.email ?? 'conta@escrevamais.com',
      }}
      awaitingSubmissionCount={awaitingSubmissionCount}
      submissions={submissions.map((submission) => {
        const correction = submission.corrections[0] ?? null;

        return {
          id: submission.id,
          submittedAt: submission.submittedAt.toISOString(),
          title: submission.activity.title,
          status: submission.status,
          grade: submission.grade,
          pdfHref: getSubmissionPdfHref(submission),
          correction: correction
            ? {
                score: correction.score,
                comments: correction.comments,
                strengths: correction.strengths,
                improvements: correction.improvements,
                teacherName: correction.teacher.user.name ?? correction.teacher.user.email ?? null,
                createdAt: correction.createdAt.toISOString(),
              }
            : null,
        };
      })}
    />
  );
}
