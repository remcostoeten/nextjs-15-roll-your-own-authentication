import { db } from '@/server/db'
import { users, sessions } from '@/server/db/schemas'
import { userRegistrationSchema } from '@/modules/authentication/models'
import { hashPassword } from '@/shared/utils/password'
import { generateTokens } from '@/shared/utils/jwt'
import { eq } from 'drizzle-orm'
import { logUserActivity } from '@/shared/utils/activity-logger'
import { env } from 'process'

export async function registerUser(
    userData: unknown,
    requestInfo?: {
        userAgent?: string
        ipAddress?: string
    }
) {
    console.log('[registerUser] Function called with data')

    try {
        // Validate user data
        const validatedData = userRegistrationSchema.parse(userData)
        console.log('[registerUser] User data validated')

        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, validatedData.email),
        })

        if (existingUser) {
            // Log failed registration attempt due to existing user
            try {
                await logUserActivity({
                    userId: existingUser.id,
                    type: 'registration_failure',
                    ip: requestInfo?.ipAddress,
                    userAgent: requestInfo?.userAgent,
                    metadata: {
                        reason: 'email_already_exists',
                        attemptedEmail: validatedData.email,
                    },
                })
                console.log(
                    '[registerUser] Logged failed registration (existing email)'
                )
            } catch (logError) {
                console.error(
                    '[registerUser] Failed to log duplicate registration attempt:',
                    logError
                )
            }

            throw new Error('User with this email already exists')
        }

        // Hash password
        const passwordHash = await hashPassword(validatedData.password)
        console.log('[registerUser] Password hashed')

        // Insert user into database with role
        const [newUser] = await db
            .insert(users)
            .values({
                email: validatedData.email,
                passwordHash,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                role: validatedData.email === env.ADMIN_EMAIL ? 'admin' : 'user',
            })
            .returning({
                id: users.id,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
                createdAt: users.createdAt,
            })

        if (!newUser) {
            throw new Error('Failed to create user')
        }

        console.log('[registerUser] User created:', newUser.id)

        // Generate tokens
        const tokens = await generateTokens({
            sub: newUser.id,
            email: newUser.email,
        })
        console.log('[registerUser] Tokens generated')

        // Calculate expiration date for refresh token (7 days)
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        // Store refresh token in database
        await db.insert(sessions).values({
            userId: newUser.id,
            refreshToken: tokens.refreshToken,
            expiresAt,
            userAgent: requestInfo?.userAgent,
            ipAddress: requestInfo?.ipAddress,
        })
        console.log('[registerUser] Refresh token stored')

        // Log successful registration using the new activity logger
        try {
            await logUserActivity({
                userId: newUser.id,
                type: 'registration',
                ip: requestInfo?.ipAddress,
                userAgent: requestInfo?.userAgent,
                metadata: {
                    email: newUser.email,
                    hasName: !!(newUser.firstName || newUser.lastName),
                },
            })
            console.log('[registerUser] Registration activity logged')
        } catch (logError) {
            console.error(
                '[registerUser] Failed to log registration activity:',
                logError
            )
            // Continue even if activity logging fails
        }

        // Return user data and tokens
        console.log(
            '[registerUser] Registration successful, returning user data and tokens'
        )
        return {
            user: newUser,
            tokens,
        }
    } catch (error) {
        console.error('[registerUser] Registration failed:', error)
        throw error
    }
}
