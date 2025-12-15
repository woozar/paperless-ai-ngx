import { prisma } from '@repo/database';
import { PaperlessClient } from '@repo/paperless-client';
import { analyzeDocument } from '@/lib/ai/analyze-document';
import { decrypt } from '@/lib/crypto/encryption';
import { applySuggestions, hasAutoApplyEnabled } from '@/lib/paperless/apply-suggestions';
import { QueueStatus, type ProcessResult } from './types';
import { DEFAULT_SCHEDULER_CONFIG } from './types';

/**
 * Processes a single queue item by running AI analysis.
 */
export async function processQueueItem(queueItemId: string): Promise<ProcessResult> {
  // Mark as processing
  const queueItem = await prisma.processingQueue.update({
    where: { id: queueItemId },
    data: {
      status: QueueStatus.PROCESSING,
      startedAt: new Date(),
    },
    include: {
      document: true,
      aiBot: true,
      paperlessInstance: true,
    },
  });

  if (!queueItem.documentId || !queueItem.aiBotId) {
    await prisma.processingQueue.update({
      where: { id: queueItemId },
      data: {
        status: QueueStatus.FAILED,
        lastError: 'Missing document or AI bot reference',
        completedAt: new Date(),
      },
    });

    return {
      queueItemId,
      documentId: queueItem.documentId ?? '',
      success: false,
      error: 'Missing document or AI bot reference',
    };
  }

  try {
    // Run AI analysis
    const analysisResponse = await analyzeDocument({
      documentId: queueItem.documentId,
      aiBotId: queueItem.aiBotId,
      userId: queueItem.paperlessInstance.ownerId,
    });

    // Apply suggestions if any auto-apply settings are enabled
    const autoApplySettings = {
      autoApplyTitle: queueItem.paperlessInstance.autoApplyTitle,
      autoApplyCorrespondent: queueItem.paperlessInstance.autoApplyCorrespondent,
      autoApplyDocumentType: queueItem.paperlessInstance.autoApplyDocumentType,
      autoApplyTags: queueItem.paperlessInstance.autoApplyTags,
      autoApplyDate: queueItem.paperlessInstance.autoApplyDate,
    };

    if (hasAutoApplyEnabled(autoApplySettings) && queueItem.document && analysisResponse.result) {
      const client = new PaperlessClient({
        baseUrl: queueItem.paperlessInstance.apiUrl,
        token: decrypt(queueItem.paperlessInstance.apiToken),
      });

      const applyResult = await applySuggestions({
        client,
        paperlessDocumentId: queueItem.document.paperlessId,
        localDocumentId: queueItem.documentId,
        analysisResult: analysisResponse.result,
        settings: autoApplySettings,
      });

      if (!applyResult.success) {
        console.warn(
          `[Queue] Auto-apply failed for document ${queueItem.documentId}: ${applyResult.error}`
        );
        // Don't fail the queue item, just log the warning - analysis was still successful
      }
    }

    // Mark as completed
    await prisma.processingQueue.update({
      where: { id: queueItemId },
      data: {
        status: QueueStatus.COMPLETED,
        completedAt: new Date(),
        lastError: null,
      },
    });

    return {
      queueItemId,
      documentId: queueItem.documentId,
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const newAttempts = queueItem.attempts + 1;

    if (newAttempts >= queueItem.maxAttempts) {
      // Max retries reached, mark as failed
      await prisma.processingQueue.update({
        where: { id: queueItemId },
        data: {
          status: QueueStatus.FAILED,
          attempts: newAttempts,
          lastError: errorMessage,
          completedAt: new Date(),
        },
      });
    } else {
      // Schedule retry
      const retryDelay = DEFAULT_SCHEDULER_CONFIG.retryDelayMinutes * newAttempts;
      const scheduledFor = new Date(Date.now() + retryDelay * 60 * 1000);

      await prisma.processingQueue.update({
        where: { id: queueItemId },
        data: {
          status: QueueStatus.PENDING,
          attempts: newAttempts,
          lastError: errorMessage,
          scheduledFor,
          startedAt: null,
        },
      });
    }

    return {
      queueItemId,
      documentId: queueItem.documentId,
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Processes all pending queue items until queue is empty.
 * Items are processed sequentially to avoid overloading APIs.
 */
export async function processAllPending(): Promise<ProcessResult[]> {
  const results: ProcessResult[] = [];

  // Loop until no more pending items
  while (true) {
    const now = new Date();

    // Get next pending item that is due for processing
    const pendingItem = await prisma.processingQueue.findFirst({
      where: {
        status: QueueStatus.PENDING,
        scheduledFor: { lte: now },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      select: { id: true },
    });

    if (!pendingItem) {
      // No more pending items
      break;
    }

    const result = await processQueueItem(pendingItem.id);
    results.push(result);
  }

  return results;
}

/**
 * Resets stuck processing items (e.g., after app restart).
 * Items that have been "processing" for more than 10 minutes are reset to pending.
 */
export async function resetStuckItems(): Promise<number> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const result = await prisma.processingQueue.updateMany({
    where: {
      status: QueueStatus.PROCESSING,
      startedAt: { lt: tenMinutesAgo },
    },
    data: {
      status: QueueStatus.PENDING,
      startedAt: null,
    },
  });

  return result.count;
}

/**
 * Gets queue statistics.
 */
export async function getQueueStats(): Promise<{
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}> {
  const [pending, processing, completed, failed] = await Promise.all([
    prisma.processingQueue.count({ where: { status: QueueStatus.PENDING } }),
    prisma.processingQueue.count({ where: { status: QueueStatus.PROCESSING } }),
    prisma.processingQueue.count({ where: { status: QueueStatus.COMPLETED } }),
    prisma.processingQueue.count({ where: { status: QueueStatus.FAILED } }),
  ]);

  return { pending, processing, completed, failed };
}
