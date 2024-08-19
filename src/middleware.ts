import { type NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)'
  ]
};

export async function middleware(req: NextRequest) {
  if (req.cookies.has('authjs.session-token')) {
    return NextResponse.next();
  }

  const signInUrl = new URL(
    `/login?callback=${encodeURIComponent(req.url)}`,
    new URL(req.url).origin
  );

  return NextResponse.redirect(signInUrl);
}
