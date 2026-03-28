import { Sidebar } from '@/components/layout/sidebar';
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false) {
    redirect('/login');
  }

  return (
    <div className="theme-protected mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6 lg:px-6 lg:py-8">
      <Sidebar role={session.user.role as 'STUDENT' | 'TEACHER' | 'ADMIN'} />
      <main className="min-w-0 space-y-4">{children}</main>
    </div>
  );
}
