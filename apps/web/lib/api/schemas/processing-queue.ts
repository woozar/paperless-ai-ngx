import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { CommonErrorResponses } from './common';

extendZodWithOpenApi(z);

// Queue status enum
export const QueueStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed']);

// Queue item in list
export const ProcessingQueueItemSchema = z
  .object({
    id: z.string(),
    paperlessDocumentId: z.number(),
    status: QueueStatusSchema,
    priority: z.number(),
    attempts: z.number(),
    maxAttempts: z.number(),
    lastError: z.string().nullable(),
    scheduledFor: z.iso.datetime(),
    startedAt: z.iso.datetime().nullable(),
    completedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    documentId: z.string().nullable(),
    documentTitle: z.string().nullable(),
    aiBotId: z.string().nullable(),
    aiBotName: z.string().nullable(),
  })
  .openapi('ProcessingQueueItem');

// Queue stats
export const QueueStatsSchema = z
  .object({
    pending: z.number(),
    processing: z.number(),
    completed: z.number(),
    failed: z.number(),
  })
  .openapi('QueueStats');

// Queue list response
export const ProcessingQueueListResponseSchema = z
  .object({
    items: z.array(ProcessingQueueItemSchema),
    stats: QueueStatsSchema,
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  })
  .openapi('ProcessingQueueListResponse');

// Add to queue request
export const AddToQueueRequestSchema = z
  .object({
    paperlessDocumentId: z.number(),
    aiBotId: z.string().optional(),
    priority: z.number().int().min(0).max(100).default(10), // Manual adds get higher priority
  })
  .openapi('AddToQueueRequest');

// Bulk retry response
export const BulkRetryResponseSchema = z
  .object({
    retriedCount: z.number(),
  })
  .openapi('BulkRetryResponse');

// Register schemas
registry.register('ProcessingQueueItem', ProcessingQueueItemSchema);
registry.register('QueueStats', QueueStatsSchema);
registry.register('ProcessingQueueListResponse', ProcessingQueueListResponseSchema);
registry.register('AddToQueueRequest', AddToQueueRequestSchema);
registry.register('BulkRetryResponse', BulkRetryResponseSchema);

// Register queue list path
registry.registerPath({
  method: 'get',
  path: '/paperless-instances/{id}/queue',
  tags: ['ProcessingQueue'],
  summary: 'List queue items for a Paperless instance',
  request: {
    params: z.object({
      id: z.string(),
    }),
    query: z.object({
      status: QueueStatusSchema.optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
    }),
  },
  responses: {
    200: {
      description: 'Queue items list',
      content: {
        'application/json': {
          schema: ProcessingQueueListResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    404: CommonErrorResponses[404],
  },
});

// Register add to queue path
registry.registerPath({
  method: 'post',
  path: '/paperless-instances/{id}/queue',
  tags: ['ProcessingQueue'],
  summary: 'Add document to processing queue',
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: AddToQueueRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Document added to queue',
      content: {
        'application/json': {
          schema: ProcessingQueueItemSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    404: CommonErrorResponses[404],
    409: CommonErrorResponses[409],
  },
});

// Register delete queue item path
registry.registerPath({
  method: 'delete',
  path: '/paperless-instances/{id}/queue/{queueId}',
  tags: ['ProcessingQueue'],
  summary: 'Remove item from queue',
  request: {
    params: z.object({
      id: z.string(),
      queueId: z.string(),
    }),
  },
  responses: {
    204: {
      description: 'Item removed from queue',
    },
    401: CommonErrorResponses[401],
    404: CommonErrorResponses[404],
  },
});

// Register retry queue item path
registry.registerPath({
  method: 'post',
  path: '/paperless-instances/{id}/queue/{queueId}/retry',
  tags: ['ProcessingQueue'],
  summary: 'Retry a failed queue item',
  request: {
    params: z.object({
      id: z.string(),
      queueId: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Item scheduled for retry',
      content: {
        'application/json': {
          schema: ProcessingQueueItemSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    404: CommonErrorResponses[404],
  },
});

// Register bulk retry path
registry.registerPath({
  method: 'post',
  path: '/paperless-instances/{id}/queue/bulk/retry',
  tags: ['ProcessingQueue'],
  summary: 'Retry all failed queue items',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Items scheduled for retry',
      content: {
        'application/json': {
          schema: BulkRetryResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    404: CommonErrorResponses[404],
  },
});

// Register bulk delete completed path
registry.registerPath({
  method: 'delete',
  path: '/paperless-instances/{id}/queue/bulk/completed',
  tags: ['ProcessingQueue'],
  summary: 'Delete all completed queue items',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Completed items deleted',
      content: {
        'application/json': {
          schema: z.object({ deletedCount: z.number() }),
        },
      },
    },
    401: CommonErrorResponses[401],
    404: CommonErrorResponses[404],
  },
});
