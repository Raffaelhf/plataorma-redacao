import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { isAdminRole, isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  const session = await getAuthSession();
  const isStudent = session?.user?.role === 'STUDENT';
  const isAdmin = isAdminRole(session?.user?.role);
  const isTeacher = isTeacherRole(session?.user?.role);

  const activity = await prisma.activity.findFirst({
    where: {
      id,
      ...(isStudent
        ? { status: 'PUBLISHED' }
        : isTeacher && !isAdmin
          ? { createdById: session?.user?.teacherId ?? '__teacher_without_profile__' }
          : {}),
    },
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
  const isAdmin = isAdminRole(session.user.role);
  const currentActivity = await prisma.activity.findUnique({
    where: { id },
    select: { createdById: true, publishedAt: true, status: true },
  });

  if (!currentActivity) {
    return NextResponse.json({ error: 'Atividade nao encontrada' }, { status: 404 });
  }

  if (!isAdmin && currentActivity.createdById !== session.user.teacherId) {
    return NextResponse.json({ error: 'Voce nao pode editar esta atividade.' }, { status: 403 });
  }

  const nextStatus = body.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
  const nextTags = Array.isArray(body.tags) ? body.tags.filter((tag: unknown): tag is string => typeof tag === 'string' && tag.trim().length > 0) : [];
  const activity = await prisma.activity.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      prompt: body.prompt,
      tags: nextTags,
      status: nextStatus,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      publishedAt: nextStatus === 'PUBLISHED' ? currentActivity.publishedAt ?? new Date() : null,
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

  const isAdmin = isAdminRole(session.user.role);
  const currentActivity = await prisma.activity.findUnique({
    where: { id },
    select: { createdById: true },
  });

  if (!currentActivity) {
    return NextResponse.json({ error: 'Atividade nao encontrada' }, { status: 404 });
  }

  if (!isAdmin && currentActivity.createdById !== session.user.teacherId) {
    return NextResponse.json({ error: 'Voce nao pode excluir esta atividade.' }, { status: 403 });
  }

  await prisma.activity.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
