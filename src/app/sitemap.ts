import { siteConfig } from '@/core/config/site'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: siteConfig.baseUrl,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1
		},
		{
			url: `${siteConfig.baseUrl}/sign-up`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.8
		},
		{
			url: `${siteConfig.baseUrl}/sign-in`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.8
		},
	]
}
