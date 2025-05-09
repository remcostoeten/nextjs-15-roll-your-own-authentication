import { z } from 'zod';

export const userSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>; 