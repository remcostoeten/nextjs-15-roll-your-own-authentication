import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './auth.service';

export async function withAuth(
    request: NextRequest,
    handler: (req: NextRequest, user: { id: string; email: string; name?: string }) => Promise<NextResponse>
) {
    const user = await verifyToken();
    if (!user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return handler(request, user);
}

export async function withoutAuth(
    request: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
) {
    const user = await verifyToken();
    if (user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return handler(request);
} 