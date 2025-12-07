import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { ApiResponses } from '@/lib/api/responses';
import { adminRoute } from '@/lib/api/route-wrapper';

// POST /api/users/[id]/restore - Restore a soft-deleted user (Admin only)
export const POST = adminRoute<never, { id: string }>(
  async ({ params }) => {
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return ApiResponses.userNotFound();
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { isActive: true },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  },
  { errorLogPrefix: 'Restore user' }
);
