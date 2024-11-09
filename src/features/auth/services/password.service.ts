import { db } from '@/db'
import { users } from '@/db/schema'
import { compare, hash } from 'bcryptjs'
import crypto from 'crypto'
import { eq } from 'drizzle-orm'

/**
 * Provides methods for password-related operations.
 *
 * @author Remco Stoeten
 */
export class PasswordService {
	/**
	 * Hashes a given password using bcrypt.
	 *
	 * @param password The password to hash.
	 * @returns A promise that resolves to the hashed password.
	 */
	static async hashPassword(password: string): Promise<string> {
		return hash(password, 10)
	}

	/**
	 * Compares a given password with a hashed password.
	 *
	 * @param password The password to compare.
	 * @param hashedPassword The hashed password to compare with.
	 * @returns A promise that resolves to a boolean indicating if the passwords match.
	 */
	static async comparePasswords(
		password: string,
		hashedPassword: string
	): Promise<boolean> {
		return compare(password, hashedPassword)
	}

	/**
	 * Initiates the password reset process for a given email.
	 *
	 * @param email The email of the user to initiate password reset for.
	 * @returns A promise that resolves to a boolean indicating if the process was successful.
	 *
	 * @note This method is not fully implemented yet. It does not send the password reset email.
	 */
	async initiatePasswordReset(email: string): Promise<boolean> {
		const user = await db
			.select()
			.from(users)
			.where(eq(users.email, email.toLowerCase()))
			.get()

		if (!user) return false

		const token = crypto.randomBytes(32).toString('hex')
		const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

		await db
			.update(users)
			.set({
				resetToken: token,
				resetTokenExpires: expires.toISOString()
			})
			.where(eq(users.id, user.id))

		// TODO: Implement email service
		// await sendPasswordResetEmail(email, token)

		return true
	}
}
