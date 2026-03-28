import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdminRole, isTeacherRole } from '@/lib/roles';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

function canAccessSubmissionPdf(
  session: NonNullable<Awaited<ReturnType<typeof getAuthSession>>>,
  submission: { studentId: string; activity: { createdById: string | null } },
) {
  if (isAdminRole(session.user.role)) return true;
  if (session.user.role === 'STUDENT') return submission.studentId === session.user.studentId;
  if (isTeacherRole(session.user.role)) return submission.activity.createdById === session.user.teacherId;
  return false;
}

export async function GET(req: Request, context: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false) {
    return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 });
  }

  const { id } = await context.params;
  const submission = await prisma.submission.findUnique({
    where: { id },
    select: {
      studentId: true,
      pdfData: true,
      pdfMimeType: true,
      pdfName: true,
      pdfUrl: true,
      activity: {
        select: {
          createdById: true,
        },
      },
    },
  });

  if (!submission) {
    return NextResponse.json({ error: 'Envio nao encontrado.' }, { status: 404 });
  }

  if (!canAccessSubmissionPdf(session, submission)) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }

  if (submission.pdfData) {
    const safeFileName = (submission.pdfName || 'redacao.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
    const pdfBody = new Uint8Array(submission.pdfData);

    return new NextResponse(pdfBody, {
      headers: {
        'Content-Type': submission.pdfMimeType || 'application/pdf',
        'Content-Disposition': `inline; filename="${safeFileName}"`,
        'Cache-Control': 'private, no-store, max-age=0',
      },
    });
  }

  if (submission.pdfUrl) {
    return NextResponse.redirect(new URL(submission.pdfUrl, req.url));
  }

  return NextResponse.json({ error: 'PDF nao encontrado.' }, { status: 404 });
}
