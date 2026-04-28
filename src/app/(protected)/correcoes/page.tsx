import { redirect } from 'next/navigation';
import { AdminCorrecoes } from '@/components/mockups/escreva-mais/AdminCorrecoes';
import { ProfessorCorrecoes } from '@/components/mockups/escreva-mais/ProfessorCorrecoes';
import { getAuthSession } from '@/lib/auth';

export default async function CorrecoesPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role === 'ADMIN') return <AdminCorrecoes />;
  if (session.user.role === 'TEACHER') return <ProfessorCorrecoes />;

  redirect('/dashboard/aluno');
}
