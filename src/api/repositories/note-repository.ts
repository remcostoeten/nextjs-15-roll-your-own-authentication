import { and, asc, desc, eq, sql } from "drizzle-orm"
import { db } from "./connection"
import { tickets, users } from "./schema"
import { noteMentions, notes } from "./schemas/notes-scheme"
export class NoteRepository {
  // Get all notes for a workspace with pagination
  async getWorkspaceNotes(
    workspaceId: string,
    options: {
      page?: number
      limit?: number
      sortBy?: string
      sortDirection?: "asc" | "desc"
      search?: string
    } = {},
  ) {
    const { page = 1, limit = 20, sortBy = "createdAt", sortDirection = "desc", search } = options

    const offset = (page - 1) * limit

    // Build the query with filters
    let query = db
      .select({
        note: notes,
        creator: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(notes)
      .where(eq(notes.workspaceId, workspaceId))
      .innerJoin(users, eq(notes.createdBy, users.id))
      .limit(limit)
      .offset(offset)

    // Add search if provided
    if (search) {
      query = query.where(sql`${notes.title} ILIKE ${`%${search}%`}`)
    }

    // Apply sorting
    if (sortBy === "createdAt") {
      query = sortDirection === "asc" ? query.orderBy(asc(notes.createdAt)) : query.orderBy(desc(notes.createdAt))
    } else if (sortBy === "updatedAt") {
      query = sortDirection === "asc" ? query.orderBy(asc(notes.updatedAt)) : query.orderBy(desc(notes.updatedAt))
    } else if (sortBy === "title") {
      query = sortDirection === "asc" ? query.orderBy(asc(notes.title)) : query.orderBy(desc(notes.title))
    }

    // Get total count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(notes)
      .where(eq(notes.workspaceId, workspaceId))

    const totalCount = Number(countResult[0].count)
    const totalPages = Math.ceil(totalCount / limit)

    const results = await query

    return {
      notes: results,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    }
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
      .innerJoin(users, eq(notes.createdBy, users.id))

    if (result.length === 0) {
      return null
    }

    // Get mentions for this note
    const mentions = await db.select().from(noteMentions).where(eq(noteMentions.noteId, noteId))

    // Get referenced notes
    const noteMentionIds = mentions
      .filter((mention) => mention.mentionType === "note")
      .map((mention) => mention.mentionId)

    const referencedNotes =
      noteMentionIds.length > 0
        ? await db
            .select({
              id: notes.id,
              title: notes.title,
            })
            .from(notes)
            .where(sql`${notes.id} IN ${noteMentionIds}`)
        : []

    // Get referenced tickets
    const ticketMentionIds = mentions
      .filter((mention) => mention.mentionType === "ticket")
      .map((mention) => mention.mentionId)

    const referencedTickets =
      ticketMentionIds.length > 0
        ? await db
            .select({
              id: tickets.id,
              title: tickets.title,
            })
            .from(tickets)
            .where(sql`${tickets.id} IN ${ticketMentionIds}`)
        : []

    // Get referenced users
    const userMentionIds = mentions
      .filter((mention) => mention.mentionType === "user")
      .map((mention) => mention.mentionId)

    const referencedUsers =
      userMentionIds.length > 0
        ? await db
            .select({
              id: users.id,
              name: users.name,
              avatar: users.avatar,
            })
            .from(users)
            .where(sql`${users.id} IN ${userMentionIds}`)
        : []

    return {
      ...result[0],
      mentions: {
        notes: referencedNotes,
        tickets: referencedTickets,
        users: referencedUsers,
      },
    }
  }

  // Create a new note
  async createNote(data: {
    workspaceId: string
    title: string
    content: any // JSON content
    createdBy: string
    mentions?: Array<{ type: string; id: string }>
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
      .returning()

    const noteId = result[0].id

    // Create mentions if provided
    if (data.mentions && data.mentions.length > 0) {
      const mentionValues = data.mentions.map((mention) => ({
        noteId,
        mentionType: mention.type,
        mentionId: mention.id,
        createdAt: new Date(),
      }))

      await db.insert(noteMentions).values(mentionValues)
    }

    return result[0]
  }

  // Update a note
  async updateNote(
    noteId: string,
    data: {
      title?: string
      content?: any // JSON content
      mentions?: Array<{ type: string; id: string }>
    },
  ) {
    // Update the note
    const result = await db
      .update(notes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, noteId))
      .returning()

    // If mentions are provided, update them
    if (data.mentions) {
      // Delete existing mentions
      await db.delete(noteMentions).where(eq(noteMentions.noteId, noteId))

      // Create new mentions
      if (data.mentions.length > 0) {
        const mentionValues = data.mentions.map((mention) => ({
          noteId,
          mentionType: mention.type,
          mentionId: mention.id,
          createdAt: new Date(),
        }))

        await db.insert(noteMentions).values(mentionValues)
      }
    }

    return result[0]
  }

  // Delete a note
  async deleteNote(noteId: string) {
    return db.delete(notes).where(eq(notes.id, noteId))
  }

  // Search for entities that can be mentioned (notes, tickets, users)
  async searchMentionables(workspaceId: string, query: string, type?: "note" | "ticket" | "user") {
    const results: {
      notes?: Array<{ id: string; title: string; type: "note" }>
      tickets?: Array<{ id: string; title: string; type: "ticket" }>
      users?: Array<{ id: string; name: string; avatar: string | null; type: "user" }>
    } = {}

    // Search notes
    if (!type || type === "note") {
      const noteResults = await db
        .select({
          id: notes.id,
          title: notes.title,
        })
        .from(notes)
        .where(and(eq(notes.workspaceId, workspaceId), sql`${notes.title} ILIKE ${`%${query}%`}`))
        .limit(5)

      results.notes = noteResults.map((note) => ({ ...note, type: "note" as const }))
    }

    // Search tickets
    if (!type || type === "ticket") {
      const ticketResults = await db
        .select({
          id: tickets.id,
          title: tickets.title,
        })
        .from(tickets)
        .where(and(eq(tickets.workspaceId, workspaceId), sql`${tickets.title} ILIKE ${`%${query}%`}`))
        .limit(5)

      results.tickets = ticketResults.map((ticket) => ({ ...ticket, type: "ticket" as const }))
    }

    // Search users (from workspace members)
    if (!type || type === "user") {
      const userResults = await db
        .select({
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        })
        .from(users)
        .innerJoin("workspace_members", eq("workspace_members.user_id", users.id))
        .where(and(eq("workspace_members.workspace_id", workspaceId), sql`${users.name} ILIKE ${`%${query}%`}`))
        .limit(5)

      results.users = userResults.map((user) => ({ ...user, type: "user" as const }))
    }

    return results
  }
}

export const noteRepository = new NoteRepository()
