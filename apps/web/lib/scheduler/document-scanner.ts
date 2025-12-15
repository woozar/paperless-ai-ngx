import { prisma } from '@repo/database';
import { PaperlessClient, PaperlessDocument } from '@repo/paperless-client';
import { CronExpressionParser } from 'cron-parser';
import { decrypt } from '@/lib/crypto/encryption';
import { QueueStatus, type ScanResult } from './types';

/**
 * Creates a PaperlessClient for the given instance.
 */
function createClient(instance: { apiUrl: string; apiToken: string }): PaperlessClient {
  return new PaperlessClient({
    baseUrl: instance.apiUrl,
    token: decrypt(instance.apiToken),
  });
}

/**
 * Fetches all documents from Paperless with pagination.
 */
async function fetchAllDocuments(client: PaperlessClient): Promise<PaperlessDocument[]> {
  const allDocuments: PaperlessDocument[] = [];
  let page = 1;
  const pageSize = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await client.getDocuments({ page, page_size: pageSize });
    allDocuments.push(...response.results);
    hasMore = response.next !== null;
    page++;
  }

  return allDocuments;
}

/**
 * Filters documents by required tags.
 */
function filterByTags(documents: PaperlessDocument[], filterTags: number[]): PaperlessDocument[] {
  if (filterTags.length === 0) return documents;
  return documents.filter((doc) => filterTags.every((tagId) => doc.tags.includes(tagId)));
}

/**
 * Calculates the next scan time based on cron expression.
 */
export function calculateNextScanTime(cronExpression: string): Date {
  const expression = CronExpressionParser.parse(cronExpression);
  return expression.next().toDate();
}

/**
 * Scans a single Paperless instance for new/unprocessed documents
 * and adds them to the processing queue.
 */
export async function scanInstance(instanceId: string): Promise<ScanResult> {
  const instance = await prisma.paperlessInstance.findUnique({
    where: { id: instanceId },
    include: {
      defaultAiBot: true,
    },
  });

  if (!instance) {
    return {
      instanceId,
      instanceName: 'Unknown',
      documentsQueued: 0,
      documentsAlreadyProcessed: 0,
      documentsAlreadyQueued: 0,
      error: 'Instance not found',
    };
  }

  if (!instance.defaultAiBotId) {
    // Update scan times even if no bot configured
    const nextScanAt = calculateNextScanTime(instance.scanCronExpression);
    await prisma.paperlessInstance.update({
      where: { id: instanceId },
      data: { lastScanAt: new Date(), nextScanAt },
    });

    return {
      instanceId,
      instanceName: instance.name,
      documentsQueued: 0,
      documentsAlreadyProcessed: 0,
      documentsAlreadyQueued: 0,
      error: 'No default AI bot configured',
    };
  }

  try {
    const client = createClient(instance);

    // Fetch all documents from Paperless
    const allDocuments = await fetchAllDocuments(client);

    // Filter by configured tags
    const filteredDocuments = filterByTags(allDocuments, instance.importFilterTags);

    // Get existing documents that have been processed (have processing results)
    const processedDocIds = await prisma.paperlessDocument.findMany({
      where: {
        paperlessInstanceId: instanceId,
        processingResults: { some: {} },
      },
      select: { paperlessId: true },
    });
    const processedSet = new Set(processedDocIds.map((d) => d.paperlessId));

    // Get documents already in the queue (any status - to avoid unique constraint violations)
    const queuedDocs = await prisma.processingQueue.findMany({
      where: {
        paperlessInstanceId: instanceId,
      },
      select: { paperlessDocumentId: true, status: true },
    });
    const queuedSet = new Set(queuedDocs.map((d) => d.paperlessDocumentId));

    // Count documents by status
    let alreadyProcessed = 0;
    let alreadyQueued = 0;
    const documentsToQueue: PaperlessDocument[] = [];

    for (const doc of filteredDocuments) {
      if (processedSet.has(doc.id)) {
        alreadyProcessed++;
      } else if (queuedSet.has(doc.id)) {
        alreadyQueued++;
      } else {
        documentsToQueue.push(doc);
      }
    }

    // Ensure documents exist in local DB and add to queue
    let queued = 0;
    for (const doc of documentsToQueue) {
      // Upsert document to local DB
      const paperlessModified = doc.modified ? new Date(doc.modified) : null;
      const documentDate = doc.created ? new Date(doc.created) : null;

      const localDoc = await prisma.paperlessDocument.upsert({
        where: {
          paperlessInstanceId_paperlessId: {
            paperlessInstanceId: instanceId,
            paperlessId: doc.id,
          },
        },
        create: {
          paperlessId: doc.id,
          title: doc.title,
          content: doc.content,
          correspondentId: doc.correspondent,
          tagIds: doc.tags,
          documentDate,
          paperlessModified,
          paperlessInstanceId: instanceId,
        },
        update: {
          title: doc.title,
          content: doc.content,
          correspondentId: doc.correspondent,
          tagIds: doc.tags,
          documentDate,
          paperlessModified,
        },
      });

      // Add to processing queue
      await prisma.processingQueue.create({
        data: {
          paperlessDocumentId: doc.id,
          paperlessInstanceId: instanceId,
          documentId: localDoc.id,
          aiBotId: instance.defaultAiBotId,
          status: QueueStatus.PENDING,
        },
      });

      queued++;
    }

    // Update scan times
    const nextScanAt = calculateNextScanTime(instance.scanCronExpression);
    await prisma.paperlessInstance.update({
      where: { id: instanceId },
      data: { lastScanAt: new Date(), nextScanAt },
    });

    return {
      instanceId,
      instanceName: instance.name,
      documentsQueued: queued,
      documentsAlreadyProcessed: alreadyProcessed,
      documentsAlreadyQueued: alreadyQueued,
    };
  } catch (error) {
    // Update scan times even on error to prevent infinite retry loops
    const nextScanAt = calculateNextScanTime(instance.scanCronExpression);
    await prisma.paperlessInstance.update({
      where: { id: instanceId },
      data: { lastScanAt: new Date(), nextScanAt },
    });

    return {
      instanceId,
      instanceName: instance.name,
      documentsQueued: 0,
      documentsAlreadyProcessed: 0,
      documentsAlreadyQueued: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Finds all instances that are due for scanning and scans them.
 */
export async function scanDueInstances(): Promise<ScanResult[]> {
  const now = new Date();

  // Find instances that need scanning
  const dueInstances = await prisma.paperlessInstance.findMany({
    where: {
      autoProcessEnabled: true,
      OR: [{ nextScanAt: null }, { nextScanAt: { lte: now } }],
    },
    select: { id: true },
  });

  const results: ScanResult[] = [];

  for (const instance of dueInstances) {
    const result = await scanInstance(instance.id);
    results.push(result);
  }

  return results;
}
