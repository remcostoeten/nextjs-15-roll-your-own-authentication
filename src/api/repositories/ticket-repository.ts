import { and, asc, desc, eq, inArray } from "drizzle-orm"
import { db } from "../connection"
import { users } from "../schema"
import { workspaceMembers } from "../schemas/workspace-scheme"
import { ticketComments, ticketHistory, ticketRelationships, tickets } from "./schemas/schema-tickets"

export class TicketRepository {
  // Get all tickets for a workspace with pagination
  async getWorkspaceTickets(
    workspaceId: string,
    options: {
      page?: number
      limit?: number
      status?: string[]
      assigneeId?: string
      priority?: string[]
      sortBy?: string
      sortDirection?: "asc" | "desc"
    } = {},
  ) {
    const { page = 1, limit = 20, status, assigneeId, priority, sortBy = "createdAt", sortDirection = "desc" } = options

    const offset = (page - 1) * limit

    // Build the query with filters
    let query = db
      .select({
        ticket: tickets,
        assignee: users,
        reporter: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(tickets)
      .where(eq(tickets.workspaceId, workspaceId))
      .leftJoin(users, eq(tickets.assigneeId, users.id))
      .innerJoin(users, eq(tickets.reporterId, users.id))
      .limit(limit)
      .offset(offset)

    // Apply filters if provided
    if (status && status.length > 0) {
      query = query.where(inArray(tickets.status, status))
    }

    if (assigneeId) {
      query = query.where(eq(tickets.assigneeId, assigneeId))
    }

    if (priority && priority.length > 0) {
      query = query.where(inArray(tickets.priority, priority))
    }

    // Apply sorting
    if (sortBy === "createdAt") {
      query = sortDirection === "asc" ? query.orderBy(asc(tickets.createdAt)) : query.orderBy(desc(tickets.createdAt))
    } else if (sortBy === "updatedAt") {
      query = sortDirection === "asc" ? query.orderBy(asc(tickets.updatedAt)) : query.orderBy(desc(tickets.updatedAt))
    } else if (sortBy === "priority") {
      query = sortDirection === "asc" ? query.orderBy(asc(tickets.priority)) : query.orderBy(desc(tickets.priority))
    }

    // Get total count for pagination
    const countResult = await db
      .select({ count: db.fn.count() })
      .from(tickets)
      .where(eq(tickets.workspaceId, workspaceId))

    const totalCount = Number(countResult[0].count)
    const totalPages = Math.ceil(totalCount / limit)

    const results = await query

    return {
      tickets: results,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    }
  }

  // Get a single ticket by ID with related data
  async getTicketById(ticketId: string) {
    const result = await db
      .select({
        ticket: tickets,
        assignee: users,
        reporter: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(tickets)
      .where(eq(tickets.id, ticketId))
      .leftJoin(users, eq(tickets.assigneeId, users.id))
      .innerJoin(users, eq(tickets.reporterId, users.id))

    if (result.length === 0) {
      return null
    }

    // Get comments for this ticket
    const comments = await db
      .select({
        comment: ticketComments,
        user: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(ticketComments)
      .where(eq(ticketComments.ticketId, ticketId))
      .innerJoin(users, eq(ticketComments.userId, users.id))
      .orderBy(desc(ticketComments.createdAt))

    // Get history for this ticket
    const history = await db
      .select({
        history: ticketHistory,
        user: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(ticketHistory)
      .where(eq(ticketHistory.ticketId, ticketId))
      .innerJoin(users, eq(ticketHistory.userId, users.id))
      .orderBy(desc(ticketHistory.createdAt))

    // Get related tickets
    const relationships = await db
      .select({
        relationship: ticketRelationships,
        relatedTicket: {
          id: tickets.id,
          title: tickets.title,
          status: tickets.status,
          priority: tickets.priority,
        },
      })
      .from(ticketRelationships)
      .where(eq(ticketRelationships.sourceTicketId, ticketId))
      .innerJoin(tickets, eq(ticketRelationships.targetTicketId, tickets.id))

    return {
      ...result[0],
      comments,
      history,
      relationships,
    }
  }

  // Create a new ticket
  async createTicket(data: {
    workspaceId: string
    title: string
    description?: string
    status?: string
    priority?: string
    assigneeId?: string
    reporterId: string
    dueDate?: Date
    estimatedHours?: number
    labels?: string[]
  }) {
    // Verify user is a member of the workspace
    const memberCheck = await db
      .select()
      .from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, data.workspaceId), eq(workspaceMembers.userId, data.reporterId)))

    if (memberCheck.length === 0) {
      throw new Error("User is not a member of this workspace")
    }

    // Create the ticket
    const result = await db
      .insert(tickets)
      .values({
        workspaceId: data.workspaceId,
        title: data.title,
        description: data.description,
        status: data.status as any,
        priority: data.priority as any,
        assigneeId: data.assigneeId,
        reporterId: data.reporterId,
        dueDate: data.dueDate,
        estimatedHours: data.estimatedHours,
        labels: data.labels ? JSON.stringify(data.labels) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return result[0]
  }

  // Update a ticket
  async updateTicket(
    ticketId: string,
    userId: string,
    data: {
      title?: string
      description?: string
      status?: string
      priority?: string
      assigneeId?: string | null
      dueDate?: Date | null
      estimatedHours?: number | null
      labels?: string[]
    },
  ) {
    // Get the current ticket for history tracking
    const currentTicket = await db.select().from(tickets).where(eq(tickets.id, ticketId))

    if (currentTicket.length === 0) {
      throw new Error("Ticket not found")
    }

    // Track history for each changed field
    const historyEntries = []
    const current = currentTicket[0]

    if (data.title !== undefined && data.title !== current.title) {
      historyEntries.push({
        ticketId,
        userId,
        field: "title",
        oldValue: current.title,
        newValue: data.title,
      })
    }

    if (data.status !== undefined && data.status !== current.status) {
      historyEntries.push({
        ticketId,
        userId,
        field: "status",
        oldValue: current.status,
        newValue: data.status,
      })
    }

    if (data.priority !== undefined && data.priority !== current.priority) {
      historyEntries.push({
        ticketId,
        userId,
        field: "priority",
        oldValue: current.priority,
        newValue: data.priority,
      })
    }

    if (data.assigneeId !== undefined && data.assigneeId !== current.assigneeId) {
      historyEntries.push({
        ticketId,
        userId,
        field: "assignee",
        oldValue: current.assigneeId || "unassigned",
        newValue: data.assigneeId || "unassigned",
      })
    }

    // Update the ticket
    const result = await db
      .update(tickets)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(tickets.id, ticketId))
      .returning()

    // Record history entries
    if (historyEntries.length > 0) {
      await db.insert(ticketHistory).values(historyEntries)
    }

    return result[0]
  }

  // Delete a ticket
  async deleteTicket(ticketId: string) {
    return db.delete(tickets).where(eq(tickets.id, ticketId))
  }

  // Add a comment to a ticket
  async addComment(data: {
    ticketId: string
    userId: string
    content: string
  }) {
    const result = await db
      .insert(ticketComments)
      .values({
        ticketId: data.ticketId,
        userId: data.userId,
        content: data.content,
        createdAt: new Date(),
      })
      .returning()

    return result[0]
  }

  // Create a relationship between tickets
  async createTicketRelationship(data: {
    sourceTicketId: string
    targetTicketId: string
    type: string
  }) {
    const result = await db
      .insert(ticketRelationships)
      .values({
        sourceTicketId: data.sourceTicketId,
        targetTicketId: data.targetTicketId,
        type: data.type as any,
        createdAt: new Date(),
      })
      .returning()

    return result[0]
  }

  // Delete a relationship between tickets
  async deleteTicketRelationship(relationshipId: string) {
    return db.delete(ticketRelationships).where(eq(ticketRelationships.id, relationshipId))
  }
}

export const ticketRepository = new TicketRepository()
