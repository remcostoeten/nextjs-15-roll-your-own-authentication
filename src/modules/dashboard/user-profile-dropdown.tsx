"use client"

import { CreditCard, LogOut, Moon, Settings, Sun, User, Users, Keyboard } from "lucide-react"
import { useEffect, useState } from "react"
import { showToast } from "@/components/ui/toast/custom-toast"
import { attemptUserLogout } from "@/modules/auth/api/services/auth.service"
import type { UserSession } from "@/modules/auth/lib/session"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { KeyboardShortcutsModal } from "./components/keyboard-shortcuts-modal"
import { useKeyboardShortcuts } from "./lib/keyboard-shortcuts"

interface UserProfileDropdownProps {
  user: NonNullable<UserSession>;
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const { theme, setTheme } = useTheme()
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false)
  const { registerAction, unregisterAction, getShortcut } = useKeyboardShortcuts()
  const logoutShortcut = getShortcut("logout") || ["shift", "meta", "q"]

  const handleLogout = async () => {
    showToast({
      message: "Signing out...",
      type: "info",
      description: "You will be redirected to the login page."
    })
    await attemptUserLogout()
  }

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    showToast({
      message: `Theme changed to ${newTheme} mode`,
      type: "success"
    })
  }

  useEffect(() => {
    registerAction({
      id: "logout",
      name: "Logout",
      description: "Sign out of your account",
      defaultShortcut: ["shift", "meta", "q"],
      category: "system",
      handler: handleLogout
    })

    return () => {
      unregisterAction("logout")
    }
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const shortcut = getShortcut("logout")
      if (!shortcut) return

      const pressed = shortcut.every(key => {
        switch (key) {
          case "meta":
            return event.metaKey || event.ctrlKey
          case "shift":
            return event.shiftKey
          case "alt":
            return event.altKey
          default:
            return event.key.toLowerCase() === key
        }
      })

      if (pressed) {
        event.preventDefault()
        void handleLogout()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [getShortcut])

  if (!user) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 px-3 py-2 h-auto rounded-none hover:bg-sidebar-accent",
              isCollapsed && "justify-center p-3",
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}`} 
                alt={user.username} 
              />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {user.username?.[0]?.toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">{user.username}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align={isCollapsed ? "center" : "start"} side="top">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <Users className="mr-2 h-4 w-4" />
              <span>Team management</span>
              <DropdownMenuShortcut>⌘ ⇧P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light mode</span>
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark mode</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setShortcutsModalOpen(true)}>
              <Keyboard className="mr-2 h-4 w-4" />
              <span>Keyboard shortcuts</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <form action={handleLogout}>
            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" asChild>
              <button type="submit" className="w-full flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>{formatShortcut(logoutShortcut)}</DropdownMenuShortcut>
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>

      <KeyboardShortcutsModal
        open={shortcutsModalOpen}
        onOpenChange={setShortcutsModalOpen}
      />
    </>
  )
}

function formatShortcut(keys: string[]): string {
  return keys
    .map((key) => {
      switch (key) {
        case "meta":
          return "⌘"
        case "ctrl":
          return "Ctrl"
        case "alt":
          return "Alt"
        case "shift":
          return "⇧"
        default:
          return key.charAt(0).toUpperCase() + key.slice(1)
      }
    })
    .join(" + ")
}
