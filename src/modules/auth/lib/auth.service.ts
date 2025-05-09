import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { type User } from '../api/models/z.user';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = 'auth_token';

export async function createToken(user: Partial<User>) {
    const token = await new SignJWT({ 
        id: user.id,
        email: user.email,
        name: user.name 
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return token;
}

export async function verifyToken() {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    try {
        const verified = await jwtVerify(token, JWT_SECRET);
        return verified.payload as { id: string; email: string; name?: string };
    } catch {
        cookieStore.delete(COOKIE_NAME);
        return null;
    }
}

export async function logout() {
    const cookieStore = cookies();
    cookieStore.delete(COOKIE_NAME);
} 