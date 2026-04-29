import { NextResponse } from 'next/server';
import { getAppUrl } from '@/lib/app-url';
import { getAuthSession } from '@/lib/auth';
import { generateEnrollmentNumber } from '@/lib/enrollment-number';
import { isMailConfigured, sendPasswordSetupEmail } from '@/lib/mail';
import { createPasswordSetupToken } from '@/lib/password-setup';
import { prisma } from '@/lib/prisma';
import { isValidGradeLevel } from '@/lib/grade-levels';
import type { StudentPlan } from '@/generated/prisma';

const planValues = ['MENSAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'] as const;
const validPlans = new Set<string>(planValues);

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

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizePlan(value: unknown): StudentPlan | null {
  if (typeof value !== 'string') return null;
  const plan = value.trim().toUpperCase();
  return validPlans.has(plan) ? (plan as StudentPlan) : null;
}

function isUniqueConstraintError(error: unknown) {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'P2002');
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const body = await req.json();
  const name = cleanString(body.name);
  const email = cleanString(body.email).toLowerCase();
  const role = body.role === 'TEACHER' ? 'TEACHER' : 'STUDENT';
  const gradeLevel = cleanString(body.gradeLevel);
  const cpf = cleanString(body.cpf);
  const enrollmentNumber = cleanString(body.enrollmentNumber);
  const expertise = cleanString(body.expertise);
  const studentBio = cleanString(body.studentBio);
  const teacherBio = cleanString(body.teacherBio);
  const readingClub = Boolean(body.readingClub);
  const mentoring = Boolean(body.mentoring);
  const plan = normalizePlan(body.plan);

  if (!name || !email) {
    return NextResponse.json({ error: 'Informe nome e e-mail.' }, { status: 400 });
  }

  if (role === 'STUDENT' && gradeLevel && !isValidGradeLevel(gradeLevel)) {
    return NextResponse.json({ error: 'Selecione uma serie valida para o aluno.' }, { status: 400 });
  }

  const generatedEnrollmentNumber =
    role === 'STUDENT' && !enrollmentNumber ? await generateEnrollmentNumber(prisma) : null;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        passwordHash: null,
        studentProfile:
          role === 'STUDENT'
            ? {
                create: {
                  gradeLevel: gradeLevel || null,
                  cpf: cpf || null,
                  enrollmentNumber: enrollmentNumber || generatedEnrollmentNumber,
                  plan,
                  readingClub,
                  mentoring,
                  bio: studentBio || null,
                },
              }
            : undefined,
        teacherProfile:
          role === 'TEACHER'
            ? {
                create: {
                  expertise: expertise || null,
                  bio: teacherBio || null,
                },
              }
            : undefined,
      },
      select: userSelect,
    });

    const baseUrl = getAppUrl();
    if (!baseUrl) {
      return NextResponse.json(
        {
          ...user,
          message: 'Usuario criado. Configure a URL publica da aplicacao para gerar links de senha.',
          delivery: 'manual',
        },
        { status: 201 },
      );
    }

    try {
      const { rawToken } = await createPasswordSetupToken(user.id);
      const resetLink = `${baseUrl}/definir-senha?token=${rawToken}`;

      if (isMailConfigured()) {
        await sendPasswordSetupEmail({
          to: email,
          name,
          roleLabel: role === 'TEACHER' ? 'professor' : 'aluno',
          link: resetLink,
        });

        return NextResponse.json(
          { ...user, message: 'E-mail de definicao de senha enviado.', delivery: 'email' },
          { status: 201 },
        );
      }

      return NextResponse.json(
        {
          ...user,
          message: 'SMTP nao configurado. Copie o link de definicao de senha e envie manualmente ao usuario.',
          resetLink,
          delivery: 'manual',
        },
        { status: 201 },
      );
    } catch (error) {
      console.error(error);

      return NextResponse.json(
        {
          ...user,
          message: 'Usuario criado, mas o envio do convite falhou. Use reset de senha no menu de acoes.',
          delivery: 'manual',
        },
        { status: 201 },
      );
    }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ error: 'Ja existe um usuario com este e-mail.' }, { status: 409 });
    }

    console.error(error);
    return NextResponse.json({ error: 'Nao foi possivel criar o usuario.' }, { status: 500 });
  }
}
