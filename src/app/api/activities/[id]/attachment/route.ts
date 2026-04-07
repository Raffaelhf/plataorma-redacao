import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
      attachmentData: true,
      attachmentMimeType: true,
      attachmentName: true,
      attachmentUrl: true,
    },
  });

  if (!activity) {
    return NextResponse.json({ error: 'Atividade nao encontrada.' }, { status: 404 });
  }

  if (activity.attachmentData) {
    const safeFileName = (activity.attachmentName || 'anexo').replace(/[^a-zA-Z0-9._-]/g, '_');
    const attachmentBody = new Uint8Array(activity.attachmentData);

    return new NextResponse(attachmentBody, {
      headers: {
        'Content-Type': activity.attachmentMimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${safeFileName}"`,
        'Cache-Control': 'private, no-store, max-age=0',
      },
    });
  }

  if (activity.attachmentUrl) {
    return NextResponse.redirect(new URL(activity.attachmentUrl, req.url));
  }

  return NextResponse.json({ error: 'Anexo nao encontrado.' }, { status: 404 });
}
