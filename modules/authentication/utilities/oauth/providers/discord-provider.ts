import { BaseOAuthProvider } from "./base-provider"
import type { OAuthConfig, OAuthProvider, OAuthUserInfo } from "../types"

export class DiscordProvider extends BaseOAuthProvider {
  constructor(config: OAuthConfig) {
    const provider: OAuthProvider = {
      id: "discord",
      name: "Discord",
      icon: "discord",
      color: "#5865F2",
      authUrl: "https://discord.com/api/oauth2/authorize",
    }
    super(config, provider)
  }

  protected buildAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      state,
      response_type: "code",
    })

    return `${this.provider.authUrl}?${params.toString()}`
  }

  async getToken(code: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      code,
      redirect_uri: this.config.redirectUri,
      grant_type: "authorization_code",
    })

    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    const data = await response.json()
    return data.access_token
  }

  async getUserInfo(token: string): Promise<OAuthUserInfo> {
    const response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const userData = await response.json()

    // Discord doesn't provide first/last name, so we'll use the username
    return {
      id: userData.id,
      email: userData.email,
      name: userData.global_name || userData.username,
      username: userData.username,
      avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : undefined,
      provider: "discord",
    }
  }
}

