import type { OAuthConfig, OAuthProvider, OAuthUserInfo } from "../types"

export abstract class BaseOAuthProvider {
  protected config: OAuthConfig
  protected provider: OAuthProvider

  constructor(config: OAuthConfig, provider: OAuthProvider) {
    this.config = config
    this.provider = provider
  }

  getProvider(): OAuthProvider {
    return this.provider
  }

  getAuthUrl(state: string): string {
    return this.buildAuthUrl(state)
  }

  protected abstract buildAuthUrl(state: string): string

  abstract getToken(code: string): Promise<string>

  abstract getUserInfo(token: string): Promise<OAuthUserInfo>
}

