import { z } from 'zod'
import { OAUTH_PROVIDERS } from './constants'

export const oauthProviderSchema = z.enum(
	Object.values(OAUTH_PROVIDERS) as [string, ...string[]]
)

export const oauthStateSchema = z.object({
	provider: oauthProviderSchema,
	redirectTo: z.string().optional(),
	timestamp: z.number()
})

export const oauthConfigSchema = z.object({
	clientId: z.string(),
	clientSecret: z.string(),
	redirectUri: z.string().url()
})

export type OAuthState = z.infer<typeof oauthStateSchema>
export type OAuthConfig = z.infer<typeof oauthConfigSchema>
