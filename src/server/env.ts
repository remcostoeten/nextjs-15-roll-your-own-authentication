const requiredServerEnvs = [
	'DATABASE_URL',
	'JWT_SECRET',
	'NODE_ENV',
	'ADMIN_EMAIL'
] as const

const optionalServerEnvs = [
	'SMTP_HOST',
	'SMTP_PORT',
	'SMTP_USER',
	'SMTP_PASS',
	'SMTP_FROM',
	'SMTP_SECURE',
	'RESEND_API_KEY'
] as const

type Env = Record<(typeof requiredServerEnvs)[number], string> & 
	Partial<Record<(typeof optionalServerEnvs)[number], string>>

function getEnvOrThrow(key: string): string {
	const value = process.env[key]
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`)
	}
	return value
}

function getOptionalEnv(key: string): string | undefined {
	return process.env[key]
}

export const env = {
	...Object.fromEntries(
		requiredServerEnvs.map((key) => [key, getEnvOrThrow(key)])
	),
	...Object.fromEntries(
		optionalServerEnvs.map((key) => [key, getOptionalEnv(key)])
	)
} as Env
