import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export type Session = {
    userId: string;
    email: string;
    exp: number;
};

export async function getSession(): Promise<Session | null> {
    'use server';
    
    try {
        const token = (await cookies()).get('auth_token')?.value;
        if (!token) return null;

        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as Session;
    } catch (error) {
        return null;
    }
} 