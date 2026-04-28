import { redirect } from 'next/navigation';
import { AdminVideoaulas } from '@/components/mockups/escreva-mais/AdminVideoaulas';
import { AlunoVideoaulas } from '@/components/mockups/escreva-mais/AlunoVideoaulas';
import { ProfessorVideoaulas } from '@/components/mockups/escreva-mais/ProfessorVideoaulas';
import { getAuthSession } from '@/lib/auth';

export default async function VideoLessonsPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role === 'ADMIN') return <AdminVideoaulas />;
  if (session.user.role === 'TEACHER') return <ProfessorVideoaulas />;

  return <AlunoVideoaulas />;
}
