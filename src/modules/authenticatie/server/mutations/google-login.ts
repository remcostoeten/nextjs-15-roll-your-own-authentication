'use server';

import { GoogleOAuthService } from '../../services/google-oauth-service';

export async function generateGoogleAuthUrl(redirectTo = '/dashboard') {
	const service = new GoogleOAuthService();
	const state = { provider: 'google' as const, redirectTo };
	return service.generateAuthUrl(state);
}
