import { env } from '@/api/env';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);
const EXPIRATION = '7d';

export type JWTPayload = {
	id: string;
	email: string;
	role: string;
	name?: string | null;
	avatar?: string | null;
	createdAt?: Date | null;
	updatedAt?: Date | null;
};

export async function signJwt(payload: JWTPayload) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(EXPIRATION)
		.sign(JWT_SECRET);
}

export async function verifyJwt(token: string): Promise<JWTPayload | null> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return payload as JWTPayload;
	} catch {
		return null;
	}
}
