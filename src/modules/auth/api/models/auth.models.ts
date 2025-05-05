// src/modules/auth/api/models/auth.models.ts
import { z } from 'zod';
import { roles } from '@/modules/auth/api/schemas/user-schema'; // Import roles from schema

export const RegisterSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const JwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  username: z.string(),
  role: z.enum(roles),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
