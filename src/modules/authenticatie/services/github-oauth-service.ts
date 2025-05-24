import { env } from '@/api/env';
import { TOAuthConfig, TOAuthUserInfo } from '../types/oauth';
import { OAuth2Service } from './oauth2-service';

const GITHUB_OAUTH_CONFIG: TOAuthConfig = {
	clientId: env.GITHUB_CLIENT_ID,
	clientSecret: env.GITHUB_CLIENT_SECRET,
	authorizeUrl: 'https://github.com/login/oauth/authorize',
	tokenUrl: 'https://github.com/login/oauth/access_token',
	userInfoUrl: 'https://api.github.com/user',
	scope: ['read:user', 'user:email'],
	redirectUri: `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`,
};

export class GitHubOAuthService extends OAuth2Service {
	constructor() {
		super('github', GITHUB_OAUTH_CONFIG);
	}

	protected async mapUserInfo(data: any, accessToken: string): Promise<TOAuthUserInfo> {
		// GitHub might not return email in the user info, need to fetch it separately
		let email = data.email;
		if (!email) {
			const emailsResponse = await fetch('https://api.github.com/user/emails', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: 'application/json',
				},
			});

			if (emailsResponse.ok) {
				const emails = await emailsResponse.json();
				const primaryEmail = emails.find((e: any) => e.primary && e.verified);
				if (primaryEmail) {
					email = primaryEmail.email;
				}
			}
		}

		if (!email) {
			throw new Error('No verified email found');
		}

		return {
			id: data.id.toString(),
			email,
			name: data.name || data.login,
			avatar: data.avatar_url,
			provider: 'github',
			providerAccountId: data.id.toString(),
			accessToken,
			raw: data,
		};
	}
}
