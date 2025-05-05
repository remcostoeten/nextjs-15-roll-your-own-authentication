import { z } from 'zod';

export const UpdateProfileSchema = z.object({
    biography: z.string().optional(),
    occupation: z.string().optional(),
    githubLink: z.string().url().or(z.literal('')).optional(), // Allow empty string or valid URL
    twitterLink: z.string().url().or(z.literal('')).optional(),
    websiteLink: z.string().url().or(z.literal('')).optional(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

