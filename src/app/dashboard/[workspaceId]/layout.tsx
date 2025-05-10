'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useWorkspaces } from '@/modules/workspaces/hooks/use-workspaces'

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const { workspaces, selectedWorkspace, switchWorkspace } = useWorkspaces()

  // Ensure the selected workspace matches the URL
  useEffect(() => {
    if (params.workspaceId && workspaces.length > 0) {
      const workspaceId = Number(params.workspaceId)
      const workspace = workspaces.find(w => w.id === workspaceId)
      
      if (workspace && (!selectedWorkspace || selectedWorkspace.id !== workspaceId)) {
        switchWorkspace(workspace)
      }
    }
  }, [params.workspaceId, workspaces, selectedWorkspace])

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {children}
    </div>
  )
} 