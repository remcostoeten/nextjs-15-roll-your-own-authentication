import type { Metadata } from 'next'
import { siteConfig } from '../site'

export const RootMetadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`
	},
	description: siteConfig.description,
	metadataBase: new URL(siteConfig.baseUrl)
}
