import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';
import { QueueStatus } from '@/lib/scheduler';
import { formatQueueItem } from '../../format-queue-item';
import { validateQueueInstanceAccess, findQueueItem, RETRY_RESET_DATA } from '../../queue-helpers';

// POST /api/paperless-instances/[id]/queue/[queueId]/retry - Retry a failed item
export const POST = authRoute<never, { id: string; queueId: string }>(
  async ({ user, params }) => {
    const { errorResponse: instanceError } = await validateQueueInstanceAccess(
      params.id,
      user.userId
    );
    if (instanceError) return instanceError;

    const { queueItem, errorResponse: itemError } = await findQueueItem(params.queueId, params.id);
    if (itemError) return itemError;

    // Only allow retrying failed items
    if (queueItem.status !== QueueStatus.FAILED) {
      return NextResponse.json(
        {
          error: 'canOnlyRetryFailedItems',
          message: 'canOnlyRetryFailedItems',
        },
        { status: 400 }
      );
    }

    // Reset the item for retry
    const updatedItem = await prisma.processingQueue.update({
      where: { id: params.queueId },
      data: RETRY_RESET_DATA,
      include: {
        document: { select: { title: true } },
        aiBot: { select: { name: true } },
      },
    });

    return NextResponse.json(formatQueueItem(updatedItem));
  },
  { errorLogPrefix: 'Retry queue item' }
);
