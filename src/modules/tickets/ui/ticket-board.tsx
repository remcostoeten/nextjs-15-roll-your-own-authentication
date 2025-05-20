"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Card, CardContent } from "@/shared/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/shared/components/ui/pagination"
import { formatDistanceToNow } from "date-fns"
import { CalendarClock, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface TicketBoardProps {
  tickets: {
    ticket: any
    assignee: any
    reporter: any
  }[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
  workspaceId: string
}

export function TicketBoard({ tickets, pagination, workspaceId }: TicketBoardProps) {
  const router = useRouter()

  // Group tickets by status
  const ticketsByStatus = tickets.reduce(
    (acc, { ticket, assignee, reporter }) => {
      const status = ticket.status
      if (!acc[status]) {
        acc[status] = []
      }
      acc[status].push({ ticket, assignee, reporter })
      return acc
    },
    {} as Record<string, typeof tickets>,
  )

  // Define status columns and their order
  const statusColumns = [
    { key: "backlog", label: "Backlog" },
    { key: "todo", label: "To Do" },
    { key: "in_progress", label: "In Progress" },
    { key: "in_review", label: "In Review" },
    { key: "done", label: "Done" },
  ]

  const handleTicketClick = (ticketId: string) => {
    router.push(`/workspace/${workspaceId}/tickets/${ticketId}`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-orange-500"
      case "urgent":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 overflow-auto pb-6 flex-1">
        {statusColumns.map((column) => (
          <div key={column.key} className="bg-card rounded-lg p-4 shadow min-h-[200px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{column.label}</h3>
              <Badge variant="outline">{ticketsByStatus[column.key]?.length || 0}</Badge>
            </div>
            <div className="space-y-3 flex-1">
              {ticketsByStatus[column.key]?.map(({ ticket, assignee, reporter }) => (
                <Card
                  key={ticket.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleTicketClick(ticket.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <div className={`w-1 self-stretch rounded-full ${getPriorityColor(ticket.priority)}`} />
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-2 mb-2">{ticket.title}</h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                          </div>
                          {ticket.dueDate && (
                            <div className="flex items-center gap-1">
                              <CalendarClock className="h-3 w-3" />
                              {new Date(ticket.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="capitalize">
                            {ticket.priority}
                          </Badge>
                          {assignee ? (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={assignee.avatar || ""} alt={assignee.name || ""} />
                              <AvatarFallback>{assignee.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Unassigned
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!ticketsByStatus[column.key] || ticketsByStatus[column.key].length === 0) && (
                <div className="flex items-center justify-center h-24 border border-dashed rounded-lg text-muted-foreground text-sm">
                  No tickets
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink href={`/workspace/${workspaceId}/tickets?page=1`} isActive={pagination.page === 1}>
                  1
                </PaginationLink>
              </PaginationItem>

              {pagination.page > 3 && <PaginationEllipsis />}

              {pagination.page > 2 && (
                <PaginationItem>
                  <PaginationLink href={`/workspace/${workspaceId}/tickets?page=${pagination.page - 1}`}>
                    {pagination.page - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {pagination.page > 1 && pagination.page < pagination.totalPages && (
                <PaginationItem>
                  <PaginationLink href={`/workspace/${workspaceId}/tickets?page=${pagination.page}`} isActive>
                    {pagination.page}
                  </PaginationLink>
                </PaginationItem>
              )}

              {pagination.page < pagination.totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink href={`/workspace/${workspaceId}/tickets?page=${pagination.page + 1}`}>
                    {pagination.page + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {pagination.page < pagination.totalPages - 2 && <PaginationEllipsis />}

              {pagination.totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    href={`/workspace/${workspaceId}/tickets?page=${pagination.totalPages}`}
                    isActive={pagination.page === pagination.totalPages}
                  >
                    {pagination.totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
