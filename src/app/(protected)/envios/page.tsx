import { redirect } from 'next/navigation';
import { AlunoEnvios } from '@/components/mockups/escreva-mais/AlunoEnvios';
import { getAuthSession } from '@/lib/auth';

export default async function EnviosPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  if (session.user.role !== 'STUDENT') redirect('/correcoes');

  return <AlunoEnvios />;
}
