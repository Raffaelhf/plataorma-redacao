import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      submissions: {
        include: {
          student: { include: { user: true } },
          corrections: { include: { teacher: { include: { user: true } } } },
        },
      },
    },
  });

  if (!activity) {
    return NextResponse.json({ error: 'Atividade não encontrada' }, { status: 404 });
  }

  return NextResponse.json(activity);
}

export async function PUT(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const body = await req.json();
  const activity = await prisma.activity.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      prompt: body.prompt,
      tags: body.tags,
      status: body.status,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
    },
  });

  return NextResponse.json(activity);
}

export async function DELETE(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  await prisma.activity.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
