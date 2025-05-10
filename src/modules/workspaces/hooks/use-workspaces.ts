import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Workspace } from '../api/models/create-workspace-schema'
import { updateWorkspacePreference } from '../api/mutations/update-workspace-preference'
import { getWorkspacePreference } from '../api/queries/get-workspace-preference'
import { getWorkspaces } from '../api/queries/get-workspaces'

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function fetchWorkspaces() {
    setIsLoading(true)
    setError(null)
    try {
      const [workspacesData, preferenceData] = await Promise.all([
        getWorkspaces(),
        getWorkspacePreference()
      ])

      if (workspacesData?.length) {
        setWorkspaces(workspacesData)

        if (preferenceData?.workspaceId) {
          const preferred = workspacesData.find(
            (w: Workspace) => w.id === preferenceData.workspaceId
          )
          if (preferred) {
            setSelectedWorkspace(preferred)
          } else {
            setSelectedWorkspace(workspacesData[0])
            await updateWorkspacePreference(workspacesData[0].id)
          }
        } else {
          setSelectedWorkspace(workspacesData[0])
          await updateWorkspacePreference(workspacesData[0].id)
        }
      } else {
        setWorkspaces([])
        setSelectedWorkspace(null)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred while fetching workspaces'
      setError(message)
      console.error('Failed to fetch workspaces:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkspaces()
  }, []) // Empty dependency array means this runs once on mount

  async function switchWorkspace(workspace: Workspace) {
    try {
      await updateWorkspacePreference(workspace.id)
      setSelectedWorkspace(workspace)
      router.push(`/dashboard/${workspace.id}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to switch workspace'
      setError(message)
      console.error('Failed to switch workspace:', error)
    }
  }

  async function handleWorkspaceCreated(workspace: Workspace) {
    try {
      await fetchWorkspaces() // Refresh the workspace list
      await switchWorkspace(workspace) // Switch to the newly created workspace
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to handle new workspace'
      setError(message)
      console.error('Failed to handle new workspace:', error)
    }
  }

  return {
    workspaces,
    selectedWorkspace,
    isLoading,
    error,
    switchWorkspace,
    fetchWorkspaces,
    handleWorkspaceCreated
  }
}
