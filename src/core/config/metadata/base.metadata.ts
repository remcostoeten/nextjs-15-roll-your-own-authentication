/**
 * @author Remco Stoeten
 * @description Core metadata configuration that serves as the foundation for all view-specific metadata.
 * Implements a composable metadata pattern for consistent meta-information across all views with granular override support.
 */

import { siteConfig } from '@/core/site-config';
import type { Metadata } from 'next';

// Split social media metadata to be loaded only when needed
const getSocialMetadata = () => ({
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: siteConfig.name,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.name,
		description: siteConfig.description,
		creator: siteConfig.creator.twitter,
		images: [siteConfig.ogImage],
	},
});

export function baseMetadata(): Metadata {
	return {
		metadataBase: new URL(siteConfig.url),
		title: {
			default: siteConfig.name,
			template: `%s | ${siteConfig.name}`,
		},
		description: siteConfig.description,
		keywords: [
			'next.js',
			'react',
			'typescript',
			'authentication',
			'enterprise',
			'architecture',
		],
		authors: [
			{
				name: siteConfig.creator.name,
				url: siteConfig.creator.url,
			},
		],
		creator: siteConfig.creator.name,
		robots: {
			index: true,
			follow: true,
		},
		...getSocialMetadata(),
	};
}
