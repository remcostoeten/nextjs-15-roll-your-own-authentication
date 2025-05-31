import { TBaseUser, TBaseEntity } from '@/shared/types/base';

export type TWorkspace = TBaseWorkspace & {
	owner: Pick<TBaseUser, 'id' | 'name' | 'email' | 'avatar'>;
	memberCount: number;
	userRole?: TWorkspaceMemberRole;
};

export type TWorkspaceMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export type TBaseWorkspace = TBaseEntity & {
	title: string;
	emoji: string;
	description?: string | null;
	ownerId: string;
	isPersonal: boolean;
};

export type TWorkspaceWithOwner = TBaseWorkspace & {
	owner: Pick<TBaseUser, 'id' | 'name' | 'email' | 'avatar'>;
	memberCount: number;
	userRole?: TWorkspaceMemberRole;
};

export type TWorkspaceMember = TBaseEntity & {
	workspaceId: string;
	userId: string;
	role: TWorkspaceMemberRole;
	invitedBy?: string | null;
	joinedAt: Date;
	user: Pick<TBaseUser, 'id' | 'name' | 'email' | 'avatar'>;
};

export type TWorkspaceInvite = TBaseEntity & {
	workspaceId: string;
	email: string;
	role: TWorkspaceMemberRole;
	invitedBy: string;
	token: string;
	expiresAt: Date;
	acceptedAt?: Date | null;
	inviter: Pick<TBaseUser, 'id' | 'name' | 'email'>;
	workspace: Pick<TBaseWorkspace, 'id' | 'title' | 'emoji'>;
};
