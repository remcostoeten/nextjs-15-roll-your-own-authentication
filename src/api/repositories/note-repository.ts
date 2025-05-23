import { db } from '@/api/connection';
import { workspaceMembers } from '@/api/queries/schema-workspaces';
import { tickets, users } from '@/api/schema';
import { noteMentions, notes } from '@/api/schemas/notes-scheme';
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';

export class NoteRepository {
	// Get all notes for a workspace with pagination
	async getWorkspaceNotes(
		workspaceId: string,
		options: {
			page?: number;
			limit?: number;
			sortBy?: string;
			sortDirection?: 'asc' | 'desc';
			search?: string;
		} = {}
	) {
		const {
			page = 1,
			limit = 20,
			sortBy = 'createdAt',
			sortDirection = 'desc',
			search,
		} = options;

		const offset = (page - 1) * limit;

		// Build the query with filters
		const conditions = [eq(notes.workspaceId, workspaceId)];
		if (search) {
			conditions.push(sql`${notes.title} ILIKE ${`%${search}%`}`);
		}

		const orderBy = [];
		if (sortBy === 'createdAt') {
			orderBy.push(sortDirection === 'asc' ? asc(notes.createdAt) : desc(notes.createdAt));
		} else if (sortBy === 'updatedAt') {
			orderBy.push(sortDirection === 'asc' ? asc(notes.updatedAt) : desc(notes.updatedAt));
		} else if (sortBy === 'title') {
			orderBy.push(sortDirection === 'asc' ? asc(notes.title) : desc(notes.title));
		}

		const results = await db
			.select({
				note: notes,
				creator: {
					id: users.id,
					name: users.name,
					avatar: users.avatar,
				},
			})
			.from(notes)
			.where(and(...conditions))
			.innerJoin(users, eq(notes.createdBy, users.id))
			.orderBy(...orderBy)
			.limit(limit)
			.offset(offset);

		// Get total count for pagination
		const countResult = await db
			.select({ count: sql<number>`count(*)` })
			.from(notes)
			.where(and(...conditions));

		const totalCount = Number(countResult[0].count);
		const totalPages = Math.ceil(totalCount / limit);

		return {
			notes: results,
			pagination: {
				page,
				limit,
				totalCount,
				totalPages,
			},
		};
	}

	// Get a single note by ID with related data
	async getNoteById(noteId: string) {
		const result = await db
			.select({
				note: notes,
				creator: {
					id: users.id,
					name: users.name,
					avatar: users.avatar,
				},
			})
			.from(notes)
			.where(eq(notes.id, noteId))
			.innerJoin(users, eq(notes.createdBy, users.id));

		if (result.length === 0) {
			return null;
		}

		// Get mentions for this note
		const mentions = await db
			.select()
			.from(noteMentions)
			.where(eq(noteMentions.noteId, noteId));

		// Get referenced notes
		const noteMentionIds = mentions
			.filter((mention) => mention.mentionType === 'note')
			.map((mention) => mention.mentionId);

		const referencedNotes =
			noteMentionIds.length > 0
				? await db
						.select({
							id: notes.id,
							title: notes.title,
							type: sql<'note'>`'note'`,
						})
						.from(notes)
						.where(inArray(notes.id, noteMentionIds))
				: [];

		// Get referenced tickets
		const ticketMentionIds = mentions
			.filter((mention) => mention.mentionType === 'ticket')
			.map((mention) => mention.mentionId);

		const referencedTickets =
			ticketMentionIds.length > 0
				? await db
						.select({
							id: tickets.id,
							title: tickets.title,
							type: sql<'ticket'>`'ticket'`,
						})
						.from(tickets)
						.where(inArray(tickets.id, ticketMentionIds))
						.then(results => results.map(ticket => ({
							...ticket,
							title: ticket.title || undefined
						})))
				: [];

		// Get referenced users
		const userMentionIds = mentions
			.filter((mention) => mention.mentionType === 'user')
			.map((mention) => mention.mentionId);

		const referencedUsers =
			userMentionIds.length > 0
				? await db
						.select({
							id: users.id,
							name: users.name,
							avatar: users.avatar,
							type: sql<'user'>`'user'`,
						})
						.from(users)
						.where(inArray(users.id, userMentionIds))
						.then(results => results.map(user => ({
							...user,
							name: user.name || undefined
						})))
				: [];

		return {
			...result[0],
			mentions: {
				notes: referencedNotes,
				tickets: referencedTickets,
				users: referencedUsers,
			},
		};
	}

