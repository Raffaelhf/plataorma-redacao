import { NextResponse } from 'next/server';
import { getAppUrl } from '@/lib/app-url';
import { getAuthSession } from '@/lib/auth';
import { isMailConfigured, sendPasswordResetEmail } from '@/lib/mail';
import { createPasswordSetupToken } from '@/lib/password-setup';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(_req: Request, context: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const { id } = await context.params;
  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
    },
  });

  if (!targetUser) {
    return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
  }

  const baseUrl = getAppUrl();
  if (!baseUrl) {
    return NextResponse.json(
      { error: 'Não foi possível identificar a URL pública da aplicação para montar o link de redefinição.' },
      { status: 500 },
    );
  }

  const resetLinkBase = `${baseUrl}/definir-senha`;

  try {
    await prisma.passwordSetupToken.deleteMany({ where: { userId: targetUser.id } });
    const { rawToken } = await createPasswordSetupToken(targetUser.id);
    const resetLink = `${resetLinkBase}?token=${rawToken}`;

    await prisma.user.update({
      where: { id: targetUser.id },
      data: { passwordHash: null },
    });

    if (isMailConfigured()) {
      await sendPasswordResetEmail({
        to: targetUser.email,
        name: targetUser.name,
        link: resetLink,
      });

      return NextResponse.json({
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        message: 'E-mail de redefinição enviado com sucesso.',
        resetLink,
        delivery: 'email',
      });
    }

    return NextResponse.json({
      id: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      message: 'SMTP não configurado. Copie o link de redefinição e envie manualmente ao usuário.',
      resetLink,
      delivery: 'manual',
    });
  } catch (error) {
    console.error(error);

    try {
      await prisma.$transaction([
        prisma.passwordSetupToken.deleteMany({ where: { userId: targetUser.id } }),
        prisma.user.update({
          where: { id: targetUser.id },
          data: { passwordHash: targetUser.passwordHash },
        }),
      ]);
    } catch (rollbackError) {
      console.error(rollbackError);
    }

    const message = error instanceof Error ? error.message : 'Não foi possível enviar o e-mail de redefinição de senha.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
