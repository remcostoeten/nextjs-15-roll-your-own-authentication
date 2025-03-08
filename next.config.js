/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack: (config, { isServer }) => {
		// This is necessary to exclude native Node.js modules from the client-side bundle
		if (!isServer) {
			// Don't bundle native Node.js modules in the client-side bundle
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
				crypto: false,
				path: false,
				os: false,
				http: false,
				https: false,
				stream: false,
				zlib: false,
				child_process: false,
			}

			// Exclude problematic modules from client-side bundling
			config.externals = [
				...(config.externals || []),
				'bcrypt',
				'better-sqlite3',
				'sqlite3',
				'pg',
				'pg-native',
				'@mapbox/node-pre-gyp',
			]
		}

		return config
	},
	// Specify which files should run in Edge Runtime
	experimental: {
		// Allow middleware.ts to run in Edge Runtime
		middleware: {
			// Skip typechecking so we can use DB client functions in middleware matcher
			skipMiddlewareUrlNormalize: true,
			skipTrailingSlashRedirect: true,
		},
	},
}

module.exports = nextConfig
