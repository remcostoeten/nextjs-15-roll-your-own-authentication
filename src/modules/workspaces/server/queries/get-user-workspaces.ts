'use server';

import { getSession } from '@/modules/authenticatie/helpers/session';
import { db } from 'db';
import { eq, sql } from 'drizzle-orm';
import { users, workspaceMembers, workspaces } from 'schema';
import { TWorkspaceWithOwner } from '../../types';

export async function getUserWorkspaces(): Promise<TWorkspaceWithOwner[]> {
	const session = await getSession();
	if (!session) return [];

	try {
		const userWorkspaces = await db
			.select({
				id: workspaces.id,
				title: workspaces.title,
				emoji: workspaces.emoji,
				description: workspaces.description,
				ownerId: workspaces.ownerId,
				isPersonal: workspaces.isPersonal,
				createdAt: workspaces.createdAt,
				updatedAt: workspaces.updatedAt,
				owner: {
					id: users.id,
					name: users.name,
					role: workspaceMembers.role,
				},
				memberCount: sql<number>`(
					SELECT COUNT(*)::int
					FROM ${workspaceMembers} wm
					WHERE wm.workspace_id = ${workspaces.id}
				)`,
			})
			.from(workspaces)
			.innerJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id))
			.innerJoin(users, eq(users.id, workspaces.ownerId))
			.where(eq(workspaceMembers.userId, session.id))
			.orderBy(workspaces.createdAt);

		return userWorkspaces.map((workspace) => ({
			...workspace,
			memberCount: workspace.memberCount,
			owner: {
				id: workspace.owner.id,
				name: workspace.owner.name || '',
				email: '',
				avatar: null,
			},
			userRole: workspace.owner.role,
		}));
	} catch (error) {
		console.error('Get user workspaces error:', error);
		return [];
	}
}
