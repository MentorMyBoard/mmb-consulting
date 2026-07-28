/**
 * Middleware — HTTP Basic Auth for everything under /admin.
 *
 * This is intentionally simple: a single ADMIN_USERNAME + ADMIN_PASSWORD
 * pair stored in env vars. For multi-user / role-based access, swap this
 * for NextAuth.js or Clerk.
 */
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/admin', '/api/admin'];

export function proxy(req: NextRequest) {
  if (!PROTECTED_PREFIXES.some((prefix) => req.nextUrl.pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return new NextResponse('Admin disabled — set ADMIN_USERNAME and ADMIN_PASSWORD env vars.', { status: 503 });
  }

  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) {
    return new NextResponse('Authentication required.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"' },
    });
  }

  try {
    const decoded = atob(auth.slice(6));
    const [user, ...passParts] = decoded.split(':');
    const pass = passParts.join(':');

    if (user === expectedUser && pass === expectedPass) return NextResponse.next();
  } catch {
    // fall through
  }

  return new NextResponse('Invalid credentials.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
