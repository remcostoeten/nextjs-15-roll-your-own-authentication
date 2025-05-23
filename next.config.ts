import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			// Don't attempt to load these server-only modules on the client
			config.resolve.fallback = {
				...config.resolve.fallback,
				'pg-native': false,
				'cloudflare:sockets': false,
			};
		}
		return config;
	},
};

export default nextConfig;
