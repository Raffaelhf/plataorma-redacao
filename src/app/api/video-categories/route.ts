import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { isTeacherRole } from '@/lib/roles';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const categories = await prisma.videoCategory.findMany({
    include: {
      lessons: {
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || !isTeacherRole(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const body = await req.json();
  const name = String(body.name || '').trim();
  const description = String(body.description || '').trim();

  if (!name) {
    return NextResponse.json({ error: 'Informe o nome da categoria.' }, { status: 400 });
  }

  const category = await prisma.videoCategory.create({
    data: {
      name,
      description: description || null,
      createdById: session.user.teacherId ?? null,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
