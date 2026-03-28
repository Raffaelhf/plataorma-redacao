import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

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
