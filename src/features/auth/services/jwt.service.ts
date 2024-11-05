import jwt from 'jsonwebtoken'
import { SessionUser, TokenService } from '../types'

export class JWTService implements TokenService {
	private readonly secret: string

	constructor() {
		const secret = process.env.JWT_SECRET
		if (!secret) throw new Error('JWT_SECRET is not defined')
		this.secret = secret
	}

	generateToken(payload: SessionUser): string {
		return jwt.sign(payload, this.secret, { expiresIn: '1d' })
	}

	verifyToken(token: string): SessionUser | null {
		try {
			return jwt.verify(token, this.secret) as SessionUser
		} catch {
			return null
		}
	}
}
