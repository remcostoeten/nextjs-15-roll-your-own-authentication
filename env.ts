import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(['development', 'production', 'test']),
        DATABASE_TYPE: z.enum(['sqlite', 'none']),
        DATABASE_URL: z.string(),
        ADMIN_EMAIL: z.string(),
        JWT_SECRET: z.string(),
        REFRESH_TOKEN_SECRET: z.string(),
        ACCESS_TOKEN_EXPIRES_IN: z.string(),
        REFRESH_TOKEN_EXPIRES_IN: z.string(),
        GITHUB_CLIENT_ID: z.string(),
        GITHUB_CLIENT_SECRET: z.string(),
    },
    client: {
        NEXT_PUBLIC_BASE_URL: z.string(),
        NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string(),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_TYPE: process.env.DATABASE_TYPE,
        DATABASE_URL: process.env.DATABASE_URL,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        JWT_SECRET: process.env.JWT_SECRET,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    },
}) 