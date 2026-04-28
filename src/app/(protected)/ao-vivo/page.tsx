import { redirect } from 'next/navigation';
import { AdminAoVivo } from '@/components/mockups/escreva-mais/AdminAoVivo';
import { AlunoAoVivo } from '@/components/mockups/escreva-mais/AlunoAoVivo';
import { ProfessorAoVivo } from '@/components/mockups/escreva-mais/ProfessorAoVivo';
import { getAuthSession } from '@/lib/auth';

export default async function LiveClassesPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role === 'ADMIN') return <AdminAoVivo />;
  if (session.user.role === 'TEACHER') return <ProfessorAoVivo />;

  return <AlunoAoVivo />;
}
