import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/schemas';

// GET /api/paperless-instances/[id]/documents - List documents (owner or any permission)
export const GET = authRoute<never, { id: string }>(
  async ({ user, params, request }) => {
    const { page, limit } = getPaginationParams(request);
    const url = new URL(request.url);
    const statusFilter = url.searchParams.get('status') ?? 'all';

    // Check instance access
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

    // Build document query
    const whereClause = {
      paperlessInstanceId: params.id,
    };

    // Get total count
    const total = await prisma.paperlessDocument.count({
      where: whereClause,
    });

    // Get paginated documents - sort by documentDate (desc), fallback to importedAt for older docs
    const documents = await prisma.paperlessDocument.findMany({
      where: whereClause,
      orderBy: [{ documentDate: 'desc' }, { importedAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        processingResults: {
          orderBy: { processedAt: 'desc' },
          take: 1,
          select: {
            processedAt: true,
          },
        },
      },
    });

    // Map to response format with status
    const items = documents.map((doc) => {
      const hasProcessingResult = doc.processingResults.length > 0;
      return {
        id: doc.id,
        paperlessId: doc.paperlessId,
        title: doc.title,
        status: hasProcessingResult ? ('processed' as const) : ('unprocessed' as const),
        // v8 ignore next -- @preserve
        documentDate: doc.documentDate?.toISOString() ?? null,
        importedAt: doc.importedAt.toISOString(),
        // v8 ignore next -- @preserve
        lastProcessedAt: doc.processingResults[0]?.processedAt?.toISOString() ?? null,
      };
    });

    // Filter by status if needed (after fetching, since status is computed)
    const filteredItems =
      statusFilter === 'all' ? items : items.filter((item) => item.status === statusFilter);

    return NextResponse.json({
      items: filteredItems,
      ...getPaginationMeta(total, page, limit),
    });
  },
  { errorLogPrefix: 'List documents' }
);
