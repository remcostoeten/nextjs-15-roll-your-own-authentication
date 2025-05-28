'use server';

import { db } from 'db';
import { workspaces, workspaceMembers, users } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TWorkspaceWithOwner } from '../../types';
import { eq, sql, count } from 'drizzle-orm';

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
					email: users.email,
					avatar: users.avatar,
				},
				userRole: workspaceMembers.role,
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

		return userWorkspaces;
	} catch (error) {
		console.error('Get user workspaces error:', error);
		return [];
	}
}
