import { Metadata } from 'next'
import { siteConfig } from './shared.metadata'

type MetadataProps = {
	title?: string
	description?: string
	image?: string
	noIndex?: boolean
}

export function constructMetadata({
	title,
	description,
	image,
	noIndex
}: MetadataProps = {}): Metadata {
	return {
		title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
		description: description || siteConfig.description,
		openGraph: {
			title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
			description: description || siteConfig.description,
			images: [{ url: image || siteConfig.ogImage }],
			url: siteConfig.url,
			siteName: siteConfig.name,
			locale: 'en_US',
			type: 'website'
		},
		twitter: {
			card: 'summary_large_image',
			title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
			description: description || siteConfig.description,
			images: [image || siteConfig.ogImage],
			creator: siteConfig.author.twitter
		},
		robots: {
			index: !noIndex,
			follow: !noIndex,
			googleBot: {
				index: !noIndex,
				follow: !noIndex
			}
		},
		authors: [
			{
				name: siteConfig.author.name,
				url: siteConfig.author.url
			}
		],
		creator: siteConfig.author.name,
		metadataBase: new URL(siteConfig.url)
	}
}
