'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/server/db'
import {
	users,
	sessions,
	notifications,
	userNotifications,
} from '@/server/db/schema'
import { eq, or } from 'drizzle-orm'
import { generateToken, logUserActivity, isFirstUser } from '../utilities/auth'
import { headers } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import { createId } from '@paralleldrive/cuid2'
import { registerSchema, loginSchema } from '../models/z.register'
import { DEFAULT_AVATAR_URL } from '../config/constants'

const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax' as const,
	path: '/',
}

export async function register(formData: FormData) {
	try {
		const validatedData = registerSchema.parse({
			firstName: formData.get('firstName'),
			lastName: formData.get('lastName'),
			email: formData.get('email'),
			username: formData.get('username'),
			password: formData.get('password'),
		})

		// Check if email already exists
		const existingUserByEmail = await db.query.users.findFirst({
			where: eq(users.email, validatedData.email),
		})

		if (existingUserByEmail) {
			console.log(
				'Registration failed: Email already in use',
				validatedData.email
			)
			return { error: 'Email already in use' }
		}

		const existingUserByUsername = await db.query.users.findFirst({
			where: eq(users.username, validatedData.username),
		})

		if (existingUserByUsername) {
			console.log(
				'Registration failed: Username already in use',
				validatedData.username
			)
			return { error: 'Username already in use' }
		}

		const hashedPassword = await bcrypt.hash(validatedData.password, 10)

		const firstUser = await isFirstUser()
		const isAdmin =
			firstUser || validatedData.email === process.env.ADMIN_EMAIL

		// Get a random avatar URL
		const avatarUrl = DEFAULT_AVATAR_URL()

		// Create user
		const userId = createId()
		const [newUser] = await db
			.insert(users)
			.values({
				id: userId,
				firstName: validatedData.firstName,
				lastName: validatedData.lastName,
				email: validatedData.email,
				username: validatedData.username,
				password: hashedPassword,
				isAdmin: isAdmin,
				avatar: avatarUrl,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning()

		// Log activity
		await logUserActivity(newUser.id, 'register')

		const notificationId = createId()
		const [welcomeNotification] = await db
			.insert(notifications)
			.values({
				id: notificationId,
				title: 'Welcome to the platform!',
				content: `Welcome ${newUser.firstName}! We're glad to have you here. Get started by exploring the features and completing your profile.`,
				type: 'success',
				createdById: newUser.id, // Self-created welcome message
				isGlobal: false,
				createdAt: new Date(),
			})
			.returning()

		const userNotificationId = createId()
		await db.insert(userNotifications).values({
			id: userNotificationId,
			userId: newUser.id,
			notificationId: welcomeNotification.id,
			isRead: false,
			createdAt: new Date(),
		})

		console.log('Registration successful for user', newUser.id)
		return { success: true, userId: newUser.id }
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Registration validation error:', error.errors)
			return { error: error.errors[0].message }
		}
		console.error('Registration error:', error)
		return { error: 'Registration failed' }
	}
}

// Login user - updated to support login with email or username
export async function login(formData: FormData) {
	try {
		// Validate form data
		const validatedData = loginSchema.parse({
			emailOrUsername: formData.get('emailOrUsername'),
			password: formData.get('password'),
		})

		const { emailOrUsername, password } = validatedData
		console.log('Login attempt for:', emailOrUsername)

		// Find user by email or username
		const user = await db.query.users.findFirst({
			where: or(
				eq(users.email, emailOrUsername),
				eq(users.username, emailOrUsername)
			),
		})

		if (!user) {
			console.log('Login failed: User not found for', emailOrUsername)
			return { error: 'Invalid credentials' }
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(
			password,
			user.password || ''
		)

		if (!isPasswordValid) {
			console.log('Login failed: Invalid password for user', user.id)
			return { error: 'Invalid credentials' }
		}

		// Create session
		const headersList = await headers()
		const userAgent = headersList.get('user-agent') || ''
		const ip = headersList.get('x-forwarded-for') || '127.0.0.1'

		const sessionId = uuidv4()
		const expiresAt = new Date()
		expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

		await db.insert(sessions).values({
			id: sessionId,
			userId: user.id,
			expiresAt,
			ipAddress: ip.split(',')[0],
			userAgent,
			lastUsedAt: new Date(),
		})

		// Generate JWT token
		const token = await generateToken({
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			isAdmin: user.isAdmin || false,
			sessionId,
		})

		console.log('Generated token for user', user.id)

		// Set token cookie
		const cookieStore = await cookies()
		cookieStore.set('token', token, {
			...cookieOptions,
			expires: expiresAt,
		})

		// Log activity
		await logUserActivity(user.id, 'login')

		console.log('Login successful for user', user.id)
		return { success: true }
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Login validation error:', error.errors)
			return { error: error.errors[0].message }
		}
		console.error('Login error:', error)
		return { error: 'Login failed' }
	}
}

// Logout user
export async function logout() {
	try {
		const cookieStore = await cookies()
		const token = cookieStore.get('token')?.value

		if (token) {
			cookieStore.delete('token')
		}

		return { success: true }
	} catch (error) {
		console.error('Logout error:', error)
		return { error: 'Logout failed' }
	}
}
