import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';
import { QueueStatus } from '@/lib/scheduler';
import { validateQueueInstanceAccess, RETRY_RESET_DATA } from '../queue-helpers';

// POST /api/paperless-instances/[id]/queue/bulk/retry - Retry all failed items
export const POST = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    const { errorResponse } = await validateQueueInstanceAccess(params.id, user.userId);
    if (errorResponse) return errorResponse;

    // Reset all failed items for retry
    const result = await prisma.processingQueue.updateMany({
      where: {
        paperlessInstanceId: params.id,
        status: QueueStatus.FAILED,
      },
      data: RETRY_RESET_DATA,
    });

    return NextResponse.json({ retriedCount: result.count });
  },
  { errorLogPrefix: 'Bulk retry queue items' }
);

// DELETE /api/paperless-instances/[id]/queue/bulk/completed - Delete all completed items
export const DELETE = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    const { errorResponse } = await validateQueueInstanceAccess(params.id, user.userId);
    if (errorResponse) return errorResponse;

    // Delete all completed items
    const result = await prisma.processingQueue.deleteMany({
      where: {
        paperlessInstanceId: params.id,
        status: QueueStatus.COMPLETED,
      },
    });

    return NextResponse.json({ deletedCount: result.count });
  },
  { errorLogPrefix: 'Bulk delete completed queue items' }
);
