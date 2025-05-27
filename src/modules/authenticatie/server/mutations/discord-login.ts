'use server';

import { DiscordOAuthService } from '../../services/discord-oauth-service';

export async function generateDiscordAuthUrl(redirectTo: string = '/dashboard') {
	const service = new DiscordOAuthService();
	const state = { provider: 'discord' as const, redirectTo };
	return service.generateAuthUrl(state);
}
