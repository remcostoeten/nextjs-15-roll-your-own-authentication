'use client';

import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { logout } from '@/modules/authenticatie/server/mutations/logout';
import { toast } from '@/shared/components/toast';
import { Button } from '@/shared/components/ui';
import { cn } from '@/shared/utilities';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
	ChevronRight,
	Home,
	Link as LinkIcon,
	LogOut,
	Menu,
	Settings,
	User,
	Users,
	X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        toast.success('Successfully logged out');
        router.replace('/login');
      } else {
        toast.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
  };

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const NavItem = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => {
    const isActive = pathname === href;

    return (
      <Link href={href} className="w-full">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
            isActive
              ? "bg-accent/50 text-accent-foreground font-medium"
              : "hover:bg-accent/30 text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
          <span>{children}</span>
          {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
        </div>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Menu"
          className="lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex-1">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            Dashboard
          </Link>
        </div>
        <ThemeToggle />
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt={auth.user?.email || ""} />
          <AvatarFallback>{auth.user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform lg:static lg:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Settings className="h-6 w-6" />
              <span>Dashboard</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close Sidebar"
              className="ml-auto lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close Sidebar</span>
            </Button>
          </div>
          <nav className="flex-1 overflow-auto py-4 px-2">
            <div className="space-y-1 px-2">
              <NavItem href="/dashboard" icon={Home}>Dashboard</NavItem>
              <NavItem href="/dashboard/profile" icon={User}>Profile</NavItem>
              <NavItem href="/dashboard/connected-accounts" icon={LinkIcon}>Connected Accounts</NavItem>
              <NavItem href="/dashboard/team" icon={Users}>Team</NavItem>
              <NavItem href="/dashboard/settings" icon={Settings}>Settings</NavItem>
            </div>
          </nav>
          <div className="sticky bottom-0 border-t bg-background p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt={auth.user?.email || ""} />
                <AvatarFallback>{auth.user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium leading-none">{auth.user?.name || auth.user?.email}</div>
                <div className="text-xs text-muted-foreground truncate">{auth.user?.email}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="container py-6 md:py-8 lg:py-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {pathname === '/dashboard' && 'Dashboard'}
                  {pathname === '/dashboard/profile' && 'Profile'}
                  {pathname === '/dashboard/connected-accounts' && 'Connected Accounts'}
                  {pathname === '/dashboard/team' && 'Team'}
                  {pathname === '/dashboard/settings' && 'Settings'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {pathname === '/dashboard' && 'Welcome to your dashboard'}
                  {pathname === '/dashboard/profile' && 'Manage your personal information'}
                  {pathname === '/dashboard/connected-accounts' && 'Manage your connected accounts and services'}
                  {pathname === '/dashboard/team' && 'Manage your team members'}
                  {pathname === '/dashboard/settings' && 'Configure your account settings'}
                </p>
              </div>
              <div className="hidden md:flex md:items-center md:gap-4">
                <ThemeToggle />
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
