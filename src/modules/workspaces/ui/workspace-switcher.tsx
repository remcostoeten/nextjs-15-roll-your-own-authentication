"use client"

import { Check, ChevronsUpDown, Plus, Building2, Users, Crown, Shield, User } from "lucide-react"
import { useState } from "react"

import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { useWorkspace } from "../hooks/use-workspace"

const getRoleIcon = (role: string) => {
  switch (role) {
    case "owner":
      return <Crown className="h-3 w-3 text-amber-500" />
    case "admin":
      return <Shield className="h-3 w-3 text-blue-500" />
    case "member":
      return <User className="h-3 w-3 text-gray-500" />
    default:
      return <User className="h-3 w-3 text-gray-500" />
  }
}

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "owner":
      return "default"
    case "admin":
      return "secondary"
    case "member":
      return "outline"
    default:
      return "outline"
  }
}

export function WorkspaceSwitcher() {
  const { currentWorkspace, workspaces, switchWorkspace, isLoading } = useWorkspace()
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
        <div className="flex-1 space-y-1">
          <div className="h-3 bg-muted rounded animate-pulse" />
          <div className="h-2 bg-muted rounded w-2/3 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!currentWorkspace) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
        <Building2 className="h-8 w-8" />
        <span className="text-sm">No workspace selected</span>
      </div>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto p-2 hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="h-8 w-8 rounded-lg border-2 border-background shadow-sm">
              <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                {currentWorkspace.emoji || currentWorkspace.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-0 flex-1">
              <div className="flex items-center gap-2 w-full">
                <span className="font-medium text-sm truncate">{currentWorkspace.title}</span>
                {getRoleIcon(currentWorkspace.userRole)}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>
                  {currentWorkspace.memberCount} member{currentWorkspace.memberCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[280px] p-2" align="start">
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Your Workspaces
        </DropdownMenuLabel>
        <div className="space-y-1">
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => {
                switchWorkspace(workspace)
                setOpen(false)
              }}
              className="flex items-center gap-3 p-2 cursor-pointer rounded-md"
            >
              <Avatar className="h-8 w-8 rounded-lg border border-border">
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                  {workspace.emoji || workspace.title.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{workspace.title}</span>
                  {workspace.id === currentWorkspace.id && <Check className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>
                      {workspace.memberCount} member{workspace.memberCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <Badge variant={getRoleBadgeVariant(workspace.userRole)} className="text-xs px-1.5 py-0.5 h-auto">
                    {workspace.userRole}
                  </Badge>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem className="flex items-center gap-3 p-2 cursor-pointer rounded-md">
          <div className="h-8 w-8 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">Create Workspace</span>
            <span className="text-xs text-muted-foreground">Start a new workspace</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
