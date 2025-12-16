import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';

export const GET = authRoute(
  async ({ user }) => {
    const credentials = await prisma.webAuthnCredential.findMany({
      where: { userId: user.userId },
      select: {
        id: true,
        name: true,
        deviceType: true,
        backedUp: true,
        createdAt: true,
        lastUsedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      credentials: credentials.map((cred) => ({
        id: cred.id,
        name: cred.name,
        deviceType: cred.deviceType,
        backedUp: cred.backedUp,
        createdAt: cred.createdAt.toISOString(),
        lastUsedAt: cred.lastUsedAt?.toISOString() || null,
      })),
    });
  },
  {
    errorLogPrefix: 'List WebAuthn credentials',
  }
);
