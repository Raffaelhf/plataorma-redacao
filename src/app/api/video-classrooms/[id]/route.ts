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
  const name = String(body.name || '').trim();
  const description = String(body.description || '').trim();
  const sortOrder = Number(body.sortOrder ?? 0);

  if (!name) {
    return NextResponse.json({ error: 'Informe o nome da turma.' }, { status: 400 });
  }

  if (!Number.isFinite(sortOrder) || sortOrder < 0) {
    return NextResponse.json({ error: 'Informe uma ordem valida para a turma.' }, { status: 400 });
  }

  const classroom = await prisma.videoClassroom.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!classroom) {
    return NextResponse.json({ error: 'Turma informada nao foi encontrada.' }, { status: 404 });
  }

  const updatedClassroom = await prisma.videoClassroom.update({
    where: { id },
    data: {
      name,
      description: description || null,
      sortOrder,
    },
  });

  return NextResponse.json(updatedClassroom);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const { id } = await params;

  const classroom = await prisma.videoClassroom.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!classroom) {
    return NextResponse.json({ error: 'Turma informada nao foi encontrada.' }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.videoLesson.deleteMany({ where: { classroomId: id } }),
    prisma.videoModule.deleteMany({ where: { classroomId: id } }),
    prisma.videoClassroom.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
