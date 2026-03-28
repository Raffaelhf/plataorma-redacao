import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      submissions: {
        select: { id: true },
      },
    },
  });

  return NextResponse.json(activities);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role) || !session.user.teacherId) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, prompt, tags = [], dueDate, status = 'DRAFT' } = body;

  const activity = await prisma.activity.create({
    data: {
      title,
      description,
      prompt,
      tags,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdById: session.user.teacherId,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    },
  });

  return NextResponse.json(activity, { status: 201 });
}
