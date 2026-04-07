import { prisma } from './prisma';

export async function ensureTeacherProfile(userId: string) {
  return prisma.teacherProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: { id: true },
  });
}
