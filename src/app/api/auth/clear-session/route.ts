import { clearSession } from '@/features/auth/session'
import { NextResponse } from 'next/server'

export async function POST() {
	try {
		await clearSession()
		return NextResponse.json({ success: true })
	} catch (error) {
		return NextResponse.json({ success: false })
	}
}
