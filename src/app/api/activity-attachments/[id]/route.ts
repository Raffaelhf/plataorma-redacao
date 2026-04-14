import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdminRole, isTeacherRole } from '@/lib/roles';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false) {
    return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 });
  }

  const { id } = await context.params;
  const attachment = await prisma.activityAttachment.findUnique({
    where: { id },
    select: {
      fileData: true,
      fileName: true,
      mimeType: true,
      activity: {
        select: {
          status: true,
          createdById: true,
        },
      },
    },
  });

  if (!attachment) {
    return NextResponse.json({ error: 'Material de apoio nao encontrado.' }, { status: 404 });
  }

  const isAdmin = isAdminRole(session.user.role);
  const canAccess =
    isAdmin ||
    (session.user.role === 'STUDENT' && attachment.activity.status === 'PUBLISHED') ||
    (isTeacherRole(session.user.role) && attachment.activity.createdById === session.user.teacherId);

  if (!canAccess) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }

  const safeFileName = (attachment.fileName || 'material-apoio').replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileBody = new Uint8Array(attachment.fileData);

  return new NextResponse(fileBody, {
    headers: {
      'Content-Type': attachment.mimeType || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${safeFileName}"`,
      'Cache-Control': 'private, no-store, max-age=0',
    },
  });
}
