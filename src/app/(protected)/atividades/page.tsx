import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { CreateActivity } from '@/components/activities/create-activity';
import { getAuthSession } from '@/lib/auth';
import { demoActivities, isDemoSession } from '@/lib/demo';
import { isAdminRole, isTeacherRole } from '@/lib/roles';

export default async function ActivitiesPage() {
  const session = await getAuthSession();
  const isTeacher = isTeacherRole(session?.user?.role);
  const isAdmin = isAdminRole(session?.user?.role);
  const isStudent = session?.user?.role === 'STUDENT';
  const activities = isDemoSession(session)
    ? demoActivities
    : await prisma.activity.findMany({
        where: isStudent
          ? {
              status: 'PUBLISHED',
              createdById: {
                not: null,
              },
            }
          : isAdmin
            ? undefined
            : {
                createdById: session?.user?.teacherId ?? '__teacher_without_profile__',
              },
        orderBy: { createdAt: 'desc' },
      });

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-6 shadow-[0_20px_60px_rgba(74,73,140,0.12)] sm:p-8">
        <p className={`text-sm font-semibold ${isStudent ? 'text-[#8a6f9f]' : 'text-[#5a69a1]'}`}>Biblioteca de propostas</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#1c2868] sm:text-3xl">Atividades</h1>
      </div>

      {isTeacher && <CreateActivity />}

      <div className="grid gap-4 md:grid-cols-2">
        {activities.map((activity) => (
          <section key={activity.id} className="space-y-3 rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-[#22347e]">{activity.title}</h3>
              <Badge label={activity.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'} variant={activity.status === 'PUBLISHED' ? 'success' : 'muted'} />
            </div>
            <p className="line-clamp-3 text-sm leading-7 text-[#52618f]">{activity.description}</p>
            <div className="flex flex-wrap gap-2">
              {activity.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#f4ecff] px-3 py-1 text-xs text-[#735f98]">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/atividades/${activity.id}`} className="text-sm font-semibold text-[#4250d4]">
                Ver detalhes
              </Link>
              {isStudent ? (
                <Link
                  href={`/atividades/${activity.id}`}
                  className="rounded-full bg-[linear-gradient(135deg,#ff7f32_0%,#ff5d6c_100%)] px-4 py-2 text-xs font-semibold text-white shadow-[0_14px_26px_rgba(255,95,108,0.18)]"
                >
                  Enviar PDF
                </Link>
              ) : null}
            </div>
          </section>
        ))}
        {activities.length === 0 && <p className="text-sm text-[#6d79a5]">Nenhuma atividade criada ainda.</p>}
      </div>
    </div>
  );
}
