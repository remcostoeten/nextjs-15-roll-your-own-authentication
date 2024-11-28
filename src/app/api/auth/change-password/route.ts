import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { getUser } from '@/services/auth/get-user'
import bcryptjs from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const user = await getUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const formData = await request.formData()
		const currentPassword = formData.get('currentPassword') as string
		const newPassword = formData.get('newPassword') as string

		// Get user with password
		const [userWithPassword] = await db
			.select()
			.from(users)
			.where(eq(users.id, user.id))

		// Verify current password
		const isValid = await bcryptjs.compare(
			currentPassword,
			userWithPassword.password
		)

		if (!isValid) {
			return NextResponse.json(
				{ error: 'Current password is incorrect' },
				{ status: 400 }
			)
		}

		// Hash new password
		const hashedPassword = await bcryptjs.hash(newPassword, 10)

		// Update password
		await db
			.update(users)
			.set({ password: hashedPassword })
			.where(eq(users.id, user.id))

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Password change error:', error)
		return NextResponse.json(
			{ error: 'Failed to change password' },
			{ status: 500 }
		)
	}
}
