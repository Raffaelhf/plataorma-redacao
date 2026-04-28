import { redirect } from 'next/navigation';
import { ProfessorAlunos } from '@/components/mockups/escreva-mais/ProfessorAlunos';
import { getAuthSession } from '@/lib/auth';

export default async function ProfessorStudentsPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role === 'ADMIN') redirect('/admin/usuarios');
  if (session.user.role !== 'TEACHER') redirect('/dashboard/aluno');

  return <ProfessorAlunos />;
}
