import * as React from "react"
import { Check, ChevronDown, Plus, Store, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

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
import { Skeleton } from "@/components/ui/skeleton"
import { CreateWorkspaceModal } from "./create-workspace-modal"
import { type Workspace } from "@/modules/workspaces/api/models/create-workspace-schema"
import { useWorkspaces } from "@/modules/workspaces/hooks/use-workspaces"

export function WorkspaceSwitcher() {
  const [open, setOpen] = React.useState(false)
  const [switching, setSwitching] = React.useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const {
    workspaces,
    selectedWorkspace,
    isLoading,
    switchWorkspace,
    handleWorkspaceCreated
  } = useWorkspaces()

  const handleSelect = async (workspace: Workspace) => {
    if (workspace.id === selectedWorkspace?.id) {
      setOpen(false)
      return
    }

    setSwitching(true)

    try {
      await switchWorkspace(workspace)
    } catch (error) {
      console.error("Failed to switch workspace:", error)
    } finally {
      setSwitching(false)
      setOpen(false)
    }
  }

  const openCreateModal = () => {
    setOpen(false)
    setIsCreateModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className={cn(
        "w-full px-3 py-5 h-auto",
        isCollapsed && "p-3"
      )}>
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <Skeleton className="h-8 w-8 rounded-md" />
          {!isCollapsed && (
            <div className="flex flex-col gap-1 w-full">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          )}
        </div>
      </div>
    )
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
              "w-full justify-between px-3 py-5 h-auto text-left font-normal rounded-none hover:bg-sidebar-accent border-b",
              (isLoading || switching) && "opacity-50 cursor-not-allowed",
              isCollapsed && "justify-center p-3",
            )}
            disabled={isLoading || switching}
          >
            <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
              <Avatar className="h-8 w-8 rounded-md">
                <AvatarImage 
                  src={selectedWorkspace?.logo || "/placeholder.svg"} 
                  alt={selectedWorkspace?.name} 
                />
                <AvatarFallback className="rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
                  {selectedWorkspace?.emoji || selectedWorkspace?.name?.substring(0, 2) || "ST"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <p className="text-sm font-medium leading-none truncate">
                    {selectedWorkspace?.name || "Select Store"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {selectedWorkspace?.url || "No store selected"}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-(--radix-popover-trigger-width) p-0 border border-[#2D2D2D] shadow-[0_2px_12px_rgba(0,0,0,0.25)] rounded-md overflow-hidden" 
          align="start"
          sideOffset={5}
        >
          <Command className="rounded-none">
            <CommandInput placeholder="Search stores..." className="rounded-none" />
            <CommandList>
              {workspaces.length > 0 ? (
                <CommandGroup heading="Your stores">
                  {workspaces.map((workspace) => (
                    <CommandItem
                      key={workspace.id}
                      value={workspace.id.toString()}
                      onSelect={() => handleSelect(workspace)}
                      className="flex items-center gap-2 py-3"
                    >
                      <Avatar className="h-8 w-8 rounded-md">
                        <AvatarFallback className="rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
                          {workspace.emoji || workspace.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm">{workspace.name}</p>
                        <p className="text-xs text-muted-foreground">{workspace.url || workspace.description}</p>
                      </div>
                      {workspace.id === selectedWorkspace?.id && (
                        <Check className="ml-auto h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty className="pt-6 pb-2 px-2">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="relative w-12 h-12 mb-4">
                      <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                      <Store className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" />
                      <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-primary animate-bounce" />
                    </div>
                    <h3 className="text-sm font-medium mb-1">No stores found</h3>
                    <p className="text-xs text-muted-foreground mb-4">Get started by creating your first store</p>
                  </div>
                </CommandEmpty>
              )}
              <CommandSeparator className="bg-border" />
              <div className="p-2">
                <Button 
                  variant="dark"
                  className="w-full justify-center gap-2 font-medium text-sm hover:text-white/90" 
                  onClick={openCreateModal}
                >
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