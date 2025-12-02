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

// Register schemas
registry.register('PaperlessInstanceListItem', PaperlessInstanceListItemSchema);
registry.register('PaperlessInstanceListResponse', PaperlessInstanceListResponseSchema);
registry.register('CreatePaperlessInstanceRequest', CreatePaperlessInstanceRequestSchema);
registry.register('UpdatePaperlessInstanceRequest', UpdatePaperlessInstanceRequestSchema);

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
