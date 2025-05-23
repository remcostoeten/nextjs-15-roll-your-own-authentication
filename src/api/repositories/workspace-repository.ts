import { and, asc, eq, sql } from 'drizzle-orm';
import { generateSlug } from 'utilities';
import { db } from '../db/connection';
import { users, workspaceMembers, workspaces } from '../db/schema';

export class WorkspaceRepository {
	// Get all workspaces for a user
	async getUserWorkspaces(userId: string) {
		const results = await db
			.select({
				workspace: workspaces,
				role: workspaceMembers.role,
			})
			.from(workspaceMembers)
			.where(eq(workspaceMembers.userId, userId))
			.innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
			.orderBy(asc(workspaces.title));

		return results.map(({ workspace, role }) => ({
			...workspace,
			role,
		}));
	}

	// Get a single workspace by ID
	async getWorkspaceById(workspaceId: string) {
		const result = await db
			.select({
				workspace: workspaces,
				creator: {
					id: users.id,
					name: users.name,
					avatar: users.avatar,
				},
			})
			.from(workspaces)
			.where(eq(workspaces.id, workspaceId))
			.innerJoin(users, eq(workspaces.createdBy, users.id));

		if (result.length === 0) {
			return null;
		}

		// Get members count
		const membersCount = await db
			.select({ count: sql<number>`count(*)` })
			.from(workspaceMembers)
			.where(eq(workspaceMembers.workspaceId, workspaceId));

		return {
			...result[0],
			membersCount: Number(membersCount[0].count),
		};
	}

	// Create a new workspace
	async createWorkspace(data: {
		title: string;
		description?: string;
		createdBy: string;
	}) {
		// Generate a slug from the title
		const slug = generateSlug(data.title);

		// Create the workspace
		const result = await db
			.insert(workspaces)
			.values({
				title: data.title,
				slug,
				description: data.description || null,
				createdBy: data.createdBy,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		const workspaceId = result[0].id;

		// Add the creator as an owner
		await db.insert(workspaceMembers).values({
			workspaceId,
			userId: data.createdBy,
			role: 'owner',
			createdAt: new Date(),
		});

		return result[0];
	}

	// Update a workspace
	async updateWorkspace(
		workspaceId: string,
		data: {
			title?: string;
			description?: string;
		}
	) {
		const updateData: any = {
			...data,
			updatedAt: new Date(),
		};

		// If title is updated, update the slug as well
		if (data.title) {
			updateData.slug = generateSlug(data.title);
		}

		return db
			.update(workspaces)
			.set(updateData)
			.where(eq(workspaces.id, workspaceId))
			.returning();
	}

	// Delete a workspace
	async deleteWorkspace(workspaceId: string) {
		return db.delete(workspaces).where(eq(workspaces.id, workspaceId));
	}

	// Check if a user is a member of a workspace
	async isUserMember(workspaceId: string, userId: string) {
		const result = await db
			.select()
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, userId)
				)
			);

		return result.length > 0;
	}

	// Get a user's role in a workspace
	async getUserRole(workspaceId: string, userId: string) {
		const result = await db
			.select({ role: workspaceMembers.role })
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, userId)
				)
			);

		if (result.length === 0) {
			return null;
		}

		return result[0].role;
	}
}

export const workspaceRepository = new WorkspaceRepository();
