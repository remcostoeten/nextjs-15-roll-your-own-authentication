import { db } from "@/server/db"
import { users, oauthAccounts } from "@/server/db/schema"
import { eq, and } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { generateToken } from "../auth"
import { oauthProviderFactory } from "./provider-factory"
import type { OAuthUserInfo } from "./types"
import { cookies } from "next/headers"
import { logUserActivity } from "../auth"

export class OAuthService {
  async initiateOAuth(providerId: string): Promise<string> {
    const provider = oauthProviderFactory.getProvider(providerId)

    if (!provider) {
      throw new Error(`Provider ${providerId} not found`)
    }

    // Generate a state parameter to prevent CSRF
    const state = uuidv4()

    // Store state in a cookie for verification
    cookies().set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    })

    // Generate the authorization URL
    return provider.getAuthUrl(state)
  }

  async handleCallback(
    providerId: string,
    code: string,
    state: string,
  ): Promise<{ token: string; isNewUser: boolean }> {
    // Verify state parameter
    const storedState = cookies().get("oauth_state")?.value

    if (!storedState || storedState !== state) {
      throw new Error("Invalid state parameter")
    }

    // Clear the state cookie
    cookies().delete("oauth_state")

    // Get the provider
    const provider = oauthProviderFactory.getProvider(providerId)

    if (!provider) {
      throw new Error(`Provider ${providerId} not found`)
    }

    // Exchange code for token
    const token = await provider.getToken(code)

    // Get user info
    const userInfo = await provider.getUserInfo(token)

    // Find or create user
    return this.findOrCreateUser(userInfo)
  }

  private async findOrCreateUser(userInfo: OAuthUserInfo): Promise<{ token: string; isNewUser: boolean }> {
    // Check if OAuth account exists
    const existingOAuthAccount = await db.query.oauthAccounts.findFirst({
      where: and(eq(oauthAccounts.providerId, userInfo.provider), eq(oauthAccounts.providerAccountId, userInfo.id)),
    })

    if (existingOAuthAccount) {
      // User exists, get user and generate token
      const user = await db.query.users.findFirst({
        where: eq(users.id, existingOAuthAccount.userId),
      })

      if (!user) {
        throw new Error("User not found")
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error("Your account has been deactivated. Please contact an administrator.")
      }

      // Log activity
      await logUserActivity(user.id, "oauth_login", `Logged in with ${userInfo.provider}`)

      // Generate JWT token
      const jwtToken = await generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      })

      return { token: jwtToken, isNewUser: false }
    } else {
      // Check if user exists with the same email
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, userInfo.email),
      })

      if (existingUser) {
        // Link OAuth account to existing user
        await db.insert(oauthAccounts).values({
          userId: existingUser.id,
          providerId: userInfo.provider,
          providerAccountId: userInfo.id,
          createdAt: new Date(),
        })

        // Log activity
        await logUserActivity(existingUser.id, "oauth_link", `Linked ${userInfo.provider} account`)

        // Generate JWT token
        const jwtToken = await generateToken({
          id: existingUser.id,
          email: existingUser.email,
          role: existingUser.role,
        })

        return { token: jwtToken, isNewUser: false }
      } else {
        // Create new user
        const [newUser] = await db
          .insert(users)
          .values({
            email: userInfo.email,
            username: userInfo.username || `${userInfo.provider}_${userInfo.id}`,
            firstName: userInfo.firstName || userInfo.name.split(" ")[0],
            lastName: userInfo.lastName || userInfo.name.split(" ").slice(1).join(" ") || "",
            password: "", // OAuth users don't have a password
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning()

        // Link OAuth account to new user
        await db.insert(oauthAccounts).values({
          userId: newUser.id,
          providerId: userInfo.provider,
          providerAccountId: userInfo.id,
          createdAt: new Date(),
        })

        // Log activity
        await logUserActivity(newUser.id, "oauth_register", `Registered with ${userInfo.provider}`)

        // Generate JWT token
        const jwtToken = await generateToken({
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
        })

        return { token: jwtToken, isNewUser: true }
      }
    }
  }
}

// Singleton instance
export const oauthService = new OAuthService()

