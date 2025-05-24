import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.plugins.push(
				new MiniCssExtractPlugin({
					filename: 'static/css/[contenthash].css',
					chunkFilename: 'static/css/[contenthash].css',
					ignoreOrder: true,
				})
			);
		}
		return config;
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
