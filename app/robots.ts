import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ''
		},
		sitemap: 'https://rollyourownauth.remcostoeten.com/sitemap.xml'
	}
}
