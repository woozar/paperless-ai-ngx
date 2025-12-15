import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { authRoute } from '@/lib/api/route-wrapper';
import { AddToQueueRequestSchema } from '@/lib/api/schemas/processing-queue';
import { QueueStatus } from '@/lib/scheduler';
import { formatQueueItem } from './format-queue-item';
import { validateQueueInstanceAccess } from './queue-helpers';

// GET /api/paperless-instances/[id]/queue - List queue items
export const GET = authRoute<never, { id: string }>(
  async ({ user, params, request }) => {
    const { errorResponse } = await validateQueueInstanceAccess(params.id, user.userId);
    if (errorResponse) return errorResponse;

    // Parse query params
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = Math.max(1, Number.parseInt(url.searchParams.get('page') ?? '1', 10));
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(url.searchParams.get('limit') ?? '20', 10))
    );
    const skip = (page - 1) * limit;

    // Build where clause
    const where: { paperlessInstanceId: string; status?: string } = {
      paperlessInstanceId: params.id,
    };
    if (status && ['pending', 'processing', 'completed', 'failed'].includes(status)) {
      where.status = status;
    }

    // Fetch items and stats in parallel
    const [items, total, stats] = await Promise.all([
      prisma.processingQueue.findMany({
        where,
        include: {
          document: { select: { title: true } },
          aiBot: { select: { name: true } },
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.processingQueue.count({ where }),
      Promise.all([
        prisma.processingQueue.count({
          where: { paperlessInstanceId: params.id, status: QueueStatus.PENDING },
        }),
        prisma.processingQueue.count({
          where: { paperlessInstanceId: params.id, status: QueueStatus.PROCESSING },
        }),
        prisma.processingQueue.count({
          where: { paperlessInstanceId: params.id, status: QueueStatus.COMPLETED },
        }),
        prisma.processingQueue.count({
          where: { paperlessInstanceId: params.id, status: QueueStatus.FAILED },
        }),
      ]).then(([pending, processing, completed, failed]) => ({
        pending,
        processing,
        completed,
        failed,
      })),
    ]);

    return NextResponse.json({
      items: items.map(formatQueueItem),
      stats,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  },
  { errorLogPrefix: 'List queue items' }
);

// POST /api/paperless-instances/[id]/queue - Add document to queue
export const POST = authRoute<typeof AddToQueueRequestSchema, { id: string }>(
  async ({ user, params, body }) => {
    const { instance, errorResponse } = await validateQueueInstanceAccess(params.id, user.userId);
    if (errorResponse) return errorResponse;

    const { paperlessDocumentId, aiBotId, priority } = body;

    // Check if document already in queue (pending or processing)
    const existing = await prisma.processingQueue.findFirst({
      where: {
        paperlessInstanceId: params.id,
        paperlessDocumentId,
        status: { in: [QueueStatus.PENDING, QueueStatus.PROCESSING] },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: 'documentAlreadyInQueue',
          message: 'documentAlreadyInQueue',
        },
        { status: 409 }
      );
    }

    // Find local document if exists
    const localDoc = await prisma.paperlessDocument.findUnique({
      where: {
        paperlessInstanceId_paperlessId: {
          paperlessInstanceId: params.id,
          paperlessId: paperlessDocumentId,
        },
      },
    });

    // Determine AI bot to use
    const botId = aiBotId ?? instance.defaultAiBotId;
    if (!botId) {
      return NextResponse.json(
        {
          error: 'noAiBotConfigured',
          message: 'noAiBotConfigured',
        },
        { status: 400 }
      );
    }

    // Create queue item
    const queueItem = await prisma.processingQueue.create({
      data: {
        paperlessDocumentId,
        paperlessInstanceId: params.id,
        documentId: localDoc?.id,
        aiBotId: botId,
        priority,
        status: QueueStatus.PENDING,
      },
      include: {
        document: { select: { title: true } },
        aiBot: { select: { name: true } },
      },
    });

    return NextResponse.json(formatQueueItem(queueItem), { status: 201 });
  },
  {
    bodySchema: AddToQueueRequestSchema,
    errorLogPrefix: 'Add to queue',
  }
);
