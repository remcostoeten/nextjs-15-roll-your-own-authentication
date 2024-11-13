import { serverSchema } from './schema'

export const serverEnv = serverSchema.safeParse({
	JWT_SECRET: process.env.JWT_SECRET,
	NODE_ENV: process.env.NODE_ENV
})

if (!serverEnv.success) {
	console.error(
		'❌ Invalid environment variables:',
		serverEnv.error.flatten().fieldErrors
	)
	throw new Error('Invalid environment variables')
}

export const env = serverEnv.data
