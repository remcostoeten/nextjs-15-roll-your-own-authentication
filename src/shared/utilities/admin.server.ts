import { db } from '@/lib/db'

export type AdminCheckResult = {
	isAdmin: boolean
	error?: string
}

export async function checkIsAdmin(email: string): Promise<AdminCheckResult> {
	try {
		const result = await db.execute({
			sql: 'SELECT role FROM users WHERE email = ?',
			args: [email]
		})

		const user = result.rows[0]

		return {
			isAdmin: user?.role === 'admin'
		}
	} catch {
		return {
			isAdmin: false,
			error: 'Failed to check admin status'
		}
	}
}
