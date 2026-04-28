import { notFound } from 'next/navigation';
import { Download, FileText, FileVideo, Paperclip } from 'lucide-react';
import { formatFileSize, getActivityAttachmentKindLabel } from '@/lib/activity-attachments';
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
          createdById: null,
          attachments: [],
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
        include: {
          attachments: {
            select: {
              id: true,
              fileName: true,
              mimeType: true,
              sizeInBytes: true,
              createdAt: true,
            },
          },
          submissions: {
            include: {
              student: { include: { user: true } },
              corrections: true,
            },
            orderBy: { submittedAt: 'desc' },
          },
        },
      });

  if (!activity) return notFound();

  const canManageActivity =
    !isDemo &&
    (isAdmin || (isTeacher && Boolean(session?.user?.teacherId) && activity.createdById === session?.user?.teacherId));

  const existingStudentSubmission =
    isStudent && session?.user?.studentId
      ? activity.submissions.find((submission) => submission.studentId === session.user.studentId) ?? null
      : null;

  const visibleSubmissions = isStudent ? (existingStudentSubmission ? [existingStudentSubmission] : []) : activity.submissions;
  const activityDueDate = 'dueDate' in activity ? activity.dueDate : null;

  return (
    <div className="space-y-6">
      <div className="em-card-hard bg-[var(--em-green)] p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--em-ink)]">Atividade</p>
            <h1 className="em-display mt-2 text-2xl text-[var(--em-ink)] sm:text-3xl">{activity.title}</h1>
            <p className="mt-3 text-sm font-medium leading-7 text-[var(--em-ink)]">{activity.description}</p>
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
            status: activity.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
            dueDate: activityDueDate ? new Date(activityDueDate).toISOString().slice(0, 10) : null,
            attachments: activity.attachments,
          }}
        />
      ) : null}

      <Card className="bg-white">
        <p className="text-sm font-extrabold text-[var(--em-ink)]">Prompt</p>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-[var(--em-text-soft)]">{activity.prompt}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {activity.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[var(--em-border-strong)] bg-[var(--em-cream)] px-3 py-1 font-bold text-[var(--em-ink)]">
              #{tag}
            </span>
          ))}
        </div>
      </Card>

      {activity.attachments.length > 0 ? (
        <Card className="bg-white">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-[var(--em-ink)]" />
            <p className="text-sm font-extrabold text-[var(--em-ink)]">Materiais de apoio</p>
          </div>
          <div className="mt-4 space-y-3">
            {activity.attachments.map((attachment) => {
              const attachmentKind = getActivityAttachmentKindLabel(attachment.fileName, attachment.mimeType);
              const AttachmentIcon = attachmentKind === 'Video' ? FileVideo : FileText;

              return (
                <div key={attachment.id} className="flex flex-col gap-3 rounded-2xl border border-[var(--em-border-strong)] bg-[var(--em-cream)] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--em-ink)]">
                      <AttachmentIcon className="h-4 w-4 shrink-0 text-[var(--em-ink)]" />
                      <span className="truncate">{attachment.fileName}</span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--em-text-soft)]">
                      {attachmentKind} • {formatFileSize(attachment.sizeInBytes)}
                    </p>
                  </div>
                  <a
                    href={`/api/activity-attachments/${attachment.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--em-border-strong)] bg-white px-4 py-2 text-xs font-extrabold text-[var(--em-ink)]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Abrir material
                  </a>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      {isStudent ? <SubmitWork activityId={activity.id} existingSubmission={existingStudentSubmission} /> : null}

      <Card className="bg-white">
        <p className="text-lg font-extrabold text-[var(--em-ink)]">{isStudent ? 'Seu envio' : 'Envios'}</p>
        <div className="mt-3 space-y-3">
          {visibleSubmissions.map((submission) => {
            const pdfHref = getSubmissionPdfHref(submission);

            return (
              <div key={submission.id} className="rounded-2xl border border-[var(--em-border-strong)] bg-[var(--em-cream)] p-4">
                <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-extrabold text-[var(--em-ink)]">{submission.student.user.name}</span>
                  <Badge label={submission.status === 'GRADED' ? 'Corrigido' : 'Pendente'} variant={submission.status === 'GRADED' ? 'success' : 'warning'} />
                </div>
                {pdfHref ? (
                  <a href={pdfHref} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-fit items-center rounded-full border border-[var(--em-border-strong)] bg-white px-3 py-1 text-xs font-extrabold text-[var(--em-ink)]">
                    Abrir PDF{submission.pdfName ? `: ${submission.pdfName}` : ''}
                  </a>
                ) : null}
                <p className="mt-2 line-clamp-3 break-words text-sm leading-7 text-[var(--em-text-soft)]">{submission.content}</p>
                {submission.corrections.length > 0 ? (
                  <div className="mt-3 rounded-2xl border-[1.5px] border-[var(--em-ink)] bg-[var(--em-mint)] p-4 text-sm text-[var(--em-ink)]">
                    <p className="font-extrabold text-[var(--em-ink)]">Feedback</p>
                    <p className="text-sm">{submission.corrections[0].comments}</p>
                    {submission.corrections[0].strengths?.length ? (
                      <div className="mt-3 text-sm">
                        <p className="font-extrabold text-[var(--em-ink)]">Pontos fortes</p>
                        <ul className="mt-1 list-disc pl-4">
                          {submission.corrections[0].strengths.map((item: string) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {submission.corrections[0].improvements?.length ? (
                      <div className="mt-3 text-sm">
                        <p className="font-extrabold text-[var(--em-ink)]">O que melhorar</p>
                        <ul className="mt-1 list-disc pl-4">
                          {submission.corrections[0].improvements.map((item: string) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
          {visibleSubmissions.length === 0 ? <p className="text-sm text-[var(--em-text-soft)]">{isStudent ? 'Você ainda não enviou esta atividade.' : 'Ainda sem envios.'}</p> : null}
        </div>
      </Card>
    </div>
  );
}
