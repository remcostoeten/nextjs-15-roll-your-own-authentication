// src/modules/auth/actions/auth.actions.ts
'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { LoginSchema, RegisterSchema } from '@/modules/auth/api/models/auth.models';
import { hashPassword, comparePassword, createJwt, verifyJwt } from '@/modules/auth/lib/security'; // Added verifyJwt
import { findUserByIdentifierWithPassword, checkUserExists } from '@/modules/auth/api/queries/user.queries';
import { createUser, updateUserLoginStats } from '@/modules/auth/api/mutations/user.mutations';
import { logUserAction, LogActionInput } from '@/modules/metrics/api/mutations/log-actions.mutation';
import { env } from 'env';
import { Role } from '@/modules/auth/api/schemas/user-schema';

const AUTH_COOKIE_NAME = 'auth_token';

type ActionResult = {
  success: boolean;
  message: string;
  error?: string | z.ZodIssue[];
};

function setAuthCookie(userId: number, email: string, username: string, role: Role) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const payload = { sub: String(userId), email, username, role };
      const token = await createJwt(payload);

      (await cookies()).set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 1, // 1 day
      });
      resolve();
    } catch (error) {
      console.error('Failed to set auth cookie:', error);
      reject(new Error('Could not create session.'));
    }
  });
}

export async function getRequestContext(): Promise<Omit<LogActionInput, 'userId' | 'actionType' | 'details'>> {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip');
    const userAgent = headersList.get('user-agent');
    const path = headersList.get('referer');

    return {
        ipAddress: ip,
        userAgent: userAgent,
        path: path,
    };
}


export async function register(formData: FormData): Promise<ActionResult> {
  const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));
  const requestContext = getRequestContext();

  if (!validatedFields.success) {
    await logUserAction({ ...requestContext, actionType: 'REGISTER_FAIL', details: { reason: 'Validation failed', errors: validatedFields.error.flatten() } });
    return { success: false, message: "Invalid registration data.", error: validatedFields.error.errors };
  }

  const { email, username, password } = validatedFields.data;

  try {
    const userExists = await checkUserExists(email, username);
    if (userExists) {
      await logUserAction({ ...requestContext, actionType: 'REGISTER_FAIL', details: { reason: 'User exists', email, username } });
      return { success: false, message: 'An account with this email or username already exists.' };
    }

    const hashedPassword = await hashPassword(password);
    const userRole: Role = email.toLowerCase() === env.ADMIN_EMAIL?.toLowerCase() ? 'admin' : 'user';

    const newUser = await createUser({ email, username, password }, hashedPassword, userRole);

    await setAuthCookie(newUser.id, newUser.email, newUser.username, newUser.role);
    await logUserAction({ ...requestContext, userId: newUser.id, actionType: 'REGISTER_SUCCESS' });

  } catch (error: any) {
    await logUserAction({ ...requestContext, actionType: 'REGISTER_FAIL', details: { reason: 'Server error', message: error.message, email, username } });
    console.error('Registration Error:', error);
    return { success: false, message: error.message || 'Registration failed. Please try again.' };
  }

  redirect('/dashboard');
}


export async function login(formData: FormData): Promise<ActionResult> {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));
  const requestContext = getRequestContext();

  if (!validatedFields.success) {
    await logUserAction({ ...requestContext, actionType: 'LOGIN_FAIL', details: { reason: 'Validation failed', errors: validatedFields.error.flatten() } });
    return { success: false, message: "Invalid login data.", error: validatedFields.error.errors };
  }

  const { identifier, password } = validatedFields.data;
  let userId: number | undefined = undefined;

  try {
    const user = await findUserByIdentifierWithPassword(identifier);
    userId = user?.id;

    if (!user || !user.passwordHash) {
      await logUserAction({ ...requestContext, userId, actionType: 'LOGIN_FAIL', details: { reason: 'User not found', identifier } });
      return { success: false, message: 'Invalid credentials.' };
    }

    const passwordMatch = await comparePassword(password, user.passwordHash);

    if (!passwordMatch) {
      await logUserAction({ ...requestContext, userId, actionType: 'LOGIN_FAIL', details: { reason: 'Password mismatch', identifier } });
      return { success: false, message: 'Invalid credentials.' };
    }

    await setAuthCookie(user.id, user.email, user.username, user.role);
    await updateUserLoginStats(user.id);
    await logUserAction({ ...requestContext, userId: user.id, actionType: 'LOGIN_SUCCESS' });

  } catch (error: any) {
    await logUserAction({ ...requestContext, userId, actionType: 'LOGIN_FAIL', details: { reason: 'Server error', message: error.message, identifier } });
    console.error('Login Error:', error);
    return { success: false, message: error.message || 'Login failed. Please try again.' };
  }

  redirect('/dashboard');
}


export async function logout(): Promise<void> {
  const requestContext = getRequestContext();
  let userId: number | null = null;

  try {
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    if (token) {
        const payload = await verifyJwt(token); // Use verifyJwt from security utils
        userId = payload ? Number(payload.sub) : null;
    }
  } catch (e) { console.error('Logout Error:', e); }

  try {
    (await
          cookies()).delete(AUTH_COOKIE_NAME);
    await logUserAction({ ...requestContext, userId, actionType: 'LOGOUT' });

  } catch (error) {
    console.  error('Logout Error:', error);
    await logUserAction({ ...requestContext, userId, actionType: 'LOGOUT', details: { error: 'Cookie deletion failed' } });
  }

  redirect('/login');
}
