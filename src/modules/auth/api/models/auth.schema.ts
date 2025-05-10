import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
})

export type TLoginData = z.infer<typeof loginSchema>
export type TRegisterData = z.infer<typeof registerSchema>

export type TAuthResponse<T = undefined> = {
  success: boolean
  error?: string
  data?: T
  issues?: z.ZodIssue[]
} 