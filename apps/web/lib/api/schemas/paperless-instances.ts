import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { registerCrudPaths, createNameSchema, createOptionalNameSchema } from './crud-helpers';
import { CommonErrorResponses } from './common';

extendZodWithOpenApi(z);

// PaperlessInstance in list (apiToken always masked)
export const PaperlessInstanceListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    apiUrl: z.string(),
    apiToken: z.string(), // Always "***" in responses
    importFilterTags: z.array(z.number()).default([]),
    // Auto-processing configuration
    autoProcessEnabled: z.boolean().default(false),
    scanCronExpression: z.string().default('0 * * * *'),
    defaultAiBotId: z.string().nullable().default(null),
    lastScanAt: z.iso.datetime().nullable().default(null),
    nextScanAt: z.iso.datetime().nullable().default(null),
    // Auto-apply settings
    autoApplyTitle: z.boolean().default(false),
    autoApplyCorrespondent: z.boolean().default(false),
    autoApplyDocumentType: z.boolean().default(false),
    autoApplyTags: z.boolean().default(false),
    autoApplyDate: z.boolean().default(false),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi('PaperlessInstanceListItem');

// Create PaperlessInstance request
export const CreatePaperlessInstanceRequestSchema = z
  .object({
    name: createNameSchema(),
    apiUrl: z.url('Invalid URL format'),
    apiToken: z.string().min(1, 'API token is required'),
  })
  .openapi('CreatePaperlessInstanceRequest');

// Cron expression validation helper
const cronExpressionSchema = z
  .string()
  .min(9) // Minimum valid cron: "* * * * *"
  .refine(
    (value) => {
      // Basic cron validation: 5 or 6 space-separated fields
      const parts = value.trim().split(/\s+/);
      return parts.length >= 5 && parts.length <= 6;
    },
    { message: 'Invalid cron expression format' }
  );

// Update PaperlessInstance request (partial)
export const UpdatePaperlessInstanceRequestSchema = z
  .object({
    name: createOptionalNameSchema(),
    apiUrl: z.url('Invalid URL format').optional(),
    apiToken: z.string().min(1).optional(), // If empty, keep existing
    importFilterTags: z.array(z.number()).optional(),
    // Auto-processing configuration
    autoProcessEnabled: z.boolean().optional(),
    scanCronExpression: cronExpressionSchema.optional(),
    defaultAiBotId: z.string().nullable().optional(),
    // Auto-apply settings
    autoApplyTitle: z.boolean().optional(),
    autoApplyCorrespondent: z.boolean().optional(),
    autoApplyDocumentType: z.boolean().optional(),
    autoApplyTags: z.boolean().optional(),
    autoApplyDate: z.boolean().optional(),
  })
  .openapi('UpdatePaperlessInstanceRequest');

// Import documents response
export const ImportDocumentsResponseSchema = z
  .object({
    imported: z.number(),
    updated: z.number(),
    unchanged: z.number(),
    total: z.number(),
  })
  .openapi('ImportDocumentsResponse');

// PaperlessInstance stats response
export const PaperlessInstanceStatsResponseSchema = z
  .object({
    documents: z.number(),
    processingQueue: z.number(),
  })
  .openapi('PaperlessInstanceStatsResponse');

// Paperless tag item
export const PaperlessTagSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    documentCount: z.number(),
  })
  .openapi('PaperlessTag');

// Paperless tags list response
export const PaperlessTagsResponseSchema = z
  .object({
    tags: z.array(PaperlessTagSchema),
  })
  .openapi('PaperlessTagsResponse');

// Register schemas
registry.register('PaperlessInstanceListItem', PaperlessInstanceListItemSchema);
registry.register('CreatePaperlessInstanceRequest', CreatePaperlessInstanceRequestSchema);
registry.register('UpdatePaperlessInstanceRequest', UpdatePaperlessInstanceRequestSchema);
registry.register('ImportDocumentsResponse', ImportDocumentsResponseSchema);
registry.register('PaperlessInstanceStatsResponse', PaperlessInstanceStatsResponseSchema);
registry.register('PaperlessTag', PaperlessTagSchema);
registry.register('PaperlessTagsResponse', PaperlessTagsResponseSchema);

// Register all CRUD paths using helper
registerCrudPaths({
  resourceName: 'PaperlessInstance',
  resourcePath: '/paperless-instances',
  tag: 'PaperlessInstances',
  listItemSchema: PaperlessInstanceListItemSchema,
  createRequestSchema: CreatePaperlessInstanceRequestSchema,
  updateRequestSchema: UpdatePaperlessInstanceRequestSchema,
});

// Register import path
registry.registerPath({
  method: 'post',
  path: '/paperless-instances/{id}/import',
  tags: ['PaperlessInstances'],
  summary: 'Import documents from Paperless instance',
  description: 'Imports the first 10 documents from the specified Paperless instance',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Documents imported successfully',
      content: {
        'application/json': {
          schema: ImportDocumentsResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
    500: CommonErrorResponses[500],
  },
});

// Register stats endpoint manually (not part of CRUD)
registry.registerPath({
  method: 'get',
  path: '/paperless-instances/{id}/stats',
  summary: 'Get document statistics for a PaperlessInstance (Admin only)',
  tags: ['PaperlessInstances'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Instance statistics',
      content: {
        'application/json': {
          schema: PaperlessInstanceStatsResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
  },
});

// Register tags endpoint to fetch available tags from Paperless instance
registry.registerPath({
  method: 'get',
  path: '/paperless-instances/{id}/tags',
  summary: 'Get available tags from Paperless instance',
  tags: ['PaperlessInstances'],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'List of available tags',
      content: {
        'application/json': {
          schema: PaperlessTagsResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    403: CommonErrorResponses[403],
    404: CommonErrorResponses[404],
    500: CommonErrorResponses[500],
  },
});
