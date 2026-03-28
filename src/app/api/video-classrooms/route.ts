import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const classrooms = await prisma.videoClassroom.findMany({
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
  });

  return NextResponse.json(classrooms);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role) || !session.user.teacherId) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

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

  const classroom = await prisma.videoClassroom.create({
    data: {
      name,
      description: description || null,
      sortOrder,
      createdById: session.user.teacherId,
    },
  });

  return NextResponse.json(classroom, { status: 201 });
}
