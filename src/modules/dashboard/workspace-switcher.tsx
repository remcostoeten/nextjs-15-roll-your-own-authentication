"use client"

import * as React from "react"
import { Check, ChevronDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSidebar } from "@/components/ui/sidebar"
import { CreateWorkspaceModal } from "./create-workspace-modal"

type Workspace = {
  id: string
  name: string
  url: string
  logo?: string
}

const workspaces: Workspace[] = [
  {
    id: "1",
    name: "Untitled UI",
    url: "store.untitledui.com",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Epicurious",
    url: "epicurious.com",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "BoltShift",
    url: "boltshift.io",
    logo: "/placeholder.svg?height=40&width=40",
  },
]

type WorkspaceSwitcherProps = {
  onCreateWorkspace?: () => void
  onSwitchWorkspace?: (workspace: Workspace) => Promise<void> | void
}

export function WorkspaceSwitcher({ onSwitchWorkspace }: WorkspaceSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<Workspace>(workspaces[0])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const handleSelect = async (workspace: Workspace) => {
    if (workspace.id === selectedWorkspace.id) {
      setOpen(false)
      return
    }

    setIsLoading(true)

    try {
      if (onSwitchWorkspace) {
        await onSwitchWorkspace(workspace)
      }
      setSelectedWorkspace(workspace)
    } catch (error) {
      console.error("Failed to switch workspace:", error)
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  const handleWorkspaceCreated = (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
  }

  const openCreateModal = () => {
    setOpen(false)
    setIsCreateModalOpen(true)
  }

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a workspace"
            className={cn(
              "w-full justify-between px-3 py-5 h-auto text-left font-normal rounded-none hover:bg-sidebar-accent",
              isLoading && "opacity-50 cursor-not-allowed",
              isCollapsed && "justify-center p-3",
            )}
            disabled={isLoading}
          >
            <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
              <Avatar className="h-8 w-8 rounded-md">
                <AvatarImage src={selectedWorkspace.logo || "/placeholder.svg"} alt={selectedWorkspace.name} />
                <AvatarFallback className="rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
                  {selectedWorkspace.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <p className="text-sm font-medium leading-none truncate">{selectedWorkspace.name}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{selectedWorkspace.url}</p>
                </div>
              )}
            </div>
            {!isCollapsed && <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0 rounded-none border-0" align="start">
          <Command className="rounded-none">
            <CommandInput placeholder="Search stores..." className="rounded-none" />
            <CommandList>
              <CommandEmpty>No stores found.</CommandEmpty>
              <CommandGroup heading="Your stores">
                {workspaces.map((workspace) => (
                  <CommandItem
                    key={workspace.id}
                    value={workspace.name}
                    onSelect={() => handleSelect(workspace)}
                    className="flex items-center gap-3 py-3 px-3 rounded-none cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-8 w-8 rounded-md">
                        <AvatarImage src={workspace.logo || "/placeholder.svg"} alt={workspace.name} />
                        <AvatarFallback className="rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
                          {workspace.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <p className="text-sm font-medium leading-none truncate">{workspace.name}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">{workspace.url}</p>
                      </div>
                    </div>
                    {workspace.id === selectedWorkspace.id && <Check className="ml-auto h-4 w-4 shrink-0" />}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator className="bg-border" />
              <div className="p-2">
                <Button className="w-full justify-center gap-2" onClick={openCreateModal}>
                  <Plus className="h-4 w-4" />
                  Create new store
                </Button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <CreateWorkspaceModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onWorkspaceCreated={handleWorkspaceCreated}
      />
    </div>
  )
}
