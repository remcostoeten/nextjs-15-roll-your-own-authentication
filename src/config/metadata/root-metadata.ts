import getAbsoluteUrl from '@/shared/helpers/get-absolute-path'
import { Metadata, Viewport } from 'next'
import { siteConfig } from '../site'
export const viewport: Viewport = {
	viewportFit: 'cover',
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'white' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' }
	]
}

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`
	},
	description: siteConfig.description,
	authors: {
		name: siteConfig.name
	},
	creator: siteConfig.name,
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: siteConfig.baseUrl,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.name,
		description: siteConfig.description,
		creator: siteConfig.name
	},
	icons: {
		icon: [
			{ url: '/favicon.ico', sizes: '32x32' },
			{ url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
			{ url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
			{ url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
			{ url: '/icon-512.png', type: 'image/png', sizes: '512x512' }
		],
		apple: [{ url: '/apple-icon.png', type: 'image/png' }]
	},
	metadataBase: new URL(getAbsoluteUrl('/'))
}
