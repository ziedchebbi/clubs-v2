// ════════════════════════════════════════
// FILE: middleware.ts
// ════════════════════════════════════════
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('better-auth.session-token')

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/clubs/new', '/admin/:path*'],
}
