import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  jti?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export async function generateTokens(payload: Omit<JWTPayload, 'jti'>): Promise<Tokens> {
  const accessToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET);

  const refreshToken = await new SignJWT({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .sign(JWT_SECRET);

  return { accessToken, refreshToken };
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { sub, email, role, iat, exp, jti } = payload;
    
    if (typeof sub !== 'string' || typeof email !== 'string' || typeof role !== 'string') {
      throw new Error('Invalid token payload');
    }

    return {
      sub,
      email,
      role,
      iat: iat as number,
      exp: exp as number,
      jti: jti as string | undefined,
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
} 