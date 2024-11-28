/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['localhost', 'uploadthing.com', 'utfs.io']
	},
	async redirects() {
		return []
	},
	async rewrites() {
		return []
	}
}

module.exports = nextConfig
