import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';

// GET /api/paperless-instances/[id]/stats - Get document counts for a PaperlessInstance
export const GET = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    // Check if instance exists and user has access
    const instance = await prisma.paperlessInstance.findFirst({
      where: {
        id: params.id,
        OR: [
          { ownerId: user.userId },
          {
            sharedWith: {
              some: {
                OR: [{ userId: user.userId }, { userId: null }],
              },
            },
          },
        ],
      },
      select: { id: true },
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

    const [documents, processingQueue] = await Promise.all([
      prisma.paperlessDocument.count({ where: { paperlessInstanceId: params.id } }),
      prisma.processingQueue.count({ where: { paperlessInstanceId: params.id } }),
    ]);

    return NextResponse.json({
      documents,
      processingQueue,
    });
  },
  { errorLogPrefix: 'Get paperless instance stats' }
);
