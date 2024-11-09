import { verifyToken } from '@/features/auth/services/jwt.service'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const sessionCookie = cookies().get('session')?.value

		if (!sessionCookie) {
			return new NextResponse(null, { status: 401 })
		}

		const payload = await verifyToken(sessionCookie)
		if (!payload) {
			return new NextResponse(null, { status: 401 })
		}

		return NextResponse.json({
			userId: payload.userId,
			email: payload.email
		})
	} catch (error) {
		return new NextResponse(null, { status: 401 })
	}
}
