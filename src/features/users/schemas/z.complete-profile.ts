import * as z from "zod"

export default z.object({
  displayName: z
    .string()
    .min(2, { message: "Display name must be at least 2 characters" })
    .max(50, { message: "Display name must be less than 50 characters" }),
  bio: z
    .string()
    .max(160, { message: "Bio must be less than 160 characters" })
    .optional(),
  location: z
    .string()
    .max(100, { message: "Location must be less than 100 characters" })
    .optional(),
  website: z
    .string()
    .url({ message: "Invalid website URL" })
    .optional(),
  avatar: z
    .string()
    .url({ message: "Invalid avatar URL" })
    .optional(),
  timezone: z.string().optional(),
  language: z.string().default('en'),
  theme: z.enum(['light', 'dark', 'system']).default('system')
}) 
