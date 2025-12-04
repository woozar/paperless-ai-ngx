import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { adminRoute } from '@/lib/api/route-wrapper';

// GET /api/paperless-instances/[id]/stats - Get document counts for a PaperlessInstance (Admin only)
export const GET = adminRoute<never, { id: string }>(
  async ({ user, params }) => {
    // Check if instance exists and belongs to user
    const instance = await prisma.paperlessInstance.findFirst({
      where: {
        id: params.id,
        ownerId: user.userId,
      },
      select: { id: true },
    });

    if (!instance) {
      return NextResponse.json(
        {
          error: 'paperlessInstanceNotFound',
          message: 'errors.paperlessInstanceNotFound',
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
