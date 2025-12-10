import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';

// DELETE /api/ai-accounts/[id]/sharing/[accessId] - Remove a share
export const DELETE = authRoute<never, { id: string; accessId: string }>(
  async ({ user, params }) => {
    // Check if user has sharing rights (owner or FULL permission)
    const account = await prisma.aiAccount.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: user.userId },
          { sharedWith: { some: { userId: user.userId, permission: 'FULL' } } },
        ],
      },
    });

    if (!account) {
      return NextResponse.json(
        {
          error: 'aiAccountNotFound',
          message: 'aiAccountNotFound',
        },
        { status: 404 }
      );
    }

    // Check if share exists
    const share = await prisma.userAiAccountAccess.findFirst({
      where: {
        id: params.accessId,
        aiAccountId: params.id,
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
    await prisma.userAiAccountAccess.delete({
      where: { id: params.accessId },
    });

    return new NextResponse(null, { status: 204 });
  },
  { errorLogPrefix: 'Delete AI account share' }
);