	// Create a new note
	async createNote(data: {
		workspaceId: string;
		title: string;
		content: any; // JSON content
		createdBy: string;
		mentions?: Array<{ type: string; id: string }>;
	}) {
		// Create the note
		const result = await db
			.insert(notes)
			.values({
				workspaceId: data.workspaceId,
				title: data.title,
				content: data.content,
				createdBy: data.createdBy,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		const noteId = result[0].id;

		// Create mentions if provided
		if (data.mentions && data.mentions.length > 0) {
			const mentionValues = data.mentions.map((mention) => ({
				noteId,
				mentionType: mention.type,
				mentionId: mention.id,
				createdAt: new Date(),
			}));

			await db.insert(noteMentions).values(mentionValues);
		}

		return result[0];
	}

	// Update a note
	async updateNote(
		noteId: string,
		data: {
			title?: string;
			content?: any; // JSON content
			mentions?: Array<{ type: string; id: string }>;
		}
	) {
		// Update the note
		const result = await db
			.update(notes)
			.set({
				...(data.title && { title: data.title }),
				...(data.content && { content: data.content }),
				updatedAt: new Date(),
			})
			.where(eq(notes.id, noteId))
			.returning();

		// Update mentions if provided
		if (data.mentions) {
			// Delete existing mentions
			await db.delete(noteMentions).where(eq(noteMentions.noteId, noteId));

			// Create new mentions
			if (data.mentions.length > 0) {
				const mentionValues = data.mentions.map((mention) => ({
					noteId,
					mentionType: mention.type,
					mentionId: mention.id,
					createdAt: new Date(),
				}));

				await db.insert(noteMentions).values(mentionValues);
			}
		}

		return result[0];
	}

	// Delete a note
	async deleteNote(noteId: string) {
		await db.delete(notes).where(eq(notes.id, noteId));
	}

	// Search for mentionable items
	async searchMentionables(
		workspaceId: string,
		query: string,
		type?: 'note' | 'ticket' | 'user'
	) {
		const results: Array<{
			id: string;
			title?: string;
			name?: string;
			avatar?: string | null;
			type: 'note' | 'ticket' | 'user';
		}> = [];

		const searchPattern = `%${query}%`;

		if (!type || type === 'note') {
			const noteResults = await db
				.select({
					id: notes.id,
					title: notes.title,
					type: sql<'note'>`'note'`,
				})
				.from(notes)
				.where(
					and(
						eq(notes.workspaceId, workspaceId),
						sql`${notes.title} ILIKE ${searchPattern}`
					)
				)
				.limit(5);

			results.push(...noteResults);
		}

		if (!type || type === 'ticket') {
			const ticketResults = await db
				.select({
					id: tickets.id,
					title: tickets.title,
					type: sql<'ticket'>`'ticket'`,
				})
				.from(tickets)
				.where(
					and(
						eq(tickets.workspaceId, workspaceId),
						sql`${tickets.title} ILIKE ${searchPattern}`
					)
				)
				.limit(5);

			results.push(...(ticketResults.map(t => ({
				...t,
				title: t.title || undefined
			}))));
		}

		if (!type || type === 'user') {
			const userResults = await db
				.select({
					id: users.id,
					name: users.name,
					avatar: users.avatar,
					type: sql<'user'>`'user'`,
				})
				.from(users)
				.innerJoin(
					workspaceMembers,
					and(
						eq(workspaceMembers.userId, users.id),
						eq(workspaceMembers.workspaceId, workspaceId)
					)
				)
				.where(sql`${users.name} ILIKE ${searchPattern}`)
				.limit(5);

			results.push(...(userResults.map(u => ({
				...u,
				name: u.name || undefined
			}))));
		}

		return results;
	}
}

export const noteRepository = new NoteRepository();
