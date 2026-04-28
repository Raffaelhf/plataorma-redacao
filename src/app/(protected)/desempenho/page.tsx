import { redirect } from 'next/navigation';
import { AlunoDesempenho } from '@/components/mockups/escreva-mais/AlunoDesempenho';
import { getAuthSession } from '@/lib/auth';

export default async function DesempenhoPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role !== 'STUDENT') redirect('/dashboard/professor');

  return <AlunoDesempenho />;
}
