import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { registerCrudPaths, createNameSchema, createOptionalNameSchema } from './crud-helpers';

extendZodWithOpenApi(z);

// PaperlessInstance in list (apiToken always masked)
export const PaperlessInstanceListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    apiUrl: z.string(),
    apiToken: z.string(), // Always "***" in responses
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi('PaperlessInstanceListItem');

// PaperlessInstance list response
export const PaperlessInstanceListResponseSchema = z
  .object({
    instances: z.array(PaperlessInstanceListItemSchema),
    total: z.number(),
  })
  .openapi('PaperlessInstanceListResponse');

// Create PaperlessInstance request
export const CreatePaperlessInstanceRequestSchema = z
  .object({
    name: createNameSchema(),
    apiUrl: z.url('Invalid URL format'),
    apiToken: z.string().min(1, 'API token is required'),
  })
  .openapi('CreatePaperlessInstanceRequest');

// Update PaperlessInstance request (partial)
export const UpdatePaperlessInstanceRequestSchema = z
  .object({
    name: createOptionalNameSchema(),
    apiUrl: z.url('Invalid URL format').optional(),
    apiToken: z.string().min(1).optional(), // If empty, keep existing
  })
  .openapi('UpdatePaperlessInstanceRequest');

// Import documents response
export const ImportDocumentsResponseSchema = z
  .object({
    imported: z.number(),
    total: z.number(),
  })
  .openapi('ImportDocumentsResponse');

// Register schemas
registry.register('PaperlessInstanceListItem', PaperlessInstanceListItemSchema);
registry.register('PaperlessInstanceListResponse', PaperlessInstanceListResponseSchema);
registry.register('CreatePaperlessInstanceRequest', CreatePaperlessInstanceRequestSchema);
registry.register('UpdatePaperlessInstanceRequest', UpdatePaperlessInstanceRequestSchema);
registry.register('ImportDocumentsResponse', ImportDocumentsResponseSchema);

// Register all CRUD paths using helper
registerCrudPaths({
  resourceName: 'PaperlessInstance',
  resourcePath: '/paperless-instances',
  tag: 'PaperlessInstances',
  listItemSchema: PaperlessInstanceListItemSchema,
  listResponseSchema: PaperlessInstanceListResponseSchema,
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
    401: {
      description: 'Unauthorized',
    },
    403: {
      description: 'Forbidden - Admin role required',
    },
    404: {
      description: 'PaperlessInstance not found',
    },
    500: {
      description: 'Server error',
    },
  },
});
