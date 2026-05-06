import { redirect } from 'next/navigation';
import { AdminAtividades, type AdminActivitiesSummary, type AdminActivityItem } from '@/components/mockups/escreva-mais/AdminAtividades';
import { AlunoAtividades, type AlunoActivityItem } from '@/components/mockups/escreva-mais/AlunoAtividades';
import { ProfessorAtividades } from '@/components/mockups/escreva-mais/ProfessorAtividades';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CARD_BACKGROUNDS = [
  'var(--em-mint)',
  'var(--em-lavender)',
  'var(--em-peach)',
  'var(--em-cream)',
  'var(--em-rose)',
  'var(--em-yellow-soft)',
];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function formatDateTimeLabel(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function formatDateLabel(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(date)
    .replace('.', '');
}

function formatDueDateLabel(date: Date | null) {
  if (!date) return 'Sem prazo';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((dueDate.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) return 'Prazo encerrado';
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Amanha';
  return `Em ${diffDays} dias`;
}

function initialsFromName(name?: string | null, email?: string | null) {
  const source = (name || email || '?').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function completionRate(submissions: Array<{ status: string }>) {
  if (!submissions.length) return 0;
  const completed = submissions.filter((submission) => submission.status === 'GRADED' || submission.status === 'RETURNED').length;
  return Math.round((completed / submissions.length) * 100);
}

function monthTrendLabel(current: number, previous: number) {
  const difference = current - previous;
  if (difference === 0) return '0';
  return `${difference > 0 ? '+' : ''}${difference}`;
}

function averageResponseTimeLabel(items: Array<{ createdAt: Date; submission: { submittedAt: Date } }>) {
  if (!items.length) return 'Sem dados';

  const totalMs = items.reduce((sum, correction) => {
    return sum + Math.max(0, correction.createdAt.getTime() - correction.submission.submittedAt.getTime());
  }, 0);
  const averageHours = Math.round(totalMs / items.length / 3600000);

  if (averageHours < 1) return 'menos de 1h';
  if (averageHours < 48) return `${averageHours}h`;
  return `${Math.round(averageHours / 24)} dias`;
}

async function getAdminActivitiesSummary(): Promise<AdminActivitiesSummary> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const previousMonthStart = addMonths(monthStart, -1);

  const [activities, activeStudents, gradedSubmissions, highGradeSubmissions, recentCorrections] = await Promise.all([
    prisma.activity.findMany({
      orderBy: [{ createdAt: 'desc' }],
      include: {
        createdBy: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        submissions: {
          select: {
            status: true,
          },
        },
      },
    }),
    prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
    prisma.submission.count({ where: { grade: { not: null } } }),
    prisma.submission.count({ where: { grade: { gte: 800 } } }),
    prisma.correction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        createdAt: true,
        submission: {
          select: {
            submittedAt: true,
          },
        },
      },
    }),
  ]);

  const activityItems: AdminActivityItem[] = activities.map((activity, index) => {
    const authorName = activity.createdBy?.user.name ?? activity.createdBy?.user.email ?? 'Autor não informado';

    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      authorName,
      authorInitials: initialsFromName(activity.createdBy?.user.name, activity.createdBy?.user.email),
      tags: activity.tags,
      status: activity.status,
      submissionsCount: activity.submissions.length,
      completionRate: completionRate(activity.submissions),
      createdAtLabel: formatDateLabel(activity.createdAt) ?? 'Sem data',
      publishedAtLabel: formatDateLabel(activity.publishedAt),
      bg: CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length],
    };
  });

  const published = activityItems.filter((activity) => activity.status === 'PUBLISHED');
  const drafts = activityItems.filter((activity) => activity.status === 'DRAFT');
  const archived = activityItems.filter((activity) => activity.status === 'ARCHIVED');
  const createdThisMonth = activities.filter((activity) => activity.createdAt >= monthStart).length;
  const createdPreviousMonth = activities.filter((activity) => activity.createdAt >= previousMonthStart && activity.createdAt < monthStart).length;
  const totalSubmissions = activityItems.reduce((sum, activity) => sum + activity.submissionsCount, 0);
  const totalPossibleSubmissions = published.length * activeStudents;
  const averageSubmissionRate = totalPossibleSubmissions ? Math.min(100, Math.round((totalSubmissions / totalPossibleSubmissions) * 100)) : 0;
  const highGradeRate = gradedSubmissions ? Math.round((highGradeSubmissions / gradedSubmissions) * 100) : 0;
  const mostSubmitted = [...activityItems].sort((a, b) => b.submissionsCount - a.submissionsCount)[0] ?? null;
  const highlights = [...published]
    .sort((a, b) => {
      if (b.submissionsCount !== a.submissionsCount) return b.submissionsCount - a.submissionsCount;
      return a.title.localeCompare(b.title, 'pt-BR');
    })
    .slice(0, 4)
    .map((activity, index) => ({
      id: activity.id,
      title: activity.title,
      active: index < 3,
    }));

  return {
    generatedAtLabel: formatDateTimeLabel(now),
    activities: activityItems,
    filters: {
      creators: [...new Set(activityItems.map((activity) => activity.authorName))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
      tags: [...new Set(activityItems.flatMap((activity) => activity.tags))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    },
    stats: {
      published: published.length,
      drafts: drafts.length,
      archived: archived.length,
      createdThisMonth,
      createdMonthTrendLabel: monthTrendLabel(createdThisMonth, createdPreviousMonth),
      mostSubmitted: mostSubmitted
        ? {
            title: mostSubmitted.title,
            submissionsCount: mostSubmitted.submissionsCount,
          }
        : null,
      averageSubmissionRate,
      highGradeRate,
      averageResponseTimeLabel: averageResponseTimeLabel(recentCorrections),
    },
    highlights,
  };
}

async function getStudentActivities(studentId?: string): Promise<AlunoActivityItem[]> {
  const activities = await prisma.activity.findMany({
    where: {
      status: 'PUBLISHED',
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: {
      attachments: {
        select: {
          id: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      submissions: {
        where: {
          studentId: studentId ?? '__student_without_profile__',
        },
        select: {
          status: true,
          grade: true,
          submittedAt: true,
        },
        orderBy: {
          submittedAt: 'desc',
        },
        take: 1,
      },
    },
  });

  return activities.map((activity, index) => {
    const latestSubmission = activity.submissions[0] ?? null;

    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      prompt: activity.prompt,
      tags: activity.tags,
      bg: CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length],
      publishedAtMs: (activity.publishedAt ?? activity.createdAt).getTime(),
      dueDateMs: activity.dueDate?.getTime() ?? null,
      dueDateLabel: formatDueDateLabel(activity.dueDate),
      submission: latestSubmission
        ? {
            status: latestSubmission.status,
            grade: latestSubmission.grade,
            submittedAtLabel: formatDateLabel(latestSubmission.submittedAt) ?? 'Sem data',
          }
        : null,
      attachmentsCount: activity.attachments.length,
      firstAttachmentHref: activity.attachments[0] ? `/api/activity-attachments/${activity.attachments[0].id}` : null,
    };
  });
}

export default async function ActivitiesPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role === 'ADMIN') return <AdminAtividades summary={await getAdminActivitiesSummary()} />;
  if (session.user.role === 'TEACHER') return <ProfessorAtividades />;

  return (
    <AlunoAtividades
      viewer={{
        name: session.user.name ?? 'Aluno Escreva Mais',
        email: session.user.email ?? 'aluno@escrevamais.com',
      }}
      activities={await getStudentActivities(session.user.studentId)}
      generatedAtLabel={formatDateTimeLabel(new Date())}
    />
  );
}
