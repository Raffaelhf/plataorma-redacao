import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { ProtectedChrome } from '@/components/layout/protected-chrome';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false) {
    redirect('/login');
  }

  return (
    <ProtectedChrome
      role={session.user.role as 'STUDENT' | 'TEACHER' | 'ADMIN'}
      userName={session.user.name ?? 'Usuário Escreva Mais'}
      userEmail={session.user.email ?? 'conta@escrevamais.com'}
    >
      {children}
    </ProtectedChrome>
  );
}
