'use client';

import { Logo } from '@/shared/components/core/logo';
import { Button } from '@/shared/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/shared/components/ui/navigation-menu';
import { cn } from '@/shared/utilities/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, LayoutDashboard, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  title: string;
  href: string;
  external?: boolean;
  children?: Array<{
    title: string;
    href: string;
    description: string;
  }>;
};

const mainNav: NavItem[] = [
  {
    title: 'Features',
    href: '/#features',
  },
  {
    title: 'Documentation',
    href: '/docs',
    children: [
      {
        title: 'Introduction',
        href: '/docs/introduction',
        description: 'Learn about the architecture and design decisions.',
      },
      {
        title: 'Authentication',
        href: '/docs/authentication',
        description: 'Custom rolled authentication system explained.',
      },
      {
        title: 'Components',
        href: '/docs/components',
        description: 'Explore our component library and usage.',
      },
    ],
  },
  {
    title: 'GitHub',
    href: 'https://github.com/remcostoeten/architecture-ryoa',
    external: true,
  },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Logo />
            <span className="font-semibold text-foreground">RYOA</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {mainNav.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                                  )}
                                >
                                  <div className="text-sm font-medium leading-none">{child.title}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {child.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors hover:text-foreground/80',
                        pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                      )}
                    >
                      {item.title}
                      {item.external && <Github className="h-4 w-4" />}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="auth-buttons"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </header>
  );
}
