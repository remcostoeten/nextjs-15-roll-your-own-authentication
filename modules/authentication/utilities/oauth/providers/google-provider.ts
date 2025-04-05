import { BaseOAuthProvider } from "./base-provider"
import type { OAuthConfig, OAuthProvider, OAuthUserInfo } from "../types"

export class GoogleProvider extends BaseOAuthProvider {
  constructor(config: OAuthConfig) {
    const provider: OAuthProvider = {
      id: "google",
      name: "Google",
      icon: "google",
      color: "#4285F4",
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
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
      access_type: "offline",
      prompt: "consent",
    })

    return `${this.provider.authUrl}?${params.toString()}`
  }

  async getToken(code: string): Promise<string> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: this.config.redirectUri,
        grant_type: "authorization_code",
      }),
    })

    const data = await response.json()
    return data.access_token
  }

  async getUserInfo(token: string): Promise<OAuthUserInfo> {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const userData = await response.json()

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      firstName: userData.given_name,
      lastName: userData.family_name,
      avatar: userData.picture,
      provider: "google",
    }
  }
}

