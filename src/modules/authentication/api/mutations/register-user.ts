import { db } from '@/server/db';
import { users, sessions } from '@/server/db/schemas';
import { userRegistrationSchema } from '@/modules/authentication/models';
import { hashPassword } from '@/shared/utils/password';
import { generateTokens } from '@/shared/utils/jwt';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function registerUser(userData: unknown, requestInfo?: {
    userAgent?: string;
    ipAddress?: string;
}) {
    // Validate user data
    const validatedData = userRegistrationSchema.parse(userData);

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, validatedData.email),
    });

    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Insert user into database
    const [newUser] = await db
        .insert(users)
        .values({
            email: validatedData.email,
            passwordHash,
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
        })
        .returning({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            createdAt: users.createdAt,
        });

    if (!newUser) {
        throw new Error('Failed to create user');
    }

    // Generate tokens
    const tokens = await generateTokens({
        sub: newUser.id,
        email: newUser.email,
    });

    // Calculate expiration date for refresh token (7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store refresh token in database
    await db.insert(sessions).values({
        userId: newUser.id,
        refreshToken: tokens.refreshToken,
        expiresAt,
        userAgent: requestInfo?.userAgent,
        ipAddress: requestInfo?.ipAddress,
    });

    // Set cookies for automatic sign-in
    const cookieStore = cookies();

    // Set access token in cookie (httpOnly for security)
    cookieStore.set({
        name: 'access_token',
        value: tokens.accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60, // 15 minutes
        path: '/',
    });

    // Set refresh token in cookie (httpOnly for security)
    cookieStore.set({
        name: 'refresh_token',
        value: tokens.refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
    });

    // Return user data and tokens
    return {
        user: newUser,
        tokens,
    };
} 