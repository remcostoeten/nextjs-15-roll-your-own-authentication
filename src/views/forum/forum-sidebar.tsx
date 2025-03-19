"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { forumNavItems } from "@/modules/posts/config/navigation"

export function ForumSidebar() {
    const pathname = usePathname()

    return (
        <div className="w-full max-w-[240px] h-full pr-4">
            <div className="sticky top-4 space-y-4">
                <Link
                    href="/forum/new"
                    className="flex items-center gap-2 w-full p-2 rounded-md bg-[#4e9815]/10 border border-[#4e9815]/30 text-[#4e9815] hover:bg-[#4e9815]/20 transition-colors"
                >
                    <PlusCircle className="h-4 w-4" />
                    <span>New Post</span>
                </Link>

                <nav className="space-y-1">
                    {forumNavItems.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href)

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                                        ? "bg-button text-title-light"
                                        : "text-button hover:text-title-light hover:bg-button/50"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
} 