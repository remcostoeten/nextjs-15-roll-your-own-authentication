import { subDays } from "date-fns"
import { and, desc, eq, gte, sql } from "drizzle-orm"
import { db } from "../connection"
import { workspaceMembers } from "../queries/schema-workspaces"
import { tickets, users } from "../schema"
import { notes } from "../schemas/notes-scheme"

export class ActivityRepository {
  // Get workspace statistics
  async getWorkspaceStats(workspaceId: string) {
    // Get notes count
    const notesCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(notes)
      .where(eq(notes.workspaceId, workspaceId))

    // Get tickets count
    const ticketsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(tickets)
      .where(eq(tickets.workspaceId, workspaceId))

    // Get members count
    const membersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId))

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30)

    // Recent notes
    const recentNotes = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(notes)
      .where(and(eq(notes.workspaceId, workspaceId), gte(notes.createdAt, thirtyDaysAgo)))

    // Recent tickets
    const recentTickets = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(tickets)
      .where(and(eq(tickets.workspaceId, workspaceId), gte(tickets.createdAt, thirtyDaysAgo)))

    // Get activity by day for the last 30 days
    const notesActivity = await db
      .select({
        date: sql<string>`date_trunc('day', ${notes.createdAt})::date`,
        count: sql<number>`count(*)`,
      })
      .from(notes)
      .where(and(eq(notes.workspaceId, workspaceId), gte(notes.createdAt, thirtyDaysAgo)))
      .groupBy(sql`date_trunc('day', ${notes.createdAt})::date`)
      .orderBy(sql`date_trunc('day', ${notes.createdAt})::date`)

    const ticketsActivity = await db
      .select({
        date: sql<string>`date_trunc('day', ${tickets.createdAt})::date`,
        count: sql<number>`count(*)`,
      })
      .from(tickets)
      .where(and(eq(tickets.workspaceId, workspaceId), gte(tickets.createdAt, thirtyDaysAgo)))
      .groupBy(sql`date_trunc('day', ${tickets.createdAt})::date`)
      .orderBy(sql`date_trunc('day', ${tickets.createdAt})::date`)

    // Get top contributors
    const topContributors = await db
      .select({
        userId: notes.createdBy,
        name: users.name,
        avatar: users.avatar,
        count: sql<number>`count(*)`,
      })
      .from(notes)
      .where(eq(notes.workspaceId, workspaceId))
      .innerJoin(users, eq(notes.createdBy, users.id))
      .groupBy(notes.createdBy, users.name, users.avatar)
      .orderBy(desc(sql`count(*)`))
      .limit(5)

    return {
      counts: {
        notes: Number(notesCount[0].count),
        tickets: Number(ticketsCount[0].count),
        members: Number(membersCount[0].count),
      },
      recent: {
        notes: Number(recentNotes[0].count),
        tickets: Number(recentTickets[0].count),
      },
      activity: {
        notes: notesActivity,
        tickets: ticketsActivity,
      },
      topContributors,
    }
  }

  // Get recent activity feed
  async getActivityFeed(workspaceId: string, limit = 10) {
    // Get recent notes
    const recentNotes = await db
      .select({
        id: notes.id,
        type: sql<string>`'note'`,
        title: notes.title,
        createdAt: notes.createdAt,
        createdBy: users.name,
        avatar: users.avatar,
      })
      .from(notes)
      .where(eq(notes.workspaceId, workspaceId))
      .innerJoin(users, eq(notes.createdBy, users.id))
      .orderBy(desc(notes.createdAt))
      .limit(limit)

    // Get recent tickets
    const recentTickets = await db
      .select({
        id: tickets.id,
        type: sql<string>`'ticket'`,
        title: tickets.title,
        createdAt: tickets.createdAt,
        createdBy: users.name,
        avatar: users.avatar,
      })
      .from(tickets)
      .where(eq(tickets.workspaceId, workspaceId))
      .innerJoin(users, eq(tickets.createdBy, users.id))
      .orderBy(desc(tickets.createdAt))
      .limit(limit)

    // Combine and sort
    const combined = [...recentNotes, ...recentTickets].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return combined.slice(0, limit)
  }
}

export const activityRepository = new ActivityRepository()
