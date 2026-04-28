import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { isValidGradeLevel } from '@/lib/grade-levels';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

const validPlans = new Set(['MENSAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL']);

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : undefined;
}

function cleanNullableString(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const clean = value.trim();
  return clean || null;
}

function isUniqueConstraintError(error: unknown) {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'P2002');
}

const userSelect = {
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
      mentoring: true,
      bio: true,
    },
  },
  teacherProfile: {
    select: {
      expertise: true,
      bio: true,
    },
  },
} as const;

export async function PATCH(req: Request, context: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const hasIsActive = typeof body.isActive === 'boolean';
  const nextIsActive = Boolean(body.isActive);
  const name = cleanNullableString(body.name);
  const email = cleanString(body.email);
  const gradeLevel = cleanNullableString(body.gradeLevel);
  const cpf = cleanNullableString(body.cpf);
  const enrollmentNumber = cleanNullableString(body.enrollmentNumber);
  const studentBio = cleanNullableString(body.studentBio);
  const expertise = cleanNullableString(body.expertise);
  const teacherBio = cleanNullableString(body.teacherBio);
  const plan =
    body.plan === null || body.plan === ''
      ? null
      : typeof body.plan === 'string' && validPlans.has(body.plan)
        ? body.plan
        : undefined;
  const hasReadingClub = typeof body.readingClub === 'boolean';
  const hasMentoring = typeof body.mentoring === 'boolean';
  const hasStudentProfileUpdates =
    gradeLevel !== undefined ||
    cpf !== undefined ||
    enrollmentNumber !== undefined ||
    studentBio !== undefined ||
    plan !== undefined ||
    hasReadingClub ||
    hasMentoring;
  const hasTeacherProfileUpdates = expertise !== undefined || teacherBio !== undefined;

  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
    },
  });

  if (!targetUser) {
    return NextResponse.json({ error: 'Usuario nao encontrado.' }, { status: 404 });
  }

  if (targetUser.role === 'ADMIN') {
    return NextResponse.json({ error: 'Nao e permitido alterar outro administrador por esta tela.' }, { status: 400 });
  }

  if (hasIsActive && targetUser.id === session.user.id) {
    return NextResponse.json({ error: 'Voce nao pode desativar a propria conta.' }, { status: 400 });
  }

  if (email !== undefined && !email) {
    return NextResponse.json({ error: 'Informe um e-mail valido.' }, { status: 400 });
  }

  if (hasStudentProfileUpdates && targetUser.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Somente alunos podem ter dados academicos atualizados nesta tela.' }, { status: 400 });
  }

  if (hasTeacherProfileUpdates && targetUser.role !== 'TEACHER') {
    return NextResponse.json({ error: 'Somente professores podem ter especialidade e bio atualizadas nesta tela.' }, { status: 400 });
  }

  if (gradeLevel !== undefined && gradeLevel !== null && !isValidGradeLevel(gradeLevel)) {
    return NextResponse.json({ error: 'Selecione uma serie valida para o aluno.' }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(hasIsActive ? { isActive: nextIsActive } : {}),
        ...(hasStudentProfileUpdates && targetUser.role === 'STUDENT'
          ? {
              studentProfile: {
                upsert: {
                  create: {
                    gradeLevel,
                    cpf,
                    enrollmentNumber,
                    plan,
                    readingClub: hasReadingClub ? body.readingClub : false,
                    mentoring: hasMentoring ? body.mentoring : false,
                    bio: studentBio,
                  },
                  update: {
                    ...(gradeLevel !== undefined ? { gradeLevel } : {}),
                    ...(cpf !== undefined ? { cpf } : {}),
                    ...(enrollmentNumber !== undefined ? { enrollmentNumber } : {}),
                    ...(plan !== undefined ? { plan } : {}),
                    ...(hasReadingClub ? { readingClub: body.readingClub } : {}),
                    ...(hasMentoring ? { mentoring: body.mentoring } : {}),
                    ...(studentBio !== undefined ? { bio: studentBio } : {}),
                  },
                },
              },
            }
          : {}),
        ...(hasTeacherProfileUpdates && targetUser.role === 'TEACHER'
          ? {
              teacherProfile: {
                upsert: {
                  create: {
                    expertise,
                    bio: teacherBio,
                  },
                  update: {
                    ...(expertise !== undefined ? { expertise } : {}),
                    ...(teacherBio !== undefined ? { bio: teacherBio } : {}),
                  },
                },
              },
            }
          : {}),
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ error: 'Ja existe um usuario com este e-mail.' }, { status: 409 });
    }
    throw error;
  }

  const updatedUser = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: userSelect,
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(_req: Request, context: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const { id } = await context.params;
  const targetUser = await prisma.user.findUnique({
    where: { id },
    include: {
      studentProfile: { select: { id: true } },
      teacherProfile: { select: { id: true } },
    },
  });

  if (!targetUser) {
    return NextResponse.json({ error: 'Usuario nao encontrado.' }, { status: 404 });
  }

  if (targetUser.id === session.user.id) {
    return NextResponse.json({ error: 'Voce nao pode excluir a propria conta.' }, { status: 400 });
  }

  if (targetUser.role === 'ADMIN') {
    return NextResponse.json({ error: 'Nao e permitido excluir outro administrador por esta tela.' }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.passwordSetupToken.deleteMany({ where: { userId: targetUser.id } });
    await tx.session.deleteMany({ where: { userId: targetUser.id } });
    await tx.account.deleteMany({ where: { userId: targetUser.id } });
    await tx.registrationSession.updateMany({
      where: { createdUserId: targetUser.id },
      data: { createdUserId: null },
    });

    if (targetUser.studentProfile) {
      const submissions = await tx.submission.findMany({
        where: { studentId: targetUser.studentProfile.id },
        select: { id: true },
      });
      const submissionIds = submissions.map((submission) => submission.id);

      if (submissionIds.length) {
        await tx.correction.deleteMany({ where: { submissionId: { in: submissionIds } } });
        await tx.submission.deleteMany({ where: { id: { in: submissionIds } } });
      }

      await tx.studentProfile.delete({ where: { id: targetUser.studentProfile.id } });
    }

    if (targetUser.teacherProfile) {
      const teacherId = targetUser.teacherProfile.id;
      const activities = await tx.activity.findMany({
        where: { createdById: teacherId },
        select: { id: true },
      });
      const activityIds = activities.map((activity) => activity.id);

      if (activityIds.length) {
        const submissions = await tx.submission.findMany({
          where: { activityId: { in: activityIds } },
          select: { id: true },
        });
        const submissionIds = submissions.map((submission) => submission.id);

        if (submissionIds.length) {
          await tx.correction.deleteMany({ where: { submissionId: { in: submissionIds } } });
          await tx.submission.deleteMany({ where: { id: { in: submissionIds } } });
        }

        await tx.activityAttachment.deleteMany({ where: { activityId: { in: activityIds } } });
        await tx.activity.deleteMany({ where: { id: { in: activityIds } } });
      }

      await tx.correction.deleteMany({ where: { teacherId } });
      await tx.videoCategory.updateMany({ where: { createdById: teacherId }, data: { createdById: null } });
      await tx.videoClassroom.updateMany({ where: { createdById: teacherId }, data: { createdById: null } });
      await tx.videoModule.updateMany({ where: { createdById: teacherId }, data: { createdById: null } });
      await tx.videoLesson.updateMany({ where: { createdById: teacherId }, data: { createdById: null } });
      await tx.liveClass.updateMany({ where: { createdById: teacherId }, data: { createdById: null } });
      await tx.teacherProfile.delete({ where: { id: teacherId } });
    }

    await tx.user.delete({ where: { id: targetUser.id } });
  });

  return NextResponse.json({ id: targetUser.id, deleted: true });
}
