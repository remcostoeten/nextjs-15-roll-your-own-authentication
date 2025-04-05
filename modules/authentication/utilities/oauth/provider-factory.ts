import type { BaseOAuthProvider } from "./providers/base-provider"
import { GitHubProvider } from "./providers/github-provider"
import { GoogleProvider } from "./providers/google-provider"
import { DiscordProvider } from "./providers/discord-provider"
import type { OAuthConfig } from "./types"

export class OAuthProviderFactory {
  private providers: Map<string, BaseOAuthProvider> = new Map()

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    // GitHub
    const githubConfig: OAuthConfig = {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      redirectUri: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      scope: "user:email",
    }
    this.providers.set("github", new GitHubProvider(githubConfig))

    // Google
    const googleConfig: OAuthConfig = {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectUri: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    }
    this.providers.set("google", new GoogleProvider(googleConfig))

    // Discord
    const discordConfig: OAuthConfig = {
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      redirectUri: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      scope: "identify email",
    }
    this.providers.set("discord", new DiscordProvider(discordConfig))
  }

  getProvider(providerId: string): BaseOAuthProvider | undefined {
    return this.providers.get(providerId)
  }

  getAllProviders(): BaseOAuthProvider[] {
    return Array.from(this.providers.values())
  }

  getMainProviders(): BaseOAuthProvider[] {
    return [this.providers.get("github")!, this.providers.get("google")!]
  }

  getAdditionalProviders(): BaseOAuthProvider[] {
    return [this.providers.get("discord")!]
  }
}

// Singleton instance
export const oauthProviderFactory = new OAuthProviderFactory()

