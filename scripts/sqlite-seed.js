/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const prisma = new PrismaClient();

const statements = [
  'PRAGMA foreign_keys = ON',
  `CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    passwordHash TEXT,
    role TEXT DEFAULT 'STUDENT',
    image TEXT,
    emailVerified DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS StudentProfile (
    id TEXT PRIMARY KEY,
    userId TEXT UNIQUE,
    gradeLevel TEXT,
    bio TEXT,
    avatarUrl TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS TeacherProfile (
    id TEXT PRIMARY KEY,
    userId TEXT UNIQUE,
    expertise TEXT,
    bio TEXT,
    avatarUrl TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS Activity (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    prompt TEXT NOT NULL,
    tags TEXT DEFAULT '[]',
    status TEXT DEFAULT 'DRAFT',
    publishedAt DATETIME,
    dueDate DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdById TEXT,
    FOREIGN KEY (createdById) REFERENCES TeacherProfile(id)
  )`,
  `CREATE TABLE IF NOT EXISTS Submission (
    id TEXT PRIMARY KEY,
    studentId TEXT NOT NULL,
    activityId TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    grade INTEGER,
    feedback TEXT,
    FOREIGN KEY (studentId) REFERENCES StudentProfile(id) ON DELETE CASCADE,
    FOREIGN KEY (activityId) REFERENCES Activity(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS Correction (
    id TEXT PRIMARY KEY,
    submissionId TEXT NOT NULL,
    teacherId TEXT NOT NULL,
    comments TEXT,
    score INTEGER,
    strengths TEXT DEFAULT '[]',
    improvements TEXT DEFAULT '[]',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submissionId) REFERENCES Submission(id) ON DELETE CASCADE,
    FOREIGN KEY (teacherId) REFERENCES TeacherProfile(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS Account (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    providerAccountId TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, providerAccountId),
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS Session (
    id TEXT PRIMARY KEY,
    sessionToken TEXT UNIQUE,
    userId TEXT NOT NULL,
    expires DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS VerificationToken (
    identifier TEXT,
    token TEXT UNIQUE,
    expires DATETIME NOT NULL,
    PRIMARY KEY (identifier, token)
  )`,
];

async function main() {
  for (const stmt of statements) {
    await prisma.$executeRawUnsafe(stmt);
  }

  const count = await prisma.user.count();
  const passwordHash = await bcrypt.hash('senha123', 10);

  if (count === 0) {
    await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: 'Prof. Ana Martins',
        email: 'ana@plataforma.com',
        role: 'TEACHER',
        passwordHash,
        teacherProfile: {
          create: { expertise: 'Redação ENEM', bio: 'Apaixonada por ensinar escrita crítica e criativa.' },
        },
      },
    });

    await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: 'Lucas Souza',
        email: 'lucas@aluno.com',
        role: 'STUDENT',
        passwordHash,
        studentProfile: { create: { gradeLevel: '3º ano', bio: 'Estudante focado em melhorar argumentação.' } },
      },
    });
  }

  const teacherProfile = await prisma.teacherProfile.findFirst();
  const studentProfile = await prisma.studentProfile.findFirst();

  const activity = await prisma.activity.upsert({
    where: { id: 'seed-activity' },
    update: {},
    create: {
      id: 'seed-activity',
      title: 'Redação: Tecnologia e Sociedade',
      description: 'Produza um texto dissertativo-argumentativo sobre os impactos da IA.',
      prompt:
        'Debata como a inteligência artificial pode transformar relações de trabalho e educação. Traga exemplos concretos.',
      tags: JSON.stringify(['IA', 'Sociedade', 'Tecnologia']),
      status: 'PUBLISHED',
      publishedAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdById: teacherProfile?.id ?? null,
    },
  });

  await prisma.submission.upsert({
    where: { id: 'seed-submission' },
    update: {},
    create: {
      id: 'seed-submission',
      content:
        'A IA redefine processos produtivos e demanda requalificação constante. Contudo, amplia desigualdades quando acesso é limitado.',
      studentId: studentProfile?.id ?? '',
      activityId: activity.id,
      status: 'UNDER_REVIEW',
    },
  });

  console.log('SQLite tables created and seed loaded.');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
require('dotenv').config();
