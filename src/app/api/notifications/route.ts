import { NextResponse } from 'next/server';
import { SubmissionStatus } from '@/generated/prisma';
import { getAuthSession } from '@/lib/auth';
import { isAdminRole, isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  href: string;
  kind: 'correction' | 'submission' | 'activity' | 'live';
  createdAt: Date;
};

const pendingCorrectionStatuses = [SubmissionStatus.PENDING, SubmissionStatus.UNDER_REVIEW];

function plural(count: number, singular: string, pluralLabel: string) {
  return count === 1 ? singular : pluralLabel;
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
    .format(date)
    .replace('.', '');
}

async function getStudentNotifications(studentId: string): Promise<NotificationItem[]> {
  const now = new Date();
  const soon = new Date(now);
  soon.setDate(soon.getDate() + 2);

  const [recentCorrections, pendingSubmissions, nextActivities, upcomingLives] = await Promise.all([
    prisma.correction.findMany({
      where: {
        submission: {
          studentId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
      include: {
        submission: {
          include: {
            activity: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    }),
    prisma.submission.findMany({
      where: {
        studentId,
        status: {
          in: pendingCorrectionStatuses,
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
      take: 3,
      include: {
        activity: {
          select: {
            title: true,
          },
        },
      },
    }),
    prisma.activity.findMany({
      where: {
        status: 'PUBLISHED',
        submissions: {
          none: {
            studentId,
          },
        },
      },
      orderBy: [{ dueDate: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 3,
      select: {
        id: true,
        title: true,
        dueDate: true,
        publishedAt: true,
        createdAt: true,
      },
    }),
    prisma.liveClass.findMany({
      where: {
        scheduledAt: {
          gte: now,
          lte: soon,
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
      take: 3,
      select: {
        id: true,
        title: true,
        scheduledAt: true,
      },
    }),
  ]);

  return [
    ...recentCorrections.map((correction) => ({
      id: `correction-${correction.id}`,
      title: 'Correcao disponivel',
      body: `${correction.submission.activity.title}: nota ${correction.score}/1000.`,
      href: '/envios',
      kind: 'correction' as const,
      createdAt: correction.createdAt,
    })),
    ...pendingSubmissions.map((submission) => ({
      id: `submission-${submission.id}`,
      title: 'Redacao em correcao',
      body: `${submission.activity.title} ainda aguarda devolutiva.`,
      href: '/envios',
      kind: 'submission' as const,
      createdAt: submission.submittedAt,
    })),
    ...nextActivities.map((activity) => ({
      id: `activity-${activity.id}`,
      title: 'Atividade pendente',
      body: activity.dueDate ? `${activity.title}: prazo em ${formatDateTime(activity.dueDate)}.` : `${activity.title}: sem prazo definido.`,
      href: `/atividades/${activity.id}`,
      kind: 'activity' as const,
      createdAt: activity.publishedAt ?? activity.createdAt,
    })),
    ...upcomingLives.map((liveClass) => ({
      id: `live-${liveClass.id}`,
      title: 'Aula ao vivo proxima',
      body: `${liveClass.title} em ${formatDateTime(liveClass.scheduledAt)}.`,
      href: '/ao-vivo',
      kind: 'live' as const,
      createdAt: liveClass.scheduledAt,
    })),
  ];
}

async function getStaffNotifications(role: string, teacherId?: string): Promise<NotificationItem[]> {
  const now = new Date();
  const soon = new Date(now);
  soon.setDate(soon.getDate() + 2);
  const canSeeAll = isAdminRole(role);

  const [pendingCount, recentSubmissions, upcomingLives] = await Promise.all([
    prisma.submission.count({
      where: {
        status: {
          in: pendingCorrectionStatuses,
        },
        ...(canSeeAll
          ? {}
          : {
              activity: {
                createdById: teacherId ?? '__teacher_without_profile__',
              },
            }),
      },
    }),
    prisma.submission.findMany({
      where: {
        status: {
          in: pendingCorrectionStatuses,
        },
        ...(canSeeAll
          ? {}
          : {
              activity: {
                createdById: teacherId ?? '__teacher_without_profile__',
              },
            }),
      },
      orderBy: {
        submittedAt: 'desc',
      },
      take: 3,
      include: {
        activity: {
          select: {
            title: true,
          },
        },
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    }),
    prisma.liveClass.findMany({
      where: {
        scheduledAt: {
          gte: now,
          lte: soon,
        },
        ...(canSeeAll
          ? {}
          : {
              createdById: teacherId ?? '__teacher_without_profile__',
            }),
      },
      orderBy: {
        scheduledAt: 'asc',
      },
      take: 3,
      select: {
        id: true,
        title: true,
        scheduledAt: true,
      },
    }),
  ]);

  return [
    ...(pendingCount
      ? [
          {
            id: 'pending-corrections',
            title: 'Correcoes pendentes',
            body: `${pendingCount} ${plural(pendingCount, 'redacao precisa', 'redacoes precisam')} de correcao.`,
            href: '/correcoes',
            kind: 'correction' as const,
            createdAt: now,
          },
        ]
      : []),
    ...recentSubmissions.map((submission) => ({
      id: `submission-${submission.id}`,
      title: 'Novo envio para corrigir',
      body: `${submission.student.user.name ?? submission.student.user.email ?? 'Aluno'} enviou ${submission.activity.title}.`,
      href: '/correcoes',
      kind: 'submission' as const,
      createdAt: submission.submittedAt,
    })),
    ...upcomingLives.map((liveClass) => ({
      id: `live-${liveClass.id}`,
      title: 'Aula ao vivo proxima',
      body: `${liveClass.title} em ${formatDateTime(liveClass.scheduledAt)}.`,
      href: '/ao-vivo',
      kind: 'live' as const,
      createdAt: liveClass.scheduledAt,
    })),
  ];
}

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false) {
    return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 });
  }

  const notifications =
    session.user.role === 'STUDENT' && session.user.studentId
      ? await getStudentNotifications(session.user.studentId)
      : isTeacherRole(session.user.role) || isAdminRole(session.user.role)
        ? await getStaffNotifications(session.user.role, session.user.teacherId)
        : [];

  const items = notifications
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8)
    .map((notification) => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      href: notification.href,
      kind: notification.kind,
      createdAt: notification.createdAt.toISOString(),
      timeLabel: formatDateTime(notification.createdAt),
    }));

  return NextResponse.json({ notifications: items, unread: items.length });
}
