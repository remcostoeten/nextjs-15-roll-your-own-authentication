import { z } from 'zod'

export const sessionSchema = z.object({
	refreshToken: z.string().min(1, 'Refresh token is required'),
	userAgent: z.string().optional(),
	ipAddress: z.string().optional(),
})

export const tokenSchema = z.object({
	accessToken: z.string().min(1, 'Access token is required'),
	refreshToken: z.string().min(1, 'Refresh token is required'),
})
