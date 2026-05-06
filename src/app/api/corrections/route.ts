import { NextResponse } from 'next/server';
import { SubmissionStatus } from '@/generated/prisma';
import { getAuthSession } from '@/lib/auth';
import { isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

const pendingCorrectionStatuses = [SubmissionStatus.PENDING, SubmissionStatus.UNDER_REVIEW];

export const runtime = 'nodejs';

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || (!isTeacherRole(session.user.role) && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 });
  }

  const count = await prisma.submission.count({
    where: {
      status: {
        in: pendingCorrectionStatuses,
      },
      ...(isTeacherRole(session.user.role)
        ? {
            activity: {
              createdById: session.user.teacherId ?? '__no-teacher__',
            },
          }
        : {}),
    },
  });

  return NextResponse.json({ pending: count });
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role) || !session.user.teacherId) {
    return NextResponse.json({ error: 'Apenas professores podem corrigir' }, { status: 401 });
  }

  const { submissionId, comments, score, strengths = [], improvements = [] } = await req.json();

  const correction = await prisma.correction.create({
    data: {
      submissionId,
      teacherId: session.user.teacherId!,
      comments,
      score,
      strengths,
      improvements,
    },
  });

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: 'GRADED',
      grade: score,
      feedback: comments,
    },
  });

  return NextResponse.json(correction, { status: 201 });
}
