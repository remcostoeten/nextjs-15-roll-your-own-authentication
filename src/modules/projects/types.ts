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
