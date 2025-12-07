import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';

// DELETE /api/ai-providers/[id]/sharing/[accessId] - Remove a share
export const DELETE = authRoute<never, { id: string; accessId: string }>(
  async ({ user, params }) => {
    // Check if user is owner of the provider
    const provider = await prisma.aiProvider.findFirst({
      where: {
        id: params.id,
        ownerId: user.userId,
      },
    });

    if (!provider) {
      return NextResponse.json(
        {
          error: 'aiProviderNotFound',
          message: 'aiProviderNotFound',
        },
        { status: 404 }
      );
    }

    // Check if share exists
    const share = await prisma.userAiProviderAccess.findFirst({
      where: {
        id: params.accessId,
        aiProviderId: params.id,
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
    await prisma.userAiProviderAccess.delete({
      where: { id: params.accessId },
    });

    return new NextResponse(null, { status: 204 });
  },
  { errorLogPrefix: 'Delete AI provider share' }
);
