export const siteConfig = {
	name: 'ryoa',
	description:
		'Roll your own authentication in NextJS 15, enterprise styled with a modular and easily to extend codebase.',
	url: 'https://ryoa.com',
	ogImage: 'https://ryoa.com/og.jpg',
	creator: {
		name: 'Remco Stoeten',
		twitter: '@yowremco',
		github: '@yowremco',
		url: 'https://github.com/remcostoeten',
	},
} as const;

export const navigationConfig = {
	mainNav: [
		{
			title: 'Home',
			href: '/',
		},
		{
			title: 'Documentation',
			href: '/docs',
		},
		{
			title: 'Guides',
			href: '/guides',
		},
		{
			title: 'Pricing',
			href: '/pricing',
		},
	],
} as const;

export type SiteConfig = typeof siteConfig;
export type NavigationConfig = typeof navigationConfig;
