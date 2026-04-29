import { ActivityStatus, PrismaClient, Role, SubmissionStatus } from '../src/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

async function ensureStudentProfile(userId: string) {
  const existing = await prisma.studentProfile.findUnique({ where: { userId } });
  if (existing) {
    return prisma.studentProfile.update({
      where: { userId },
      data: {
        gradeLevel: existing.gradeLevel ?? '3 ano',
        cpf: existing.cpf ?? '12345678900',
        enrollmentNumber: existing.enrollmentNumber ?? '2026-0001',
        plan: existing.plan ?? 'TRIMESTRAL',
        readingClub: existing.readingClub,
        bio: existing.bio ?? 'Conta de demonstração para validar a área do aluno.',
      },
    });
  }

  return prisma.studentProfile.create({
    data: {
      userId,
      gradeLevel: '3 ano',
      cpf: '12345678900',
      enrollmentNumber: '2026-0001',
      plan: 'TRIMESTRAL',
      readingClub: true,
      bio: 'Conta de demonstração para validar a área do aluno.',
    },
  });
}

async function ensureTeacherProfile(userId: string) {
  const existing = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (existing) {
    return prisma.teacherProfile.update({
      where: { userId },
      data: {
        expertise: !existing.expertise || normalizeText(existing.expertise) === 'redacao enem' ? 'Escreva Mais' : existing.expertise,
        bio: existing.bio ?? 'Conta de demonstração para validar a área do professor.',
      },
    });
  }

  return prisma.teacherProfile.create({
    data: {
      userId,
      expertise: 'Escreva Mais',
      bio: 'Conta de demonstração para validar a área do professor.',
    },
  });
}

