import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { ApiResponses } from '@/lib/api/responses';
import { authRoute } from '@/lib/api/route-wrapper';

export const GET = authRoute(
  async ({ user }) => {
    // Get full user details
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        username: true,
        role: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });

    if (!dbUser) {
      return ApiResponses.userNotFound();
    }

    return NextResponse.json({
      id: dbUser.id,
      username: dbUser.username,
      role: dbUser.role,
      mustChangePassword: dbUser.mustChangePassword,
      createdAt: dbUser.createdAt.toISOString(),
    });
  },
  { errorLogPrefix: 'Get current user' }
);
