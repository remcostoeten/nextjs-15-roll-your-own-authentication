'use server'

import { users } from '@/features/authentication'
import {
	DeviceInfo,
	SecurityEvent,
	UserLocation,
	UserProfile
} from '@/features/authentication/types'
import { db } from 'db'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { verifyJWT } from '../utilities'

export async function getUserData(): Promise<UserProfile | null> {
	try {
		const cookieStore = await cookies()
		const token = cookieStore.get('auth_token')?.value

		if (!token) return null

		const payload = (await verifyJWT(token)) as { userId: number }
		if (!payload) return null

		// Get base user data from DB
		const [dbUser] = await db
			.select()
			.from(users)
			.where(eq(users.id, payload.userId))

		if (!dbUser) return null

		// Simulate additional user data that would normally come from various tables
		const mockLocation: UserLocation = {
			city: 'Amsterdam',
			country: 'Netherlands',
			region: 'North Holland',
			latitude: 52.3676,
			longitude: 4.9041,
			lastUpdated: new Date()
		}

		const mockDevice: DeviceInfo = {
			browser: 'Chrome',
			os: 'Windows 11',
			device: 'Desktop',
			isMobile: false,
			lastUsed: new Date()
		}

		const recentActivity: SecurityEvent[] = [
			{
				type: 'login',
				timestamp: new Date(),
				details: {
					message: 'Successful login from Amsterdam, Netherlands',
					location: mockLocation,
					device: mockDevice,
					success: true
				},
				ipAddress: '192.168.1.1'
			},
			{
				type: 'two_factor_enabled',
				timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
				details: {
					message: 'Two-factor authentication enabled',
					success: true
				}
			},
			{
				type: 'password_change',
				timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
				details: {
					message: 'Password successfully changed',
					location: mockLocation,
					success: true
				}
			},
			{
				type: 'failed_login',
				timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
				details: {
					message: 'Failed login attempt from unknown device',
					location: {
						city: 'Unknown',
						country: 'Russia',
						lastUpdated: new Date(Date.now() - 72 * 60 * 60 * 1000)
					},
					success: false
				},
				ipAddress: '10.0.0.1'
			}
		]

		const devices: DeviceInfo[] = [
			mockDevice,
			{
				browser: 'Safari',
				os: 'iOS 17',
				device: 'iPhone 15 Pro',
				isMobile: true,
				lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000)
			},
			{
				browser: 'Firefox',
				os: 'macOS Sonoma',
				device: 'MacBook Pro',
				isMobile: false,
				lastUsed: new Date(Date.now() - 48 * 60 * 60 * 1000)
			}
		]

		const trustedLocations: UserLocation[] = [
			mockLocation,
			{
				city: 'Utrecht',
				country: 'Netherlands',
				region: 'Utrecht',
				latitude: 52.0907,
				longitude: 5.1214,
				lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
			}
		]

		// Combine real and mock data
		const enrichedUser: UserProfile = {
			id: dbUser.id,
			email: dbUser.email,
			name: dbUser.name || undefined,
			role: dbUser.role as 'user' | 'admin',
			createdAt: dbUser.createdAt,
			emailVerified: dbUser.emailVerified,
			twoFactorEnabled: dbUser.twoFactorEnabled,
			lastLoginAttempt: new Date(),
			lastLocation: mockLocation,
			lastDevice: mockDevice,
			recentActivity,
			securityScore: 85,
			loginStreak: 7,
			totalLogins: 42,
			failedLoginAttempts: 1,
			devices,
			trustedLocations,
			preferences: {
				emailNotifications: true,
				loginAlerts: true,
				timezone: 'Europe/Amsterdam',
				language: 'en'
			}
		}

		return enrichedUser
	} catch (error) {
		console.error('Error fetching user data:', error)
		return null
	}
}
