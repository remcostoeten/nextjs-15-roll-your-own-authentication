import { Suspense, type ReactNode } from 'react';
import { getCurrentUser } from '@/modules/auth/api/queries/user.queries';
import { UserProfileDropdown } from '@/modules/dashboard/user-profile-dropdown';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProvider } from '@/modules/auth/lib/user-context';

interface UserProfileDropdownWrapperProps {
    children: ReactNode;
}

export async function UserProfileDropdownWrapper({ children }: UserProfileDropdownWrapperProps) {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="w-full flex items-center gap-2 px-3 py-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        );
    }

    return (
        <UserProvider user={user}>
            {children}
        </UserProvider>
    );
} 