import { JWTService } from '@/features/auth/services/jwt.service'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
const tokenService = new JWTService()

export function middleware(request: NextRequest) {
	const token = request.cookies.get('auth-token')?.value

	if (request.nextUrl.pathname.startsWith('/dashboard')) {
		if (!token || !tokenService.verifyToken(token)) {
			return NextResponse.redirect(new URL('/sign-in', request.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/dashboard/:path*']
}
