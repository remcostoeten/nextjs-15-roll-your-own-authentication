import { Metadata } from 'next'

export const rootLayoutMetadata: Metadata = {
	title: {
		default: 'Roll your own auth',
		template: '%s | Roll your own auth'
	},
	description:
		'A showcase and tutorial for building your own authentication system.',
	keywords: [
		'authentication',
		'tutorial',
		'nextjs',
		'react',
		'typescript',
		'prisma',
		'tailwindcss'
	],
	authors: [
		{
			name: 'Remco Stoeten',
			url: 'https://github.com/remcostoeten'
		}
	],
	creator: 'Remco Stoeten',
	metadataBase: new URL('https://rollyourownauth.com'),
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://rollyourownauth.com',
		title: 'Roll your own auth',
		description:
			'A showcase and tutorial for building your own authentication system.',
		siteName: 'Roll your own auth'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Roll your own auth',
		description:
			'A showcase and tutorial for building your own authentication system.',
		creator: '@remcostoeten'
	},
	robots: {
		index: true,
		follow: true
	}
}
