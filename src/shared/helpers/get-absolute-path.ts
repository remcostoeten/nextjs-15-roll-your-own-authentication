type Environment = 'production' | 'preview' | 'development'

/**
 * @author Remco Stoeten
 * @description Get absolute URL based on environment
 */
export default function getAbsoluteUrl(path: string = '') {
	const environment = process.env.NEXT_PUBLIC_VERCEL_ENV as Environment

	switch (environment) {
		case 'production':
			return `https://rollyourownauth.remcostoeten.com${path}`

		case 'preview':
			return `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}${path}`

		default:
			return `http://localhost:3000${path}`
	}
}
