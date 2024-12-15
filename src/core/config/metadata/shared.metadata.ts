export const siteConfig = {
	name: 'Roll your own auth',
	description:
		'A showcase and tutorial for building your own authentication system.',
	url: 'https://rollyourownauth.com',
	ogImage: 'https://rollyourownauth.com/og.jpg',
	author: {
		name: 'Remco Stoeten',
		github: 'remcostoeten',
		twitter: '@remcostoeten',
		url: 'https://github.com/remcostoeten'
	},
	links: {
		github: 'https://github.com/rollyourownauth',
		twitter: 'https://twitter.com/remcostoeten'
	}
} as const

export type SiteConfig = typeof siteConfig
