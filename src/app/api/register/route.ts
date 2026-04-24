import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { calculateStudentCheckoutAmount, getStudentPlanFromSlug } from '@/lib/plans';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, password, plan, readingClub = false, mentoring = false } = await req.json();
    const normalizedRole = 'STUDENT';
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPlan = getStudentPlanFromSlug(typeof plan === 'string' ? plan : null);
    const normalizedReadingClub = Boolean(readingClub);
    const normalizedMentoring = Boolean(mentoring);
    const normalizedName = String(name || '').trim();

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    if (normalizedReadingClub && !normalizedPlan) {
      return NextResponse.json({ error: 'Selecione um plano para adicionar o Clube de Leitura.' }, { status: 400 });
    }

    if (normalizedMentoring && !normalizedPlan) {
      return NextResponse.json({ error: 'Selecione um plano para adicionar a Mentoria.' }, { status: 400 });
    }

    if (!normalizedPlan) {
      return NextResponse.json({ error: 'Selecione um plano para seguir para o pagamento.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (!normalizedPlan) {
      return NextResponse.json({ error: 'Plano do aluno não identificado para o checkout.' }, { status: 400 });
    }

    const studentPlan = normalizedPlan;

    await prisma.registrationSession.updateMany({
      where: {
        email: normalizedEmail,
        status: {
          in: ['DRAFT', 'CHECKOUT_PENDING', 'PAYMENT_PENDING', 'FAILED'],
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    const session = await prisma.registrationSession.create({
      data: {
        publicToken: randomUUID(),
        name: normalizedName,
        email: normalizedEmail,
        passwordHash,
        role: normalizedRole,
        plan: studentPlan,
        readingClub: normalizedReadingClub,
        mentoring: normalizedMentoring,
        amountInCents: await calculateStudentCheckoutAmount(studentPlan, normalizedReadingClub, normalizedMentoring),
        status: 'CHECKOUT_PENDING',
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      select: {
        publicToken: true,
      },
    });

    return NextResponse.json({ redirectTo: `/checkout/${session.publicToken}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao registrar.' }, { status: 500 });
  }
}
