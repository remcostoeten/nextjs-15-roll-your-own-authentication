'use server'

import { cookies } from 'next/headers'
import { db } from '@/server/db'
import { users } from '@/server/db/schemas'
import { eq } from 'drizzle-orm'
import { generateTokens } from '@/shared/utils/jwt/jwt'
import { userRegistrationSchema } from '@/modules/authentication/models/z.user'
import { hashPassword } from '@/shared/utils/password'
import { env } from 'env'
import { nanoid } from 'nanoid'

export type RegisterFormState = {
    success: boolean
    message?: string
    user?: {
        id: string
        email: string
        firstName: string | null
        lastName: string | null
        role: 'admin' | 'user'
        avatar: string
    }
}

function isAdminEmail(email: string): boolean {
    return email.toLowerCase() === env.ADMIN_EMAIL?.toLowerCase()
}

function generateDefaultAvatar(email: string, name: string): string {
    // Use Dicebear's Avataaars collection
    const seed = `${email}-${name}-${Date.now()}`;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export async function registerMutation(formData: FormData | Record<string, unknown>): Promise<RegisterFormState> {
    try {
        // Handle both FormData and direct object input
        const rawFormData = formData instanceof FormData ? {
            email: (formData.get('email') as string)?.trim() || '',
            password: (formData.get('password') as string)?.trim() || '',
            firstName: (formData.get('firstName') as string)?.trim() || '',
            lastName: (formData.get('lastName') as string)?.trim() || '',
        } : {
            email: String(formData.email || '').trim(),
            password: String(formData.password || '').trim(),
            firstName: String(formData.firstName || '').trim(),
            lastName: String(formData.lastName || '').trim(),
        }

        // Log the raw form data for debugging (excluding password)
        console.log('Raw form data:', {
            email: rawFormData.email,
            firstName: rawFormData.firstName,
            lastName: rawFormData.lastName,
            password: '[REDACTED]'
        })

        try {
            const validatedData = userRegistrationSchema.safeParse(rawFormData)

            if (!validatedData.success) {
                // Get the first validation error message
                const firstError = validatedData.error.errors[0]
                return {
                    success: false,
                    message: firstError.message
                }
            }

            const { email, password, firstName, lastName } = validatedData.data

            // Check if user already exists
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email.toLowerCase()),
            })

            if (existingUser) {
                return {
                    success: false,
                    message: 'User already exists',
                }
            }

            // Hash password
            const hashedPassword = await hashPassword(password)

            // Determine role based on email
            const role = isAdminEmail(email) ? 'admin' as const : 'user' as const

            // Generate default avatar
            const defaultAvatar = generateDefaultAvatar(email, `${firstName} ${lastName}`.trim())

            // Create user
            const [user] = await db
                .insert(users)
                .values({
                    id: nanoid(),
                    email: email.toLowerCase(),
                    passwordHash: hashedPassword,
                    firstName,
                    lastName,
                    role,
                    avatar: defaultAvatar,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning()

            if (!user) {
                return {
                    success: false,
                    message: 'Failed to create user',
                }
            }

            // Generate tokens with proper typing
            const tokenPayload = {
                sub: user.id,
                email: user.email,
                role: user.role as 'admin' | 'user',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
            }
            const tokens = await generateTokens(tokenPayload)

            // Set cookies using Next.js 15 API
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const,
                path: '/',
            }

            const cookieStore = await cookies()
            cookieStore.set('access_token', tokens.accessToken, {
                ...cookieOptions,
                maxAge: 15 * 60, // 15 minutes
            })

            cookieStore.set('refresh_token', tokens.refreshToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60, // 7 days
            })

            return {
                success: true,
                message: 'Registration successful',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role as 'admin' | 'user',
                    avatar: user.avatar,
                },
            }
        } catch (error) {
            console.error('Validation error:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Registration failed',
            }
        }
    } catch (error) {
        console.error('Registration error:', error)
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Registration failed',
        }
    }
}
