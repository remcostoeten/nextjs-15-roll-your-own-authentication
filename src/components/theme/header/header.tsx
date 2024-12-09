'use client'

import { siteConfig } from '@/config/site'
import useAuthHeader from '@/hooks/use-auth-header'
import { useMountedTheme } from '@/hooks/use-mounted-theme'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from 'helpers'
import { ChevronDown, Github, LogOut, Menu, Moon, Search, Settings, Sun, User, X } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenu as UIDropdownMenu
} from 'ui'
import Logo from '../logo'
import type { HeaderProps } from './header.d'

// Update the MenuBadge component to handle light/dark themes
const MenuBadge = ({ type }: { type: 'new' | 'soon' | 'beta' }) => {
    const { theme } = useMountedTheme()

    const badges = {
        new: {
            text: 'New',
            className: theme === 'dark'
                ? 'bg-white/10 text-white border-white/[0.15]'
                : 'bg-black/10 text-black border-black/[0.15]'
        },
        soon: {
            text: 'Soon',
            className: theme === 'dark'
                ? 'bg-blue-500/10 text-blue-500 border-blue-500/[0.15]'
                : 'bg-blue-500/10 text-blue-600 border-blue-500/[0.15]'
        },
        beta: {
            text: 'Beta',
            className: theme === 'dark'
                ? 'bg-purple-500/10 text-purple-500 border-purple-500/[0.15]'
                : 'bg-purple-500/10 text-purple-600 border-purple-500/[0.15]'
        }
    }

    const badge = badges[type]

    return (
        <span
            className={cn(
                'ml-2 px-1.5 py-0.5 text-[10px] font-medium rounded border',
                badge.className
            )}
        >
            {badge.text}
        </span>
    )
}

// Search Modal Component
type SearchResult = {
    title: string
    href: string
}

