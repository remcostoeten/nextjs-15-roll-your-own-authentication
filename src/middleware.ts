import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Next.js Middleware function
 * This runs on every request and enforces authentication rules
 */
export async function middleware(request: NextRequest) {
	// Check if the route is login or register - prevent authenticated access
	const url = request.nextUrl.pathname
	if (
		['/login', '/register', '/auth/login', '/auth/register'].includes(url)
	) {
		// Check for access token
		const accessToken = request.cookies.get('access_token')?.value
		if (accessToken) {
			// User is authenticated, redirect to dashboard
			return NextResponse.redirect(new URL('/dashboard', request.url))
		}

		// No access token, allow access to login/register
		return NextResponse.next()
	}

	// Check if this is an admin route
	if (url === '/admin' || url.startsWith('/admin/')) {
		// Check for access token
		const accessToken = request.cookies.get('access_token')?.value
		if (!accessToken) {
			// No access token, redirect to login
			const loginUrl = new URL('/login', request.url)
			loginUrl.searchParams.set('callbackUrl', encodeURI(url))
			return NextResponse.redirect(loginUrl)
		}

		// We'll let the server component handle the admin role check
		// This avoids using Node.js modules in the Edge Runtime
		return NextResponse.next()
	}

	// Check if this is a protected route
	const protectedRoutes = ['/dashboard', '/profile', '/settings']

	// Check if the current path starts with any of the protected routes
	const isProtectedRoute = protectedRoutes.some(
		(route) => url === route || url.startsWith(`${route}/`)
	)

	if (!isProtectedRoute) {
		return NextResponse.next() // Not a protected route, continue
	}

	// Check for access token
	const accessToken = request.cookies.get('access_token')?.value
	if (!accessToken) {
		// No access token, redirect to login
		const loginUrl = new URL('/login', request.url)
		loginUrl.searchParams.set('callbackUrl', encodeURI(url))
		return NextResponse.redirect(loginUrl)
	}

	// We don't verify the token here to avoid importing Node.js modules
	// If the token is invalid, the API routes will handle that
	return NextResponse.next()
}

/**
 * Configure which paths this middleware will run on
 */
export const config = {
	matcher: [
		// Match login, register, dashboard, profile, settings, and admin paths
		'/(login|register|dashboard|profile|settings|admin)(.*)',
	],
}
