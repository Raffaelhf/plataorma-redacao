import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcrypt';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';

type ExtendedUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  isActive: boolean;
  studentId?: string;
  teacherId?: string;
};

export const authOptions = {
  adapter: PrismaAdapter(prisma as never),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    signOut: '/sair',
  },
  providers: [
    CredentialsProvider({
      name: 'Credenciais',
      credentials: {
        login: { label: 'Login ou e-mail', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const login = credentials?.login?.trim();
        const password = credentials?.password;

        if (!login || !password) return null;

        const user = await prisma.user.findFirst({
          where: {
            isActive: true,
            OR: [{ email: login }, { name: login }],
          },
          include: { studentProfile: true, teacherProfile: true },
        });

        if (!user?.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          studentId: user.studentProfile?.id,
          teacherId: user.teacherProfile?.id,
        } satisfies ExtendedUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: Record<string, unknown>; user?: unknown }) {
      if (user) {
        const u = user as ExtendedUser;
        token.id = u.id;
        token.role = u.role;
        token.isActive = u.isActive;
        token.studentId = u.studentId;
        token.teacherId = u.teacherId;
        return token;
      }

      if (typeof token.id === 'string') {
        const currentUser = await prisma.user.findUnique({
          where: { id: token.id },
          include: { studentProfile: true, teacherProfile: true },
        });

        if (!currentUser || !currentUser.isActive) {
          token.isActive = false;
          return token;
        }

        token.role = currentUser.role;
        token.isActive = currentUser.isActive;
        token.studentId = currentUser.studentProfile?.id;
        token.teacherId = currentUser.teacherProfile?.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session & { user?: Record<string, unknown> };
      token: Record<string, unknown>;
    }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isActive = token.isActive as boolean | undefined;
        session.user.studentId = token.studentId as string | undefined;
        session.user.teacherId = token.teacherId as string | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getAuthSession = () =>
  getServerSession(authOptions as never) as Promise<Session | null>;
