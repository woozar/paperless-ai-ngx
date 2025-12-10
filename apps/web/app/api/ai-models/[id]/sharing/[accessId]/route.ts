import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';

// DELETE /api/ai-models/[id]/sharing/[accessId] - Remove a share
export const DELETE = authRoute<never, { id: string; accessId: string }>(
  async ({ user, params }) => {
    // Check if user has sharing rights (owner or FULL permission)
    const model = await prisma.aiModel.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: user.userId },
          { sharedWith: { some: { userId: user.userId, permission: 'FULL' } } },
        ],
      },
    });

    if (!model) {
      return NextResponse.json(
        {
          error: 'aiModelNotFound',
          message: 'aiModelNotFound',
        },
        { status: 404 }
      );
    }

    // Check if share exists
    const share = await prisma.userAiModelAccess.findFirst({
      where: {
        id: params.accessId,
        aiModelId: params.id,
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
    await prisma.userAiModelAccess.delete({
      where: { id: params.accessId },
    });

    return new NextResponse(null, { status: 204 });
  },
  { errorLogPrefix: 'Delete AI model share' }
);
