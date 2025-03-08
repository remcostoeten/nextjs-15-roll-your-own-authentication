import { z } from 'zod';

// Define schema for environment variables
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_TYPE: z.enum(['postgres', 'sqlite', 'none']).default('sqlite'),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    REFRESH_TOKEN_SECRET: z.string().min(1),
    ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
    // Email configuration
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
});

// Process environment variables through the schema
function processEnv() {
    // For server-side only
    if (typeof process === 'undefined') {
        return {} as z.infer<typeof envSchema>;
    }

    try {
        return envSchema.parse({
            NODE_ENV: process.env.NODE_ENV,
            DATABASE_TYPE: process.env.DATABASE_TYPE,
            DATABASE_URL: process.env.DATABASE_URL,
            JWT_SECRET: process.env.JWT_SECRET || 'development_jwt_secret',
            REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'development_refresh_token_secret',
            ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
            REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
            // Email configuration
            RESEND_API_KEY: process.env.RESEND_API_KEY,
            EMAIL_FROM: process.env.EMAIL_FROM,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVariables = error.errors
                .map((err) => err.path.join('.'))
                .join(', ');

            throw new Error(`Missing or invalid environment variables: ${missingVariables}`);
        }
        throw error;
    }
}

export const env = processEnv(); 