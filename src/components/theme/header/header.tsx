'use client'

import { siteConfig } from '@/config/site'
import { useMountedTheme } from '@/hooks/use-mounted-theme'
import { checkAuthQuery } from '@/server/queries/check-auth'
import { cn } from 'helpers'
import { ChevronDown, Github, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from 'ui'
import ThemeSwitcher from '../color-switchter/color-switcher'
import Logo from '../logo'
import { DropdownMenu, MobileMenu, SearchModal } from './components'
import type { HeaderProps } from './header.d'
import { MENU_ITEMS } from './menu-items'

type User = NonNullable<HeaderProps['user']>

/**
 * Main header component with navigation and user actions
 * @author Remco Stoeten
 */
export function Header() {
    // All state hooks first
    const [isScrolled, setIsScrolled] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [user, setUser] = useState<User | undefined>(undefined)

    // Then other hooks
    const pathname = usePathname()
    const { theme } = useMountedTheme()

    // All useEffects together
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsSearchOpen(false)
                setActiveDropdown(null)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    useEffect(() => {
        setActiveDropdown(null)
        setIsMobileMenuOpen(false)
    }, [pathname])

    useEffect(() => {
        const checkAuth = async () => {
            const { authenticated, user } = await checkAuthQuery()
            if (authenticated && user) {
                setUser(user as User)
            }
        }

        checkAuth()
    }, [])

    // Event handlers
    const toggleDropdown = (key: string) => {
        setActiveDropdown(activeDropdown === key ? null : key)
    }

    const closeDropdown = () => {
        setActiveDropdown(null)
    }

    const handleSignOut = async () => {
        // Add your signout logic here
        setUser(undefined)
    }

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-40 border-b transition-all duration-200',
                isScrolled
                    ? 'bg-background/80 backdrop-blur-xl border-border'
                    : 'bg-transparent border-transparent'
            )}
        >
            <div className="container flex h-16 items-center">
                <Logo />

                <nav className="hidden md:flex items-center gap-1 ml-6">
                    {MENU_ITEMS.map((item) => (
                        <div key={item.label} className="relative">
                            <button
                                onClick={() => toggleDropdown(item.label)}
                                className={cn(
                                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium',
                                    'text-foreground/60 hover:text-foreground',
                                    activeDropdown === item.label &&
                                    'text-foreground bg-accent'
                                )}
                            >
                                {item.label}
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {item.items && (
                                <DropdownMenu
                                    items={item.items}
                                    isOpen={activeDropdown === item.label}
                                    onClose={closeDropdown}
                                />
                            )}
                        </div>
                    ))}
                </nav>

                <div className="flex items-center ml-auto gap-2">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 text-foreground/60 hover:text-foreground"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    {siteConfig.socials.github && (
                        <a
                            href={siteConfig.socials.github}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-foreground/60 hover:text-foreground"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                    )}

                    <ThemeSwitcher />

                    {user ? (
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <button
                                onClick={handleSignOut}
                                className="text-sm text-foreground/60 hover:text-foreground"
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="text-sm font-medium text-foreground/60 hover:text-foreground"
                        >
                            Sign in
                        </Link>
                    )}

                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-foreground/60 hover:text-foreground md:hidden"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                user={user}
                onSignOut={handleSignOut}
            />
        </header>
    )
}
