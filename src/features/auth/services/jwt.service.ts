/**
 * Provides methods for creating and verifying JSON Web Tokens (JWTs).
 *
 * This class is responsible for handling JWT-related operations, including token creation and verification.
 *
 * @author Remco Stoeten
 */
import { SignJWT, jwtVerify } from 'jose'

export class JWTService {
	/**
	 * The secret key used for signing and verifying JWT tokens.
	 */
	private secret: Uint8Array

	/**
	 * Initializes the JWTService with a secret key.
	 *
	 * The secret key is either taken from the environment variable JWT_SECRET or defaults to 'your-secret-key'.
	 */
	constructor() {
		this.secret = new TextEncoder().encode(
			process.env.JWT_SECRET || 'your-secret-key'
		)
	}

	/**
	 * Creates a new JWT token with the given payload and expiration time.
	 *
	 * @param payload The payload to be included in the JWT token.
	 * @param expiresIn The duration until the token expires, in seconds or a string describing a time span (e.g., '7d').
	 * @returns A promise that resolves to the created JWT token as a string.
	 */
	async createToken(
		payload: Record<string, unknown>,
		expiresIn = '7d'
	): Promise<string> {
		return new SignJWT(payload)
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime(expiresIn)
			.sign(this.secret)
	}

	/**
	 * Verifies a given JWT token and returns its payload if valid.
	 *
	 * @param token The JWT token to verify.
	 * @returns A promise that resolves to the payload of the token if it's valid, or null if it's invalid.
	 */
	async verifyToken<T>(token: string): Promise<T | null> {
		try {
			const { payload } = await jwtVerify(token, this.secret)
			return payload as T
		} catch {
			return null
		}
	}
}
