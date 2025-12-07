import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';

// DELETE /api/ai-bots/[id]/sharing/[accessId] - Remove a share
export const DELETE = authRoute<never, { id: string; accessId: string }>(
  async ({ user, params }) => {
    // Check if user has sharing rights (owner or ADMIN permission)
    const bot = await prisma.aiBot.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: user.userId },
          { sharedWith: { some: { userId: user.userId, permission: 'FULL' } } },
        ],
      },
    });

    if (!bot) {
      return NextResponse.json(
        {
          error: 'aiBotNotFound',
          message: 'aiBotNotFound',
        },
        { status: 404 }
      );
    }

    // Check if share exists
    const share = await prisma.userAiBotAccess.findFirst({
      where: {
        id: params.accessId,
        aiBotId: params.id,
      },
    });

    if (!share) {
      return NextResponse.json(
        {
          error: 'shareNotFound',
          message: 'shareNotFound',
        },
        { status: 404 }
      );
    }

    // Delete share
    await prisma.userAiBotAccess.delete({
      where: { id: params.accessId },
    });

    return new NextResponse(null, { status: 204 });
  },
  { errorLogPrefix: 'Delete AI bot share' }
);
