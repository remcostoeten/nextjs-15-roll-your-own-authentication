'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { hashPassword, comparePassword, createJwt, verifyJwt } from '@/modules/auth/lib/security';
import { findUserByIdentifierWithPassword, checkUserExists } from '@/modules/auth/api/queries/user.queries';
import { createUser, updateUserLoginStats } from '@/modules/auth/api/mutations/user.mutations';
import { RegisterInput, LoginInput } from '@/modules/auth/api/models/auth.models';
import { Role } from '@/modules/auth/api/schemas/user-schema';
import { env } from 'env';
import { logUserAction } from '@/modules/metrics/api/mutations/log-actions.mutation';


const AUTH_COOKIE_NAME = 'auth_token';

async function setAuthCookieInternal(userId: number, email: string, username: string, role: Role): Promise<void> {
    const payload = { sub: String(userId), email, username, role };
  const token = await createJwt(payload);

    (await cookies()).set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 1, // 1 day
    });
}

async function clearAuthCookieInternal(): Promise<void> {
    (await cookies()).delete(AUTH_COOKIE_NAME);
}

export async function attemptUserRegistration(data: RegisterInput): Promise<{ id: number; email: string; username: string; role: Role }> {
    const { email, username, password } = data;

    const userExists = await checkUserExists(email, username);
    if (userExists) {
        throw new Error('An account with this email or username already exists.');
    }

    const hashedPassword = await hashPassword(password);
    const userRole: Role = email.toLowerCase() === env.ADMIN_EMAIL?.toLowerCase() ? 'admin' : 'user';

    const newUser = await createUser({ email, username, password }, hashedPassword, userRole);
    
    if (!newUser.email || !newUser.username || !newUser.role) {
        throw new Error('User creation failed: missing required fields');
    }

    await setAuthCookieInternal(newUser.id, newUser.email, newUser.username, newUser.role);

    return {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
    };
}

export async function attemptUserLogin(data: LoginInput): Promise<{ id: number; email: string; username: string; role: Role }> {
    const { identifier, password } = data;

    const user = await findUserByIdentifierWithPassword(identifier);

    if (!user || !user.passwordHash) {
        throw new Error('Invalid credentials.');
    }

    const passwordMatch = await comparePassword(password, user.passwordHash);

    if (!passwordMatch) {
        throw new Error('Invalid credentials.');
    }

    if (!user.email || !user.username || !user.role) {
        throw new Error('Invalid user data');
    }

    await setAuthCookieInternal(user.id, user.email, user.username, user.role);
    await updateUserLoginStats(user.id);

    return {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
    };
}


export async function attemptUserLogout(): Promise<{ userId: number | null }> {
    let userId: number | null = null;
    try {
        const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
        if (token) {
            const payload = await verifyJwt(token);
            userId = payload ? Number(payload.sub) : null;
        }
    } catch {
        // Ignore verification errors during logout
    }

    await clearAuthCookieInternal();
    return { userId }; 
}

export async function logout(): Promise<void> {
    const { userId } = await attemptUserLogout();
    try {
        await logUserAction({ userId, actionType: 'LOGOUT' });
    } catch (error: any) {
        console.error('Logout Action Error:', error);
        await logUserAction({ userId, actionType: 'LOGOUT', details: { error: 'Service error during logout', message: error.message } });
    }
    redirect('/login');
}
