import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { rateLimit, getRateLimit } from '@/server/lib/rate-limit'
import { AUTH_COOKIE_NAME } from '@/server/mutations/auth/oauth/constants'
import { env } from '@/env'

const secretKey = new TextEncoder().encode(env.JWT_SECRET)

export async function middleware(request: NextRequest) {
	const response = NextResponse.next()

	// Apply rate limiting to all API routes
	if (request.nextUrl.pathname.startsWith('/api/')) {
		const ip =
			request.headers.get('x-forwarded-for') ||
			request.nextUrl.searchParams.get('ip') ||
			'anonymous'

		const routeLimit = await getRateLimit(request.nextUrl.pathname)

		try {
			const { remaining, reset } = await rateLimit(
				`${ip}:${request.nextUrl.pathname}`,
				routeLimit
			)

			// Set rate limit headers
			response.headers.set(
				'X-RateLimit-Limit',
				routeLimit.maxRequests.toString()
			)
			response.headers.set('X-RateLimit-Remaining', remaining.toString())
			response.headers.set('X-RateLimit-Reset', reset.toString())
			response.headers.set(
				'X-RateLimit-Policy',
				`${routeLimit.maxRequests} requests per ${routeLimit.interval} seconds`
			)
		} catch (error) {
			if (
				error instanceof Error &&
				'reset' in error &&
				'remaining' in error
			) {
				return new NextResponse(
					JSON.stringify({
						error: 'Too Many Requests',
						message: `Rate limit exceeded. Please try again later.`,
						retryAfter: (error as { reset: number }).reset
					}),
					{
						status: 429,
						headers: {
							'Content-Type': 'application/json',
							'Retry-After': Math.ceil(
								(error as { reset: number }).reset -
									Date.now() / 1000
							).toString()
						}
					}
				)
			}

			return new NextResponse(
				JSON.stringify({ error: 'Internal Server Error' }),
				{ status: 500 }
			)
		}
	}

	const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
	const isAuthPage =
		request.nextUrl.pathname === '/login' ||
		request.nextUrl.pathname === '/register'

	// Protect dashboard routes
	if (request.nextUrl.pathname.startsWith('/dashboard')) {
		if (!token) {
			return NextResponse.redirect(new URL('/login', request.url))
		}

		try {
			const { payload } = await jwtVerify(token, secretKey)

			if (
				!payload ||
				typeof payload !== 'object' ||
				!('userId' in payload)
			) {
				throw new Error('Invalid token payload')
			}
		} catch (error) {
			console.error('Auth middleware error:', error)
			return NextResponse.redirect(new URL('/login', request.url))
		}
	}

	// Redirect authenticated users away from auth pages
	if (isAuthPage && token) {
		return NextResponse.redirect(new URL('/dashboard', request.url))
	}

	return response
}

export const config = {
	matcher: ['/api/:path*', '/dashboard/:path*', '/login', '/register']
}
