import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSubmissionPdfHref } from '@/lib/submission-pdf';
import { ManageActivity } from '@/components/activities/manage-activity';
import { SubmitWork } from '@/components/activities/submit-work';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getAuthSession } from '@/lib/auth';
import { getDemoActivityById, getDemoSubmissionsByActivityId, isDemoSession } from '@/lib/demo';
import { isAdminRole, isTeacherRole } from '@/lib/roles';

type PageProps = { params: Promise<{ id: string }> };

export default async function ActivityDetail({ params }: PageProps) {
  const { id } = await params;
  const session = await getAuthSession();
  const isDemo = isDemoSession(session);
  const isStudent = session?.user?.role === 'STUDENT';
  const isAdmin = isAdminRole(session?.user?.role);
  const isTeacher = isTeacherRole(session?.user?.role);
  const activity = isDemo
    ? (() => {
        const demoActivity = getDemoActivityById(id);
        if (!demoActivity) return null;
        return {
          ...demoActivity,
          submissions: getDemoSubmissionsByActivityId(id).map((submission) => ({
            ...submission,
            student: { user: { name: submission.studentName } },
            corrections: submission.correctionComment
              ? [{ comments: submission.correctionComment, strengths: submission.strengths ?? [], improvements: submission.improvements ?? [] }]
              : [],
          })),
        };
      })()
    : await prisma.activity.findFirst({
        where: {
          id,
          ...(isStudent
            ? { status: 'PUBLISHED' }
            : isTeacher && !isAdmin
              ? { createdById: session?.user?.teacherId ?? '__teacher_without_profile__' }
              : {}),
        },
        include: { submissions: { include: { student: { include: { user: true } }, corrections: true } } },
      });

  if (!activity) return notFound();

  const activityOwnerTeacherId = !isDemo && 'createdById' in activity ? activity.createdById : null;
  const canManageActivity =
    !isDemo &&
    (isAdmin || (isTeacher && Boolean(session?.user?.teacherId) && activityOwnerTeacherId === session?.user?.teacherId));

  const existingStudentSubmission =
    isStudent && session?.user?.studentId
      ? activity.submissions.find((submission) => submission.studentId === session.user.studentId) ?? null
      : null;

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-6 shadow-[0_20px_60px_rgba(74,73,140,0.12)] sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#8a6f9f]">Atividade</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#1c2868] sm:text-3xl">{activity.title}</h1>
            <p className="text-sm leading-7 text-[#63719c]">{activity.description}</p>
          </div>
          <Badge label={activity.status} variant={activity.status === 'PUBLISHED' ? 'success' : 'muted'} />
        </div>
      </div>

      {canManageActivity ? (
        <ManageActivity
          activity={{
            id: activity.id,
            title: activity.title,
            description: activity.description,
            prompt: activity.prompt,
            tags: activity.tags,
            status: activity.status,
            dueDate: activity.dueDate ? new Date(activity.dueDate).toISOString().slice(0, 10) : null,
          }}
        />
      ) : null}

      <Card className="border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
        <p className="text-sm font-semibold text-[#22347e]">Prompt</p>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-[#52618f]">{activity.prompt}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {activity.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#f4ecff] px-3 py-1 text-[#735f98]">
              #{tag}
            </span>
          ))}
        </div>
      </Card>

      {isStudent && <SubmitWork activityId={activity.id} existingSubmission={existingStudentSubmission} />}

      <Card className="border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
        <p className="text-lg font-semibold text-[#22347e]">Envios</p>
        <div className="mt-3 space-y-3">
          {activity.submissions.map((submission) => {
            const pdfHref = getSubmissionPdfHref(submission);

            return (
              <div key={submission.id} className="rounded-2xl border border-[#e4e8f7] bg-white/80 p-4">
                <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-semibold text-[#22347e]">{submission.student.user.name}</span>
                  <Badge label={submission.status === 'GRADED' ? 'Corrigido' : 'Pendente'} variant={submission.status === 'GRADED' ? 'success' : 'warning'} />
                </div>
                {pdfHref ? (
                  <a href={pdfHref} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-fit items-center rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4]">
                    Abrir PDF{submission.pdfName ? `: ${submission.pdfName}` : ''}
                  </a>
                ) : null}
                <p className="mt-2 line-clamp-3 break-words text-sm leading-7 text-[#52618f]">{submission.content}</p>
                {submission.corrections.length > 0 && (
                  <div className="mt-3 rounded-2xl border border-[#cfe6d7] bg-[#effaf2] p-4 text-sm text-[#3e6a53]">
                    <p className="font-semibold text-[#23533c]">Feedback</p>
                    <p className="text-sm">{submission.corrections[0].comments}</p>
                    {submission.corrections[0].strengths?.length ? (
                      <div className="mt-3 text-sm">
                        <p className="font-semibold text-[#23533c]">Pontos fortes</p>
                        <ul className="mt-1 list-disc pl-4">
                          {submission.corrections[0].strengths.map((item: string) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {submission.corrections[0].improvements?.length ? (
                      <div className="mt-3 text-sm">
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
              </div>
            );
          })}
          {activity.submissions.length === 0 && <p className="text-sm text-[#6d79a5]">Ainda sem envios.</p>}
        </div>
      </Card>
    </div>
  );
}
