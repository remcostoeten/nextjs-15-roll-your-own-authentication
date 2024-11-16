'use client'

import { useToast } from "@/components/primitives/toast"
import Logo from "@/components/theme/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserProfile } from "@/features/authentication/types"
import { Layout, LogOut, Settings, Square, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
  user: UserProfile
}

export default function Navigation({ user }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const demoRoutes = [
    { 
      href: "/toast-showcase", 
      text: "Toast Showcase",
      description: "Explore our toast notification system",
      icon: Layout 
    },
    { 
      href: "/button-showcase", 
      text: "Button Showcase",
      description: "View our button component variations",
      icon: Layout 
    },
    { 
      href: "/square", 
      text: "Square Demo",
      description: "Check out our square component",
      icon: Square 
    },
  ]

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Sign out failed",
        description: "Something went wrong while signing out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const initials = user.email?.slice(0, 2).toUpperCase() || ''

  return (
    <nav className="max-w-7xl mx-auto">  // Added max-width container
      <div className="rounded-[20px] fixed top-4 w-full max-w-full container mx-auto bg-[rgba(23,24,37,0.75)] backdrop-blur-[10px]
                       shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.3)]
                       pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Logo />
              <ul 
                data-orientation="horizontal" 
                dir="ltr"
                className="flex items-center gap-1 p-2 ml-4 text-xs leading-none 
                "
              >
                <li>
                  <Link href="/docs" className="inline-flex items-center appearance-none font-medium text-white no-underline bg-transparent py-3 -my-3">
                    <span className="h-6 px-3 inline-flex items-center rounded-xl transition-colors duration-300 hover:bg-white/12 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                      Docs
                    </span>
                  </Link>
                </li>
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="inline-flex items-center appearance-none font-medium text-white no-underline bg-transparent py-3 -my-3"
                      >
                        <span className="h-6 px-3 inline-flex items-center rounded-xl transition-colors duration-300 hover:bg-white/12 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                          Demos
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[400px] p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {demoRoutes.map((route) => (
                          <DropdownMenuItem key={route.href} asChild>
                            <Link href={route.href} className="flex items-start p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                              <route.icon className="h-5 w-5 mr-3 mt-0.5 text-gray-500 dark:text-gray-400" />
                              <div>
                                <div className="font-medium">{route.text}</div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{route.description}</p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </ul>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatarUrl || ''}
                        alt={user.email || ''}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.role || 'User'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleSignOut}
                    disabled={isLoading}
                  >
                    <span className='flex items-center gap-2'>
                      <LogOut className="mr-2 h-4 w-4" />
                      {isLoading ? 'Signing out...' : 'Sign out'}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
