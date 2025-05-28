'use server';

import { db } from 'db';
import { workspaceMembers, users } from 'schema';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { TWorkspaceMember } from '../../types';
import { eq, and } from 'drizzle-orm';

export async function getWorkspaceMembers(workspaceId: string): Promise<TWorkspaceMember[]> {
	const session = await getSession();
	if (!session) return [];

	try {
		// First check if user has access to this workspace
		const userMembership = await db
			.select()
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, session.id)
				)
			);

		if (userMembership.length === 0) {
			return [];
		}

		const members = await db
			.select({
				id: workspaceMembers.id,
				workspaceId: workspaceMembers.workspaceId,
				userId: workspaceMembers.userId,
				role: workspaceMembers.role,
				invitedBy: workspaceMembers.invitedBy,
				joinedAt: workspaceMembers.joinedAt,
				createdAt: workspaceMembers.createdAt,
				updatedAt: workspaceMembers.updatedAt,
				user: {
					id: users.id,
					name: users.name,
					email: users.email,
					avatar: users.avatar,
				},
			})
			.from(workspaceMembers)
			.innerJoin(users, eq(users.id, workspaceMembers.userId))
			.where(eq(workspaceMembers.workspaceId, workspaceId))
			.orderBy(workspaceMembers.joinedAt);

		return members;
	} catch (error) {
		console.error('Get workspace members error:', error);
		return [];
	}
}
