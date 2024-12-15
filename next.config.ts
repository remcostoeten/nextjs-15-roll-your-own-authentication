import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			// {
			// protocol: 'https',
			// hostname: 'avatars.githubusercontent.com',
			// port:/ '',
			// pathname: '/u/**'
			// },
			{
				protocol: 'https',
				hostname: '*github*',
				port: '',
				pathname: '**'
			},
			{
				protocol: 'https',
				hostname: '*google*',
				port: '',
				pathname: '**'
			}
			// {
			// protocol: 'https',
			// hostname: 'lh3.googleusercontent.com',
			// port: '',
			// pathname: '**'
			// }
			// {
			//   protocol: 'https',
			//   hostname: 'private-avatars.githubusercontent.com" ',
			//   port: '',
			//   pathname: '**'
			// }
		]
	}
}

export default nextConfig