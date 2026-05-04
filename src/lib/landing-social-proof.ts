import { prisma } from '@/lib/prisma';

type RecentStudent = {
  id: string;
  name: string;
  initials: string;
};

export type LandingSocialProof = {
  count: number;
  label: string;
  recentStudents: RecentStudent[];
};

const FALLBACK_SOCIAL_PROOF: LandingSocialProof = {
  count: 0,
  label: 'alunos ativos',
  recentStudents: [],
};

function initialsFromName(name?: string | null, email?: string | null) {
  const source = (name || email || '?').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export async function getLandingSocialProof(): Promise<LandingSocialProof> {
  try {
    const [approvedRegistrations, activeStudents, recentStudents] = await Promise.all([
      prisma.registrationSession.count({ where: { status: 'APPROVED' } }),
      prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
      prisma.user.findMany({
        where: { role: 'STUDENT', isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          name: true,
          email: true,
        },
      }),
    ]);

    const count = approvedRegistrations || activeStudents;

    return {
      count,
      label: approvedRegistrations ? 'matrículas aprovadas' : 'alunos ativos',
      recentStudents: recentStudents.map((student) => ({
        id: student.id,
        name: student.name || student.email,
        initials: initialsFromName(student.name, student.email),
      })),
    };
  } catch (error) {
    console.warn('Nao foi possivel carregar prova social da landing.', error);
    return FALLBACK_SOCIAL_PROOF;
  }
}
