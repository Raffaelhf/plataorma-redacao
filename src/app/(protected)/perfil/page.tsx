import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getDemoProfile, isDemoSession } from '@/lib/demo';
import { isAdminRole, isTeacherRole } from '@/lib/roles';
import { ProfileUpdateButton } from '@/components/profile/profile-update-button';

export default async function PerfilPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');
  const isTeacher = isTeacherRole(session.user.role);
  const isStudent = session.user.role === 'STUDENT';
  const isAdmin = isAdminRole(session.user.role);

  const demoProfile = getDemoProfile(session);
  const user = isDemoSession(session)
    ? {
        name: demoProfile?.user.name,
        email: demoProfile?.user.email,
        studentProfile:
          demoProfile?.role === 'STUDENT'
            ? { gradeLevel: '3º ano', bio: 'Conta demo para navegação do aluno.' }
            : null,
        teacherProfile:
          demoProfile?.role === 'TEACHER'
            ? { expertise: 'Redação ENEM', bio: 'Conta demo para navegação do professor.' }
            : null,
      }
    : await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { studentProfile: true, teacherProfile: true },
      });

  return (
    <div className="space-y-4">
      <div>
        <p className={`text-sm ${isAdmin ? 'text-[#956320]' : isTeacher ? 'text-[#6d79a5]' : isStudent ? 'text-[#8a6f9f]' : 'text-slate-400'}`}>Conta</p>
        <h1 className={`text-2xl font-semibold sm:text-3xl ${isTeacher || isStudent ? 'text-[#22347e]' : 'text-white'}`}>Perfil</h1>
      </div>
      <Card
        className={
          isTeacher || isStudent
            ? 'space-y-4 border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] shadow-[0_20px_50px_rgba(74,73,140,0.1)]'
            : 'space-y-4'
        }
      >
        <div>
          <p className={`text-sm font-semibold ${isTeacher || isStudent ? 'text-[#22347e]' : 'text-white'}`}>Dados básicos</p>
          <p className={`text-xs ${isAdmin ? 'text-[#8f6f3b]' : isTeacher ? 'text-[#6d79a5]' : isStudent ? 'text-[#8a6f9f]' : 'text-slate-400'}`}>Edição rápida (somente local). Integre aqui com uma rota PUT conforme necessário.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Input defaultValue={user?.name ?? ''} placeholder="Nome" />
          <Input defaultValue={user?.email ?? ''} placeholder="E-mail" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            defaultValue={user?.studentProfile?.gradeLevel || user?.teacherProfile?.expertise || ''}
            placeholder={session.user.role === 'STUDENT' ? 'Série' : 'Especialidade'}
          />
          <Input defaultValue={user?.studentProfile?.bio || user?.teacherProfile?.bio || ''} placeholder="Bio" />
        </div>
        <ProfileUpdateButton />
      </Card>
    </div>
  );
}
