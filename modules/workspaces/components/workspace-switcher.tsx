"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, PlusCircle, Briefcase } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getUserWorkspaces } from "../api/queries"
import { createWorkspace } from "../api/mutations"
import { useToast } from "@/components/ui/use-toast"

type Workspace = {
  id: number
  name: string
  slug: string
  description: string | null
  logo: string | null
  role: string
}

interface WorkspaceSwitcherProps {
  currentWorkspace?: Workspace | null
}

export function WorkspaceSwitcher({ currentWorkspace }: WorkspaceSwitcherProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true)
      try {
        const data = await getUserWorkspaces()
        setWorkspaces(data)
      } catch (error) {
        console.error("Error fetching workspaces:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkspaces()
  }, [])

  // Handle workspace selection
  const handleSelectWorkspace = (workspace: Workspace) => {
    router.push(`/dashboard/workspaces/${workspace.slug}`)
    setOpen(false)
  }

  // Handle create workspace
  const handleCreateWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreating(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await createWorkspace(formData)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Failed to create workspace",
          description: result.error,
        })
      } else {
        toast({
          title: "Workspace created",
          description: "Your workspace has been created successfully.",
        })
        setShowNewWorkspaceDialog(false)
        router.push(`/dashboard/workspaces/${result.slug}`)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={showNewWorkspaceDialog} onOpenChange={setShowNewWorkspaceDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a workspace"
            className="w-[200px] justify-between"
          >
            {currentWorkspace ? (
              <>
                <Briefcase className="mr-2 h-4 w-4" />
                <span className="truncate">{currentWorkspace.name}</span>
              </>
            ) : (
              <>
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Select workspace</span>
              </>
            )}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search workspace..." />
              <CommandEmpty>No workspace found.</CommandEmpty>
              {workspaces.length > 0 ? (
                <CommandGroup heading="Workspaces">
                  {workspaces.map((workspace) => (
                    <CommandItem
                      key={workspace.id}
                      onSelect={() => handleSelectWorkspace(workspace)}
                      className="text-sm"
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span className="truncate">{workspace.name}</span>
                      {currentWorkspace?.id === workspace.id && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <div className="py-6 text-center text-sm">{isLoading ? "Loading..." : "No workspaces found"}</div>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowNewWorkspaceDialog(true)
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Workspace
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DialogContent>
        <form onSubmit={handleCreateWorkspace}>
          <DialogHeader>
            <DialogTitle>Create workspace</DialogTitle>
            <DialogDescription>Add a new workspace to organize your projects and tasks.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Acme Inc." required disabled={isCreating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Team workspace for Acme Inc."
                disabled={isCreating}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNewWorkspaceDialog(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

