import { prisma } from '@/lib/prisma';
import { generateEnrollmentNumber } from '@/lib/enrollment-number';

export async function createApprovedUserFromRegistrationSession(sessionId: string) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.registrationSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Sessão de cadastro não encontrada.');
    }

    if (session.createdUserId) {
      return session.createdUserId;
    }

    const existingUser = await tx.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });

    if (existingUser) {
      await tx.registrationSession.update({
        where: { id: session.id },
        data: {
          createdUserId: existingUser.id,
          status: 'APPROVED',
          completedAt: new Date(),
        },
      });

      return existingUser.id;
    }

    const user = await tx.user.create({
      data: {
        name: session.name,
        email: session.email,
        passwordHash: session.passwordHash,
        role: session.role,
        isActive: true,
        emailVerified: new Date(),
        studentProfile:
          session.role === 'STUDENT'
            ? {
                create: {
                  gradeLevel: session.gradeLevel,
                  enrollmentNumber: await generateEnrollmentNumber(tx),
                  plan: session.plan,
                  readingClub: session.readingClub,
                  mentoring: session.mentoring,
                },
              }
            : undefined,
        teacherProfile:
          session.role === 'TEACHER'
            ? {
                create: {
                  expertise: session.expertise,
                },
              }
            : undefined,
      },
      select: { id: true },
    });

    await tx.registrationSession.update({
      where: { id: session.id },
      data: {
        createdUserId: user.id,
        status: 'APPROVED',
        completedAt: new Date(),
      },
    });

    return user.id;
  });
}
