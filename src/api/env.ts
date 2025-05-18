import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		ADMIN_EMAIL: z.string().min(1),
		JWT_SECRET: z.string().min(1),
		REFRESH_TOKEN_SECRET: z.string().min(1),
		GITHUB_TOKEN: z.string().min(1),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		ADMIN_EMAIL: process.env.ADMIN_EMAIL,
		JWT_SECRET: process.env.JWT_SECRET,
		REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
		GITHUB_TOKEN: process.env.GITHUB_TOKEN,
	},
});
