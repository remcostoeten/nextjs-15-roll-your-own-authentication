import { oauthAccounts, users } from '@/api/db/schema';
import { db } from 'db';
import { eq } from 'drizzle-orm';
import { createSession } from '../helpers/session';
import { TAuthUser } from '../types';
import { TOAuthConfig, TOAuthProvider, TOAuthState, TOAuthTokenResponse, TOAuthUserInfo } from '../types/oauth';

export class OAuth2Service {
  private config: TOAuthConfig;
  private provider: TOAuthProvider;

  constructor(provider: TOAuthProvider, config: TOAuthConfig) {
    this.provider = provider;
    this.config = config;
  }

  generateAuthUrl(state: TOAuthState): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope.join(' '),
      state: JSON.stringify(state),
      response_type: 'code',
    });

    return `${this.config.authorizeUrl}?${params.toString()}`;
  }

  async getAccessToken(code: string): Promise<TOAuthTokenResponse> {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      code,
      redirect_uri: this.config.redirectUri,
      grant_type: 'authorization_code',
    });

    const response = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    return response.json();
  }

  async getUserInfo(accessToken: string): Promise<TOAuthUserInfo> {
    const response = await fetch(this.config.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    const data = await response.json();
    return this.mapUserInfo(data, accessToken);
  }

  protected mapUserInfo(_data: any, _accessToken: string): TOAuthUserInfo {
    throw new Error('mapUserInfo must be implemented by provider-specific service');
  }

  async handleCallback(code: string): Promise<{ user: TAuthUser; isNewUser: boolean }> {
    const { access_token } = await this.getAccessToken(code);
    const userInfo = await this.getUserInfo(access_token);

    // Check if user exists by email
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, userInfo.email),
    });

    if (existingUser) {
      // Check if user has password auth
      if (existingUser.password) {
        throw new Error('Account already exists with email/password login');
      }

      // Update or create OAuth account
      await db
        .insert(oauthAccounts)
        .values({
          userId: existingUser.id,
          provider: this.provider,
          providerAccountId: userInfo.providerAccountId,
          accessToken: userInfo.accessToken,
        })
        .onConflictDoUpdate({
          target: [oauthAccounts.provider, oauthAccounts.providerAccountId],
          set: { accessToken: userInfo.accessToken },
        });

      await createSession(existingUser);
      return { user: existingUser as TAuthUser, isNewUser: false };
    }

    // Create new user and OAuth account
    const [newUser] = await db
      .insert(users)
      .values({
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.avatar,
        emailVerified: new Date(), // OAuth emails are verified
      })
      .returning();

    await db.insert(oauthAccounts).values({
      userId: newUser.id,
      provider: this.provider,
      providerAccountId: userInfo.providerAccountId,
      accessToken: userInfo.accessToken,
    });

    await createSession(newUser);
    return { user: newUser as TAuthUser, isNewUser: true };
  }
}
