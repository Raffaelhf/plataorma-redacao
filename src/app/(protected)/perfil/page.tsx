import { redirect } from 'next/navigation';
import { AdminPerfil } from '@/components/mockups/escreva-mais/AdminPerfil';
import { AlunoPerfil } from '@/components/mockups/escreva-mais/AlunoPerfil';
import { ProfessorPerfil } from '@/components/mockups/escreva-mais/ProfessorPerfil';
import { getAuthSession } from '@/lib/auth';

export default async function PerfilPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role === 'ADMIN') return <AdminPerfil />;
  if (session.user.role === 'TEACHER') return <ProfessorPerfil />;

  return <AlunoPerfil />;
}
