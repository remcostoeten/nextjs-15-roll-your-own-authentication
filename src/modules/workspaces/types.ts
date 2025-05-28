import { TBaseEntity, TBaseUser } from '@/shared/types/base';

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

// src/modules/projects/types.ts
import { TBaseEntity, TBaseUser } from '@/shared/types/base';
import { TBaseWorkspace } from '../workspaces/types';

export type TProjectStatus = 'active' | 'completed' | 'archived' | 'on_hold';

export type TBaseProject = TBaseEntity & {
	workspaceId: string;
	title: string;
	description?: string | null;
	emoji?: string | null;
	status: TProjectStatus;
	ownerId: string;
	dueDate?: Date | null;
};

export type TProjectWithDetails = TBaseProject & {
	owner: Pick<TBaseUser, 'id' | 'name' | 'email' | 'avatar'>;
	workspace: Pick<TBaseWorkspace, 'id' | 'title' | 'emoji'>;
	taskCount: number;
	completedTaskCount: number;
};

// src/modules/tasks/types.ts
import { TBaseEntity, TBaseUser } from '@/shared/types/base';
import { TBaseProject } from '../projects/types';

export type TTaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';
export type TTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TBaseTask = TBaseEntity & {
	projectId: string;
	title: string;
	description?: string | null;
	status: TTaskStatus;
	priority: TTaskPriority;
	assigneeId?: string | null;
	createdBy: string;
	dueDate?: Date | null;
	completedAt?: Date | null;
};

export type TTaskWithDetails = TBaseTask & {
	assignee?: Pick<TBaseUser, 'id' | 'name' | 'email' | 'avatar'> | null;
	creator: Pick<TBaseUser, 'id' | 'name' | 'email' | 'avatar'>;
	project: Pick<TBaseProject, 'id' | 'title' | 'emoji'>;
};
