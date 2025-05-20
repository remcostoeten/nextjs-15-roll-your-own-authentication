import type { TTicketPriority, TTicketStatus } from "@/api/db/schema-tickets"

export interface Ticket {
  id: string
  workspaceId: string
  title: string
  description: string | null
  status: TTicketStatus
  priority: TTicketPriority
  assigneeId: string | null
  reporterId: string
  dueDate: Date | null
  estimatedHours: number | null
  labels: string[]
  createdAt: Date
  updatedAt: Date | null
}

export interface TicketWithRelations extends Ticket {
  assignee: {
    id: string
    name: string | null
    avatar: string | null
  } | null
  reporter: {
    id: string
    name: string | null
    avatar: string | null
  }
}

export interface TicketComment {
  id: string
  ticketId: string
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date | null
  user: {
    id: string
    name: string | null
    avatar: string | null
  }
}

export interface TicketHistoryEntry {
  id: string
  ticketId: string
  userId: string
  field: string
  oldValue: string | null
  newValue: string | null
  createdAt: Date
  user: {
    id: string
    name: string | null
    avatar: string | null
  }
}

export interface TicketRelationship {
  id: string
  sourceTicketId: string
  targetTicketId: string
  type: "blocks" | "is_blocked_by" | "relates_to" | "duplicates" | "is_duplicated_by" | "parent_of" | "child_of"
  createdAt: Date
  relatedTicket: {
    id: string
    title: string
    status: TTicketStatus
    priority: TTicketPriority
  }
}

export interface TicketDetail {
  ticket: Ticket
  assignee: {
    id: string
    name: string | null
    avatar: string | null
  } | null
  reporter: {
    id: string
    name: string | null
    avatar: string | null
  }
  comments: {
    comment: TicketComment
    user: {
      id: string
      name: string | null
      avatar: string | null
    }
  }[]
  history: {
    history: TicketHistoryEntry
    user: {
      id: string
      name: string | null
      avatar: string | null
    }
  }[]
  relationships: {
    relationship: TicketRelationship
    relatedTicket: {
      id: string
      title: string
      status: TTicketStatus
      priority: TTicketPriority
    }
  }[]
}

export interface TicketFilterOptions {
  page?: number
  limit?: number
  status?: TTicketStatus[]
  assigneeId?: string
  priority?: TTicketPriority[]
  sortBy?: "createdAt" | "updatedAt" | "priority"
  sortDirection?: "asc" | "desc"
}

