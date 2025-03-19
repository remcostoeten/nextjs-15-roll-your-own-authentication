interface Tool {
	title: string
	description: string
	href: string
	tag?: {
		text: string
		type: 'new' | 'soon'
	}
	isLarge?: boolean
}

interface MatrixGridContent {
	header: {
		title: string
		subtitle: string
	}
	tools: Tool[]
}

export const matrixGridContent: MatrixGridContent = {
	header: {
		title: 'Build secure authentication without dependencies.',
		subtitle:
			"Because real developers don't need training wheels. Or the weekly breaking changes from auth libraries.",
	},
	tools: [
		{
			title: 'RollYourOwnAuth',
			description:
				"Imagine telling others at a party that you roll your own auth while everyone else is busy debugging their Clerk webhooks. You'd be the talk of the evening. And just wait until you mention vim and Arch Linux. Instant adonis status.",
			href: '/rollyourownauth',
			tag: { text: 'New', type: 'new' },
			isLarge: true,
		},
		{
			title: 'Session Management',
			description:
				"Implement secure session handling with SQLite/Postgres. No dependencies needed. No 'Sorry we changed our API again' blog posts to read.",
			href: '/sessions',
		},
		{
			title: 'OAuth2 Implementation',
			description:
				"Build your own OAuth2 flow from scratch. Because you can. And because you're tired of NextAuth's cryptic error messages that send you to Stack Overflow at 2 AM.",
			href: '/oauth2',
		},
		{
			title: 'JWT Tokens',
			description:
				"Create and validate JWTs without external libraries. Pure crypto. No more 'This package is 3 years out of date but we still depend on it' surprises.",
			href: '/jwt',
			tag: { text: 'Soon', type: 'soon' },
		},
		{
			title: 'User Management',
			description:
				"Complete CRUD operations for user administration. Zero dependencies. Zero 'Please upgrade to our premium plan to access basic features' notifications.",
			href: '/user-management',
		},
		{
			title: 'Role-Based Access',
			description:
				"Implement RBAC with protected routes and content. Pure Next.js. No more 'Sorry, we changed our pricing model again' emails in your inbox.",
			href: '/rbac',
		},
		{
			title: 'Feature Flags',
			description:
				"Build a feature flag system from scratch. Because why not? It's probably more reliable than waiting for Clerk's dashboard to load anyway.",
			href: '/feature-flags',
		},
	],
}
