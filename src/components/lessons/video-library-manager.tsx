'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Film, Loader2, Pencil, PlayCircle, Trash2 } from 'lucide-react';

type CategoryOption = {
  id: string;
  name: string;
};

type LessonItem = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  sortOrder: number;
  classroomId: string | null;
  moduleId: string | null;
  category: { id: string; name: string } | null;
};

type ModuleItem = {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  classroomId: string;
  lessons: LessonItem[];
};

type ClassroomItem = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  modules: ModuleItem[];
  lessons: LessonItem[];
};

type Props = {
  categories: CategoryOption[];
  classrooms: ClassroomItem[];
  looseLessons: LessonItem[];
  canManage: boolean;
};

type ClassroomDraft = {
  name: string;
  description: string;
  sortOrder: string;
};

type ModuleDraft = {
  title: string;
  description: string;
  sortOrder: string;
  classroomId: string;
};

type LessonDraft = {
  title: string;
  description: string;
  videoUrl: string;
  sortOrder: string;
  classroomId: string;
  moduleId: string;
  categoryId: string;
};

const fieldClassName =
  'theme-field w-full rounded-2xl px-4 py-3 text-sm';

const actionButtonClassName =
  'inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition';

function getClassroomDrafts(classrooms: ClassroomItem[]) {
  return Object.fromEntries(
    classrooms.map((classroom) => [
      classroom.id,
      {
        name: classroom.name,
        description: classroom.description ?? '',
        sortOrder: String(classroom.sortOrder ?? 0),
      } satisfies ClassroomDraft,
    ]),
  ) as Record<string, ClassroomDraft>;
}

function getModuleDrafts(classrooms: ClassroomItem[]) {
  return Object.fromEntries(
    classrooms.flatMap((classroom) =>
      classroom.modules.map((module) => [
        module.id,
        {
          title: module.title,
          description: module.description ?? '',
          sortOrder: String(module.sortOrder ?? 0),
          classroomId: classroom.id,
        } satisfies ModuleDraft,
      ]),
    ),
  ) as Record<string, ModuleDraft>;
}

function getLessonDrafts(classrooms: ClassroomItem[], looseLessons: LessonItem[]) {
  const lessons = [
    ...classrooms.flatMap((classroom) => [
      ...classroom.lessons,
      ...classroom.modules.flatMap((module) => module.lessons),
    ]),
    ...looseLessons,
  ];

  return Object.fromEntries(
    lessons.map((lesson) => [
      lesson.id,
      {
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        sortOrder: String(lesson.sortOrder ?? 0),
        classroomId: lesson.classroomId ?? '',
        moduleId: lesson.moduleId ?? '',
        categoryId: lesson.category?.id ?? '',
      } satisfies LessonDraft,
    ]),
  ) as Record<string, LessonDraft>;
}

