"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Bookmark, MessageCircle, Settings, Plus, Bell } from "lucide-react"
import { cn } from "@/shared/utils/cn"

const navItems = [
    { name: "My Feed", href: "/forum", icon: <Home className="h-5 w-5" /> },
    { name: "Groups", href: "/forum/groups", icon: <Users className="h-5 w-5" /> },
    { name: "Bookmarks", href: "/forum/bookmarks", icon: <Bookmark className="h-5 w-5" /> },
    { name: "Messages", href: "/forum/messages", icon: <MessageCircle className="h-5 w-5" /> },
    { name: "Notifications", href: "/forum/notifications", icon: <Bell className="h-5 w-5" /> },
    { name: "Settings", href: "/forum/settings", icon: <Settings className="h-5 w-5" /> },
]

export function ForumSidebar() {
    const pathname = usePathname()

    return (
        <div className="sticky top-20 space-y-6">
            <Link
                href="/forum/new"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#4e9815]/10 border border-[#4e9815]/30 text-[#4e9815] hover:bg-[#4e9815]/20 transition-colors"
            >
                <Plus className="h-4 w-4" />
                <span>New Post</span>
            </Link>

            <nav className="space-y-1">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/forum"
                            ? pathname === "/forum"
                            : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                                isActive
                                    ? "bg-background-lighter text-title-light border-l-2 border-title-light pl-[10px]"
                                    : "text-button hover:text-title-light hover:bg-background-lighter/50"
                            )}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
} 