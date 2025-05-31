import { env } from '@/api/env';
import { TOAuthConfig, TOAuthUserInfo } from '../types/oauth';
import { OAuth2Service } from './oauth2-service';

const DISCORD_OAUTH_CONFIG: TOAuthConfig = {
	clientId: env.DISCORD_CLIENT_ID,
	clientSecret: env.DISCORD_CLIENT_SECRET,
	authorizeUrl: 'https://discord.com/api/oauth2/authorize',
	tokenUrl: 'https://discord.com/api/oauth2/token',
	userInfoUrl: 'https://discord.com/api/users/@me',
	scope: ['identify', 'email'],
	redirectUri: `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/discord`,
};

export class DiscordOAuthService extends OAuth2Service {
	constructor() {
		super('discord', DISCORD_OAUTH_CONFIG);
	}

	protected async mapUserInfo(data: any, accessToken: string): Promise<TOAuthUserInfo> {
		if (!data.email) {
			throw new Error('No email found in Discord profile');
		}

		if (!data.verified) {
			throw new Error('Email not verified with Discord');
		}

		return {
			id: data.id,
			email: data.email,
			name: data.global_name || data.username,
			avatar: data.avatar
				? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
				: null,
			provider: 'discord',
			providerAccountId: data.id,
			accessToken,
			raw: data,
		};
	}
}
