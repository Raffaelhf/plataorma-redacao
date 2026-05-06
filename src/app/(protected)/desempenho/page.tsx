import { redirect } from 'next/navigation';
import {
  AlunoDesempenho,
  type StudentAchievement,
  type StudentGoal,
  type StudentPerformanceMetric,
  type StudentPerformancePoint,
  type StudentPerformanceSummary,
} from '@/components/mockups/escreva-mais/AlunoDesempenho';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function formatDateTimeLabel(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
    .format(date)
    .replace('.', '');
}

function average(values: number[]) {
  if (!values.length) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function scoreFromSubmission(submission: { grade: number | null; corrections: Array<{ score: number; createdAt: Date }> }) {
  const latestCorrection = submission.corrections[0] ?? null;
  return latestCorrection?.score ?? submission.grade;
}

function percent(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

function buildAchievements(totalSubmissions: number, gradedScores: number[], pendingSubmissions: number): StudentAchievement[] {
  const bestScore = gradedScores.length ? Math.max(...gradedScores) : null;

  return [
    {
      title: 'Primeiro passo',
      description: '1 redacao enviada',
      icon: 'pen',
      active: totalSubmissions >= 1,
    },
    {
      title: 'Consistente',
      description: '5 redacoes enviadas',
      icon: 'target',
      active: totalSubmissions >= 5,
    },
    {
      title: 'Clube 800+',
      description: 'Maior nota acima de 800',
      icon: 'award',
      active: typeof bestScore === 'number' && bestScore >= 800,
    },
    {
      title: 'Clube 900+',
      description: 'Maior nota acima de 900',
      icon: 'star',
      active: typeof bestScore === 'number' && bestScore >= 900,
    },
    {
      title: 'Expert',
      description: '20 redacoes enviadas',
      icon: 'trophy',
      active: totalSubmissions >= 20,
    },
    {
      title: 'Fila zerada',
      description: 'Sem redacao pendente',
      icon: 'check',
      active: totalSubmissions > 0 && pendingSubmissions === 0,
    },
    {
      title: 'Nota 1000',
      description: 'Redacao com nota maxima',
      icon: 'star',
      active: typeof bestScore === 'number' && bestScore >= 1000,
    },
    {
      title: 'Maratona',
      description: '50 redacoes enviadas',
      icon: 'trend',
      active: totalSubmissions >= 50,
    },
  ];
}

function buildGoals(totalSubmissions: number, gradedScores: number[], averageScore: number | null, pendingSubmissions: number): StudentGoal[] {
  const bestScore = gradedScores.length ? Math.max(...gradedScores) : null;

  if (totalSubmissions === 0) {
    return [
      {
        title: 'Enviar a primeira redacao',
        description: 'Sua analise de desempenho comeca depois do primeiro envio.',
      },
      {
        title: 'Receber a primeira correcao',
        description: 'A nota corrigida alimenta seu grafico e seus comparativos.',
      },
    ];
  }

  const goals: StudentGoal[] = [];

  if (pendingSubmissions > 0) {
    goals.push({
      title: 'Acompanhar correcoes pendentes',
      description: `${pendingSubmissions} envio${pendingSubmissions > 1 ? 's' : ''} ainda sem nota corrigida.`,
    });
  }

  if (averageScore === null || averageScore < 800) {
    goals.push({
      title: 'Chegar a media 800',
      description: 'Use os feedbacks das proximas correcoes para subir a media geral.',
    });
  } else if (averageScore < 900) {
    goals.push({
      title: 'Chegar a media 900',
      description: 'Manter constancia nas proximas redacoes pode elevar seu patamar.',
    });
  } else {
    goals.push({
      title: 'Manter media acima de 900',
      description: 'Seu foco agora e consistencia em notas altas.',
    });
  }

  if (typeof bestScore !== 'number' || bestScore < 1000) {
    goals.push({
      title: 'Buscar a melhor nota historica',
      description: typeof bestScore === 'number' ? `Sua maior nota atual e ${bestScore}.` : 'A primeira nota corrigida cria seu recorde inicial.',
    });
  }

  return goals.slice(0, 2);
}

async function getPerformanceSummary(studentId: string, gradeLevel: string | null): Promise<StudentPerformanceSummary> {
  const now = new Date();
  const last30Start = new Date(now);
  last30Start.setDate(last30Start.getDate() - 30);
  const previous30Start = new Date(now);
  previous30Start.setDate(previous30Start.getDate() - 60);

  const [submissions, sameGradeSubmissions, platformSubmissions] = await Promise.all([
    prisma.submission.findMany({
      where: {
        studentId,
      },
      orderBy: { submittedAt: 'asc' },
      include: {
        activity: {
          select: {
            title: true,
          },
        },
        corrections: {
          select: {
            score: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    }),
    gradeLevel
      ? prisma.submission.findMany({
          where: {
            grade: { not: null },
            student: {
              gradeLevel,
            },
          },
          select: {
            grade: true,
          },
        })
      : [],
    prisma.submission.findMany({
      where: {
        grade: { not: null },
      },
      select: {
        grade: true,
      },
    }),
  ]);

  const scoredSubmissions = submissions
    .map((submission) => ({
      id: submission.id,
      title: submission.activity.title,
      submittedAt: submission.submittedAt,
      score: scoreFromSubmission(submission),
    }))
    .filter((submission): submission is { id: string; title: string; submittedAt: Date; score: number } => typeof submission.score === 'number');

  const gradedScores = scoredSubmissions.map((submission) => submission.score);
  const averageScore = average(gradedScores);
  const last30Scores = scoredSubmissions.filter((submission) => submission.submittedAt >= last30Start).map((submission) => submission.score);
  const previous30Scores = scoredSubmissions
    .filter((submission) => submission.submittedAt >= previous30Start && submission.submittedAt < last30Start)
    .map((submission) => submission.score);
  const last30AverageScore = average(last30Scores);
  const previous30AverageScore = average(previous30Scores);
  const last30Delta = last30AverageScore !== null && previous30AverageScore !== null ? last30AverageScore - previous30AverageScore : null;
  const pendingSubmissions = submissions.filter((submission) => submission.status === 'PENDING' || submission.status === 'UNDER_REVIEW').length;
  const returnedSubmissions = submissions.filter((submission) => submission.status === 'RETURNED' || submission.status === 'GRADED').length;
  const bestScore = gradedScores.length ? Math.max(...gradedScores) : null;
  const lowestScore = gradedScores.length ? Math.min(...gradedScores) : null;
  const chart: StudentPerformancePoint[] = scoredSubmissions.slice(-12).map((submission) => ({
    id: submission.id,
    title: submission.title,
    score: submission.score,
    submittedAtLabel: formatDateLabel(submission.submittedAt),
  }));
  const sameGradeScores = sameGradeSubmissions.map((submission) => submission.grade).filter((score): score is number => typeof score === 'number');
  const platformScores = platformSubmissions.map((submission) => submission.grade).filter((score): score is number => typeof score === 'number');

  const metrics: StudentPerformanceMetric[] = [
    {
      label: 'Redacoes enviadas',
      value: String(submissions.length),
      detail: `${returnedSubmissions} com devolutiva`,
      progress: percent(submissions.length, 20),
      color: 'var(--em-green)',
    },
    {
      label: 'Redacoes corrigidas',
      value: String(scoredSubmissions.length),
      detail: 'Com nota real registrada',
      progress: percent(scoredSubmissions.length, Math.max(1, submissions.length)),
      color: 'var(--em-mint-deep)',
    },
    {
      label: 'Media dos ultimos 30 dias',
      value: last30AverageScore === null ? '--' : String(last30AverageScore),
      detail: last30Scores.length ? `${last30Scores.length} nota${last30Scores.length > 1 ? 's' : ''} no periodo` : 'Sem notas no periodo',
      progress: last30AverageScore === null ? 0 : percent(last30AverageScore, 1000),
      color: 'var(--em-yellow)',
    },
    {
      label: 'Melhor nota',
      value: bestScore === null ? '--' : String(bestScore),
      detail: bestScore === null ? 'Sem correcao ainda' : 'Seu recorde ate agora',
      progress: bestScore === null ? 0 : percent(bestScore, 1000),
      color: 'var(--em-green)',
    },
    {
      label: 'Em correcao',
      value: String(pendingSubmissions),
      detail: 'Envios aguardando nota',
      progress: percent(pendingSubmissions, Math.max(1, submissions.length)),
      color: 'var(--em-peach-deep)',
    },
  ];

  return {
    totalSubmissions: submissions.length,
    gradedSubmissions: scoredSubmissions.length,
    pendingSubmissions,
    returnedSubmissions,
    averageScore,
    last30AverageScore,
    last30Delta,
    bestScore,
    lowestScore,
    sameGradeAverage: average(sameGradeScores),
    platformAverage: average(platformScores),
    gradeLevel,
    generatedAtLabel: formatDateTimeLabel(now),
    chart,
    metrics,
    achievements: buildAchievements(submissions.length, gradedScores, pendingSubmissions),
    goals: buildGoals(submissions.length, gradedScores, averageScore, pendingSubmissions),
  };
}

export default async function DesempenhoPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role !== 'STUDENT') redirect('/dashboard/professor');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      studentProfile: {
        select: {
          id: true,
          gradeLevel: true,
        },
      },
    },
  });

  const studentId = user?.studentProfile?.id ?? session.user.studentId;
  const summary = studentId
    ? await getPerformanceSummary(studentId, user?.studentProfile?.gradeLevel ?? null)
    : {
        totalSubmissions: 0,
        gradedSubmissions: 0,
        pendingSubmissions: 0,
        returnedSubmissions: 0,
        averageScore: null,
        last30AverageScore: null,
        last30Delta: null,
        bestScore: null,
        lowestScore: null,
        sameGradeAverage: null,
        platformAverage: null,
        gradeLevel: null,
        generatedAtLabel: formatDateTimeLabel(new Date()),
        chart: [],
        metrics: [],
        achievements: buildAchievements(0, [], 0),
        goals: buildGoals(0, [], null, 0),
      };

  return (
    <AlunoDesempenho
      viewer={{
        name: user?.name ?? session.user.name ?? 'Aluno Escreva Mais',
        email: user?.email ?? session.user.email ?? 'conta@escrevamais.com',
      }}
      summary={summary}
    />
  );
}
