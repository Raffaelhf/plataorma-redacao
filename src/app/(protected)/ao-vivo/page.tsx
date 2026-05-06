import { redirect } from 'next/navigation';
import { AdminAoVivo } from '@/components/mockups/escreva-mais/AdminAoVivo';
import { AlunoAoVivo } from '@/components/mockups/escreva-mais/AlunoAoVivo';
import { ProfessorAoVivo } from '@/components/mockups/escreva-mais/ProfessorAoVivo';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function LiveClassesPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role === 'ADMIN') return <AdminAoVivo />;
  if (session.user.role === 'TEACHER') return <ProfessorAoVivo />;

  const now = new Date();
  const liveClasses = await prisma.liveClass.findMany({
    where: {
      scheduledAt: { gte: now },
    },
    orderBy: { scheduledAt: 'asc' },
    take: 12,
    include: {
      createdBy: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  return (
    <AlunoAoVivo
      viewer={{
        name: session.user.name ?? 'Aluno Escreva Mais',
        email: session.user.email ?? 'conta@escrevamais.com',
      }}
      liveClasses={liveClasses.map((liveClass) => ({
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