const SearchModal = ({
    isOpen,
    onClose
}: {
    isOpen: boolean
    onClose: () => void
}) => {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])

    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        // Add your search logic here
        // This is a basic example - enhance based on your needs
        const results = [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Profile', href: '/profile' },
            { title: 'Settings', href: '/settings' },
            // Add more routes as needed
        ].filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(results)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50"
                >
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative max-w-2xl mx-auto mt-[15vh]"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <div className="m-4 bg-[#1C1C1C] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                            <div className="flex items-center p-4 border-b border-white/10">
                                <Search className="w-5 h-5 text-white/40" aria-hidden="true" />
                                <input
                                    autoFocus
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="flex-1 ml-3 bg-transparent border-none outline-none text-white placeholder-white/40"
                                />
                                <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-white/40 bg-white/5 rounded">
                                    ESC
                                </kbd>
                            </div>
                            <div className="p-4">
                                {searchQuery ? (
                                    searchResults.length > 0 ? (
                                        <div className="space-y-2">
                                            {searchResults.map((result: SearchResult) => (
                                                <Link
                                                    key={result.href}
                                                    href={result.href}
                                                    onClick={onClose}
                                                    className="block p-2 rounded hover:bg-white/5 transition-colors text-white/80 hover:text-white"
                                                >
                                                    {result.title}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-white/40">
                                            No results found
                                        </div>
                                    )
                                ) : (
                                    <div className="text-sm text-white/40">
                                        Start typing to search...
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

const DropdownMenu = ({
    items,
    isOpen,
    onClose
}: {
    items: DropdownItem[]
    isOpen: boolean
    onClose: () => void
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-30"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className={`
              absolute top-[120%] left-0
              min-w-[320px] p-2
              bg-[#141414] border border-white/[0.08]
              rounded-xl shadow-xl shadow-black/40
              backdrop-blur-xl
              z-40
            `}
                    >
                        {items.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={onClose}
                                className="relative flex flex-col gap-0.5 px-4 py-3 rounded-lg
                  text-white/70 hover:text-white
                  hover:bg-white/[0.06]
                  group"
                            >
                                <span className="font-medium text-[14px]">
                                    {item.label}
                                </span>
                                {item.description && (
                                    <span className="text-[13px] text-white/40 group-hover:text-white/50">
                                        {item.description}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// Update the menu items to include new badge types
const MENU_ITEMS: MenuItem[] = [
    {
        label: 'Docs',
        href: '#',
        dropdownItems: [
            {
                label: 'Getting Started',
                href: '/docs/getting-started',
                description: 'Quick start guide and installation'
            },
            {
                label: 'Components',
                href: '/docs/components',
                description: 'UI components and usage examples'
            },
            {
                label: 'Authentication',
                href: '/docs/auth',
                description: 'User authentication and authorization',
                isBeta: true
            },
            {
                label: 'API Reference',
                href: '/docs/api',
                description: 'Complete API documentation'
            },
            {
                label: 'Deployment',
                href: '/docs/deployment',
                description: 'Deploy your application',
                isSoon: true
            }
        ]
    },
    {
        label: 'Changelog',
        href: '/changelog',
        isNew: true
    },
    {
        label: 'Roadmap',
        href: '/roadmap',
        isSoon: true
    }
]

const MobileMenu = ({
    isOpen,
    onClose,
    user,
    onSignOut
}: {
    isOpen: boolean
    onClose: () => void
    user: any
    onSignOut: () => void
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div>
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-zinc-900 border-l border-white/10"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <span className="text-lg font-medium text-white">
                                    Menu
                                </span>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-white/60 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex-1 overflow-y-auto p-4">
                                <div className="space-y-4">
                                    <Link
                                        href="/"
                                        className="block px-4 py-2 text-white/80 hover:text-white"
                                        onClick={onClose}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/pages"
                                        className="block px-4 py-2 text-white/80 hover:text-white"
                                        onClick={onClose}
                                    >
                                        Pages
                                    </Link>
                                    <Link
                                        href="/components"
                                        className="block px-4 py-2 text-white/80 hover:text-white"
                                        onClick={onClose}
                                    >
                                        Components
                                    </Link>
                                    <Link
                                        href="/blog"
                                        className="block px-4 py-2 text-white/80 hover:text-white"
                                        onClick={onClose}
                                    >
                                        Blog
                                    </Link>
                                    <Link
                                        href="/changelog"
                                        className="block px-4 py-2 text-white/80 hover:text-white"
                                        onClick={onClose}
                                    >
                                        Changelog
                                    </Link>
                                </div>
                            </nav>

                            <div className="p-4 border-t border-white/10">
                                {user ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 px-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={user.image || ''}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback className="bg-white/10 text-white">
                                                    {user.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-white/60">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                onSignOut()
                                                onClose()
                                            }}
                                            className="w-full px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="w-full px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
                                        onClick={onClose}
                                    >
                                        Sign in
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default function Header({ className }: HeaderProps) {
    const [scrolled, setScrolled] = React.useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [isSearchOpen, setIsSearchOpen] = React.useState(false)
    const { theme } = useMountedTheme()
    const { user, signOut } = useAuthHeader()

    React.useEffect(() => {
        setScrolled(window.scrollY > 20)

        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <div
                className={cn(
                    'fixed top-0 z-50 left-1/2 -translate-x-1/2',
                    className
                )}
            >
                <motion.div
                    initial={false}
                    className={cn(
                        'transition-[width] duration-700',
                        'ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                        scrolled
                            ? 'w-[100vw]'
                            : 'w-[calc(100vw-2rem)] max-w-7xl'
                    )}
                >
                    <motion.nav
                        initial={false}
                        style={{
                            width: '100%',
                            transformOrigin: 'center top'
                        }}
                        animate={{
                            borderRadius: scrolled ? '0' : '1.5rem',
                            backgroundColor: scrolled
                                ? theme === 'dark'
                                    ? 'rgba(18, 18, 18, 0.65)'
                                    : 'rgba(255, 255, 255, 0.65)'
                                : theme === 'dark'
                                    ? 'rgba(18, 18, 18, 0.1)'
                                    : 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: scrolled ? 'blur(8px)' : 'blur(4px)',
                            boxShadow: scrolled
                                ? '0 4px 20px rgba(0, 0, 0, 0.06)'
                                : 'none'
                        }}
                        transition={{
                            duration: 0.7,
                            ease: [0.34, 1.56, 0.64, 1]
                        }}
                        className={cn(
                            'flex items-center justify-between',
                            'px-6 h-[60px]',
                            'border',
                            theme === 'dark'
                                ? 'border-white/10'
                                : 'border-black/10',
                            scrolled
                                ? 'shadow-lg shadow-black/5 border-t-0'
                                : 'mt-4'
                        )}
                    >
                        <Logo
                            hasLink
                            className={cn(
                                "transition-colors duration-200",
                                theme === 'dark'
                                    ? "text-white/60 hover:text-white"
                                    : "text-black/60 hover:text-black"
                            )}
                        />

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex flex-1 items-center space-x-1">
                            {MENU_ITEMS.map((item) => (
                                <div
                                    key={item.label}
                                    className="relative"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {item.dropdownItems ? (
                                        <button
                                            onClick={() =>
                                                setOpenDropdown(
                                                    openDropdown === item.label
                                                        ? null
                                                        : item.label
                                                )
                                            }
                                            className={cn(
                                                "flex items-center px-3 py-2 text-[14px] font-medium",
                                                "transition-colors duration-200",
                                                theme === 'dark'
                                                    ? "text-white/60 hover:text-white"
                                                    : "text-black/60 hover:text-black"
                                            )}
                                        >
                                            {item.icon ? item.icon : item.label}
                                            {item.isNew && <MenuBadge type="new" />}
                                            {item.isSoon && <MenuBadge type="soon" />}
                                            {item.isBeta && <MenuBadge type="beta" />}
                                            <motion.div
                                                animate={{
                                                    rotate:
                                                        openDropdown ===
                                                            item.label
                                                            ? 180
                                                            : 0
                                                }}
                                                className="ml-1 opacity-50"
                                            >
                                                <ChevronDown size={14} />
                                            </motion.div>
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center px-3 py-2 text-[14px] font-medium",
                                                "transition-colors duration-200",
                                                theme === 'dark'
                                                    ? "text-white/60 hover:text-white"
                                                    : "text-black/60 hover:text-black"
                                            )}
                                            {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                        >
                                            {item.icon ? item.icon : item.label}
                                            {item.isNew && <MenuBadge type="new" />}
                                            {item.isSoon && <MenuBadge type="soon" />}
                                            {item.isBeta && <MenuBadge type="beta" />}
                                        </Link>
                                    )}

                                    {item.dropdownItems && (
                                        <DropdownMenu
                                            items={item.dropdownItems}
                                            isOpen={openDropdown === item.label}
                                            onClose={() => setOpenDropdown(null)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center space-x-2">
                            <button
                                className={cn(
                                    "p-2 rounded-lg transition-colors duration-200",
                                    theme === 'dark'
                                        ? "text-white/60 hover:text-white"
                                        : "text-black/60 hover:text-black"
                                )}
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                {theme === 'dark' ? (
                                    <Moon size={18} />
                                ) : (
                                    <Sun size={18} />
                                )}
                            </button>

                            <Link
                                href={siteConfig.repository}
                                className={cn(
                                    "p-2 rounded-lg transition-colors duration-200",
                                    theme === 'dark'
                                        ? "text-white/60 hover:text-white"
                                        : "text-black/60 hover:text-black"
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github size={18} />
                            </Link>

                            <button
                                className={cn(
                                    "p-2 rounded-lg transition-colors duration-200",
                                    theme === 'dark'
                                        ? "text-white/60 hover:text-white"
                                        : "text-black/60 hover:text-black"
                                )}
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search size={18} />
                            </button>

                            {user ? (
                                <UIDropdownMenu>
                                    <DropdownMenuTrigger className="focus:outline-none">
                                        <Avatar className="h-8 w-8 cursor-pointer">
                                            <AvatarImage src={user.image || ''} alt={user.name} />
                                            <AvatarFallback className={cn(
                                                "text-white",
                                                theme === 'dark' ? "bg-white/10" : "bg-black/10"
                                            )}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem asChild>
                                                <Link href="/profile" className="w-full cursor-pointer">
                                                    <User strokeWidth={1.5} size={16} className="mr-2" />
                                                    Profile
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="w-full cursor-pointer">
                                                    <Settings strokeWidth={1.5} size={16} className="mr-2" />
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            onClick={signOut}
                                            className="text-red-600 focus:text-red-600 cursor-pointer"
                                        >
                                            <LogOut strokeWidth={1.5} size={16} className="mr-2" />
                                            Sign out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </UIDropdownMenu>
                            ) : (
                                <Link
                                    href="/login"
                                    className={cn(
                                        "hidden sm:block ml-2 px-5 py-1.5 text-sm font-medium rounded-full transition-colors duration-200",
                                        theme === 'dark'
                                            ? "text-white bg-white/10 hover:bg-white/[0.15]"
                                            : "text-black bg-black/10 hover:bg-black/[0.15]"
                                    )}
                                >
                                    Sign in
                                </Link>
                            )}

                            <button
                                className={cn(
                                    "lg:hidden p-2 transition-colors duration-200",
                                    theme === 'dark'
                                        ? "text-white/60 hover:text-white"
                                        : "text-black/60 hover:text-black"
                                )}
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </motion.nav>
                </motion.div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                user={user}
                onSignOut={signOut}
            />

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    )
}
