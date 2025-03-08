import { db } from '@/server/db';
import { users, sessions } from '@/server/db/schemas';
import { userLoginSchema } from '@/modules/authentication/models';
import { verifyPassword } from '@/shared/utils/password';
import { generateTokens } from '@/shared/utils/jwt';
import { eq } from 'drizzle-orm';
import { updateLoginMetrics, logActivity } from '@/modules/user-metrics/api';

export async function loginUser(credentials: unknown, requestInfo?: {
    userAgent?: string;
    ipAddress?: string;
}) {
    // Validate credentials
    const validatedData = userLoginSchema.parse(credentials);

    // Find user by email
    const user = await db.query.users.findFirst({
        where: eq(users.email, validatedData.email),
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(validatedData.password, user.passwordHash);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = await generateTokens({
        sub: user.id,
        email: user.email,
    });

    // Calculate expiration date for refresh token (7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store refresh token in database
    await db.insert(sessions).values({
        userId: user.id,
        refreshToken: tokens.refreshToken,
        expiresAt,
        userAgent: requestInfo?.userAgent,
        ipAddress: requestInfo?.ipAddress,
    });

    // Update user metrics
    await updateLoginMetrics(user.id);

    // Log login activity
    await logActivity({
        userId: user.id,
        action: 'User login',
        details: `Login from ${requestInfo?.userAgent || 'unknown device'}`
    });

    // Return user data (excluding password) and tokens
    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        tokens,
    };
} 