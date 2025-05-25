import { Book, Sunset, Trees, Zap } from 'lucide-react';
import { Navbar } from './navigation';

const demoData = {
	logo: {
		url: 'https://www.shadcnblocks.com',
		src: 'https://www.shadcnblocks.com/images/block/block-1.svg',
		alt: 'blocks for shadcn/ui',
		title: 'Shadcnblocks.com',
	},
	menu: [
		{
			title: 'Docs',
			url: '#',
			items: [
				{
					title: 'Architecture',
					description: 'The architecture this project',
					icon: <Book className="size-5 shrink-0" />,
					url: '/docs/architecture',
				},
				{
					title: 'API',
					description: 'The API for the project',
					icon: <Trees className="size-5 shrink-0" />,
					url: '/docs/api',
				},
				{
					title: 'Enviorment variables',
					description: 'The enviorment variables for the project',
					icon: <Sunset className="size-5 shrink-0" />,
					url: '/docs/enviorment-variables',
				},
				{
					title: 'Features',
					description: 'The features of the project',
					icon: <Zap className="size-5 shrink-0" />,
					url: '/docs/features',
				},
			],
		},

		{
			title: 'Blog',
			url: '/blog',
		},
	],
	mobileExtraLinks: [
		{ name: 'Press', url: '/press' },
		{ name: 'Contact', url: '/contact' },
		{ name: 'Imprint', url: '/imprint' },
		{ name: 'Sitemap', url: '/sitemap' },
	],
	auth: {
		login: { text: 'Log in', url: '/login' },
		signup: { text: 'Sign up', url: '/register' },
	},
};

function Header() {
	return <Navbar {...demoData} />;
}

export { Header };
