import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const lessons = await prisma.videoLesson.findMany({
    include: {
      category: true,
      classroom: true,
      module: true,
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return NextResponse.json(lessons);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const body = await req.json();
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  const videoUrl = String(body.videoUrl || '').trim();
  const sortOrder = Number(body.sortOrder ?? 0);
  const categoryId = body.categoryId ? String(body.categoryId) : null;
  const classroomId = body.classroomId ? String(body.classroomId) : null;
  const moduleId = body.moduleId ? String(body.moduleId) : null;

  if (!title || !description || !videoUrl) {
    return NextResponse.json({ error: 'Preencha título, descrição e link da videoaula.' }, { status: 400 });
  }

  if (!Number.isFinite(sortOrder) || sortOrder < 0) {
    return NextResponse.json({ error: 'Informe uma ordem válida para a videoaula.' }, { status: 400 });
  }

  if (moduleId && !classroomId) {
    return NextResponse.json({ error: 'Selecione a turma do módulo antes de salvar a videoaula.' }, { status: 400 });
  }

  if (classroomId) {
    const classroom = await prisma.videoClassroom.findUnique({
      where: { id: classroomId },
      select: { id: true },
    });

    if (!classroom) {
      return NextResponse.json({ error: 'Turma informada não foi encontrada.' }, { status: 404 });
    }
  }

  if (categoryId) {
    const category = await prisma.videoCategory.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json({ error: 'Categoria informada não foi encontrada.' }, { status: 404 });
    }
  }

  if (moduleId) {
    const selectedModule = await prisma.videoModule.findUnique({
      where: { id: moduleId },
      select: { id: true, classroomId: true },
    });

    if (!selectedModule) {
      return NextResponse.json({ error: 'Módulo informado não foi encontrado.' }, { status: 404 });
    }

    if (selectedModule.classroomId !== classroomId) {
      return NextResponse.json({ error: 'O módulo selecionado não pertence à turma escolhida.' }, { status: 400 });
    }
  }

  const lesson = await prisma.videoLesson.create({
    data: {
      title,
      description,
      videoUrl,
      sortOrder,
      categoryId,
      classroomId,
      moduleId,
      createdById: session.user.teacherId ?? null,
    },
    include: {
      category: true,
      classroom: true,
      module: true,
    },
  });

  return NextResponse.json(lesson, { status: 201 });
}
