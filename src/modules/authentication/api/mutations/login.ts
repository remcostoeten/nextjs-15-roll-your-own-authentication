'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'
import { db } from 'db'
import { setAuthCookies } from '@/modules/authentication/utils/auth-cookies'
import { logUserActivity } from '@/shared/utils/activity-logger'
import { comparePasswords } from '@/modules/authentication/utils/password'
import { ActivityType } from '@/shared/utils/activity-logger'

export type LoginFormState = {
    success: boolean
    message: string | null
    user?: {
        id: string
        email: string
        firstName: string | null
        lastName: string | null
        role: 'admin' | 'user'
    }
}

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    userAgent: z.string(),
})

export async function loginMutation(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
    try {
        const rawData = Object.fromEntries(formData.entries())
        const validatedData = loginSchema.parse(rawData)

        // Find user by email
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, validatedData.email),
        })

        if (!user) {
            await logUserActivity({
                type: 'login_failure' as ActivityType,
                userId: 'anonymous',
                details: 'Invalid email or password',
                metadata: {
                    email: validatedData.email,
                    userAgent: validatedData.userAgent,
                },
            })

            return {
                success: false,
                message: 'Invalid email or password',
            }
        }

        // Verify password
        const isValidPassword = await comparePasswords(validatedData.password, user.passwordHash)
        if (!isValidPassword) {
            await logUserActivity({
                type: 'login_failure' as ActivityType,
                userId: user.id,
                details: 'Invalid password',
                metadata: {
                    email: user.email,
                    userAgent: validatedData.userAgent,
                },
            })

            return {
                success: false,
                message: 'Invalid email or password',
            }
        }

        // Set auth cookies
        await setAuthCookies(user.id)

        // Log successful login
        await logUserActivity({
            type: 'login_success' as ActivityType,
            userId: user.id,
            details: 'User logged in successfully',
            metadata: {
                email: user.email,
                userAgent: validatedData.userAgent,
                role: user.role as 'admin' | 'user',
            },
        })

        return {
            success: true,
            message: 'Successfully logged in',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role as 'admin' | 'user',
            },
        }
    } catch (error) {
        console.error('Login error:', error)

        // Log error if we have user context
        if (error instanceof z.ZodError) {
            await logUserActivity({
                type: 'login_failure' as ActivityType,
                userId: 'anonymous',
                details: 'Validation error during login',
                metadata: {
                    errors: error.errors,
                    userAgent: formData.get('userAgent'),
                },
            })
        }

        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred',
        }
    }
} 