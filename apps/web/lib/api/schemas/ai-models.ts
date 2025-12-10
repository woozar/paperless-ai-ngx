import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { registerCrudPaths, createNameSchema, createOptionalNameSchema } from './crud-helpers';

extendZodWithOpenApi(z);

// AiModel in list (with account relation)
export const AiModelListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    modelIdentifier: z.string(),
    inputTokenPrice: z.number().nullable(),
    outputTokenPrice: z.number().nullable(),
    isActive: z.boolean(),
    aiAccountId: z.string(),
    aiAccount: z.object({
      id: z.string(),
      name: z.string(),
      provider: z.string(),
    }),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi('AiModelListItem');

// Create AiModel request
export const CreateAiModelRequestSchema = z
  .object({
    name: createNameSchema(),
    modelIdentifier: z.string().min(1, 'Model identifier is required'),
    aiAccountId: z.string().min(1, 'AI Account is required'),
    inputTokenPrice: z.number().positive().nullable().optional(),
    outputTokenPrice: z.number().positive().nullable().optional(),
  })
  .openapi('CreateAiModelRequest');

// Update AiModel request (partial)
export const UpdateAiModelRequestSchema = z
  .object({
    name: createOptionalNameSchema(),
    modelIdentifier: z.string().min(1).optional(),
    aiAccountId: z.string().min(1).optional(),
    inputTokenPrice: z.number().positive().nullable().optional(),
    outputTokenPrice: z.number().positive().nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .openapi('UpdateAiModelRequest');

// Register schemas
registry.register('AiModelListItem', AiModelListItemSchema);
registry.register('CreateAiModelRequest', CreateAiModelRequestSchema);
registry.register('UpdateAiModelRequest', UpdateAiModelRequestSchema);

// Register all CRUD paths using helper
registerCrudPaths({
  resourceName: 'AiModel',
  resourcePath: '/ai-models',
  tag: 'AiModels',
  listItemSchema: AiModelListItemSchema,
  createRequestSchema: CreateAiModelRequestSchema,
  updateRequestSchema: UpdateAiModelRequestSchema,
});
