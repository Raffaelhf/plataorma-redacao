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
  const classroomId = String(body.classroomId || '').trim();
  const sortOrder = Number(body.sortOrder ?? 0);

  if (!title || !classroomId) {
    return NextResponse.json({ error: 'Informe a turma e o titulo do modulo.' }, { status: 400 });
  }

  if (!Number.isFinite(sortOrder) || sortOrder < 0) {
    return NextResponse.json({ error: 'Informe uma ordem valida para o modulo.' }, { status: 400 });
  }

  const [videoModule, classroom] = await Promise.all([
    prisma.videoModule.findUnique({
      where: { id },
      select: { id: true },
    }),
    prisma.videoClassroom.findUnique({
      where: { id: classroomId },
      select: { id: true },
    }),
  ]);

  if (!videoModule) {
    return NextResponse.json({ error: 'Modulo informado nao foi encontrado.' }, { status: 404 });
  }

  if (!classroom) {
    return NextResponse.json({ error: 'Turma informada nao foi encontrada.' }, { status: 404 });
  }

  const [updatedModule] = await prisma.$transaction([
    prisma.videoModule.update({
      where: { id },
      data: {
        title,
        description: description || null,
        sortOrder,
        classroomId,
      },
      include: {
        classroom: true,
      },
    }),
    prisma.videoLesson.updateMany({
      where: { moduleId: id },
      data: { classroomId },
    }),
  ]);

  return NextResponse.json(updatedModule);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const { id } = await params;

  const videoModule = await prisma.videoModule.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!videoModule) {
    return NextResponse.json({ error: 'Modulo informado nao foi encontrado.' }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.videoLesson.deleteMany({ where: { moduleId: id } }),
    prisma.videoModule.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
