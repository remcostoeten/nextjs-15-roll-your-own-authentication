'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const items = [
  {
    title: 'Overview',
    href: '/dashboard',
  },
  {
    title: 'Posts',
    href: '/dashboard/posts',
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
} 