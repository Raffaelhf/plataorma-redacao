import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const modules = await prisma.videoModule.findMany({
    include: {
      classroom: true,
      lessons: {
        include: {
          category: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      },
    },
    orderBy: [{ classroom: { sortOrder: 'asc' } }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return NextResponse.json(modules);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role) || !session.user.teacherId) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const body = await req.json();
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  const classroomId = String(body.classroomId || '').trim();
  const sortOrder = Number(body.sortOrder ?? 0);

  if (!title || !classroomId) {
    return NextResponse.json({ error: 'Informe a turma e o título do módulo.' }, { status: 400 });
  }

  if (!Number.isFinite(sortOrder) || sortOrder < 0) {
    return NextResponse.json({ error: 'Informe uma ordem válida para o módulo.' }, { status: 400 });
  }

  const classroom = await prisma.videoClassroom.findUnique({
    where: { id: classroomId },
    select: { id: true },
  });

  if (!classroom) {
    return NextResponse.json({ error: 'Turma informada não foi encontrada.' }, { status: 404 });
  }

  const videoModule = await prisma.videoModule.create({
    data: {
      title,
      description: description || null,
      sortOrder,
      classroomId,
      createdById: session.user.teacherId,
    },
    include: {
      classroom: true,
    },
  });

  return NextResponse.json(videoModule, { status: 201 });
}
