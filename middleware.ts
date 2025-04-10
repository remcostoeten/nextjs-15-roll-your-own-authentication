import { NextResponse } from 'next/server'
import { verifyToken } from '@/modules/authentication/utilities/auth'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard']

// Define public auth routes that should redirect to dashboard if already authenticated
const publicAuthRoutes = ['/login', '/register', '/']

export async function middleware(request: NextRequest) {
	try {
		const token = request.cookies.get('token')?.value
		const pathname = request.nextUrl.pathname
		const searchParams = request.nextUrl.searchParams

		// Handle OAuth callback
		if (
			pathname === '/' &&
			searchParams.has('code') &&
			searchParams.has('state') &&
			searchParams.has('provider')
		) {
			// Redirect to the callback handler
			const url = new URL('/api/oauth/callback', request.url)
			url.search = request.nextUrl.search
			console.log('Redirecting OAuth callback to', url.toString())
			return NextResponse.redirect(url)
		}

		// Verify token
		const payload = token ? await verifyToken(token) : null
		const isAuthenticated = !!payload

		console.log(`Path: ${pathname}, Authenticated: ${isAuthenticated}`)

		// Redirect to login if trying to access a protected route without authentication
		if (
			protectedRoutes.some(
				(route) =>
					pathname === route || pathname.startsWith(`${route}/`)
			) &&
			!isAuthenticated
		) {
			const url = new URL('/login', request.url)
			url.searchParams.set('callbackUrl', pathname)
			console.log(
				'Redirecting unauthenticated user to login from',
				pathname
			)
			return NextResponse.redirect(url)
		}

		// Redirect to dashboard if trying to access a public auth route while authenticated
		if (
			publicAuthRoutes.some((route) => pathname === route) &&
			isAuthenticated
		) {
			console.log(
				'Redirecting authenticated user to dashboard from',
				pathname
			)
			return NextResponse.redirect(new URL('/dashboard', request.url))
		}

		return NextResponse.next()
	} catch (error) {
		console.error('Middleware error:', error)
		// In case of error, allow the request to proceed to avoid blocking the user
		return NextResponse.next()
	}
}

// Configure middleware to run on specific paths
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public (public files)
		 * - api (API routes, except for oauth)
		 */
		'/((?!_next/static|_next/image|favicon.ico|public).*)',
		'/api/oauth/:path*',
	],
}
