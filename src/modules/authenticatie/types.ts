import type { TBaseMutationResponse, TBaseUser } from '@/shared/types/base';

export type TAuthUser = TBaseUser;

export type TAuthState =
	| { status: 'loading' }
	| { status: 'authenticated'; user: TAuthUser }
	| { status: 'unauthenticated' };

export type TLoginData = {
	email: string;
	password: string;
	remember?: boolean;
};

export type TRegisterData = TLoginData & {
	name?: string;
};

export type TUpdateProfileData = {
	email?: string;
	currentPassword?: string;
	newPassword?: string;
	name?: string;
	avatar?: string;
};

export type TAuthMutationResponse<T = void> = TBaseMutationResponse<T> & {
	user?: TAuthUser;
	token?: string;
};
