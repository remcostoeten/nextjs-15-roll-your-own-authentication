import { z } from 'zod';

// Define schema for environment variables
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    DATABASE_TYPE: z.enum(['postgres', 'sqlite']).default('sqlite'),
    REFRESH_TOKEN_SECRET: z.string().min(1),
    ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
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
            DATABASE_URL: process.env.DATABASE_URL,
            DATABASE_TYPE: process.env.DATABASE_TYPE,
            JWT_SECRET: process.env.JWT_SECRET,
            REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
            ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
            REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
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