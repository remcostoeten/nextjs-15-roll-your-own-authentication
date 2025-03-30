import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  CLOUD_DATABASE_URL: z.string(),
  UPLOADTHING_TOKEN: z.string(),
  ADMIN_EMAIL: z.string().email().optional(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  JWT_SECRET: z.string(),
  ENVIRONMENT: z.string().default("local"),
  PASSWORD_LENGTH: z.coerce.number().default(8),
  NEXT_PUBLIC_BASE_URL: z.string(),
  NEXT_PUBLIC_APP_URL: z.string(),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  CLOUD_DATABASE_URL: process.env.CLOUD_DATABASE_URL,
  UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  ENVIRONMENT: process.env.ENVIRONMENT,
  PASSWORD_LENGTH: process.env.PASSWORD_LENGTH,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
