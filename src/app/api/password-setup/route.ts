import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPasswordSetupToken } from '@/lib/password-setup';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = String(body.token || '').trim();
    const password = String(body.password || '');

    if (!token || !password) {
      return NextResponse.json({ error: 'Token e nova senha são obrigatórios.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 });
    }

    const tokenHash = hashPasswordSetupToken(token);
    const setupToken = await prisma.passwordSetupToken.findUnique({
      where: { tokenHash },
    });

    if (!setupToken || setupToken.usedAt || setupToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Este link de definição de senha é inválido ou expirou.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: setupToken.userId },
        data: {
          passwordHash,
          emailVerified: new Date(),
        },
      }),
      prisma.passwordSetupToken.update({
        where: { id: setupToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Não foi possível definir a senha.' }, { status: 500 });
  }
}
