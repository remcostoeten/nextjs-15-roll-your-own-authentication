"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Check } from "lucide-react"
import { markNotificationAsRead, markAllNotificationsAsRead } from "../api/mutations"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface NotificationListProps {
  notifications: any[]
  isLoading?: boolean
  onRefresh?: () => void
  showViewAll?: boolean
  className?: string
}

export function NotificationList({
  notifications,
  isLoading = false,
  onRefresh,
  showViewAll = false,
  className,
}: NotificationListProps) {
  const [expandedNotifications, setExpandedNotifications] = useState<number[]>([])
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)

  // Toggle notification expansion
  const toggleExpand = (id: number) => {
    setExpandedNotifications((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Mark notification as read
  const handleMarkAsRead = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      await markNotificationAsRead(id)
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    setIsMarkingAllRead(true)

    try {
      await markAllNotificationsAsRead()
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  // Format date
  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  // Get notification type styles
  const getNotificationTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/20 text-green-500"
      case "warning":
        return "bg-yellow-500/20 text-yellow-500"
      case "error":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-blue-500/20 text-blue-500"
    }
  }

  // Get initials from name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between border-b p-3">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={isMarkingAllRead || isLoading}>
          <Check className="mr-1 h-4 w-4" />
          <span>Mark all as read</span>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3 p-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y max-h-[400px] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 transition-colors hover:bg-muted/50 cursor-pointer",
                    !notification.isRead && "bg-muted/30",
                  )}
                  onClick={() => toggleExpand(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarFallback className={cn("text-sm", getNotificationTypeStyles(notification.type))}>
                        {getInitials(notification.creator.firstName, notification.creator.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className={cn("font-medium line-clamp-1 text-sm", !notification.isRead && "font-semibold")}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="ml-1 h-2 w-2 rounded-full bg-destructive flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">{notification.content}</p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(notification.createdAt)}</span>

                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedNotifications.includes(notification.id) && (
                    <div className="mt-2 pl-12">
                      <p className="text-xs mb-2">{notification.content}</p>

                      {notification.link && (
                        <Button asChild variant="outline" size="sm" className="mt-1 text-xs h-7 px-2">
                          <Link href={notification.link}>View Details</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 text-center">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">No notifications yet</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3 p-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.filter((n) => !n.isRead).length > 0 ? (
            <div className="divide-y">
              {notifications
                .filter((notification) => !notification.isRead)
                .map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 transition-colors hover:bg-muted/50 cursor-pointer bg-muted/30"
                    onClick={() => toggleExpand(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarFallback className={cn("text-sm", getNotificationTypeStyles(notification.type))}>
                          {getInitials(notification.creator.firstName, notification.creator.lastName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-medium line-clamp-1 text-sm font-semibold">{notification.title}</p>
                          <span className="ml-1 h-2 w-2 rounded-full bg-destructive flex-shrink-0" />
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">{notification.content}</p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatDate(notification.createdAt)}</span>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                          >
                            Mark as read
                          </Button>
                        </div>
                      </div>
                    </div>

                    {expandedNotifications.includes(notification.id) && (
                      <div className="mt-2 pl-12">
                        <p className="text-xs mb-2">{notification.content}</p>

                        {notification.link && (
                          <Button asChild variant="outline" size="sm" className="mt-1 text-xs h-7 px-2">
                            <Link href={notification.link}>View Details</Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 text-center">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">No unread notifications</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {showViewAll && (
        <div className="border-t p-2">
          <Button variant="ghost" className="w-full justify-center" asChild>
            <Link href="/notifications">View all notifications</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

