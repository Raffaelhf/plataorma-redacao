import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { getDashboardPathByRole, isTeacherRole } from '@/lib/roles';

const studentOnly = ['/dashboard/aluno', '/envios', '/desempenho'];
const teacherOnly = ['/dashboard/professor', '/correcoes'];
const adminOnly = ['/dashboard/admin', '/admin'];

export default withAuth(
  function proxy(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const path = req.nextUrl.pathname;
    const target = getDashboardPathByRole(role);

    if (studentOnly.some((p) => path.startsWith(p)) && role !== 'STUDENT') {
      return NextResponse.redirect(new URL(target, req.url));
    }

    if (teacherOnly.some((p) => path.startsWith(p)) && !isTeacherRole(role)) {
      return NextResponse.redirect(new URL(target, req.url));
    }

    if (adminOnly.some((p) => path.startsWith(p)) && role !== 'ADMIN') {
      return NextResponse.redirect(new URL(target, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token && token.isActive !== false,
    },
  },
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/atividades/:path*',
    '/envios/:path*',
    '/correcoes/:path*',
    '/desempenho/:path*',
    '/videoaulas/:path*',
    '/ao-vivo/:path*',
    '/perfil/:path*',
    '/admin/:path*',
  ],
};
