import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';

const JWT_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET || 'default_secret_please_change'
);

export async function signJWT(payload: { sub: string; name?: string; email: string; role?: string }) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setJti(nanoid())
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(JWT_SECRET);
}

export async function verifyJWT(token: string) {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return payload;
	} catch (error) {
		return null;
	}
}
