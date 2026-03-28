import { createHash, randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';

const PASSWORD_SETUP_TTL_HOURS = 48;

export function hashPasswordSetupToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createPasswordSetupToken(userId: string) {
  const rawToken = randomBytes(32).toString('hex');
  const tokenHash = hashPasswordSetupToken(rawToken);
  const expiresAt = new Date(Date.now() + PASSWORD_SETUP_TTL_HOURS * 60 * 60 * 1000);

  await prisma.passwordSetupToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return { rawToken, expiresAt };
}
