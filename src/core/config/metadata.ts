import type { Metadata } from 'next'
import { siteConfig } from './site'

export const metadata: Metadata = {
	title: siteConfig.name,
	description: siteConfig.description,
	metadataBase: new URL(siteConfig.baseUrl)
	// Add other metadata properties as needed
}
