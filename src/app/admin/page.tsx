'use server'

import { db } from '@/server/db';
import { User } from '@/server/db/schemas/users';
import { UserMetrics } from '@/server/db/schemas/user-metrics';
import { AdminBanner } from '@/views/admin';
import { UserTable } from '@/views/admin/user-table';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAccessToken } from '@/shared/utils/jwt';
import { eq } from 'drizzle-orm';
import { users } from '@/server/db/schemas';

async function pairUserWithMetrics(user: User, metrics: UserMetrics[]) {
    return {
        ...user,
        ...metrics.find(metric => metric.userId === user.id),
    }
}

// Server-side check for admin access
async function checkAdminAccess() {
    console.log('Starting admin access check...'); // Debug log

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        console.log('No access token found, redirecting to login...'); // Debug log
        redirect('/login?callbackUrl=/admin');
    }

    try {
        console.log('Verifying access token...'); // Debug log
        const payload = await verifyAccessToken(accessToken);
        console.log('Token payload:', payload); // Debug log

        if (!payload || !payload.sub) {
            console.log('Invalid token payload'); // Debug log
            redirect('/login?callbackUrl=/admin');
        }

        console.log('Querying user from database...'); // Debug log
        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.sub),
            columns: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
            }
        });

        console.log('Database query result:', user); // Debug log

        if (!user) {
            console.log('User not found in database'); // Debug log
            redirect('/login?callbackUrl=/admin');
        }

        if (user.role !== 'admin') {
            console.log('Access denied - User role:', user.role); // Debug log
            redirect('/dashboard?error=unauthorized');
        }

        // Check if role in token matches database role
        const tokenRole = (payload as { role?: string }).role;
        if (tokenRole && tokenRole !== user.role) {
            console.log('Role mismatch - Token:', tokenRole, 'DB:', user.role); // Debug log
            // Clear cookies and redirect to login
            const cookieStore = await cookies();
            cookieStore.set('access_token', '', {
                maxAge: 0,
                path: '/',
            });
            cookieStore.set('refresh_token', '', {
                maxAge: 0,
                path: '/',
            });
            redirect('/login?callbackUrl=/admin&error=role_mismatch');
        }

        console.log('Admin access granted for user:', {
            id: user.id,
            email: user.email,
            role: user.role,
            name: `${user.firstName} ${user.lastName}`.trim()
        }); // Debug log

        return user;
    } catch (error) {
        console.error('Admin access check failed:', error);
        // Clear cookies on error
        const cookieStore = await cookies();
        cookieStore.set('access_token', '', {
            maxAge: 0,
            path: '/',
        });
        cookieStore.set('refresh_token', '', {
            maxAge: 0,
            path: '/',
        });
        redirect('/login?callbackUrl=/admin');
    }
}

export default async function AdminPage() {
    try {
        // Check admin access before rendering the page
        const adminUser = await checkAdminAccess();
        console.log('Admin access granted for:', adminUser.email); // Debug log

        const userList: User[] = await db.query.users.findMany();
        const userMetricsList: UserMetrics[] = await db.query.userMetrics.findMany();

        const userListWithMetrics = await Promise.all(userList.map(user => pairUserWithMetrics(user, userMetricsList)));

        return (
            <div className='flex flex-col items-center justify-center min-h-screen bg-neutral-900 p-6'>
                <AdminBanner />
                <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
                <div className="w-full max-w-7xl">
                    <UserTable users={userListWithMetrics} />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error in AdminPage:', error);
        redirect('/dashboard?error=admin_page_error');
    }
} 