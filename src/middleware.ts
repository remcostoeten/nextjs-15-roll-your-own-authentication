/**
 * @author Remco Stoeten
 * @description Handles middleware operations for Next.js requests.
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { verifyToken } from './features/auth/services/jwt.service'

const publicRoutes = ['/sign-in', '/sign-up']
const protectedRoutes = ['/dashboard']

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const sessionCookie = request.cookies.get('session')?.value

	// Skip middleware for non-matching routes
	if (
		!publicRoutes.includes(pathname) &&
		!protectedRoutes.includes(pathname)
	) {
		return NextResponse.next()
	}

	// Handle public routes
	if (publicRoutes.includes(pathname)) {
		if (!sessionCookie) {
			return NextResponse.next()
		}

		try {
			const payload = await verifyToken(sessionCookie)
			if (payload) {
				return NextResponse.redirect(new URL('/dashboard', request.url))
			}
		} catch {
			return NextResponse.next()
		}
	}

	// Handle protected routes
	if (protectedRoutes.includes(pathname)) {
		if (!sessionCookie) {
			return NextResponse.redirect(new URL('/sign-in', request.url))
		}

		try {
			const payload = await verifyToken(sessionCookie)
			if (!payload) {
				return NextResponse.redirect(new URL('/sign-in', request.url))
			}
		} catch {
			return NextResponse.redirect(new URL('/sign-in', request.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/dashboard/:path*', '/sign-in', '/sign-up']
}
