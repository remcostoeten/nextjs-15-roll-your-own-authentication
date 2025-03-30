import { z } from "zod";

const urlSchema = z.string().url().optional().or(z.literal("")).transform(val => val || null);
const usernameSchema = z.string().regex(/^[a-zA-Z0-9_-]+$/).optional().or(z.literal("")).transform(val => val || null);

export const profileSchema = z.object({
  name: z.string().min(2).max(100)
    .regex(/^[a-zA-Z0-9\s-']+$/, "Name can only contain letters, numbers, spaces, hyphens and apostrophes"),
  
  email: z.string().email("Invalid email address"),
  
  avatarUrl: urlSchema.describe("URL to your profile picture"),
  
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional()
    .transform(val => val || null),
  
  location: z.string().max(100, "Location cannot exceed 100 characters").optional()
    .transform(val => val || null),
  
  website: urlSchema.describe("Your personal website URL"),
  
  twitter: usernameSchema.describe("Your Twitter/X username without @"),
  
  github: usernameSchema.describe("Your GitHub username"),
  
  currentPassword: z.string().optional(),
  
  newPassword: z.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, {
      message: "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number"
    })
    .optional(),
});

export const sessionSchema = z.object({
  sessionId: z.string().uuid(),
  userId: z.number().int().positive(),
  expiresAt: z.date(),
});

export type TProfileSchema = z.infer<typeof profileSchema>;
export type TSessionSchema = z.infer<typeof sessionSchema>;
