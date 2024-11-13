'use client'

import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui'
import { UserData } from '@/features/authentication/types'
import { cn } from 'helpers'
import { Bell, Menu, Plus, Search } from 'lucide-react'
import { useCallback, useState } from 'react'

type DashboardHeaderProps = {
  user: UserData
  onMenuClick?: () => void
}

export default function DashboardHeader({ user, onMenuClick }: DashboardHeaderProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [notifications] = useState<{ id: number; text: string }[]>([
    { id: 1, text: 'Your account was logged in from a new device' },
    { id: 2, text: 'Password was changed successfully' }
  ])

  const toggleSearch = useCallback(() => {
    setShowSearch(prev => !prev)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className={cn(
            "flex items-center gap-2 transition-all",
            showSearch ? "w-full md:w-[200px]" : "w-auto"
          )}>
            {showSearch ? (
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                autoFocus
              />
            ) : (
              <h1 className="text-xl font-semibold">Dashboard</h1>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className="shrink-0"
          >
            <Search className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative shrink-0"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map(notification => (
                <DropdownMenuItem key={notification.id}>
                  {notification.text}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="hidden gap-2 sm:flex">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
    </header>
  )
} 
