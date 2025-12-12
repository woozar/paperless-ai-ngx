import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { PaperlessDocument } from '@repo/paperless-client';
import { authRoute } from '@/lib/api/route-wrapper';
import {
  checkInstanceAccess,
  instanceNotFoundResponse,
  createPaperlessClient,
} from '@/lib/api/document-access';

// Helper type for existing document info
interface ExistingDocInfo {
  id: string;
  paperlessId: number;
  paperlessModified: Date | null;
}

// Helper to process a single document (create, update, or skip)
async function processDocument(
  doc: PaperlessDocument,
  existingDoc: ExistingDocInfo | undefined,
  instanceId: string
): Promise<'imported' | 'updated' | 'unchanged'> {
  const paperlessModified = doc.modified ? new Date(doc.modified) : null;
  // v8 ignore next -- @preserve
  const documentDate = doc.created ? new Date(doc.created) : null;

  if (!existingDoc) {
    await prisma.paperlessDocument.create({
      data: {
        paperlessId: doc.id,
        title: doc.title,
        content: doc.content,
        correspondentId: doc.correspondent,
        tagIds: doc.tags,
        documentDate,
        paperlessModified,
        paperlessInstanceId: instanceId,
      },
    });
    return 'imported';
  }

  if (needsUpdate(existingDoc.paperlessModified, paperlessModified)) {
    await prisma.paperlessDocument.update({
      where: { id: existingDoc.id },
      data: {
        title: doc.title,
        content: doc.content,
        correspondentId: doc.correspondent,
        tagIds: doc.tags,
        documentDate,
        paperlessModified,
      },
    });
    return 'updated';
  }

  return 'unchanged';
}

/**
 * Check if document needs updating based on modified timestamps.
 */
function needsUpdate(storedModified: Date | null, paperlessModified: Date | null): boolean {
  if (!storedModified) return true;
  if (!paperlessModified) return false;
  return paperlessModified.getTime() > storedModified.getTime();
}

// POST /api/paperless-instances/[id]/import - Import/sync documents from Paperless (owner or any permission)
export const POST = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    const instance = await checkInstanceAccess(params.id, user.userId);
    if (!instance) {
      return instanceNotFoundResponse();
    }

    const client = createPaperlessClient(instance);

    // Fetch all documents with pagination
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

    // Filter documents by required tags (if configured)
    const filterTags = instance.importFilterTags ?? [];
    const filteredDocuments =
      filterTags.length > 0
        ? allDocuments.filter((doc) => filterTags.every((tagId) => doc.tags.includes(tagId)))
        : allDocuments;

    // Get existing documents for this instance with their modified timestamps
    const existingDocs = await prisma.paperlessDocument.findMany({
      where: { paperlessInstanceId: params.id },
      select: { id: true, paperlessId: true, paperlessModified: true },
    });
    const existingDocsMap = new Map(existingDocs.map((d) => [d.paperlessId, d]));

    // Process documents: create new, update modified, skip unchanged
    let imported = 0;
    let updated = 0;
    let unchanged = 0;

    for (const doc of filteredDocuments) {
      const existingDoc = existingDocsMap.get(doc.id);
      const result = await processDocument(doc, existingDoc, params.id);

      if (result === 'imported') imported++;
      else if (result === 'updated') updated++;
      else unchanged++;
    }

    // Record import history for dashboard charts
    await prisma.importHistory.create({
      data: {
        paperlessInstanceId: params.id,
        documentsImported: imported,
        documentsUpdated: updated,
        documentsUnchanged: unchanged,
        totalInPaperless: filteredDocuments.length,
      },
    });

    return NextResponse.json({
      imported,
      updated,
      unchanged,
      total: filteredDocuments.length,
      filteredOut: allDocuments.length - filteredDocuments.length,
    });
  },
  { errorLogPrefix: 'Import documents' }
);
