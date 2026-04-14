import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdminRole, isTeacherRole } from '@/lib/roles';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false) {
    return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 });
  }

  const { id } = await context.params;
  const activity = await prisma.activity.findUnique({
    where: { id },
    select: {
      status: true,
      createdById: true,
      attachments: {
        select: {
          id: true,
        },
        orderBy: { createdAt: 'asc' },
        take: 1,
      },
    },
  });

  if (!activity) {
    return NextResponse.json({ error: 'Atividade nao encontrada.' }, { status: 404 });
  }

  const isAdmin = isAdminRole(session.user.role);
  const canAccess =
    isAdmin ||
    (session.user.role === 'STUDENT' && activity.status === 'PUBLISHED') ||
    (isTeacherRole(session.user.role) && activity.createdById === session.user.teacherId);

  if (!canAccess) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }

  const firstAttachment = activity.attachments[0];
  if (!firstAttachment) {
    return NextResponse.json({ error: 'Anexo nao encontrado.' }, { status: 404 });
  }

  return NextResponse.redirect(new URL(`/api/activity-attachments/${firstAttachment.id}`, req.url));
}
