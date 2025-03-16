import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    server: {
        ADMIN_EMAIL: z.string().email(),
        JWT_SECRET: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string().min(1),
        NEXT_PUBLIC_BASE_URL: z.string().min(1),
    },
    runtimeEnv: {
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        JWT_SECRET: process.env.JWT_SECRET,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    },
}) 