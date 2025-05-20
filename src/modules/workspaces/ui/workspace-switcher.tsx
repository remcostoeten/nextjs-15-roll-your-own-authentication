"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Input, Label, Textarea } from "@/shared/components/ui"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useToast } from "@/shared/components/ui/use-toast"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { createWorkspace } from "../server/mutations/create-workspace"

interface WorkspaceSwitcherProps {
  currentWorkspace: {
    id: string
    title: string
  }
  workspaces: Array<{
    id: string
    title: string
    role: string
  }>
}

export function WorkspaceSwitcher({ currentWorkspace, workspaces }: WorkspaceSwitcherProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        message: "Workspace name is required",
        open: true,
        onOpenChange: () => {},
      })
      return
    }

    startTransition(async () => {
      const result = await createWorkspace(formData)

      if (result.success) {
        toast({
          message: "Your workspace has been created successfully.",
          open: true,
          onOpenChange: () => {},
        })
        setIsCreateDialogOpen(false)
        setFormData({ name: "", description: "" })
        router.push(`/workspace/${result.workspace?.id}`)
      } else {
        toast({
          message: result.error || "Failed to create workspace",
          open: true,
          onOpenChange: () => {},
        })
      }
    })
  }

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="truncate">{currentWorkspace.title}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuLabel>Your Workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => router.push(`/workspace/${workspace.id}`)}
              className="flex items-center justify-between"
            >
              <span className="truncate">{workspace.title}</span>
              {workspace.id === currentWorkspace.id && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new workspace</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateWorkspace} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Workspace Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Workspace"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your workspace"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="outline" className="mr-2" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending || !formData.name.trim()}>
                    {isPending ? "Creating..." : "Create Workspace"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
