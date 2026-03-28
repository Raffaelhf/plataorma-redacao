import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const hasIsActive = typeof body.isActive === 'boolean';
  const nextIsActive = Boolean(body.isActive);
  const gradeLevel = typeof body.gradeLevel === 'string' ? body.gradeLevel.trim() : undefined;
  const cpf = typeof body.cpf === 'string' ? body.cpf.trim() : undefined;
  const enrollmentNumber = typeof body.enrollmentNumber === 'string' ? body.enrollmentNumber.trim() : undefined;
  const hasStudentProfileUpdates = gradeLevel !== undefined || cpf !== undefined || enrollmentNumber !== undefined;

  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      role: true,
      isActive: true,
      name: true,
      email: true,
    },
  });

  if (!targetUser) {
    return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
  }

  if (hasIsActive && targetUser.role === 'ADMIN') {
    return NextResponse.json({ error: 'Não é permitido alterar outro administrador por esta tela.' }, { status: 400 });
  }

  if (hasIsActive && targetUser.id === session.user.id) {
    return NextResponse.json({ error: 'Você não pode desativar a própria conta.' }, { status: 400 });
  }

  if (hasStudentProfileUpdates && targetUser.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Somente alunos podem ter CPF, matrícula e série atualizados nesta tela.' }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(hasIsActive ? { isActive: nextIsActive } : {}),
      ...(hasStudentProfileUpdates && targetUser.role === 'STUDENT'
        ? {
            studentProfile: {
              upsert: {
                create: {
                  gradeLevel: gradeLevel || null,
                  cpf: cpf || null,
                  enrollmentNumber: enrollmentNumber || null,
                },
                update: {
                  ...(gradeLevel !== undefined ? { gradeLevel: gradeLevel || null } : {}),
                  ...(cpf !== undefined ? { cpf: cpf || null } : {}),
                  ...(enrollmentNumber !== undefined ? { enrollmentNumber: enrollmentNumber || null } : {}),
                },
              },
            },
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      studentProfile: {
        select: {
          gradeLevel: true,
          cpf: true,
          enrollmentNumber: true,
          plan: true,
          readingClub: true,
        },
      },
    },
  });

  return NextResponse.json(updatedUser);
}
