/**
 * @author Remco Stoeten
 * @description A React component for login.z functionality.
 */

import { z } from 'zod'

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required')
})