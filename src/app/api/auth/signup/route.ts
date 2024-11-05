import { db } from '@/lib/db'
import { hash } from 'bcryptjs'

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json()

		// Hash the password
		const hashedPassword = await hash(password, 10)

		// Check if email matches ADMIN_EMAIL
		const role =
			email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()
				? 'admin'
				: 'user'

		await db.execute({
			sql: 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
			args: [email, hashedPassword, role]
		})

		return new Response(JSON.stringify({ success: true }), {
			status: 200
		})
	} catch (error) {
		console.error('Signup error:', error)
		return new Response(
			JSON.stringify({ error: 'Failed to create user' }),
			{
				status: 500
			}
		)
	}
}
