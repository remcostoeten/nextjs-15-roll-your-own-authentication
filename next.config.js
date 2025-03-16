/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Exclude problematic dependencies from webpack processing
            config.module.rules.push({
                test: /node_modules\/@mapbox\/node-pre-gyp\/.*\.html$/,
                loader: 'ignore-loader',
            })

            // Handle Node.js modules
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                os: false,
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                buffer: require.resolve('buffer/'),
            }

            // Add buffer polyfill
            const webpack = require('webpack')
            config.plugins.push(
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                })
            )
        }

        return config
    },
}

module.exports = nextConfig 