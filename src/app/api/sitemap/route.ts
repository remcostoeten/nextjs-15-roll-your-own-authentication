import { NextResponse } from 'next/server'
import { siteConfig } from '../../../config/site'

/**
 * Dynamic sitemap generation endpoint
 * Use this for dynamic routes that can't be included in the static sitemap
 */
export async function GET() {
	const baseUrl = siteConfig.baseUrl

	// Generate XML sitemap
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${generateUrlXml(baseUrl)}
    </urlset>`

	// Return XML response
	return new NextResponse(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	})
}

function generateUrlXml(baseUrl: string): string {
	const urls = [
		'',
		'/docs',
		'/guides/client',
		'/guides/server',
		'/changelog',
		'/blog'
	]

	return urls
		.map(
			(path) => `
        <url>
            <loc>${baseUrl}${path}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>${path === '' ? 'daily' : 'weekly'}</changefreq>
            <priority>${path === '' ? '1.0' : '0.8'}</priority>
        </url>
    `
		)
		.join('')
}
