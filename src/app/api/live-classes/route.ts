import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const liveClasses = await prisma.liveClass.findMany({
    orderBy: { scheduledAt: 'asc' },
  });

  return NextResponse.json(liveClasses);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role) || !session.user.teacherId) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const body = await req.json();
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  const scheduledAt = String(body.scheduledAt || '').trim();
  const meetingUrl = String(body.meetingUrl || '').trim();

  if (!title || !description || !scheduledAt) {
    return NextResponse.json({ error: 'Preencha título, descrição e data da aula ao vivo.' }, { status: 400 });
  }

  const liveClass = await prisma.liveClass.create({
    data: {
      title,
      description,
      scheduledAt: new Date(scheduledAt),
      meetingUrl: meetingUrl || null,
      createdById: session.user.teacherId,
    },
  });

  return NextResponse.json(liveClass, { status: 201 });
}