export function VideoLibraryManager({ categories, classrooms, looseLessons, canManage }: Props) {
  const router = useRouter();
  const [editingClassroomId, setEditingClassroomId] = useState<string | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [classroomDrafts, setClassroomDrafts] = useState<Record<string, ClassroomDraft>>(() => getClassroomDrafts(classrooms));
  const [moduleDrafts, setModuleDrafts] = useState<Record<string, ModuleDraft>>(() => getModuleDrafts(classrooms));
  const [lessonDrafts, setLessonDrafts] = useState<Record<string, LessonDraft>>(() => getLessonDrafts(classrooms, looseLessons));
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const classroomOptions = useMemo(
    () => classrooms.map((classroom) => ({ id: classroom.id, name: classroom.name })),
    [classrooms],
  );

  const moduleOptions = useMemo(
    () =>
      classrooms.flatMap((classroom) =>
        classroom.modules.map((module) => ({
          id: module.id,
          title: module.title,
          classroomId: classroom.id,
        })),
      ),
    [classrooms],
  );

  const handleRequest = async (key: string, url: string, method: 'PATCH' | 'DELETE', body?: object, successMessage?: string) => {
    setPendingAction(key);
    setError(null);
    setSuccess(null);

    const response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(payload.error || 'Nao foi possivel concluir a operacao.');
      setPendingAction(null);
      return false;
    }

    setSuccess(successMessage || 'Alteracoes salvas com sucesso.');
    setPendingAction(null);
    router.refresh();
    return true;
  };

  const updateClassroomDraft = (id: string, field: keyof ClassroomDraft, value: string) => {
    setClassroomDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: value,
      },
    }));
  };

  const updateModuleDraft = (id: string, field: keyof ModuleDraft, value: string) => {
    setModuleDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: value,
      },
    }));
  };

  const updateLessonDraft = (id: string, field: keyof LessonDraft, value: string) => {
    setLessonDrafts((current) => {
      const next = {
        ...current[id],
        [field]: value,
      };

      if (field === 'classroomId') {
        const selectedModule = moduleOptions.find((module) => module.id === next.moduleId);
        if (!value || !selectedModule || selectedModule.classroomId !== value) {
          next.moduleId = '';
        }
      }

      return {
        ...current,
        [id]: next,
      };
    });
  };

  const handleClassroomSave = async (id: string) => {
    const draft = classroomDrafts[id];
    const saved = await handleRequest(
      `classroom-save-${id}`,
      `/api/video-classrooms/${id}`,
      'PATCH',
      {
        name: draft.name,
        description: draft.description,
        sortOrder: Number(draft.sortOrder || 0),
      },
      'Turma atualizada com sucesso.',
    );

    if (saved) {
      setEditingClassroomId(null);
    }
  };

  const handleClassroomDelete = async (id: string) => {
    const confirmed = window.confirm('Excluir esta turma e todo o conteudo vinculado a ela?');
    if (!confirmed) return;
    await handleRequest(`classroom-delete-${id}`, `/api/video-classrooms/${id}`, 'DELETE', undefined, 'Turma excluida com sucesso.');
  };

  const handleModuleSave = async (id: string) => {
    const draft = moduleDrafts[id];
    const saved = await handleRequest(
      `module-save-${id}`,
      `/api/video-modules/${id}`,
      'PATCH',
      {
        title: draft.title,
        description: draft.description,
        classroomId: draft.classroomId,
        sortOrder: Number(draft.sortOrder || 0),
      },
      'Modulo atualizado com sucesso.',
    );

    if (saved) {
      setEditingModuleId(null);
    }
  };

  const handleModuleDelete = async (id: string) => {
    const confirmed = window.confirm('Excluir este modulo e todas as videoaulas ligadas a ele?');
    if (!confirmed) return;
    await handleRequest(`module-delete-${id}`, `/api/video-modules/${id}`, 'DELETE', undefined, 'Modulo excluido com sucesso.');
  };

  const handleLessonSave = async (id: string) => {
    const draft = lessonDrafts[id];
    const saved = await handleRequest(
      `lesson-save-${id}`,
      `/api/video-lessons/${id}`,
      'PATCH',
      {
        title: draft.title,
        description: draft.description,
        videoUrl: draft.videoUrl,
        sortOrder: Number(draft.sortOrder || 0),
        classroomId: draft.classroomId || null,
        moduleId: draft.moduleId || null,
        categoryId: draft.categoryId || null,
      },
      'Videoaula atualizada com sucesso.',
    );

    if (saved) {
      setEditingLessonId(null);
    }
  };

  const handleLessonDelete = async (id: string) => {
    const confirmed = window.confirm('Excluir esta videoaula?');
    if (!confirmed) return;
    await handleRequest(`lesson-delete-${id}`, `/api/video-lessons/${id}`, 'DELETE', undefined, 'Videoaula excluida com sucesso.');
  };

  const renderLesson = (lesson: LessonItem) => {
    const draft = lessonDrafts[lesson.id];
    const lessonModules = draft?.classroomId
      ? moduleOptions.filter((module) => module.classroomId === draft.classroomId)
      : [];

    return (
      <article key={lesson.id} className="rounded-[22px] border border-[var(--em-border-strong)] bg-[#fbfcff] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c87b7]">
              Aula {String(lesson.sortOrder).padStart(2, '0')}
            </p>
            <p className="mt-1 text-base font-semibold text-[var(--em-ink)]">{lesson.title}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--em-text-soft)]">{lesson.description}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--em-peach)] text-[#ff7f32]">
            <Film className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {lesson.category ? (
              <span className="rounded-full bg-[var(--em-mint)] px-3 py-1 text-xs font-semibold text-[var(--em-ink)]">
                {lesson.category.name}
              </span>
            ) : null}
            <Link
              href={lesson.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#ff7f32_0%,#ff5d6c_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_26px_rgba(255,95,108,0.18)]"
            >
              <PlayCircle className="h-4 w-4" />
              Assistir aula
            </Link>
          </div>
          {canManage ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingLessonId((current) => (current === lesson.id ? null : lesson.id))}
                className={`${actionButtonClassName} border-[var(--em-border-strong)] bg-white/90 text-[var(--em-ink)] hover:bg-[var(--em-mint)]`}
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar aula
              </button>
              <button
                type="button"
                onClick={() => handleLessonDelete(lesson.id)}
                disabled={pendingAction === `lesson-delete-${lesson.id}`}
                className={`${actionButtonClassName} border-[#ffd0cf] bg-[#fff1f1] text-[#b14545] hover:bg-[#ffe7e7]`}
              >
                {pendingAction === `lesson-delete-${lesson.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Excluir aula
              </button>
            </div>
          ) : null}
        </div>

        {canManage && editingLessonId === lesson.id && draft ? (
          <div className="theme-field-panel mt-4 grid gap-3 rounded-[20px] p-4 md:grid-cols-2">
            <input
              value={draft.title}
              onChange={(event) => updateLessonDraft(lesson.id, 'title', event.target.value)}
              placeholder="Titulo da aula"
              className={fieldClassName}
            />
            <input
              value={draft.videoUrl}
              onChange={(event) => updateLessonDraft(lesson.id, 'videoUrl', event.target.value)}
              placeholder="Link da videoaula"
              className={fieldClassName}
            />
            <select
              value={draft.classroomId}
              onChange={(event) => updateLessonDraft(lesson.id, 'classroomId', event.target.value)}
              className={fieldClassName}
            >
              <option value="">Sem turma</option>
              {classroomOptions.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </select>
            <select
              value={draft.moduleId}
              onChange={(event) => updateLessonDraft(lesson.id, 'moduleId', event.target.value)}
              className={fieldClassName}
            >
              <option value="">Sem modulo</option>
              {lessonModules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
            <select
              value={draft.categoryId}
              onChange={(event) => updateLessonDraft(lesson.id, 'categoryId', event.target.value)}
              className={fieldClassName}
            >
              <option value="">Sem categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              value={draft.sortOrder}
              onChange={(event) => updateLessonDraft(lesson.id, 'sortOrder', event.target.value)}
              placeholder="Ordem"
              className={fieldClassName}
            />
            <textarea
              value={draft.description}
              onChange={(event) => updateLessonDraft(lesson.id, 'description', event.target.value)}
              placeholder="Descricao da aula"
              rows={4}
              className={`${fieldClassName} min-h-[120px] resize-y md:col-span-2`}
            />
            <div className="flex flex-wrap gap-2 md:col-span-2">
              <button
                type="button"
                onClick={() => handleLessonSave(lesson.id)}
                disabled={pendingAction === `lesson-save-${lesson.id}`}
                className={`${actionButtonClassName} border-transparent bg-[linear-gradient(135deg,#ff7f32_0%,#ff5d6c_100%)] text-white`}
              >
                {pendingAction === `lesson-save-${lesson.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                Salvar aula
              </button>
              <button
                type="button"
                onClick={() => setEditingLessonId(null)}
                className={`${actionButtonClassName} border-[var(--em-border-strong)] bg-white/90 text-[var(--em-ink)]`}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : null}
      </article>
    );
  };

  return (
    <div className="space-y-4">
      {error ? <p className="rounded-2xl border border-[#ffd0cf] bg-[#fff1f1] px-4 py-3 text-sm text-[#b14545]">{error}</p> : null}
      {success ? <p className="rounded-2xl border border-[#d7ecdf] bg-[#eefbf5] px-4 py-3 text-sm text-[#1b7f62]">{success}</p> : null}

      {classrooms.map((classroom) => {
        const classroomLessonCount =
          classroom.lessons.length +
          classroom.modules.reduce((total, module) => total + module.lessons.length, 0);

        const classroomDraft = classroomDrafts[classroom.id];

        return (
          <section
            key={classroom.id}
            className="em-card-hard bg-white p-5"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[var(--em-ink)]">{classroom.name}</h2>
                <p className="text-sm text-[var(--em-text-soft)]">
                  {classroom.description || 'Turma criada para organizar uma sequencia especifica de videoaulas.'}
                </p>
              </div>
              <div className="flex flex-col gap-2 lg:items-end">
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <span className="rounded-full bg-[var(--em-mint)] px-3 py-1 text-xs font-semibold text-[var(--em-ink)]">
                    {classroom.modules.length} modulo{classroom.modules.length === 1 ? '' : 's'}
                  </span>
                  <span className="rounded-full bg-[var(--em-peach)] px-3 py-1 text-xs font-semibold text-[#ff7f32]">
                    {classroomLessonCount} aula{classroomLessonCount === 1 ? '' : 's'}
                  </span>
                </div>
                {canManage ? (
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingClassroomId((current) => (current === classroom.id ? null : classroom.id))}
                      className={`${actionButtonClassName} border-[var(--em-border-strong)] bg-white/90 text-[var(--em-ink)] hover:bg-[var(--em-mint)]`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar turma
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClassroomDelete(classroom.id)}
                      disabled={pendingAction === `classroom-delete-${classroom.id}`}
                      className={`${actionButtonClassName} border-[#ffd0cf] bg-[#fff1f1] text-[#b14545] hover:bg-[#ffe7e7]`}
                    >
                      {pendingAction === `classroom-delete-${classroom.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Excluir turma
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            {canManage && editingClassroomId === classroom.id && classroomDraft ? (
              <div className="theme-field-panel mt-4 grid gap-3 rounded-[22px] p-4 md:grid-cols-2">
                <input
                  value={classroomDraft.name}
                  onChange={(event) => updateClassroomDraft(classroom.id, 'name', event.target.value)}
                  placeholder="Nome da turma"
                  className={fieldClassName}
                />
                <input
                  type="number"
                  min="0"
                  value={classroomDraft.sortOrder}
                  onChange={(event) => updateClassroomDraft(classroom.id, 'sortOrder', event.target.value)}
                  placeholder="Ordem"
                  className={fieldClassName}
                />
                <textarea
                  value={classroomDraft.description}
                  onChange={(event) => updateClassroomDraft(classroom.id, 'description', event.target.value)}
                  placeholder="Descricao da turma"
                  rows={3}
                  className={`${fieldClassName} min-h-[110px] resize-y md:col-span-2`}
                />
                <div className="flex flex-wrap gap-2 md:col-span-2">
                  <button
                    type="button"
                    onClick={() => handleClassroomSave(classroom.id)}
                    disabled={pendingAction === `classroom-save-${classroom.id}`}
                    className={`${actionButtonClassName} border-transparent bg-[linear-gradient(135deg,#ff7f32_0%,#ff5d6c_100%)] text-white`}
                  >
                    {pendingAction === `classroom-save-${classroom.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                    Salvar turma
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingClassroomId(null)}
                    className={`${actionButtonClassName} border-[var(--em-border-strong)] bg-white/90 text-[var(--em-ink)]`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-4 space-y-4">
              {classroom.modules.map((module) => {
                const moduleDraft = moduleDrafts[module.id];

                return (
                  <article key={module.id} className="rounded-[26px] border border-[#e1e5f8] bg-white/90 p-4">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c87b7]">
                          Modulo {String(module.sortOrder).padStart(2, '0')}
                        </p>
                        <h3 className="mt-1 text-base font-semibold text-[var(--em-ink)]">{module.title}</h3>
                        <p className="mt-1 text-sm text-[var(--em-text-soft)]">
                          {module.description || 'Modulo criado para agrupar aulas de uma mesma etapa.'}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 lg:items-end">
                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                          <span className="rounded-full bg-[var(--em-mint)] px-3 py-1 text-xs font-semibold text-[#1b7f62]">
                            {module.lessons.length} aula{module.lessons.length === 1 ? '' : 's'}
                          </span>
                        </div>
                        {canManage ? (
                          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                            <button
                              type="button"
                              onClick={() => setEditingModuleId((current) => (current === module.id ? null : module.id))}
                              className={`${actionButtonClassName} border-[var(--em-border-strong)] bg-white/90 text-[var(--em-ink)] hover:bg-[var(--em-mint)]`}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Editar modulo
                            </button>
                            <button
                              type="button"
                              onClick={() => handleModuleDelete(module.id)}
                              disabled={pendingAction === `module-delete-${module.id}`}
                              className={`${actionButtonClassName} border-[#ffd0cf] bg-[#fff1f1] text-[#b14545] hover:bg-[#ffe7e7]`}
                            >
                              {pendingAction === `module-delete-${module.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                              Excluir modulo
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {canManage && editingModuleId === module.id && moduleDraft ? (
                      <div className="theme-field-panel mt-4 grid gap-3 rounded-[22px] p-4 md:grid-cols-2">
                        <input
                          value={moduleDraft.title}
                          onChange={(event) => updateModuleDraft(module.id, 'title', event.target.value)}
                          placeholder="Titulo do modulo"
                          className={fieldClassName}
                        />
                        <input
                          type="number"
                          min="0"
                          value={moduleDraft.sortOrder}
                          onChange={(event) => updateModuleDraft(module.id, 'sortOrder', event.target.value)}
                          placeholder="Ordem"
                          className={fieldClassName}
                        />
                        <select
                          value={moduleDraft.classroomId}
                          onChange={(event) => updateModuleDraft(module.id, 'classroomId', event.target.value)}
                          className={fieldClassName}
                        >
                          {classroomOptions.map((classroomOption) => (
                            <option key={classroomOption.id} value={classroomOption.id}>
                              {classroomOption.name}
                            </option>
                          ))}
                        </select>
                        <div />
                        <textarea
                          value={moduleDraft.description}
                          onChange={(event) => updateModuleDraft(module.id, 'description', event.target.value)}
                          placeholder="Descricao do modulo"
                          rows={3}
                          className={`${fieldClassName} min-h-[110px] resize-y md:col-span-2`}
                        />
                        <div className="flex flex-wrap gap-2 md:col-span-2">
                          <button
                            type="button"
                            onClick={() => handleModuleSave(module.id)}
                            disabled={pendingAction === `module-save-${module.id}`}
                            className={`${actionButtonClassName} border-transparent bg-[linear-gradient(135deg,#ff7f32_0%,#ff5d6c_100%)] text-white`}
                          >
                            {pendingAction === `module-save-${module.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                            Salvar modulo
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingModuleId(null)}
                            className={`${actionButtonClassName} border-[var(--em-border-strong)] bg-white/90 text-[var(--em-ink)]`}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      {module.lessons.map((lesson) => renderLesson(lesson))}

                      {module.lessons.length === 0 ? (
                        <div className="rounded-[22px] border border-dashed border-[var(--em-border-strong)] bg-white/70 p-4 text-sm text-[var(--em-text-soft)]">
                          Nenhuma videoaula cadastrada neste modulo ainda.
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}

              {classroom.lessons.length ? (
                <article className="rounded-[26px] border border-[#e1e5f8] bg-white/90 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c87b7]">Aulas diretas da turma</p>
                      <h3 className="mt-1 text-base font-semibold text-[var(--em-ink)]">Sem modulo</h3>
                    </div>
                    <span className="rounded-full bg-[var(--em-mint)] px-3 py-1 text-xs font-semibold text-[var(--em-ink)]">
                      {classroom.lessons.length} aula{classroom.lessons.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    {classroom.lessons.map((lesson) => renderLesson(lesson))}
                  </div>
                </article>
              ) : null}

              {!classroom.modules.length && !classroom.lessons.length ? (
                <div className="rounded-[24px] border border-dashed border-[var(--em-border-strong)] bg-white/70 p-4 text-sm text-[var(--em-text-soft)]">
                  Essa turma ainda nao possui modulos ou videoaulas cadastradas.
                </div>
              ) : null}
            </div>
          </section>
        );
      })}

      {looseLessons.length ? (
        <section className="em-card-hard bg-white p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--em-ink)]">Biblioteca avulsa</h2>
              <p className="text-sm text-[var(--em-text-soft)]">Aulas antigas ou independentes que ainda nao foram vinculadas a uma turma.</p>
            </div>
            <span className="rounded-full bg-[var(--em-mint)] px-3 py-1 text-xs font-semibold text-[var(--em-ink)]">
              {looseLessons.length} aula{looseLessons.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">{looseLessons.map((lesson) => renderLesson(lesson))}</div>
        </section>
      ) : null}

      {!classrooms.length && !looseLessons.length ? (
        <div className="rounded-[30px] border border-dashed border-[var(--em-border-strong)] bg-white/70 p-5 text-sm text-[var(--em-text-soft)]">
          Nenhuma videoaula cadastrada ainda.
        </div>
      ) : null}
    </div>
  );
}
