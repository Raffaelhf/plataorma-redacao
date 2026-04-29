import { redirect } from 'next/navigation';
import { DashboardAdmin, type DashboardAdminSummary } from '@/components/mockups/escreva-mais/DashboardAdmin';
import { getAuthSession } from '@/lib/auth';
import { getPlatformWhatsAppContact } from '@/lib/platform-contact';
import { getStudentPlanCatalogFromSettings } from '@/lib/plans';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PLAN_LABELS = {
  MENSAL: 'Mensal',
  TRIMESTRAL: 'Trimestral',
  SEMESTRAL: 'Semestral',
  ANUAL: 'Anual',
} as const;

const PLAN_COLORS = {
  SEMESTRAL: 'var(--em-mint)',
  TRIMESTRAL: 'var(--em-peach)',
  MENSAL: 'var(--em-lavender)',
  ANUAL: 'var(--em-yellow)',
} as const;

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date).replace('.', '');
}

function formatDateTimeLabel(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function initialsFromName(name?: string | null, email?: string | null) {
  const source = (name || email || '?').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function percentChange(current: number, previous: number) {
  if (previous <= 0 && current > 0) return { label: 'novo', up: true };
  if (previous <= 0) return { label: '0%', up: null };

  const value = Math.round(((current - previous) / previous) * 100);
  return {
    label: `${value > 0 ? '+' : ''}${value}%`,
    up: value >= 0,
  };
}

function relativeTimeLabel(date: Date, now: Date) {
  const diffInMinutes = Math.max(0, Math.round((now.getTime() - date.getTime()) / 60000));
  if (diffInMinutes < 1) return 'agora';
  if (diffInMinutes < 60) return `ha ${diffInMinutes} min`;

  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) return `ha ${diffInHours}h`;

  const diffInDays = Math.round(diffInHours / 24);
  if (diffInDays === 1) return 'ontem';
  if (diffInDays < 30) return `ha ${diffInDays} dias`;

  return formatDateTimeLabel(date);
}

function formatAverageCorrectionTime(items: Array<{ createdAt: Date; submission: { submittedAt: Date } }>) {
  if (!items.length) return 'Sem dados';

  const totalMs = items.reduce((sum, correction) => {
    return sum + Math.max(0, correction.createdAt.getTime() - correction.submission.submittedAt.getTime());
  }, 0);
  const averageHours = Math.round(totalMs / items.length / 3600000);

  if (averageHours < 1) return 'menos de 1h';
  if (averageHours < 48) return `${averageHours}h`;
  return `${Math.round(averageHours / 24)} dias`;
}

export default async function AdminDashboardPage() {
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login');

  const now = new Date();
  const monthStart = startOfMonth(now);
  const previousMonthStart = addMonths(monthStart, -1);
  const nextMonthStart = addMonths(monthStart, 1);
  const firstChartMonth = addMonths(monthStart, -5);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    settings,
    activeStudents,
    activeStudentsBeforeMonth,
    activeTeachers,
    activeTeachersBeforeMonth,
    pendingCorrections,
    previousPendingCorrections,
    approvedRegistrations,
    activeStudentProfiles,
    recentUsers,
    publishedActivities,
    submissionsLast7Days,
    recentCorrections,
    recentSubmissions,
    recentApprovedRegistrations,
    whatsappContact,
  ] = await Promise.all([
    prisma.platformSettings.findUnique({ where: { id: 'platform' } }),
    prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
    prisma.user.count({ where: { role: 'STUDENT', isActive: true, createdAt: { lt: monthStart } } }),
    prisma.user.count({ where: { role: 'TEACHER', isActive: true } }),
    prisma.user.count({ where: { role: 'TEACHER', isActive: true, createdAt: { lt: monthStart } } }),
    prisma.submission.count({ where: { status: { in: ['PENDING', 'UNDER_REVIEW'] } } }),
    prisma.submission.count({
      where: {
        status: { in: ['PENDING', 'UNDER_REVIEW'] },
        submittedAt: { lt: monthStart },
      },
    }),
    prisma.registrationSession.findMany({
      where: {
        status: 'APPROVED',
        OR: [
          { completedAt: { gte: firstChartMonth, lt: nextMonthStart } },
          { completedAt: null, updatedAt: { gte: firstChartMonth, lt: nextMonthStart } },
        ],
      },
      select: { amountInCents: true, completedAt: true, updatedAt: true },
    }),
    prisma.studentProfile.findMany({
      where: { user: { isActive: true } },
      select: { plan: true, readingClub: true, mentoring: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        studentProfile: { select: { plan: true } },
        teacherProfile: { select: { expertise: true } },
      },
    }),
    prisma.activity.count({ where: { status: 'PUBLISHED' } }),
    prisma.submission.count({ where: { submittedAt: { gte: sevenDaysAgo } } }),
    prisma.correction.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        createdAt: true,
        submission: { select: { submittedAt: true, student: { select: { user: { select: { name: true } } } } } },
      },
    }),
    prisma.submission.findMany({
      orderBy: { submittedAt: 'desc' },
      take: 4,
      select: {
        id: true,
        submittedAt: true,
        status: true,
        student: { select: { user: { select: { name: true } } } },
      },
    }),
    prisma.registrationSession.findMany({
      where: { status: 'APPROVED' },
      orderBy: [{ completedAt: 'desc' }, { updatedAt: 'desc' }],
      take: 4,
      select: { id: true, name: true, plan: true, completedAt: true, updatedAt: true },
    }),
    getPlatformWhatsAppContact(),
  ]);

  const catalog = getStudentPlanCatalogFromSettings(settings);
  const chartMonths = Array.from({ length: 6 }, (_, index) => addMonths(firstChartMonth, index));
  const revenueByMonth = chartMonths.map((month) => {
    const nextMonth = addMonths(month, 1);
    const amountInCents = approvedRegistrations.reduce((sum, registration) => {
      const paidAt = registration.completedAt ?? registration.updatedAt;
      return paidAt >= month && paidAt < nextMonth ? sum + registration.amountInCents : sum;
    }, 0);

    return {
      label: formatMonthLabel(month),
      amountInCents,
    };
  });

  const currentMonthRevenue = approvedRegistrations.reduce((sum, registration) => {
    const paidAt = registration.completedAt ?? registration.updatedAt;
    return paidAt >= monthStart && paidAt < nextMonthStart ? sum + registration.amountInCents : sum;
  }, 0);
  const previousMonthRevenue = approvedRegistrations.reduce((sum, registration) => {
    const paidAt = registration.completedAt ?? registration.updatedAt;
    return paidAt >= previousMonthStart && paidAt < monthStart ? sum + registration.amountInCents : sum;
  }, 0);

  const studentsTrend = percentChange(activeStudents, activeStudentsBeforeMonth);
  const teachersTrend = percentChange(activeTeachers, activeTeachersBeforeMonth);
  const pendingTrend = percentChange(pendingCorrections, previousPendingCorrections);
  const revenueTrend = percentChange(currentMonthRevenue, previousMonthRevenue);

  const planCounts = activeStudentProfiles.reduce(
    (acc, profile) => {
      if (profile.plan) acc[profile.plan] += 1;
      return acc;
    },
    { MENSAL: 0, TRIMESTRAL: 0, SEMESTRAL: 0, ANUAL: 0 },
  );
  const totalSubscribers = Object.values(planCounts).reduce((sum, count) => sum + count, 0);

  const recentActivity = [
    ...recentApprovedRegistrations.map((registration) => ({
      title: `Plano ${registration.plan ? PLAN_LABELS[registration.plan] : 'sem plano'} aprovado: ${registration.name}`,
      time: relativeTimeLabel(registration.completedAt ?? registration.updatedAt, now),
      kind: 'revenue' as const,
      date: registration.completedAt ?? registration.updatedAt,
    })),
    ...recentSubmissions.map((submission) => ({
      title: `Redacao enviada por ${submission.student.user.name ?? 'aluno'}`,
      time: relativeTimeLabel(submission.submittedAt, now),
      kind: submission.status === 'PENDING' ? ('warning' as const) : ('submission' as const),
      date: submission.submittedAt,
    })),
    ...recentCorrections.slice(0, 4).map((correction) => ({
      title: `Correcao finalizada: ${correction.submission.student.user.name ?? 'aluno'}`,
      time: relativeTimeLabel(correction.createdAt, now),
      kind: 'success' as const,
      date: correction.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)
    .map((activity) => ({
      title: activity.title,
      time: activity.time,
      kind: activity.kind,
    }));

  const dashboardSummary: DashboardAdminSummary = {
    generatedAtLabel: formatDateTimeLabel(now),
    kpis: {
      activeStudents: { value: activeStudents, trendLabel: studentsTrend.label, trendUp: studentsTrend.up },
      activeTeachers: { value: activeTeachers, trendLabel: teachersTrend.label, trendUp: teachersTrend.up },
      pendingCorrections: { value: pendingCorrections, trendLabel: pendingTrend.label, trendUp: pendingTrend.up },
      monthlyRevenueInCents: { value: currentMonthRevenue, trendLabel: revenueTrend.label, trendUp: revenueTrend.up },
    },
    revenue: {
      currentMonthInCents: currentMonthRevenue,
      trendLabel: revenueTrend.label,
      trendUp: revenueTrend.up,
      months: revenueByMonth,
    },
    planDistribution: {
      total: totalSubscribers,
      rows: (['SEMESTRAL', 'TRIMESTRAL', 'MENSAL', 'ANUAL'] as const).map((plan) => ({
        label: PLAN_LABELS[plan],
        count: planCounts[plan],
        percent: totalSubscribers ? Math.round((planCounts[plan] / totalSubscribers) * 100) : 0,
        color: PLAN_COLORS[plan],
      })),
    },
    recentUsers: recentUsers.map((user) => ({
      id: user.id,
      name: user.name ?? 'Sem nome',
      email: user.email,
      initials: initialsFromName(user.name, user.email),
      type: user.role === 'TEACHER' ? 'Professor' : user.role === 'ADMIN' ? 'Admin' : 'Aluno',
      typeColor: user.role === 'TEACHER' ? 'var(--em-lavender)' : user.role === 'ADMIN' ? 'var(--em-yellow-soft)' : 'var(--em-mint)',
      plan: user.role === 'STUDENT' ? (user.studentProfile?.plan ? PLAN_LABELS[user.studentProfile.plan] : 'Sem plano') : user.teacherProfile?.expertise || '-',
      status: user.isActive ? 'Ativo' : 'Inativo',
      statusColor: user.isActive ? 'var(--em-green)' : 'var(--em-coral)',
    })),
    whatsapp: {
      label: whatsappContact?.label || 'Nao configurado',
      href: whatsappContact?.href || null,
    },
    finance: {
      pixKey: settings?.pixKey || null,
      bankName: settings?.bankName || null,
      bankAgency: settings?.bankAgency || null,
      bankAccount: settings?.bankAccount || null,
      bankRecipientName: settings?.bankRecipientName || null,
      bankDocument: settings?.bankDocument || null,
    },
    health: {
      publishedActivities,
      submissionsLast7Days,
      averageCorrectionTimeLabel: formatAverageCorrectionTime(recentCorrections),
    },
    recentActivity,
    pricing: {
      mensalInCents: catalog.MENSAL.amountInCents,
      trimestralInCents: catalog.TRIMESTRAL.amountInCents,
      semestralInCents: catalog.SEMESTRAL.amountInCents,
      anualInCents: catalog.ANUAL.amountInCents,
    },
  };

  return <DashboardAdmin summary={dashboardSummary} />;
}
