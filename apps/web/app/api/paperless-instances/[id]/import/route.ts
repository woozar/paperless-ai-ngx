import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { PaperlessClient, PaperlessDocument } from '@repo/paperless-client';
import { authRoute } from '@/lib/api/route-wrapper';
import { decrypt } from '@/lib/crypto/encryption';

// POST /api/paperless-instances/[id]/import - Import documents from Paperless (owner or any permission)
export const POST = authRoute<never, { id: string }>(
  async ({ user, params }) => {
    // Get instance with encrypted token - any access level can import
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

    // Decrypt API token
    const apiToken = decrypt(instance.apiToken);

    // Create Paperless client
    const client = new PaperlessClient({
      baseUrl: instance.apiUrl,
      token: apiToken,
    });

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

    // Get existing document IDs for this instance
    const existingDocs = await prisma.paperlessDocument.findMany({
      where: { paperlessInstanceId: params.id },
      select: { paperlessId: true },
    });
    const existingIds = new Set(existingDocs.map((d) => d.paperlessId));

    // Filter out documents that already exist
    const newDocuments = allDocuments.filter((doc) => !existingIds.has(doc.id));

    // Insert only new documents
    const createdDocuments = await Promise.all(
      newDocuments.map(async (doc) => {
        return prisma.paperlessDocument.create({
          data: {
            paperlessId: doc.id,
            title: doc.title,
            content: doc.content,
            correspondentId: doc.correspondent,
            tagIds: doc.tags,
            // v8 ignore next -- @preserve
            documentDate: doc.created ? new Date(doc.created) : null,
            paperlessInstanceId: params.id,
          },
        });
      })
    );

    return NextResponse.json({
      imported: createdDocuments.length,
      total: allDocuments.length,
      skipped: allDocuments.length - createdDocuments.length,
    });
  },
  { errorLogPrefix: 'Import documents' }
);
