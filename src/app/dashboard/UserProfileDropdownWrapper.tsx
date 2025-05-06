import { Suspense } from 'react';
import { getCurrentUser } from '@/modules/auth/api/queries/user.queries';
import { UserProfileDropdown } from '@/modules/dashboard/user-profile-dropdown';
import { Skeleton } from '@/components/ui/skeleton';

export async function UserProfileDropdownWrapper() {
    console.log('🔍 UserProfileDropdownWrapper: Starting to fetch user...');
    const user = await getCurrentUser();
    console.log('UserProfileDropdownWrapper: User fetch result:', user ? '✅ User found' : '❌ No user');

    if (!user) {
        console.log('UserProfileDropdownWrapper: Rendering skeleton...');
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

    console.log('UserProfileDropdownWrapper: Rendering dropdown with user:', { id: user.id, email: user.email });
    return <UserProfileDropdown user={user} />;
} 