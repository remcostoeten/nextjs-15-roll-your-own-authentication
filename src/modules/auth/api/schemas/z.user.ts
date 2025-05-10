import { z } from 'zod';

export const roles = ['user', 'admin'] as const;

export const userSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional(),
    role: z.enum(roles).default('user'),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type User = z.infer<typeof userSchema>;

export const JwtPayloadSchema = z.object({
    sub: z.string(),
    email: z.string().email(),
    username: z.string(),
    role: z.enum(roles)
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>; 