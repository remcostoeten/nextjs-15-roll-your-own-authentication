import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { HTTPError } from '../errors/http-error';
import { authRateLimiter } from '../utils/rate-limiter';

export type AuthConfig = {
    secret: string;
    issuer: string;
    audience: string;
    expiresIn: string;
};

export type AuthMiddleware = {
    createToken: (payload: Record<string, unknown>) => Promise<string>;
    middleware: (request: NextRequest) => Promise<NextResponse>;
    withAuth: (handler: Function) => (request: NextRequest) => Promise<NextResponse>;
};

export const createAuthMiddleware = (config: AuthConfig): AuthMiddleware => {
    const verifyToken = async (token: string): Promise<jose.JWTVerifyResult> => {
        const secret = new TextEncoder().encode(config.secret);
        return jose.jwtVerify(token, secret, {
            issuer: config.issuer,
            audience: config.audience,
        });
    };

    const createToken = async (payload: Record<string, unknown>): Promise<string> => {
        const secret = new TextEncoder().encode(config.secret);
        return new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer(config.issuer)
            .setAudience(config.audience)
            .setExpirationTime(config.expiresIn)
            .sign(secret);
    };

    const middleware = async (request: NextRequest) => {
        // Rate limiting
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = forwardedFor?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
        const canProceed = await authRateLimiter.consumeToken(ip);
        if (!canProceed) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            );
        }

        try {
            const token = request.headers.get('authorization')?.split(' ')[1];
            if (!token) {
                throw new HTTPError('Unauthorized', 401);
            }

            const verified = await verifyToken(token);
            const response = NextResponse.next();

            // Attach the verified payload to the request for downstream use
            response.headers.set('X-User-ID', verified.payload.sub as string);
            return response;
        } catch (error) {
            if (error instanceof HTTPError) {
                return NextResponse.json(
                    { error: error.message },
                    { status: error.status }
                );
            }
            return NextResponse.json(
                { error: 'Internal server error' },
                { status: 500 }
            );
        }
    };

    const withAuth = (handler: Function) => {
        return async (request: NextRequest) => {
            const middlewareResponse = await middleware(request);
            if (middlewareResponse.status !== 200) {
                return middlewareResponse;
            }
            return handler(request);
        };
    };

    return {
        createToken,
        middleware,
        withAuth,
    };
};

// Create and export the auth middleware instance
export const authMiddleware = createAuthMiddleware({
    secret: process.env.JWT_SECRET || 'your-secret-key',
    issuer: process.env.JWT_ISSUER || 'your-app',
    audience: process.env.JWT_AUDIENCE || 'your-api',
    expiresIn: '1h',
}); 