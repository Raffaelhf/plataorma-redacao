import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { getDashboardPathByRole, isTeacherRole } from '@/lib/roles';

const studentOnly = ['/dashboard/aluno', '/envios', '/desempenho'];
const teacherOnly = ['/dashboard/professor', '/correcoes'];
const adminOnly = ['/dashboard/admin', '/admin'];

const corsMethods = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
const corsHeaders = 'Content-Type, Authorization, X-Requested-With';

function getConfiguredAppOrigin() {
  const appUrl = process.env.APP_URL ?? process.env.NEXTAUTH_URL;
  if (!appUrl) return null;

  try {
    return new URL(appUrl).origin;
  } catch {
    return null;
  }
}

function getAllowedOrigins(req: NextRequest) {
  return new Set([getConfiguredAppOrigin(), req.nextUrl.origin].filter(Boolean));
}

function applyCorsHeaders(response: NextResponse, origin: string) {
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', corsMethods);
  response.headers.set('Access-Control-Allow-Headers', corsHeaders);
  response.headers.set('Access-Control-Max-Age', '86400');
  response.headers.append('Vary', 'Origin');
  return response;
}

function handleApiCors(req: NextRequest) {
  const origin = req.headers.get('origin');

  if (!origin) {
    return req.method === 'OPTIONS' ? new NextResponse(null, { status: 204 }) : NextResponse.next();
  }

  if (!getAllowedOrigins(req).has(origin)) {
    return NextResponse.json({ error: 'Origem nao permitida.' }, { status: 403 });
  }

  if (req.method === 'OPTIONS') {
    return applyCorsHeaders(new NextResponse(null, { status: 204 }), origin);
  }

  return applyCorsHeaders(NextResponse.next(), origin);
}

const protectedRoutesProxy = withAuth(
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

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return handleApiCors(req);
  }

  return protectedRoutesProxy(req as NextRequestWithAuth, event);
}

export const config = {
  matcher: [
    '/api/:path*',
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
