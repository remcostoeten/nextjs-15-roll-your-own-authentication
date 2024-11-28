import { MetadataRoute } from 'next'
import { siteConfig } from '../config/site'

/**
 * Generate dynamic sitemap for the application
 * @returns {MetadataRoute.Sitemap} Sitemap configuration
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = siteConfig.baseUrl

	// Static routes that should always be included
	const staticRoutes = [
		'',
		'/docs',
		'/guides/client',
		'/guides/server',
		'/changelog',
		'/blog'
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: 'daily' as const,
		priority: route === '' ? 1 : 0.8
	}))

	// Documentation routes - higher priority for SEO
	const docRoutes = [
		'/docs/getting-started',
		'/docs/authentication',
		'/docs/security',
		'/docs/customization'
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: 'weekly' as const,
		priority: 0.9
	}))

	// Blog routes - medium priority, frequently updated
	const blogRoutes = [
		'/blog/introduction',
		'/blog/features',
		'/blog/security-best-practices'
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: 'weekly' as const,
		priority: 0.7
	}))

	// Combine all routes
	return [...staticRoutes, ...docRoutes, ...blogRoutes]
}
