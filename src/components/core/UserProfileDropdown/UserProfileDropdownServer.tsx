import { unstable_cache } from 'next/cache';
import { getCurrentUser } from '@/modules/auth/api/queries/user.queries';
import { UserProfileDropdownClient } from './UserProfileDropdownClient';

const getUser = unstable_cache(
    async () => getCurrentUser(),
    ['user-profile'],
    {
        revalidate: 60, // Cache for 1 minute
        tags: ['user-session']
    }
);

export async function UserProfileDropdownServer() {
    const user = await getUser();
    
    if (!user) {
        return null;
    }

    return <UserProfileDropdownClient user={user} />;
} 