async function main() {
  const [studentPasswordHash, teacherPasswordHash, adminPasswordHash] = await Promise.all([
    bcrypt.hash('123', 10),
    bcrypt.hash('1234', 10),
    bcrypt.hash('Raffael1@', 10),
  ]);

  const studentUser = await prisma.user.upsert({
    where: { email: 'adminaluno' },
    update: {
      name: 'adminaluno',
      role: Role.STUDENT,
      passwordHash: studentPasswordHash,
      isActive: true,
    },
    create: {
      name: 'adminaluno',
      email: 'adminaluno',
      role: Role.STUDENT,
      passwordHash: studentPasswordHash,
      isActive: true,
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: 'adminprof' },
    update: {
      name: 'adminprof',
      role: Role.TEACHER,
      passwordHash: teacherPasswordHash,
      isActive: true,
    },
    create: {
      name: 'adminprof',
      email: 'adminprof',
      role: Role.TEACHER,
      passwordHash: teacherPasswordHash,
      isActive: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'Raffaeladmin' },
    update: {
      name: 'Raffaeladmin',
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
      isActive: true,
    },
    create: {
      name: 'Raffaeladmin',
      email: 'Raffaeladmin',
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
      isActive: true,
    },
  });

  const [studentProfile, teacherProfile, adminTeacherProfile] = await Promise.all([
    ensureStudentProfile(studentUser.id),
    ensureTeacherProfile(teacherUser.id),
    ensureTeacherProfile(adminUser.id),
  ]);

  await prisma.platformSettings.upsert({
    where: { id: 'platform' },
    update: {
      bankRecipientName: 'Escreva Mais',
      bankDocument: '00.000.000/0001-00',
      bankName: 'Banco Exemplo',
      bankAgency: '0001',
      bankAccount: '12345-6',
      pixKey: 'financeiro@escrevamais.com',
      whatsappNumber: '5511999999999',
      paymentNotes: 'Use esses dados para repasses e contatos operacionais da plataforma.',
    },
    create: {
      id: 'platform',
      bankRecipientName: 'Escreva Mais',
      bankDocument: '00.000.000/0001-00',
      bankName: 'Banco Exemplo',
      bankAgency: '0001',
      bankAccount: '12345-6',
      pixKey: 'financeiro@escrevamais.com',
      whatsappNumber: '5511999999999',
      paymentNotes: 'Use esses dados para repasses e contatos operacionais da plataforma.',
    },
  });

  const publishedActivity =
    (await prisma.activity.findFirst({
      where: { title: 'Redacao: Tecnologia e Sociedade', createdById: teacherProfile.id },
    })) ??
    (await prisma.activity.create({
      data: {
        title: 'Redacao: Tecnologia e Sociedade',
        description: 'Produza um texto dissertativo-argumentativo sobre os impactos da IA.',
        prompt: 'Debata como a inteligencia artificial pode transformar trabalho e educacao com exemplos concretos.',
        tags: ['IA', 'Sociedade', 'Tecnologia'],
        status: ActivityStatus.PUBLISHED,
        publishedAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdById: teacherProfile.id,
      },
    }));

  const pendingActivity =
    (await prisma.activity.findFirst({
      where: { title: 'Cidadania digital e desinformacao', createdById: teacherProfile.id },
    })) ??
    (await prisma.activity.create({
      data: {
        title: 'Cidadania digital e desinformacao',
        description: 'Discuta o papel da escola e das plataformas no combate a desinformacao.',
        prompt: 'Construa um texto com tese, argumentos e proposta de intervencao.',
        tags: ['Midia', 'Educacao'],
        status: ActivityStatus.PUBLISHED,
        publishedAt: new Date(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdById: teacherProfile.id,
      },
    }));

  const gradedSubmission =
    (await prisma.submission.findFirst({
      where: { studentId: studentProfile.id, activityId: publishedActivity.id, status: SubmissionStatus.GRADED },
    })) ??
    (await prisma.submission.create({
      data: {
        studentId: studentProfile.id,
        activityId: publishedActivity.id,
        content:
          'A inteligencia artificial redefine processos produtivos e exige requalificacao constante, mas tambem amplia desigualdades quando o acesso a tecnologia e limitado.',
        status: SubmissionStatus.GRADED,
        grade: 840,
        feedback: 'Boa argumentacao; aprofunde a proposta de intervencao e a coesao entre paragrafos.',
      },
    }));

  const correctionExists = await prisma.correction.findFirst({
    where: { submissionId: gradedSubmission.id, teacherId: teacherProfile.id },
  });

  if (!correctionExists) {
    await prisma.correction.create({
      data: {
        submissionId: gradedSubmission.id,
        teacherId: teacherProfile.id,
        comments: 'Boa argumentacao; aprofunde a proposta de intervencao e a coesao entre paragrafos.',
        score: 840,
        strengths: ['Tese clara', 'Exemplos atuais'],
        improvements: ['Conclusao mais propositiva', 'Coesao textual'],
      },
    });
  }

  const pendingSubmissionExists = await prisma.submission.findFirst({
    where: { studentId: studentProfile.id, activityId: pendingActivity.id, status: SubmissionStatus.UNDER_REVIEW },
  });

  if (!pendingSubmissionExists) {
    await prisma.submission.create({
      data: {
        studentId: studentProfile.id,
        activityId: pendingActivity.id,
        content: 'A educacao midiatica e essencial para formar leitores criticos em ambientes digitais.',
        status: SubmissionStatus.UNDER_REVIEW,
      },
    });
  }

  const adminDraftActivity = await prisma.activity.findFirst({
    where: { title: 'Painel administrativo: auditoria de cadastros', createdById: adminTeacherProfile.id },
  });

  if (!adminDraftActivity) {
    await prisma.activity.create({
      data: {
        title: 'Painel administrativo: auditoria de cadastros',
        description: 'Atividade interna para validar rotinas administrativas da plataforma.',
        prompt: 'Revise processos de cadastro, comunicação e repasses financeiros.',
        tags: ['Administracao', 'Auditoria'],
        status: ActivityStatus.DRAFT,
        createdById: adminTeacherProfile.id,
      },
    });
  }

  const videoCategory =
    (await prisma.videoCategory.findFirst({
      where: { name: 'Estrutura dissertativa', createdById: adminTeacherProfile.id },
    })) ??
    (await prisma.videoCategory.create({
      data: {
        name: 'Estrutura dissertativa',
        description: 'Base para introducao, desenvolvimento e conclusao.',
        createdById: adminTeacherProfile.id,
      },
    }));

  const videoClassroom =
    (await prisma.videoClassroom.findFirst({
      where: { name: 'Turma extensiva 2026', createdById: adminTeacherProfile.id },
    })) ??
    (await prisma.videoClassroom.create({
      data: {
        name: 'Turma extensiva 2026',
        description: 'Programa anual organizado em modulos para acompanhar a evolucao do aluno.',
        sortOrder: 1,
        createdById: adminTeacherProfile.id,
      },
    }));

  const fundamentalsModule =
    (await prisma.videoModule.findFirst({
      where: { title: 'Modulo 1 - Fundamentos', classroomId: videoClassroom.id, createdById: adminTeacherProfile.id },
    })) ??
    (await prisma.videoModule.create({
      data: {
        title: 'Modulo 1 - Fundamentos',
        description: 'Organizacao inicial da redacao e leitura do tema.',
        sortOrder: 1,
        classroomId: videoClassroom.id,
        createdById: adminTeacherProfile.id,
      },
    }));

  const introLessonExists = await prisma.videoLesson.findFirst({
    where: { title: 'Como montar uma introducao forte', moduleId: fundamentalsModule.id, createdById: adminTeacherProfile.id },
  });

  if (!introLessonExists) {
    await prisma.videoLesson.create({
      data: {
        title: 'Como montar uma introducao forte',
        description: 'Passo a passo para contextualizar o tema, apresentar a tese e preparar o desenvolvimento.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        sortOrder: 1,
        categoryId: videoCategory.id,
        classroomId: videoClassroom.id,
        moduleId: fundamentalsModule.id,
        createdById: adminTeacherProfile.id,
      },
    });
  }

  console.log('Seed executado com sucesso com usuários de teste: adminaluno / 123, adminprof / 1234 e Raffaeladmin / Raffael1@');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
