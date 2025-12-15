import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';
import { QueueStatus } from '@/lib/scheduler';
import { validateQueueInstanceAccess, findQueueItem } from '../queue-helpers';

// DELETE /api/paperless-instances/[id]/queue/[queueId] - Remove item from queue
export const DELETE = authRoute<never, { id: string; queueId: string }>(
  async ({ user, params }) => {
    const { errorResponse: instanceError } = await validateQueueInstanceAccess(
      params.id,
      user.userId
    );
    if (instanceError) return instanceError;

    const { queueItem, errorResponse: itemError } = await findQueueItem(params.queueId, params.id);
    if (itemError) return itemError;

    // Don't allow deleting items that are currently processing
    if (queueItem.status === QueueStatus.PROCESSING) {
      return NextResponse.json(
        {
          error: 'cannotDeleteProcessingItem',
          message: 'cannotDeleteProcessingItem',
        },
        { status: 400 }
      );
    }

    // Delete the item
    await prisma.processingQueue.delete({
      where: { id: params.queueId },
    });

    return new NextResponse(null, { status: 204 });
  },
  { errorLogPrefix: 'Delete queue item' }
);
