import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSession } from './features/auth/session'

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard']

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/sign-in', '/sign-up']

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname
	const session = await getSession()

	// If trying to access auth routes while logged in
	if (AUTH_ROUTES.includes(pathname) && session) {
		return NextResponse.redirect(new URL('/dashboard', request.url))
	}

	// If trying to access protected routes while logged out
	if (
		PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) &&
		!session
	) {
		const url = new URL('/sign-in', request.url)
		url.searchParams.set('from', pathname)
		return NextResponse.redirect(url)
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|public).*)'
	]
}
