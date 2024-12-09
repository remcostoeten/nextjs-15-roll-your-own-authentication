'use client'

import { cn } from 'helpers'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = {
    title: string
    href: string
    status?: 'new' | 'soon'
}

type NavigationMenuProps = {
    items: NavItem[]
}

export function NavigationMenu({ items }: NavigationMenuProps) {
    const pathname = usePathname()

    return (
        <nav className="border-b">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center space-x-8">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80",
                                pathname === item.href ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            <span>{item.title}</span>
                            {item.status && (
                                <div 
                                    className={`ml-2 ${item.status === 'new' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                                >
                                    {item.status}
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
} 