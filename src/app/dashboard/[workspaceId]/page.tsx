'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getWorkspaceById } from '@/modules/workspaces/api/queries/get-workspace-by-id'
import { Workspace } from '@/modules/workspaces/api/models/create-workspace-schema'
import { Skeleton } from '@/components/ui/skeleton'

export default function WorkspacePage() {
  const params = useParams()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchWorkspace() {
      try {
        const workspaceData = await getWorkspaceById(Number(params.workspaceId))
        setWorkspace(workspaceData)
      } catch (error) {
        console.error('Failed to fetch workspace:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.workspaceId) {
      fetchWorkspace()
    }
  }, [params.workspaceId])

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Workspace not found</h1>
        <p className="text-muted-foreground mt-2">
          The workspace you're looking for doesn't exist or you don't have access to it.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 flex items-center justify-center text-2xl bg-sidebar-accent rounded-md">
          {workspace.emoji}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{workspace.name}</h1>
          <p className="text-muted-foreground">{workspace.description}</p>
        </div>
      </div>

      {/* Workspace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-lg border">
          <h3 className="font-medium mb-1">Total Products</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-4 bg-card rounded-lg border">
          <h3 className="font-medium mb-1">Total Orders</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-4 bg-card rounded-lg border">
          <h3 className="font-medium mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold">$0</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-muted-foreground text-center py-8">
            No recent activity
          </p>
        </div>
      </div>
    </div>
  )
} 