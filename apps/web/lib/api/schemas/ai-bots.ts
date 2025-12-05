import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { registerCrudPaths, createNameSchema, createOptionalNameSchema } from './crud-helpers';

extendZodWithOpenApi(z);

// AiBot in list (with provider relation)
export const AiBotListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    systemPrompt: z.string(),
    aiProviderId: z.string(),
    aiProvider: z.object({
      id: z.string(),
      name: z.string(),
    }),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi('AiBotListItem');

// Create AiBot request
export const CreateAiBotRequestSchema = z
  .object({
    name: createNameSchema(),
    aiProviderId: z.string().min(1, 'AI Provider is required'),
    systemPrompt: z.string().min(1, 'System prompt is required'),
  })
  .openapi('CreateAiBotRequest');

// Update AiBot request (partial)
export const UpdateAiBotRequestSchema = z
  .object({
    name: createOptionalNameSchema(),
    aiProviderId: z.string().min(1).optional(),
    systemPrompt: z.string().min(1).optional(),
  })
  .openapi('UpdateAiBotRequest');

// Register schemas
registry.register('AiBotListItem', AiBotListItemSchema);
registry.register('CreateAiBotRequest', CreateAiBotRequestSchema);
registry.register('UpdateAiBotRequest', UpdateAiBotRequestSchema);

// Register all CRUD paths using helper
registerCrudPaths({
  resourceName: 'AiBot',
  resourcePath: '/ai-bots',
  tag: 'AiBots',
  listItemSchema: AiBotListItemSchema,
  createRequestSchema: CreateAiBotRequestSchema,
  updateRequestSchema: UpdateAiBotRequestSchema,
  deleteReturnsSuccess: true, // AiBots DELETE returns 200 with success object
});
