import { GitHubOAuthService } from '@/modules/authenticatie/services/github-oauth-service';
import { GoogleOAuthService } from '@/modules/authenticatie/services/google-oauth-service';
import { TOAuthProvider } from '@/modules/authenticatie/types/oauth';
import { NextRequest, NextResponse } from 'next/server';

const OAUTH_SERVICES = {
	github: new GitHubOAuthService(),
	google: new GoogleOAuthService(),
};

export async function GET(request: NextRequest) {
	try {
		const pathname = request.nextUrl.pathname;
		const parts = pathname.split('/');
		const provider = parts[parts.length - 1] as TOAuthProvider;

		const searchParams = request.nextUrl.searchParams;
		const code = searchParams.get('code');
		const state = searchParams.get('state');
		const error = searchParams.get('error');

		if (error) {
			return NextResponse.redirect(
				new URL(
					`/login?error=${encodeURIComponent(
						error
					)}&toast=error&message=${encodeURIComponent('Authentication failed')}`,
					request.url
				)
			);
		}

		if (!code || !state) {
			return NextResponse.redirect(
				new URL(
					`/login?error=${encodeURIComponent(
						'Missing code or state'
					)}&toast=error&message=${encodeURIComponent('Authentication failed')}`,
					request.url
				)
			);
		}

		const service = OAUTH_SERVICES[provider];
		if (!service) {
			return NextResponse.redirect(
				new URL(
					`/login?error=${encodeURIComponent(
						'Invalid provider'
					)}&toast=error&message=${encodeURIComponent('Authentication failed')}`,
					request.url
				)
			);
		}

		const { redirectTo = '/dashboard' } = JSON.parse(state);
		const { user, isNewUser } = await service.handleCallback(code);

		const successParam = isNewUser ? '&welcome=true' : '';
		return NextResponse.redirect(
			new URL(`${redirectTo}?success=true${successParam}`, request.url)
		);
	} catch (error) {
		console.error('OAuth callback error:', error);
		const message = error instanceof Error ? error.message : 'Authentication failed';
		return NextResponse.redirect(
			new URL(
				`/login?error=${encodeURIComponent(
					message
				)}&toast=error&message=${encodeURIComponent(message)}`,
				request.url
			)
		);
	}
}
