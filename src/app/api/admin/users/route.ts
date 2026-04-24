import { NextResponse } from 'next/server';
import { getAppUrl } from '@/lib/app-url';
import { getAuthSession } from '@/lib/auth';
import { generateEnrollmentNumber } from '@/lib/enrollment-number';
import { sendPasswordSetupEmail } from '@/lib/mail';
import { createPasswordSetupToken } from '@/lib/password-setup';
import { prisma } from '@/lib/prisma';
import { isValidGradeLevel } from '@/lib/grade-levels';

const planMap = {
  mensal: 'MENSAL',
  trimestral: 'TRIMESTRAL',
  semestral: 'SEMESTRAL',
  anual: 'ANUAL',
} as const;

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const body = await req.json();
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const role = body.role === 'TEACHER' ? 'TEACHER' : 'STUDENT';
  const gradeLevel = String(body.gradeLevel || '').trim();
  const cpf = String(body.cpf || '').trim();
  const enrollmentNumber = String(body.enrollmentNumber || '').trim();
  const expertise = String(body.expertise || '').trim();
  const readingClub = Boolean(body.readingClub);
  const mentoring = Boolean(body.mentoring);
  const plan =
    typeof body.plan === 'string' && body.plan in planMap ? planMap[body.plan as keyof typeof planMap] : null;

  if (!name || !email) {
    return NextResponse.json({ error: 'Informe nome e e-mail.' }, { status: 400 });
  }

  if (role === 'STUDENT' && readingClub && !plan) {
    return NextResponse.json({ error: 'Selecione um plano para adicionar o Clube de Leitura.' }, { status: 400 });
  }

  if (role === 'STUDENT' && mentoring && !plan) {
    return NextResponse.json({ error: 'Selecione um plano para adicionar a Mentoria.' }, { status: 400 });
  }

  if (role === 'STUDENT' && gradeLevel && !isValidGradeLevel(gradeLevel)) {
    return NextResponse.json({ error: 'Selecione uma série válida para o aluno.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Já existe um usuário com este e-mail.' }, { status: 409 });
  }

  const generatedEnrollmentNumber =
    role === 'STUDENT' && !enrollmentNumber
      ? await generateEnrollmentNumber(prisma)
      : null;

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
              },
            }
          : undefined,
      teacherProfile:
        role === 'TEACHER'
          ? {
              create: {
                expertise: expertise || null,
              },
            }
          : undefined,
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
          mentoring: true,
        },
      },
    },
  });

  try {
    const { rawToken } = await createPasswordSetupToken(user.id);
    const baseUrl = getAppUrl();

    if (!baseUrl) {
      throw new Error('Não foi possível identificar a URL pública da aplicação para montar o link de definição de senha.');
    }

    await sendPasswordSetupEmail({
      to: email,
      name,
      roleLabel: role === 'TEACHER' ? 'professor' : 'aluno',
      link: `${baseUrl}/definir-senha?token=${rawToken}`,
    });
  } catch (error) {
    console.error(error);

    await prisma.$transaction([
      prisma.passwordSetupToken.deleteMany({ where: { userId: user.id } }),
      prisma.studentProfile.deleteMany({ where: { userId: user.id } }),
      prisma.teacherProfile.deleteMany({ where: { userId: user.id } }),
      prisma.user.delete({ where: { id: user.id } }),
    ]);

    return NextResponse.json({ error: 'Não foi possível enviar o e-mail de definição de senha.' }, { status: 500 });
  }

  return NextResponse.json(user, { status: 201 });
}
