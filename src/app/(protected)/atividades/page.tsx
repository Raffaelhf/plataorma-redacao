import { redirect } from 'next/navigation';
import { AdminAtividades } from '@/components/mockups/escreva-mais/AdminAtividades';
import { AlunoAtividades } from '@/components/mockups/escreva-mais/AlunoAtividades';
import { ProfessorAtividades } from '@/components/mockups/escreva-mais/ProfessorAtividades';
import { getAuthSession } from '@/lib/auth';

export default async function ActivitiesPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role === 'ADMIN') return <AdminAtividades />;
  if (session.user.role === 'TEACHER') return <ProfessorAtividades />;

  return <AlunoAtividades />;
}
