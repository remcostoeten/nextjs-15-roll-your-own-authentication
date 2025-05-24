export type TBaseEntity = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
};

export type TBaseUser = TBaseEntity & {
	email: string;
	role: TUserRole;
	name?: string | null;
	avatar?: string | null;
	emailVerified?: Date | null;
	lastLoginAt?: Date | null;
};

export type TUserRole = 'admin' | 'user';

export type TBaseSession = TBaseEntity & {
	userId: string;
	expiresAt: Date;
};

export type TBaseResponse<T = void> = {
	success: boolean;
	data?: T;
	error?: string;
};

export type TBaseMutationResponse<T = void> = TBaseResponse<T> & {
	message?: string;
	redirect?: string;
};

// Database types that include password
export type TBaseUserWithPassword = TBaseUser & {
	password: string;
};
