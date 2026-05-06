import { DashboardAluno } from '@/components/mockups/escreva-mais/DashboardAluno';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getPreviousMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

export default async function StudentDashboard() {
  const session = await getAuthSession();
  const now = new Date();
  const monthStart = getMonthStart(now);
  const previousMonthStart = getPreviousMonthStart(now);
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const studentId = session?.user?.studentId;

  const [currentUser, submissions, previousMonthSubmissions, weeklyPublishedActivities, upcomingLiveClasses] = await Promise.all([
    session?.user?.id
      ? prisma.user.findUnique({
          where: { id: session.user.id },
          select: { name: true, email: true },
        })
      : null,
    studentId
      ? prisma.submission.findMany({
          where: { studentId },
          orderBy: { submittedAt: 'desc' },
          include: {
            activity: { select: { title: true } },
          },
        })
      : [],
    studentId
      ? prisma.submission.findMany({
          where: {
            studentId,
            submittedAt: {
              gte: previousMonthStart,
              lt: monthStart,
            },
          },
          select: { grade: true },
        })
      : [],
    prisma.activity.count({
      where: {
        status: 'PUBLISHED',
        OR: [{ dueDate: { gte: now, lte: weekEnd } }, { createdAt: { gte: monthStart } }],
      },
    }),
    prisma.liveClass.findMany({
      where: {
        scheduledAt: { gte: now },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 5,
      include: {
        createdBy: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    }),
  ]);

  const gradedSubmissions = submissions.filter((submission) => typeof submission.grade === 'number');
  const previousMonthGrades = previousMonthSubmissions
    .map((submission) => submission.grade)
    .filter((grade): grade is number => typeof grade === 'number');
  const averageGrade = gradedSubmissions.length
    ? Math.round(gradedSubmissions.reduce((sum, submission) => sum + (submission.grade ?? 0), 0) / gradedSubmissions.length)
    : 0;
  const previousAverageGrade = previousMonthGrades.length
    ? Math.round(previousMonthGrades.reduce((sum, grade) => sum + grade, 0) / previousMonthGrades.length)
    : averageGrade;
  const monthlySubmissions = submissions.filter((submission) => submission.submittedAt >= monthStart).length;
  const inCorrection = submissions.filter((submission) => submission.status === 'PENDING' || submission.status === 'UNDER_REVIEW').length;

  return (
    <DashboardAluno
      viewer={{
        name: currentUser?.name ?? session?.user?.name ?? 'Aluno Escreva Mais',
        email: currentUser?.email ?? session?.user?.email ?? 'conta@escrevamais.com',
      }}
      stats={{
        totalSubmissions: submissions.length,
        monthlySubmissions,
        averageGrade,
        averageGradeDelta: averageGrade - previousAverageGrade,
        inCorrection,
        weeklyPublishedActivities,
      }}
      recentSubmissions={submissions.slice(0, 4).map((submission) => ({
        id: submission.id,
        title: submission.activity.title,
        submittedAt: submission.submittedAt.toISOString(),
        status: submission.status,
        grade: submission.grade,
      }))}
      liveClasses={upcomingLiveClasses.map((liveClass) => ({
        id: liveClass.id,
        title: liveClass.title,
        description: liveClass.description,
        scheduledAt: liveClass.scheduledAt.toISOString(),
        meetingUrl: liveClass.meetingUrl,
        teacherName: liveClass.createdBy?.user.name ?? liveClass.createdBy?.user.email ?? null,
      }))}
    />
  );
}
