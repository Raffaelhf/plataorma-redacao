'use client';

import { useRef, useState, type TextareaHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Boxes, Film, FolderPlus, Layers3, Loader2, PlusCircle } from 'lucide-react';
import { isDemoLogin } from '@/lib/demo';
import { isTeacherRole } from '@/lib/roles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type CategoryOption = {
  id: string;
  name: string;
};

type ClassroomOption = {
  id: string;
  name: string;
};

type ModuleOption = {
  id: string;
  title: string;
  classroomId: string;
};

type CreateVideoContentProps = {
  categories: CategoryOption[];
  classrooms: ClassroomOption[];
  modules: ModuleOption[];
};

const panelClassName =
  'theme-form-surface flex h-full flex-col rounded-[30px] p-5';

const fieldClassName =
  'rounded-2xl';

const selectClassName =
  'theme-field w-full rounded-2xl px-4 py-3 text-sm';

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="theme-field w-full rounded-2xl px-4 py-3 text-sm"
    />
  );
}

export function CreateVideoContent({ categories, classrooms, modules }: CreateVideoContentProps) {
  const router = useRouter();
  const { data } = useSession();
  const role = (data?.user as { role?: string } | undefined)?.role;
  const login =
    (data?.user as { email?: string; name?: string } | undefined)?.email ??
    (data?.user as { name?: string } | undefined)?.name;

  const classroomFormRef = useRef<HTMLFormElement>(null);
  const moduleFormRef = useRef<HTMLFormElement>(null);
  const lessonFormRef = useRef<HTMLFormElement>(null);

  const [loadingClassroom, setLoadingClassroom] = useState(false);
  const [loadingModule, setLoadingModule] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(false);

  const [classroomMessage, setClassroomMessage] = useState<string | null>(null);
  const [moduleMessage, setModuleMessage] = useState<string | null>(null);
  const [lessonMessage, setLessonMessage] = useState<string | null>(null);

  const [classroomError, setClassroomError] = useState<string | null>(null);
  const [moduleError, setModuleError] = useState<string | null>(null);
  const [lessonError, setLessonError] = useState<string | null>(null);

  const [moduleClassroomId, setModuleClassroomId] = useState('');
  const [lessonClassroomId, setLessonClassroomId] = useState('');
  const [lessonModuleId, setLessonModuleId] = useState('');

  const isDemo = isDemoLogin(login);
  const moduleOptions = lessonClassroomId ? modules.filter((module) => module.classroomId === lessonClassroomId) : [];

  if (!isTeacherRole(role)) return null;

  const handleClassroomSubmit = async (formData: FormData) => {
    setLoadingClassroom(true);
    setClassroomError(null);
    setClassroomMessage(null);

    if (isDemo) {
      setClassroomMessage('Turma simulada com sucesso no modo teste.');
      setLoadingClassroom(false);
      return;
    }

    const res = await fetch('/api/video-classrooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        description: formData.get('description'),
        sortOrder: formData.get('sortOrder'),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setClassroomError(body.error || 'N\u00E3o foi poss\u00EDvel criar a turma.');
    } else {
      setClassroomMessage('Turma criada com sucesso.');
      classroomFormRef.current?.reset();
      router.refresh();
    }

    setLoadingClassroom(false);
  };

  const handleModuleSubmit = async (formData: FormData) => {
    setLoadingModule(true);
    setModuleError(null);
    setModuleMessage(null);

    if (isDemo) {
      setModuleMessage('M\u00F3dulo simulado com sucesso no modo teste.');
      setLoadingModule(false);
      return;
    }

    const res = await fetch('/api/video-modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.get('title'),
        description: formData.get('description'),
        classroomId: formData.get('classroomId'),
        sortOrder: formData.get('sortOrder'),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setModuleError(body.error || 'N\u00E3o foi poss\u00EDvel criar o m\u00F3dulo.');
    } else {
      setModuleMessage('M\u00F3dulo criado com sucesso.');
      moduleFormRef.current?.reset();
      setModuleClassroomId('');
      router.refresh();
    }

    setLoadingModule(false);
  };

  const handleLessonSubmit = async (formData: FormData) => {
    setLoadingLesson(true);
    setLessonError(null);
    setLessonMessage(null);

    if (isDemo) {
      setLessonMessage('Videoaula simulada com sucesso no modo teste.');
      setLoadingLesson(false);
      return;
    }

    const res = await fetch('/api/video-lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.get('title'),
        description: formData.get('description'),
        videoUrl: formData.get('videoUrl'),
        sortOrder: formData.get('sortOrder'),
        classroomId: formData.get('classroomId') || null,
        moduleId: formData.get('moduleId') || null,
        categoryId: formData.get('categoryId') || null,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setLessonError(body.error || 'N\u00E3o foi poss\u00EDvel salvar a videoaula.');
    } else {
      setLessonMessage('Videoaula criada com sucesso.');
      lessonFormRef.current?.reset();
      setLessonClassroomId('');
      setLessonModuleId('');
      router.refresh();
    }

    setLoadingLesson(false);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <form ref={classroomFormRef} action={handleClassroomSubmit} className={panelClassName}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--em-text-soft)]">Turmas</p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--em-ink)]">Nova turma</h2>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--em-mint)] text-[var(--em-ink)]">
            <FolderPlus className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-3">
          <Input name="name" placeholder="Ex.: Turma extensiva 2026" required className={fieldClassName} />
          <TextArea name="description" rows={3} placeholder="Descreva a proposta da turma e para qual perfil de aluno ela serve." />
          <Input name="sortOrder" type="number" min="0" step="1" defaultValue="0" className={fieldClassName} />
        </div>

        <div className="mt-3 min-h-4">
          {classroomError ? <p className="text-xs text-[#c05252]">{classroomError}</p> : null}
          {classroomMessage ? <p className="text-xs text-[#1b7f62]">{classroomMessage}</p> : null}
        </div>

        <Button type="submit" disabled={loadingClassroom} className="mt-4 w-full">
          {loadingClassroom ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          Criar turma
        </Button>
      </form>

      <form ref={moduleFormRef} action={handleModuleSubmit} className={panelClassName}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--em-text-soft)]">M\u00F3dulos</p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--em-ink)]">Novo m\u00F3dulo</h2>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--em-mint)] text-[#1b7f62]">
            <Layers3 className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-3">
          <select
            name="classroomId"
            value={moduleClassroomId}
            onChange={(event) => setModuleClassroomId(event.target.value)}
            className={selectClassName}
            required
          >
            <option value="">Selecione a turma</option>
            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
          <Input name="title" placeholder="Ex.: M\u00F3dulo 1 - Fundamentos" required className={fieldClassName} />
          <TextArea name="description" rows={3} placeholder="Explique o objetivo do m\u00F3dulo e o que ser\u00E1 abordado nas aulas." />
          <Input name="sortOrder" type="number" min="0" step="1" defaultValue="0" className={fieldClassName} />
        </div>

        <div className="mt-3 min-h-4">
          {moduleError ? <p className="text-xs text-[#c05252]">{moduleError}</p> : null}
          {moduleMessage ? <p className="text-xs text-[#1b7f62]">{moduleMessage}</p> : null}
        </div>

        <Button type="submit" disabled={loadingModule} className="mt-4 w-full">
          {loadingModule ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Boxes className="mr-2 h-4 w-4" />}
          Criar m\u00F3dulo
        </Button>
      </form>

      <form ref={lessonFormRef} action={handleLessonSubmit} className={panelClassName}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--em-text-soft)]">Conte\u00FAdo</p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--em-ink)]">Nova videoaula</h2>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--em-peach)] text-[#ff7f32]">
            <Film className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-3">
          <select
            name="classroomId"
            value={lessonClassroomId}
            onChange={(event) => {
              setLessonClassroomId(event.target.value);
              setLessonModuleId('');
            }}
            className={selectClassName}
          >
            <option value="">Selecione a turma</option>
            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
          <select
            name="moduleId"
            value={lessonModuleId}
            onChange={(event) => setLessonModuleId(event.target.value)}
            className={`${selectClassName} disabled:cursor-not-allowed disabled:bg-[#f3f5ff] disabled:text-[#8a93b8]`}
            disabled={!lessonClassroomId || moduleOptions.length === 0}
          >
            <option value="">Sem m\u00F3dulo</option>
            {moduleOptions.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>
          <Input name="title" placeholder="T\u00EDtulo da aula" required className={fieldClassName} />
          <TextArea name="description" rows={3} placeholder="Resumo do que ser\u00E1 explicado na videoaula." required />
          <Input name="videoUrl" type="url" placeholder="https://youtube.com/... ou link incorporado" required className={fieldClassName} />
          <select name="categoryId" className={selectClassName} defaultValue="">
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Input name="sortOrder" type="number" min="0" step="1" defaultValue="0" className={fieldClassName} />
        </div>

        <div className="mt-3 min-h-4">
          {lessonError ? <p className="text-xs text-[#c05252]">{lessonError}</p> : null}
          {lessonMessage ? <p className="text-xs text-[#1b7f62]">{lessonMessage}</p> : null}
        </div>

        <Button type="submit" disabled={loadingLesson} className="mt-4 w-full">
          {loadingLesson ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Film className="mr-2 h-4 w-4" />}
          Salvar videoaula
        </Button>
      </form>
    </div>
  );
}
