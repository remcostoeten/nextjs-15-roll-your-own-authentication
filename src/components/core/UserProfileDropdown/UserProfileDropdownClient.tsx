import { useTheme } from 'next-themes';
import { useHotkeys } from '@/hooks/use-hotkeys';
import { Avatar, Button, DropdownMenu } from 'ui';
import { Moon, Sun, LogOut } from 'lucide-react';
import type { User } from '@/modules/auth/api/schemas/z.user';
import { logout } from '@/modules/auth/api/mutations/logout';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useMemo } from 'react';

interface UserProfileDropdownClientProps {
    user: User;
}

export const UserProfileDropdownClient = memo(function UserProfileDropdownClient({ user }: UserProfileDropdownClientProps) {
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }, [setTheme]);

    useHotkeys([
        ['mod+j', toggleTheme],
    ]);

    const handleLogout = useCallback(async () => {
        try {
            const result = await logout();
            if (result.success) {
                router.push('/login');
                router.refresh();
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [router]);

    const userInitial = useMemo(() => {
        return user.name?.[0] ?? user.email[0].toUpperCase();
    }, [user.name, user.email]);

    return (
        <DropdownMenu>
            <DropdownMenu.Trigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                        <Avatar.Image src={user.image ?? ''} alt={user.name ?? ''} />
                        <Avatar.Fallback>
                            {userInitial}
                        </Avatar.Fallback>
                    </Avatar>
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="w-56" align="end">
                <DropdownMenu.Label className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onClick={toggleTheme}>
                    {theme === 'light' ? (
                        <Moon className="mr-2 h-4 w-4" />
                    ) : (
                        <Sun className="mr-2 h-4 w-4" />
                    )}
                    Toggle theme
                    <DropdownMenu.Shortcut>⌘J</DropdownMenu.Shortcut>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu>
    );
}); 