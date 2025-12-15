import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { checkInstanceAccess, instanceNotFoundResponse } from '@/lib/api/document-access';
import { QueueStatus } from '@/lib/scheduler';
import type { Prisma } from '@repo/database';

/**
 * Validates instance access for queue operations.
 * Returns the instance if access is granted, or an error response.
 */
export async function validateQueueInstanceAccess(instanceId: string, userId: string) {
  const instance = await checkInstanceAccess(instanceId, userId);
  if (!instance) {
    return { instance: null, errorResponse: instanceNotFoundResponse() };
  }
  return { instance, errorResponse: null };
}

/**
 * Finds a queue item by ID and validates it belongs to the instance.
 * Returns the queue item or an error response.
 */
export async function findQueueItem(queueId: string, instanceId: string) {
  const queueItem = await prisma.processingQueue.findFirst({
    where: {
      id: queueId,
      paperlessInstanceId: instanceId,
    },
  });

  if (!queueItem) {
    return {
      queueItem: null,
      errorResponse: NextResponse.json(
        {
          error: 'queueItemNotFound',
          message: 'queueItemNotFound',
        },
        { status: 404 }
      ),
    };
  }

  return { queueItem, errorResponse: null };
}

/**
 * Data structure for resetting a queue item for retry.
 * Used by both bulk retry and single item retry endpoints.
 */
export const RETRY_RESET_DATA: Prisma.ProcessingQueueUpdateInput = {
  status: QueueStatus.PENDING,
  attempts: 0,
  lastError: null,
  scheduledFor: new Date(),
  startedAt: null,
  completedAt: null,
};
