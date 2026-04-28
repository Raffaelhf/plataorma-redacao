import { redirect } from 'next/navigation';
import { AdminPerfil } from '@/components/mockups/escreva-mais/AdminPerfil';
import { AlunoPerfil } from '@/components/mockups/escreva-mais/AlunoPerfil';
import { ProfessorPerfil } from '@/components/mockups/escreva-mais/ProfessorPerfil';
import { getAuthSession } from '@/lib/auth';
import { isValidGradeLevel } from '@/lib/grade-levels';
import { prisma } from '@/lib/prisma';
import { STUDENT_PLAN_CATALOG } from '@/lib/plans';

const PLAN_MONTHLY_LIMITS = {
  MENSAL: 2,
  TRIMESTRAL: 4,
  SEMESTRAL: 5,
  ANUAL: 6,
} as const;

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

function getMemberSinceLabel(createdAt: Date) {
  const now = new Date();
  const months = Math.max(0, (now.getFullYear() - createdAt.getFullYear()) * 12 + now.getMonth() - createdAt.getMonth());

  if (months < 1) return 'Membro desde este mês';
  if (months === 1) return 'Membro há 1 mês';
  if (months < 12) return `Membro há ${months} meses`;

  const years = Math.floor(months / 12);
  return years === 1 ? 'Membro há 1 ano' : `Membro há ${years} anos`;
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

  if (session.user.role === 'ADMIN') return <AdminPerfil />;
  if (session.user.role === 'TEACHER') return <ProfessorPerfil />;

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

  return (
    <AlunoPerfil
      profile={{
        name: user.name ?? session.user.name ?? 'Usuário Escreva Mais',
        email: user.email,
        initials: getInitials(user.name, user.email),
        planLabel: plan ? STUDENT_PLAN_CATALOG[plan].label : 'Sem plano',
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
