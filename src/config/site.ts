export const siteConfig = {
	name: 'Roll Your Own Auth',
	description:
		'A authentication solution for NextJS 15 & React 19 without depending on any other libraries like Lucia, Clerk or NextAuth/AuthJS.',
	baseUrl: 'https://rollyourownauth.remcostoeten.com',
	socials: {
		github: 'https://github.com/remcostoeten',
		x: 'https://x.com/yowremco'
	},
	repository:
		'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication',
	features: {
		authentication: {
			email: true,
			passwordless: true,
			twoFactor: true,
			socialLogin: false
		},
		security: {
			encryption: true,
			rateLimit: true,
			sessionManagement: true,
			passwordHashing: true
		},
		customization: {
			themes: true,
			layouts: true,
			components: true
		}
	},
	seoKeywords: [
		'NextJS authentication',
		'React auth solution',
		'custom authentication',
		'NextJS 15',
		'React 19',
		'passwordless auth',
		'two-factor authentication',
		'secure login',
		'user authentication',
		'session management',
		'rate limiting',
		'password hashing',
		'open source auth'
	],
	/**
	 * @todo
	 * - Add more testimonials
	 * - Add verified badge for quotes
	 * - Add date to quotes
	 * - Add avatar/image support
	 */
	quote: {
		text: 'Finally, a authentication solution that just works, without being afraid of library deprecations or the annoyance of not owning your data, have docs that are useless or needs dozens of patches.',
		name: 'Remco Stoeten'
	} as const
} as const

export type SiteConfig = typeof siteConfig
