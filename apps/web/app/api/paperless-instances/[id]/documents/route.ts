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
    const search = url.searchParams.get('search') ?? '';
    const sortField = url.searchParams.get('sortField');
    const sortDirection = url.searchParams.get('sortDirection') as 'asc' | 'desc' | null;

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

    // Build document query with status and search filter
    // Status is computed based on existence of processingResults
    const buildWhereClause = () => {
      const base: Record<string, unknown> = { paperlessInstanceId: params.id };

      if (search) {
        base.title = { contains: search, mode: 'insensitive' };
      }

      if (statusFilter === 'processed') {
        return { ...base, processingResults: { some: {} } };
      }
      if (statusFilter === 'unprocessed') {
        return { ...base, processingResults: { none: {} } };
      }
      return base;
    };

    const whereClause = buildWhereClause();

    // Build orderBy clause
    const buildOrderBy = () => {
      if (sortField === 'title') {
        return [{ title: sortDirection ?? ('asc' as const) }];
      }
      if (sortField === 'documentDate') {
        return [{ documentDate: sortDirection ?? ('desc' as const) }];
      }
      return [{ documentDate: 'desc' as const }, { importedAt: 'desc' as const }];
    };

    const orderBy = buildOrderBy();

    // Get total count (with filter applied)
    const total = await prisma.paperlessDocument.count({
      where: whereClause,
    });

    // Get paginated documents
    const documents = await prisma.paperlessDocument.findMany({
      where: whereClause,
      orderBy,
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

    return NextResponse.json({
      items,
      ...getPaginationMeta(total, page, limit),
    });
  },
  { errorLogPrefix: 'List documents' }
);
