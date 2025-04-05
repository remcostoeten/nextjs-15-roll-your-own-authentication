export interface OAuthProvider {
  id: string
  name: string
  icon: string
  color: string
  authUrl: string
}

export interface OAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string
}

export interface OAuthUserInfo {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  avatar?: string
  username?: string
  provider: string
}

