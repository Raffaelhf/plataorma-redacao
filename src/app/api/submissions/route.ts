import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdminRole, isTeacherRole } from '@/lib/roles';
import { SERVERLESS_SAFE_UPLOAD_BYTES, getServerlessUploadLimitMessage } from '@/lib/upload-limits';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false) {
    return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 });
  }

  const where =
    session.user.role === 'STUDENT'
      ? { studentId: session.user.studentId ?? undefined }
      : isAdminRole(session.user.role)
        ? {}
        : isTeacherRole(session.user.role) && session.user.teacherId
          ? { activity: { createdById: session.user.teacherId } }
          : { id: '__no-submissions__' };

  const submissions = await prisma.submission.findMany({
    where,
    include: {
      activity: true,
      corrections: { include: { teacher: { include: { user: true } } } },
    },
    orderBy: { submittedAt: 'desc' },
  });

  return NextResponse.json(submissions);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Apenas alunos podem enviar.' }, { status: 401 });
  }

  const form = await req.formData();
  const activityId = String(form.get('activityId') || '').trim();
  const contentInput = String(form.get('content') || '').trim();
  const file = form.get('pdf');

  if (!activityId) {
    return NextResponse.json({ error: 'Atividade obrigatoria.' }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Envie a redacao em PDF.' }, { status: 400 });
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'O arquivo deve ser um PDF.' }, { status: 400 });
  }

  if (file.size > SERVERLESS_SAFE_UPLOAD_BYTES) {
    return NextResponse.json({ error: getServerlessUploadLimitMessage('arquivos PDF') }, { status: 400 });
  }

  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    select: {
      id: true,
      status: true,
      createdById: true,
    },
  });

  if (!activity) {
    return NextResponse.json({ error: 'Atividade nao encontrada.' }, { status: 404 });
  }

  if (activity.status !== 'PUBLISHED') {
    return NextResponse.json({ error: 'A atividade ainda nao esta publicada para envio.' }, { status: 400 });
  }

  if (!activity.createdById) {
    return NextResponse.json({ error: 'A atividade nao esta vinculada a um professor.' }, { status: 400 });
  }

  const existingSubmission = await prisma.submission.findFirst({
    where: {
      activityId,
      studentId: session.user.studentId!,
    },
    select: {
      id: true,
      submittedAt: true,
    },
  });

  if (existingSubmission) {
    return NextResponse.json(
      {
        error: `Voce ja enviou esta atividade em ${new Date(existingSubmission.submittedAt).toLocaleString('pt-BR')}.`,
      },
      { status: 409 },
    );
  }

  const pdfBuffer = Buffer.from(await file.arrayBuffer());
  const submissionId = randomUUID();

  const submission = await prisma.submission.create({
    data: {
      id: submissionId,
      activityId,
      content: contentInput || 'Redacao enviada em PDF.',
      pdfUrl: `/api/submissions/${submissionId}/pdf`,
      pdfName: file.name,
      pdfMimeType: file.type,
      pdfData: pdfBuffer,
      status: 'PENDING',
      studentId: session.user.studentId!,
    },
  });

  return NextResponse.json(submission, { status: 201 });
}
