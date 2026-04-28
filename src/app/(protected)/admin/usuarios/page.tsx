import { redirect } from 'next/navigation';
import { AdminUsuarios } from '@/components/mockups/escreva-mais/AdminUsuarios';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminUsersPage() {
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login');

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      studentProfile: {
        select: {
          gradeLevel: true,
          cpf: true,
          enrollmentNumber: true,
          plan: true,
          readingClub: true,
          mentoring: true,
          bio: true,
        },
      },
      teacherProfile: {
        select: {
          expertise: true,
          bio: true,
        },
      },
    },
  });

  return <AdminUsuarios initialUsers={users.map((user) => ({ ...user, createdAt: user.createdAt.toISOString() }))} />;
}
