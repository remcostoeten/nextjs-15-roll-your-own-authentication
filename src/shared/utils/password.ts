import bcrypt from 'bcryptjs'

/**
 * Generate a password hash
 */
export async function hashPassword(password: string): Promise<string> {
	const saltRounds = 10
	return bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
	password: string,
	hash: string
): Promise<boolean> {
	return bcrypt.compare(password, hash)
}
