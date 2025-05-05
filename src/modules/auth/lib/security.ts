// src/modules/auth/lib/security.ts
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { env } from 'env';
import { JwtPayload, JwtPayloadSchema } from '@/modules/auth/api/models/auth.models';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error('Password cannot be empty.');
  }
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Could not hash password.');
  }
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return false;
  }
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    console.error('Error comparing password:', error);
    return false;
  }
}

const JWT_SECRET = env.JWT_SECRET;
const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRATION_TIME = '1d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set.');
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function createJwt(payload: JwtPayload): Promise<string> {
  try {
    JwtPayloadSchema.parse(payload);

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setSubject(String(payload.sub))
      .setExpirationTime(JWT_EXPIRATION_TIME)
      .sign(secretKey);

    return jwt;
  } catch (error) {
    console.error('Error creating JWT:', error);
    throw new Error('Could not create authentication token.');
  }
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload: jwtPayload } = await jose.jwtVerify(token, secretKey, {
      algorithms: [JWT_ALGORITHM],
    });

    const validatedPayload = JwtPayloadSchema.safeParse({
      sub: jwtPayload.sub,
      email: jwtPayload.email as string,
      username: jwtPayload.username as string,
      role: jwtPayload.role as 'user' | 'admin'
    });

    if (!validatedPayload.success) {
        console.error('JWT payload validation failed:', validatedPayload.error);
        return null;
    }

    return validatedPayload.data;

  } catch (error: any) {
    if (error instanceof jose.errors.JWTExpired) {
      console.log('JWT expired');
    } else if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
      console.error('JWT signature verification failed');
    } else if (error instanceof jose.errors.JWSInvalid) {
        console.error('JWT is invalid:', error.message);
    } else {
      console.error('Error verifying JWT:', error);
    }
    return null;
  }
}
