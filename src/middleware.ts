import { getSessionCookie } from 'better-auth/cookies'
import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/app']

export async function middleware(req: NextRequest) {
  const { nextUrl } = req
  const sessionCookie = getSessionCookie(req)

  const res = NextResponse.next()

  const isLoggedIn = !!sessionCookie
  const isOnProtectedRoute = nextUrl.pathname.includes('app')
  const isOnAuthRoute = nextUrl.pathname.startsWith('/auth')

  if (isOnProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url))
  }

  if (isOnAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/app', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
