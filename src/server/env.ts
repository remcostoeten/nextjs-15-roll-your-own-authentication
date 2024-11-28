const requiredServerEnvs = ['DATABASE_URL', 'JWT_SECRET'] as const

type Env = Record<(typeof requiredServerEnvs)[number], string>

function getEnvOrThrow(key: string): string {
	const value = process.env[key]
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`)
	}
	return value
}

export const env = Object.fromEntries(
	requiredServerEnvs.map((key) => [key, getEnvOrThrow(key)])
) as Env
