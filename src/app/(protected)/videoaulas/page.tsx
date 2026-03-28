import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Boxes, Film, FolderOpen, PlayCircle } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-6 shadow-[0_20px_60px_rgba(74,73,140,0.12)] sm:p-8">
        <p className="text-sm font-semibold text-[#5a69a1]">
          {isTeacher ? 'Gestão de trilhas em vídeo' : 'Biblioteca organizada por turmas e módulos'}
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#22347e] sm:text-3xl">Videoaulas</h1>
        <p className="mt-3 max-w-[56rem] text-sm leading-7 text-[#63719c]">
          {isTeacher
            ? 'Crie turmas, organize o conteúdo em módulos e defina a ordem de cada videoaula para que o aluno siga uma trilha clara.'
            : 'Acompanhe as aulas em uma trilha organizada por turma e módulo, respeitando a sequência definida pela equipe.'}
        </p>
      </section>

      {isTeacher ? (
        <>
          <div className="rounded-[28px] border border-[#dde3fb] bg-white/80 p-4 text-sm text-[#5f6d98] shadow-[0_18px_45px_rgba(74,73,140,0.08)]">
            {isDemoTeacherSession(session)
              ? 'No modo teste, os cadastros de turmas, módulos e aulas são simulados.'
              : 'Use turmas para separar programas, módulos para estruturar etapas e a ordem numérica para controlar a sequência das aulas.'}
          </div>
          <CreateVideoContent categories={teacherCategories} classrooms={teacherClassrooms} modules={teacherModules} />
        </>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4250d4]">
            <FolderOpen className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-[#6d79a5]">Turmas</p>
          <p className="text-2xl font-extrabold tracking-[-0.04em] text-[#22347e]">{data.classrooms.length}</p>
        </div>
        <div className="rounded-[28px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef9f4] text-[#1b7f62]">
            <Boxes className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-[#6d79a5]">Módulos</p>
          <p className="text-2xl font-extrabold tracking-[-0.04em] text-[#22347e]">{moduleCount}</p>
        </div>
        <div className="rounded-[28px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1eb] text-[#ff7f32]">
            <Film className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-[#6d79a5]">Videoaulas publicadas</p>
          <p className="text-2xl font-extrabold tracking-[-0.04em] text-[#22347e]">{lessonCount}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[30px] border border-[#dde3fb] bg-white/85 p-5 shadow-[0_18px_45px_rgba(74,73,140,0.08)] sm:p-6">
          <p className="text-sm font-semibold text-[#5a69a1]">Nova organização</p>
          <h2 className="mt-2 text-xl font-semibold text-[#22347e]">Turma, módulo e ordem de aula</h2>
          <p className="mt-3 text-sm leading-7 text-[#52618f]">
            Cada turma pode representar um programa diferente. Dentro dela, os módulos separam etapas do curso e a
            ordem da videoaula define exatamente o caminho que o aluno deve seguir.
          </p>
        </article>

        <article className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)] sm:p-6">
          <p className="text-sm font-semibold text-[#5a69a1]">Operação</p>
          <h2 className="mt-2 text-xl font-semibold text-[#22347e]">Sugestão de uso no admin</h2>
          <p className="mt-3 text-sm leading-7 text-[#52618f]">
            Cadastre primeiro a turma, depois os módulos e por fim as aulas. Se quiser manter temas transversais, use
            a categoria como apoio sem perder a trilha principal.
          </p>
        </article>
      </section>

      <div className="space-y-4">
        {data.classrooms.map((classroom) => {
          const classroomLessonCount =
            classroom.lessons.length +
            classroom.modules.reduce((total, module) => total + module.lessons.length, 0);

          return (
            <section
              key={classroom.id}
              className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#22347e]">{classroom.name}</h2>
                  <p className="text-sm text-[#6d79a5]">
                    {classroom.description || 'Turma criada para organizar uma sequência específica de videoaulas.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4]">
                    {classroom.modules.length} módulo{classroom.modules.length === 1 ? '' : 's'}
                  </span>
                  <span className="rounded-full bg-[#fff1eb] px-3 py-1 text-xs font-semibold text-[#ff7f32]">
                    {classroomLessonCount} aula{classroomLessonCount === 1 ? '' : 's'}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {classroom.modules.map((module) => (
                  <article key={module.id} className="rounded-[26px] border border-[#e1e5f8] bg-white/90 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c87b7]">
                          Módulo {String(module.sortOrder).padStart(2, '0')}
                        </p>
                        <h3 className="mt-1 text-base font-semibold text-[#22347e]">{module.title}</h3>
                        <p className="mt-1 text-sm text-[#6d79a5]">
                          {module.description || 'Módulo criado para agrupar aulas de uma mesma etapa.'}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#eef9f4] px-3 py-1 text-xs font-semibold text-[#1b7f62]">
                        {module.lessons.length} aula{module.lessons.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      {module.lessons.map((lesson) => (
                        <article key={lesson.id} className="rounded-[22px] border border-[#e4e8f7] bg-[#fbfcff] p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c87b7]">
                                Aula {String(lesson.sortOrder).padStart(2, '0')}
                              </p>
                              <p className="mt-1 text-base font-semibold text-[#22347e]">{lesson.title}</p>
                              <p className="mt-2 text-sm leading-7 text-[#52618f]">{lesson.description}</p>
                            </div>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff1eb] text-[#ff7f32]">
                              <Film className="h-4 w-4" />
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {lesson.category ? (
                              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4]">
                                {lesson.category.name}
                              </span>
                            ) : null}
                            <Link
                              href={lesson.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff7f32_0%,#ff5d6c_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_26px_rgba(255,95,108,0.18)]"
                            >
                              <PlayCircle className="h-4 w-4" />
                              Assistir aula
                            </Link>
                          </div>
                        </article>
                      ))}

                      {module.lessons.length === 0 ? (
                        <div className="rounded-[22px] border border-dashed border-[#d5dbf5] bg-white/70 p-4 text-sm text-[#6d79a5]">
                          Nenhuma videoaula cadastrada neste módulo ainda.
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}

                {classroom.lessons.length ? (
                  <article className="rounded-[26px] border border-[#e1e5f8] bg-white/90 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c87b7]">Aulas diretas da turma</p>
                        <h3 className="mt-1 text-base font-semibold text-[#22347e]">Sem módulo</h3>
                      </div>
                      <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4]">
                        {classroom.lessons.length} aula{classroom.lessons.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      {classroom.lessons.map((lesson) => (
                        <article key={lesson.id} className="rounded-[22px] border border-[#e4e8f7] bg-[#fbfcff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c87b7]">
                            Aula {String(lesson.sortOrder).padStart(2, '0')}
                          </p>
                          <p className="mt-1 text-base font-semibold text-[#22347e]">{lesson.title}</p>
                          <p className="mt-2 text-sm leading-7 text-[#52618f]">{lesson.description}</p>
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {lesson.category ? (
                              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4]">
                                {lesson.category.name}
                              </span>
                            ) : null}
                            <Link
                              href={lesson.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-semibold text-[#4250d4]"
                            >
                              <PlayCircle className="h-4 w-4" />
                              Abrir aula
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  </article>
                ) : null}

                {!classroom.modules.length && !classroom.lessons.length ? (
                  <div className="rounded-[24px] border border-dashed border-[#d5dbf5] bg-white/70 p-4 text-sm text-[#6d79a5]">
                    Essa turma ainda não possui módulos ou videoaulas cadastradas.
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}

        {data.looseLessons.length ? (
          <section className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#22347e]">Biblioteca avulsa</h2>
                <p className="text-sm text-[#6d79a5]">Aulas antigas ou independentes que ainda não foram vinculadas a uma turma.</p>
              </div>
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4]">
                {data.looseLessons.length} aula{data.looseLessons.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {data.looseLessons.map((lesson) => (
                <article key={lesson.id} className="rounded-[24px] border border-[#e4e8f7] bg-white/90 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c87b7]">
                    Aula {String(lesson.sortOrder).padStart(2, '0')}
                  </p>
                  <p className="mt-1 text-base font-semibold text-[#22347e]">{lesson.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[#52618f]">{lesson.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {lesson.category ? (
                      <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4]">
                        {lesson.category.name}
                      </span>
                    ) : null}
                    <Link
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-semibold text-[#4250d4]"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Abrir aula
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {!data.classrooms.length && !data.looseLessons.length ? (
          <div className="rounded-[30px] border border-dashed border-[#d5dbf5] bg-white/70 p-5 text-sm text-[#6d79a5]">
            Nenhuma videoaula cadastrada ainda.
          </div>
        ) : null}
      </div>
    </div>
  );
}
