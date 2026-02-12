import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';

export const GET = authRoute(
  async ({ user }) => {
    // Only admins can check setup status
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ setupNeeded: false }, { status: 200 });
    }

    // Check if user has any Paperless instances
    const paperlessCount = await prisma.paperlessInstance.count({
      where: { ownerId: user.userId },
    });

    return NextResponse.json(
      {
        setupNeeded: paperlessCount === 0,
        setupComplete: paperlessCount > 0,
      },
      { status: 200 }
    );
  },
  { errorLogPrefix: 'Check setup status' }
);
