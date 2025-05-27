import { env } from '@/api/env';
import { TOAuthConfig, TOAuthUserInfo } from '../types/oauth';
import { OAuth2Service } from './oauth2-service';

const GOOGLE_OAUTH_CONFIG: TOAuthConfig = {
	clientId: env.GOOGLE_CLIENT_ID,
	clientSecret: env.GOOGLE_CLIENT_SECRET,
	authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
	tokenUrl: 'https://oauth2.googleapis.com/token',
	userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
	scope: ['openid', 'email', 'profile'],
	redirectUri: `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
};

export class GoogleOAuthService extends OAuth2Service {
	constructor() {
		super('google', GOOGLE_OAUTH_CONFIG);
	}

	protected async mapUserInfo(data: any, accessToken: string): Promise<TOAuthUserInfo> {
		if (!data.email) {
			throw new Error('No email found in Google profile');
		}

		if (!data.verified_email) {
			throw new Error('Email not verified with Google');
		}

		return {
			id: data.id,
			email: data.email,
			name: data.name,
			avatar: data.picture,
			provider: 'google',
			providerAccountId: data.id,
			accessToken,
			raw: data,
		};
	}
}
