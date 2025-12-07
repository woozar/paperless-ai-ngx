import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';

// DELETE /api/paperless-instances/[id]/sharing/[accessId] - Remove a share
export const DELETE = authRoute<never, { id: string; accessId: string }>(
  async ({ user, params }) => {
    // Check if user is owner of the instance
    const instance = await prisma.paperlessInstance.findFirst({
      where: {
        id: params.id,
        ownerId: user.userId,
      },
    });

    if (!instance) {
      return NextResponse.json(
        {
          error: 'paperlessInstanceNotFound',
          message: 'paperlessInstanceNotFound',
        },
        { status: 404 }
      );
    }

    // Check if share exists
    const share = await prisma.userPaperlessInstanceAccess.findFirst({
      where: {
        id: params.accessId,
        instanceId: params.id,
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
    await prisma.userPaperlessInstanceAccess.delete({
      where: { id: params.accessId },
    });

    return new NextResponse(null, { status: 204 });
  },
  { errorLogPrefix: 'Delete Paperless instance share' }
);
