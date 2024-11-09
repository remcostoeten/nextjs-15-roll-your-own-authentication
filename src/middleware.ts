/**
 * @author Remco Stoeten
 * @description Handles middleware operations for Next.js requests.
 *
 * This function applies security headers, rate limits for authentication routes, session validation, and redirects for protected routes.
 *
 * @param request The NextRequest object representing the incoming request.
 * @returns A promise that resolves to the NextResponse object.
 */

import {
	RateLimiterService,
	SecurityService,
	SessionService
} from '@/features/auth/services'
import { type NextRequest, NextResponse } from 'next/server'

const AUTH_ROUTES = new Set([
	'/sign-in',
	'/sign-up',
	'/forgot-password',
	'/reset-password'
])

const PROTECTED_ROUTES = new Set(['/dashboard', '/settings', '/profile'])

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const sessionService = new SessionService()

	// Initialize response
	const response = NextResponse.next()

	try {
		// Apply security headers
		SecurityService.getSecurityHeaders(response.headers)

		// Rate limiting for auth routes
		if (AUTH_ROUTES.has(pathname)) {
			const ip =
				request.headers.get('cf-connecting-ip') ||
				request.headers.get('x-forwarded-for') ||
				'unknown'
			const authLimiter = RateLimiterService.createAuthLimiter()
			const result = await authLimiter.check(`auth:${ip}`)

			if (!result.success) {
				return new NextResponse(
					JSON.stringify({
						error: 'Too many attempts',
						retryAfter: new Date(
							result.resetTime!
						).toLocaleTimeString()
					}),
					{
						status: 429,
						headers: { 'Content-Type': 'application/json' }
					}
				)
			}
		}

		// Session validation
		const session = await sessionService.validateSession()

		// Protected routes check
		if (PROTECTED_ROUTES.has(pathname) && !session) {
			const redirectUrl = new URL('/sign-in', request.url)
			redirectUrl.searchParams.set('redirect', pathname)
			return NextResponse.redirect(redirectUrl)
		}

		// Prevent authenticated users from accessing auth pages
		if (AUTH_ROUTES.has(pathname) && session) {
			return NextResponse.redirect(new URL('/dashboard', request.url))
		}

		return response
	} catch (error) {
		console.error('Middleware error:', error)
		return new NextResponse(null, { status: 500 })
	}
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)']
}
