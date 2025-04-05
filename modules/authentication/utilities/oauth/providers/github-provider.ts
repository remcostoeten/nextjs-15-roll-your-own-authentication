import { BaseOAuthProvider } from "./base-provider"
import type { OAuthConfig, OAuthProvider, OAuthUserInfo } from "../types"

export class GitHubProvider extends BaseOAuthProvider {
  constructor(config: OAuthConfig) {
    const provider: OAuthProvider = {
      id: "github",
      name: "GitHub",
      icon: "github",
      color: "#24292e",
      authUrl: "https://github.com/login/oauth/authorize",
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
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: this.config.redirectUri,
      }),
    })

    const data = await response.json()
    return data.access_token
  }

  async getUserInfo(token: string): Promise<OAuthUserInfo> {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    })

    const userData = await response.json()

    // Get email (might be private)
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${token}`,
      },
    })

    const emails = await emailResponse.json()
    const primaryEmail = emails.find((email: any) => email.primary)?.email || emails[0]?.email

    // Parse name into first and last name
    let firstName = userData.name
    let lastName = ""

    if (userData.name && userData.name.includes(" ")) {
      const nameParts = userData.name.split(" ")
      firstName = nameParts[0]
      lastName = nameParts.slice(1).join(" ")
    }

    return {
      id: userData.id.toString(),
      email: primaryEmail || `${userData.id}@github.noemail.com`,
      name: userData.name || userData.login,
      firstName,
      lastName,
      avatar: userData.avatar_url,
      username: userData.login,
      provider: "github",
    }
  }
}

