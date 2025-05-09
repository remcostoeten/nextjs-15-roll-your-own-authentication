import { Suspense } from 'react';
import { UserProfileDropdownServer } from './UserProfileDropdownServer';
import { Skeleton } from '@/components/ui/skeleton';

export function UserProfileDropdown() {
    return (
        <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
            <UserProfileDropdownServer />
        </Suspense>
    );
} 