import { redirect } from 'next/navigation';
import { AdminCorrecoes, type AdminCorrectionDistributionItem, type AdminCorrectionQueueItem, type AdminCorrectionTimelineItem } from '@/components/mockups/escreva-mais/AdminCorrecoes';
import { ProfessorCorrecoes } from '@/components/mockups/escreva-mais/ProfessorCorrecoes';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function getDisplayName(name?: string | null, email?: string | null) {
  return name?.trim() || email?.split('@')[0] || 'Usuario Escreva Mais';
}

function getRelativeTimeLabel(date: Date) {
  const diffInMs = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.floor(diffInMs / 60000));

  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `Ha ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Ha ${hours}h`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Ontem';
  if (days < 7) return `Ha ${days} dias`;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
    .format(date)
    .replace('.', '');
}

function getWaitHours(date: Date) {
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 3600000));
}

function getWaitLabel(hours: number) {
  if (hours < 1) return '<1h';
  if (hours < 72) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function getUrgency(hours: number): AdminCorrectionQueueItem['urgencia'] {
  if (hours >= 48) return 'vermelho';
  if (hours >= 18) return 'ambar';
  return 'verde';
}

function getSubmissionStatusLabel(status: string) {
  if (status === 'UNDER_REVIEW') return 'Em correcao';
  if (status === 'RETURNED') return 'Devolvida';
  if (status === 'GRADED') return 'Corrigida';
  return 'Pendente';
}

const distributionColors = ['var(--em-lavender)', 'var(--em-peach)', 'var(--em-mint)', 'var(--em-yellow)', 'var(--em-rose)'];

type TimelineEvent = AdminCorrectionTimelineItem & { date: Date };

function isTimelineEvent(value: TimelineEvent | null): value is TimelineEvent {
  return value !== null;
}

export default async function CorrecoesPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role === 'ADMIN') {
    const [currentUser, submissions, recentCorrections, recentSubmissions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true },
      }),
      prisma.submission.findMany({
        where: {
          status: {
            in: ['PENDING', 'UNDER_REVIEW'],
          },
        },
        orderBy: [{ submittedAt: 'asc' }],
        include: {
          student: {
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
          activity: {
            include: {
              createdBy: {
                include: {
                  user: {
                    select: { name: true, email: true },
                  },
                },
              },
            },
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
      prisma.correction.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          teacher: {
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
          submission: {
            include: {
              student: {
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
      prisma.submission.findMany({
        orderBy: { submittedAt: 'desc' },
        take: 5,
        include: {
          student: {
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
          },
          activity: {
            select: { title: true },
          },
        },
      }),
    ]);

    const queue: AdminCorrectionQueueItem[] = submissions.map((submission) => {
      const waitHours = getWaitHours(submission.submittedAt);
      const latestCorrectionTeacher = submission.corrections[0]?.teacher.user;
      const activityTeacher = submission.activity.createdBy?.user;
      const teacher = latestCorrectionTeacher ?? activityTeacher;

      return {
        id: submission.id,
        aluno: getDisplayName(submission.student.user.name, submission.student.user.email),
        tema: submission.activity.title,
        prof: teacher ? getDisplayName(teacher.name, teacher.email) : null,
        tempo: getWaitLabel(waitHours),
        waitHours,
        urgencia: getUrgency(waitHours),
        status: getSubmissionStatusLabel(submission.status),
        atividade: submission.activity.tags[0] ?? 'Sem categoria',
      };
    });

    const pending = queue.length;
    const overdue = queue.filter((item) => item.waitHours >= 48).length;
    const averageWaitHours = pending ? Math.round(queue.reduce((sum, item) => sum + item.waitHours, 0) / pending) : 0;

    const distributionMap = new Map<string, number>();
    for (const item of queue) {
      const name = item.prof ?? 'Sem professor';
      distributionMap.set(name, (distributionMap.get(name) ?? 0) + 1);
    }
    const maxDistribution = Math.max(1, ...Array.from(distributionMap.values()));
    const distribution: AdminCorrectionDistributionItem[] = Array.from(distributionMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([prof, atual], index) => ({
        prof,
        atual,
        percent: Math.round((atual / maxDistribution) * 100),
        color: prof === 'Sem professor' ? 'var(--em-rose)' : distributionColors[index % distributionColors.length],
      }));

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCorrections = await prisma.correction.findMany({
      where: { createdAt: { gte: todayStart } },
      select: { teacherId: true },
    });
    const activeTeacherNames = new Set(queue.map((item) => item.prof).filter(Boolean));
    const activeTeacherIds = new Set(todayCorrections.map((item) => item.teacherId));
    const activeTeachers = Math.max(activeTeacherNames.size, activeTeacherIds.size);

    const timelineEvents: Array<TimelineEvent | null> = [
      overdue > 0
        ? {
            text: `Alerta: ${overdue} envio${overdue === 1 ? '' : 's'} passaram de 48h.`,
            time: 'Agora',
            type: 'alert' as const,
            date: new Date(),
          }
        : null,
      ...recentCorrections.map((correction) => ({
        text: `${getDisplayName(correction.teacher.user.name, correction.teacher.user.email)} concluiu correcao de ${getDisplayName(
          correction.submission.student.user.name,
          correction.submission.student.user.email,
        )}.`,
        time: getRelativeTimeLabel(correction.createdAt),
        type: 'prof' as const,
        date: correction.createdAt,
      })),
      ...recentSubmissions.map((submission) => ({
        text: `${getDisplayName(submission.student.user.name, submission.student.user.email)} enviou ${submission.activity.title}.`,
        time: getRelativeTimeLabel(submission.submittedAt),
        type: 'system' as const,
        date: submission.submittedAt,
      })),
    ];
    const timeline: AdminCorrectionTimelineItem[] = timelineEvents
      .filter(isTimelineEvent)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)
      .map(({ text, time, type }) => ({ text, time, type }));

    return (
      <AdminCorrecoes
        viewer={{
          name: getDisplayName(currentUser?.name, currentUser?.email ?? session.user.email),
          email: currentUser?.email ?? session.user.email ?? '',
        }}
        stats={{
          pending,
          overdue,
          averageWaitHours,
          activeTeachers,
        }}
        queue={queue}
        distribution={distribution}
        timeline={timeline}
      />
    );
  }

  if (session.user.role === 'TEACHER') return <ProfessorCorrecoes />;

  redirect('/dashboard/aluno');
}
