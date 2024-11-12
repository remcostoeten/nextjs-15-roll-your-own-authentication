import { getUser } from '@/shared/utilities/get-user'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const user = await getUser()
		return NextResponse.json({ user })
	} catch (error) {
		return NextResponse.json({ user: null })
	}
}
