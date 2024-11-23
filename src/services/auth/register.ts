import bcryptjs from 'bcryptjs'
import { queueEmailVerification } from '../../queues/email-verification'
import { db } from '../../server/db/drizzle'
import { users } from '../../server/db/schema'
import { validatePassword } from './password-validator'

export async function registerUser(email: string, password: string) {
	const { isValid, feedback } = validatePassword(password)
	if (!isValid) {
		throw new Error(feedback)
	}

	const hashedPassword = await bcryptjs.hash(password, 10)
	const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user'

	const [newUser] = await db
		.insert(users)
		.values({
			email,
			password: hashedPassword,
			role
		})
		.returning()

	await queueEmailVerification(newUser.id, email)

	return newUser
}
