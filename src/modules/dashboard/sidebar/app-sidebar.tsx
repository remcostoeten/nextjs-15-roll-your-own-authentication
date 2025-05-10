"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/ui/sidebar"
import { WorkspaceSwitcher } from "../workspace-switcher"
import { CreateWorkspaceModal } from "../create-workspace-modal"
import { type Workspace } from "@/modules/workspaces/api/models/create-workspace-schema"
import { MainNavigation } from "./navigation/main-navigation"
import { ContentNavigation } from "./navigation/content-navigation"
import { SettingsNavigation } from "./navigation/settings-navigation"
import { UserProfileDropdown } from "../user-profile-dropdown"
import { useWorkspaces } from "@/modules/workspaces/hooks/use-workspaces"

type AsideProps = React.ComponentProps<typeof Sidebar>

export function Aside(props: AsideProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const pathname = usePathname()
  const { toast } = useToast()
  
  const { 
    workspaces, 
    selectedWorkspace, 
    isLoading, 
    switchWorkspace, 
    fetchWorkspaces 
  } = useWorkspaces()

  const handleWorkspaceCreated = React.useCallback((workspace: Workspace) => {
    fetchWorkspaces()
    switchWorkspace(workspace)
    toast({
      title: "Success",
      description: "Store created successfully",
    })
  }, [fetchWorkspaces, switchWorkspace, toast])

  return (
    <Sidebar collapsible="icon" className="z-50 border-r-0" {...props}>
      <SidebarHeader className="pb-0">
        <WorkspaceSwitcher 
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          isLoading={isLoading}
          onSwitchWorkspace={switchWorkspace} 
        />
        {isCollapsed && (
          <div className="px-3 py-2 flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Create new store</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Create new store</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent className="px-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <MainNavigation pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <ContentNavigation pathname={pathname} isCollapsed={isCollapsed} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="pt-2">
        <SettingsNavigation pathname={pathname} />
        <div className="mt-auto pt-2 border-t border-sidebar-border">
          <UserProfileDropdown />
        </div>
      </SidebarFooter>
      
      <SidebarRail />

      <CreateWorkspaceModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onWorkspaceCreated={handleWorkspaceCreated}
      />
    </Sidebar>
  )
}