import { redirect } from 'next/navigation';
import { AdminPerfil } from '@/components/mockups/escreva-mais/AdminPerfil';
import { AlunoPerfil } from '@/components/mockups/escreva-mais/AlunoPerfil';
import { ProfessorPerfil } from '@/components/mockups/escreva-mais/ProfessorPerfil';
import { getAuthSession } from '@/lib/auth';
import { isValidGradeLevel } from '@/lib/grade-levels';
import { prisma } from '@/lib/prisma';
import { getCheckoutSelectionLabel, STUDENT_PLAN_CATALOG } from '@/lib/plans';

const PLAN_MONTHLY_LIMITS = {
  MENSAL: 2,
  TRIMESTRAL: 4,
  SEMESTRAL: 5,
  ANUAL: 6,
} as const;

type RecentProfileActivity = {
  label: string;
  time: string;
};

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split('@')[0] || 'Usuario';
  return source
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getDisplayName(name?: string | null, email?: string | null) {
  return name?.trim() || email?.split('@')[0] || 'Usuario Escreva Mais';
}

function getMemberSinceLabel(createdAt: Date) {
  const now = new Date();
  const months = Math.max(0, (now.getFullYear() - createdAt.getFullYear()) * 12 + now.getMonth() - createdAt.getMonth());

  if (months < 1) return 'Membro desde este mes';
  if (months === 1) return 'Membro ha 1 mes';
  if (months < 12) return `Membro ha ${months} meses`;

  const years = Math.floor(months / 12);
  return years === 1 ? 'Membro ha 1 ano' : `Membro ha ${years} anos`;
}

function getRoleSinceLabel(roleLabel: string, createdAt: Date) {
  const monthYear = new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: 'numeric',
  })
    .format(createdAt)
    .replace('.', '');

  return `${roleLabel} desde ${monthYear}`;
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

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export default async function PerfilPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: true,
      teacherProfile: true,
    },
  });

  if (!user) redirect('/login');

  if (session.user.role === 'ADMIN') {
    const [totalUsers, totalActivities, totalSubmissions, totalCorrections, approvedRegistrations, recentUsers, recentActivities, recentSubmissions] =
      await Promise.all([
        prisma.user.count(),
        prisma.activity.count(),
        prisma.submission.count(),
        prisma.correction.count(),
        prisma.registrationSession.count({ where: { status: 'APPROVED' } }),
        prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          take: 3,
          select: { name: true, email: true, role: true, createdAt: true },
        }),
        prisma.activity.findMany({
          orderBy: { updatedAt: 'desc' },
          take: 3,
          select: { title: true, status: true, updatedAt: true },
        }),
        prisma.submission.findMany({
          orderBy: { submittedAt: 'desc' },
          take: 3,
          select: {
            submittedAt: true,
            student: {
              select: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
        }),
      ]);

    const recentActivity: RecentProfileActivity[] = [
      ...recentUsers.map((item) => ({
        label: `Usuario criado: ${getDisplayName(item.name, item.email)} (${item.role.toLowerCase()})`,
        date: item.createdAt,
      })),
      ...recentActivities.map((item) => ({
        label: `Atividade ${item.status.toLowerCase()}: ${item.title}`,
        date: item.updatedAt,
      })),
      ...recentSubmissions.map((item) => ({
        label: `Novo envio de ${getDisplayName(item.student.user.name, item.student.user.email)}`,
        date: item.submittedAt,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)
      .map((item) => ({ label: item.label, time: getRelativeTimeLabel(item.date) }));

    return (
      <AdminPerfil
        profile={{
          name: getDisplayName(user.name, user.email),
          email: user.email,
          initials: getInitials(user.name, user.email),
          roleSinceLabel: getRoleSinceLabel('Admin', user.createdAt),
          phone: null,
          roleLabel: 'Administrador',
          bio: null,
          actionCountLabel: formatCompactNumber(totalActivities + totalSubmissions + totalCorrections + approvedRegistrations),
          managedUsersLabel: formatCompactNumber(totalUsers),
          recentActivity,
        }}
      />
    );
  }

  if (session.user.role === 'TEACHER') {
    const [activityCount, correctionCount, studentCount] = user.teacherProfile
      ? await Promise.all([
          prisma.activity.count({ where: { createdById: user.teacherProfile.id } }),
          prisma.correction.count({ where: { teacherId: user.teacherProfile.id } }),
          prisma.submission
            .findMany({
              where: {
                corrections: {
                  some: { teacherId: user.teacherProfile.id },
                },
              },
              select: { studentId: true },
              distinct: ['studentId'],
            })
            .then((items) => items.length),
        ])
      : [0, 0, 0];

    return (
      <ProfessorPerfil
        profile={{
          name: getDisplayName(user.name, user.email),
          email: user.email,
          initials: getInitials(user.name, user.email),
          roleSinceLabel: getRoleSinceLabel('Professor', user.createdAt),
          expertise: user.teacherProfile?.expertise ?? null,
          bio: user.teacherProfile?.bio ?? '',
          activityCount,
          correctionCount,
          studentCount,
        }}
      />
    );
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthlySubmissions = user.studentProfile
    ? await prisma.submission.count({
        where: {
          studentId: user.studentProfile.id,
          submittedAt: {
            gte: monthStart,
          },
        },
      })
    : 0;

  const plan = user.studentProfile?.plan ?? null;
  const monthlyLimit = plan ? PLAN_MONTHLY_LIMITS[plan] : 0;
  const gradeLevel = user.studentProfile?.gradeLevel && isValidGradeLevel(user.studentProfile.gradeLevel) ? user.studentProfile.gradeLevel : null;
  const planLabel = getCheckoutSelectionLabel({
    planLabel: plan ? STUDENT_PLAN_CATALOG[plan].label : null,
    readingClub: Boolean(user.studentProfile?.readingClub),
    mentoring: Boolean(user.studentProfile?.mentoring),
  });

  return (
    <AlunoPerfil
      profile={{
        name: getDisplayName(user.name ?? session.user.name, user.email),
        email: user.email,
        initials: getInitials(user.name, user.email),
        planLabel,
        monthlySubmissions,
        monthlyLimit,
        memberSinceLabel: getMemberSinceLabel(user.createdAt),
        gradeLevel,
        bio: user.studentProfile?.bio ?? '',
        enrollmentNumber: user.studentProfile?.enrollmentNumber ?? null,
      }}
    />
  );
}
