export type TOAuthProvider = 'github' | 'google';

export type TOAuthConfig = {
	clientId: string;
	clientSecret: string;
	authorizeUrl: string;
	tokenUrl: string;
	userInfoUrl: string;
	scope: string[];
	redirectUri: string;
};

export type TOAuthState = {
	provider: TOAuthProvider;
	redirectTo?: string;
};

export type TOAuthTokenResponse = {
	access_token: string;
	token_type: string;
	scope: string;
};

export type TOAuthUserInfo = {
	id: string;
	email: string;
	name?: string;
	avatar?: string;
	provider: TOAuthProvider;
	providerAccountId: string;
	accessToken: string;
	raw: Record<string, any>;
};

export type TOAuthAccount = {
	id: string;
	userId: string;
	provider: TOAuthProvider;
	providerAccountId: string;
	accessToken: string;
	createdAt: Date;
	updatedAt: Date;
};
