/**
 * @author Remco Stoeten
 * @description Provides security-related operations for the application.
 */

import crypto from 'crypto'
import { rateLimit } from 'express-rate-limit'
import { NextResponse } from 'next/server'

export class SecurityService {
	/**
	 * Creates a rate limit for incoming requests.
	 *
	 * This method returns a rate limit middleware that limits the number of requests within a given time window.
	 *
	 * @returns The rate limit middleware.
	 */
	static createRateLimit() {
		return rateLimit({
			windowMs: 15 * 60 * 1000,
			max: 5,
			handler: () => {
				return new NextResponse(
					JSON.stringify({
						error: 'Too many requests, please try again later.'
					}),
					{ status: 429 }
				)
			}
		})
	}

	/**
	 * Generates a CSRF token.
	 *
	 * This method generates a random CSRF token for use in forms.
	 *
	 * @returns A string representing the CSRF token.
	 */
	static generateCSRFToken(): string {
		return crypto.randomBytes(32).toString('hex')
	}

	/**
	 * Validates a CSRF token against a stored token.
	 *
	 * This method checks if the provided CSRF token matches the stored token.
	 *
	 * @param token The CSRF token to validate.
	 * @param storedToken The stored CSRF token to compare with.
	 * @returns A boolean indicating if the tokens match.
	 */
	static validateCSRFToken(token: string, storedToken: string): boolean {
		return crypto.timingSafeEqual(
			Buffer.from(token),
			Buffer.from(storedToken)
		)
	}

	/**
	 * Sets security headers on a given Headers object.
	 *
	 * This method sets various security headers to enhance the security of the application.
	 *
	 * @param headers The Headers object to set security headers on.
	 * @returns The modified Headers object with security headers set.
	 */
	static getSecurityHeaders(headers: Headers): Headers {
		headers.set('X-Frame-Options', 'DENY')
		headers.set('X-Content-Type-Options', 'nosniff')
		headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
		headers.set(
			'Content-Security-Policy',
			"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
		)
		headers.set('X-XSS-Protection', '1; mode=block')
		return headers
	}
}
