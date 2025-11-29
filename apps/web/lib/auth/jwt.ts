import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

// Get JWT secret from environment or generate one
const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
};

export interface JwtPayload {
  userId: string;
  username: string;
  role: 'ADMIN' | 'DEFAULT';
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for a user
 */
export async function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
  const token = await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JwtPayload> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JwtPayload;
  } catch {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extract JWT token from Authorization header
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(request: NextRequest): Promise<JwtPayload | null> {
  const token = extractToken(request);

  if (!token) {
    return null;
  }

  try {
    return await verifyToken(token);
  } catch (error) {
    return null;
  }
}
