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
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	}
}

module.exports = nextConfig
