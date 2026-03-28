import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  const videoUrl = String(body.videoUrl || '').trim();
  const sortOrder = Number(body.sortOrder ?? 0);
  const categoryId = body.categoryId ? String(body.categoryId) : null;
  const classroomId = body.classroomId ? String(body.classroomId) : null;
  const moduleId = body.moduleId ? String(body.moduleId) : null;

  if (!title || !description || !videoUrl) {
    return NextResponse.json({ error: 'Preencha titulo, descricao e link da videoaula.' }, { status: 400 });
  }

  if (!Number.isFinite(sortOrder) || sortOrder < 0) {
    return NextResponse.json({ error: 'Informe uma ordem valida para a videoaula.' }, { status: 400 });
  }

  if (moduleId && !classroomId) {
    return NextResponse.json({ error: 'Selecione a turma do modulo antes de salvar a videoaula.' }, { status: 400 });
  }

  const lesson = await prisma.videoLesson.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!lesson) {
    return NextResponse.json({ error: 'Videoaula informada nao foi encontrada.' }, { status: 404 });
  }

  if (classroomId) {
    const classroom = await prisma.videoClassroom.findUnique({
      where: { id: classroomId },
      select: { id: true },
    });

    if (!classroom) {
      return NextResponse.json({ error: 'Turma informada nao foi encontrada.' }, { status: 404 });
    }
  }

  if (categoryId) {
    const category = await prisma.videoCategory.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json({ error: 'Categoria informada nao foi encontrada.' }, { status: 404 });
    }
  }

  if (moduleId) {
    const selectedModule = await prisma.videoModule.findUnique({
      where: { id: moduleId },
      select: { id: true, classroomId: true },
    });

    if (!selectedModule) {
      return NextResponse.json({ error: 'Modulo informado nao foi encontrado.' }, { status: 404 });
    }

    if (selectedModule.classroomId !== classroomId) {
      return NextResponse.json({ error: 'O modulo selecionado nao pertence a turma escolhida.' }, { status: 400 });
    }
  }

  const updatedLesson = await prisma.videoLesson.update({
    where: { id },
    data: {
      title,
      description,
      videoUrl,
      sortOrder,
      categoryId,
      classroomId,
      moduleId,
    },
    include: {
      category: true,
      classroom: true,
      module: true,
    },
  });

  return NextResponse.json(updatedLesson);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const { id } = await params;

  const lesson = await prisma.videoLesson.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!lesson) {
    return NextResponse.json({ error: 'Videoaula informada nao foi encontrada.' }, { status: 404 });
  }

  await prisma.videoLesson.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
