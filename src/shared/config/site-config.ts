import { env } from 'env'

interface SocialMedia {
	platform: string
	url: string
	handle?: string
}

interface Navigation {
	name: string
	path: string
	children?: Omit<Navigation, 'children'>[]
}

// Get public environment variables
const getPublicBaseUrl = (): string => {
	// We can now safely use the client environment variables
	return env.NEXT_PUBLIC_BASE_URL
}

export const siteConfig = {
	name: 'RYOA',
	description: 'Next.js application with custom-rolled architecture',

	// URLs
	url: {
		base: getPublicBaseUrl(),
		production: 'https://ryoa.remcostoeten.com',
	},

	// Social media
	socialMedia: [
		{
			platform: 'GitHub',
			url: 'https://github.com/remcostoeten/ryoa',
			handle: '@remcostoeten',
		},
		{
			platform: 'Twitter',
			url: 'https://twitter.com/yowremco',
			handle: '@yowremco',
		},
	] as SocialMedia[],
}
