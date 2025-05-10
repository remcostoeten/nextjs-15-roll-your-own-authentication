import { 
  BarChart, 
  Briefcase, 
  ShoppingCart, 
  Users, 
  CircleDollarSign, 
  FileText, 
  Paintbrush,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react"

import { SidebarNavConfig, ExpandableNavSection, NavItem } from "../types/navigation-types"

// Main navigation items
export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: BarChart,
  },
  {
    href: "/products",
    label: "Products",
    icon: Briefcase,
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    href: "/subscribers",
    label: "Subscribers",
    icon: Users,
  },
  {
    href: "/payouts",
    label: "Payouts",
    icon: CircleDollarSign,
  },
]

// Expandable content sections
export const EXPANDABLE_SECTIONS: Record<string, ExpandableNavSection> = {
  posts: {
    id: "posts",
    label: "Posts",
    icon: FileText,
    defaultExpanded: true,
    items: [
      { label: "Drafts", href: "/posts/drafts", count: 10 },
      { label: "Scheduled", href: "/posts/scheduled", count: 2 },
      { label: "Published", href: "/posts/published", count: 28 },
    ],
    actions: [
      { 
        label: "Create new post", 
        icon: Plus, 
        onClick: () => {
          window.location.href = "/dashboard/posts/create"
        }
      },
      { label: "View all posts", icon: Eye, onClick: () => {
        window.location.href = "/dashboard/posts"
      }},
      { label: "Edit category", icon: Edit, onClick: () => console.log("Edit category") },
      { label: "Delete category", icon: Trash2, danger: true, onClick: () => console.log("Delete category") },
    ],
  },
  pages: {
    id: "pages",
    label: "Pages",
    icon: FileText,
    defaultExpanded: false,
    items: [
      { label: "Home", href: "/pages/home" },
      { label: "About", href: "/pages/about" },
      { label: "Contact", href: "/pages/contact" },
    ],
    actions: [
      { label: "Create new page", icon: Plus, onClick: () => console.log("Create page") },
      { label: "View all pages", icon: Eye, onClick: () => console.log("View pages") },
      { label: "Edit section", icon: Edit, onClick: () => console.log("Edit section") },
      { label: "Delete section", icon: Trash2, danger: true, onClick: () => console.log("Delete section") },
    ],
  },
}

// Additional content navigation items
export const CONTENT_NAV_ITEMS: NavItem[] = [
  {
    href: "/performance",
    label: "Performance",
    icon: BarChart,
  },
  {
    href: "/team",
    label: "Team management",
    icon: Users,
  },
  {
    href: "/customize",
    label: "Customize",
    icon: Paintbrush,
  },
]

// Settings navigation
export const SETTINGS_NAV_ITEMS: NavItem[] = [
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
]

// Complete sidebar navigation config
export const SIDEBAR_NAV_CONFIG: SidebarNavConfig = {
  mainNavigation: MAIN_NAV_ITEMS,
  contentNavigation: [
    EXPANDABLE_SECTIONS.posts,
    EXPANDABLE_SECTIONS.pages,
    ...CONTENT_NAV_ITEMS
  ],
  settingsNavigation: SETTINGS_NAV_ITEMS
}
