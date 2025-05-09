"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Plus,
  Settings,
  ShoppingCart,
  Users,
  FileText,
  BarChart,
  Paintbrush,
  CircleDollarSign,
  Briefcase,
  Edit,
  Eye,
  Trash2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserProfileDropdown } from "@/modules/dashboard/user-profile-dropdown"
import { CreateWorkspaceModal } from "./create-workspace-modal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "react-hot-toast"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Track expanded state for each collapsible section
  const [expandedSections, setExpandedSections] = React.useState({
    posts: true,
    pages: false,
  })
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const pathname = usePathname()

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  async function switchWorkspace(workspace: any) {
    try {
      await switchWorkspace(workspace.id)
    } catch (error) {
      console.error("Failed to switch workspace:", error)
      toast.error("Failed to switch workspace")
    }
  }

  const handleWorkspaceCreated = (workspace: any) => {
    console.log("New workspace created:", workspace)
    toast.success("not yet implemented")
  }

  const animationProps = {
    initial: { height: 0, opacity: 0, overflow: "hidden" },
    animate: { height: "auto", opacity: 1, overflow: "visible" },
    exit: { height: 0, opacity: 0, overflow: "hidden" },
    transition: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] },
  }

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname?.startsWith(path)
  }

  function handleSwitchWorkspace(workspace: any) {
    switchWorkspace(workspace)
  }

  return (
    <Sidebar collapsible="icon" className="z-50 border-r-0" {...props}>
      <SidebarHeader className="pb-0">
        <WorkspaceSwitcher onSwitchWorkspace={handleSwitchWorkspace} />
        {isCollapsed && (
          <div className="px-3 py-2 flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="icon" size="sm" className="h-8 w-8" onClick={() => setIsCreateModalOpen(true)}>
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
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")}>
                  <Link href="/">
                    <BarChart className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/products")}>
                  <Link href="/products">
                    <Briefcase className="h-4 w-4" />
                    <span>Products</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/analytics")}>
                  <Link href="/analytics">
                    <BarChart className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/orders")}>
                  <Link href="/orders">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/subscribers")}>
                  <Link href="/subscribers">
                    <Users className="h-4 w-4" />
                    <span>Subscribers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/payouts")}>
                  <Link href="#">
                    <CircleDollarSign className="h-4 w-4" />
                    <span>Payouts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Posts section */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => toggleSection("posts")} className={cn("relative")}>
                  <FileText className="h-4 w-4" />
                  <span>Posts</span>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1.5 h-6 w-6 opacity-60 hover:opacity-100 bg-sidebar-accent hover:bg-sidebar-accent/80"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Post actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Create new post</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View all posts</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit category</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete category</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>

              <AnimatePresence initial={false}>
                {expandedSections.posts && !isCollapsed && (
                  <motion.div {...animationProps} key="posts-submenu">
                    <div className="ml-8 space-y-0.5 py-1">
                      <div className="flex items-center justify-between py-1.5 px-3 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <a href="#" className="grow">
                          Drafts
                        </a>
                        <span className="text-xs bg-sidebar-accent px-1.5 py-0.5 rounded-full">10</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 px-3 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <a href="#" className="grow">
                          Scheduled
                        </a>
                        <span className="text-xs bg-sidebar-accent px-1.5 py-0.5 rounded-full">2</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 px-3 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <a href="#" className="grow">
                          Published
                        </a>
                        <span className="text-xs bg-sidebar-accent px-1.5 py-0.5 rounded-full">28</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pages section */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => toggleSection("pages")} className={cn("relative")}>
                  <FileText className="h-4 w-4" />
                  <span>Pages</span>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1.5 h-6 w-6 opacity-60 hover:opacity-100 bg-sidebar-accent hover:bg-sidebar-accent/80"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Page actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Create new page</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View all pages</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit section</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete section</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>

              <AnimatePresence initial={false}>
                {expandedSections.pages && !isCollapsed && (
                  <motion.div {...animationProps} key="pages-submenu">
                    <div className="ml-8 space-y-0.5 py-1">
                      <div className="flex items-center justify-between py-1.5 px-3 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <a href="#" className="grow">
                          Home
                        </a>
                      </div>
                      <div className="flex items-center justify-between py-1.5 px-3 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <a href="#" className="grow">
                          About
                        </a>
                      </div>
                      <div className="flex items-center justify-between py-1.5 px-3 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <a href="#" className="grow">
                          Contact
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/performance")}>
                  <Link href="#">
                    <BarChart className="h-4 w-4" />
                    <span>Performance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/team")}>
                  <Link href="#">
                    <Users className="h-4 w-4" />
                    <span>Team management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/customize")}>
                  <Link href="#">
                    <Paintbrush className="h-4 w-4" />
                    <span>Customize</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/settings")}>
              <Link href="#">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
