export const siteConfig = {
	baseUrl: 'https://rollyourownauth.remcostoeten.com',
	socials: {
		github: 'https://github.com/remcostoeten',
		x: 'https://x.com/yowremco'
	},
	name: 'Roll Your Own Auth',
	description:
		'A authentication solution for NextJS 15 & React 19 without depending on any other libraries like Lucia, Clerk or NextAuth/AuthJS.',
	repository:
		'https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication',
	quote: {
		text: 'Finally, a authentication solution that just works, without being afraid of library deprecations or the annoyance of not owning your data, have docs that are useless or needs dozens of patches.',
		name: 'Remco Stoeten'
	} as const
}
