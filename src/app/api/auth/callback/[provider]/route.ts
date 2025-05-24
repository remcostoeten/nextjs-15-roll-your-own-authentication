import { GitHubOAuthService } from '@/modules/authenticatie/services/github-oauth-service';
import { TOAuthProvider } from '@/modules/authenticatie/types/oauth';
import { NextRequest } from 'next/server';

const OAUTH_SERVICES = {
  github: new GitHubOAuthService(),
};

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: TOAuthProvider } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return Response.redirect(
        `/login?error=${encodeURIComponent(error)}`
      );
    }

    if (!code || !state) {
      return Response.redirect(
        `/login?error=${encodeURIComponent('Missing code or state')}`
      );
    }

    const service = OAUTH_SERVICES[params.provider];
    if (!service) {
      return Response.redirect(
        `/login?error=${encodeURIComponent('Invalid provider')}`
      );
    }

    const { redirectTo = '/dashboard' } = JSON.parse(state);
    const { user, isNewUser } = await service.handleCallback(code);

    // Add a welcome message for new users
    const successParam = isNewUser ? '&welcome=true' : '';
    return Response.redirect(`${redirectTo}?success=true${successParam}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    const message = error instanceof Error ? error.message : 'Authentication failed';
    return Response.redirect(
      `/login?error=${encodeURIComponent(message)}`
    );
  }
}
