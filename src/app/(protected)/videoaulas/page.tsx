import { redirect } from 'next/navigation';
import { Boxes, Film, FolderOpen } from 'lucide-react';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  demoVideoCategories,
  demoVideoClassrooms,
  demoVideoLessons,
  demoVideoModules,
  isDemoSession,
  isDemoTeacherSession,
} from '@/lib/demo';
import { CreateVideoContent } from '@/components/lessons/create-video-content';
import { VideoLibraryManager } from '@/components/lessons/video-library-manager';
import { isTeacherRole } from '@/lib/roles';

function countLessons(
  classrooms: Array<{
    modules: Array<{ lessons: Array<unknown> }>;
    lessons: Array<unknown>;
  }>,
  looseLessons: Array<unknown>,
) {
  return classrooms.reduce((total, classroom) => {
    const moduleLessons = classroom.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    return total + classroom.lessons.length + moduleLessons;
  }, looseLessons.length);
}

export default async function VideoLessonsPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  const isTeacher = isTeacherRole(session.user.role);
  const isDemo = isDemoSession(session);

  const data = isDemo
    ? {
        categories: demoVideoCategories,
        classrooms: demoVideoClassrooms.map((classroom) => ({
          ...classroom,
          modules: demoVideoModules
            .filter((module) => module.classroomId === classroom.id)
            .map((module) => ({
              ...module,
              lessons: demoVideoLessons.filter((lesson) => lesson.moduleId === module.id),
            })),
          lessons: demoVideoLessons.filter((lesson) => lesson.classroomId === classroom.id && !lesson.moduleId),
        })),
        looseLessons: demoVideoLessons.filter((lesson) => !lesson.classroomId),
      }
    : await (async () => {
        const [categories, classrooms, looseLessons] = await Promise.all([
          prisma.videoCategory.findMany({
            orderBy: { name: 'asc' },
          }),
          prisma.videoClassroom.findMany({
            include: {
              modules: {
                include: {
                  lessons: {
                    include: {
                      category: true,
                    },
                    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
                  },
                },
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
              },
              lessons: {
                where: { moduleId: null },
                include: {
                  category: true,
                },
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
              },
            },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
          }),
          prisma.videoLesson.findMany({
            where: { classroomId: null },
            include: {
              category: true,
            },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
          }),
        ]);

        return { categories, classrooms, looseLessons };
      })();

  const moduleCount = data.classrooms.reduce((total, classroom) => total + classroom.modules.length, 0);
  const lessonCount = countLessons(data.classrooms, data.looseLessons);
  const teacherCategories = data.categories.map((category) => ({ id: category.id, name: category.name }));
  const teacherClassrooms = data.classrooms.map((classroom) => ({ id: classroom.id, name: classroom.name }));
  const teacherModules = data.classrooms.flatMap((classroom) =>
    classroom.modules.map((module) => ({ id: module.id, title: module.title, classroomId: classroom.id })),
  );
  const canManageLibrary = session.user.role === 'ADMIN' && !isDemo;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-6 shadow-[0_20px_60px_rgba(74,73,140,0.12)] dark:border-slate-700/80 dark:bg-[linear-gradient(135deg,rgba(10,18,35,0.98)_0%,rgba(18,25,49,0.96)_52%,rgba(48,29,41,0.9)_100%)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:p-8">
        <p className="text-sm font-semibold text-[#5a69a1] dark:text-[#9fb0d8]">
          {isTeacher ? 'Gest\u00E3o de trilhas em v\u00EDdeo' : 'Biblioteca organizada por turmas e m\u00F3dulos'}
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#22347e] dark:text-[#f3f7ff] sm:text-3xl">
          Videoaulas
        </h1>
        <p className="mt-3 max-w-[56rem] text-sm leading-7 text-[#63719c] dark:text-[#adc0e8]">
          {isTeacher
            ? 'Crie turmas, organize o conte\u00FAdo em m\u00F3dulos e defina a ordem de cada videoaula para que o aluno siga uma trilha clara.'
            : 'Acompanhe as aulas em uma trilha organizada por turma e m\u00F3dulo, respeitando a sequ\u00EAncia definida pela equipe.'}
        </p>
      </section>

      {isTeacher ? (
        <>
          <div className="rounded-[28px] border border-[#dde3fb] bg-white/80 p-4 text-sm text-[#5f6d98] shadow-[0_18px_45px_rgba(74,73,140,0.08)] dark:border-slate-700/80 dark:bg-[#10192d] dark:text-[#adc0e8] dark:shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
            {isDemoTeacherSession(session)
              ? 'No modo teste, os cadastros de turmas, m\u00F3dulos e aulas s\u00E3o simulados.'
              : 'Use turmas para separar programas, m\u00F3dulos para estruturar etapas e a ordem num\u00E9rica para controlar a sequ\u00EAncia das aulas.'}
          </div>
          <CreateVideoContent categories={teacherCategories} classrooms={teacherClassrooms} modules={teacherModules} />
        </>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)] dark:border-slate-700/80 dark:bg-[linear-gradient(180deg,rgba(11,19,36,0.96),rgba(15,23,42,0.9))] dark:shadow-[0_20px_50px_rgba(0,0,0,0.26)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4250d4] dark:bg-[#1b2743] dark:text-[#c7d4ff]">
            <FolderOpen className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-[#6d79a5] dark:text-[#9fb0d8]">Turmas</p>
          <p className="text-2xl font-extrabold tracking-[-0.04em] text-[#22347e] dark:text-[#f3f7ff]">{data.classrooms.length}</p>
        </div>
        <div className="rounded-[28px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)] dark:border-slate-700/80 dark:bg-[linear-gradient(180deg,rgba(11,19,36,0.96),rgba(15,23,42,0.9))] dark:shadow-[0_20px_50px_rgba(0,0,0,0.26)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef9f4] text-[#1b7f62] dark:bg-[#14332b] dark:text-[#8fe0b7]">
            <Boxes className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-[#6d79a5] dark:text-[#9fb0d8]">M\u00F3dulos</p>
          <p className="text-2xl font-extrabold tracking-[-0.04em] text-[#22347e] dark:text-[#f3f7ff]">{moduleCount}</p>
        </div>
        <div className="rounded-[28px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)] dark:border-slate-700/80 dark:bg-[linear-gradient(180deg,rgba(11,19,36,0.96),rgba(15,23,42,0.9))] dark:shadow-[0_20px_50px_rgba(0,0,0,0.26)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1eb] text-[#ff7f32] dark:bg-[#3b231d] dark:text-[#fdba74]">
            <Film className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-[#6d79a5] dark:text-[#9fb0d8]">Videoaulas publicadas</p>
          <p className="text-2xl font-extrabold tracking-[-0.04em] text-[#22347e] dark:text-[#f3f7ff]">{lessonCount}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[30px] border border-[#dde3fb] bg-white/85 p-5 shadow-[0_18px_45px_rgba(74,73,140,0.08)] dark:border-slate-700/80 dark:bg-[#10192d] dark:shadow-[0_18px_45px_rgba(0,0,0,0.22)] sm:p-6">
          <p className="text-sm font-semibold text-[#5a69a1] dark:text-[#9fb0d8]">Nova organiza\u00E7\u00E3o</p>
          <h2 className="mt-2 text-xl font-semibold text-[#22347e] dark:text-[#f3f7ff]">Turma, m\u00F3dulo e ordem de aula</h2>
          <p className="mt-3 text-sm leading-7 text-[#52618f] dark:text-[#adc0e8]">
            Cada turma pode representar um programa diferente. Dentro dela, os m\u00F3dulos separam etapas do curso e a
            ordem da videoaula define exatamente o caminho que o aluno deve seguir.
          </p>
        </article>

        <article className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)] dark:border-slate-700/80 dark:bg-[linear-gradient(135deg,rgba(10,18,35,0.98),rgba(18,25,49,0.96),rgba(48,29,41,0.9))] dark:shadow-[0_20px_50px_rgba(0,0,0,0.26)] sm:p-6">
          <p className="text-sm font-semibold text-[#5a69a1] dark:text-[#9fb0d8]">Opera\u00E7\u00E3o</p>
          <h2 className="mt-2 text-xl font-semibold text-[#22347e] dark:text-[#f3f7ff]">Sugest\u00E3o de uso no admin</h2>
          <p className="mt-3 text-sm leading-7 text-[#52618f] dark:text-[#adc0e8]">
            Cadastre primeiro a turma, depois os m\u00F3dulos e por fim as aulas. Se quiser manter temas transversais, use
            a categoria como apoio sem perder a trilha principal.
          </p>
        </article>
      </section>

      <VideoLibraryManager
        categories={teacherCategories}
        classrooms={data.classrooms}
        looseLessons={data.looseLessons}
        canManage={canManageLibrary}
      />
    </div>
  );
}
