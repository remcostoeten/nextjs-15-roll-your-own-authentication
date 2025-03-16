---
title: User & Admin Operations
description: Documentation for user management, admin operations, and role-based access control
---

# User & Admin Operations Guide

This guide covers all user-related operations, admin functionalities, and role-based access control in the application.

## Current User Operations

### Get Current User (Me)
```typescript
// Server-side
import { getCurrentUser } from '@/modules/authentication/api/queries/get-current-user'

const user = await getCurrentUser()
if (user.success) {
    // user.user contains the current user data
}

// Client-side using hook
import { useAuth } from '@/modules/authentication/hooks/use-auth'

function MyComponent() {
    const { user, isLoading } = useAuth()
    
    if (isLoading) return <Loading />
    if (!user) return <NotLoggedIn />
    
    return <div>Welcome {user.email}</div>
}
```

## Admin Operations

### Query All Users (Admin Only)
```typescript
'use server'

import { db } from '@/server/db'
import { users } from '@/server/db/schemas'
import { desc } from 'drizzle-orm'

export async function getAllUsers() {
    return db.query.users.findMany({
        orderBy: desc(users.createdAt),
        columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
        }
    })
}
```

### Query Users with Pagination
```typescript
'use server'

import { db } from '@/server/db'
import { users } from '@/server/db/schemas'

type PaginationParams = {
    page: number
    limit: number
    orderBy?: string
    order?: 'asc' | 'desc'
}

export async function getPaginatedUsers({ 
    page = 1, 
    limit = 10,
    orderBy = 'createdAt',
    order = 'desc'
}: PaginationParams) {
    const offset = (page - 1) * limit
    
    const [totalCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
    
    const results = await db.query.users.findMany({
        limit,
        offset,
        orderBy: order === 'desc' ? desc(users[orderBy]) : asc(users[orderBy]),
        columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
        }
    })
    
    return {
        users: results,
        pagination: {
            total: totalCount.count,
            pages: Math.ceil(totalCount.count / limit),
            current: page,
            limit
        }
    }
}
```

### Search Users by Email or Name
```typescript
'use server'

import { db } from '@/server/db'
import { users } from '@/server/db/schemas'
import { like, or } from 'drizzle-orm'

export async function searchUsers(query: string) {
    const searchTerm = `%${query.toLowerCase()}%`
    
    return db.query.users.findMany({
        where: or(
            like(sql`lower(${users.email})`, searchTerm),
            like(sql`lower(${users.firstName})`, searchTerm),
            like(sql`lower(${users.lastName})`, searchTerm)
        ),
        columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
        }
    })
}
```

### Query All Admins
```typescript
'use server'

import { db } from '@/server/db'
import { users } from '@/server/db/schemas'
import { eq } from 'drizzle-orm'

export async function getAllAdmins() {
    return db.query.users.findMany({
        where: eq(users.role, 'admin'),
        columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
        }
    })
}
```

## Role-Based Access Control

### Check if Current User is Admin
```typescript
// Using hooks (client-side)
import { usePermissions } from '@/modules/authentication/hooks/use-permissions'

function AdminComponent() {
    const { isAdmin } = usePermissions()
    
    if (!isAdmin) return null
    return <div>Admin Content</div>
}

// Or using the can() method
function AdminComponent() {
    const { can } = usePermissions()
    
    if (!can('access_admin')) return null
    return <div>Admin Content</div>
}

// Server-side check
import { getCurrentUser } from '@/modules/authentication/api/queries/get-current-user'

async function adminServerAction() {
    const { user } = await getCurrentUser()
    if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized')
    }
    // Proceed with admin action
}
```

### Admin-Only Components
```typescript
// Create an AdminGuard component
import { usePermissions } from '@/modules/authentication/hooks/use-permissions'
import { ReactNode } from 'react'

type AdminGuardProps = {
    children: ReactNode
    fallback?: ReactNode
}

export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
    const { isAdmin } = usePermissions()
    
    if (!isAdmin) return fallback
    return <>{children}</>
}

// Usage
function AdminDashboard() {
    return (
        <AdminGuard fallback={<AccessDenied />}>
            <div>Admin Dashboard Content</div>
        </AdminGuard>
    )
}
```

### Handle Unauthorized Access
```typescript
// Route protection (middleware)
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/modules/authentication/api/queries/get-current-user'

export async function adminMiddleware(request: NextRequest) {
    const { user } = await getCurrentUser()
    
    if (!user || user.role !== 'admin') {
        // Option 1: Redirect to home
        return NextResponse.redirect(new URL('/', request.url))
        
        // Option 2: Return error response
        return NextResponse.json(
            { error: 'Unauthorized - Admin access required' },
            { status: 403 }
        )
    }
}

// Client-side protection with toast
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/modules/authentication/hooks/use-permissions'
import { toast } from 'sonner'

function AdminPage() {
    const router = useRouter()
    const { isAdmin } = usePermissions()
    
    useEffect(() => {
        if (!isAdmin) {
            toast.error('Access Denied', {
                description: 'You need admin privileges to access this page'
            })
            router.push('/')
        }
    }, [isAdmin, router])
    
    if (!isAdmin) return null
    return <div>Admin Content</div>
}
```

### Promote User to Admin
```typescript
'use server'

import { db } from '@/server/db'
import { users } from '@/server/db/schemas'
import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/modules/authentication/api/queries/get-current-user'
import { logUserActivity } from '@/shared/utils/activity-logger'

export async function promoteToAdmin(userId: string) {
    // Check if current user is admin
    const { user: currentUser } = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Unauthorized - Only admins can promote users')
    }
    
    // Update user role
    const [updatedUser] = await db
        .update(users)
        .set({ role: 'admin' })
        .where(eq(users.id, userId))
        .returning()
    
    // Log the action
    await logUserActivity({
        userId: currentUser.id,
        type: 'admin_promotion',
        metadata: {
            promotedUserId: userId,
            timestamp: new Date().toISOString()
        }
    })
    
    return updatedUser
}

// Client-side usage in data table
function UserDataTable() {
    const { data: users, mutate } = useSWR('/api/users', fetcher)
    
    const handlePromoteToAdmin = async (userId: string) => {
        try {
            await promoteToAdmin(userId)
            toast.success('User promoted to admin')
            mutate() // Refresh the users list
        } catch (error) {
            toast.error('Failed to promote user', {
                description: error instanceof Error ? error.message : 'Unknown error occurred'
            })
        }
    }
    
    return (
        <DataTable
            columns={[
                // ... other columns
                {
                    id: 'actions',
                    cell: ({ row }) => (
                        <Button
                            onClick={() => handlePromoteToAdmin(row.original.id)}
                            disabled={row.original.role === 'admin'}
                        >
                            Promote to Admin
                        </Button>
                    )
                }
            ]}
            data={users}
        />
    )
}
```

## Best Practices

1. **Always Check Permissions**: Use the `usePermissions` hook or server-side checks before performing admin actions.

2. **Error Handling**: Provide clear error messages and handle unauthorized access gracefully.

3. **Activity Logging**: Log all admin actions for audit purposes.

4. **Validation**: Always validate user input and permissions on both client and server side.

5. **Security**: Use server actions for sensitive operations and never trust client-side role checks alone.

6. **UX**: Provide clear feedback using toasts and proper error messages when access is denied.

7. **Performance**: Use pagination for large datasets and implement proper loading states.

8. **Type Safety**: Leverage TypeScript to ensure type safety across all operations. 